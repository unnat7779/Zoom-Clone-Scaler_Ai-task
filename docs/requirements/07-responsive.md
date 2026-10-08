# 07 — Responsive behaviour (prefix `resp`)

Captured on 2026-10-07 from the live, signed-in Zoom Workplace web app (`app.zoom.us`, PWA 7.2.0.3239) and the web portal (`zoom.us`, static 26.9.67982). Each viewport was set on a dedicated tab with `resize_window`, the page was **reloaded**, and every box was read from the DOM (`getBoundingClientRect` / `getComputedStyle`). Breakpoint edges were confirmed by resizing 1 px either side of each edge without reloading. Unless a value is marked [D], it is [M].

Viewports: **1920×1080, 1440×900, 1280×720, 1024×768, 768×1024 (tablet), 390×844 (phone)**. Below 768 px wide, the browser pane also switches to an **Android Chrome user agent** with DPR 2. This matters for `zoom.us/join`, which redirects by user agent on the server.

---

## 1. Corrections to PRD.md

| PRD § | PRD says | Measured |
|---|---|---|
| 11 (<768) | The left rail becomes a 56 px bottom tab bar. | **Zoom never changes the rail.** It stays 80 px wide (tabs 72×56 at x=4, Settings pinned at the bottom) at every width, including 390. At 390 the content card is only **304 px** wide (x 80→384). |
| 11 (768–1199) | The header hides "Admin Center" and "Download", and search shrinks to `min(410px,30vw)`. | Search width = **`clamp(160px, 30vw, 440px)`**, then flex-shrunk to the free space. **≤1080 px:** "Admin Center" **and** the Back/Forward/History cluster are hidden, and search collapses to a **32×32 icon button**. **≤768 px:** the "Workplace" word-mark, **Download** and **Upgrade** are hidden. "Download" stays visible from 769 to 1080 px. |
| 6.1 | Header items (no mention of extra items) | **≥1440 px (JS, live on resize):** a leading slot with **"Discover Products ▾"** (148×32) and **"Pricing"** (60×32) appears at x=282. At ≤1439 the slot is empty. At 1366 the layout matches the PRD: nav at x=377, search 410×32 at x=455. |
| 11 | Home column `width:min(600px,96%)` | The home column is a **fixed 600 px** down to 1025 px. **≤1024: `width:96%!important`**, so it gets **wider** (900 px at 1024, 655 px at 768, 292 px at 390). Hub cards stretch to match: 289 px each at 1024. |
| 11 (<768) | The clock becomes 32 px and the action-button gap becomes 32. | The clock stays **40px/40px 600** at every width. The action row keeps `gap:60px; row-gap:32px` and the row is a fixed **288 px**. It does **not** wrap at 390, so the "New meeting" label (106 px wide) spills past the card edge and is **clipped** (only "w meeting ⌄" shows). |
| 11 (<768) | Hub entries stack full-width. | Correct. The mechanism is `flex:1 1 160px; flex-wrap:wrap; gap:16px`. At 390: 3 rows of 292×56 with 16 px gaps. At 768 they stay 3 across (208 px each). |
| 11 | Meetings left column 300px at 768–1199. At <768, list only, with a pushed full-screen detail. | The left column is a **fixed 360 px at all widths**. The detail pane flex-shrinks: 1472 / 992 / 832 / 576 / 320 px. At 768 its title wraps and the Edit button wraps to a 2nd row. **At 390 the 360 px list overflows the 304 px card and the detail pane is entirely clipped (invisible).** Zoom has no list/detail push. |
| 11 | Join modal `calc(100vw - 32px)`, radius 24 | The CSS has no media query: **`width:min(448px, 100vw - 48px)`**, `max-height:min(100vh - 40px, 520px)`. Radius stays **32**, padding stays **32**. At 390: 342×238 at x=24. Always centred on both axes. |
| 11 | Schedule side menu collapses to a 56 px hamburger at 768–1199. | The 300 px side menu stays from 1024 up. **≤1023:** the grid becomes `display:block` and the menu turns into a **full-width 38 px "Meetings ⌄" bar** above the content. The header gets a **hamburger** (42×32) from 768 to 1024, and the mobile header applies at ≤767. |
| 11 | Schedule: labels stack, selects full width. | Partly right. Stacking happens at **≤767** only. Topic, Time Zone and Invitees go 100 %. The date (240) and time (173) keep their widths, with time on a new line. Duration selects are 80 % each. At 768 to 1023 the 160 px label column is kept. |
| 7.1.0 | Calendar widget container 600×337 | `.home__calendar-widget{flex:1 1; height:300px; overflow:hidden}` inside a column-flex `.home__cards` (`overflow:auto`). The widget **fills the remaining viewport height**: 600×471 @1920×1080, 600×291 @1440×900, 600×111 @1280×720, 900×159 @1024×768, 655×337 @768×1024. At 390×844 it is **0 px** (fully squeezed). |
| — (new) | — | **≤768 px: Home shows a "Download the Zoom app" CTA banner** at the top of the content card (§2.1.3). It is JS-driven and absent at 769. |
| — (new) | — | **Phone user agent: `zoom.us/join` redirects** (server side) to `/support/down4j?from=launch&u=zoomus://zoom.us/join`, a "launch / download the app" page (§2.5.3). `app.zoom.us/wc/*` shows **no** unsupported screen on phones. |
| 7.3 | Meetings v-divider 1px `#EDEDF4` | `.meetings-container__v-divider{width:2px;background:#7d7d8821}` [M CSS] |
| 7.3 | (Promo omitted) | Meetings page: a `.billing-merchandising-widget` sits **below** the content card (6 px gap, radius 12). It is 110 px tall at ≥1280, **86 px** at 768–1024 (image hidden) and 162 px at 390 (stacked, full-width Upgrade). The card shrinks by that amount. |
| 7.4.1 | Portal header 64 px; black strip optional | On `/meeting/schedule` at ≥768 the 40 px black strip is **present**, so the header totals **104 px**. `/join` has no strip (64 px). At ≤767 the strip is hidden and the header is **50 px**. |

