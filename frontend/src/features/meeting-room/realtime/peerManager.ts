/**
 * WebRTC mesh (PRD §9.1): one RTCPeerConnection per remote participant. The
 * newcomer sends the offers; existing participants answer (no glare). Every
 * connection carries one audio and one video transceiver from the start, so
 * mute / video toggles and device switches only `replaceTrack` — never renegotiate.
 * A connection that fails is re-offered by its initiator (at most twice).
 */
import { logger, warnOnFailure } from "@/shared/lib/logger";
import type { MediaKind } from "@/shared/media";
import type { ClientMessage } from "@/shared/types/realtime";

export interface PeerCallbacks {
  send: (message: ClientMessage) => void;
  onRemoteStream: (peerId: number, stream: MediaStream) => void;
  onConnectionState: (peerId: number, state: RTCPeerConnectionState) => void;
}

interface Peer {
  pc: RTCPeerConnection;
  stream: MediaStream;
  pendingIce: RTCIceCandidateInit[];
  /** we sent the offer, so we are the side that retries */
  initiator: boolean;
  retries: number;
}

const KINDS: readonly MediaKind[] = ["audio", "video"];
const MAX_RETRIES = 2;

const transceiverKind = (transceiver: RTCRtpTransceiver) => transceiver.receiver.track.kind as MediaKind;

export class PeerManager {
  private readonly peers = new Map<number, Peer>();
  private readonly tracks: Record<MediaKind, MediaStreamTrack | null> = { audio: null, video: null };

  constructor(
    private readonly iceServers: RTCIceServer[],
    private readonly callbacks: PeerCallbacks,
  ) {}

  /** Swaps the outgoing microphone/camera track on every connection (null = send nothing). */
  setLocalTrack(kind: MediaKind, track: MediaStreamTrack | null): void {
    if (this.tracks[kind] === track) return;
    this.tracks[kind] = track;
    for (const [peerId, { pc }] of this.peers) {
      for (const transceiver of pc.getTransceivers()) {
        if (transceiverKind(transceiver) !== kind) continue;
        void transceiver.sender.replaceTrack(track).catch(warnOnFailure(`webrtc: ${kind} track swap for ${peerId} failed`));
      }
    }
  }

  /** Newcomer side: open a connection to an existing participant and send the offer. */
  async connectTo(peerId: number, retries = 0): Promise<void> {
    const { pc } = this.createPeer(peerId, true, retries);
    for (const kind of KINDS) pc.addTransceiver(this.tracks[kind] ?? kind, { direction: "sendrecv" });
    await pc.setLocalDescription(await pc.createOffer());
    if (pc.localDescription) this.callbacks.send({ type: "offer", to: peerId, sdp: pc.localDescription.sdp });
  }

  /** Existing-participant side: answer a newcomer's offer with our tracks attached. */
  async handleOffer(from: number, sdp: string): Promise<void> {
    const peer = this.createPeer(from, false, 0);
    await peer.pc.setRemoteDescription({ type: "offer", sdp });
    for (const transceiver of peer.pc.getTransceivers()) {
      transceiver.direction = "sendrecv";
      await transceiver.sender.replaceTrack(this.tracks[transceiverKind(transceiver)]);
    }
    await peer.pc.setLocalDescription(await peer.pc.createAnswer());
    await this.flushIce(from, peer);
    if (peer.pc.localDescription) this.callbacks.send({ type: "answer", to: from, sdp: peer.pc.localDescription.sdp });
  }

  async handleAnswer(from: number, sdp: string): Promise<void> {
    const peer = this.peers.get(from);
    if (!peer || peer.pc.signalingState !== "have-local-offer") return;
    await peer.pc.setRemoteDescription({ type: "answer", sdp });
    await this.flushIce(from, peer);
  }

  async handleIce(from: number, candidate: RTCIceCandidateInit | null): Promise<void> {
    const peer = this.peers.get(from);
    if (!peer || !candidate) return;
    if (!peer.pc.remoteDescription) {
      peer.pendingIce.push(candidate);
      return;
    }
    await peer.pc.addIceCandidate(candidate).catch(warnOnFailure(`webrtc: ICE candidate of ${from} rejected`));
  }

  connection(peerId: number): RTCPeerConnection | undefined {
    return this.peers.get(peerId)?.pc;
  }

  closePeer(peerId: number): void {
    const peer = this.peers.get(peerId);
    if (!peer) return;
    this.peers.delete(peerId);
    peer.pc.ontrack = null;
    peer.pc.onicecandidate = null;
    peer.pc.onconnectionstatechange = null;
    peer.pc.close();
  }

  closeAll(): void {
    for (const peerId of [...this.peers.keys()]) this.closePeer(peerId);
  }

  private createPeer(peerId: number, initiator: boolean, retries: number): Peer {
    this.closePeer(peerId);
    const pc = new RTCPeerConnection({ iceServers: this.iceServers });
    const peer: Peer = { pc, stream: new MediaStream(), pendingIce: [], initiator, retries };
    this.peers.set(peerId, peer);
    pc.onicecandidate = (event) => {
      if (event.candidate) this.callbacks.send({ type: "ice", to: peerId, candidate: event.candidate.toJSON() });
    };
    pc.ontrack = (event) => {
      for (const old of peer.stream.getTracks()) if (old.kind === event.track.kind) peer.stream.removeTrack(old);
      peer.stream.addTrack(event.track);
      this.callbacks.onRemoteStream(peerId, peer.stream);
    };
    pc.onconnectionstatechange = () => {
      this.callbacks.onConnectionState(peerId, pc.connectionState);
      if (pc.connectionState === "failed") this.recover(peerId, peer);
    };
    return peer;
  }

  /** A failed connection is offered again by the side that offered it first. */
  private recover(peerId: number, peer: Peer): void {
    logger.warn(`webrtc: connection to participant ${peerId} failed (retry ${peer.retries}/${MAX_RETRIES})`);
    if (!peer.initiator || peer.retries >= MAX_RETRIES || this.peers.get(peerId) !== peer) return;
    void this.connectTo(peerId, peer.retries + 1).catch(warnOnFailure(`webrtc: re-offer to participant ${peerId} failed`));
  }

  private async flushIce(peerId: number, peer: Peer): Promise<void> {
    const pending = peer.pendingIce.splice(0);
    for (const candidate of pending) {
      await peer.pc.addIceCandidate(candidate).catch(warnOnFailure(`webrtc: queued ICE candidate of ${peerId} rejected`));
    }
  }
}
