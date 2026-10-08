# 08 — Guest pre-join page & live-media states (captured in real Chrome, camera + mic granted)

Captured 2026-10-07 from `https://app.zoom.us/wc/{number}/join` as a **signed-out guest** (Chrome window viewport 1512×827; the layout is centered, so sizes hold at 1366×768 — only the x/y offsets differ). Screenshots: `docs/reference/screens/18-prejoin-guest-dark.jpg` (before the camera was granted; the camera-on screenshot isn't saved because it shows the user's room).

## Corrections to PRD.md
| PRD section | PRD says | Measured |
|---|---|---|
| §7.5 Pre-join | Light page, white bg, header with Zoom logo, 640×360 preview, 280px form, "Your Name" first | **Dark page** bg `#1D1E20`, **no header**; 700×394 preview card; 392px form; title "**Enter Meeting Info**"; **Meeting Passcode** field first (only when the link has no pwd), then **Your Name** |
| §5.2.3 `--mr-speaking` | `#23D959` [D] | `#23D959` confirmed [M] — it's the mic audio-level color in the web client |
| icons `mtg-mic-on.svg`, `mtg-video-on.svg` | hand-drawn approximations | replaced with the **real** Zoom SVGs (24×24, `currentColor`) |

## Page structure [M]
```
div.preview-root.preview-root--dark            full viewport, bg #1D1E20, font = app stack
├─ div.preview-video.preview-video-resizable  700×394, bg #313235, radius 14, overflow hidden   (x=190,y=200 @1512 wide)
│   ├─ <video> (mirrored self view, object-fit: cover)  — or, camera off: avatar placeholder
│   │     placeholder = rounded square 171×147, radius ~24, bg #4A4B4E, white person glyph #2C2D30 (see screenshot 18)
│   ├─ div.preview-video__control                 176×52, bg #040506, radius 10, centered horizontally, 13px above the card bottom
│   │   ├─ button.preview-video__control-button[aria-label="Mute"|"Unmute"]           88×52, bg #040506, radius 10
│   │   │    icon 24×24 (mtg-mic-on.svg / mtg-mic-muted.svg) at top 8; label 12px/15px 400 #F7F9FA at top 31
│   │   │    button.preview__toggle[aria-label="More audio controls"] 24×24, radius 8, caret-up 12px, at top-right (x+62, y+2)
│   │   └─ button.preview-video__control-button[aria-label="Stop Video"|"Start Video"] 88×52 (same layout)
│   │        button.preview__toggle[aria-label="More video controls"]
│   └─ button.preview-video__bg-button[aria-label="Backgrounds"]  118×30, bg #040506, radius 8, padding 7px 12px,
│        bottom-right of the card (10px inset); 16px icon + "Backgrounds" 12px/15px rgba(255,255,255,.8)
└─ div.preview-meeting-info                      392 wide, starts 13px below card top, 40px right of the card
    ├─ div.preview-meeting-info__title          "Enter Meeting Info" 24px/36px **700** #FFF, centered
    ├─ label.preview-meeting-info__field-title  "Meeting Passcode" 14px/20px **510** #FFF, 5px above input   (only if passcode needed)
    ├─ input (passcode)                         392×40, bg transparent, border 2px solid #555B62, radius 10, padding 0 18px, 14px #FFF
    ├─ label "Your Name"                        same as above, 12px gap after previous input
    ├─ input (name)                             392×40 (same style), prefilled with the remembered name
    ├─ div.zm-checkbox.preview-remember-name    264×20, 12px below input: 16px checkbox (checked: bg #0E72ED / white check, radius 3)
    │     + "Remember my name for future meetings" 13px/19.5px #FFF, 4px gap
    ├─ button "Join"                            400×40 (extends 4px past the inputs on both sides), radius 10, 16px **700**
    │     disabled: bg rgba(255,255,255,.06), text #ADB1B8   ·  enabled [D]: bg #0E72ED, text #FFF, hover #0C60C8
    ├─ div.preview-agreement                    14px/21px #939BA4, 16px below Join:
    │     'By clicking "Join", you agree to our Terms of Service and Privacy Statement.'  links 14px **500** #1890FF
    └─ div.recaptcha_tos                        14px/16px #939BA4, 16px below:
          "Zoom is protected by reCAPTCHA and their Privacy Policy and Terms of Service apply."  (links #1890FF)
footer (bottom 18px, centered): "© 2026 Zoom Communications, Inc. All rights reserved. Privacy & Legal Policies | Send Report"
    12px/18px #939BA4; links underlined.
```
Vertical rhythm: card top 200 → title 213 → passcode label 249 → input 274 → name label 326 → input 351 → checkbox 403 → Join 434 → agreement 490 → recaptcha 548 (when the passcode row is absent everything shifts up by 77px and the whole block stays vertically centered with the card).

## Behaviour [M/D]
- While devices initialise, the two control icons show a spinner (24px ring, white 2px stroke) [M, screenshot 18].
- Device permission denied → the icon gets the red warning-triangle overlay (`#FF0055`, see `mtg-*` icons with triangle in the room spec) and the label stays "Mute"/"Stop Video" [M].
- Mic live: the mic glyph has an **audio-level meter** (below). Camera live: the preview shows the mirrored self view filling the card.
- Join is enabled when the name is non-empty and (if shown) the passcode is non-empty [D]. Enter in either input submits [D].
- Caret toggles open device menus (microphone / speaker / camera lists) — same dark menu style as in the room.