---

## 2. Per-page measurements

### 2.0 Shell constants (all widths) [M]
| Item | Value |
|---|---|
| Header | `0,0 100vw×64`, bg `#FFF`, border-bottom 1px `#DFE3E8`, padding `0 16px`, gap 48 between the left logo block and the right slot |
| Logo | img 87×20 at (16,22). Word-mark "Workplace" 22px/24px 600 `#222325`, padding-left 12 (x=115). Hidden ≤768. |
| Right slot container | `display:flex; gap:24px` = [leading] [searchArea flex:1, min-width 160, centred] [trailing gap:12, justify flex-end] |
| Left rail | x=0, y=68, **80 wide**, padding `0 4px`, tabs 72×56 at y=68/126/184/242 (2 px gap), Settings 72×56 pinned at bottom (bottom 16). **Unchanged at every width.** |
| Content card | `.main-body-layout_appsContainer` x=80, y=68, `width:calc(100vw - 86px)`, `height:calc(100vh - 74px)`, bg `#FFF`, radius 12, overflow hidden. Parent `padding:0 6px 6px 0`. |

### 2.1 Home `/wc/home`

#### 2.1.1 Per-viewport table [M]
| Box | 1920×1080 | 1440×900 | 1366×768 (ref) | 1280×720 | 1024×768 | 768×1024 | 390×844 |
|---|---|---|---|---|---|---|---|
| Leading (Discover/Pricing) | 282,16 231×32 | 282,16 231×32 | hidden (empty) | hidden | hidden | hidden | hidden |
| Back/Fwd/History cluster | 754,16 72×32 | 537,16 72×32 | 377,16 72×32 | 347,16 72×32 | **display:none** | none | none |
| Search | 832,16 **440**×32 (text) | 615,16 **395**×32 | 455,16 **410**×32 | 425,16 **384**×32 | **676,16 32×32 icon** | 620,16 32×32 icon | 242,16 32×32 icon |
| Admin Center | 1514,16 102×32 | 1034 | 960 | 874 | **hidden** | hidden | hidden |
| Download | 1628,16 91×32 | 1148 | 1074 | 988 | 732,16 91×32 | **hidden** | hidden |
| Upgrade | 1731,16 85×32 | 1251 | 1177 | 1091 | 835,16 85×32 | **hidden** | hidden |
| Bell | 1828,16 32×32 | 1348 | 1274 | 1188 | 932 | 676 | 298 |
| Avatar | 1872,16 32×32 | 1392 | 1318 | 1232 | 976 | 720 | 342 |
| Content card | 80,68 1834×1006 | 1354×826 | 1280×694 | 1194×646 | 938×694 | 682×950 | **304×770** |
| Download CTA | — | — | — | — | — | 86,74 670×72 | 86,74 292×90 |
| Time (40px/40px 600) | 910,132 175×40 | 669,132 | ≈632,132 [D] | 589,132 | 463,132 | **333,210** | 144,228 |
| Date (16px) | 915,180 165×20 | 675,180 | — | 595,180 | 467,180 | 339,258 | 150,276 |
| Actions row (288×85) | 853,228 | 613,228 | 576,228 | 533,228 | 405,228 | 277,306 | **88,324** (overflows) |
| Action buttons 56×56 | x 853/969/1085 | 613/729/845 | 576/692/808 | 533/649/765 | 405/521/637 | 277/393/509 | 88/204/320 |
| `.home__cards` | 697,337 **600**×737 | 457,337 600×557 | 420,337 600 | 377,337 600×377 | 99,337 **900**×425 | 94,415 **655**×603 | 86,433 **292**×405 |
| Hub entries | 3× 189×56 | 3× 189×56 | 3× 189×56 | 3× 189×56 | 3× **289**×56 | 3× **208**×56 | **stacked** 3× 292×56 (rows y 433/505/577) |
| Billing promo widget | 600×178 | 600×178 | — | 600×178 | 900×178 | 655×178 | 292×173 (inner scroll) |
| Calendar widget | 600×**471** | 600×291 | — | 600×**111** | 900×159 | 655×337 | 292×**0** |

