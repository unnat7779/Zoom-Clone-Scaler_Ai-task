# 01 — Workplace shell (header, rail, global) + Home `/wc/home`

Prefix `home`. Captured 2026-10-07 at a **1366×768** viewport from `https://app.zoom.us/wc/home` (PWA build `7.2.0.3239`), signed in.
Scope: everything on the shell and Home **except** the Meetings tab, Schedule, Join modal and in-meeting UI (other agents own those).

Legend: **[M]** = measured from DOM/computed style or the live CSS; **[D]** = inferred/derived (e.g. read off a screenshot, or a state we could not trigger).

Account state at capture time (affects a few visuals):
- Presence = **"In a Zoom meeting"** (another agent was in a meeting), so the avatar shows the orange camera status glyph, not the green dot.
- A **"Workplace Pro – Limited time offer!"** promo carousel is injected between the hub row and the calendar widget.
- Calendar is **not connected**, so the calendar widget shows the blue "You haven't connected your calendar yet" banner and an empty day.

---

## 0. Corrections to PRD.md

| PRD section | PRD says | Measured / actual |
|---|---|---|
| §5.1 Fonts | Workplace font = `system-ui, "SF Pro", "Segoe UI", "Almaden Sans", Roboto, Ubuntu, Helvetica, Arial, sans-serif` | That stack is only on `html`. **`body` (and therefore every Workplace element) computes to `Emoji, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Liberation Sans", Arial, sans-serif`** (nx-chat CSS: `body{font-family:var(--emoji-font,Emoji),system-ui,…!important; -webkit-font-smoothing:antialiased; line-height:1; cursor:default}`), where `Emoji` is a `@font-face` of local colour-emoji fonts limited by `unicode-range` [M]. Visually identical on macOS; use the body stack. |
| §5.4 Toast (light app) [D] | bottom-center, bg `#222325`, white text, radius 8 | Zoom PWA uses **react-toastify, top-center** (`.Toastify__toast-container{top:50px}`), **white** toast, `border:1px solid #C1C6CE; border-radius:10px; min-height:40px; box-shadow:0 24px 48px rgba(19,22,25,.2),0 12px 24px rgba(19,22,25,.1); backdrop-filter:blur(10px)`, text 14px/20px `#131619`, title bold; width 320 [M CSS]. No toast actually appeared after *Copy ID* / *Copy Invitation* in our (background) tab [M]. |
| §6.1 divider | 1×20 `#DFE3E8` [D] | Confirmed **1×20 `#DFE3E8`**, `::before` of `.frame-common-header__logo-text`, `position:absolute; left:0; top:50%; transform:translateY(-50%)` → box x=114.8, y=21.5–41.5 [M]. "Workplace" glyphs start at x=126.8 (padding-left 12). Logo box is 87×24 (img 87×20 at y=22) [M]. |
| §6.1 header layout | free positions | Header is `display:flex; justify-content:space-between; gap:48px; padding:0 16px; height:64px` [M]. Right side is a flex row with `gap:24px` between three groups: *leading* (empty), *search area* (`flex:1; justify-content:center; min-width:160px`) and *trailing* (`gap:12px`) [M]. Search width = `clamp(160px, 30vw, 440px)` → 409.8 at 1366 [M]. |
| §6.1 Back/Forward/History | History is a no-op; Back/Forward = router back/forward | Back/Forward are **disabled** (`aria-disabled=true`, color `#ADB1B8`, `cursor:not-allowed`) and stayed disabled after switching rail tabs — they only track Team-Chat history [M]. They have **native `title` tooltips** `Back(⌘+[)` / `Forward(⌘+])` [M]. **History opens a popover** "No session history yet" (189×68) and has a dark MUI tooltip "History" [M]. |
| §6.1 search trigger | non-functional (toast) | Opens the **global Search dialog** (720×628 modal, §4); also opens with **⌘K / Ctrl+K** [M]. Hover bg `#E8EBEE`, active `#DFE3E8` [M CSS]. Text `Search` + `⌘ + K` 14px/20px `#3D4349`, letter-spacing 0.4px [M]. |
| §6.1 Admin Center | static text | `<a href="https://app.zoom.us/adminhome" target="_blank">`, 102×32, padding `6px 8px`, radius 12; hover bg `#6E76801F` + text `#0C60C8`, active bg `#6E76803D` + `#084085` [M]. |
| §6.1 Download / Upgrade | static | Download = `<a href="/download" target="_blank">`; hover bg `#6E76801F` text `#0C60C8`, active `#6E76803D`/`#084085` [M]. Upgrade (monetization widget) hover `#0C60C8`, active `#084085` [M CSS]. Both static in clone. |
| §6.1 Activity Center | 32×32 bell (popover implied) | Bell is a toggle (`aria-pressed`). Pressed/hover bg `#6E76803D`/`#6E76801F` [M]. It opens a **docked right column** (not a popover): content column shrinks to 946px, a 6px resize handle, then a **328×694 white panel, radius 12** at x=1032 (§5) [M]. |
| §6.1 presence dot | 10×10 `#09A639` with 2px white ring | The status glyph is **not ringed**: the avatar's inner square gets a **`clip-path` notch** around the glyph (§3.6) [M]. Available = 10×10 green circle `#09A639`; In meeting = **16×10 orange camera `#FF5500`** at `right:-5.28px; top:-2.5px` [M]. |
| §6.1 Profile menu | rows Profile/Settings/Plans/Help…, Settings opens placeholder | Measured 268×502 at (1082, 51.5) [M]. Status row text = current status ("In a Zoom meeting"/"Available"), presence glyph 10×10 via `::before`, `margin-right:10px` [M]. Row icons 16px `#222325`; **external-link icon 14px appears on hover only** (opacity 0→1) for Profile/Settings/Plans [M]. Profile/Settings/Plans open `https://us05web.zoom.us/profile`, `/profile/setting`, `/billing` in a new tab [M]. Last row is a **"Download the Zoom app"** text button [M]. Full detail §7. |
| §6.2 rail colours | default `#555B62`, hover bg `#6E76801F` + `#222325`, selected bg `#FFF` | Confirmed [M]. Tabs are `role=tab`, **draggable** (reorder with transform .3s ease), **no tooltips** [M]. No "More" overflow tab: down to a 380px tall viewport all 4 tabs + Settings remain (Settings' auto top-margin collapses to 4px) [M]. |
| §6.2 Chat / Contacts / Settings | static | Chat → `/wc/team-chat`, Contacts → `/wc/contacts`, Settings (bottom) → **Settings modal 820×660** (not a route) [M]. `document.title` is **"Zoom"** on every route [M]. |
| §6.3 card offset | card y=68 | The 4px under the header comes from an empty banner slot (`.banner_banner{margin:0 0 4px; padding:0 6px}`), then `mainBody{padding:0 6px 6px 0}` [M]. |
| §7.1 action hover | `filter:brightness(.94)` [D]; active `#0C60C8` [D] | **Hover / :focus = `transform:translateY(-4px)` + `box-shadow:0 4px 11px 0 #B3B3B3`, `transition: transform .15s ease, box-shadow .15s ease`** [M CSS]. Active: New meeting `#E56829`, Join/Schedule **`#0C63CE`** [M CSS]. Disabled: New `#F9CBB7`, Join/Schedule `#B1C7F6`, label `#909096`, no lift [M CSS]. No tooltips [M]. |
| §7.1 chevron | 17×17, padding 1.67 | 16.67×16.67, `border-radius:30%`, `padding:.125em`, icon 13.33px `rgba(4,4,19,.56)`; **hover/focus bg `#F2F2F7`** [M]. |
| §7.1.1 popover position | left edge ~30px left of the label (x=506, y=321) | Same numbers, but the rule is: **horizontally centred on the chevron** (popover centre x = chevron centre 648.5) and **8px below** it [M]. |
| §7.1.1 divider | divider 1px `#EDEDF3` between rows | **No visible divider**: rows have `border-bottom:1px solid #EDEDF3` but the first row carries `__no-border` and the last is `:last-child` → none [M]. |
| §7.1.1 PMI submenu | width 180, items Start / Copy Invitation / PMI Settings | **146×118**, items **"Copy ID", "Copy Invitation", "PMI Settings"** (no "Start" — account was in a meeting at capture; a Start item may appear otherwise [D]). Items 32px, `padding:0 24px`, 14px/32px `#232333`, hover bg `#0E71EB` + white; menu `padding:10px 0`; anchored at **x = popover right − 5, y = PMI-row top** [M]. PMI Settings → `window.open('https://app.zoom.us/meeting/{pmi}/edit?from=pwa')` [M]. |
| §7.1 hub entries | static, gradient 2 stops | `<a target="_blank" rel="noopener noreferrer">` to `https://hub.zoom.us/mine/recording`, `https://hub.zoom.us/mine/summary`, `https://mynotes.zoom.us/` (+amp query) [M]. Hover bg `#F7F9FA`; focus-visible `outline:2px solid #0E72ED; outline-offset:2px` [M]. AI gradient has **3 stops**: `linear-gradient(94deg,#76C7EA14 3.04%,#4E89FF14 42.49%,#A864E414 85.69%)` [M]. |
| §7.1 cards column | upcoming widget directly under hub row | `.home__cards{display:flex;flex-direction:column;flex:1;overflow:auto;width:600px}` 600×425 at y=336.7 [M]. A **promo carousel** (600×154 + 24 margin) can sit between hub row and calendar; the calendar (`flex:1 1; height:300px`) then shrinks to 159px. Without promo: calendar **600×337 at y=409** (matches PRD) [M]. |
| §7.1.0 widget header | date button + Open Calendar → `/wc/meetings` | Date button 116×32, `padding:2px 8px`, radius 12, **transparent bg**, label 14/18 **700** `#222325`, chevron 14px `#222325` that rotates when open [M]. **Open Calendar → `window.open('https://zcal.zoom.us','_blank','noopener,noreferrer')`** [M]. |
| §7.1.0 "…" menu | Schedule a meeting, Refresh | **"Filter by"** (caption) + 3 **checkbox items** "Hosted by you", "With cloud recordings", "With meeting summary" + group gap + **"Refresh"** (with refresh icon) [M]. |
| §7.1.0 list grouping | grouped by day, multiple days | The widget shows **one day at a time**; prev/next/Today/date-picker change the day. Label = `Today, Oct 7` / `Tomorrow, Oct 8` / `Yesterday, Oct 6`, else **`EEE, MMM d`** (`Fri, Oct 9`, `Mon, Oct 5`) [M]. Inside a day, past (non-joined) cards are separated from upcoming by `margin-top:24px` [M CSS]. |
| §7.1.0 event card | [D] metrics | Real CSS found (`.list-item.meeting__card--item`): `padding:8px; border:1px solid #DFE3E8; border-radius:12px; margin:4px 0` inside `.ax-container{padding:4px 16px}`; hover border `#98A0A9`; live/upcoming/joined: bg `#F2F8FF` + border `#A8CCF8` (hover `#4793F1`); past: bg `#F8F9FA`, text `#555B62`; title 14px **590**/20px `#323539` 2-line clamp; meta 12/16 `#323539`. Full rules in Appendix A [M CSS]. |
| §7.1.0 empty state | monochrome `#131619` 20% beach ~89×90, 16px gap | **Coloured lavender illustration** (fills `#DEE2FD #9FA4C7 #C4C8EA #F0F2FF`) 89×90, `margin-bottom:24px`; text "No meetings scheduled." 14/20 `#555B62` [M]. Saved as `home-empty-beach.svg`. |
| §7.1.0 widget banner | omitted | Real widget shows the info banner "You haven't connected your calendar yet. **Connect now** to manage all your meetings and events in one place." (582×70) — keep omitted in the clone or render statically [M]. |
| §5.3 focus | `outline:2px solid #4B96F1; offset 2` | Shell-level fallback is `:focus{outline:2px solid #2D8CFF; outline-offset:1px}` (main.css); MUI/prism buttons use `#4B96F1` offset 2; hub entries `#0E72ED` offset 2; rail tabs `outline-offset:-4px` [M CSS]. |

---

## 1. Global

| Item | Value |
|---|---|
| `document.title` | **"Zoom"** on `/wc/home`, `/wc/team-chat`, `/wc/meetings`, `/wc/contacts` [M] |
| Favicon | `<link rel="icon" href="https://us05st1.zoom.us/zoom.ico">` (single .ico, no sizes) [M] |
| html | `font-family: system-ui,"SF Pro","Segoe UI","Almaden Sans",Roboto,Ubuntu,Helvetica,Arial; height:100%; overflow:hidden; margin:0` [M] |
| body | `font-family: Emoji, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Liberation Sans", Arial, sans-serif !important; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; line-height:1; cursor:default; height:100%; margin:0`; bg transparent [M] |
| App background | `.home{display:flex; flex-direction:column; background:#F1F4F6}` 1366×768 [M] |
| `* { box-sizing:border-box }` | [M] |
| Global scrollbar (WebKit) | `::-webkit-scrollbar{width:6px;height:6px}` · track `transparent`, radius 6 · thumb `#C1C1C1`, radius 6 · thumb:hover `#6B6B6B` (vars `--scrollbar-width-legacy:6px; --scrollbar-thumb-color:#c1c1c1; --scrollbar-thumb-hover-color:#6b6b6b`) [M]. `.home__cards` uses this (overflow:auto). |
| Calendar-widget scrollbar (shadow root) | `::-webkit-scrollbar{background:transparent;width:8px;height:8px}` thumb `border-radius:8px; min-height:40px; background:#0000006B` [M] |
| Shell focus fallback | `:focus{outline:2px solid #2D8CFF;outline-offset:1px}` [M CSS] |
| Header loading state | For ~1–3 s after load the header shows only logo + "Workplace"; the whole right slot (search, Admin Center, Download, Upgrade, bell, avatar) mounts later (micro-apps) [M]. The promo + calendar also mount late (calendar container appears empty first). |
| Responsive (header) | ≤1080px: Admin Center hidden; search collapses to a 32×32 icon button (bg transparent). ≤1050px: Back/Forward/History hidden. ≤768px: "Workplace" text, Admin, Download, Upgrade hidden [M CSS]. |

---

## 2. Shell layout (1366×768) [M]

```
div.home (flex column, bg #F1F4F6)
├─ div.waffleHeaderContainer        0,0     1366×64   bg #FFF
│   └─ header.frame-common-header   (see §3)
├─ div.banner_banner                0,64    1366×0    margin-bottom 4px, padding 0 6px (empty slot)
└─ div.mainBody                     0,68    1366×700  flex row, padding 0 6px 6px 0
    ├─ rail                         0,68    80×694    flex 0 0 80px, padding 0 4px, bg #F1F4F6, flex column, align center
    ├─ mainBodyContentColumn        80,68   1280×694  flex 1 (946 when right panel open)
    │   └─ appsContainer            80,68   1280×694  bg #FFF, radius 12, overflow hidden, flex column
    ├─ bodyDragHandle (only with right panel)  6×694, transparent, :hover cursor col-resize, ::after 10px hit area (right:-5px, z 177)
    └─ mainBodyRight (only with right panel)   328×694, bg #FFF, radius 12, overflow hidden
```

---

## 3. Top header

### 3.1 Structure [M]

```
header.frame-common-header  (flex, space-between, align-items center, gap 48, padding 0 16, h64, bg #FFF, border-bottom 1px #DFE3E8)
├─ .frame-common-header__left  (16,19.5 217.6×24)
│   └─ .frame-common-header__logo (flex, gap 12)
│       ├─ a.__logo-image  href="https://zoom.us?ampDeviceId=…" target=_blank (16,19.5 86.8×24, inline-flex, h24)
│       │    └─ img src=".../images/zoom-logo.svg" alt="Workplace"  87×20 at (16,22)   → pwa-zoom-logo.svg
│       └─ span.__logo-text "Workplace"  (114.8,19.5 118.7×24) 22px/24px 600 #222325, padding-left 12, cursor pointer
│            ::before divider 1×20 #DFE3E8 (left 0, vertically centred)
└─ .frame-common-header__right (281.6,15.5 1068.4×32; flex 1, justify flex-end, gap 12)
    ├─ slotContainer (flex, gap 24, w 1024.4)
    │   ├─ leading (empty, 0×0)
    │   ├─ searchArea (305.6 → 935.7, flex 1, justify-content center, min-width 160)
    │   │   └─ searchCluster (flex, gap 6)
    │   │       ├─ navigation_panel (376.7,15.5 72×32; flex) → 3 icon buttons 24×24 at x=377, 401, 425; y=20
    │   │       └─ searchTrigger (454.7,15.5 409.8×32)
    │   └─ trailing (959.7 → 1306; flex, gap 12)
    │       ├─ Admin Center  a  960,16 102×32
    │       ├─ Download      a  1074,16 91×32
    │       ├─ Upgrade       button 1177,16 85×32
    │       └─ Activity Center button 1274,16 32×32
    └─ profile avatar button 1318,16 32×32 (12px after trailing)
```

### 3.2 Element table [M]

| Element | Box | Style | States | Behaviour |
|---|---|---|---|---|
| Zoom logo | img 87×20 @16,22 | `pwa-zoom-logo.svg` | — | `<a target=_blank>` → `https://zoom.us/?ampDeviceId=…&ampSessionId=…`. Clone: link to `/wc/home` or no-op. |
| Divider | 1×20 @114.8,21.5 | `#DFE3E8` | — | — |
| "Workplace" | text box 118.7×24 @114.8,19.5; glyphs from x=126.8 | 22px/24px **600** `#222325`, `cursor:pointer` | — | Click → `window.open('https://zoom.us','_blank','noopener,noreferrer')` [M]. Clone: no-op. |
| Back | 24×24 @377,20, radius 6, border 1px transparent, padding 0, min-width 24 | icon `header-back.svg` 14×14 (viewBox 0 0 8 8) | **disabled** (always, in our capture): color `#ADB1B8`, `cursor:not-allowed`; enabled: color `#2A2B2D`, hover bg `#6E76801F`, active `#6E76806B` (MUI tertiary icon) | Native tooltip via `title="Back(⌘+[)"`. Transition `background-color .25s cubic-bezier(.4,0,.2,1), box-shadow .25s`. |
| Forward | 24×24 @401,20 | `header-forward.svg` 14px | same as Back | `title="Forward(⌘+])"` |
| History | 24×24 @425,20 | `home-header-history.svg` 14px `#2A2B2D` | hover `rgba(110,118,128,.12)`, active `rgba(110,118,128,.42)` | Dark MUI tooltip "History" (§3.4). Click toggles **History popover** (§3.5). |
| Search trigger | 409.8×32 @454.7,15.5, radius 8, border 1px transparent, padding `0 12px`, gap 6, centred content | bg `#ECEFF1`; icon `header-search.svg` 16px `#3D4349`; text "Search" + `<span>⌘ + K</span>` (span padding `0 6px`) 14px/20px 400 `#3D4349`, ls 0.4px | hover `#E8EBEE`; active / `aria-expanded=true` `#DFE3E8` [M CSS] | Click or ⌘K/Ctrl+K → Search dialog (§4). No tooltip. |
| Admin Center | 102×32 @960,16, radius 12, padding `6px 8px`, gap 4 | label 14px/20px 400 `#555B62`, ls −0.15px | hover bg `#6E76801F` + `#0C60C8`; active `#6E76803D` + `#084085`; focus-visible same as hover | `href=https://app.zoom.us/adminhome target=_blank`. Clone: static. |
| Download | 91×32 @1074,16, radius 12, padding `6px 14px` | bg `#F1F4F6`, 14px/18px 400 `#0D6BDE`, ls −0.15px | hover bg `#6E76801F` + `#0C60C8`; active `#6E76803D` + `#084085`; focus-visible outline 2px `#0D6BDE` offset 2 | `href=/download target=_blank` |
| Upgrade | 85×32 @1177,16, radius 12, padding `6px 14px` | bg `#0D6BDE`, label 14px/18px **500** `#FFF` | hover `#0C60C8`; active `#084085` | static |
| Activity Center | 32×32 @1274,16, radius 999, border 1px transparent | bell `header-bell.svg` 16px `#555B62` | hover/focus-visible bg `#6E76801F`; active / `aria-pressed=true` bg `#6E76803D` | Toggles the right panel (§5). Tooltip "Activity Center" (§3.4). |
| Avatar button | 32×32 @1318,16 (`common-header-button--md is-pure-text`, radius 4) | inner 32×32, radius 10, bg `#9053C2`, initials 14px/32px **600** `#FFF` | no hover effect (cursor pointer); `aria-expanded` toggles | `aria-label="A B, profile options"`, `aria-haspopup=true`. Click → Profile menu (§7). No tooltip observed. |

### 3.3 Spacing summary [M]
- 16 (left pad) · logo 87 · 12 · divider 1 · 12 · "Workplace" · ≥48 gap · search cluster centred in [305.6, 935.7] · 24 · Admin 102 · 12 · Download 91 · 12 · Upgrade 85 · 12 · bell 32 · 12 · avatar 32 · 16 (right pad).
- All right-side controls are 32 tall at y=15.5–47.5 (vertically centred in 64).

### 3.4 Tooltips [M]

| Trigger | Type | Look | Position |
|---|---|---|---|
| Back / Forward | native `title` | OS tooltip "Back(⌘+[)" / "Forward(⌘+])" | OS |
| History | MUI Tooltip (dark) | bg `#222325`, border 0.5px `#313235`, radius 4, padding `3px 6px`, 12px/16px 400 `#F7F9FA`, shadow `0 4px 8px #00000014, 0 2px 4px #00000014`, margin-top 4 | below, centred (popper at 408,43.5) ; enter `opacity 150ms cubic-bezier(.4,0,.2,1) 100ms, transform 100ms` |
| Activity Center | prism Tooltip (light) | bg `#FFF`, border 1px `#DFE3E8`, radius 4, padding `3px 6px`, 12px/16px 400 `#2A2B2D`, shadow `0 4px 8px #00000014, 0 2px 4px #00000014`, z-index 1500 | 8px below button, centred (98×24 at 1241,55.5); `opacity .3s cubic-bezier(.4,0,.2,1)` |
| Search, Admin, Download, Upgrade, avatar, logo | none | — | — |

### 3.5 History popover [M]
- `ui-Popover-paper` 189×68 at (424.5, 51.5): bg `#FFF`, border 1px `#DFE3E8`, radius 8, padding 12, shadow `0 24px 48px #00000014, 0 12px 24px #00000014`, fade `opacity 200ms cubic-bezier(.4,0,.2,1)`.
- Content: empty state (padding 10) → empty image slot (0 height) → "No session history yet" 14px/18px 400 `#686F79`, margin-top 4.
- Toggle by clicking History again; outside click closes [D].

### 3.6 Avatar + presence [M]
- `.common-header-avatar--md` 32×32, `border-radius:10px`, `--purple` → inner bg `#9053C2`; initials "AB" 14px/32px 600 white, centred.
- Presence glyph `<i class="common-header-avatar__status-icon is-{status}">` absolutely positioned on the avatar:
  - **In meeting**: 16×10 (SVG viewBox 0 0 9 8, fill `#FF5500`), `right:-5.28px; top:-2.5px` → box (1339,13). File `home-status-in-meeting.svg`.
  - **Available**: 10×10 green circle `#09A639` (viewBox 0 0 8 8) at top-right, x≈1343 y≈13 (PRD measurement) [D position]. File `home-status-available.svg`.
  - Other statuses (profile menu / chat): busy `#FF2638` ✕-circle, DND `#FF2638` circle with white bar, away `#8E9194` circle with white clock hand, offline `#8E9194` ring, OOO grey calendar-x, calendar orange `#FF5500`, mobile green phone `#09A639`. Files `home-status-*.svg` (all 10×10).
- The avatar inner square is cut with a **`clip-path: path(...)`** that leaves a rounded notch around the glyph (no white ring/border). For the 16×10 meeting glyph the notch path is: `M 16 0 C 17.6 0 18.95 0 20.1 .03 C 20.07 .21 … C 31.99 9.91 32 12.25 32 16 C 32 20.97 … Z` (a 32×32 rounded square, radius ≈10, with a ~12×9.3 rounded cut-out at top-right starting x=20). Clone: use `mask`/`clip-path` with a circle of r=7 centred on the glyph, or simply draw a 2px white ring — visually equivalent [D].
- `aria-label` of avatar span: "A B profile avatar, in meeting" [M].

---

## 4. Global Search dialog (⌘K) [M]

Opens on search-trigger click or **⌘K / Ctrl+K**; input autofocused. Closes on **Escape** and on the **✕** button. A synthetic click on the backdrop did **not** close it [M] (treat outside-click as not closing).

```
MuiDialog-root ._searchDialog (fixed, inset 0)
├─ MuiBackdrop  rgba(0,0,0,.5), transition opacity .225s cubic-bezier(.4,0,.2,1)
└─ Paper (role=dialog)  323,70  720×628  bg #FFF  radius 12  margin 32  shadow 0 12px 24px #00000014, 0 6px 12px #00000014   (centred both axes)
   └─ .ui-Dialog-content  padding 24  → inner 672×580 at (347,94)
      ├─ ._searchInput  672×36, inline-flex, align center, padding 2px 4px   (no border/background)
      │   ├─ ._searchInputGroup  flex 1, padding 0 12px
      │   │   ├─ addon: magnifier 12×12 #686F79  (header-search.svg)
      │   │   └─ ._inputWrapper  padding 4px 0 4px 12px, font-size 14px
      │   │        ├─ input  h24, transparent, no border, color #2A2B2D, caret #0D6BDE, placeholder "Search" (UA grey), UA font 13.33px
      │   │        └─ (when non-empty) suffix "Clear" tertiary small button 50×24, margin-left 18, text 13px/16px #686F79
      │   └─ close ✕  24×24 icon button (tertiary), margin 4px 8px, icon 14px #686F79  → home-search-close.svg
      ├─ ._searchTags  padding 8px 12px (inline-block)
      │   └─ 5 chips: h24, padding 4px 8px, radius 100px, margin 2px 12px 2px 0 (last 0), no border; icon 12px + 4px gap; text 13px/16px
      │        selected ("Top results"): bg #0D6BDE, text/icon #FFF ;  others: bg #F7F9FA, text #2A2B2D
      │        "Top results" 99w (search icon) · "Contacts" 87w · "Chats & Channels" 140w (#) · "Messages" 93w (bubble) · "Files" 60w (doc)
      └─ results list  672×500, overflow-y auto
          └─ section header p  672×40, flex space-between, padding 8px 12px
               ├─ title "Recent searches" 14px/21px 700 #2A2B2D   (after typing with no hits: "No results")
               └─ "Clear all" tertiary small button 67×24, padding 4px 8px, text 13px/16px #686F79; :active bg #F7F9FA
```

- Typing "test" → list shows heading **"No results"** (14px 700 `#2A2B2D`) and the inline **Clear** button appears; Clear empties the field and restores "Recent searches" [M].
- A hidden "Most relevant ▾" sort control exists (shown with results) [M].
- Icons: `header-search.svg`, `home-search-close.svg`, `home-search-contacts.svg`, `home-search-channels.svg`, `home-search-messages.svg`, `home-search-files.svg`.
- Zoom bug to **not** copy: the promo-carousel close button bleeds above the dialog.

---

## 5. Activity Center (bell) [M container / D contents]

Docked panel (cross-origin iframe `https://chatcommonapp.zoom.us/chatcommon-app/activitycenter/index.html?theme=light`, so internals were read from screenshots → [D]).

| Part | Value |
|---|---|
| Layout change [M] | content column 1280→**946** wide; 6px drag handle (x 1026–1032, col-resize); panel **328×694 @ (1032,68)**, bg `#FFF`, radius 12, overflow hidden, no border/shadow. Home column re-centres in the 946px column (clock centre x≈553). |
| Header row [D] | ~48px tall (y 68–116): "…" more icon at left (x≈1054), title **"Activity Center"** centred (x≈1196, y≈92) ~16px 500 `#222325`, close ✕ at right (x≈1335). |
| Tabs row [D] | y≈132: **"Focus"** (selected, ~14px 600 `#222325`, 2px blue `#0E72ED` underline at y≈147 spanning the label) · **"Other"** (~14px 400 `#686F79`, ≈21px after Focus). Right side: filter icon (x≈1289) and "mark all read" ✓✓ icon (x≈1328). 1px `#DFE3E8` divider under tabs from x≈1046 to 1345. |
| Empty state (Focus) [D] | party-popper illustration ≈140×128 centred (y 201–330); title **"You've cleared your suggestions"** ~16px 700 `#222325` centred at y≈384; body "Check out the rest of your notifications in the Other tab." ~14px/20px `#686F79`, centred, 2 lines (y≈406, 426), width ≈290; link **"View other notifications"** ~14px `#0E72ED` at y≈451. |
| Open/close | Bell toggles (`aria-pressed` true/false); the iframe gets class `activity-center-panel--hidden` (display:none) and the column collapses back [M]. |
| Settings modal (from "…", not opened) | `.activity-center-settings-modal{width:640px;height:640px;max-height:calc(100vh - 48px);border:.5px solid #23233333;border-radius:12px;box-shadow:0 8px 24px #2323331a}` [M CSS]. |

Screenshot: `home-03-activity-center.jpg`.

---

## 6. (reserved) — Download / Upgrade are static; no popovers.

---

## 7. Profile menu (avatar)

### 7.1 Root popover [M]
`div.common-header-floating.common-header-profile__popover` — **268×502 @ (1082, 51.5)** (right-aligned with avatar right edge 1350, 4px below the 47.5 bottom), `position:fixed; z-index:1002`, bg `#FFF`, border 1px `#DFE3E8`, radius 12, shadow `0 12px 24px #00000014, 0 6px 12px #00000014`, enter/leave `opacity .3s linear`. Inner scroll view padding 6 + `ul` padding 6 → rows are **242 wide at x=1095**.

| # | Row (li role=menuitem) | Box | Content |
|---|---|---|---|
| 0 | User info (`#common-header-profile_user-info`) | 242×52 @1095,65; content padding `7px 8px`, flex align center | avatar 32×32 radius 10 `#9053C2` initials 14/32 600 white, margin-right 8 · name **"A B"** 14px/18px 400 `#222325` (y 72) · email `<email>` 12px/16px `#686F79`, margin-top 4 (ellipsis) |
| 1 | Status (`#pwa-status-current-{status}`, has submenu) | 242×32 @1095,117 | `::before` presence glyph 10×10 (`background-size:10px`), margin-right 10 → label at x=1123: current status text (**"In a Zoom meeting"** / "Available" / …) 14/18 `#222325`; chevron-right 16px `#222325` at right (x=1313) |
| — | separator | 242×9 | content `margin:8px 8px 0; padding-top:8px; height:0; border-top:1px solid #DFE3E8` → line at y=157, x 1103–1329 |
| 2 | Profile | 242×32 @1095,166 | icon `home-menu-profile.svg` 16px `#222325`, margin-right 8 (x 1103) · label x=1127 · trailing external icon 14px (x 1315), **opacity 0, 1 on row hover** |
| 3 | Settings | 242×32 @1095,198 | `home-menu-settings.svg` + external icon on hover |
| 4 | Plans and billing | 242×32 @1095,230 | `home-menu-plans-billing.svg` + external icon on hover |
| 5 | Help (has submenu) | 242×32 @1095,262 | `home-menu-help.svg` · chevron-right 16px |
| — | separator | 242×9 | line at y=302 |
| 6 | Add account | 242×32 @1095,311 | label only (x 1103) — **do not implement action** |
| 7 | Sign out | 242×32 @1095,343 | label only — **do not implement action** |
| 8 | Upgrade banner | li 242×126 @1095,375; banner 242×120 @1095,382 | banner `margin:0 -8px -8px; padding:16px; border-radius:12px; border:1px solid #A8CCF8; background:#F2F8FF linear-gradient(rgba(255,255,255,.6))`; banner icon hidden; title **"Get more from Zoom"** 14px/18px 600 `#222325`; text "Upgrade to Zoom Workplace Pro for unlimited meetings and more" 12px/16px `#222325` (2 lines, 200 wide), margin-bottom 8; button **"Upgrade now"** 101×24, radius 999, padding `2px 10px`, bg `#0D6BDE`, label 12px/16px 500 white, ls 0.36px (hover `#0C60C8`, active `#084085`). Row has no hover bg. |
| 9 | Download the Zoom app | 242×32 @1095,509 (row content margin-top 8, padding 0) | full-width text button: icon `home-menu-download.svg` 14px + 4px + label 14px/32px `#0D6BDE` (hover `#0C60C8`, active `#084085`), centred |

Row base: `border-radius:8px; padding:7px 8px; font 14px/18px 400 #222325; white-space:nowrap; cursor:pointer`. **Hover bg `#6E76801F`, active `#6E76806B`; row with open submenu gets `.is-active` bg `#6E76801F`** [M CSS]. Keyboard focus (vue3 keyboard mode): `outline:2px solid #4B96F1` [M CSS].

Behaviour [M]: Profile → `window.open('https://us05web.zoom.us/profile','_blank')`; Settings → `…/profile/setting`; Plans and billing → `…/billing`; clicking a row closes the menu. Outside click closes the menu; Escape (dispatched on body) did not [M]. Clone: Settings may open the local Settings modal (§8.4); others no-op/toast.

### 7.2 Status submenu (hover the status row) [M]
- Opens **to the left**: 232×186 @ (847, 104.5) — right edge 1079 (3px gap to root), top = status row top − 12. Same floating style (radius 12, border, shadow); `ul` padding 12 → rows 206 wide @860; `min-width:230px`.
- Rows (32px each, glyph `::before` 10×10 + 10px gap → label x=888): **Available** (green dot), **Busy** (red ✕), **Do Not Disturb** (red bar; has chevron-right → sub-submenu), **Away** (grey clock), **Out of Office** (grey calendar ✕).
- DND sub-submenu (left of the status submenu): 232×218 @ (612,170): **"20 minutes", "1 hours", "2 hours", "4 hours", "8 hours", "24 hours"** (sic "1 hours") — ids `pwa-status-dnd-20/60/120/240/480/1440`.
- Fade: `opacity .3s linear`. Clone: make status rows change the avatar glyph locally (no backend) [D].

### 7.3 Help submenu [M]
- 232×171 @ (847, 250) (top = Help row top − 12), rows 206 wide:
  - **About Zoom Workplace** → opens About modal (§7.4)
  - **Zoom Support** (external icon on hover) → `window.open('https://support.zoom.com/','_blank')`
  - **Zoom Community** (external icon on hover) → `window.open('https://community.zoom.com/','_blank')`
  - separator
  - **Report problem...** (opens a feedback dialog; not opened)

### 7.4 About modal [M]
- Overlay `rgba(255,255,255,.75)` full screen (ReactModal `pwa-modal__overlay`).
- `.modal-about` 480×305 centred @ (443,231.5): bg `#FFF`, border .5px `rgba(35,35,51,.2)`, radius 12, shadow `0 8px 24px rgba(35,35,51,.1)`, padding `64px 46px 24px`, text-align centre.
- Close ✕ 20×20 (icon 12px) at top-right (883,252), radius 30%, padding 4.
- Zoom wordmark 106×24 (PNG sprite) · "Version:  7.2.0.3239 ( 0924 )" 14px/24px `#222230`, margin 24 0 · "Copyright ©2012-2026 Zoom Communications, Inc. All rights reserved." 14px/20px `rgba(4,4,19,.56)` · link "Open Source Software ↗" 14px/24px `#0E72ED` (margin-top 54) → `https://zoom.us/opensource?product=pwa`.

Screenshots: `home-04-profile-menu-status.jpg`, `home-05-profile-menu-help.jpg` (email replaced by `<email>`), `home-06-about-modal.jpg`.

---

## 8. Left rail and other rail pages

### 8.1 Rail [M]
- Container 80×694 @ (0,68), `flex:0 0 80px; padding:0 4px; background:#F1F4F6; display:flex; flex-direction:column; align-items:center`.
- `.home-header__tabs` flex column, `gap:2px`, width 72.
- Tab button: **72×56**, `border-radius:8px; padding:12px 0 8px; border:0; background:transparent; color:#555B62; cursor:pointer; transition:transform .3s ease`; inner `.tab-item-wrapper` flex column centred; icon 18×18 (`font-size:18px`) ; label `.header-text` 10px/14px 400, ls 0.12px, margin-top 4, centred.

| Tab | Box | Icon | Label | Route |
|---|---|---|---|---|
| Home | 4,68 | `nav-home.svg` (31,80) | "Home" (26,102 29×14) | `/wc/home` |
| Chat | 4,126 | `home-nav-chat.svg` | "Chat" | `/wc/team-chat` |
| Meetings | 4,184 | `nav-meetings.svg` | "Meetings" | `/wc/meetings` |
| Contacts | 4,242 | `home-nav-contacts.svg` | "Contacts" | `/wc/contacts` |
| Settings (bottom) | 4,690, `.home-header__end-section{margin-top:auto; margin-bottom:16px}` | `nav-settings.svg` | "Settings" (aria-label "Settings") | opens Settings modal |

- States: default text/icon `#555B62`; **hover** bg `#6E76801F`, text `#222325`; **selected** (`.selected`, `aria-selected=true`) bg `#FFFFFF`, text `#222325` (hover keeps white); dragging: `.isDragging{opacity:0}`, neighbours slide with `translateY(±100%)` .3s ease; `:focus{outline-offset:-4px}` (outline colour from keyboard focus ring) [M CSS].
- Badges (unused now): `.header-icon__red-dot` 8×8 `#DA1639`; `.header-icon__badge` 11px/14px white on `#DA1639`, radius 7, padding `0 4.3px`, positioned `left:100%; top:0; transform:translate(-35%,-35%)` [M CSS].
- **No tooltips** on rail tabs [M]. Screen-reader hint text: "Press Alt or Option + Arrow Down to move the tab d…" [M].
- Short window: at 1366×500 and 1366×380 nothing collapses (no "More" tab is rendered for 4 tabs; the `.home-header__more` / `.home-header__more-tab` grid popover exists in CSS for >N tabs: 256 wide, 3-column grid of 60px tiles, `border:1px solid #D3D3D3; border-radius:9px`) [M].

### 8.2 Chat page `/wc/team-chat` (placeholder skeleton) [M]
- appsContainer becomes 1280×578 (a 110px **Workplace Pro carousel banner** sits below it at y=652, 1280×110, radius 12, margin-top 6 — omit in clone).
- Left sub-sidebar 328 wide (border-right 1px `#DFE3E8`): header "Chat ▾" (16px/20px **590** `#2A2B2D`, ls −0.31px) at (104,91); gear icon button 32×32 radius 8 at x=319; round **+** "New menu" button 32×32, `radial-gradient(141.42% 141.42% at 0 0, #508AFF 0%, #0B5CFF 100%)`.
- Filter pills row (y=136, 40×32 each, radius 20, border 1px `#DFE3E8`, gap 10): **All** (selected: bg `#E7F1FD`, border `#A8CCF8`, text 14px `#0D6BDE`), @ Mentions, Chats, ··· More.
- Collapsible groups (36px rows, chevron + 14px/20px `#555B62` label, hover-only "…" 24×24 at right): **Apps**, **Chats & Channels**, **Starred**, **Shared spaces**.
- Main pane empty state: blue chat-bubbles illustration centred + "Start chatting by clicking or creating a chat in the left sidebar." 16px/20px `#2A2B2D`, 400 wide, centred.
- A one-time "Local Data Storage" card (460×151, bg `#F2F8FF`, border 1px `#4B96F1`, radius 8) appears top-right — omit.
Screenshot `home-10-chat-tab.jpg`.

### 8.3 Contacts page `/wc/contacts` [M]
- Left list 360 wide: search input 304×32 (radius 8, border 1px `#98A0A9`, padding `10px 10px 10px 25px`, placeholder "Search", 14px/24px) at (90,78) + "Add a contact" 24×24 button (radius 6, border 1px `#98A0A9`) at (404,81). Below: spinner + "Loading" 16px `rgba(4,4,19,.56)` (it never finished loading in our session).
- Right detail pane (border-left 2px `rgba(125,125,136,.13)`): 200×200 contact-book illustration centred + "View Contact info by clicking a contact in the left panel" 14px `rgba(4,4,19,.56)`.
Screenshot `home-11-contacts-tab.jpg`.

### 8.4 Settings modal (rail Settings) [M]
- Overlay transparent; dialog **820×660 @ (273,54)**, bg `#FFF`, radius 12, shadow `0 0 24px rgba(0,0,0,.075)`.
- Header 46px, padding `13px 16px`: "Settings" 20px/20px 400 `#000`; close ✕ 16×16 at (1062,69). 1px rule `#EDEDF4` under header.
- Left nav 170 wide (border-right 1px `#EDEDF4`, padding 16): items 137×32, radius 12, padding `0 12px`, margin 6 0, 16px/16px `#131619`, icon tile 20×20 radius 5 (coloured: Audio/Video `#82C786`, Chat `#70C3A0`, My account `#5B8DEF`) + 8px; **active** item bg `#0E71EB`, text white. Items: **General, Audio, Video, Chat, My account**.
- General pane: "Navigation" 14px 700 + "Drag items to reorder the toolbar" 12px; "Reset to default" text button 12px 700 `#0E72ED`; "Auto-call" 14px 700 + checkbox "Automatically receive a call when a scheduled meeting starts" 14px/18px `#2A2B2D`.
Screenshot `home-12-settings-dialog.jpg`.

---

## 9. Home `/wc/home`

### 9.1 Structure [M]
```
.main.main--standard  80,68 1280×694  flex column, justify flex-start, align center, overflow auto
├─ .home__header  637.7,132 164.7×68   margin 64px 0 28px, flex column centre, color #232333
│   ├─ .home__time  "11:06 PM"   40px/40px 600 #232333 ls .37px
│   └─ .home__day   "Wednesday, October 7"  16px/20px 400 rgba(4,4,19,.56), margin-top 8
├─ .main__actions.home__actions  576,228 288×84.7  margin-bottom 24
│   └─ .home__actions-row  flex, justify centre, align flex-start, gap 60 (row-gap 32), wrap
│       ├─ .main__action-start  56 wide, flex column, space-between, centre, color #6E7680
│       │   ├─ button.main__action-btn  56×56 radius 20 padding 14 bg #FF742E, icon 28×28 white (action-new-meeting.svg) aria-label "New meeting", margin-bottom 12
│       │   └─ .start-label (inline-flex centre) 551.2,296 105.6×16.7
│       │        ├─ span "New meeting" 85×16  14px/16px 400 #6E7680 nowrap
│       │        └─ button.start-label__icon 16.7×16.7 margin-left 4 (aria-haspopup=true) → chevron-down.svg 13.3px rgba(4,4,19,.56)
│       ├─ .main__action-join     button bg #0E71EB, icon action-join.svg, label "Join"
│       └─ .main__action-schedule button bg #0E71EB, icon action-schedule.svg (36×39 art scaled to 28×28), label "Schedule"
└─ .home__cards  420,336.7 600×425.3  flex column, flex 1, overflow auto
    ├─ nav.home-hub-entries_row   600×56, flex wrap, gap 16, margin-bottom 16
    │   └─ 3 × a.home-hub-entries_entry 189×56 (flex 1 1 160px)
    ├─ .home__billing-widget (promo carousel, optional; 600×178 incl. 24 bottom margin)
    └─ .home__calendar-widget  flex 1 1, height 300 (→337 without promo), margin-bottom 16, overflow hidden
        └─ <calendar-widget-app> (shadow DOM, §10)
```

### 9.2 Clock [M]
- Format `h:mm A` (e.g. "11:06 PM") and `EEEE, MMMM d` ("Wednesday, October 7"), browser time zone.
- Update cadence measured with a MutationObserver: the text changed at **hh:mm:00.44** every minute (6 consecutive minutes) → tick aligned to the minute boundary (setTimeout to next minute, then every 60 s). Day label updates with it.
- The clock block has no hover/click behaviour.

### 9.3 Action buttons [M]

| | New meeting | Join | Schedule |
|---|---|---|---|
| Box | 56×56 @576,228 | 56×56 @692,228 | 56×56 @808,228 |
| Base | bg `#FF742E`, white | bg `#0E71EB` | bg `#0E71EB` |
| Hover & `:focus` | `transform:translateY(-4px); box-shadow:0 4px 11px 0 #B3B3B3` | same | same |
| Transition | `transform .15s ease, box-shadow .15s ease` | same | same |
| Active | bg `#E56829` | bg `#0C63CE` | bg `#0C63CE` |
| Disabled | bg `#F9CBB7`, no lift, cursor auto | bg `#B1C7F6` | bg `#B1C7F6`; while busy a rotating 1s linear spinner `::before` overlay |
| Label | "New meeting" + chevron | "Join" (27×16 @707,296) | "Schedule" (60×16 @806,296) |
| Label style | 14px/16px 400 `#6E7680`, nowrap; disabled `#909096` | | |
| Tooltip | none | none | none |
| Click | starts instant meeting (not tested — out of scope) | Join modal (other agent) | `window.open` schedule page (other agent) |

- Column pitch 116 (56 + 60 gap); label top = button bottom + 12.
- Chevron button `.start-label__icon`: bg none, border none, `border-radius:30%`, `padding:.125em` (1.67px), color `rgba(4,4,19,.56)`, cursor pointer; **hover/focus bg `#F2F2F7`**; `aria-haspopup=true`, `aria-expanded` mirrors the popover.

### 9.4 New meeting options popover [M]
- prism Popover `role=dialog`, `.start-meeting-popover`, **285×112 @ (506, 320.7)** = centred on the chevron (centre x 648.5), **8px below** it; bg `#FFF`, border 1px `#DFE3E8`, radius 10, shadow `0 12px 24px #00000014, 0 6px 12px #00000014`, `opacity 300ms cubic-bezier(.4,0,.2,1)`; body padding 0; focus-trapped.
- Panel `.home-main-new-meeting-option-panel`: padding `5px 0`, 14px `#232333`, text-align left.
- Row 1 (283×50, padding 16, `__no-border`): `label.zm-pwa-checkbox` → hidden input + `.checkbox__mark` 16×16, border 1px `#BABACC`, radius 4 (checked: bg `#0E71EB`, no border, white check 10px; keyboard focus outline 2px `#2D8CFF` offset 1) + `.checkbox__text` **"Use my Personal Meeting ID (PMI)"** 14px/18px `#232333`, margin-left 8.
- Row 2 (283×50, padding 16, `role=button`, `aria-haspopup`, space-between): `.pmi-number` **"492 555 0101"** (padding-left 8, margin-right 25) + chevron-right 14px (`home-menu-chevron-right.svg`) at x=760.
- Row hover **and** `[aria-expanded=true]`: bg `#0E71EB`, text/icon `#FFF`; no divider between rows (see corrections).
- Close: outside click / Escape [M for outside click].

### 9.5 PMI submenu (hover the PMI row) [M]
- `.pmi-submenu-popover` **146×118 @ (786, 377)** — overlaps the main popover's right edge by 5px, top aligned with the PMI row; same border/radius 10/shadow; fades in (`opacity .3s`).
- `ul.start-pmi__menu` padding `10px 0`, 14px `#232333`, left-aligned; items `li.start-pmi__menu-item` 144×32, `padding:0 24px`, `line-height:32px`, cursor pointer; **hover bg `#0E71EB`, text `#FFF`**.
- Items & actions: **Copy ID** (copies "4925550101" via a hidden span — no toast seen), **Copy Invitation** (copies invitation text — no toast seen), **PMI Settings** → `window.open('https://app.zoom.us/meeting/4925550101/edit?from=pwa','_blank')`. Clicking any item closes both popovers.

### 9.6 Hub entries [M]

| | Recordings | Summaries | My Notes |
|---|---|---|---|
| Box | 189×56 @420,337 | 189×56 @625,337 | 189×56 @831,337 |
| Icon wrap | 32×32 radius 10 padding 8, bg `#FFF2F5` | gradient `linear-gradient(94deg,#76C7EA14 3.04%,#4E89FF14 42.49%,#A864E414 85.69%)` | same gradient |
| Icon | `pwa-record.svg` 16px (img) | `pwa-smart-summary.svg` | `pwa-my-notes.svg` |
| Label | 14px/18px **600** `#222325`, ls −0.15px, ellipsis | | |
| href | `https://hub.zoom.us/mine/recording` | `https://hub.zoom.us/mine/summary` | `https://mynotes.zoom.us/` |

Card: `display:flex; align-items:center; flex:1 1 160px; height:56px; padding:8px 16px; background:#FFF; border:1px solid #DFE3E8; border-radius:16px; cursor:pointer; text-decoration:none`; title gap 12. **Hover bg `#F7F9FA`**; **focus-visible `outline:2px solid #0E72ED; outline-offset:2px`**. `target=_blank rel="noopener noreferrer"`, no tooltip. Clone: toast/no-op.

### 9.7 Promo carousel (optional — recommend omitting) [M]
600×154 @ (420,409), border 1px `#DFE3E8`, radius 16, margin-bottom 24; inner card radius 10, padding `16px 60px`, gap 24: product icon 18px + "Workplace Pro" 16/20 600 `#0D6BDE`; h2 "Limited time offer!" 16/20 600 `#222325`; "Take an additional 15% off when you upgrade to Zoom Workplace Pro annual!" 12/18 `#514F6E`; "Get offer" button 70×24 radius 24 bg `#0D6BDE`; side image 100×100 radius 8; close ✕ 28×28 (icon 14) at top-right. Screenshot `home-01-overview.jpg`.

---

## 10. Calendar widget (`<calendar-widget-app>` shadow root)

### 10.1 Container [M]
- `.calendar-widget` (inline style sheet in the shadow root): `display:block; width:100%; height:100%; border:1px solid #EDEDF4; border-radius:8px; background:#FFF; overflow:hidden; box-sizing:border-box`. 600×337 @ (420,409) without promo.
- Content: `micro-app` → `.zoom-context .app-style` → `.sidebar-container` (flex column) → `.notice` (banner) + `.router--view__container` → `.sidebar-view` → `.event-meeting-list` → `.sidebarItem.dayId{YYYY-MM-DD}`.

### 10.2 Not-connected banner [M] (keep omitted, per PRD)
`.zoom-banner--info.not-connect-warning` 582×70, margin 8, padding 16, radius 12, border 1px `#A8CCF8`, bg `#F2F8FF` + white 60% gradient; info icon 20px `#3B90F7` (`home-cal-info.svg`); text 14px/18px `#222325`: "You haven't connected your calendar yet. **Connect now** to manage all your meetings and events in one place." (link `#0D6BDE`).

### 10.3 Date header row `.date-operation` [M]
- 598×44, flex space-between, `padding:0 16px 0 8px`.
- Centre: date button `.zoom-button--md.zoom-button--secondary.select-time` **116×32**, radius 12, `padding:2px 8px` (!important), border none, **bg transparent**, label 14px/18px **700** `#222325`; trailing chevron 14px `#222325` (`home-cal-chevron-down.svg`, `.rotate` → points up while open). `aria-label="Select calendar date: Today, Oct 7"`. Hover: bg `#6E76801F` (secondary hover) [M CSS].
- Right: **Open Calendar** icon button `.zoom-button--sm.zoom-button--tertiary.zoom-button__icon` 24×24 radius 100%, icon 14px `#555B62` (`home-cal-open-calendar.svg`); hover bg `#6E76801F`, active `#6E76806B`. Click → `window.open('https://zcal.zoom.us','_blank','noopener,noreferrer')`. No tooltip.

### 10.4 Tools row `.data-tools` [M]
- 598×44, `padding:0 16px`, border-top & border-bottom 1px `#DFE3E8`, flex space-between.
- **Today pill** `.today-circle`: 66×24, `padding:2px 8px`, radius 999, border 1px `#98A0A9`, transparent bg; icon 12px `#222325` (`home-cal-today.svg`) + 4px + "Today" 12px/16px 400 `#222325`. Hover bg `#6E76801F` [M CSS]. Click → selected day = today. Always enabled (also when already on today).
- **Previous / Next** icon buttons 24×24, radius 100%, `padding:0 4px`, margin-left 8, icon 14px `#555B62` (`home-cal-prev.svg` / `home-cal-next.svg`), `aria-label` "Previous"/"Next". Click shifts one day.
- Label sequence observed: Today, Oct 7 → **Tomorrow, Oct 8** → **Fri, Oct 9** → **Sat, Oct 10**; back from today → **Yesterday, Oct 6** → **Mon, Oct 5**. Rule: Today/Tomorrow/Yesterday + `, MMM d`, otherwise `EEE, MMM d`.
- While the day loads a loading overlay covers the list (§10.8).
- Right: **More calendar actions** "…" 24×24 icon button (`home-cal-more.svg`, 14px `#555B62`) → menu (§10.6).
- No tooltips on any of these.

### 10.5 Date picker (click the date button) [M]
- `.zoom-floating.is-popover-container` **312×368**, radius **16**, border 1px `#DFE3E8`, shadow `0 12px 24px #00000014, 0 6px 12px #00000014`, z-index 102, positioned 10px under the button, centred, with a 14×14 rotated-square arrow (white). Inner `.zoom-popover--simple` padding 16; `.zoom-date-panel__body` 278 wide, padding 15. (It can extend below the card and is clipped by the content card at 762.)
- Header (24 tall): left « (Previous year) ‹ (Previous month) 24×24 icon buttons; centre "October" "2026" 14px/24px **600** `#222325` (each a hoverable label, radius 4, padding 0 2px, hover bg `#6E76801F`); right › (Next month) » (Next year).
- Table: 7 columns × (header + 6 weeks), cells `.zoom-date-table__cell` 32×32, radius 999, border 1px transparent, 14px/30px, margin `8px 4px 0 0` (36×40 per cell slot).
  - Weekday header "S M T W T F S" `#686F79` 400; hover shows a dark tooltip with the full day name ("Sunday": bg `rgba(0,0,0,.64)`, backdrop blur 15px, radius 4, padding `2px 6px`, 12px/16px white).
  - Current-month day `#222325`; prev/next-month days `#686F79`.
  - **Today (not selected)**: bg `#0D6BDE`, text white, 400; hover `#0C60C8`.
  - **Selected (`.current`)**: bg `#ECF4FD`, border 1px `#A8CCF8`, text `#0D6BDE`, **600** (today-and-selected looks the same).
  - Other days hover bg `#6E76801F`.
- Click a day → label updates (e.g. "Mon, Oct 12") and popover closes; clicking the date button again also closes.

### 10.6 "More calendar actions" menu [M]
- `ul.zoom-floating.is-dropdown` 207×214, radius 12, border 1px `#DFE3E8`, standard shadow, z 110, inner `.zoom-dropdown-menu` padding 12. **Placement `data-side=right`** — Zoom renders it to the right of the button where it is clipped by the widget (bug). Clone: open it below-right-aligned under the "…" button [D].
- Content: caption **"Filter by"** 12px/16px `#686F79` (row 181×32, padding 8) → 3 `menuitemcheckbox` rows (173×30, padding `6px 8px`, margin 4, label 14px/18px `#222325`): **"Hosted by you"**, **"With cloud recordings"**, **"With meeting summary"** (all unchecked) → group gap (8px) → **"Refresh"** (refresh icon 14px `#222325` + 8px + label). Refresh reloads the day (shows §10.8 overlay).

### 10.7 Empty state [M]
- `.no__events--container.ax-container` (padding 4px 16px, flex centre, text-align centre, 14px/20px) → `.no__events--child` → `svg.sidebar-beach-empty` **89×90**, margin-bottom 24 (`home-empty-beach.svg`) → `.no__events--text` **"No meetings scheduled."** 14px/20px 400 `#555B62`.
- Measured (no promo): illustration @ (676,596), text @ y=713 (centred in the 566-wide list area).

### 10.8 Loading states [M]
- **Day switch / Refresh**: `.zoom-loading` overlay (absolute over the list area below the tools row, `background:rgba(255,255,255,.8)`, fade `opacity .3s`), centred `.zoom-loading__wrapper.is-active` 64×64 (padding 16, radius 16, bg `rgba(255,255,255,.7)`, backdrop blur 15px) holding an 8-bar spinner `.zoom-spinners.is-md` (32×32; bars 4px wide, radius 4, `rgba(0,0,0,.56)`, rotated 45° apart, `spinner-fade .8s linear infinite` with staggered delays).
- **Initial list skeleton** `.sidebar-event-loading` (CSS only, Appendix A.3): config bar `calc(100% - 32px)`×26, margin 16 16 4; then cards `calc(100% - 32px)`×114, padding 8, radius 12, border 1px `#DFE3E8`, bg `#FFF`, margin `4px 16px`, containing title bar 100%×20, content bar 126×16 (mt 5), button bar 58×20 floated right (mt 8). Skeleton bars: radius 4, bg `#0000000A`, `skeleton-pulse 1.5s ease-in-out infinite` (opacity 1→.33→1, scale 1→.99).
- **Boot**: `#calendar-boot-loading` absolute 100%×100%, border 1px `#F1F4F6`, radius 6.

### 10.9 Event cards (when meetings exist) — derived from the shadow-root CSS [M CSS / D structure]
CSS variable values resolved in the widget (light) [M]:

| Variable | Value | Variable | Value |
|---|---|---|---|
| `--meeting-item-background` | `#FFF` | `--common-border-color` | `#DFE3E8` |
| `--meeting-now-border-color` | `#A8CCF8` | `--meeting-hover-border-color` | `#4793F1` |
| `--fill-subtler-primary` | `#F2F8FF` | `--sidebar-item-normal-color` | `#323539` |
| `--sidebar-item-past-background` | `#F8F9FA` | `--sidebar-item-past-color` | `#555B62` |
| `--dynamic-now-text` | `#AF1E30` | `--dynamic-joined-text` | `#323539` |
| `--dynamic-color` | `#131619` | `--filter-text-color` | `#555B62` |
| `--icon-hover-background` | `hsla(213,8%,47%,.12)` | `--icon-active-background` | `hsla(213,8%,47%,.42)` |
| `--calendar-border-neutral` | `#98A0A9` | `--common-skeleton-card-back/-border` | `#FFF` / `#DFE3E8` |
| `--dynamic-active-left-bar-toggle` | `#F1F4F6` | `--dynamic-color-0956B5-blue50` | `#0956B5` |

Card anatomy (from selectors; DOM not observable without meetings) [D structure]:
```
div.ax-container (padding 4px 16px)                       ← list container
└─ div.list-item.meeting__card--item[.isComing|.now|.joined|.selfJoined|.isPast|.inPastFifteen|.flag]
   │  padding 8; border 1px #DFE3E8; radius 12; margin 4px 0; bg #FFF
   ├─ .flag (current-time line: 1px #FF5F0F full width at top −3.5px, 7px dot at left) — shown when .flag
   └─ .list-item--header (flex column)
      ├─ .meeting-main-row (flex, gap 8, align flex-start)
      │   ├─ .meeting-main-left (flex 1)
      │   │   ├─ .title > .title-text   14px/20px weight 590, #323539, 2-line clamp
      │   │   ├─ .time .allday           12px/16px (now/isComing text #AF1E30 "Now"/"Starting soon"; joined #323539)
      │   │   ├─ .host / .indicator      12px/16px #323539, max-width 200, ellipsis, mt 2
      │   │   └─ .location-line          12px/16px, links #0E72ED
      │   └─ .meeting-main-right (status / private lock)
      └─ .more (flex row, mt 4, min-height 26)
          ├─ .joinMeeting (display:none unless .now/.isComing/.joined/.selfJoined/.inPastFifteen) → primary sm "Join"/"Start" button (zoom-button--sm: h24, radius 999, padding 2px 10px; in cards font 14px/20px, padding 2px 10px, margin-right 8–10)
          └─ .more-btn-right (margin-left auto) → "…" .more-option-button (padding 2px 4px 1px; hover bg icon-hover-background, radius 6)
```
States: default border `#DFE3E8`, hover border `#98A0A9` (no shadow); live/upcoming/joined (`.now/.isComing/.joined/.selfJoined`) bg `#F2F8FF`, border `#A8CCF8`, hover border `#4793F1`; past `.isPast` bg `#F8F9FA`, title/meta `#555B62`, past title 14px/16px `#6E7680` when not joined, hover border `#98A0A9`; first upcoming card after past cards gets `margin-top:24px`; `.flashing` → `bgFlash 1s` (white → `rgba(31,180,237,.3)` → white). Keyboard focus on join controls: `box-shadow:0 0 0 2px #FFF, 0 0 0 4px #0E72ED; border-radius:6px`. Verbatim rules: Appendix A.

---

## 11. Toast [M CSS]
Not observed (Copy ID / Copy Invitation produced none in our session). App toast system = react-toastify: container fixed, **top-center**, `top:50px`, width 320, padding 4, z 9999; toast `min-height:40px; padding:8px; border:1px solid #C1C6CE; border-radius:10px; background:#FFF; box-shadow:0 24px 48px rgba(19,22,25,.2), 0 12px 24px rgba(19,22,25,.1); backdrop-filter:blur(10px)`; body padding 2; icon area `padding:0 15px 0 6px; font-size:24px` (success `#268543`, info `#0E72ED`, warn `#B36200`, failure `#E8173D`); title bold `#131619` mb 4; content 14px/20px `#131619`; close ✕ 14px `#131619`, margin-right 8; enter animation `bounceInDown` with `animation-duration:10ms` (effectively instant). Clone: use this for "Copied to clipboard" etc.

---

## 12. Files saved

**Screenshots** (`docs/reference/screens/`, 12): `home-01-overview.jpg`, `home-02-search-dialog.jpg`, `home-03-activity-center.jpg`, `home-04-profile-menu-status.jpg`, `home-05-profile-menu-help.jpg`, `home-06-about-modal.jpg`, `home-07-new-meeting-pmi-submenu.jpg`, `home-08-calendar-empty-no-promo.jpg` (promo hidden locally), `home-09-calendar-date-picker.jpg`, `home-10-chat-tab.jpg`, `home-11-contacts-tab.jpg`, `home-12-settings-dialog.jpg`. (Email replaced with `<email>` in 04/05.)

**Icons** (`docs/reference/icons/`, 31 `home-*` files, all `currentColor` unless noted):

| File | Use | Rendered size / colour |
|---|---|---|
| `home-header-history.svg` | header History | 14px `#2A2B2D` |
| `home-status-available.svg` / `-busy` / `-dnd` / `-away` / `-offline` / `-in-meeting` | presence glyphs (fixed colours) | 10×10 (in-meeting 16×10 on avatar) |
| `home-search-close.svg` | search dialog ✕ | 14px `#686F79` |
| `home-search-contacts.svg`, `home-search-channels.svg`, `home-search-messages.svg`, `home-search-files.svg` | search chips | 12px |
| `home-menu-profile.svg`, `home-menu-settings.svg`, `home-menu-plans-billing.svg`, `home-menu-help.svg` | profile menu rows | 16px `#222325` |
| `home-menu-chevron-right.svg` | submenu chevrons, PMI row | 16px / 14px |
| `home-menu-external.svg` | hover-only external link | 14px `#222325` |
| `home-menu-info.svg` | banner info (hidden in profile banner) | 20px |
| `home-menu-download.svg` | "Download the Zoom app" | 14px `#0D6BDE` |
| `home-nav-chat.svg`, `home-nav-contacts.svg` | rail tabs | 18px `#555B62` / `#222325` |
| `home-cal-chevron-down.svg` | date button chevron | 14px `#222325` |
| `home-cal-open-calendar.svg` | Open Calendar | 14px `#555B62` |
| `home-cal-today.svg` | Today pill | 12px `#222325` |
| `home-cal-prev.svg`, `home-cal-next.svg` | day nav | 14px `#555B62` |
| `home-cal-more.svg` | "…" (simplified to 3 circles r=1.45) | 14px `#555B62` |
| `home-cal-info.svg` | not-connected banner (outer ring simplified) | 20px `#3B90F7` |
| `home-cal-refresh.svg` | menu Refresh | 14px `#222325` |
| `home-empty-beach.svg` | empty state (multi-colour, not currentColor) | 89×90 |

Existing icons reused: `pwa-zoom-logo.svg`, `header-back/forward/search/bell.svg`, `nav-home/meetings/settings.svg`, `action-*.svg`, `chevron-down.svg`, `pwa-record/smart-summary/my-notes.svg`. (`ds-presence-*.svg` from another agent are the same presence glyphs.)

---

## Appendix A — Calendar widget CSS (verbatim, trimmed; `[data-v-*]` scopes removed)

Light-theme values of the variables are in §10.9. Missing from A.6 (excluded by the generator, add manually):
```css
.zoom-date-table td.today:not(.current,.in-range) { color:var(--zoom-color-inverse-global-default) }
.zoom-date-table td.today:not(.current,.in-range) .zoom-date-table__cell { background-color:var(--zoom-color-fill-global-primary) }
.zoom-date-table td.today:not(.current,.in-range) .zoom-date-table__cell:hover { background-color:var(--zoom-color-state-primary-hover) }
.zoom-date-table td.available:not(.current,.select-date,.in-range,.today) .zoom-date-table__cell:hover { background-color:var(--zoom-color-state-subtle-neutral-hover) }
@keyframes spinner-fade { 0%{opacity:.9} 12.5%{opacity:.8} 25%{opacity:.7} /* … continues to .2 */ }
@keyframes skeleton-pulse { 0%{opacity:1;transform:scale(1)} 50%{opacity:.33;transform:scale(.99)} to{opacity:1;transform:scale(1)} }
```

### A.1 Event card (`.list-item.meeting__card--item`) — sidebar agenda list
_Source: `sidebar.04f7241b.css` (loaded inside the `calendar-widget-app` shadow root)._ 

```css
.meeting-item-action,.meeting-item-action-wrap { display:flex; align-items:center }
.meeting-item-action { line-height:20px; color:var(--dynamic-color) }
.meeting-item-action .item-action-container { display:flex; align-items:center }
.meeting-item-action .item-action-recurrenceIcon { width:14px; height:14px }
.meeting-item-action span { font-size:14px; margin-left:3px; overflow:hidden; text-overflow:ellipsis }
.meeting-item-btn .zm-button { font-weight:400; font-size:14px; padding:2px 8px }
.meeting-item-btn .zm-button--small { border-radius:100px }
.meeting-item-summary .item-summary-content { background:var(--dynamic-active-left-bar-toggle); padding:4px; border-radius:8px; font-size:12px; font-weight:400; color:var(--dynamic-color); overflow:hidden; word-break:break-word; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-flex:1; -webkit-box-orient:vertical; flex:1; line-height:17px }
.indicator-icon-wrap { margin-right:4px }
.list-item { background-color:var(--meeting-item-background); position:relative; padding:8px; border:1px solid transparent; border-radius:12px; margin:4px 0; cursor:default }
.list-item:not(.list-item-no-fix-time) { border-color:var(--common-border-color) }
.list-item.isComing:not(.list-item-no-fix-time),.list-item.isPast.joined:not(.list-item-no-fix-time),.list-item.isPast.selfJoined:not(.list-item-no-fix-time),.list-item.now:not(.list-item-no-fix-time) { border-color:var(--meeting-now-border-color) }
.list-item.list-item-through .meeting-main-left { text-decoration:line-through }
.list-item .list-item-prepare { display:none }
.list-item .ml-8 { margin-left:8px }
.list-item:hover .list-item-prepare { display:block }
.list-item-no-fix-time { padding:4px 8px; border-radius:6px }
.list-item-no-fix-time .list-item--header { flex-direction:row }
.list-item.flag .flag { display:block }
.list-item .hide-events { pointer-events:none }
.list-item.isComing:not(.joined) .isComing,.list-item.joined .joined,.list-item.now:not(.joined):not(.inPastFifteen) .now { display:block }
.list-item .isComing,.list-item .joined,.list-item .now { display:none }
.list-item .flag { position:absolute; display:none; height:1px; width:100%; left:0; top:-3.5px; background:#ff5f0f }
.list-item .flag:before { content:""; position:absolute; width:7px; height:7px; left:0; top:0; border-radius:50%; background:#ff5f0f; transform:translate3d(-100%,-50%,0) }
.list-item .avatar { margin:6px 0 2px }
.list-item .host,.list-item .indicator { font-size:12px; font-weight:400; line-height:16px; color:var(--sidebar-item-normal-color); max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; text-align:left }
.list-item .indicator { margin-top:2px }
.list-item .location-line { margin-top:2px; font-size:12px; line-height:16px; display:flex; align-items:center; color:var(--sidebar-item-normal-color) }
.list-item .location-line .phoneNumber { color:#0e72ed; cursor:pointer }
.list-item .location-line>a { color:#0e72ed }
.list-item .location-line .location-line-text { flex:1 }
.list-item .location-line .location-icon,.list-item .location-line .room-icon { margin-right:2px }
.list-item .location-line .room-line { display:inline-block; width:calc(100% - 16px); text-overflow:ellipsis; overflow:hidden; white-space:nowrap }
.list-item .location-line .location-text:not(:last-child):after { content:";" }
.list-item .location-line .location-text-declined { text-decoration:line-through }
.list-item--header { display:flex; flex-direction:column }
.list-item--header .meeting-main-row { display:flex; align-items:flex-start; width:100%; gap:8px; flex:1; min-width:0 }
.list-item--header .meeting-main-left { flex:1; min-width:0 }
.list-item--header .meeting-main-right { flex-shrink:0; display:flex; align-items:center; justify-content:center }
.list-item--header .meeting-status,.list-item--header .on-paired-room { display:flex; align-items:center; font-size:10px!important; font-weight:700 }
.list-item--header .on-paired-room { color:var(--dynamic-now-text) }
.list-item--header .on-paired-room svg { margin-right:4px }
.list-item--header .time { flex:1 }
.list-item--header .time .allday { padding:1px 0; font-size:12px; line-height:16px }
.list-item--header .time .allday .isComing,.list-item--header .time .allday .now { color:var(--dynamic-now-text) }
.list-item--header .time .allday .joined { color:var(--dynamic-joined-text) }
.list-item--header .time .allday>div { margin-bottom:2px }
.list-item--header .time .allday__wrapper { display:flex; align-items:center }
.list-item--header .no-fix-time-meeting { display:flex; flex:1; overflow:hidden; padding-right:2px }
.list-item--header .no-fix-time-meeting .topic-container { flex:1; overflow:hidden }
.list-item--header .no-fix-title { display:block!important; font-size:12px!important; line-height:16px!important; flex:1; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; text-align:left }
.list-item--header .quick-icon { display:flex; justify-content:flex-end; align-items:center }
.list-item--header .quick-icon-hover { padding:5px; padding-top:3px; padding-bottom:3px; margin:2px }
.list-item--header .quick-icon-hover:hover { background:var(--dynamic-back-color-gray10-gray90); border-radius:6px }
.list-item--header .quick-icon-size { width:14px; height:14px }
.list-item--header .more { display:flex; flex-direction:row; align-items:center; justify-content:flex-start; text-align:right; margin-top:4px; overflow:hidden }
.list-item--header .more:not(.more-web-calendar) { min-height:26px; flex-shrink:0 }
.list-item--header .more>.mr-8 { margin-right:8px!important }
.list-item--header .more .more-btn-right { margin-left:auto; display:flex; align-items:center }
.list-item--header .more .more-option-button { padding:2px 4px 1px 4px; background:transparent }
.list-item--header .more .more-option-button:not(.disabled):hover { background:var(--icon-hover-background); border-radius:6px }
.list-item--header .more .nft-more { margin:3px 0 }
.list-item--header .more .zm-button--small { font-size:14px; line-height:20px; padding:2px 10px; margin-right:10px }
.list-item--header .more .rotate { font-size:18px; transform:rotateY(90deg) }
.list-item--header .more .zm-button { margin-right:8px }
.list-item--header .date { display:flex; align-items:center }
.list-item--header .calendar-OutOfOffice-icon,.list-item--header .recurrenceIcon { font-size:12px; margin-left:6px; color:var(--dynamic-color-gray70-gray50) }
.list-item--header .calendar-OutOfOffice-icon { margin-left:0!important }
.list-item--header .calendar-instant-icon { height:16px; width:16px; vertical-align:middle; margin-right:4px }
.list-item .private { display:inline-block }
.list-item .private-box { margin-left:auto; align-self:normal; line-height:20px }
.list-item .private-lock { color:var(--sidebar-item-normal-color); font-size:14px }
.list-item .locked-box { transform:scale(.9); margin-left:4px }
.list-item .title { display:flex; font-weight:590; font-size:14px }
.list-item .title .icon-recurrence { padding-top:2px }
.list-item .title .calendar-OutOfOffice-icon { margin-right:4px; margin-top:2px; vertical-align:top }
.list-item .title .title-text { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; overflow-wrap:break-word; word-break:break-word; line-height:20px; flex:1; color:var(--sidebar-item-normal-color); padding-right:4px }
.list-item.isComing,.list-item.isPast.joined,.list-item.isPast.selfJoined,.list-item.now { background:var(--fill-subtler-primary) }
.list-item.isComing:hover,.list-item.isPast.joined:hover,.list-item.isPast.selfJoined:hover,.list-item.now:hover { border-color:var(--meeting-hover-border-color) }
.list-item.isPast { background:var(--sidebar-item-past-background) }
.list-item.isPast:hover { border-color:#98a0a9 }
.list-item.isPast:not(.joined):not(.selfJoined) .title { color:#6e7680; font-size:14px; line-height:16px }
.list-item.isPast .location-line .phoneNumber,.list-item.isPast .location-line,.list-item.isPast:not(.joined):not(.selfJoined) .private-box .private-lock { color:var(--sidebar-item-past-color) }
.list-item.isPast .location-line .phoneNumber:hover { color:#0e72ed }
.list-item.isPast .location-line>a { color:#6e7680 }
.list-item.isPast .location-line>a:hover { color:#0e72ed }
.list-item.isPast .date,.list-item.isPast .list-item--header .time .allday { color:var(--sidebar-item-past-color) }
.list-item.isPast .more-icon .zm-button { color:var(--dynamic-color-gray60-gray10) }
.list-item.isPast .title-text { color:var(--sidebar-item-past-color) }
.list-item.isPast.joined .date { color:var(--sidebar-item-normal-color); display:none }
.list-item.isPast .host,.list-item.isPast .indicator,.list-item.isPast .recurrenceIcon { color:var(--sidebar-item-past-color) }
.list-item.joined .date { color:var(--sidebar-item-normal-color); display:none }
.list-item .item-info-part { width:calc(100% - 80px) }
.list-item .item-info-part p { margin:0; font-size:12px; color:#6e7680; overflow:hidden; text-overflow:ellipsis; white-space:nowrap }
.list-item .item-info-part p>span { color:#e8173d; padding-right:10px }
.list-item .item-info-part .title { font-weight:700; overflow:hidden; white-space:nowrap; text-overflow:ellipsis }
.list-item .item-info-part .attendee { overflow:hidden; white-space:nowrap; text-overflow:ellipsis; max-width:99% }
.list-item .item-function-part { display:flex; align-items:center }
.list-item .item-function-part>img { cursor:pointer }
.list-item .item-function-part .zm-button { font-weight:500; font-size:14px; margin-left:10px }
.list-item.pastEvent { background:#eceff2 }
.list-item.pastEvent .item-info-part p { color:#b0b4bc }
.list-item.pastEvent .item-info-part .title { color:#7c8083 }
@keyframes bgFlash-7c98f55b 0% { background:#fff }
@keyframes bgFlash-7c98f55b 50% { background:rgba(31,180,237,.3) }
@keyframes bgFlash-7c98f55b to { background:#fff }
.list-item.flashing { animation-name:bgFlash-7c98f55b; animation-duration:1s }
.joinMeeting { display:none }
.inPastFifteen .more-web-calendar:not(:empty),.isComing .more-web-calendar:not(:empty),.joined .more-web-calendar:not(:empty),.now .more-web-calendar:not(:empty),.selfJoined .more-web-calendar:not(:empty) { min-height:26px!important }
.inPastFifteen .joinMeeting,.isComing .joinMeeting,.joined .joinMeeting,.now .joinMeeting,.selfJoined .joinMeeting { display:block; min-width:0; overflow:hidden }
.inPastFifteen .joinMeeting :focus-visible,.isComing .joinMeeting :focus-visible,.joined .joinMeeting :focus-visible,.now .joinMeeting :focus-visible,.selfJoined .joinMeeting :focus-visible { outline:none; box-shadow:0 0 0 2px var(--dynamic-back-color),0 0 0 4px #0e72ed; border-radius:6px }
.inPastFifteen .list-item-prepare,.isComing .list-item-prepare,.joined .list-item-prepare,.now .list-item-prepare,.selfJoined .list-item-prepare { margin-left:8px }
.isComing .date,.now:not(.inPastFifteen) .date { color:var(--sidebar-item-normal-color); display:none }
.isPast:not(.joined):not(.selfJoined)+div:is(.isPast.joined) { margin-top:24px }
.isPast:not(.joined):not(.selfJoined)+div:not(.isPast) { margin-top:24px }
.meeting__card--item:hover { border:1px solid #98a0a9; box-shadow:none }
.list-item .more .joinMeeting .zr-split { display:block }
.list-item .more .joinMeeting .zoom-dropdown__buttons-group { display:flex; width:100%; min-width:0 }
.list-item .more .joinMeeting .zoom-button.is-main { flex:1 1 0; min-width:0; overflow:hidden }
.list-item .more .joinMeeting .zoom-button.is-main .zoom-button__label { overflow:hidden; text-overflow:ellipsis; white-space:nowrap }
.list-item .more .joinMeeting .join-meeting-box { overflow:hidden; max-width:100% }
.list-item .more .joinMeeting .join-meeting-box .zm-button>span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap }
.no-fixed-time-meetings { position:relative; padding:0 16px; background-color:var(--dynamic-color-FFFFFF-131619); border-top:1px solid var(--meeting-item-border-color); line-height:16px; font-size:14px; font-weight:400; text-align:left; cursor:default; color:var(--dynamic-color-444B53-98A0A9); height:40px; display:flex; align-items:center; flex-shrink:0 }
.no-fixed-time-meetings .meetings-btn { display:flex; align-items:center; cursor:pointer }
.no-fixed-time-meetings .meetings-btn .meetings-btn--icon { width:4.8px; height:8px; margin-left:10px; margin-right:8px }
```

### A.2 Sidebar day view / list containers / empty state
_Source: `7908.bf31e129.css` (loaded inside the `calendar-widget-app` shadow root)._ 

```css
.sidebarItem { display:flex; flex-direction:column; overflow:hidden; height:100% }
.sidebarItem .operation:not(.operation-host-nav) { max-height:50% }
.sidebarItem .operation:has(.date-operation) { min-height:88px }
.sidebarItem .operation:has(.date-operation):has(.filter-condition-inner) { min-height:126px }
.sidebarItem .operation:has(.date-operation):has(.all-day__container) { min-height:142px }
.sidebarItem .operation:has(.date-operation):has(.filter-condition-inner):has(.all-day__container) { min-height:170px }
.sidebarItem .operation { display:flex; flex-direction:column }
.sidebarItem .operation .zm-button { margin-left:4px }
.sidebarItem .operation .prevOrNext { color:var(--dynamic-color); font-size:14px; line-height:20px; margin-bottom:10px; display:flex; flex-direction:column; align-items:flex-start }
.sidebarItem .operation .prevOrNext.hideTitlePadding { margin-bottom:0 }
.sidebarItem .operation .prevOrNext .date-operation { height:44px; padding-right:16px; padding-left:8px; width:100%; display:flex; align-items:center; justify-content:space-between }
.sidebarItem .operation .prevOrNext .date-operation.date-operation-bg { background-color:var(--dynamic-color-f7f9fa-2A2B2D) }
.sidebarItem .operation .prevOrNext .date-operation .day { font-weight:500; line-height:26px; flex:1; display:flex; justify-content:center }
.sidebarItem .operation .prevOrNext .date-operation-close { margin-right:4px }
.sidebarItem .operation .prevOrNext .data-tools { height:44px; width:100%; padding:0 16px; border-top:1px solid var(--dynamic-border-color-DFE3E8-gray80); border-bottom:1px solid var(--dynamic-border-color-DFE3E8-gray80); display:flex; align-items:center; justify-content:space-between }
.sidebarItem .operation .prevOrNext .data-tools .today-circle { height:24px; display:flex; align-items:center; border:1px solid var(--calendar-border-neutral)!important; margin-left:0; font-weight:400 }
.sidebarItem .operation .prevOrNext .data-tools .today-circle .zoom-button__label { display:flex; align-items:center }
.sidebarItem .operation .prevOrNext .data-tools .today-circle .jump-today { width:13px; height:13px; margin-right:3px; color:var(--icon-gotoday-color) }
.sidebarItem .operation .prevOrNext .data-tools .next { display:flex; align-items:center }
.sidebarItem .operation .prevOrNext .left-btn,.sidebarItem .operation .prevOrNext .right-btn { height:24px; width:24px; padding:0 4px }
.sidebarItem .operation .event__card { color:var(--dynamic-color); font-size:12px; line-height:16px; display:flex; padding-left:8px }
.sidebarItem .no__events--container { display:flex; justify-content:center; text-align:center; font-weight:400; font-size:14px; line-height:20px; color:var(--dynamic-color-6e7680)!important }
.sidebarItem .sidebar-beach-empty { width:89px; height:90px; margin-bottom:24px }
.sidebarItem .sidebar-schedule { width:13px; height:13px; margin-right:2px }
.sidebarItem .no__events--schedule { display:block; margin-top:4px; font-weight:400; font-size:14px; line-height:20px; color:var(--dynamic-color-0956B5-blue50); cursor:pointer }
.sidebarItem .no__events--schedule:focus-visible { outline:none; box-shadow:0 0 0 2px var(--dynamic-back-color),0 0 0 4px #0e72ed; border-radius:6px }
.sidebarItem .schedule-meeting-empty { display:inline-block; width:auto }
.sidebarItem .other { color:var(--dynamic-color); flex:1; overflow:auto; background-color:transparent; position:relative; margin:auto 0; overflow-x:hidden }
.sidebarItem .other .no-event-font { font-size:14px; color:var(--filter-text-color) }
.sidebarItem .sidebar-agenda-view,.sidebarItem .sidebar-calendar-view { position:relative; flex:1; display:flex; flex-direction:column; overflow:hidden }
.sidebarItem .sidebar-view { height:100% }
.sidebarItem .container__item { position:relative; box-sizing:border-box; min-height:98%; display:inline-block; width:100% }
.sidebarItem .today { padding:2px 4px!important }
.sidebarItem .calendar-today { width:14px; height:14px; vertical-align:sub }
.sidebarItem .no-fixed-time-meeting { color:var(--dynamic-color-gray60-gray50); font-size:12px; font-weight:510; line-height:16px; padding:12px 0; margin-top:24px; cursor:default }
.sidebarItem .no-fixed-time-meeting-list { padding:12px 16px }
.sidebarItem .no-fixed-time-meeting-empty { color:var(--dynamic-color) }
.sidebarItem .nft-empty { text-align:left; margin-left:16px }
.select-time { border:none!important; padding:2px 8px!important; margin-left:0!important; font-weight:700!important }
.ax-container { padding:4px 16px }
.no__events--text { color:var(--filter-text-color) }
.date-operation_right { display:flex; align-items:center }
.sidebar-view { background:var(--dynamic-color-FFFFFF-131619); display:flex; flex-direction:column; box-sizing:content-box; overflow-x:hidden; position:relative; flex:1; height:100% }
.sidebar-view .event-meeting-list { overflow:hidden; flex:1 }
.sidebar-view .event-meeting-list .container { position:relative; width:100%; height:100%; overflow:hidden }
.sidebar-view .event-meeting-list .container .inboxFixed { height:100%; overflow:hidden }
```

### A.3 Loading skeleton (`.sidebar-event-loading`)
_Source: `app.33d0302d.css` (loaded inside the `calendar-widget-app` shadow root)._ 

```css
.sidebar-event-loading .loading-config { width:calc(100% - 32px); height:26px; margin:16px; margin-bottom:4px }
.sidebar-event-loading .loading-config .zm-skeleton__item { height:100% }
.sidebar-event-loading .loading-event-list { width:calc(100% - 32px); height:114px; background-color:var(--common-skeleton-card-back); padding:8px; border:1px solid transparent; border-radius:12px; border-color:var(--common-skeleton-card-border); margin:4px 16px }
.sidebar-event-loading .loading-event-list .title { width:100%; height:20px }
.sidebar-event-loading .loading-event-list .content { width:126px; height:16px; margin-top:5px }
.sidebar-event-loading .loading-event-list .config { width:58px; height:20px; margin-top:8px; float:right }
```

### A.4 Skeleton / spinner / loading primitives
_Source: `chunk-zoom-ui.be6b3ccd.css` (loaded inside the `calendar-widget-app` shadow root)._ 

```css
.zoom-spinners { position:relative; display:inline-block }
.zoom-spinners.is-lg { width:48px; height:48px }
.zoom-spinners.is-lg .zoom-spinners__spinner { width:6px; border-radius:6px }
.zoom-spinners.is-lg .zoom-spinners__circle { width:48px; height:48px }
.zoom-spinners.is-md { width:32px; height:32px }
.zoom-spinners.is-md .zoom-spinners__spinner { width:4px; border-radius:4px }
.zoom-spinners.is-md .zoom-spinners__circle { width:32px; height:32px }
.zoom-spinners.is-smx { width:24px; height:24px }
.zoom-spinners.is-smx .zoom-spinners__spinner { width:3px; border-radius:3px }
.zoom-spinners.is-smx .zoom-spinners__circle { width:24px; height:24px }
.zoom-spinners.is-sm { width:16px; height:16px }
.zoom-spinners.is-sm .zoom-spinners__spinner { width:2px; border-radius:2px }
.zoom-spinners.is-sm .zoom-spinners__circle { width:16px; height:16px }
.zoom-spinners__spinner { position:absolute; top:38%; left:46%; width:4px; height:25%; border-radius:4px; background-color:var(--zoom-color-fill-contrary-strong-transparent); animation:spinner-fade .8s linear infinite }
.zoom-spinners__spinner:first-child { animation-delay:-.3s }
.zoom-spinners__spinner:nth-child(2) { animation-delay:-.2s }
.zoom-spinners__spinner:nth-child(3) { animation-delay:-.1s }
.zoom-spinners__spinner:nth-child(4) { animation-delay:0s }
.zoom-spinners__spinner:nth-child(5) { animation-delay:-.7s }
.zoom-spinners__spinner:nth-child(6) { animation-delay:-.6s }
.zoom-spinners__spinner:nth-child(7) { animation-delay:-.5s }
.zoom-spinners__spinner:nth-child(8) { animation-delay:-.4s }
.zoom-spinners__spinner.is-light { background-color:hsla(0,0%,100%,.48) }
.zoom-spinners__spinner:first-child { transform:rotate(-135deg) translateY(-120%) }
.zoom-spinners__spinner:nth-child(2) { transform:rotate(-90deg) translateY(-120%) }
.zoom-spinners__spinner:nth-child(3) { transform:rotate(-45deg) translateY(-120%) }
.zoom-spinners__spinner:nth-child(4) { transform:rotate(0deg) translateY(-120%) }
.zoom-spinners__spinner:nth-child(5) { transform:rotate(45deg) translateY(-120%) }
.zoom-spinners__spinner:nth-child(6) { transform:rotate(90deg) translateY(-120%) }
.zoom-spinners__spinner:nth-child(7) { transform:rotate(135deg) translateY(-120%) }
.zoom-spinners__spinner:nth-child(8) { transform:rotate(180deg) translateY(-120%) }
.zoom-spinners__circle { color:#0d6bde; animation:loading-circle 1s linear infinite }
.zoom-loading-parent--relative { position:relative!important }
.zoom-loading-parent--hidden { overflow:hidden!important }
.zoom-loading { position:absolute; top:0; right:0; bottom:0; left:0; z-index:100; margin:0; background-color:var(--zoom-color-underlay-default); transition:opacity .3s }
.zoom-loading.is-fullscreen { position:fixed; z-index:9999 }
.zoom-loading.is-inlined-in-button { top:-1px; left:-1px; width:calc(100% + 2px); height:calc(100% + 2px); border-radius:8px }
.zoom-loading.is-no-background { background-color:transparent }
.zoom-loading__text { margin-top:8px; color:var(--zoom-color-text-stronger-neutral); font-weight:400; font-style:normal; font-size:12px; line-height:16px }
.zoom-loading__text.is-lg { font-weight:400; font-style:normal; font-size:14px; line-height:18px }
.zoom-loading__main { position:absolute; top:50%; left:0; display:inline-flex; flex-direction:column; align-items:center; width:100%; text-align:center; transform:translateY(-50%) }
.zoom-loading__wrapper { display:flex; flex-direction:column; justify-content:center; align-items:center }
.zoom-loading__wrapper.is-active { padding:16px; border-radius:16px; background-color:var(--zoom-color-fill-elevated-default); backdrop-filter:blur(15px) }
.zoom-loading-fade-enter-from,.zoom-loading-fade-leave-to { opacity:0 }
.zoom-skeleton__item { width:100%; height:20px; border-radius:4px; background-color:var(--zoom-color-fill-contrary-subtler-transparent) }
.zoom-skeleton__item.is-has-space { margin-top:8px }
.zoom-skeleton__circle { width:60px; height:60px; border-radius:100% }
.zoom-skeleton__button { width:60px; height:32px; border-radius:8px }
.zoom-skeleton__text.is-last { width:66% }
.zoom-skeleton__image { display:flex; justify-content:center; align-items:center; width:unset }
.zoom-skeleton__image svg { width:22%; height:22%; fill:var(--zoom-color-skeleton-image) }
.zoom-skeleton { width:100% }
.zoom-skeleton.is-animated .zoom-skeleton__item { animation:skeleton-pulse 1.5s ease-in-out infinite }
```

### A.5 Buttons used in the widget (`.zoom-button`)
_Source: `chunk-zoom-ui.be6b3ccd.css` (loaded inside the `calendar-widget-app` shadow root)._ 

```css
.zoom-button { position:relative; display:inline-flex; vertical-align:middle; justify-content:center; align-items:center; box-sizing:border-box; border:none; outline-offset:2px; white-space:nowrap; cursor:pointer; -webkit-appearance:none; -moz-appearance:none; appearance:none; font-weight:400; font-style:normal; font-size:14px; line-height:18px }
.zoom-button--primary { font-weight:500; background-color:var(--zoom-color-fill-global-primary); color:var(--zoom-color-inverse-global-default) }
.zoom-button--primary:focus { color:var(--zoom-color-inverse-global-default); outline:none }
.zoom-button--primary:hover:not(.is-loading) { background-color:var(--zoom-color-state-primary-hover); color:var(--zoom-color-inverse-global-default) }
.zoom-button--primary:active:not(.is-loading) { background-color:var(--zoom-color-state-primary-press); color:var(--zoom-color-inverse-global-default) }
.zoom-button--secondary { background-color:var(--zoom-color-fill-subtle-neutral); color:var(--zoom-color-text-primary) }
.zoom-button--secondary.zoom-button__icon { background-color:var(--zoom-color-fill-contrary-subtler-transparent); color:var(--zoom-color-icon-stronger-neutral) }
.zoom-button--secondary.zoom-button__icon:focus { color:var(--zoom-color-icon-stronger-neutral); outline:none }
.zoom-button--secondary.zoom-button__icon:hover:not(.is-loading) { background-color:var(--zoom-color-state-subtle-neutral-hover); color:var(--zoom-color-icon-stronger-neutral) }
.zoom-button--secondary.zoom-button__icon:active:not(.is-loading) { background-color:var(--zoom-color-state-subtle-neutral-press); color:var(--zoom-color-icon-stronger-neutral) }
.zoom-button--secondary:focus { color:var(--zoom-color-text-primary); outline:none }
.zoom-button--secondary:hover:not(.is-loading) { background-color:var(--zoom-color-state-subtle-neutral-hover); color:var(--zoom-color-state-primary-hover) }
.zoom-button--secondary:active:not(.is-loading) { background-color:var(--zoom-color-state-subtle-neutral-press); color:var(--zoom-color-state-primary-press) }
.zoom-button--tertiary { background-color:transparent; color:var(--zoom-color-text-primary) }
.zoom-button--tertiary:focus { color:var(--zoom-color-text-primary); outline:none }
.zoom-button--tertiary:hover:not(.is-loading) { background-color:var(--zoom-color-state-subtle-neutral-hover); color:var(--zoom-color-state-primary-hover) }
.zoom-button--tertiary:active:not(.is-loading) { background-color:var(--zoom-color-state-subtle-neutral-press); color:var(--zoom-color-state-primary-press) }
.zoom-button--md { height:32px; padding:6px 14px; border-radius:12px; font-size:14px }
.zoom-button--md.zoom-button--tertiary { padding:6px 8px }
.zoom-button--sm { height:24px; line-height:16px; padding:2px 10px; border-radius:999px; font-size:12px }
.zoom-button--sm.zoom-button--tertiary { padding:2px 8px }
.zoom-button__icon { padding:0 }
.zoom-button__icon.zoom-button--tertiary { background-color:transparent; color:var(--zoom-color-icon-strong-neutral) }
.zoom-button__icon.zoom-button--tertiary:focus { color:var(--zoom-color-icon-strong-neutral); outline:none }
.zoom-button__icon.zoom-button--tertiary:hover:not(.is-loading) { background-color:var(--zoom-color-state-subtle-neutral-hover); color:var(--zoom-color-icon-strong-neutral) }
.zoom-button__icon.zoom-button--tertiary:active:not(.is-loading) { background-color:var(--zoom-color-state-subtle-neutral-press); color:var(--zoom-color-icon-strong-neutral) }
```

### A.6 Mini date picker table (`.zoom-date-table`)
_Source: `chunk-zoom-ui.be6b3ccd.css` (loaded inside the `calendar-widget-app` shadow root)._ 

```css
.zoom-date-table { table-layout:fixed; font-size:14px }
.zoom-date-table th { color:var(--zoom-color-text-neutral); font-weight:400; text-align:center }
.zoom-date-table th:last-child .zoom-date-table__cell { margin-right:0 }
.zoom-date-table td { padding:0; color:var(--zoom-color-text-stronger-neutral); outline:none }
.zoom-date-table td:last-child .zoom-date-table__cell { margin-right:0 }
.zoom-date-table td.current .zoom-date-table__cell,.zoom-date-table td.select-date .zoom-date-table__cell { border:1px solid var(--zoom-color-border-subtle-primary); background-color:var(--zoom-color-component-toggle-button-background-selected); color:var(--zoom-color-text-primary); font-weight:600 }
.zoom-date-table td.next-month .zoom-date-table__cell,.zoom-date-table td.prev-month .zoom-date-table__cell { color:var(--zoom-color-text-neutral) }
.zoom-date-table td.disabled .zoom-date-table__cell { color:var(--zoom-color-state-disable); cursor:not-allowed }
.zoom-date-table__cell { position:relative; width:32px; height:32px; border:1px solid transparent; border-radius:999px; font-weight:400; font-size:14px; line-height:30px; cursor:pointer }
.zoom-date-table__cell:focus { outline:none }
.zoom-date-table__cell span { position:relative }
.zoom-date-panel { position:relative }
.zoom-date-panel__body { position:relative; width:278px; padding:15px; text-align:center }
.zoom-date-panel__header { height:24px }
.zoom-date-panel__prev-btn { float:left }
.zoom-date-panel__prev-btn .zoom-button+.zoom-button { margin:0 }
.zoom-date-panel__next-btn { float:right }
.zoom-date-panel__next-btn .zoom-button+.zoom-button { margin:0 }
.zoom-date-panel__header-label { display:inline-block; padding:0 2px; color:var(--zoom-color-text-stronger-neutral); outline:none; font-weight:600; font-size:14px; line-height:24px }
.zoom-date-panel__header-label-btn { border-radius:4px; cursor:pointer }
.zoom-date-panel__header-label-btn:hover { background-color:var(--zoom-color-state-subtle-neutral-hover) }
.zoom-date-panel__sidebar { position:absolute; top:0; bottom:0; padding:11px 3px; border-right:1px solid var(--zoom-color-border-subtle-neutral) }
.zoom-date-panel__sidebar+.zoom-date-panel__body { margin-left:143px }
.zoom-date-panel__footer { padding:8px 0; border-top:1px solid var(--zoom-color-border-subtle-neutral); text-align:center }
```
