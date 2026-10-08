# 05 — Meeting room (Zoom web meeting client) — exhaustive capture

Source: live instant meeting started from `app.zoom.us/wc/home` on 2026‑10‑07 (web client build **7.2.0 (12783.ufb8n9u)**), measured at a **1366×768** viewport. Inside the Workplace shell the meeting client is a same-origin iframe `iframe.pwa-webclient__iframe` at **x=80, y=68, 1280×694**; all coordinates below are **relative to that 1280×694 iframe** unless stated. The standalone (full-viewport) client was also measured (§16). Camera/mic permission was **denied** in the capture browser; granted states come from CSS/JS/i18n. A second participant ("Chrome Guest", camera+mic granted) joined from the user's Chrome for §15. Meeting was ended with **End Meeting for All** and both tabs returned to `/wc/home`.

Legend: **[M]** measured from DOM/computed style, **[C]** taken verbatim from Zoom's CSS (`styles.wc_meeting.min.css`), **[J]** from Zoom's JS/i18n bundle, **[D]** inferred.
Font for everything: `system-ui, "SF Pro", "Segoe UI", "Almaden Sans", Roboto, Ubuntu, Helvetica, Arial` [M].
Pre-join page (PRD §7.5) is specified in **`08-prejoin-and-live-media.md`** (captured live from the guest's Chrome); §17 below only adds CSS-derived states it lacks.

---

## 0. Corrections to PRD.md

| PRD § | PRD says | Measured / correct |
|---|---|---|
| 5.2.3 `--mr-speaking` | `#23D959` [D] 2px border | Active-speaker indicator is `box-shadow: inset 0 0 0 2px #48DD5D` on `.video-avatar__avatar` [C]; in gallery it is applied **only when there are > 2 participants** (`w.length>2`) [J]. Not shown with 1–2 people. |
| 5.2.3 `--mr-menu-bg` | More menu only | **All** dark dropdowns (View, Audio/Video/Participants/Share carets, More) use bg `rgba(0,0,0,.99)` (`#000000fc`), border 1px `rgba(255,255,255,.12)`, radius 8, shadow `0 8px 24px rgba(0,0,0,.3)`, padding `8px 0` [M]. |
| 5.2.3 | — | Additional room colors: encryption shield `#25E55F`; End/disallowed red `#FF0055` (`#F05`); permission warning `#FAAC2A`; participant row hover `#313235`; panel pill `#2A2B2D`; chat bubble `#292F37`; menu item hover `#2B2B2B`; toolbar button hover `rgba(110,118,128,.33)` (`#6E768054`). |
| 5.3 Motion | toolbar slide 200ms [D] | Header/toolbar: `transition: transform .2s ease-out`; hidden = `translateY(-48px)` / `translateY(52px)` [C]. Auto-hide after **3000 ms** idle; `mousemove` handler throttled to **1000 ms** [J]. **Ctrl+\\** toggles "always show meeting controls" [J]. |
| 8.2 1-participant tile | 1234×694, inset 23 | ✔ Speaker view: 1234×694 at x=23 (16:9 fitted to full 694 height; header/footer overlay it). **Gallery view** instead lays tiles out **between** header and footer: area 1280×594 at y=48 → 1 tile 1056×594 at x=112 [M]. |
| 8.2 gallery | gap 4px [D] | **Gap 0** (tiles touch); outer padding **60px** on all sides when ≥2 tiles, 0 for 1 tile [J/M]. 2 tiles at 1280 wide: **580×326** at x=60 and x=640, y=182 [M]. Grid chooser = Zoom's table of allowed rows×cols per count, pick the max tile area (algorithm in §3.4) [J]. |
| 8.2 name tag | 15px/22.5px | 15px/22.5px **only when viewport height ≤ 720px** (`@media (max-height:720px)`; the 694‑tall iframe matches). Otherwise **12px** (full-viewport client at 768 tall: 12px) [C/M]. Tag bottom animates (`transition: bottom .2s ease-out`) to sit just above the toolbar when the toolbar is visible [C/M]. For a video participant the leading icon is a **network-quality bars** icon (16px white) instead of the mic icon [M]. |
| 8.2 toasts | 3 s auto-dismiss, top-center 10px below header | Position ✔ (top **y=58** = 48+10; centered; `max-width:750px`; stacked with 10px gap) [C/M]. Default lifetime **5000 ms**; "You are host now." uses **3000 ms** [J]. **Text is "You are host now."** (no "the") [J/M]. Zoom web shows **no** "{name} joined/left" toast (only aria-live + roster change) [M/J]. |
| 8.3 header | View button → Speaker/Gallery/Fullscreen | View menu = **Speaker View, Gallery View, Multi-speaker View** │ **Sort Gallery By ›**, **Follow Host's Video Order** │ **Hide Self View**, **Hide Non-video Participants** │ **Fullscreen** (§4.4). Also present: **Zoom AI** (28×28 sparkle, disabled for this account) and **Switch to Zoom Workplace Client** (24×24) buttons. |
| 8.4 toolbar layout | center group centered | `footer__inner` uses `justify-content: space-between` with three sections; the middle group is **not** truly centered (at 1280: left 0–180, mid 426–948, right 1194–1280) [M]. |
| 8.4 hover/active | `rgba(255,255,255,.1)` / `.15` [D] | Hover / focus-visible `#6E768054` (rgba(110,118,128,.33)); active `rgba(255,255,255,.18)` label `rgba(255,255,255,.8)`; caret hover `rgba(255,255,255,.33)`; hovering a main button also tints its caret `#6E768054` [C]. No hover tooltips on toolbar buttons (aria-labels only) [M]. |
| 8.4 Audio button | "Mute"/"Unmute"/"Audio" | Labels [J]: **Join Audio** (headphones icon, before audio is joined — seen for ~1 s on entry), **Mute** / **Unmute** (joined), **Audio** + red warning badge (permission denied). Caret menu = "Select a Microphone" list, "Select a Speaker" list, "Microphone modes" (✓ Background noise suppression), **Test Speaker & Microphone**, **Leave computer audio**, **Audio Settings** (§5.2). |
| 8.4 Video caret | devices + "Video Settings…" | "Select a Camera" list │ **Blur my background** (switch) + **Choose Background...** │ **Video Settings...** (§5.3). |
| 8.4 Participants caret | Invite, Mute All | **Invite ...**, **Copy invite link** (→ tooltip "Invite link has been copied to clipboard" ~2 s), **Host tools for participants** (§5.4). |
| 8.4 Chat caret | "Chat settings" | Chat caret exists (aria "Chat Settings", contents not captured) [M]; Share caret = single item **Host tools for share** (opens Host tools › Share panel). |
| 8.4 Host tools | upward dark menu | Host tools is a **right-side panel** (same shell as Participants): Enable waiting room / Lock Meeting / Hide profile pictures switches, then **Participants ›** and **Advanced ›** drill-ins (§7). |
| 8.4 overflow | — | When the stage narrows (e.g. a side panel open → 880px), buttons that don't fit (e.g. Host tools) move into **More** [M]. Items chosen from More are **promoted** as a temporary toolbar button after a 1px vertical divider (one slot, latest wins) [M]. The mid group is **drag-sortable** (dnd-kit; "Reset to default" in More) [M]. |
| 8.5 panel header | 46px, title 500 | ✔ 46px; title 14px/21px **500** `#F7F9FA` centered [M]. Right icons (16px, `#DFE3E8`/`#CAD1D5`): **minimize** (only when two panels are stacked), **Pop Out**, **Close**, 8px apart [M]. |
| 8.5 participant row | h44, padding `6px 16px 6px 23px`; hover shows Mute / More ▾ pills | Row 390×44, padding **`6px 20px`**, radius 4 [M/C]. Avatar 32×32 r10, initials **16px/32px 400** [M]; self avatar `#8E44AD`, guest `#D35400` [M]. Right icons **always visible** (26×26 buttons, r6, pad 5, 16px icons, 4px gap): mic state, video state, "…" More options. **No Mute/More pills** in this build. Hover bg `#313235` [C]. Name label "(Host, me)" / "(Guest)" 14px/18px white [M]. |
| 8.5 row More menu | Chat, Rename, Make Host, Remove (red) | Other participant: **Chat · Stop Video │ Add Pin │ Make Host · Rename │ Allow to Multi-pin │ Put in Waiting Room · Remove · Report** — all `#F7F9FA`, none red [M]. Self: **Start Video │ Add Pin │ Rename** [M]. |
| 8.5 footer More | Ask All to Unmute, Mute upon Entry, Allow unmute, Lock | **Ask all to unmute**, **Mute all upon entry**, **Host tools for participants** [M]. Pills are spaced `space-around` [M]. |
| 8.11 Mute All modal | "All current and new participants will be muted" + Yes/No | Title **"Mute all current and new participants"** 20px/30px 700; checkbox ✓ **"Allow participants to unmute themselves"**; buttons **Cancel** / **Continue** (§8.3) [M]. |
| 8.5 chat | recipient "Everyone"; notice about "Everyone" | Default recipient is **"Meeting Group Chat"** (persistent meeting chat); notice: **Messages addressed to "Meeting Group Chat" will also appear in the meeting group chat in Team Chat** [M]. First open shows a "Continue the Conversation" coachmark (§10.2). |
| 8.5 send button | disabled `#333333` / `#6B7280`, enabled `#0E72ED` | ✔ [M]. Composer has no visible focus ring in the desktop layout [C]. |
| 8.5 message | no bubble [D] | Messages render in **bubbles** for both self and others: bg `#292F37`, radius 10, padding `8px 10px`, 13px text [C]. Header "Sender to Receiver" 12px `#9DA5B5`/`rgba(255,255,255,.4)`, selectable names `#75AFF5`, timestamp shown **only while hovering the list** [C/J]. Direct messages append **"(Privately)"** [J]. |
| 8.6 invite modal | 700×540, radius 8 [D], 2 tabs | **702×542** outer (bg `#242424`, border 1px `#333`, radius **12**, shadow `0 10px 20px rgba(0,0,0,.5)`), inner 700×540 `#1D1E20`. **3 tabs** Contacts · Zoom Rooms · Email. No dim overlay. Invite disabled = opacity .6. Copy URL / Copy Invitation → button text becomes **"Copied"** for ~1 s [M]. |
| 8.7 info popover | rows… | Adds **"Numeric Password Telephone/Room Systems"** row (label wraps to 4 lines in the 120px column). Copy button → replaced by a 16px green check-circle `#00A832` for **5 s** [J/M]. Topic input `maxLength=99`, placeholder "Meeting Topic", **renames on blur** [J]. |
| 8.8 More menu items | Invite, Copy Invite Link, Speaker/Gallery, Fullscreen, Settings, Host tools | Host, 1280 wide: **Show Captions, Breakout Rooms, Whiteboards, Settings, Stop Incoming Video** + "Reset to default · Reset" [M]. Tile hover `rgba(255,255,255,.1)` [C]. |
| 8.9 dark menus | item 32px, 14px, hover `#0E71EB` | Item **~23–25px** tall, **12px** (caret menus) / **13px** (View menu), color `rgba(255,255,255,.8)`, padding `3px 20px 3px 28px`, margin `0 2px`; hover **`#2B2B2B`**; section header 12px **700** `#F5F5F5` padding `8px 16px`; divider 1px `rgba(255,255,255,.09)` margin `9px 0`; checked item = 13×12 white ✓ sprite at left 10/top 8 [M/C]. |
| 8.10 End popover | ✔ 248 wide, buttons 216×32 | ✔ plus: popover at **right 8px, bottom 52px** of the room; **the toolbar is replaced** by a bar `rgba(0,0,0,.8)` + `backdrop-filter: blur(48px)` containing **☐ Give feedback** and **Cancel** (70×32) right-aligned [M/C]. Attendee variant: only **Leave Meeting** and it is red `#DE2828` [J]. Hover: danger `#CA2424`, default `rgba(255,255,255,.18)` [C]. |
| 8.1 leaving | → `/wc/home` | ✔ End Meeting for All → tab returns to `https://app.zoom.us/wc/home` [M]. Joining the same meeting twice as the same user shows "You have joined this meeting on another platform." in the old session (§13.4). |
| 7.5 pre-join | build as specified [D] | Signed-in host opening `/wc/{n}/join` is **redirected to `/wc/{n}/start` and auto-joins** (no preview). Guest preview captured in `08-prejoin-and-live-media.md`. |
| 8.6 / 8.11 copy | — | Clipboard success strings [J]: "Invite link has been copied to clipboard", "Copied", "Invitation information has been copied" (aria). |

---

## 1. Room structure (DOM hierarchy) [M]

```
body (iframe document)                              1280×694, bg #FFF (never visible)
└─ #root (position:fixed)
   └─ #meeting-app.meeting-app › .meeting-client (onMouseMove) › .meeting-client-inner
      └─ #wc-content                                1280×694  bg #131619
         ├─ #wc-container-left                      bg #0D0D0D, transition .2s ease-in   (stage; width = 1280 − right panel)
         │  ├─ .notification-manager#notificationManager (abs, top 10px of the area below the header → y=58, z 999, pointer-events none)
         │  ├─ .meeting-header (abs, 48px, z 200)  — §4
         │  ├─ #wc-video-caption-split › #video-pip-container › #video-share-layout.video-share-layout
         │  │    › .SplitPane › .Pane › .main-layout › video-player-container
         │  │       ├─ speaker view: .speaker-bar-container__horizontal-view-wrap (filmstrip, only N≥2)
         │  │       │               .speaker-active-container__wrap › .speaker-active-container__video-frame › .video-avatar__avatar
         │  │       └─ gallery view: .gallery-video-container__main-view › .gallery-video-container__video-frame.react-draggable (abs, translate(x,y))
         │  └─ footer#wc-footer.footer.main-footer.footer--desktop-layout (abs bottom, 52px, z 200) — §5
         └─ #wc-container-right.wc-container-right--dark (only when a panel is open) 400 wide, bg #040506, padding 0 2px 4px 0, z 20 — §8–10
```

ReactModal portals (dialogs) are appended to `body`; their overlays are either transparent & non-blocking (`pointer-events:none`, used for the Settings window, Invite modal, Info popovers) or dim `rgba(0,0,0,.5)` with `transition: opacity .15s ease-out` (confirm dialogs: Mute All, Captions language, duplicate-session) [M].

---

## 2. Stage colors & layers [M]

| Layer | Value |
|---|---|
| `#wc-content` | bg `#131619` |
| `#wc-container-left` (stage) | bg `#0D0D0D`, `transition: all .2s ease-in` when it resizes |
| tile `.video-avatar__avatar` | bg `#1A1A1A`, radius 0, flex column centered |
| right panel gutter | `#040506` |

---

## 3. Video tiles

### 3.1 Avatar tile (camera off) [M]
| Part | Spec |
|---|---|
| Tile | `.video-avatar__avatar` 100%×100% of its frame, bg `#1A1A1A`. |
| Name (center) | `.video-avatar__avatar-name`: display name (not initials), **font-size = tileWidth / 15**, line-height 1.5, weight 500, `#FFF`, `max-width:95%`, margin `0 2.5%` of tile width, `white-space:nowrap; text-overflow:ellipsis`. Measured: 1234→82.27px/123.4px; 1056→70.4/105.6; 935→(62.3); 880→58.67/88; 580→(38.7); 421→(28); 207→16px/24px (small tiles clamp to 16px [M]). |
| Name tag | `.video-avatar__avatar-footer`: abs bottom-left, margin `0 0 4px 4px`, bg `rgba(0,0,0,.56)`, radius 4, padding `3px 5px 3px 0`, height 29, `max-width: calc(100% - 6px)`, flex align-center, `transition: bottom .2s ease-out`. Children: 16×16 icon (muted mic sprite `room-sprite-tile-muted@1.43x.png`, red slash; or network bars `room-network-good.svg` white for video participants) then `<span>` name with `margin-left:3px`, ellipsis. Font **15px/22.5px** when viewport height ≤ 720 (in-shell room) else **12px** [C/M]. |
| Tag position | Toolbar hidden: tag bottom = tile bottom − 4. Toolbar visible: tag sits just above the toolbar (bottom ≈ y 639 in the iframe) [M]. |
| Active speaker | `.…__video-frame--active .video-avatar__avatar { box-shadow: inset 0 0 0 2px #48DD5D }` [C] (gallery: only when > 2 participants [J]). |
| Self video | Mirrored by default ("Mirror my video" ✓ in Settings › Video) [M]. |

### 3.2 Speaker view [M]
- **1 participant**: one frame `.speaker-active-container__video-frame` 1234×694 at (23,0) — 16:9 fitted to the full room height; header/footer overlay it.
- **2+ participants** (guest captured, §15): top **filmstrip** `.speaker-bar-container__horizontal-view-wrap` y=48, height **120** (padding `3px 0`), tiles **207×117** centered horizontally (self at x=536,y=51). Active speaker below: area y=168…694 → **935×526** at (172,168). Filmstrip switch buttons: 32×117, bg `rgba(255,255,255,.09)`, radius 4, white chevron 3px border [C].
- Speaker-view padding rules [J]: 1 active → `0,0,0,0`; >1 with bar → `0,0,60,0`; >1 without bar → `60,0,60,0`.

### 3.3 Gallery view [M]
- Layout area excludes header & toolbar: **1280×594 at y=48** (with a right panel: 880×594).
- 1 participant: 1056×594 centered (x=112). Padding 0.
- ≥2: outer padding **60px** all sides, **no gap** between tiles, tiles 16:9.
  - 2 tiles @1280: 580×326 at (60,182) & (640,182).
  - 2 tiles @880 (panel open): stacked 1×2, 421×237 at (229,108) & (229,345).
- Tiles are `react-draggable` (grid 5px) — host can drag to reorder; cursor `grab` [M].
- Page arrows (>max per page): 60×100 black boxes, radius 4, 25px blue `#007BFF` triangles; pagination text 13px white [C]. Max per page = Settings › "9 participants" / "25 participants" (default 25) [M].

### 3.4 Gallery grid algorithm [J] (port exactly)
```
allowed = {1:[1x1], 2:[1x2,2x1], 3:[1x3,3x1,2x2], 4:[1x4,4x1,2x2], 5:[1x5,5x1,2x3,3x2],
  6:[2x3,3x2,1x6,6x1], 7:[2x4,4x2,3x3,1x7,7x1], 8:[2x4,4x2,3x3,1x8,8x1], 9:[3x3,5x2,2x5,1x9,9x1],
  10:[2x5,5x2,3x4,4x3,1x10,10x1], 11/12:[3x4,4x3,2x6,6x2,1xN,Nx1], 13/14:[5x3,3x5,2x7,7x2,4x4,1xN,Nx1],
  15:[5x3,3x5,4x4,2x8,8x2,1x15,15x1], 16:[5x4,4x5,4x4,6x3,3x6,2x8,8x2], 17/18:[5x4,4x5,6x3,3x6,2x9,9x2],
  19/20:[5x4,4x5,3x7,7x3,2x10,10x2], 21:[5x5,3x7,7x3,6x4,4x6,2x11,11x2], 22:[5x5,6x4,4x6,2x11,11x2],
  23/24:[2x12,3x8,5x5,4x6,6x4,8x3,12x2], 25:[5x5]}   // "RxC" = rows x cols
for each allowed (r,c): unit = min((W−2·off·c)/(16c), (H−2·off·r)/(9r)); tile = 16unit × 9unit
pick the (r,c) with the largest tile area; rows are filled top→bottom; last row centred (desktop) .
off (BOX_OFFSET) = 0 on desktop (spacing 0).
```

---

## 4. Header bar `.meeting-header` [M]

| Prop | Value |
|---|---|
| Box | abs top, 1280×48, `display:flex; align-items:center`, bg `rgba(0,0,0,.7)` (`#000000b2`/`b3`), z 200 |
| Hide | `.meeting-header__hidden { transform: translateY(-48px) }`, `transition: transform .2s ease-out` [C] |

### 4.1 Left: meeting-info pill
`.meeting-info-icon__icon-wrap` at x=4 (margin-left 4), y=13, **158×22** (auto width, max 600, shrinks), bg `rgba(0,0,0,.6)`, radius 20.
Inside `button#meeting-info-indication` (aria "Meeting information"): padding `3px 10px 3px 6px`; icon `room-info.svg` 16px white (CSS sets 18px but measured 16); title `.meeting-info-icon__title` 12px/16px **700** `#FFF`, ellipsis, margin-left 6.
States [C]: hover bg `rgba(255,255,255,.15)` radius 8; active/focus `rgba(255,255,255,.22)`; focus-visible outline 2px `#2D8CFF` offset 1. `aria-expanded` toggles. Click → §4.5.

### 4.2 Right side (`.meeting-header__info-side`, margin-left auto)
| x | Element | Spec |
|---|---|---|
| 1107 | **Encryption** `button.meeting-info-encryption-icon__button-wrap` (aria "Encryption information") | 28×28 circle, icon `room-encryption.svg` 18px `#25E55F`. Hover `rgba(255,255,255,.15)`, active-open `rgba(255,255,255,.22)` [C]. Click → §4.6. |
| 1139 | **Zoom AI** `button.aic-panel-entry.pop-panel__button--disabled` (aria "Zoom AI") | 28×28 circle, margin-right 4, icon `room-ai.svg` 18px `#F7F9FA`; hover `#6E768054`; "on" state = gradient `linear-gradient(94deg,#5B8DBE 3.04%,#375CB8 42.49%,…)` [C]. Disabled for this account (omit or render inert). |
| ~1175 | vertical divider (prism, extraLarge) | 1px, ~20px tall, white low-alpha [D]. |
| 1198 | **View** `button.full-screen-widget__button` (aria "View", aria-haspopup) | 24×24, radius 8, padding `4px 6px`, icon 12px white: `room-view-speaker.svg` in speaker view / `room-view-gallery.svg` in gallery view. Hover bg `rgba(62,62,62,.88)` color .8; focus/active `rgba(79,79,79,.88)` [C]. Click → §4.4. |
| 1234 | **Switch to Zoom Workplace Client** `button.switch-to-native-button--desktop-icon` | 24×24, bg `rgba(36,36,36,.88)`, radius 8, padding 4, icon `room-switch-native.svg` 16px (white "zm" squircle). Hover `rgba(62,62,62,.88)` opacity .8. Launches the desktop app (omit in clone or make inert). |
Right margin to edge: 22px.

### 4.3 Popover container behaviour
Header popovers render in a transparent, non-blocking ReactModal (`role=presentation`) with focus-trap sentinels; click the trigger again, click outside, or Esc closes [M].

### 4.4 View menu `.dark-dropdown.full-screen-widget__pop-menu` [M] — `room-05-view-menu.jpg`
- Anchored under the View button, right-aligned to its right edge: x=978, y=38, **244** wide (min-width), 272 tall. bg `rgba(0,0,0,.99)`, border 1px `rgba(255,255,255,.12)`, radius 8, shadow `0 8px 24px rgba(0,0,0,.3)`, padding `8px 0`, font 13px.
- Items `a.dropdown-item` 242×25, padding `3px 20px 3px 28px`, margin `0 2px`, 13px/18.57px `rgba(255,255,255,.8)`, flex, nowrap; hover/focus bg `#2B2B2B`; keyboard focus outline 1px white.
- Checked item `.full-screen-widget__pop-menu--checked` → `::before` 13×12 white ✓ (sprite; `room-sprite-check@2x.png`) at left 10, top 8.
- Right-side view icons 12px `rgba(255,255,255,.8)` at right 8 (abs right 4 + margin 4), top 7: `room-view-speaker-menu.svg`, `room-view-gallery.svg`, `room-view-multispeaker.svg`.
- Copy & order (dividers = 1px `rgba(255,255,255,.09)`, margin 9px 0):
  1. **Speaker View** ✓(current) · **Gallery View** · **Multi-speaker View**
  2. **Sort Gallery By** (chevron-right 16px `room-chevron-right.svg`) · **Follow Host's Video Order**
  3. **Hide Self View** · **Hide Non-video Participants**
  4. **Fullscreen** (→ "Exit Fullscreen" when active [J])
- **Sort Gallery By** replaces the menu content in place (same box, 165 tall): First Name (A - Z) · First Name (Z - A) · Last Name (A - Z) · Last Name (Z - A) · Entry Time (First - Last) · Entry Time (Last - First). (`room-06-view-sort-gallery-submenu.jpg`)
- Selecting a view closes the menu and swaps the header icon.

### 4.5 Meeting information popover [M] — `room-03-meeting-info-popover.jpg`
`.zmu-paper.meeting-info-icon__meeting-paper` abs **x=5, y=53, 400×296** (min-height 220), bg `#1D1E20`, border 1px `rgba(255,255,255,.12)`, radius 8, shadow `0 8px 24px rgba(0,0,0,.3)`, padding `10px 24px 24px`, 12px white, z 1000.
| Row | Spec |
|---|---|
| Topic (host) | `.meeting-info-icon__input-wrap` 350×44, border 2px transparent, radius 10, padding 2; hover bg `#2E2E2E` + pencil sprite (15px) visible; focused `border:2px solid #2D8CFF`, bg transparent. `<input>` 16px/24px **700** white, h36, maxLength 99, placeholder "Meeting Topic"; rename committed on blur. Attendee: plain `.meeting-info-icon__meeting-topic-text` 16px 700, margin `9px 0 18px 5px`. |
| Rows | `.meeting-info-icon__info-row` flex, margin `8px 0 0 5px`, min-h 18, line-height 18. Label column `.row-title` **120px**, 14px `#ADADAD`; value 12px white `user-select:all`. Row gap 8. |
| Invite Link | row h24 (line-height 24); value `#4B96F1` 12px, single line ellipsis, max-width 220 (198 measured); copy button 24×24 `room-copy-url.svg` (dark square r5.5, border `#686F79`, icon `#F7F9FA`). Click → replaced by `room-copied-check.svg` 16px `#00A832` for **5 s**. |
| Meeting ID | "812 3456 7890" (3-4-4 grouping) |
| Host | "A B (You)" |
| Passcode | value, max-width 280 ellipsis |
| Numeric Password Telephone/Room Systems | label wraps (4 lines in 120px), value 6-digit |
| Participant ID | 6-digit |
Focus-visible on rows: outline 2px `#2D8CFF` offset 1 [C].

### 4.6 Encryption popover [M] — `room-04-encryption-popover.jpg`
`.meeting-info-encryption-icon__meeting-paper` abs **right 5, top 53, 400×216** (min-h 120), same paper styling, 13px.
- Title row "**Enhanced encryption is on**" 16px/18px 700 white (y=72).
- "You are connected to the Zoom Global Network via a data center in the United States." 13px/18px `#ADADAD`.
- Row: "Encryption" (label col **150px** `#ADADAD`) · "Enabled" white.
- Divider 1px `#313235`, margin-top 22.
- "Report" — 13px `#FF5C5C`, button h20, padding `0 6px`, radius 6, hover `rgba(255,255,255,.09)`, active `.18`.
- "Security settings" — 13px/20px white, same button styling.

---

## 5. Toolbar (footer) [M] — `room-02-bars-visible-permission-bar.jpg`

### 5.1 Container & layout
| Prop | Value |
|---|---|
| `footer#wc-footer.footer` | abs bottom, 1280×52, bg `rgba(0,0,0,.7)`, 12px, z 200, `transition: transform .2s ease-out`; hidden `translateY(52px)` [C] |
| `.footer__inner#foot-bar` | flex, `justify-content: space-between`, `align-items:center`, nowrap |
| Sections | `[footer-section=left]` Audio+Video (0–180) · `[footer-section=mid]` sortable list + More (426–948) · `[footer-section=right]` End (1194–1280) |

### 5.2 Button anatomy `.footer-button-base__button` [M/C]
- 48 tall, `margin: 2px 0 0` (top y=645 inside the 52 bar), **min-width 86** (Audio/Video 90, Participants 91, Breakout Rooms 116, Show Captions 108 — width grows with label + 12px side margins), radius 8, transparent, color white, `transition:none`.
- Icon layer `.footer-button-base__img-layer`: 24px tall flex-centered at the top (icon top y=647).
- Label `.footer-button-base__button-label`: 12px/16px 400 `#FFF`, margin `4px 12px 0` (top y=675), max-width 120, ellipsis.
- States [C]: hover & focus-visible bg `#6E768054`; active bg `#FFFFFF2E` + text `rgba(255,255,255,.8)`; "active-animate" `flash 1s`; disabled `.footer-button--disable { opacity:.5; pointer-events:none }`.
- **Caret** `.footer-sub-toggle-base`: 20×24, radius 6, margin 4 (top-right of its button: Audio caret x=66, Video 156, Participants 494, Chat 580, Share 752), icon `caret-up.svg` 12px white. Hover/focus-visible `#FFFFFF54`; main-button hover also tints caret `#6E768054`.

### 5.3 Buttons (host, 1280 wide, no panel) — icons, labels, aria
| Button | x / w | Icon (px) | Label | aria-label | Click |
|---|---|---|---|---|---|
| Audio | 0 / 90 | denied: `room-audio-disallowed.svg` 32×24 (white mic + `#F05` slash + red ⚠); joined unmuted `mtg-mic-on.svg`; muted `mtg-mic-muted.svg`; not joined: headphones [D] | **Audio** / **Join Audio** / **Mute** / **Unmute** | "audio" | toggle mute / join audio / re-request permission |
| Audio caret | 66 | caret 12 | — | "More audio controls" | §6.1 |
| Video | 90 / 90 | denied: `room-video-disallowed.svg` 38×25; on `mtg-video-on.svg`; off `mtg-video-off.svg` | **Video** / **Start Video** / **Stop Video** | "Video" | toggle camera |
| Video caret | 156 | | | "More video controls" | §6.2 |
| Participants | 426 / 91 | `mtg-participants.svg` 24 + count | **Participants** | "open the manage participants list pane,1 particpants" (sic) → "close the manage participants list pane" when open | toggles §8 |
| Participants caret | 494 | | | "Participants Settings" | §6.3 |
| Chat | 518 / 86 | `mtg-chat.svg` 24 | **Chat** | "open the chat panel" | toggles §10 |
| Chat caret | 580 | | | "Chat Settings" | chat settings menu |
| React | 604 / 86 | `mtg-react.svg` 26 | **React** | "React" | §6.5 |
| Share | 690 / 86 | `mtg-share.svg` 27 | **Share** | "Share" | screen share (green `#25E55F` icon while sharing [C]) |
| Share caret | 752 | | | "Host tools for share" | §6.4 |
| Host tools | 776 / 86 | `room-hosttools.svg` 24 (shield) | **Host tools** | "Host tools" | opens Host tools panel §7 |
| More | 862 / 86 | `mtg-more.svg` 24×25 (circle + 3 dots) | **More** | "More meeting control " | §6.6 |
| End | 1194 / 86 | `mtg-end.svg` 24 (`#F05` hexagon + white ✕ .4) | **End** (host) / **Leave** (attendee) | "End" | §11 |

**Participant count** `.footer-button__number-counter`: abs `top:-2px; left:calc(50% + 8px)`, width 22, 11px/16.5px `rgba(255,255,255,.8)` centered (shows "1", "2"…) [M/C].
**Unread chat badge** [C]: `.footer-button__number-badge-wrapper--unread .number-badge` min 18×18, padding `0 4px`, 12px, bg `#E02828`, border 2px `#FFF`, radius 10, positioned `top:-8px; right:50%; transform:translate(100%)`.
**Promoted (temporary) button** + divider: `#footer-temporary-icon-divider` wrapper 17×22 containing a 1px white vertical line 22 tall, margin `0 8px`; then e.g. "Settings"/"Show Captions"/"Breakout Rooms" buttons (also with their own carets where applicable) [M].

### 5.4 Auto-hide [J/C]
- Visible on entry and on `mousemove` anywhere in `.meeting-client` (throttled 1 s) → hides 3000 ms after the last move.
- Stays visible while: pointer over the footer (`isHoverFooter`), any toolbar dropdown open, leave box open, tips above footer, "Always show meeting controls" (Settings › General) or Ctrl+\\ toggled on.
- Header uses the same visibility flag. Both slide (`transform .2s ease-out`).

### 5.5 Keyboard [J]
- **Ctrl+\\** toggle always-show controls. **Alt+A** mute/unmute (when the shortcut is enabled). **Hold Space** to temporarily unmute (Settings › Audio option). Enter on popovers/menus activates; Esc closes.
- Toolbar drag-sort a11y text: "To pick up a draggable item, press the space bar. While dragging, use the arrow keys…" (sr-only).

---

## 6. Toolbar menus & popovers

### 6.1 Audio caret menu `.dark-dropdown.audio-option-menu__pop-menu` [M] — `room-08-audio-caret-menu.jpg`
x=62, bottom edge 641 (1px above the bar), **227×335**, dark-dropdown styling (§0 8.9). Item font 12px/17.14px, h23, padding `3px 20px 3px 28px`; headers 12px/18px **700** `#F5F5F5` padding `8px 16px` (h34).
```
Select a Microphone            (header)
✓ Unrecognized microphone1     (device list; ✓ = selected)  [label when permission denied; real device labels when granted]
────
Select a Speaker
  Unrecognized speaker1
────
Microphone modes
✓ Background noise suppression
────
  Test Speaker & Microphone
  Leave computer audio
────
  Audio Settings               → Settings › Audio (§12.3)
```
Hover `rgba(255,255,255,.1)` text `#DDD` (more specific audio-menu rule) [C].

### 6.2 Video caret menu `.video-option-menu__pop-menu` [M] — `room-09-video-caret-menu.jpg`
x=152, bottom 641, **221×189**.
```
Select a Camera
✓ Unrecognized camera1
────
Blur my background        [switch]     (row: 12px label, padding 5px 30px, space-between)
  Choose Background...                  → Settings › Background
────
  Video Settings...                     → Settings › Video
```
Switch (prism small) [M]: track 36×20 radius 10, off `#555B62`, on `#0D6BDE`, `transition: background .3s`; thumb 16×16 white, radius 8, shadow `0 4px 8px #00000014, 0 2px 4px #00000014`, `transition: transform .3s` (2px inset; on = translateX(16px)).

### 6.3 Participants caret menu [M] — `room-10-participants-caret-menu.jpg`
x=490, bottom 641, **201×87**: **Invite ...** (opens Invite modal §9) · **Copy invite link** · **Host tools for participants** (opens Host tools › Participants panel §7.2).
"Copy invite link" → `.wc-tooltip` above the Participants button: bg `#212326`, radius 5, padding `20px 30px`, min-width 220, 14px/21px white, text "**Invite link has been copied to clipboard**", 8px down-arrow (`border-top:8px solid #212326`), visible **≈2.0 s** [M].

### 6.4 Share caret [M]
x=748, **165×41**: single item **Host tools for share** → Host tools › Share panel (§7.3).

### 6.5 React picker `.reaction-simple-picker__container` [M/C] — `room-13-react-picker.jpg`
- Centered over the React button, bottom on the bar top: x=502, y=472, **290×170**. bg `rgba(0,0,0,.8)`, border 1px `rgba(255,255,255,.12)`, radius 12, shadow `0 6.14px 18.43px rgba(0,0,0,.2)`, `backdrop-filter: blur(15.36px)`, padding 8.
- Rows (`display:flex; justify-content:space-around; margin-bottom:8`):
  1. 7 × 32×32 transparent buttons (radius 8, 8px apart; hover `rgba(255,255,255,.09)`, active `.18`): 👏 Clap · 👍 Thumbs Up · 😂 Joy · 😮 Open Mouth · ❤️ Heart · 🎉 Tada (24px SVGs `room-react-reactions-*.svg`) · **More** (`room-react-icons-more.svg` 16×4) → full emoji picker.
  2. 5 × 50×32 non-verbal buttons (bg `rgba(255,255,255,.09)`, hover `.18`, active `.27`, 4px apart, 16px icons): Yes `#00A832` ✓ · No `#E64C3C` ✕ · Slow down `#747487` « · Speed up `#0E71EB` » · I'm away ☕ (`room-react-nvf-*.svg`).
  3. **✋ Raise Hand** 272×32 bg `rgba(255,255,255,.09)`, 13px/19.5px **700** white.
  4. **⏳ Be right back** 272×32 (tooltip "Mute audio and video").
- Tooltips (`data-tooltip`) [C]: bubble `top:-104%`, bg `#1D1E20`, 13px white, padding `4px 8px`, radius 6, border .5px `rgba(255,255,255,.09)`, min-h 24, plus 9px down-arrow; fade `all .15s ease`. Texts: Clap, Thumbs Up, Joy, Open Mouth, Heart, Tada, More, Yes, No, Slow down, Speed up, I'm away, Mute audio and video.
- **Full emoji picker** (More) `.zmu-emoji-picker__container--dark` [M] — `room-14-react-all-emoji-picker.jpg`: 320×355 centered over React (x=487,y=287), bg `#242424`, border .5px `rgba(255,255,255,.25)`, radius 12, shadow `0 8px 24px rgba(0,0,0,.3)`, padding `8px 12px 8px 6px`. Nav: 8 category icons 24px, 14px apart (Smileys & People, Animals & Nature, Food & Drink, Activity, Travel & Places, Objects, Symbols, Flags). Search box 295×24, border 1px `#707070`, radius 6, padding `4px 8px`, 16px search icon, input 12px `#B6B6BA`. Section label 12px/18px `rgba(255,255,255,.5)` padding-left 6 (sticky header). Emoji 24px buttons, margin 6 (36px pitch, 8 per row; JoyPixels sprites). Footer "Change Skin Tone" 12px + 👍 tone button.

### 6.6 More menu `.dark-dropdown.more-button__pop-menu` [M] — `room-15-more-menu.jpg`
- Left-aligned to the More button: x=862, bottom 639 (`margin-bottom:4px`), **247×175**, bg `rgba(0,0,0,.99)`, border 1px `rgba(255,255,255,.12)`, radius 8, shadow, **padding 5**.
- Grid `repeat(3,75px)`, gap 5. Tile `button.more-button__item-box` **75×60**, radius 12, flex column centered, 10px/15px white label (wraps to 2 lines), 16px icon; hover `rgba(255,255,255,.1)`.
- Items (host, wide stage): **Show Captions** (`room-more-show-captions.svg`, CC) · **Breakout Rooms** (2×2 grid) · **Whiteboards** · **Settings** (gear) · **Stop Incoming Video** (camera with arrow). Items already on the toolbar are omitted; overflowed toolbar items (e.g. Host tools when a panel is open) are added.
- Full-width divider 1px `#313235`.
- Footer row (`margin-top:8`, centered): "Reset to default" 11px/16.5px `#DFE3E8` + **Reset** tertiary button 50×24, radius 6, padding `3px 8px`, 12px/16px `#4B96F1` (restores default toolbar order).
- Selecting an item closes the menu and promotes it to the toolbar (§5.3).

---

## 7. Host tools panel (right panel) [M] — `room-12-host-tools-panel.jpg`, `room-11-…`
Same container as other panels (§8.1). `.panel-shell.panel-shell--dark.host-tools-panel` 398×686 at (880,4).
- Header `.host-tools-panel__shell-header`: **56px**, padding `12px 16px`, no bottom border, radius `15px 15px 0 0`, title 14px/21px **700** `#F7F9FA` centered. Sub-pages show a **Back** button at left 16: 28×28, `room-back.svg` 20px `#DFE3E8`, hover bg `#6E768054` radius 4. Right: Pop Out + Close (16px, rect fill `#CAD1D5`, 8px apart).
- Content padding `0 8px`, thin scrollbar.
- Row `.host-tools-panel__row`: flex space-between, padding 8, gap 24, radius 6, hover `#2A2B2D`; label 14px/21px `#F7F9FA`; right = prism small switch (§6.2). Disabled row label `#596069`.
- Divider 1px `#313235`, margin `10px 0 8px`.
- Drill-in `.host-tools-panel__menu-button` 380×41, padding 8, radius 8, border 2px transparent, 14px `#F7F9FA`, hover `#2A2B2D`; chevron = 10×10 box with 2px `#939BA4` top/right borders rotated 45°.
- Section label 14px `#939BA4` padding 8. Danger action 14px `#E8173D` padding 8 (hover `#2A2B2D` r6).

Pages & copy:
1. **Host tools** (root): Enable waiting room ○ · Lock Meeting ○ · Hide profile pictures ○ │ **Participants ›** · **Advanced ›**
2. **Participants**: "Suspend Participant Activities" (danger) │ "Allow participants to:" · Chat ● · Rename Themselves ● · Unmute Themselves ● · Start Video ● │
3. **Advanced**: AI › · My Notes › · Share › · Captions › · Whiteboards ›
4. **Share** (from Share caret): label "How many participants can share at the same time?" + select "Multiple participants can share simultaneously"; "Who can share?" + select "All Participants" (disabled); "Who can start sharing when someone else is sharing?" + "All Participants" (disabled). Select box 348×32, border 1px `#555B62` (disabled `rgba(89,96,105,.25)`, text `#596069`), radius 8, 14px/18px, 16px chevron at right; rows padding `10px 16px 0`, gap 8.

---

## 8. Participants panel [M] — `room-21-participants-panel.jpg`

### 8.1 Right container & panel shell
- `#wc-container-right.wc-container-right--dark`: x=880, 400×694, bg `#040506`, padding `0 2px 4px 0`, z 20. Stage shrinks to 880 (header, toolbar and toasts re-center over the 880 stage).
- `.panel-shell--dark`: 398×686 at (880,4) (margin-top 4), bg `#1D1E20`, color `#F7F9FA`, border 1px `#313235`, radius 15, overflow hidden.
- **Two panels open** (Participants + Chat): stacked, Participants on top (`panel-shell--half`, flex 5) 398×342 at y=4, Chat 398×340 at y=350 (4px gap) [M] — `room-34-…`.
- **Minimize** (only shown when stacked; `room-collapse-to-title.svg`): the panel collapses to a **44px** title bar (`.panel-shell--mini`) moved to the **bottom** (y=646); the other panel takes the rest (638). The mini bar shows **Expand** (`room-expand-all.svg`) instead [M] — `room-35-…`.
- **Pop Out**: panel becomes a draggable in-room window (`#participant-window.common-window--dark`) **400×508**, centered (x=440,y=93), bg `#1D1E20`, border 1px `#333`, radius 15, shadow `0 10px 20px rgba(0,0,0,.5)`; header 42px (padding `10px 20px 10px 8px`, border-bottom 1px `#333`, title 14px/21px **700** `#F5F7FB` left-aligned), right buttons **Merge to meeting window** (`room-merge.svg`) and Close, 16px, 12px apart. Zoom auto-pops-out panels when the window gets too narrow [M] — `room-22-…`.

### 8.2 Header
`.panel-shell-header__header` 396×46, padding `12px 16px`, border-bottom 1px `#313235`, bg `#1D1E20`. Title "**Participants (N)**" 14px/21px **500** `#F7F9FA` centered. Operate icons at right 16: [minimize] · Pop Out (`room-popout.svg`) · Close (`room-close.svg`) — 16px, `rect` fill `#DFE3E8`, 8px apart, aria "minimize"/"Pop Out"/"Close".

### 8.3 List & row
- List `#participants-unified-list` (react-virtualized), starts y=59; scrollbar 8px, track `rgba(255,255,255,.09)`, thumb `#707070`, radius 6.
- Row `.participants-li` **390×44**, padding `6px 20px`, radius 4, 14px/18px white; hover `#313235`; selected `#303030` [C].
- Left: avatar 32×32 radius 10, initials 16px/32px 400 white, colored bg (self `#8E44AD`, guest `#D35400`); 12px gap; display name 14px/18px; label `(Host, me)` / `(Guest)` / `(me)` / `(Host)` / `(Co-host)` 14px white, margin-right 5 (no space before "(" visually: "A B(Host, me)").
- Right `.participants-item__right-section--icons` (gap 4) — buttons 26×26, padding 5, radius 6, hover `rgba(0,0,0,.45)`:
  - mic: muted `room-pl-participants-list-audio-muted.svg` red `#DE2828` (aria/title "Unmute" for self, "**Ask to Unmute**" for others; unmuted shows mic icon/title "Mute" [D])
  - video: off `room-pl-participants-list-video-off.svg` red (title "Start Video"), on `room-pl-video-on.svg` grey `#747487` (title "Stop Video")
  - "…" `room-pl-SvgEllipsis.svg` 16px `#DFE3E8`, title "More options".
- Order: me first, then others (host/co-host before attendees) [M/D].
- aria-label: "A B (Host, me),computer audio muted,video off".

### 8.4 Row "More options" menu `.new-dropdown-menu` [M] — `room-33-…`
Anchored under the "…" button, right-aligned: 160 wide (min-width), bg `#2A2B2D`, border 1px `#313235`, radius 8, shadow `0 8px 24px rgba(0,0,0,.48)`, padding `5px 0`, margin-top 2. Items `button` 158×23, padding `3px 20px`, 12px/17.14px `#F7F9FA`; hover bg `#6E768054`; disabled `#596069`. Dividers 1px `rgba(255,255,255,.09)` margin 9.
- Self: **Start Video** │ **Add Pin** │ **Rename**
- Other (host view): **Chat · Stop Video** │ **Add Pin** │ **Make Host · Rename** │ **Allow to Multi-pin** │ **Put in Waiting Room · Remove · Report**

### 8.5 Footer
`.participants-section-container__participants-footer-bottom` 396×50 at y=631, padding `10px 0`, flex `space-around`, radius `0 0 8px 8px`, border-top `#313235`. Pills: **Invite** (79), **Mute All** (94, host only), **More** (77) — h30, padding `6px 24px`, radius 20, bg `#2A2B2D`, 12px/18px white; hover `#6E768054` [M/C].
Footer **More** menu `.participant-host-dropdown` (drop-up, right-aligned): 216×87, bg `#2A2B2D`, border 1px `#3A3A3A`, radius 8, padding `8px 0`; items 12px white padding `3px 20px 3px 25px`, hover `#6E768054`: **Ask all to unmute** · **Mute all upon entry** (✓ when on) · **Host tools for participants** [M] — `room-24-…`.

---

## 9. Invite modal [M] — `room-25-invite-contacts.jpg`, `room-26-invite-email.jpg`
- `#window-wrapper-dark.common-window-2.react-draggable` **702×542** centered (x=289,y=76), bg `#242424`, border 1px `#333`, radius 12, shadow `0 10px 20px rgba(0,0,0,.5)`, overflow hidden. Overlay transparent, non-blocking (z 1030).
- Container 700×540 bg `#1D1E20`. Header (drag handle, `cursor:move`): "**Invite People to join meeting 812 3456 7890**" 24px/36px **700** `#F5F7FB` centered, margin `20px 0`.
- Segmented tabs: track 342×30 at x=469 (centered), bg `#3A3A3A`, radius 8. Tab 114×30 radius 8 border 1px transparent; button padding `0 4px`; text 13px/26px. Selected: bg `#313235` + shadow `0 1px 4px rgba(0,0,0,.3)`, text `#FFF`; others `#939BA4`. Tabs: **Contacts · Zoom Rooms · Email** (aria "Contacts selected tab 1 of 3"…).
- **Contacts / Zoom Rooms**: tag input box 660×42 at (310,193), border 1px `#555B62`, radius 8, padding 4, margin `10px 0`; search sprite icon 21×18 margin `0 10px`; input 16px/32px `#F5F7FB`, placeholder "**Choose from the list or type to search**". Below: virtualized grid of user tiles (empty for this account). Tile [C]: 54px tall, margin 7, padding 10, radius 9, avatar 28 r8, name 14px (w 86; rooms 220), selected bg `#0E72ED` white.
- **Email**: "**Choose your email service to send invitation**" 16px/22px **700** `#F5F7FB` centered (content margin `85px 100px 0`); `.email-section` margin-top 40: three 165×91 buttons (each 33%), image 83×61 / 82×60 / 84×61 (`room-invite-default_email.png`, `room-invite-gmail.png`, `room-invite-yahoo_mail.png`, active opacity .8) + title 13px/19.5px `#F5F7FB` margin-top 10: **Default Email · Gmail · Yahoo Mail**.
- Divider 1px (`#EDEDF4` light / dark equivalent) above footer; footer padding 9.
- Footer left: **Copy URL** (80 wide) and **Copy Invitation** (96) — 14px/21px 400 `#75AFF5`, margin-right 28, min-width 80. Click → label becomes **Copied** for ≈1 s; aria becomes "Invitation information has been copied".
- Footer right (margin-right 16): "Passcode:" 13px/19.5px `#9DA5B5` margin-right 11 · value 13px **600** `#F5F7FB` (max 220 ellipsis, margin-right 10) · **Invite** primary 67×32, radius 8, padding `0 16px`, margin `0 14px`, bg `#0E71EB`, 14px 400 white, **disabled opacity .6** until a contact is selected (hover `#2681F2`) · **Cancel** 78×32, radius 8, border 1px `#555`, transparent, 14px `#F5F7FB`.

---

## 10. Chat panel [M] — `room-27-…` to `room-30-…`, `room-34-…`

### 10.1 Shell
`.chat-container.chat-container--dark` 398×686 at (880,4) (stacked: 398×340), bg `#1D1E20`, radius 15, margin-top 4.

### 10.2 Header `.chat-header__header`
398×37, padding 6, border-top 1px `#313235`, bg `#1D1E20`, 14px **700** `#F5F7FB`, flex centered.
- Left: 24×24 button (padding 4) with `room-chat-SvgChatPersistentHeader.svg` 16px `#0E72ED` (two speech bubbles) — opens Team Chat (disabled here).
- Title = meeting topic "A B's Zoom Meeting" 14px/21px 700, ellipsis, padding `0 20px`, margin `0 40px 0 4px`, centered.
- Right (abs right 10, 8px apart, 16px, rect fill `#CAD1D5`): [Minimize — only when stacked] · Pop Out · Close.
- **First-open coachmark** `.relative-tooltip` under the header icon: 326×139, bg `#333`, border 1px `rgba(255,255,255,.12)`, radius 8, shadow `0 8px 24px rgba(0,0,0,.3)`, padding 14; arrow 16px square rotated; title "**Continue the Conversation**" 14px/21px 700 `#F5F7FB`; body "There's now a meeting group chat named after this meeting in Team Chat. Continue the conversation there at any time." 13px/19.5px; **Got it** primary 49×21, radius 6, padding `4px 8px`, 13px.

### 10.3 Message list
- Empty state: `.chat-item__pmc` centered notice at top (y=51): "**Messages addressed to "Meeting Group Chat" will also appear in the meeting group chat in Team Chat**" 12px/14px `rgba(255,255,255,.56)`, padding `0 40px`.
- Message rendering (from CSS/JS; no message was sent) [C/J]:
  - Group header `.new-chat-item__chat-info-header` (only on the first message of a consecutive group): flex, padding `8px 0 4px` (first-in-list `0 0 4px`), 12px, color `rgba(255,255,255,.4)`; content `[sender] " to " [receiver] [(Privately)]` + timestamp. Sender/receiver are `span`s, ellipsis; clickable names (to reply privately) `#75AFF5`; "Everyone"/"Meeting Group Chat" not clickable. Own messages: sender "**Me**". Direct: receiver = name + " **(Privately)**" [J]. `.chat-item__left-container` has `padding-left:48px` when avatars are shown (Settings › "Show user profile icon next to in-meeting chat messages" ✓ default) else 8px.
  - Avatar 32×32 radius 6, margin `3px 8px`, beside the first message.
  - Timestamp `.new-chat-item__chat-info-time-stamp` margin-left 5, nowrap; in the classic header it is `display:none` until `.chat-container__chat-list:hover` (then shown, header text max-width `calc(100% − 80px)`).
  - Body `.new-chat-message__text-box`: **bubble** bg `#292F37` (self and others identical in dark), radius 10, margin-right 4, `white-space:pre-wrap; word-break:break-word`; inner `.new-chat-message__text-content` padding `8px 10px`, margin-bottom 4, 13px, `#F5F7FB`. Unreachable: `#6B7280` on `rgba(255,255,255,.04)`.
  - Hover → floating options pill `.new-chat-message__options` (h32, bg `#2A2A2A`, border `rgba(255,255,255,.06)`, radius 8, shadow `0 8px 24px rgba(0,0,0,.4)`, 22×22 icon buttons `rgba(255,255,255,.56)` → hover `#F5F7FB` on `rgba(255,255,255,.08)`; active `#0E72ED33` / `#75AFF5`): react, reply, more.
  - "Message sent before you joined the meeting" placeholder exists [J].

### 10.4 "Who can see your messages?" bar + popover
- Bar `button.disclaimer__button-wrap` 398×24 (y=509 unstacked), bg `rgba(255,255,255,.06)`, hover `.1`; 14px people sprite + "**Who can see your messages?**" 12px/24px `rgba(255,255,255,.56)` centered (variants append "Recording On", "Archiving on"… [J]).
- Click → `.zmu-tooltip-zmu-paper.disclaimer--chat.disclaimer--dark` above the bar: **306×218**, bg `#2A2A2A`, radius 10, shadow `0 2px 8px rgba(0,0,0,.3)`, padding `12px 16px`, 17px rotated-square arrow pointing down; two paragraphs 12px/18px `#F5F7FB` (first padding-bottom 12):
  1. "Everyone in the meeting can see and save your messages sent to Meeting Group Chat – and share them with apps and others. These messages will also be posted in the dedicated Meeting Group Chat in Team Chat, and everyone, including those not in the meeting, can see, save and share them."
  2. "Only you and those you chat with can save your direct messages and share them with apps and others."

### 10.5 Composer `.chat-rtf-box__chat-textarea-wrapper`
398×157 at y=533, bg `#1D1E20`, radius `0 0 15px 15px`, padding-top 4. (`:focus-within` outline is suppressed in the desktop-footer layout.)
- **Recipient row** `.chat-container__chat-control` h32, padding `0 6px`, margin `0 2px`, gap 2: "to:" 12px/18px `#9DA5B5` padding `2px 0` margin-right 5; pill `#chatReceiverMenu` h22, padding `2px 15px`, radius 10.5, bg `#0E72ED`, 12px/18px white, max-width 180 ellipsis — "**Meeting Group Chat**".
- **Recipient menu** (drop-up): 202 wide, bg `#2A2A2A`, border 1px `#3A3A3A`, radius 6, shadow `0 8px 24px rgba(0,0,0,.4)`, padding `8px 0`, custom scrollbar. Items 200×24, padding `3px 20px 3px 25px`, 12px/18px `#DFE3E8`, hover `#313235`; checked = 11×5 white L-check rotated −45° at left 9/top 9. Items: **Meeting Group Chat** then each participant ("Chrome Guest"). Role `menuitemradio`.
- **Editor** `.chat-rtf-box__editor-outer` padding `4px 8px 8px`; wrapper height **85**, scroll-y; TipTap/ProseMirror 14px/18px `#F5F7FB`; placeholder "**Type message here ...**" color `#DFE3E8` (dark). Enter sends, Shift+Enter newline [D/standard].
- **Bottom row** `.chat-rtf-box__bottom` h24, padding-right 10; left icons (16px in 24×24 buttons, `#9DA5B5`, radius 4–6): **format** (`room-chat-chat-format.svg`, margin-right 8; active `.chat-rtf-box__format--active` bg `rgba(14,114,237,.2)` color `#75AFF5`) · **File Transfer** (`room-chat-file2.svg`) · **Emoji** (`room-chat-chat-emoji.svg`) · **More chat options** (`room-chat-chat-more.svg`, padding `0 4px`). Right: **send** 24×24 radius 6 (`room-chat-chat-enter.svg` 16px): disabled `.chat-rtf-box__send--disabled` bg `#333` icon `#6B7280`; enabled (any text) bg `#0E72ED` icon `#FFF` [M].
- **Format bar** (toggle via format): `[role=toolbar]` 398×32 bg `#1D1E20`, padding `0 4px`, inserted **above** the "to:" row; 24×24 buttons (radius 7, 8px apart), 24px icons `#9DA5B5`; titles: **Bold (⌘B) · Italic (⌘I) · Underline (⌘U) · Strikethrough (⇧⌘X) · Color · Size · Add Link** │ divider │ **Paragraph · Bulleted List (⇧⌘8) · Numbered List · …(overflow)**. Icons `room-fmt-*.svg`.
- **Emoji picker** (chat): same component as §6.5 but bg `#2A2A2A`, 320×355, anchored bottom-right over the composer (x=953,y=302); closes on outside click / Esc.
- **File Transfer menu**: 201×122, bg `#1D1E20`, border 1px `#313235`, radius 6, shadow `0 8px 24px rgba(0,0,0,.48)`, padding `8px 0`; items 26 tall, padding `3px 20px`, 14px/20px `#DFE3E8`, 16px brand icon + 8px: **One Drive · Google Drive · Box · Microsoft SharePoint**.
- **More chat options** (host): 213×136, bg `#1D1E20`, border 1px `#333`, radius 6, padding `8px 0`; header "**Participants Can Chat with:**" 13px/19.5px **700** `#F5F7FB` padding `3px 10px`; items 12px `#DFE3E8` padding `3px 20px 3px 25px`: No one · Host and co-hosts · Everyone · ✓ **Everyone and anyone directly**.

---

## 11. End / Leave flow [M] — `room-36-end-popover.jpg`
- Click End → toolbar content is replaced by `.footer__inner.leave-option-container` (abs bottom, 1280×52, bg `rgba(0,0,0,.8)`, `backdrop-filter: blur(48px)`, flex end-aligned, z 1).
- Popover `.leave-meeting-options` abs **right 8, bottom 52** → x=1024, y=530, **248×112**, bg `rgba(9,10,10,.8)`, radius 12, padding 16.
  - **End Meeting for All** 216×32, radius 8, padding `0 16px`, 14px/32px white, bg `#DE2828`, hover `#CA2424`.
  - **Leave Meeting** 216×32, margin-top 8, bg `rgba(255,255,255,.09)`, hover `.18`.
  - Attendee: only **Leave Meeting**, rendered danger red [J]; footer End button label **Leave**.
  - Host "Leave Meeting" with other participants → "Assign a new host" step [J].
- Bar right side: checkbox **☐ Give feedback** (zm-checkbox, transparent box, 13px/19.5px `#F5F5F5`) then **Cancel** button 70×32, bg `rgba(255,255,255,.04)` (hover `.09`), radius 8, padding `5px 12px`, margin `0 16px 0 32px`, 14px/18px `#F5F5F5`.
- Cancel / Esc restores the toolbar. End Meeting for All → meeting ends, Workplace navigates to `/wc/home` [M].

---

## 12. Settings modal (More › Settings) [M] — `room-16/17/18-settings-*.jpg`
- `#settingsDialog.common-window.react-draggable` **757×565**, centered (x=261.5,y=64.5), modeless (transparent overlay, `pointer-events:none`); paper bg `#1D1E20`, border .5px `rgba(0,0,0,.25)`, radius 8, shadow `0 8px 24px rgba(0,0,0,.3)` (outer `0 10px 20px rgba(0,0,0,.5)`).
- Header 53px, padding 14, border-bottom 1px `rgba(255,255,255,.09)`; title "**Settings**" 16px/24px **700** `#F5F5F5` centered; close 18×18 sprite at top/right 19.4.
- Left tab rail 211 wide, padding 16, border-right 1px `rgba(255,255,255,.09)`; tab 178×32, radius 12, padding-left 8, margin-bottom 8, 14px/32px; inactive text `rgba(255,255,255,.54)`, active bg **`#4F9AF7`** text `#F5F5F5`; icon chip 24×24 radius 8 margin-right 12 (16px white glyph): General (white chip on active), Video `#AFD784`, Audio `#82C786`, Background `#4FD1E2`, Statistics `#C182D1`, About `#7A86CC`.
- Tab panel padding `24px 0`, body padding `0 24px`, scroll-y. Section label 13px/16px **700** `#F5F5F5` margin-bottom 8. Checkbox (dark): 16px box border 1px `#707070` radius 4 bg `#1D1E20`; checked bg/border `#0E71EB` + white check; label 13px/25px margin-left 4. Radio: 14px circle border `#A8A8A8`; checked gradient `#5F9BFA→#397FE9` + 3px white ring; label 14px/21px, padding `0 8px 0 24px`.
- **General**: ☐ Always show meeting controls │ **Video**: "Maximum participants displayed per screen in Gallery View:" (14px/24px) ○ 9 participants ● 25 participants │ **Chat**: ☑ Show user profile icon next to in-meeting chat messages │ **Reactions**: "Skin Tone" + six 40×40 👍 buttons (radius 10, padding 8, selected bg `rgba(255,255,255,.09)`), ☑ Display your reactions above toolbar, ☑ Animate emojis.
- **Video**: preview area (error "Unable to start video at this time." / "Please resolve the error and restart video.") · "Choose Background" + ⊕ upload · thumbnails (None, Blur, San Francisco, Grass, Earth, Japanese Garden, …) · ☑ Stop my video when joining · ☑ Mirror my video · ☐ Hide Non-video Participants · ☐ Hide Self View · ☐ Show me as an active speaker when I talk · "Use hardware acceleration for:" ☑ Receiving video ⓘ ☑ Sending video ⓘ · "Video Rendering Method" select "Auto".
- **Audio**: Speaker — [Test Speaker] + select · Output level bar; Microphone — [Test Mic] (disabled) + select "Unrecognized microphone1" · Input level; **Audio Profile** — "Background noise suppression (recommended for most users)" ● Zoom background noise removal ⓘ ○ Browser built-in noise suppression; divider; ☑ Mute my microphone when join a meeting · ☐ Press and hold SPACE key to temporarily unmute yourself · ☐ Sync buttons on headset.
- **Background**: same picker as Video tab. **Statistics**: sub-tabs Overall / Audio / Video / Share ("Calculating Memory Usage..."). **About**: Zoom Workplace logo, "Version: 7.2.0(12783.ufb8n9u)" 14px 600, "Copyright © 2012-2026 Zoom Communications, Inc." / "All rights reserved." 14px `rgba(255,255,255,.72)`, "Open Source Software ↗" `#4F9AF7`, footer "Found a problem? **Send report**" (`#98A0A9` / `#4793F1`).

---

## 13. Other dialogs [M]

### 13.1 Confirm modal (`.zm-modal.zm-modal--dark`) — shared spec
Overlay `rgba(0,0,0,.5)` (fade .15s ease-out). Box 480 wide (580 for "big-dialog"), bg `#1D1E20`, border 1px `#333`, radius 12, shadow `0 8px 24px rgba(0,0,0,.4)`, padding `32px 32px 24px`, draggable. Title 20px/30px **700** white. Footer right-aligned: secondary (Cancel) h32, padding `6px 20px`, radius 8, bg/border `#3A3A3A`, 14px white; primary h32, radius 8, bg `#0E71EB` (hover `#0D65D4`), 14px **700** white; 12px between.

### 13.2 Mute All — `room-23-mute-all-dialog.jpg`
480×184 at (400,255): "**Mute all current and new participants**" · ☑ "Allow participants to unmute themselves" (13px/19.5px) · **Cancel** (86) **Continue** (102).

### 13.3 Show Captions (More › Show Captions) — `room-19-…`
580×275: "**Set the caption language for this meeting**" (20px/30px 700) · "Caption Language" 14px/21px 700 · "Captions will appear in this language for everyone." 12px/18px `rgba(255,255,255,.7)` · select 510×38 (border 1px `#555B62`, radius 4, "English") · **Cancel** / **Save**.

### 13.4 Duplicate session
"**You have joined this meeting on another platform.**" (20px/30px 700, 2 lines in 414) · "This window will be exited." 14px/21px · **OK** primary 61×32. OK → `/wc/home`.

### 13.5 Breakout Rooms (More › Breakout Rooms) — `room-20-…`
`.common-window--dark` 420×424, radius 15, header 42 ("Create Breakout Rooms" 14px/21px `#F5F7FB`, padding `10px 20px 10px 8px`, close sprite 14px). Body padding `32px 32px 24px`: "**Create** [1 ▴▾] **breakout rooms**" (number input 60×24 bg `#2A2A2A` border `#BABACC` radius 6), radios Assign automatically ● / Assign manually / Let participants choose room, "0 participants per room" 14px/21px `#9DA5B5` (margin-top 83), **Cancel** (78×32 border `#555`) **Create** (78×32 `#0E71EB` 700).

---

## 14. Toasts & notification bar [M/C]
- Manager `.notification-manager`: abs, full width, flex column centered, `top:10px` within the stage below the header (→ y=58), z 999, `pointer-events:none` (toasts `auto`).
- Toast `.notification-message-wrap` (max-width 750, centered, `:not(:first-child){margin-top:10px}`) › `.notification-message-wrap__layer`: flex align-center, padding `14px 16px`, radius 14, bg `rgba(0,0,0,.93)`, 14px/21px `rgba(255,255,255,.8)`, no border (dark).
- Optional buttons `.notification-message-wrap__btns` (h24 r6 13px; dark bg `rgba(255,255,255,.09)` hover `.18`, white); close `i.notification-message-wrap__close` 16×16 white ✕ sprite (`room-sprite-close-x@2x.png`), padding `0 10px 0 4px`, margin `0 2px`, role button.
- Lifetimes [J]: default **5000 ms**; host change "You are host now." / "{name} is the host now." **3000 ms**; rename toast 3000 ms; `aliveTime:-1` = persistent.
- **Permission bar** (persistent, closable): 602×49 at (339,58) in a 1280 stage (re-centers over the stage when a panel is open). Content: `room-warning.svg` 14×13 `#FAAC2A` + 10px, text "**Please enable access to your [microphone] and [camera] for the best experience.**" — the two words are underlined link-buttons `rgb(13,110,253)` 14px/21px, margin `0 3px` (click → browser permission re-prompt / help); ✕ close at right. Variants: "…your microphone…" or "…your camera…" alone [J].
- Corner toasts (`#corner-notification`, e.g. AI): 260 wide, bg `#1A1A1A`, border 1px `#251A30`, radius 10, shadow `0 24px 48px #00000080, 0 12px 24px #00000080`, blur 5px [C].
- Entry toast "**You are host now.**" seen at top-center on start (`room-01-…`).

---

## 15. Two-participant states (host view; guest "Chrome Guest" joined from Chrome, camera on, mic muted) [M]
| State | Measurement |
|---|---|
| Count badge | Toolbar Participants counter "2" (11px `rgba(255,255,255,.8)`); panel title "Participants (2)". |
| Join/leave feedback | No toast for join or leave; roster/count update only (aria-live). |
| Speaker view | Filmstrip at top (120 tall) with self 207×117 at (536,51); guest (active) 935×526 at (172,168); guest name tag shows **network bars** icon (white 16px) + "Chrome Guest" (no mic icon while unmuted). Speaker = most recent active talker. — `room-31-speaker-view-2p.jpg` (camera masked) |
| Gallery view | 580×326 tiles side by side at (60,182)/(640,182), **0 gap**; guest first (left), self second; **no green active-speaker ring with 2 participants**. With a panel open: stacked 421×237. — `room-32-gallery-view-2p.jpg` |
| Participant rows | Row 2 "CG" `#D35400` "Chrome Guest(Guest)"; icons: mic muted (title "Ask to Unmute"), video on grey (title "Stop Video"), "…". Hover = row bg `#313235` only (no Mute/More pills). |
| Guest "…" menu | Chat · Stop Video │ Add Pin │ Make Host · Rename │ Allow to Multi-pin │ Put in Waiting Room · Remove · Report — `room-33-…` (not executed) |
| Chat recipients | Menu lists "Meeting Group Chat" ✓ + "Chrome Guest". |
| Stacked panels | Participants 342 tall over Chat 340, each with minimize/pop-out/close — `room-34-…`; minimized participants bar 44px at the bottom — `room-35-…`. |
| Ask to Unmute / Mute flows | Not executed. Per JS: host can **ask** (guest gets "The host would like you to unmute" style prompt); host can mute directly via the mic icon (when unmuted, title "Mute") [J/D]. |

Attendee-side views (toolbar with **Leave**, attendee More menu, etc.) are in `08-prejoin-and-live-media.md`.

---

## 16. Full-viewport (standalone) client at 1366×768 [M] — `room-37-fullviewport-client.jpg`
Opened via `/wc/{n}/start` directly (no Workplace shell): header 1366×48 at y=0; toolbar 1366×52 at y=716; tile 1365×768 (name 91px); name tag **12px**; permission bar 602×49 at (382,58); End at x=1280; mid group 469–990 (521 wide). Everything else identical.

---

## 17. Pre-join additions to `08-prejoin-and-live-media.md` (CSS-derived) [C]
- Join button (`.preview-join-button`): enabled bg `#0E72ED`, 16px **700** white, h40, radius 10, no explicit hover rule (use `#0C60C8` [D]); dark disabled bg `rgba(255,255,255,.06)` text `#ADB1B8`; light disabled `#F1F4F6`/`#6E7680`. "Join from app" variant: white bg, 1px `#939BA4`, `#222325`, hover `#6E76801F`.
- Inputs (dark): transparent bg, 2px `#555B62`, radius 10, padding `0 18px`, 14px white; placeholder `#596069`; hover bg `#2A2B2D`; focus border `#0E71EB`; error border `#B10E2C` + message 14px/18px `#E02828`; disabled bg `#CCC` border `#909096`.
- Title `.preview-meeting-info__title` 24px 700. Links in agreement `#1890FF` 500.
- Video preview controls `.preview-video__control`: 176×52 dark bar `#040506` radius 10 centered at bottom 12px of the preview; two 88-wide buttons (column icon + 12px/15px label, `#F7F9FA`; hover `rgba(255,255,255,.09)`; disabled `#6E7680`); right "Backgrounds" button `.preview-video__bg-button` (14px/18px `rgba(255,255,255,.8)`, padding `7px 12px`, radius 8, bg `#040506`, hover `.09`). Default avatar 200px (60px small). Labels [J]: "Join Audio" / "Mute" / "Unmute"; "Start Video" / "Stop Video".
- Page footer (dark): links `#939BA4` underline `rgba(255,255,255,.33)` → hover `#DFE3E8`.
- Signed-in host: `/wc/{n}/join` → redirected to `/wc/{n}/start` and joins immediately (no preview) [M].

---

## 18. Real-time / behaviour notes relevant to PRD §9 [M/J]
- Same user joining twice kicks the older session (§13.4) — mirror with WS: on duplicate `participant_id` connect, send `{type:"error",code:"DUPLICATE_SESSION"}` to the old socket and show the dialog.
- Host-change toast on host transfer; rename toast; the permission bar is per-client.
- Meeting info shows Participant ID (6 digits) and numeric phone passcode.

---

## 19. Screenshots saved (`docs/reference/screens/`)
room-01-initial-host-toast · room-02-bars-visible-permission-bar · room-03-meeting-info-popover (sensitive values blurred) · room-04-encryption-popover · room-05-view-menu · room-06-view-sort-gallery-submenu · room-07-gallery-view-1p · room-08-audio-caret-menu · room-09-video-caret-menu · room-10-participants-caret-menu · room-11-host-tools-participants-panel · room-12-host-tools-panel · room-13-react-picker · room-14-react-all-emoji-picker · room-15-more-menu · room-16-settings-general · room-17-settings-video · room-18-settings-audio · room-19-show-captions-dialog · room-20-breakout-create-window · room-21-participants-panel · room-22-participants-popout-window · room-23-mute-all-dialog (small-scale) · room-24-participants-footer-more (small-scale) · room-25-invite-contacts (passcode blurred) · room-26-invite-email · room-27-chat-panel-first-open · room-28-chat-composer-with-text · room-29-chat-format-bar · room-30-chat-emoji-picker · room-31-speaker-view-2p (camera masked) · room-32-gallery-view-2p (camera masked) · room-33-participants-2p-guest-more-menu · room-34-stacked-panels-recipient-menu · room-35-participants-minimized-chat-expanded · room-36-end-popover · room-37-fullviewport-client — **37 files** (all `.jpg`, 800px wide).

## 20. Icons saved (`docs/reference/icons/`, prefix `room-`; single-color SVGs use `currentColor`)
| File | Size / color in UI |
|---|---|
| room-info.svg | 16, white (header pill) |
| room-encryption.svg | 18, `#25E55F` |
| room-ai.svg | 18, `#F7F9FA` |
| room-view-speaker.svg / room-view-speaker-menu.svg / room-view-gallery.svg / room-view-multispeaker.svg | 12, white (.8 in menu) |
| room-switch-native.svg | 16, white |
| room-chevron-right.svg | 16, white .8 (Sort Gallery By) |
| room-audio-disallowed.svg | 32×24, white + `#F05` (multi-color, kept) |
| room-video-disallowed.svg | 38×25, white + `#F05` |
| room-hosttools.svg | 24, white |
| room-warning.svg | 14×13, `#FAAC2A` |
| room-copy-url.svg | 24 (dark square `#222325`, border `#686F79`, glyph `#F7F9FA`) |
| room-copied-check.svg | 16, `#00A832` |
| room-popout.svg / room-close.svg / room-merge.svg / room-collapse-to-title.svg / room-expand-all.svg | 16, `#DFE3E8` (`#CAD1D5` in chat/host-tools) |
| room-back.svg | 20, `#DFE3E8` |
| room-pl-participants-list-audio-muted.svg / room-pl-participants-list-video-off.svg | 16, `#DE2828` |
| room-pl-video-on.svg | 16, `#747487` |
| room-pl-SvgEllipsis.svg | 16, `#DFE3E8` |
| room-network-good.svg | 16, white |
| room-more-show-captions / -breakout-rooms / -whiteboards / -settings / -stop-incoming-video .svg | 16, white |
| room-react-reactions-{1f44f,1f44d,1f602,1f62e,2764,1f389}.svg | 24, multi-color |
| room-react-nvf-{nvf_yes,nvf_no,nvf_slower,nvf_faster,nvf_coffee,270b,feedback_hourglass}.svg, room-react-icons-more.svg | 16 (more 16×4 `#F5F5F5`) |
| room-chat-SvgChatPersistentHeader.svg | 16, `#0E72ED` |
| room-chat-chat-format / -chat-emoji / -chat-more / room-chat-file2 .svg | 16, `#9DA5B5` |
| room-chat-chat-enter.svg | 16, `#6B7280` disabled / `#FFF` enabled |
| room-fmt-{bold,italic,underline,strikethrough,color,size,add-link,paragraph,bulleted-list,numbered-list,overflow}.svg | 24 (overflow 14), `#9DA5B5` |
| room-invite-default_email.png / room-invite-gmail.png / room-invite-yahoo_mail.png | 180×132 @2x → display 83×61 / 82×60 / 84×61 |
| room-sprite-check@2x.png | 13×12 menu check (white) |
| room-sprite-close-x@2x.png | 16×16 toast close (white) |
| room-sprite-tile-muted@1.43x.png | 16×16 name-tag muted mic (red) |
**68 files.** Already existing and reused: `mtg-mic-on/muted`, `mtg-video-on/off`, `mtg-participants`, `mtg-chat`, `mtg-react`, `mtg-share`, `mtg-more`, `mtg-end`, `caret-up`.

---

## Appendix A — Raw CSS (trimmed, from `styles.wc_meeting.min.css`, vendor prefixes removed)
Full file and extraction scripts: `scratchpad/room/wc_meeting.css`, `scratchpad/room/css.py`.

```css
/* ===== Header ===== */
.pop-panel__button-wrap{position:relative;display:flex}
.meeting-info-container .aic-panel-entry{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%!important;background:transparent;transition:background .2s ease}
.meeting-info-container .aic-panel-entry:hover,.meeting-info-container .aic-panel-entry:focus-visible{background:#6e768054}
.meeting-info-container{display:flex;justify-content:center;align-items:center;margin-left:auto;width:auto;height:22px;z-index:11;margin-right:12px}
.meeting-info-container__inner-icons{display:flex}
.meeting-info-container--hide{display:none!important}
.meeting-info-container__full-screen{position:relative;height:22px;display:flex;align-items:center;border-radius:8px;margin-left:10px}
.meeting-info-container .pop-panel__button:hover{color:#fffc;background:#3e3e3ee0}
.meeting-info-container .pop-panel__button:focus{color:#fffc;background:#4f4f4fe0}
.meeting-info-container .pop-panel__button:active{color:#fffc;background:#4f4f4fe0}
.meeting-info-container__wrapper{margin-right:4px;line-height:1;color:#fff}
.meeting-info-container.meeting-info-container-ze{margin-right:18px}
.switch-to-native-button{border:none;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;z-index:1}
.switch-to-native-button--desktop-icon{padding:4px;margin:0;background-color:#242424e0;border-radius:8px}
.switch-to-native-button--desktop-icon:hover{background-color:#3e3e3ee0;opacity:.8}
.switch-to-native-button--desktop-icon .switch-to-native-button__icon,.switch-to-native-button--desktop-icon svg{width:16px;height:16px;display:block}
.switch-to-native-button__chevron{display:block;fill:#fff}
.switch-to-native-button__relative-tooltip .relative-tooltip__triangle-wrap{right:12px;left:auto;transform:none}
.switch-to-native-button__icon{fill:#fff}
.meeting-header{position:absolute;height:48px;width:100%;background-color:#000000b2;display:flex;align-items:center;transition:-webkit-transform .2s ease-out;transition:transform .2s ease-out;transition:transform .2s ease-out,-webkit-transform .2s ease-out;z-index:200}
.meeting-header__hidable{background-color:#000000b3}
.meeting-header__hidden{transform:translateY(-48px)}
.meeting-header__leave-btn{margin-left:auto;margin-right:16px}
.meeting-header__info-side{margin-left:auto;display:flex;align-items:center;min-width:0}
.meeting-header__info-side .meeting-info-container{margin-left:0}
/* ===== Footer & toolbar buttons ===== */
.footer-item-disabled{opacity:.5}
.number-badge{display:inline-block;padding:0 4px;height:14px;line-height:13px;background:#e02828;color:#fff;border-radius:4px;text-align:center;font-size:12px}
.footer-button-base__button{position:relative;height:48px;cursor:pointer;background-color:transparent;min-width:80px;border-radius:8px;margin:2px 0 0;color:#fff}
.footer-button-base__button--drag-item-hover,.footer-button-base__button:hover{background:#ffffff17;color:#fffc}
.footer-button-base__button:focus-visible{background:#ffffff17;color:#fffc}
.footer-button-base__button:active{background:#ffffff2e;color:#fffc}
.footer-button-base__button--active-animate{color:#fff;animation:flash 1s forwards}
.footer-button-base__button--permission-btn{width:20px;border:none}
.footer-button-base__button--no-opacity:active{opacity:1!important}
.footer-button-base__img-layer{height:24px;margin-bottom:3px;display:flex;position:relative;align-items:center;justify-content:center;transition:.2s all ease-in}
.footer-button-base__img-layer--left{padding-left:2px}
.footer-button-base__img-layer--right{padding-right:2px}
.footer-button-base__button-label{max-width:120px;margin:0 12px;word-break:break-all;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;transition:.2s all ease-in;font-size:12px;line-height:16px}
.footer-button-base__number-counter{color:#dcdcdc;position:relative;bottom:4px;left:24px;width:20px;margin:auto;font-size:11px;text-align:left}
.footer-button-base--disable{opacity:.5;pointer-events:none}
.footer-button-base__floating-toggle.btn-group{border-radius:6px;position:absolute;right:2px;top:2px;height:26px;width:20px}
.footer-button-base__button:focus:not(:focus-visible){outline:none;box-shadow:none}
.footer--desktop-layout .footer-button-base__button:not(.footer-sub-toggle-base){min-width:86px;transition:none}
.footer--desktop-layout .footer-button-base__button:not(.footer-sub-toggle-base):hover,.footer--desktop-layout .footer-button-base__button:not(.footer-sub-toggle-base):focus-visible{background:#6e768054}
.footer--desktop-layout .footer-button-base__img-layer{margin-bottom:0}
.footer--desktop-layout .footer-button-base__button-label{color:#fff;margin:4px 12px 0}
.footer-button-base__button.send-video-container__btn,.footer-button-base__button.join-audio-container__btn{line-height:1}
.footer-button__wrapper{position:relative}
.footer-button__button--active-animate{color:#fff;animation:flash 1s forwards}
.footer-button__button--permission-btn{width:20px;border:none}
.footer-button__button--no-opacity:active{opacity:1!important}
.footer-button__number-counter{color:#fffc;position:absolute;top:-2px;left:calc(50% + 8px);font-size:11px;text-align:center;width:22px}
.footer-button__number-badge-wrapper{color:#fffc;position:absolute;top:-3px;right:50%;transform:translate(100%) scale(.9);font-size:11px;text-align:left;padding:0 0 2px 2px;background:#000c;border-radius:6px}
.footer-button__number-badge-wrapper--hovered{background:#333332}
.footer-button__number-badge-wrapper--unread{top:-8px;padding:0;background:transparent;border-radius:0;transform:translate(100%)}
.footer-button__number-badge-wrapper--unread.footer-button__number-badge-wrapper--hovered{background:transparent}
.footer-button__number-badge-wrapper--unread .number-badge{display:flex;align-items:center;justify-content:center;box-sizing:border-box;min-width:18px;height:18px;padding:0 4px;line-height:normal;font-size:12px;border:2px solid #FFFFFF;border-radius:10px}
.footer-button__number-badge-wrapper--right{right:37%}
.footer-button--disable{opacity:.5;pointer-events:none}
.footer-button__floating-toggle.btn-group{border-radius:6px;position:absolute;right:2px;top:2px;height:26px;width:20px}
.footer-sub-toggle-base{width:20px;height:24px;border-radius:6px;min-width:20px;max-width:20px}
.footer-sub-toggle-base__icon{font-size:12px}
.footer--desktop-layout .footer-sub-toggle-base{margin:4px;display:flex;align-items:center;justify-content:center}
.footer--desktop-layout .footer-button-base__button.footer-sub-toggle-base:hover,.footer--desktop-layout .footer-button-base__button.footer-sub-toggle-base:focus-visible{background:#ffffff54}
.footer--desktop-layout .footer-button-base__button:not(.footer-sub-toggle-base):hover~* .footer-button-base__button.footer-sub-toggle-base{background:#6e768054}
.footer-chat-button .footer-chat-button__settings-drop-down-menu--checked:before{display:inline-block;background:url(../image/wc_sprites.png);background-size:416px 384px}
.footer-chat-button{position:relative}
.footer-chat-button .footer-chat-button__settings-drop-down-menu{text-align:left;background:#111c;bottom:100%}
.footer-chat-button .footer-chat-button__settings-drop-down-menu a{color:#999;padding:5px 20px 5px 39px;position:relative;font-size:12px}
.footer-chat-button .footer-chat-button__settings-drop-down-menu a:focus{color:#999;background:transparent;outline:1px solid #FFFFFF}
.footer-chat-button .footer-chat-button__settings-drop-down-menu a:hover{color:#ddd;background:#ffffff1a}
.footer-chat-button .footer-chat-button__settings-drop-down-menu--checked:before{content:"";background-position:-386px -6px;width:13px;height:12px;position:absolute;left:10px;top:6px}
.footer-chat-button .footer-chat-button__settings-drop-down-menu--disabled{cursor:not-allowed;color:#707070!important}
.footer-chat-button .footer-chat-button__settings-container{position:absolute;top:0;right:0}
.footer-chat-button .footer-chat-button__settings-toggle-button{width:20px;height:24px}
.footer-button-base__button.sharing-entry-button-container--green:active,.footer-button-base__button.sharing-entry-button-container--green:hover{color:#25e55f}
.footer-button-base__button.sharing-entry-button-container--green:focus{color:#25e55f}
.footer-participants-button__popup-menu--checked:before{display:inline-block;background:url(../image/wc_sprites.png);background-size:416px 384px}
.footer-participants-button__container{position:absolute;right:0;top:0;background-color:transparent}
.footer-participants-button__toggle-button{width:20px;height:24px}
.footer-participants-button__popup-menu{text-align:left;background:#111c;bottom:54px}
.footer-participants-button__popup-menu a{color:#999;padding:5px 20px 5px 39px;position:relative;font-size:12px}
.footer-participants-button__popup-menu a:focus{color:#999;background:transparent;outline:1px solid #FFFFFF}
.footer-participants-button__popup-menu a:hover{color:#ddd;background:#ffffff1a}
/* ===== Toasts / notifications ===== */
.notification-message-wrap{display:flex;align-items:center;justify-content:center;margin:0 auto;max-width:750px;pointer-events:auto}
.notification-message-wrap:not(:first-child){margin-top:10px}
.notification-message-wrap__layer{display:flex;width:100%;padding:14px 16px;box-sizing:border-box;align-items:center;border-radius:14px;font-size:14px;color:#fffc;background:#000000ed}
.notification-message-wrap__txt{flex-grow:1;font-weight:400;margin-right:10px;display:flex;align-items:center}
.notification-message-wrap__txt-container{max-width:100%;word-wrap:break-word;word-break:break-word;text-align:left}
.notification-message-wrap__btns{display:flex;padding:0 8px}
.notification-message-wrap__btns button{height:24px;border-radius:6px;font-size:13px}
.notification-message-wrap__btns .dark{background:#ffffff17;border:none;color:#fff}
.notification-message-wrap__btns .dark:hover{background:#ffffff2e}
.notification-message-wrap__close{cursor:pointer;margin:0 2px}
.notification-message-wrap.permission-allow-tip .notification-message-wrap__layer{background:#fff;backdrop-filter:blur(0px)}
.notification-message-wrap.permission-allow-tip .allow-tip-box{text-align:center;font-size:18px}
.notification-message-wrap.permission-allow-tip .allow-tip-box .allow-tip-title{font-weight:600;color:#333}
.notification-message-wrap.permission-allow-tip .allow-tip-box .allow-tip-desc{color:#666}
.notification-message-wrap.notification-message-wrap--dark .notification-message-wrap__layer{border:none}
.notification-message-wrap.permission-allow-tip.notification-message-wrap--dark .notification-message-wrap__layer{background:#1d1e20}
.notification-message-wrap.permission-allow-tip.notification-message-wrap--dark .allow-tip-box .allow-tip-title,.notification-message-wrap.permission-allow-tip.notification-message-wrap--dark .allow-tip-box .allow-tip-desc{color:#fff}
.notification-message-wrap__close.close-jd{margin:0 2px}
.notification-manager{position:absolute;width:100%;display:flex;flex-direction:column;align-items:center;top:10px;z-index:999;margin:0 auto;left:0;right:0;pointer-events:none}
.notification-manager .host-full-control-notification-tip svg{margin-right:8px}
.wc-tooltip{position:absolute;left:50%;top:-72px;background-color:#212326;border-radius:5px;color:#fff;padding:20px 30px;min-width:220px;transform:translate(-50%)}
.tooltip-content{white-space:nowrap;font-size:14px;margin-bottom:0}
.wc-tooltip:after{content:"";position:absolute;left:50%;bottom:-8px;margin-left:-10px;width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-top:8px solid #212326}
/* ===== Video tiles & name tags ===== */
.video-avatar__avatar-name{word-wrap:break-word;word-break:break-word}
.video-avatar__avatar{top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;align-content:center}
.video-avatar__avatar ::-webkit-scrollbar-thumb{background:#707070}
.video-avatar__avatar ::-webkit-scrollbar{width:8px}
.video-avatar__avatar .avatar-menu__item--warning>a{color:#e02828!important}
.video-avatar__avatar .avatar-more-xs-btn{padding:1px 5px}
.video-avatar__avatar .avatar-more-xs-btn.more-btn{padding:4px}
.video-avatar__avatar-notification{max-width:100%;top:8px;position:absolute;left:50%;transform:translate(-50%)}
.video-avatar__avatar-notification__display-text{white-space:nowrap;text-overflow:ellipsis;overflow:hidden;margin:0 3px;flex:1}
.video-avatar__avatar-footer{display:flex;align-items:center;position:absolute;margin-left:4px;margin-bottom:4px;font-size:12px;color:#fff;max-width:calc(100% - 6px);padding:3px 5px 3px 0;text-align:left;background:#0000008f;border-radius:4px;transition:bottom .2s ease-out}
.video-avatar__avatar-footer span{white-space:nowrap;text-overflow:ellipsis;overflow:hidden;margin-left:3px;flex:1}
.video-avatar__avatar-footer .video-avatar__deepfake-badge,.video-avatar__avatar-footer .video-avatar__deepfake-pill{flex:none;margin-left:3px}
.video-avatar__avatar-footer--pin-icon{display:inline-block;background-position:-81px -84px;width:16px;height:16px;background-size:582.4px 537.6px}
.video-avatar__avatar-footer--spotlight-icon{display:inline-block;background-position:-114px -84px;width:16px;height:16px;background-size:582.4px 537.6px}
.video-avatar__avatar-footer--view-mute-computer{display:inline-block;background-position:-148px -84px;width:16px;height:16px;background-size:582.4px 537.6px}
.video-avatar__avatar-footer--view-mute-phone{display:inline-block;background-position:-181px -84px;width:16px;height:16px;background-size:582.4px 537.6px}
.video-avatar__avatar-footer--branded{height:30px;background-color:#afd784;font-size:12px;line-height:15px;color:#222230;border-radius:6px}
.video-avatar__avatar-footer--icon-bg{display:inline-flex;align-items:center;justify-content:center;height:24px;margin-left:3px;padding:0 4px;background-color:#000c;border-radius:6px}
.video-avatar__avatar-footer--tag{flex:1;margin-left:3px;overflow:hidden}
.video-avatar__avatar-footer--tag-title{font-weight:600;text-overflow:ellipsis;overflow:hidden;white-space:nowrap}
.video-avatar__avatar-footer--tag-desc{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}
.video-avatar__avatar-minimizefooter{height:16px;line-height:16px;border-radius:4px;margin:2px;padding:0 4px!important;background:#0000008f}
.video-avatar__avatar-minimizefooter span{margin-left:0}
.video-avatar__avatar-name{color:#fff;font-weight:500;max-width:95%;margin:0 auto;text-overflow:ellipsis;overflow:hidden;white-space:nowrap}
.video-avatar__avatar-title{width:100%;text-align:center}
.video-avatar__avatar-img{pointer-events:none;width:40%;max-width:-webkit-max-content;max-width:-moz-max-content;max-width:max-content}
[@media screen and (max-height:720px)] .video-avatar__avatar-footer{font-size:15px}
.speaker-bar-container__horizontal-view-wrap{width:100%;height:120px;padding:3px 0}
.speaker-bar-container__video-frame--active .video-avatar__avatar{position:relative;box-shadow:inset 0 0 0 2px #48dd5d}
.speaker-active-container__video-frame--active .video-avatar__avatar{position:relative;box-shadow:inset 0 0 0 2px #48dd5d}
.gallery-video-container__main-view{height:100%;display:flex;justify-content:center;align-items:center}
.gallery-video-container__main-view--speak-view{height:calc(100% - 120px)}
.gallery-video-container__video-frame--active .video-avatar__avatar{position:relative;box-shadow:inset 0 0 0 2px #48dd5d}
.multi-speaker-main-container__video-frame--active .video-avatar__avatar{position:relative;box-shadow:inset 0 0 0 2px #48dd5d}
.multi-speaker-active-container__video-frame--active .video-avatar__avatar{position:relative;box-shadow:inset 0 0 0 2px #48dd5d}
/* ===== Dark dropdown menus ===== */
.dark-dropdown{font-size:13px;background:#000000fc;border:1px solid rgba(255,255,255,.12);box-shadow:0 8px 24px #0000004d;border-radius:8px;text-align:left}
.dark-dropdown a:focus{outline:1px solid #ffffff}
.dark-dropdown .dropdown-header{color:#f5f5f5;padding-left:16px;font-weight:700}
.dark-dropdown .dropdown-item{margin:0 2px;padding-left:28px;color:#fffc;display:flex;align-items:center}
.dark-dropdown .dropdown-item:hover{background:#2b2b2b}
.dark-dropdown .dropdown-item:focus{background:#2b2b2b}
.dark-dropdown.center-of-footer-button{left:50%;transform:translate(-50%)}
.dark-dropdown.center-of-footer-button li[role=presentation] a[role=menuitem]{text-decoration:none;padding:2px 24px}
.common-ui-component__dropdown-divider{width:100%;height:1px;background:#747487;content:""}
.common-ui-component__dropdown-divider2{width:100%;height:1px;background:#ffffff17;content:""}
.common-ui-component__dropdown-divider,.common-ui-component__dropdown-divider2{margin:9px auto}
.full-screen-widget__pop-menu--checked.dropdown-item:before{display:inline-block;background:url(../image/wc_sprites.png);background-size:416px 384px}
.full-screen-widget__pop-menu{text-align:left;background:#000c;font-size:12px;left:auto;right:0;top:34px;border:1px solid rgba(255,255,255,.12);box-shadow:0 8px 24px #0003;border-radius:4px;min-width:244px}
.full-screen-widget__pop-menu .common-ui-component__dropdown-divider{background:#ffffff17}
.full-screen-widget__pop-menu>.dropdown-item{color:#fffc;padding:5px 28px 5px 39px;position:relative}
.full-screen-widget__pop-menu>.dropdown-item:focus{color:#999;background:transparent;outline:1px solid #FFFFFF}
.full-screen-widget__pop-menu>.dropdown-item:hover{color:#fffc;background:#ffffff1a}
.full-screen-widget__pop-menu--checked.dropdown-item:before{content:"";background-position:-386px -6px;width:13px;height:12px;position:absolute;left:10px;top:8px}
.full-screen-widget__pop-menu--title{color:#fffc;font-size:13px;padding:5px 20px 5px 15px}
.full-screen-widget__pop-menu--icon{position:absolute;right:4px;top:7px;margin-right:4px}
.full-screen-widget__pop-menu--arrowicon{top:6px}
.full-screen-widget__pop-menunew{min-width:217px}
.full-screen-widget__pop-menunew--title{padding:7px 24px 5px;color:#707070;font-size:13px;cursor:default}
.full-screen-widget__pop-menunew>.dropdown-item{padding:5px 28px 5px 26px}
.full-screen-widget__button{display:flex;align-items:center;cursor:pointer;border:none;background-color:transparent;color:#fff;border-radius:8px;padding:4px 6px;font-size:12px;height:24px}
.full-screen-widget__button:hover{background-color:#3e3e3ee0;color:#fffc}
.full-screen-widget__button:focus{color:#fffc;background:#4f4f4fe0}
.full-screen-widget__button:active{color:#fffc;background:#4f4f4fe0}
.audio-option-menu__pop-menu--checked:before{display:inline-block;background:url(../image/wc_sprites.png);background-size:416px 384px}
.audio-option-menu__pop-menu{text-align:left;background:#111c;bottom:54px}
.audio-option-menu__pop-menu>.dropdown-header{font-size:12px;color:#ddd;padding-left:16px}
.audio-option-menu__pop-menu.dropdown-menu.dark-dropdown>.dropdown-item{position:relative;font-size:12px;display:block}
.audio-option-menu__pop-menu.dropdown-menu.dark-dropdown>.dropdown-item:focus{color:#999;background:transparent;outline:1px solid #ffffff}
.audio-option-menu__pop-menu.dropdown-menu.dark-dropdown>.dropdown-item:hover{color:#ddd;background:#ffffff1a}
.audio-option-menu__pop-menu--checked:before{content:"";background-position:-386px -6px;width:13px;height:12px;position:absolute;left:10px;top:8px}
.video-option-menu__pop-menu--checked.dropdown-item:before,.video-option-menu__icon{display:inline-block;background:url(../image/wc_sprites.png);background-size:416px 384px}
.video-option-menu__pop-menu--checked.dropdown-item:before{content:"";background-position:-386px -6px;width:13px;height:12px;position:absolute;left:10px;top:8px}
.dark-dropdown,.second-level-dropdown .dropdown-menu{font-size:13px;background:#000000fc;border:1px solid rgba(255,255,255,.12);box-shadow:0 8px 24px #0000004d;border-radius:8px;text-align:left}
.dark-dropdown a:focus,.second-level-dropdown .dropdown-menu a:focus{outline:1px solid #ffffff}
.dark-dropdown .dropdown-header,.second-level-dropdown .dropdown-menu .dropdown-header{color:#f5f5f5;padding-left:16px;font-weight:700}
.dark-dropdown .dropdown-item,.second-level-dropdown .dropdown-menu .dropdown-item{margin:0 2px;padding-left:28px;color:#fffc;display:flex;align-items:center}
.dark-dropdown .dropdown-item:hover,.second-level-dropdown .dropdown-menu .dropdown-item:hover{background:#2b2b2b}
.dark-dropdown .dropdown-item:focus,.second-level-dropdown .dropdown-menu .dropdown-item:focus{background:#2b2b2b}
.dark-dropdown.center-of-footer-button,.second-level-dropdown .center-of-footer-button.dropdown-menu{left:50%;transform:translate(-50%)}
.dark-dropdown.center-of-footer-button li[role=presentation] a[role=menuitem],.second-level-dropdown .center-of-footer-button.dropdown-menu li[role=presentation] a[role=menuitem]{text-decoration:none;padding:2px 24px}
.security-option-menu__pop-menu--checked.dropdown-item:before,.security-option-menu__button-icon{display:inline-block;background:url(../image/wc_sprites.png);background-size:416px 384px}
.security-option-menu__pop-menu--checked.dropdown-item:before{content:"";background-position:-386px -6px;width:13px;height:12px;position:absolute;left:10px;top:7px}
.interpretation-menu__pop-menu--checked.dropdown-item:before{display:inline-block;background:url(../image/wc_sprites.png);background-size:416px 384px}
.interpretation-menu__pop-menu--checked.dropdown-item:before{content:"";background-position:-386px -6px;width:13px;height:12px;position:absolute;left:10px;top:8px}
.dropdown-menu.dark-dropdown{font-size:13px;background:#000000fc;border:1px solid rgba(255,255,255,.12);box-shadow:0 8px 24px #0000004d;border-radius:8px}
.dropdown-menu.dark-dropdown a:focus{outline:1px solid #ffffff!important}
/* ===== Right panels ===== */
.wc-container-right--dark{padding-right:2px;padding-bottom:4px}
.wc-container-right-2--dark{background-color:#040506}
.panel-shell{display:flex;flex:1;flex-direction:column;overflow:hidden;border:1px solid #313235;margin-top:4px;border-radius:15px}
.panel-shell--half{flex:5}
.panel-shell--mini{flex:none;height:44px}
.panel-shell--dark{background-color:#1d1e20;color:#f7f9fa}
.panel-shell__content{display:flex;flex:1;flex-direction:column;min-height:0;padding:8px 0}
.panel-shell-header__header{position:relative;display:flex;flex-wrap:nowrap;align-items:center;width:100%;font-size:14px;font-weight:500;padding:12px 16px;color:#f7f9fa;background-color:#1d1e20;border-bottom:1px solid #313235}
.panel-shell-header__leading{position:absolute;left:16px}
.panel-shell-header__back{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;padding:0;border:0;background:transparent;color:#dfe3e8}
.panel-shell-header__back:hover,.panel-shell-header__back:focus{background-color:#6e768054;border-radius:4px;outline:0}
.panel-shell-header__back-icon{width:20px;height:20px}
.panel-shell-header__operate svg rect{fill:#dfe3e8}
.panel-shell-header__title{margin:0 auto;flex:1;text-align:center}
.panel-shell-header__operate{position:absolute;right:16px}
.panel-shell-header__operate>button:not(:last-child){margin-right:8px}
.participants-icon__action{flex-direction:row;cursor:pointer;padding:5px;border-radius:6px}
.participants-icon__action>.participants-icon__icon-box{padding:0}
.participants-icon__action.btn:active,.participants-icon__action.btn:focus,.participants-icon__action.btn:focus-visible{color:unset;background-color:unset;border-color:initial;box-shadow:unset}
.participants-icon__action.btn:hover{background-color:#00000073}
.participants-item__right-section--icons{display:flex;justify-content:flex-end;align-items:center;flex-shrink:0;gap:4px}
.participants-item__item-layout{display:flex;justify-content:space-between;white-space:nowrap}
.participants-item__right-section{display:flex;justify-content:flex-end;align-items:center;flex-shrink:0}
.participants-item__right-section--buttons{display:flex;gap:5px}
.participants-item__right-section--buttons .btn-sm{--bs-btn-padding-y: 2px;--bs-btn-padding-x: 5px;--bs-btn-font-size: 12px;--bs-btn-border-radius: 6px;border-radius:6px}
.participants-item__right-section--buttons .btn-sm .caret{display:inline-block;width:0;height:0;margin-left:2px;vertical-align:middle;border-top:4px solid;border-right:4px solid transparent;border-left:4px solid transparent}
.participants-item__avatar{height:32px;margin-right:12px;width:32px;border-radius:10px;flex:0 0 32px;display:inline-block}
.participants-item__avatar--opacity{opacity:.5}
.new-dropdown-menu .disabled>a:hover,.new-dropdown-menu .disabled>button:hover{cursor:not-allowed;color:#999}
.participants-section-container--dark .participants-li{color:#fff;background-color:transparent}
.participants-section-container--dark .participants-li:hover{background-color:#313235}
.participants-section-container--dark .participants-li-selected{background-color:#303030}
body:has(.participants-section-container--dark) .new-dropdown-menu{background-color:#2a2b2d;border:1px solid #313235;border-radius:8px;box-shadow:0 8px 24px #0000007a}
body:has(.participants-section-container--dark) .new-dropdown-menu .zmu-portal-dropdown__menu-item:hover,body:has(.participants-section-container--dark) .new-dropdown-menu .zmu-portal-dropdown__menu-item:focus-within{background-color:#6e768054}
body:has(.participants-section-container--dark) .new-dropdown-menu .zmu-portal-dropdown__menu-item-button{color:#f7f9fa;background:transparent;border:none;outline:none}
body:has(.participants-section-container--dark) .new-dropdown-menu .zmu-portal-dropdown__menu-item-button:hover,body:has(.participants-section-container--dark) .new-dropdown-menu .zmu-portal-dropdown__menu-item-button:focus,body:has(.participants-section-container--dark) .new-dropdown-menu .zmu-portal-dropdown__menu-item-button:active{color:#f7f9fa;background-color:#6e768054;text-decoration:none;o
body:has(.participants-section-container--dark) .new-dropdown-menu .disabled .zmu-portal-dropdown__menu-item-button{color:#596069}
body:has(.participants-section-container--dark) .new-dropdown-menu .disabled>a:hover,body:has(.participants-section-container--dark) .new-dropdown-menu .disabled>button:hover{color:#596069}
.participants-section-container--dark .participants-section-container__buttom-button{border:none;background-color:#2a2b2d;color:#fff;border-radius:20px;padding:6px 24px}
.participants-section-container--dark .participants-section-container__buttom-button:hover{background-color:#6e768054}
.new-dropdown-menu{min-width:160px;padding:5px 0;margin:2px 0 0;font-size:14px;list-style:none;background-color:#fff;background-clip:padding-box;border:1px solid rgba(0,0,0,.15);border-radius:4px;box-shadow:0 6px 12px #0000002e;z-index:2000}
.new-dropdown-menu .zmu-portal-dropdown__menu-item.disabled:hover{background:inherit}
.new-dropdown-menu .zmu-portal-dropdown__menu-item.disabled .zmu-portal-dropdown__menu-item-button{cursor:not-allowed;color:#999;pointer-events:none}
.new-dropdown-menu .zmu-portal-dropdown__menu-item-button{display:block;padding:3px 20px;clear:both;font-weight:400;line-height:1.42857143;color:#333;white-space:nowrap;font-size:12px;text-decoration:none}
/* ===== Chat ===== */
.disclaimer__icon{display:inline-block;background:url(../image/wc_sprites2.png);background-size:416px 384px}
.disclaimer__body-part{margin:0;padding:0 0 12px}
.disclaimer__body-part>ul{margin-bottom:0}
.disclaimer__button-text{font-size:12px;color:#0404138f;line-height:24px}
.disclaimer__button-wrap{background:#f7f7fc;display:flex;justify-content:center;align-items:center;height:24px;width:100%}
.disclaimer__button-wrap:hover{background:#52528017}
.disclaimer__icon{background-position:-373px -34px;width:14px;height:14px;margin-right:4px}
.chat-container--dark .disclaimer__button-wrap .disclaimer__icon{filter:none;background-position:-397px -34px}
.chat-container--dark .disclaimer__button-text{color:#ffffff8f}
.chat-container--dark .disclaimer__button-wrap{background:#ffffff0f}
.chat-container--dark .disclaimer__button-wrap:hover{background:#ffffff1a}
.chat-container--dark .chat-more-options__header-menu{color:#f5f7fb}
.chat-container--dark .chat-more-options__chat-control-more .dropdown-toggle{border-color:transparent;background-color:transparent;color:#9da5b5;transition:background-color .15s ease}
.chat-container--dark .chat-more-options__chat-control-more .dropdown-toggle:hover{background-color:#ffffff14;color:#fff}
.chat-container--dark .chat-more-options__chat-control-more .dropdown-menu{background:#1d1e20;border:1px solid #333}
.chat-container--dark .chat-more-options__chat-control-more .dropdown-menu .dropdown-item{color:#dfe3e8}
.chat-container--dark .chat-more-options__chat-control-more .dropdown-menu .dropdown-item:hover,.chat-container--dark .chat-more-options__chat-control-more .dropdown-menu .dropdown-item:focus{color:#dfe3e8;background-color:#313235}
.chat-container--dark .chat-more-options__chat-control-more .dropdown-menu .dropdown-item.selected:before{border-left-color:#f5f7fb;border-bottom-color:#f5f7fb}
.chat-header__meeting-topic{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}
.chat-header__header{display:flex;flex-wrap:nowrap;width:100%;font-size:14px;font-weight:700;border-top:1px solid #eee;padding:6px;justify-content:center;align-items:center}
.chat-header__link{color:#0052cc}
.chat-header__meeting-topic{margin-left:4px;flex:1}
.chat-header__title-wrap{position:relative;flex:1;width:0;padding-right:8px}
.chat-header__title-wrap--guest .relative-tooltip{transform:translate(-50%);left:50%}
.chat-header__title-wrap--guest .relative-tooltip__triangle-wrap{left:50%}
.chat-header__title-wrap--non-guest .relative-tooltip{left:-8px}
.chat-header__title-wrap--non-guest .relative-tooltip__triangle-wrap{left:initial;left:13px}
.chat-header__title-wrap .relative-tooltip{color:#000;background:#fff;top:calc(100% + 5px);position:absolute;z-index:2}
.chat-header__title-wrap .relative-tooltip__triangle{background:#fff}
.chat-header__title-wrap .zmu-btn{height:auto;padding:4px 8px;font-size:13px;border-radius:6px;float:right;margin:4px 4px 0 0}
.chat-header__title .chat-header__meeting-topic{padding:0 20px;margin-right:40px}
.chat-header__title .chat-header__title-wrap,.chat-header__title{display:flex;justify-content:center;align-items:center}
.chat-header__title-name{padding:4px;display:flex;align-items:center}
.chat-header__title-name--button{border-radius:6px}
.chat-header__title-name--button:hover{background:#d0e3fb}
.chat-header__title-name--button-disable rect{fill:#8e9194}
.chat-header__title{margin:0 auto;flex:1;text-align:center}
.chat-header__operate{position:absolute;right:10px}
.chat-header__operate>button:not(:last-child){margin-right:8px}
.chat-container--dark .chat-header__header{border-top-color:#313235;color:#f5f7fb;background-color:#1d1e20}
.chat-container--dark .chat-header__link{color:#75aff5}
.chat-container--dark .chat-header__title-wrap .relative-tooltip{color:#f5f7fb;background:#333}
.chat-container--dark .chat-header__title-wrap .relative-tooltip__triangle{background:#333}
.chat-container--dark .chat-header__title-name--button:hover{background:#ffffff14}
.chat-container--dark .chat-header__operate svg rect{fill:#cad1d5}
.chat-receiver-list__to-text{padding:2px 0;margin-right:5px}
.chat-receiver-list__read-only-receiver{max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.chat-receiver-list__read-only-receiver--margin{margin-left:5px}
.chat-receiver-list__menu{font-size:12px}
.chat-receiver-list__menu-item{position:relative;min-width:200px;max-width:320px;display:flex;padding:3px 20px 3px 25px;clear:both;font-weight:400;line-height:1.5;color:#333;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:12px}
.chat-receiver-list__menu-item:hover{color:#262626;text-decoration:none;background-color:#f5f5f5}
.chat-receiver-list__menu-item:focus{color:#262626;text-decoration:none;background-color:#f5f5f5}
.chat-receiver-list__menu-item--in-window{max-width:350px}
.chat-receiver-list__menu-item--checked:before{content:"";width:11px;height:5px;position:absolute;left:9px;top:9px;transform:rotate(-45deg);border-left:1px solid #555555;border-bottom:1px solid #555555}
.chat-receiver-list__scrollbar{max-height:200px}
.chat-receiver-list__receiver{background:#0e72ed!important;color:#fff!important;padding:2px 15px;border-radius:10.5px;font-size:12px;cursor:pointer;border:none;max-width:180px;text-wrap:nowrap;overflow:hidden;text-overflow:ellipsis;display:inline-block;flex-shrink:1;min-width:0}
.chat-receiver-list__label{text-overflow:ellipsis;overflow:hidden;text-wrap:nowrap}
.chat-receiver-list__appendix{margin-left:4px;color:#b0b0b0;flex-shrink:0}
.chat-receiver-list__privately-chat{margin-left:5px;color:red;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex-shrink:0;max-width:140px}
.chat-container--dark .chat-receiver-list__menu-item{color:#dfe3e8}
/* ===== Dialogs / modals ===== */
.zm-modal--dark .zm-checkbox:before{border-color:#555;background-image:-webkit-gradient(linear,left top,left bottom,from(#3a3a3a),color-stop(30%,#333));background-image:linear-gradient(to bottom,#3a3a3a,#333 30%)}
.zm-modal--dark .zm-checkbox:active:before{background-image:-webkit-gradient(linear,left top,left bottom,from(#313235),color-stop(30%,#3a3a3a));background-image:linear-gradient(to bottom,#313235,#3a3a3a 30%)}
.zm-modal--dark .zm-checkbox-message{color:#fff}
.zm-modal{background:#fff;position:relative;padding:32px 32px 24px;border:1px solid rgba(186,186,204,.2);box-shadow:0 8px 24px #2323331a;border-radius:12px;width:480px;color:#232333;pointer-events:auto}
.zm-modal .simulive-dialog .zm-modal-body-title{display:none}
.zm-modal .simulive-dialog .zm-modal-body-content{padding-top:0}
.zm-modal .zm-modal-close{position:absolute;top:16px;right:20px;padding:0;display:inline-block;border:0;background:none;cursor:pointer;height:16px}
.zm-modal .zm-modal-body{word-break:break-word}
.zm-modal .zm-modal-body-title{font-size:20px;font-weight:700;padding:0;min-height:16px}
.zm-modal .zm-modal-body-content{font-size:14px;padding:8px 0 0;min-height:38px;max-height:400px;overflow:auto}
.zm-modal .zm-modal-footer{padding:26px 0 0}
.zm-modal .zm-modal-footer-default{display:flex;align-items:center;justify-content:flex-end}
.zm-modal .zm-modal-footer-default-checkbox{flex-grow:1;font-size:15px;color:#232333}
.zm-modal .zm-modal-footer-default-anchor{flex-grow:1;font-size:15px;text-decoration:none;color:#0e72ed;flex:1;text-overflow:ellipsis;overflow:hidden;white-space:nowrap}
.zm-modal .zm-modal-footer-default-actions{margin-left:30px;justify-self:flex-end;display:flex}
.zm-modal .zm-modal-footer-default .zm-btn{margin-left:12px}
.zm-modal .zm-modal-footer-body-checkbox{padding-left:5px}
.zm-modal .zm-btn--primary{font-weight:700}
.zm-modal .archiving__account-owner{color:#1890ff;text-decoration:underline}
.zm-modal.new-modal-style{width:600px;padding:24px}
.zm-modal.new-modal-style .zm-modal-body-title{color:#131619;font-size:24px;line-height:32px}
.zm-modal.new-modal-style .zm-modal-body-content{font-size:16px}
.zm-modal--dark{background:#1d1e20;color:#fff;border-color:#333;box-shadow:0 8px 24px #0006}
.zm-modal--dark .zm-modal-body-title,.zm-modal--dark .zm-modal-body-content,.zm-modal--dark .zm-modal-footer-default-checkbox{color:#fff}
.zm-modal--dark .zm-modal-footer-default-anchor{color:#75aff5}
.zm-modal--dark .zm-modal-footer-default .zm-btn{color:#fff;background-color:#3a3a3a;border-color:#3a3a3a}
.zm-modal--dark .zm-modal-footer-default .zm-btn:hover{background-color:#444}
.zm-modal--dark .zm-modal-footer-default .zm-btn--primary{color:#fff;background-color:#0e71eb;border-color:#0e71eb}
.zm-modal--dark .zm-modal-footer-default .zm-btn--primary:hover{background-color:#0d65d4}
.zm-modal--dark .zm-modal-footer-default .zm-btn--error{color:#fff;background-color:#de2828;border-color:#de2828}
.zm-modal--dark .zm-modal-footer-default .zm-btn--error:hover{background-color:#ca2424}
.zm-modal--dark input[type=text],.zm-modal--dark input[type=tel],.zm-modal--dark input[type=number],.zm-modal--dark input:not([type]),.zm-modal--dark textarea{background-color:#1d1e20;border:1px solid #555B62;color:#fff;border-radius:6px}
.zm-modal--dark input[type=text]::-webkit-input-placeholder,.zm-modal--dark input[type=tel]::-webkit-input-placeholder,.zm-modal--dark input[type=number]::-webkit-input-placeholder,.zm-modal--dark input:not([type])::-webkit-input-placeholder,.zm-modal--dark textarea::-webkit-input-placeholder{color:#596069}
.zm-modal--dark input[type=text]::-moz-placeholder,.zm-modal--dark input[type=tel]::-moz-placeholder,.zm-modal--dark input[type=number]::-moz-placeholder,.zm-modal--dark input:not([type])::-moz-placeholder,.zm-modal--dark textarea::-moz-placeholder{color:#596069}
.zm-modal--dark input[type=text]:-ms-input-placeholder,.zm-modal--dark input[type=tel]:-ms-input-placeholder,.zm-modal--dark input[type=number]:-ms-input-placeholder,.zm-modal--dark input:not([type]):-ms-input-placeholder,.zm-modal--dark textarea:-ms-input-placeholder{color:#596069}
.zm-modal--dark input[type=text]::-ms-input-placeholder,.zm-modal--dark input[type=tel]::-ms-input-placeholder,.zm-modal--dark input[type=number]::-ms-input-placeholder,.zm-modal--dark input:not([type])::-ms-input-placeholder,.zm-modal--dark textarea::-ms-input-placeholder{color:#596069}
.zm-modal--dark input[type=text]::placeholder,.zm-modal--dark input[type=tel]::placeholder,.zm-modal--dark input[type=number]::placeholder,.zm-modal--dark input:not([type])::placeholder,.zm-modal--dark textarea::placeholder{color:#596069}
.zm-modal--dark input[type=text]:focus,.zm-modal--dark input[type=tel]:focus,.zm-modal--dark input[type=number]:focus,.zm-modal--dark input:not([type]):focus,.zm-modal--dark textarea:focus{border-color:#0e71eb;outline:none;box-shadow:0 0 0 1px #0e71eb}
.zm-modal--dark label{color:#fff}
.zm-modal--dark .zm-modal-close svg path{fill:#fff}
.zm-modal--dark .archiving__account-owner{color:#75aff5}
.zm-modal--dark .archiving__account-owner:focus,.zm-modal--dark .archiving__account-owner:hover{color:#75aff5}
.zm-modal-nocontent>.zm-modal-body>.zm-modal-body-content{display:none}
.zm-modal .zm-btn.remote-focused{outline:4px solid #CF4B0A;outline-offset:4px;transition:none}
[@media screen and (min-height:280px)and (max-height:480px)and (orientation:landscape)] .zm-modal.whiteboard-permission-dialog{max-height:70vh;overflow:auto;touch-action:pan-y!important}
.zm-modal--dark.pepc-permission-dialog-container .pepc-permission-dialog__title{color:#fff}
.zm-modal--dark.pepc-permission-dialog-container .pepc-permission-dialog__desc{color:#9da5b5}
.zm-modal--dark.pepc-permission-dialog-container .pepc-permission-dialog__footer{color:#75aff5}
.zm-modal--dark.ask-permission-prompt-container .desc-primary{color:#fff}
.zm-modal--dark.ask-permission-prompt-container .desc-secondary{color:#9da5b5}
.zm-modal--dark.ask-permission-prompt-container .continue-without-mic-camera{color:#75aff5}
.zm-modal--dark.allow-permission-prompt-container .desc-primary{color:#fff}
.zm-modal--dark.allow-permission-prompt-container .desc-secondary{color:#ffffffb3}
.zm-modal--dark.no-permission-confirm-container .desc-primary,.zm-modal--dark.no-permission-confirm-container .desc-secondary{color:#fff}
.zm-modal--dark.no-permission-confirm-container .continue{color:#fff;border-color:#fff3;background:transparent}
.zm-modal--dark.no-permission-confirm-container .continue:hover{background:#ffffff14}
.zm-modal--dark.no-permission-confirm-container .learn-more{color:#75aff5}
.common-window--dark .disclaimer__button-text{color:#ffffff8f}
.common-window--dark .disclaimer__button-wrap{background:#ffffff0f}
.common-window--dark .disclaimer__button-wrap:hover{background:#ffffff1a}
/* ===== Reactions ===== */
.reaction-simple-picker__container{padding:8px;border-radius:12px;border:1px solid rgba(255,255,255,.12);background-color:#000c;box-shadow:0 6.14232px 18.427px #0003;backdrop-filter:blur(15.3558px)}
.reaction-simple-picker__row{display:flex;justify-content:space-around;margin-bottom:8px}
.reaction-simple-picker__row--last{margin-bottom:0}
.reaction-simple-picker__block{height:32px;margin-left:8px;color:#fff;font-size:13px;font-weight:700;border-radius:8px;position:relative}
.reaction-simple-picker__block[data-tooltip]:focus>[data-tooltip]:before{opacity:1;min-height:24px;background:#1d1e20;color:#fff;top:-104%;font-size:13px;padding:4px 8px;border:.5px solid rgba(255,255,255,.09)}
.reaction-simple-picker__block[data-tooltip]:before{content:"";position:absolute;opacity:0;transition:all .15s ease;width:0;height:0;margin-left:-1px;border-top:10px solid rgba(255,255,255,.18);border-right:10px solid transparent;border-left:10px solid transparent;pointer-events:none;top:0}
.reaction-simple-picker__block[data-tooltip]:hover:before,.reaction-simple-picker__block[data-tooltip]:focus:before{opacity:1;top:-11px;margin-left:-10px}
.reaction-simple-picker__block[data-tooltip]:after{content:"";position:absolute;opacity:0;transition:all .15s ease;width:0;height:0;border-top:9px solid #1D1E20;border-right:9px solid transparent;border-left:9px solid transparent;pointer-events:none;top:0}
.reaction-simple-picker__block[data-tooltip]:hover:after,.reaction-simple-picker__block[data-tooltip]:focus:after{opacity:1;top:-11px;margin-left:-9px}
.reaction-simple-picker__block{background-color:#ffffff17}
.reaction-simple-picker__block:hover{background-color:#ffffff2e}
.reaction-simple-picker__block:focus{background-color:#ffffff2e}
.reaction-simple-picker__block:active{background-color:#ffffff45}
.reaction-simple-picker__block--reaction{width:32px;background-color:transparent}
.reaction-simple-picker__block--reaction:hover{background-color:#ffffff17}
.reaction-simple-picker__block--reaction:focus{background-color:#ffffff17}
.reaction-simple-picker__block--reaction:active{background-color:#ffffff2e}
.reaction-simple-picker__block--non-verbal-feedback{width:50px;margin-left:4px}
.reaction-simple-picker__block--raise-hand,.reaction-simple-picker__block--be-right-back{width:272px;margin-left:0}
.reaction-simple-picker__block--first{margin-left:0}
/* ===== Leave/End ===== */
.leave-meeting-options{position:absolute;width:248px;padding:16px;background:#090a0acc;border-radius:12px}
.leave-meeting-options__btn{width:100%;height:32px;line-height:32px;border-radius:8px;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.leave-meeting-options__btn:not(:first-child){margin-top:8px}
.leave-meeting-options__btn:last-child{margin-bottom:8px}
.leave-meeting-options__btn--default{background:#ffffff17;border:none;color:#fff}
.leave-meeting-options__btn--default:hover{background:#ffffff2e}
.leave-meeting-options__btn--danger{background:#de2828;border:none;color:#fff}
.leave-meeting-options__btn--danger:hover{background:#ca2424}
.leave-meeting-options__audio{margin-top:16px;text-align:left;color:#fff}
.leave-meeting-options-position{bottom:52px;right:8px}
.leave-option-container{position:absolute;bottom:0;background:#000c;backdrop-filter:blur(48px);z-index:1}
.leave-option-container__feedback{color:#f5f5f5}
.leave-option-container__cancel-btn{color:#f5f5f5;margin:0 16px 0 32px}
.leave-option-container__cancel-btn:hover{background:#ffffff17}
.leave-option-container .zm-checkbox:before{background:none}
.leave-option-container .zm-checkbox-checked:before{border-color:#196be6;background:#609bfb;background-image:-webkit-gradient(linear,left top,left bottom,from(hsl(217,95%,68%)),to(hsl(216,80%,57%)));background-image:linear-gradient(to bottom,#609bfb,#3a80e9)}
```

## Appendix B — Auto-hide & toast logic (de-minified from `main-client.min.js` / `loginview.min.js`) [J]
```js
// meeting-client root
const AUTO_HIDE_MS = 3000;                                 // xW / TW = 3e3
onMouseMove = throttle((targetId) => {                     // mi(fn, 1e3)
  if (isAlwaysShowFooter) return;
  clearTimeout(this.autoHideTimer);
  toggleIsMouseMove(!isRemoteControl || targetId !== 'sharee-container-canvas');
  this.autoHideTimer = setTimeout(() => toggleIsMouseMove(false), AUTO_HIDE_MS);
}, 1000);
onKeyDown = e => { if (e.ctrlKey && e.keyCode === 220 /* \ */) { e.preventDefault(); toggleIsAlwaysShowFooter(); } };
// footer visible = isHoverFooter || isMouseMove || isAlwaysShowFooter || isDropDownOpen || showLeaveMeetingOptionBox || ...
// className: footer__hidden when !visible ; meeting-header__hidden when !isHeaderVisible

// Toast (AliveToast)
const DEFAULT_ALIVE = 5000;                                 // j1e = 5e3
toast({ message, aliveTime = DEFAULT_ALIVE, showClose = false, name /* uniqueToast key */ });
// host change: toast({ message: 'You are host now.' | `${name} is the host now.`, aliveTime: 3000 })
// meeting-info copy feedback: setTimeout(() => setCopied(false), 5e3)
```

## Appendix C — Gallery layout constants [J]
```js
desktopBoxSettings = { aspectRatio: [16, 9], spacing: 0 }          // l6
galleryPadding = n === 1 ? '0,0,0,0' : (sideBySide ? '100,60,100,60' : '60,60,60,60')   // top,right,bottom,left
speakerPadding = activeCount === 1 ? '0,0,0,0' : (speakerBar ? '0,0,60,0' : '60,0,60,0')
speakerBar = { height: 120, padding: '3px 0', tile: 207x117 (16:9) }
activeSpeakerRing = 'inset 0 0 0 2px #48DD5D' (gallery only when participants > 2)
```