Screenshots: `resp-home-1920/1440/1280/1024/768/390.jpg`.

#### 2.1.2 Header rules (from `main.css`) [M CSS]
```css
/* searchArea: centred column containing [nav 72px][6px][search] */
.searchArea{display:flex;flex:1 1;justify-content:center;min-width:160px;overflow:hidden}
.searchItem .global-search-header-anchor{width:clamp(160px,30vw,440px);flex:0 1 auto;min-width:0}
@media (max-width:1080px){
  .adminItem{display:none}
  .searchArea{justify-content:flex-end;min-width:32px}
  /* back/forward/history (navigate cluster) display:none; label + ⌘K shortcut hidden */
  .search-trigger{width:32px;height:32px;padding:0;background:transparent;border-radius:8px}
  .search-trigger:hover{background:#52528017}
  .search-trigger:active,.search-trigger[aria-expanded=true]{background:#5252802e}
}
@media (max-width:768px){
  .frame-common-header__logo-text{display:none}
  .leading,.adminItem,.downloadItem,.upgradeItem{display:none}
}
```
- Collapsed search icon: 32×32 button, 1px transparent border, radius 8, magnifier svg **16×16**. It sits right-aligned in the search area, **24 px** before the trailing cluster.
- **Discover Products / Pricing** (≥1440, JS): prism tertiary buttons with radius 12, padding `6px 8px`, gap 4. Label 14px/20px 400 `#555B62`, ls −0.15px. Discover has a 12 px chevron-down. The two items are 24 px apart. Hover bg `hsla(213,8%,47%,.122)`, text `#0C60C8`. Pressed bg `hsla(213,8%,47%,.239)`, text `#084085`.
- **Profile menu ≤768** (`other.css`): `.common-header-profile__popover{top:0;right:0;bottom:0;left:0;width:100%;border:none;border-radius:0;box-shadow:none}`, so it becomes a **full-screen sheet**. `.common-header-profile__popover-header` shows only at ≤768 and is hidden ≥769.

#### 2.1.3 "Download the Zoom app" CTA (≤768 px only) [M]
Structure: `div.DownloadMobileCTA_container` (padding `6px 6px 0`, width 100%) › `a.DownloadMobileCTA_cta` (href `https://zoom.us/download?...`, `target=_blank`) › `div.text` (flex column, gap 2) › `span.title` + `span.description`.

| Part | Value |
|---|---|
| Card | bg `#F2F8FF`, radius 10, padding 16, `display:flex; gap:8px; align-items:flex-start`, color `#2A2B2D`, no underline on hover or focus. Size 670×72 @768, 292×90 @390 (description wraps). |
| Title | "Download the Zoom app": 16px/20px **590**, ls −0.31px, `#2A2B2D` |
| Description | "Download Zoom to access Chat, Phone, Docs, and more!": 14px/18px 400, ls −0.15px, `#2A2B2D` |
| Effect | Inserted as the first child of `.main--standard`. The clock block keeps `margin-top:64px` below it, so the time moves from y=132 to **y=210** (768) and **y=228** (390). |