## Audio-level meter (also used on the in-meeting toolbar mic) [M]
```
div.audio-voip-active-icon (24×24, position relative)
├─ svg (mic outline, white)
└─ div.voip-icon-inner     position:absolute; left 8px; top 1px; width 8px; height 15px; border-radius 5px; overflow hidden
    └─ div.audio-level-indicator  position:absolute; bottom 0; width 8px; height: <level × 100%>;
                                   background #23D959; transition: height .1s linear
```
Implementation: AnalyserNode RMS → height % (0–100), updated every animation frame, clamped; set to 0 when muted (then show the muted icon instead).

## Icons saved
- `docs/reference/icons/mtg-mic-on.svg` — real Zoom mic (unmuted) 24×24
- `docs/reference/icons/mtg-video-on.svg` — real Zoom camera (video on) 24×24

---

# Attendee (guest) in-meeting states — captured live as "Chrome Guest" with mic + camera granted

Viewport 1512×771 (full-viewport web client, **no Workplace shell** for guests). Screenshots: `19-meeting-attendee-speaker-view.jpg`, `20-meeting-view-menu.jpg`, `21-meeting-gallery-2.jpg`, `22-meeting-attendee-participants.jpg`, `23-meeting-attendee-leave.jpg`.

## Corrections to PRD.md
| PRD section | PRD says | Measured |
|---|---|---|
| §8.4 Video label | "Stop Video"/"Start Video" | Toolbar label is always **"Video"**; only the aria-label changes ("stop my video" / "start my video") and the icon (`mtg-video-on.svg` / `mtg-video-off.svg`). The **pre-join** buttons do use "Stop Video"/"Start Video". |
| §8.4 Audio label | Mute/Unmute | ✔ "Mute" (aria "mute my microphone") / "Unmute" (aria "unmute my microphone") |
| §8.4 attendee toolbar | Same as host minus Host tools | Attendee toolbar = **Mute · Video** (left) · **Participants · Chat · React · Share · More** (center) · **Leave** (right, icon `mtg-leave.svg` — red door + white walking figure). No Host tools. |
| §8.2 default view | Gallery when N ≥ 2 | Default for a joining guest is **Speaker view**: active speaker large (1072×603 at 1512 wide, centered), other participants as a **filmstrip of 207×117 thumbnails centered above** it (top ≈ 50px). |
| §8.2 gallery gap | 4px | **0px** — tiles abut (2 tiles: 696×392 each at x=60 and x=756; with a 400px side panel open they shrink to 496×279). Tiles stay 16:9 and the group is centered both ways. |
| §8.2 avatar-mode name size | clamp(…, tileWidth/15, 82px) | ✔ confirmed: 696px tile → 46.4px (= width/15) |
| §8.5 participant labels | "(Host, me)" | Guest sees **"Chrome Guest(Me)"** and **"A B(Host)"** — label appended with no space; host sees "(Host, me)" |
| §5.4 avatar palette (meeting client) | PWA palette | The meeting client uses a different palette: e.g. `#D35400` (orange), `#8E44AD` (purple) for participant avatars (32×32, radius 10). |
| §8.10 attendee Leave popover | — | 248×72, single **Leave Meeting** button 216×32 bg `#DE2828`; footer shows "☐ Give feedback" + **Cancel** (70×32, bg `rgba(255,255,255,.04)`, text `#F5F5F5` 14px, radius 8). |

## View menu (header "View" button) [M]
Box 244×247 at the top-right under the button, bg `rgba(0,0,0,.99)`, border 1px `rgba(255,255,255,.12)`, radius 8, padding `8px 0`.
Items (25px tall, 13px/18.57px 400, `rgba(255,255,255,.8)`, padding `3px 20px 3px 28px`; checked item shows ✓ in the 28px gutter and bg `#2B2B2B`; right-aligned 12px layout icons):
`Speaker View` · `Gallery View` · `Multi-speaker View` — divider — `Sort Gallery By ›` — divider — `Hide Self View` · `Hide Non-video Participants` — divider — `Fullscreen`.
Clone scope: Speaker View, Gallery View, Hide Self View, Fullscreen (others static).

## Participants panel — attendee [M]
- Title "Participants (2)"; rows 42px (inner layout 32px), avatar 32 radius 10, name 14px `#FFF`; row icons: mic (red slash when muted), camera (grey outline when on / red slash when off), "…".
- Order: **me first**, then host.
- Footer pills (h30, radius 20, bg `#2A2B2D`): **Invite** · **Unmute** (attendee's own unmute; reads "Mute" when unmuted). No "Mute All", no "More".

## More menu — attendee [M]
Tiles: Show Captions · Whiteboards · Settings · Stop Incoming Video (+ "Reset to default | Reset" footer). No Host tools tile.

## After leaving (guest) [M]
Clicking **Leave Meeting** as a signed-out guest returns the tab to `https://app.zoom.us/wc` — the signed-out Workplace landing page ("zoom / Workplace" wordmark, **Sign In** (primary 432×48, radius 12, `#0D6BDE`), **Sign Up** and **Join Meeting** (outline: white bg, 1px `#939BA4`, radius 12, 16px/500 `#2A2B2D`), "Download the Zoom app" card top-right (bg `#F2F8FF`, radius 10), footer "About Zoom · 🌐 English ⌃"). For our clone (no auth), a guest who leaves goes to `/wc/{number}/left` ("You have left the meeting."), and an internal user goes back to `/wc/home`.
