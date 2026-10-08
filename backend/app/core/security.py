"""Signed participant tokens: ``itsdangerous``-signed ``participant_id:instance_id`` (PRD §9.1)."""

from dataclasses import dataclass

from itsdangerous import BadSignature, TimestampSigner


@dataclass(frozen=True)
class TokenClaims:
    participant_id: int
    instance_id: int


class ParticipantTokens:
    def __init__(self, secret_key: str, max_age_seconds: int) -> None:
        self._signer = TimestampSigner(secret_key, salt="participant-token")
        self._max_age = max_age_seconds

    def issue(self, participant_id: int, instance_id: int) -> str:
        return self._signer.sign(f"{participant_id}:{instance_id}").decode()

    def verify(self, token: str) -> TokenClaims | None:
        """Return the claims, or ``None`` when the token is malformed, tampered or expired."""
        try:
            value = self._signer.unsign(token, max_age=self._max_age).decode()
            participant_id, instance_id = (int(part) for part in value.split(":"))
        except (BadSignature, ValueError):
            return None
        return TokenClaims(participant_id=participant_id, instance_id=instance_id)