#### 2.1.4 Body rules [M CSS]
```css
.home__header{margin:64px 0 28px}               /* clock block, never resized */
.home__time{font:600 40px/40px;letter-spacing:.37px}
.home__actions{margin-bottom:24px}
.home__actions-row{display:flex;flex-wrap:wrap;gap:60px;row-gap:32px;justify-content:center;align-items:flex-start}
.home__cards{display:flex;flex:1 1;flex-direction:column;overflow:auto;width:600px}
.home-hub-entries_row{display:flex;flex-wrap:wrap;gap:16px;margin-bottom:16px;width:100%}
.home-hub-entries_entry{flex:1 1 160px;height:56px;min-width:0}
.home__calendar-widget{flex:1 1;height:300px;margin-bottom:16px;min-width:0;overflow:hidden}
.home__billing-widget{overflow:auto;width:100%}
@media (max-width:1024px){
  .home__cards{flex-direction:column!important;width:96%!important}
  .home__billing-widget,.home__calendar-widget{min-width:auto!important;width:100%!important}
}
```
Each action column is fixed at 56 px wide (`.main--standard .main__action-*{width:56px}`). Labels are centred under the buttons and overflow the column (e.g. "New meeting" is 106 px).

### 2.2 Meetings `/wc/meetings` [M]
| Box | 1920 | 1440 | 1280 | 1024 | 768 | 390 |
|---|---|---|---|---|---|---|
| Content card | 1834×890 | 1354×710 | 1194×530 | 938×602 | 682×858 | 304×602 |
| Left list (`.meetings-container__left`) | 80,68 **360** | 360 | 360 | 360 | 360 | **360 (overflows card)** |
| Header title "Upcoming" | centred in 360 at x=225 | same | same | same | same | same (off-centre, clipped) |
| PMI card | 96,114 328×78 | same | same | same | same | same (right edge clipped) |
| V-divider | 440, 2 px | same | same | same | same | (clipped) |
| Detail pane | 442,68 1472 | 992 | 832 | 576 | **320** | 222 (fully clipped, x≥442) |
| Detail padding | 48 4 40 40 | same | same | same | same | same |
| Topic (24px) height | 29 | 29 | 29 | 29 | **58 (wraps)** | 87 |
| Buttons Start/Copy Invitation/Edit | one row 75/162/85 at y=241 | same | same | same | **Edit wraps to a 2nd row** (y 270 → 312) | each on its own row |
| Billing promo below card | 110 tall | 110 | 110 | **86** | 86 | **162** |

Screenshots: `resp-meetings-*.jpg`.
CSS: `.meetings-container__left{flex:0 0 auto;width:360px}`, `.meetings-container__right{flex:1 1 auto}`, `.meetings__detail-btns{display:flex;flex-wrap:wrap;margin:32px 0}`, `.meetings__detail-btns>*{margin-right:16px;margin-bottom:10px}`. There are **no media queries** for the meetings tab.

### 2.3 Join Meeting modal [M]
| Viewport | Modal box | Inner width | Input | Cancel / Join |
|---|---|---|---|---|
| 1920×1080 | 736,421 **448×238** | 384 | 384×40 | 71×32 / 55×32, gap 16, right-aligned |
| 1440×900 | 496,331 448×238 | 384 | 384×40 | same |
| 1280×720 | 416,241 448×238 | 384 | 384×40 | same |
| 1024×768 | 288,265 448×238 | 384 | 384×40 | same |
| 768×1024 | 160,393 448×238 | 384 | 384×40 | same |
| 390×844 | **24,303 342×238** | 278 | 278×40 | same sizes, right-aligned (x 192 / 279) |

- CSS: `.join-meeting-modal{width:min(448px,100vw - 48px);max-height:min(100vh - 40px,520px);padding:32px;border-radius:32px;box-shadow:0 6px 12px #00000014,0 12px 24px #00000014}`. The overlay is `#0003` over the full viewport, including the header and rail. The modal is centred with `pwa-modal__content--centered`.
- The input has a **history toggle** at its right end that the PRD does not mention: `.join-meeting-modal__history-toggle` is 24×24, radius 999, `right:8px; top:30px`, chevron 14 px `#555B62`, hover bg `#F1F4F6`. It opens a `.meeting-history` dropdown at `top:calc(100% + 4px)`, full width, z 10.
- Screenshots: `resp-joinmodal-*.jpg`.

### 2.4 Schedule Meeting `zoom.us/meeting/schedule` (portal) [M]
| Box | 1920 (docW 1905) | 1440 (1425) | 1280 (1265) | 1024 (1009) | 768 (753) | 390 (phone UA) |
|---|---|---|---|---|---|---|
| Header | 104 = 40 black strip + 64 nav | 104 | 104 | 104 | 104 | **50**, no strip |
| Logo 110×25 | 24,59 | 24,59 | 24,59 | 24,59 | 24,59 | **10,13** |
| Left nav (Products, Solutions, Resources, Plans & Pricing) | x=154 | shown | shown | **hidden** | hidden | hidden |
| Right nav | Schedule, Join, Host▾, Web App▾, avatar | same | same | Schedule, Join, Host▾, avatar + **hamburger 42×32** (Web App hidden) | same | **"Join", "Host"** (16px 600 `#666484`) + hamburger 42×32 at x=348 |
| Layout | grid `300px 1fr` | same | same | same | **block** | block |
| Side menu | 300 wide, full height | 300 | 300 | 300 | **38 px bar "Meetings ⌄"**, full width | bar, 378 wide (x=6) |
| Content padding | 32 | 32 | 32 | **32 24** | **32 16** | 32 16 |
| Content x / width | 332 / 1541 | 332 / 1061 | 332 / 901 | 324 / 661 | 16 / 721 | 16 / 358 |
| Label column | 160 (+10) → controls at x=502 | same | same | 160 → x=494 | 160 → x=186 | **stacked**: label 358×26 above control |
| Topic input | 490×32 | 490 | 490 | 490 | 490 | **358** (100 %) |
| When: date / time / AM-PM | 240 / 173 / 104 in one row | same | same | AM/PM **wraps** to a 2nd line (row 72 tall) | one row | date 240, then time 173 + AM/PM on the next line (8 px gap) |
| Duration hr / min | 150 / 150 | same | same | same | same | 151 / 151 (80 %) |
| Time Zone | 490 | 490 | 490 | 490 | 490 | **358** |
| Sticky action bar | `position:fixed; bottom:0`, x=332, width = content, **80 tall** (padding 24 0), bg `#FFF`, z 100 | same | same | x=324 | x=16 | x=16, w=358 |
| Save / Cancel | 60×32 / 73×32, 8 gap | same | same | same | same | same |

**Collapsed side-menu bar (≤1023)** [M]: `div.sidebar-menu` 100 % × 38, bg `#EEEEEE`, radius 4.2px, margin-bottom 16 (7 at 390). The link has padding-left 14 and text "Meetings" in 14px/38px 400 `#0D6BDE`, ls 0.42px. The toggle button `.sidebar-toggle` is 40×34 at the right, padding `2px 10px 9px`, radius 4, with a blue chevron. Tapping it expands the menu list inline.
**Hamburger** [M]: `button.navbar-toggle` 42×32, radius 4, padding `9px 10px`, three bars 22×2, radius 1, bg `#30ACFF`, 4 px apart, `transition:.25s ease-in-out`.
Screenshots: `resp-schedule-*.jpg`.

### 2.5 Join page `zoom.us/join` [M]
#### 2.5.1 Desktop user agent
| Box | 1920 | 1440 | 1280 | 1024 | 768 |
|---|---|---|---|---|---|
| Header | 64, no black strip; Support, Schedule, Join, Host▾, Web App▾, avatar | same | same | Web App hidden + hamburger | same |
| `#join-conf` | 480 wide, centred (`margin:0 auto`), y=104, padding-top 10 | same | same | same | same |
| H1 "Join Meeting" | 24px/26.4px 600 `#222325`, margin `72px 0 48px` (y=186) | same | same | same | same |
| Form | 360 wide (margin `0 60px`) | same | same | same | same |
| Label "Meeting ID or Personal Link Name" | 14px/20px `#2A2B2D`, margin-bottom 10 | same | same | same | same |
| Input | 360×40, radius 12, border 1px `#C1C6CE`, padding `0 16px`, placeholder "Enter Meeting ID or Personal Link Name" | same | same | same | same |
| Join button (disabled) | 360×40, radius 12, bg `rgba(82,82,128,.09)`, text `#909096` 16px, 16 px below the input | same | same | same | same |
| "Join a meeting from an H.323/SIP room system" | 14px/20px `#0D6BDE`, centred, y=459 | same | same | same | same |
| Footer | fixed bottom, 56 tall: "© 2026 Zoom Communications, Inc. All rights reserved. Privacy & Legal Policies" + "English ▾" (blue) | same | same | same | same |

#### 2.5.2 ≤767, desktop UA (CSS only; `resp-join-390-desktopUA.jpg`)
The H1 is hidden. The form is full width with ~27 px side margins: input and button are 337×40 at x=27. The header is 50 px (logo 10,13; "Join" "Host" + hamburger). The footer text wraps onto 2 lines.

#### 2.5.3 Phone UA (what a real phone sees; `resp-join-390.jpg`)
The server redirects to `https://zoom.us/support/down4j?from=launch&u=zoomus%3A%2F%2Fzoom.us%2Fjoin`. Content area is `0,50 390×511`, with columns inset 27 px on each side (337 wide):
1. `p` 14px/21px `#232333`: *If the Zoom app is installed, please click "Join Meeting."* (margin-bottom 10)
2. `a.btn.btn-primary.retry-url` **"Join Meeting"** → `zoomus://zoom.us/join`: 337×56, bg `#0E71EB`, border 1px `#0E71EB`, radius **8**, label 14px/44px white, margin-bottom ≈27.
3. `p`: *First time using Zoom on this device? Please download the Zoom app from the Google Play store or directly from "Download from Zoom" below.*
4. `a.download-url` **"Download from Google Play"** → `market://details?id=us.zoom.videomeetings` (same button style)
5. `a.download-url` **"Download from Zoom"** → `/client/latest/zoom.apk` (same button style)
6. A dark site footer (bg `#39394D`, "About" link columns) follows at y=561.

---

## 3. Breakpoint catalogue (every `@media` in the downloaded CSS)

### 3.1 `app.zoom.us` PWA — `main.css` / `main-chunk-other.css`
| Query | What changes |
|---|---|
| JS `innerWidth ≥ 1440` | Header leading slot shows "Discover Products ▾" and "Pricing" (live on resize). |
| `min-width:1081px` | The search trigger stretches to its clamp width (`clamp(160px,30vw,440px)`) and is centred. |
| `max-width:1080px` | Admin Center hidden. Back/Fwd/History hidden. Search becomes a 32 px transparent icon. Search area is right-aligned. Branded header search bg is transparent. |
| `max-width:1024px` | `.home__cards{width:96%;flex-direction:column}`. Billing and calendar widgets 100 %. "Discover products" popover becomes a full-screen sheet (`inset:64px 0 0 0; height:calc(100vh - 64px)`). AI-Companion chat panel `left/right:12px; width:calc(100% - 24px)`, resize handle hidden. |
| `max-width:768px` | Logo word-mark hidden. Leading, admin, download and upgrade items hidden. Logged-out index page buttons become full width (48 px tall, radius 12). Download-CTA (index variant) goes full width. Profile popover and submenu become full-screen sheets (`other.css`). |
| JS `innerWidth ≤ 768` | Home "Download the Zoom app" CTA rendered. |
| `max-width:767px` (other.css) | Waffle (app-switcher) menu becomes a full-screen sheet with a mobile header (padding `8px 12px`, title 16px/32px 500). `.hidden-xs-only` utility. |
| `max-width:745px` / `800px` / `min-width:1150px` / `max-width:680px` / `max-width:280px` / `min-width:675px` | Legacy `.home-header`, `.home-search`, `.upcoming`, `.join` and `.main-content` classes. **Not rendered** in the current Workplace UI. |
| `min-width:645px` / `720px` | Contacts panel 50 % / 360 px (Contacts tab only). |
| `min-width:667px` / `max-width:667px` | Feedback dialog sizing. |
| `max-height:720px` | `.vehicle` (car-mode) only. Ignore. |
| `display-mode:standalone` | Installed-PWA 1 px top hairline. |
| `hidden-*` utilities (767/768/1023/1024/1439/1440/1919/1920) | Element-UI responsive helpers. |

Calendar micro-app CSS (`zcal.zoom.us`): only dialog and event-detail rules at 720, 767, 1190, 400 and 300. These do not affect the home widget layout.

### 3.2 `zoom.us` portal (`all.min.css`, `top_nav.min.css`, `app-common`, `app-side-menu`, `index` (schedule), `durationItem`)
| Query | What changes |
|---|---|
| `min-width:1280px` | `.content-body{padding:32px}` (below this it is `32px 24px`). Grid `auto 1fr`. |
| `min-width:1025px` | Desktop top nav: Products, Solutions and Resources shown, with a 2 px `#0E72ED` underline on the open dropdown. |
| `768–1024px` | Desktop left nav hidden. `#tabletToggle` hamburger shown. Web App item hidden. Dropdowns become a 2-column grid. |
| `min-width:1024px` | Side menu always expanded (`.sidebar-collapse` visible, `.sidebar-toggle` and `.sidebar-menu` hidden). Row is flex/grid. |
| `max-width:1023px` | `.mini-layout-body>.row{display:block}`. Side menu collapses into the 38 px `.sidebar-menu` bar. Content padding becomes 16 px. |
| `max-width:767px` | Header 50 px. Black strip hidden. `.navbar-right.mobileView` (Join, Host) shown. Desktop nav hidden. **Form rows stack** (`.zoom-form-item__row{display:block;margin-bottom:20px}`, label wrapper 100 % with `padding:4px 0`). `.long-width`, `.middle-width` and `.middle-long-width` become 100 %. Duration selects 80 % (min margin-left 0). `#mt_time{margin-bottom:8px}`, `.start-time{margin-left:0}`. Free-user alert full width. |
| `max-width:530px` | `.schedule-content .long-width{width:100%}` |
| `max-width:390px` | `.fixed-bottom{padding:0 10px}` |
| Others (1100/1248/1300/670/500 px) | Free-trial and webinar promo dialogs only. |

---

## 4. Rules the clone must implement

Mark: **[Z]** = Zoom-faithful (implement exactly). **[D]** = deliberate improvement for the <768 px usability bonus, where Zoom itself clips content. Keep [D] rules behind `@media (max-width:767px)` so desktop pixel-parity is untouched.

### 4.1 Workplace shell
1. [Z] The header is always 64 px. Left logo block, then the right slot (`display:flex; gap:24px`): leading | searchArea (`flex:1; min-width:160px; justify-content:center`) | trailing (`gap:12px`).
2. [Z] Search trigger `width:clamp(160px,30vw,440px); flex-shrink:1`, preceded by the 72 px nav cluster and a 6 px gap.
3. [Z] `@media (min-width:1440px)`: render the static "Discover Products ▾" (148×32) and "Pricing" (60×32) ghost buttons in the leading slot (toast on click). Hide them below 1440. CSS is enough; no JS needed.
4. [Z] `@media (max-width:1080px)`: hide Admin Center and the Back/Fwd/History cluster. Replace search with a 32×32 icon button (radius 8, transparent, hover `#52528017`, active `#5252802e`), right-aligned in the search area.
5. [Z] `@media (max-width:768px)`: hide the "Workplace" word-mark, Download and Upgrade. The header keeps logo + search icon + bell + avatar. The profile menu opens as a full-screen sheet (`inset:0; border-radius:0; border:none; box-shadow:none`).
6. [Z] The left rail stays **80 px at every width**. Do **not** build a bottom tab bar. The content card is always `calc(100vw - 86px) × calc(100vh - 74px)` with radius 12.

### 4.2 Home
7. [Z] Clock 40px/40px 600 at all widths. Clock block `margin:64px 0 28px`.
8. [Z] Actions row `gap:60px; row-gap:32px; flex-wrap:wrap`, 56 px columns.
9. [Z] `.home__cards{width:600px}`, and `@media (max-width:1024px){width:96%}`.
10. [Z] Hub row `display:flex; flex-wrap:wrap; gap:16px`. Each entry `flex:1 1 160px; height:56px`. This gives 3 across down to ~528 px of column width, then one per row.
11. [Z] Upcoming widget `flex:1 1 300px` inside the column-flex, scrolling `.home__cards`.
12. [D] Add `min-height:300px` to the upcoming widget so it never collapses to 0 (Zoom's widget does).
13. [Z] `@media (max-width:768px)`: insert the "Download the Zoom app" CTA (§2.1.3) as the first element of the Home content. Its link is static (toast or `https://zoom.us/download` in a new tab).
14. [D] `@media (max-width:767px)`: `.home__actions-row{gap:clamp(16px,8vw,60px)}` so the "New meeting" label is not clipped at 390.

### 4.3 Meetings tab
15. [Z] Left column fixed at 360 px, then the 2 px `#7D7D8821` divider, then a flex-1 detail pane with padding `48px 4px 40px 40px`. Detail buttons: `flex-wrap:wrap`, each with `margin:0 16px 10px 0`.
16. [D] `@media (max-width:767px)`: the list takes 100 % width. Selecting an item shows the detail full width with a back arrow (Zoom clips the detail off-screen here, so this is the PRD's proposed behaviour and clearly better).

### 4.4 Join modal
17. [Z] `width:min(448px, 100vw - 48px); max-height:min(100vh - 40px, 520px); padding:32px; border-radius:32px`, centred on both axes, overlay `rgba(0,0,0,.2)`. No other responsive changes: buttons stay right-aligned at 71/55 px.

### 4.5 Portal (Schedule / Edit / Meeting detail)
18. [Z] Header: 40 px black strip + 64 px nav at ≥768. Hide the desktop nav and Web App at ≤1024 and show a 42×32 hamburger (bars `#30ACFF`). At ≤767 the header is 50 px: no strip, logo at (10,13) and only "Join", "Host", ☰.
19. [Z] Body grid `300px 1fr` at ≥1024. Content padding 32 (≥1280), `32px 24px` (1024–1279), `32px 16px` (≤1023).
20. [Z] `@media (max-width:1023px)`: the grid becomes a block. The side menu becomes a 38 px bar (`bg #EEEEEE`, radius 4.2, active item name in 14px/38px `#0D6BDE`, chevron toggle on the right) that expands the menu list inline.
21. [Z] Form rows `display:flex` with a 160 px label column and a 10 px gap. Controls keep fixed widths (Topic/TZ/Invitees 490, date 240, time 173, AM/PM 104, hr/min 150) and wrap naturally inside the row.
22. [Z] `@media (max-width:767px)`: rows `display:block; margin-bottom:20px`, labels 100 % with `padding:4px 0`. Topic, Time Zone and Invitees become 100 %. Time goes on a new line under the date (`margin-bottom:8px` on the date). Duration selects are 80 % each.
23. [Z] Sticky action bar: `position:fixed; bottom:0; left:<content-x>; width:<content-width>; height:80px; padding:24px 0; background:#fff; z-index:100`. Save (60×32) + 8 + Cancel (73×32), left-aligned. At ≤390 use `padding:0 10px`.

### 4.6 Join page / pre-join
24. [Z] At ≥768 use the centred 480 px column (form 360) described in §2.5.1. At ≤767 hide the H1 and make the form full width with 27 px side margins.
25. [D] Optional fidelity touch: on a mobile UA (`/Android|iPhone/i`), `/join` may show the §2.5.3 "launch app / download" screen. The assignment needs the web flow to work on phones, so instead render the normal form plus a dismissible "Open in Zoom app" hint. **Never** block joining on mobile.

---

## 5. Screenshots saved (31) — `docs/reference/screens/`
- Home: `resp-home-1920.jpg`, `resp-home-1440.jpg`, `resp-home-1280.jpg`, `resp-home-1024.jpg`, `resp-home-768.jpg`, `resp-home-390.jpg`
- Meetings: `resp-meetings-1920.jpg`, `-1440`, `-1280`, `-1024`, `-768`, `-390`
- Join modal: `resp-joinmodal-1920.jpg`, `-1440`, `-1280`, `-1024`, `-768`, `-390`
- Schedule: `resp-schedule-1920.jpg`, `-1440`, `-1280`, `-1024`, `-768`, `-390`
- Join page: `resp-join-1920.jpg`, `-1440`, `-1280`, `-1024`, `-768`, `-390` (phone-UA "down4j" page), `resp-join-390-desktopUA.jpg` (CSS-only ≤767 layout)

Icons: none new. Every icon in scope is already covered by other prefixes or is a CSS hamburger. CSS downloaded to `scratchpad/resp/` (app calendar/chat/promo CSS) and `scratchpad/resp/portal/` (portal CSS). Media-query dumps are in `scratchpad/resp/media_app.txt`, `media_extra.txt` and `media_portal.txt`.
