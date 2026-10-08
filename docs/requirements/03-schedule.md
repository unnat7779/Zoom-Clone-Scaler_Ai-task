# 03 — Schedule Meeting page (`zoom.us/meeting/schedule`) + Edit (PMI) — measured spec `[sch]`

Captured 2026-10-07 from the live Zoom web portal (signed-in **Basic/free** account, account time zone `America/Los_Angeles`), viewport **1366×768** (document width **1351** because the page has a 15px vertical scrollbar). Page `<title>`: **`Schedule a Meeting - Zoom`**. Body font `"Almaden Sans", Helvetica, Arial` (all text below uses it unless noted; every text node carries `letter-spacing: 0.42px` [M]).
`[M]` = measured from DOM / Zoom's own CSS; `[D]` = inferred. Colours are given as hex; CSS variable names from Zoom's token set are given where the CSS uses them (values resolved live — see §12).

---

## 1. Corrections to PRD.md

| PRD § | PRD says | Measured |
|---|---|---|
| 7.4.1 header | "Header 64px white" | Header is **104px**: a **40px black strip `#00031F`** (Search · Support · 1.888.799.9666 · Contact Sales · Request a Demo) + a **64px white bar**. Container `position:fixed; z-index:1030; background: rgba(255,255,255,.97); box-shadow: 0 0 2px 0 rgba(0,0,0,.2)` [M]. Page content starts at y=104. |
| 7.4.1 header | "Products ▾, Solutions ▾, Resources ▾" | **No chevrons are visible** for Products/Solutions/Resources at rest (the arrow span is `opacity:0; visibility:hidden`; it slides in on hover/open). Only **Host** and **Web App** show a 10×5 chevron [M]. |
| 7.4.1 side menu | Items: Home, Meetings, Recordings, Summaries, Whiteboards, Notes | Real list: **Home** · title **My Products** · **AI** (New, ↗) · **Meetings** (active) · **Recordings** · **Summaries** · **Hub** (New, ↗) · **Whiteboards** (↗) · **Notes** · **Clips** (↗) · **Canvas** (↗) · **Paper** (↗) · **Sheets** (↗) · **Slides** (↗) · **Tasks** (↗) · **Scheduler** (↗) · **Discover More Products** · collapsible **My Account / Admin / Support** · pill **Upgrade to Pro** [M]. No left icons on any item. |
| 7.4.1 side menu | items "padding-left 36" | Item box: `x=4, w=288, h=32, padding 3px 8px, radius 12, margin-bottom 4`; label starts at x=36 because of a 16px invisible placeholder + 8px gap [M]. |
| 7.4.2 | H1 margin `24px 0 32px` | `margin: 20px 0 32px`; back link top y=208, H1 top y=250, first row y=304 [M]. |
| 7.4.2 | "Row vertical rhythm: 24px between rows" | **25px** (`.zoom-form-item__row{display:flex; gap:10px; margin-bottom:25px}`); label column = 160px wrapper + 10px gap = **170** ✔ [M]. |
| 7.4.2 Topic | text input "selected" | Topic input `value="My Meeting"` **and** `placeholder="My Meeting"`, `maxlength=200`, auto-focused with whole text selected on load [M]. Label text colour `#232333` (Topic only; other labels `#222325`), asterisk rendered **before** "Topic" [M]. |
| 7.4.2 Description | textarea 490×**88**, padding `6px 11px` | textarea 490×**50** (2 rows) auto-growing to max **86** (4 rows) then scrolls; `padding: 6px 12px`, `resize: vertical`, `maxlength=2000`, placeholder "Add Description", no counter. Clicking the button hides it and focuses the textarea; it does **not** collapse back on blur [M]. |
| 7.4.2 When | time select "30-min steps 12:00 … 11:30" | **15-minute steps**: 48 options `12:00, 12:15 … 11:45` (no leading zero). Typing filters by prefix and **free times are accepted** (`9:10` + Enter → stored `09:10`, inserted into the list). Calendar icon is 14px at `right:10px; top:9px` (not 12px) [M]. |
| 7.4.2 Duration | hour 0–24, minutes 0/15/30/45, default 0 hr 40 min | Basic account: **hour select disabled at "0"**, minute options **0, 15, 30, 40** (40 selected). A warning banner sits under the row (see §5.3). Paid accounts would show 0–24 / 0,15,30,45 [D]. |
| 7.4.2 Invitees | tag input, Enter/comma → chip (radius 999, bg `#F1F4F6`) | Autocomplete input; choosing a suggestion adds a **40px list row below the warning banner** (24px round coloured avatar + email + 24px round × button), **not a chip**. Invalid address shows suggestion with red "Invalid email" and cannot be chosen. A permanent warning banner "Participants won't receive this meeting invite until your calendar is connected. / Connect calendar" sits under the input [M]. |
| 7.4.2 Meeting ID | radio gap 24px | Radio `margin-right: 32px` [M]. Choosing PMI **hides** Template, Whiteboard, Docs and Interpretation rows [M]. |
| 7.4.2 Security | "passcode 1–10 alphanumeric"; error styles | Passcode input 200×32 at x=609 with a hover/focus **rules popover** "Passcode must include: ✓ At least 1 characters" (green `#247F40` ✓ / red `#DA1639` ✕). `maxlength=10`; spaces/symbols accepted; empty → red border only, no text. Passcode checkbox is **disabled + checked** (Basic) [M]. |
| 7.4.2 Options | 4 checkboxes, rows 32px, two disabled, all off | Rows **28px** pitch; **none disabled**; **"Allow participants to join anytime" is checked by default**; ticking "Approve or block entry…" opens a modal dialog (Cancel unticks) [M]. |
| 7.4.2 skipped rows | Template, Whiteboard, Docs, Encryption, Zoom AI, Workflow, My Notes, Meeting chat, Interpretation not rendered | All are present in Zoom and fully measured in §5 so the team can decide. |
| 7.4.2 sticky bar | `position:sticky; bottom:0`, Cancel → `/wc/meetings` | JS sticky: inner div gets class `zoom-sticky--fixed` → `position:fixed; bottom:0; left:332px; width:987px; z-index:100` while the bar's natural slot is below the fold; otherwise static at the end of the form (80px placeholder). **No shadow, no border**, bg `#FFF`, padding `24px 0`. Cancel navigates (full page load) to **`https://zoom.us/meeting#/upcoming`** with no confirm dialog [M]. |
| 7.4.2 errors | border `#DA1639` | Error border **`#FF6682`** (`--zoom-color-border-error`); message row = 12px error-circle icon `#DA1639` + 4px + text 12px/16px `#DA1639`, `margin-top:4px` (row grows 20px). Topic message: **"Topic is required"** (also for whitespace-only) [M]. |
| 5.4 Input | placeholder `#ADB1B8` [D]; focus border 1px `#4B96F1` | Placeholder **`#686F79`** (hover `#5E646D`). Focus: border `#4B96F1` **+ `box-shadow: inset 0 0 0 1px #4B96F1`** (looks 2px). Hover: **background** `rgba(110,118,128,.12)` (border unchanged) [M]. |
| 5.4 Select list | shadow small, items padding `7px 8px`, selected text `#0D6BDE` | Dropdown shadow is the **large** `--zoom-box-shadow` (`0 12px 24px 0 rgb(0 0 0/.08), 0 6px 12px 0 rgb(0 0 0/.08)`), list `margin:11px`, items `min-height:32px; padding:6px 8px` (unselected `padding-right:32px`), radius 8; **selected item keeps `#222325`/400** and shows a 16px ✓ `#222325` at right. Menu = trigger width, 4px below trigger, max list height 208 [M]. |
| 7.4.3 date picker | other-month **and** past days `#ADB1B8` disabled | Past days (incl. previous-month) `#ADB1B8`, `cursor:not-allowed`; **next-month days `#686F79` and selectable**. Selected (`td.current`) = bg `#ECF4FD`, 1px `#A8CCF8`, `#0D6BDE` 600 ✔; **today when not selected = solid `#0D6BDE` circle, white text** (hover `#0C60C8`). Month view (3×4, cells 54×32) and decade view ("2020 - 2029") exist. Popover flips **above** the field when there is no room below [M]. |
| 5.3 radii/shadows | date picker shadow small ✔, popover radius 10–12 | Menus/dropdowns radius **12**; date-picker & info popovers radius **16**; dialog radius **32**; menus use large shadow, date picker uses small shadow [M]. |
| 5.4 Avatar (header) | 32×32 radius 10 `#9053C2`, 14px/32 600 white | ✔ confirmed [M]. |

---

## 2. Page skeleton (1366×768)

```
body (font "Almaden Sans", Helvetica, Arial)
└─ div.total-main-content                                  0,0 1351×2503
   ├─ div#header_container (fixed, z 1030)                 0,0 1351×104   bg rgba(255,255,255,.97), shadow 0 0 2px rgba(0,0,0,.2)
   │   └─ div#header.march-2024.navbar
   │       ├─ nav#black-topbar.new-black-topbar            0,0 1351×40    bg #00031F
   │       └─ nav.container                                0,40 1351×64(65.5)
   └─ div#content_container
       ├─ div#content.main-content                         y=104
       │   ├─ div#notice-slot  (marketing banner)          0,104 1351×69 (+3 margin) — dismissible, may be absent
       │   └─ div#meetings.mini-layout > .mini-layout-body > .row     y=176
       │       ├─ div.nav-menu (side menu column)          0,176 300×(full)  bg #F7F7FA, padding 8px 0
       │       └─ div#the-main-content.content-body        300,176 1051×…    padding 32px
       │           └─ div#app > div.content-wrap.schedule-content        332,208 987×1763
       │               ├─ div (64px tall): a.back-link + h1.mgb-xl
       │               └─ div.schedule-content
       │                   ├─ form.zoom-form.meeting-schedule-sticky-bottom   332,304 987×1563
       │                   └─ div.zoom-sticky (80px)                          y=1891 (natural)
       └─ div#footer_container                             0,2003 1351×500 bg #39394D
```
- Content column: **x=332 → 1319 (987 wide)** = 300 side menu + 32 padding; right padding 32 [M].
- Scroll height of the whole page: **2502px** with the banner; form ends at y≈1867 [M].
- Side menu column is **not sticky** (scrolls with the page); header is fixed [M].

---

## 3. Portal chrome

### 3.1 Black top strip `nav#black-topbar` [M]
| Item | x,y,w,h | Style |
|---|---|---|
| bar | 0,0 1351×40 | bg `#00031F` |
| Search button | 785,0 71×40 | 20×20 search icon (`sch-topbar-search.svg`, white) + 5px + "Search" 300 14px/40px `#FFF` |
| "Support" | 876,10 55×19 | link 300 14px/15px `#FFF`, ls .42px |
| "1.888.799.9666" | 951,10 105×19 | same (`aria-label="Call 1-888-799-9666"`) |
| "Contact Sales" | 1096,10 96×19 | same |
| "Request a Demo" | 1212,10 114×19 | same; right edge 1326 (24px from right) |
Horizontal gap between links: **20px** [M]. Marketing-only; optional P2 for the clone.

### 3.2 White header bar (y 40–104) [M]
| Element | x,y,w,h | Style / behaviour |
|---|---|---|
| Logo link `a.imglink` | 0,59 154×25 | → `https://zoom.us/` ; `img.logo` **110×25 at x=24, y=59**, `margin: 0 20px 0 24px`; file `Zoom_logo.svg` (blue wordmark) → `sch-zoom-logo.svg` |
| "Products" button | 154,45 105×52 | 500 16px/52px `#666484`, padding `0 15px`, radius `20px 20px 0 0` (tab shape when open: open state colour white on blue [D], `transition: background-color .3s linear`); hidden 8×4 arrow slides in on hover (`left:10px; opacity 1`) |
| "Solutions" | 258,45 108×52 | same |
| "Resources" | 366,45 118×52 | same |
| "Plans & Pricing" link | 499,61 117×20 | 500 16px/20px `#666484` |
| "Schedule" link | 922,40 105×64 | 600 16px/20px `#666484`, padding `22px 15px` → `https://zoom.us/meeting/schedule` |
| "Join" link | 1027,40 64×64 | same → `https://zoom.us/join` |
| "Host" dropdown | text 1106,62 51×21 | 600 16px `#666484` + 10×5 chevron `sch-nav-arrow-down-grey.svg` at x=1148,y=71 (`transition .25s`). Menu: With Video Off → `/start/webmeeting` · With Video On → `/start/videomeeting` · Screen Share Only → `/start/sharemeeting` |
| "Web App" dropdown | 1188,62 84×21 | "Web App" 600 16px + 10×5 arrow at x=1262 (bg-image `icon-arrow-down-grey.svg`). Menu: Home, Chat, Phone, Meetings, Hub **NEW**, Canvas, Contacts, Whiteboards → `https://app.zoom.us/wc/...?webp=1` |
| Avatar button | 1304,57 32×32 | `span.common-header-avatar` bg `#9053C2`, radius 10, initials 600 14px/32px `#FFF` (`aria-label="<Name>, profile options"`) |
Right edge of avatar = 1336 (15px from content edge 1351). Header nav hover: `background:0` (no bg) [M].

### 3.3 Marketing banner (`#notice-slot`, above the two-column area) [M]
`div.fe-popups-banner.fe-popups-banner--success.is-bleed.is-closable` — 0,104 **1351×69**, bg `rgb(228,247,235)` + `linear-gradient(rgba(255,255,255,.4))`, **border-bottom 1px `#9ECEAD`**, padding `16px 47px 16px 16px`, margin-bottom 3px, `transition: opacity .3s`.
- Icon 20×20 at (16,120): green circle `#09A639` + white check → `sch-banner-success.svg`.
- Text at x=48 (icon + 12px): **"Welcome to Zoom!"** 600 14px/18px `#222325` margin-right 10 · body 400 14px/18px: "Save up to 16% when you upgrade to Zoom Workplace Pro annual. Get longer meetings, unlimited AI note-taking with My Notes, and more for seamless connection to what matters most." + link **"Upgrade today"** `#0D6BDE` (target _blank).
- Close: 24×24 round tertiary icon button at (1313,118) (`top:14px; right:14px`), 14px × icon `#555B62` (`sch-close.svg`), `aria-label="Dismiss banner message"`.
- Marketing/dismissible; **optional for the clone** (P2). On the PMI edit page it was collapsed.

### 3.4 Left side menu (`div.nav-menu` > `aside#sidemenu` > `div.fe-popups-side-menu.frame-side-menu`) [M]
- Column: x=0, width **300**, bg **`#F7F7FA`**, padding `8px 0`. Inner `.fe-popups-side-menu` width 296 + `padding: 0 4px 64px 0`; `nav` padding 4 → items start at x=4, width **288**.
- **Item** `a.fe-popups-side-menu__item-content`: `display:flex; align-items:center; min-height:32px; padding:3px 8px; margin-bottom:4px; border-radius:12px; color:#222325; 400 14px/18px; cursor:pointer`. Children: `span.__item-placeholder` (16px wide, margin-right 8) · `span.__item-label` (flex 1, padding 4px 0) · optional badge · optional ↗ icon. Pitch **36px** (32 + 4).
- States: hover bg `rgba(110,118,128,.12)`; active (pressed) bg `rgba(110,118,128,.42)`; **selected `.is-active`: bg `#F2F8FF`, text `#0D6BDE`** (`aria-current="page"`); keyboard focus `outline: 2px solid #4B96F1`. No transition (instant).
- **Section title** `div.is-title` "My Products": `margin-top:12px` row (32px), text `span.__item-title` 400 **12px/18px `#686F79`** at x=12 (no placeholder), not hoverable.
- **"New" badge** `span.fe-popups-badge__custom.is-blue.fe-popups-badge__md`: 32×16 at label-row x=230, margin-left 8, `padding:0 4px; border:1px solid #A8CCF8; border-radius:999px; bg #F2F8FF; color #2057B1; 500 10px/16px`, text " New".
- **External ↗ icon** `i.__item-icon-pop`: 14×14 at x=270, margin-left 8, colour `#222325` → `sch-external-link.svg`.
- **Collapsible groups** (`div` with `aria-expanded`): chevron `i.__submenu-icon` 16×16 box at x=12 (svg 10×10, `#555B62`, `sch-submenu-chevron.svg`), `transform: rotate(-90deg)` collapsed → `rotate(0)` expanded, **`transition: transform .3s ease-in-out`**; label at x=36. Sub-list `ul.__sub` `padding-left:24px` per level (level-1 items x=28 w=264 label x=60; level-2 x=52 w=240 label x=84). Show/hide is instant (`display:none` toggle).

| # | Label | y (top, collapsed) | href / target | extras |
|---|---|---|---|---|
| 1 | Home | 188 | `https://zoom.us/myhome` | |
| – | *My Products* (title) | 232 | – | 12px grey |
| 2 | AI | 268 | `https://ai.zoom.us?from=web_portal` _blank | New + ↗ |
| 3 | **Meetings** (active) | 304 | `https://zoom.us/meeting` | bg `#F2F8FF`, `#0D6BDE` |
| 4 | Recordings | 340 | `https://zoom.us/recording` | |
| 5 | Summaries | 376 | `https://zoom.us/user/meeting/summary` | |
| 6 | Hub | 412 | `https://hub.zoom.us` _blank | New + ↗ |
| 7 | Whiteboards | 448 | `https://us05whiteboard.zoom.us/wb/dashboard` _blank | ↗ |
| 8 | Notes | 484 | `https://zoom.us/notes` | |
| 9 | Clips | 520 | `https://zoom.us/clips` _blank | ↗ |
| 10 | Canvas | 556 | `https://docs.zoom.us` _blank | ↗ |
| 11 | Paper | 592 | `https://paper.zoom.us` _blank | ↗ |
| 12 | Sheets | 628 | `https://sheets.zoom.us` _blank | ↗ |
| 13 | Slides | 664 | `https://slides.zoom.us` _blank | ↗ |
| 14 | Tasks | 700 | `https://us05tasks.zoom.us` _blank | ↗ |
| 15 | Scheduler | 736 | `https://scheduler.zoom.us/me/appts` _blank | ↗ |
| 16 | Discover More Products | 772 | `https://zoom.us/billing/discover_more_products` | li margin-bottom **24** |
| 17 | ▸ My Account | 828 | group → Profile `/profile`, Settings `/profile/setting`, Personal Devices `/personal-devices`, Personal Contacts `/user/personalContact`, Data & Privacy `/profile/privacy` | |
| 18 | ▸ Admin | 864 | group → ▸ Plans and Billing (Plan Management `/billing`, Billing Management `/billing/payment`, Payment History `/billing/report`) · ▸ User Management (Users `/account/user`) · ▸ Account Management (Account Profile `/account`, Reports `/account/report`) · ▸ Advanced (App Marketplace `/redirect_marketplace`, Data & Privacy `/account/privacy`, Integration `/account/integration`) | |
| 19 | ▸ Support | 900 | group → Zoom Learning Center `/learningcenter` _blank ↗, Video Tutorials `/zendesk/sso` _blank ↗, Knowledge Base `/zendesk/sso` | |

- **Upgrade to Pro pill** `div.portal-side-menu-footer.mgt-lg` (text-align:center) > `button.fe-popups-button--md.--secondary.side-upgrade-btn`: **145×32 at x=75, y=964** (centred in 296), `padding:6px 14px; border-radius:24px; border:1px solid #00F0EA; background: linear-gradient(180deg, rgba(0,240,234,.25) 0%, rgba(0,240,234,.11) 100%)`; star icon 14px `#0B5CFF` (`sch-upgrade-star.svg`) + 4px + "Upgrade to Pro" 400 14px/18px **`#0B5CFF`**. Navigates to billing — clone: static/no-op.
- Clone mapping (keep PRD): Home → `/wc/home`, Meetings → `/wc/meetings`; everything else static.

### 3.5 Footer (summary) [M]
`#footer_container` bg **`#39394D`**, 420px link area + 80px bottom strip. Five columns at x=24 / 257 / 513 / 758 / 1003, headings (About, Download, Sales, Support, Language, Currency) 600 16px/17.6px `#EAEAEA`, links 400 14px/24px `#FFF`. Language "English ▾" and Currency "Indian Rupee ₹ ▾" pills (border 1px `rgba(255,255,255,.3)`, radius 4, padding `4px 15px`, h34); 6 round social icons. Bottom line (y≈2447, 40px): "Copyright ©2026 Zoom Communications, Inc. All rights reserved." + Terms | Privacy | Trust Center | Acceptable Use Guidelines | Legal & Compliance | Your Privacy Choices | Cookie Preferences (14px/20px white, `padding:0 6px`, separators = 1px left border `rgba(255,255,255,.7)`). Not needed for the clone (P2).

### 3.6 Floating chat bubble [M]
`div.livesdk__invitation` 56×56 circle, bg `#4488FF`, shadow `0 4px 8px rgba(19,22,25,.1), 0 2px 4px rgba(19,22,25,.1)`, fixed at right 20 / bottom 20 (z 9000). Zoom Virtual Agent — out of scope.

---

## 4. Form layout — row by row (scroll position 0, description collapsed) [M]

Row structure (`.zoom-form-item > .zoom-form-item__row`): `display:flex; gap:10px; margin-bottom:25px`; **label wrapper 160px** (`padding:4px 0; align-items:start`), label `span.zoom-form-item__label` 400 14px/18px `#222325`, top at row-y+4; widgets column `flex:1` starting **x=502**, width 817. Vertical margins of nested items collapse, so the effective gap after every row is **25px**.

| # | Wrapper class | Row y | Height | Label | Control(s) (x, w×h) | Default (Basic account) |
|---|---|---|---|---|---|---|
| 1 | base-options-0 | 304 | 32 | `* Topic` | input 502, 490×32 | "My Meeting" (focused, selected) |
| 1b | base-options-0 (2nd item) | 361 | 19 (50 when open) | – | "+ Add Description" text button 502 (icon) / 521 (text); → textarea 490×50 | collapsed |
| 2 | base-options-1 | 404 | 32 | When | date 502 240×32 · time 750 173×32 · AM/PM 931 104×32 (gaps 8) | today `10/07/2026`, next slot `11:00`, `AM` |
| 3 | base-options-2 | 461 | 32 (+banner 76) | Duration | hr select 502 150×32 (disabled) · "hr" 660 · min select 682 150×32 · "min" 840 | 0 hr 40 min |
| 3b | (banner) | 518 | 76 | – | warning banner 502, 810×76, margin-bottom 24 | always (Basic) |
| 4 | base-options-3 | 618 | 32 | Time Zone | virtual select 502, 490×32 | account tz `(GMT-7:00) Pacific Time (US and Canada)` |
| 5 | base-options-4 | 675 | 20 | (none) | checkbox "Recurring meeting" 502 | off |
| 6 | base-options-5 | 720 | 113 | Invitees | input 502 490×32 + warning banner 810×73 (margin-top 8) | empty |
| 7 | base-options-6 | 858 | 30 | Meeting ID | radios at 502 / 718 | Generate Automatically |
| 8 | base-options-7 | 913 | 32 | Template | virtual select 490×32, placeholder "Select a template" | empty |
| 9 | base-options-8 | 970 | 32 | Whiteboard ⓘ | secondary button "Add Whiteboard" 150×32 | – |
| 10 | base-options-9 | 1027 | 32 | Docs | secondary button "Add Docs" 109×32 | – |
| 11 | base-options-10 | 1084 | 134 | Security | Passcode checkbox + input 609, 200×32; Waiting Room | passcode on (locked), WR off |
| – | advanced-options-0 `::before` | 1243 | 1 | – | divider 827px, `border-top:1px solid #EDEDF4`, `margin: 0 0 32px 160px` (x=492) | – |
| 12 | advanced-options-0 | 1276 | 30 | Encryption | radios Enhanced / End-to-end | Enhanced |
| 13 | advanced-options-1 | 1331 | 109 | Zoom AI | tri-state parent + 2 child checkboxes | all off |
| 14 | advanced-options-2 | 1465 | 30 | Workflow | text button "Attach workflow to this meeting" | – |
| 15 | advanced-options-3 | 1520 | 89 | My Notes | checkbox + 2 radios | on / "All participants" |
| 16 | advanced-options-4 | 1634 | 32 | Meeting chat | checkbox | on |
| 17 | advanced-options-5 | 1691 | 65 | Video | Host on/off, Participant on/off | on / on |
| 18 | optional-options | 1781 | 30 | Options | text button "Show" | collapsed |
| 19 | other-options-1 | 1836 | 30 | Interpretation | checkbox (long label) | off |
| – | zoom-sticky | 1891 | 80 | – | Save / Cancel | – |

Derived y-deltas: 304→361 (+57), 361→404 (+43), 404→461 (+57), 461→618 (+157 incl. banner), 618→675 (+57), 675→720 (+45), 720→858 (+138), 858→913 (+55), 913→970→1027→1084 (+57 each), 1084→1276 (+192 incl. divider), 1276→1331 (+55), 1331→1465 (+134), 1465→1520 (+55), 1520→1634 (+114), 1634→1691 (+57), 1691→1781 (+90), 1781→1836 (+55) [M].

Above the form: `a.back-link` at **(332,208) 138×18** — 14px chevron-left (`sch-back-chevron.svg`, `#0D6BDE`) + **5px gap** + "Back to Meetings" 400 14px/18px `#0D6BDE` → `href="/meeting#/upcoming"` (clone: `/wc/meetings`). Hover: `#0C60C8` + underline; active `#084085` (`.zoom-link`). H1 **"Schedule Meeting"** at (332,250) 600 **20px/22px** `#222325`, `margin: 20px 0 32px`.

---

## 5. Rows in detail

### 5.1 Topic [M]
- Label cell: `span.zoom-form-item__asterisk` "*" at x=336 (margin-left 4) 400 12px/16px `#DA1639`, then "Topic" at x=345 400 14px/18px **`#232333`**.
- `input#topic.zoom-input__inner` 490×32 (`.long-width{width:490px!important}`), padding `6px 11px`, border 1px `#C1C6CE`, radius 12, 400 14px/18px `#222325`, bg transparent, `maxlength=200`, `autocomplete=off`, `aria-required=true`.
- Error (empty or whitespace, on blur): input gets `.is-errored` → border `#FF6682` (focused: + `inset 0 0 0 1px #FF6682`); below: `div.zoom-form-item__error[role=alert]` (`display:flex; margin-top:4px`, at y=340) = 12×12 `sch-error-circle.svg` `#DA1639` (margin-top 2) + "**Topic is required**" 400 12px/16px `#DA1639` margin-left 4. Row height grows 32→52, pushing everything down 20px. Restoring text removes it immediately on blur.
- Screenshot: `sch-05-topic-error-description.jpg`.

### 5.2 Add Description [M]
- Collapsed: `span.agenda-btn` (inline-flex, gap 5) = 14px plus icon `#0D6BDE` (`sch-plus.svg`) at x=502 + `button.zoom-button--text.is-pure-text` "Add Description" 400 14px/18px `#0D6BDE` (521,361 104×18). Text-button hover `#0C60C8`, active `#084085`.
- Expanded: `textarea#agenda.zoom-textarea__inner.is-autoresize` 490×**50** (rows=1 but `min-height:50px`), padding `6px 12px`, border 1px `#C1C6CE`, radius 12, 14px/18px, placeholder "Add Description" `#686F79`, `maxlength=2000`, `resize: vertical`. Auto height: 1–2 lines 50, 3 lines 68, ≥4 lines **86** (max) then scrolls. Focused on open; stays open when blurred empty. No character counter.

### 5.3 When [M]
`.when-item-widget{display:flex; flex-wrap:wrap; gap:8px}`.
1. **Date** `div.zoom-date-input.zoom-date-input--md` 240×32 at 502: bg `#FFF`, border 1px `#C1C6CE`, radius 12, padding `0 9px 0 11px`; label `span[role=combobox]` "10/07/2026" (format **MM/DD/YYYY**) 400 14px/18px `#222325`; calendar icon 14×14 `#555B62` (`sch-calendar.svg`) absolute `top:9px; right:10px`. Hover bg `rgba(110,118,128,.12)`; keyboard focus border `#4B96F1` + inset 1px. Click → date picker (§6.6).
2. **Start time** `span.zoom-calendar-filter-select` 173×32 at 750 (`.time-select-view` wrapper padding `5px 7px`): editable input (x=758, 157×20) value "11:00", chevron 12×12 `#555B62` at x=898 (`sch-select-chevron.svg`, `right:9px`). Default = next 15-min slot after now [D]. Open state: input value cleared and the old value shown as placeholder (`#686F79`), chevron rotates 180° (`transition: transform .3s linear`), border `#4B96F1` + `::after` 2px `#4B96F1` ring (`.is-focusing`). Menu §6.3.
3. **AM/PM** `span.zoom-select.zoom-select--md` 104×32 at 931: `div.zoom-select-input` border 1px `#C1C6CE` radius 12, value span "AM" at x=943 (padding-left 11+1), chevron at x=1010. Options **AM, PM**.

### 5.4 Duration [M]
`.duration-item-widget{display:flex; align-items:center}`
- Hour: `span.zoom-select.middle-width.duration-hour` 150×32 at 502 — **disabled**: border `rgba(173,177,184,.25)`, value "0" `#ADB1B8`, chevron `#ADB1B8`, `cursor:not-allowed`, bg stays `#FFF`; click does nothing.
- "hr" `span.mgl-sm` at x=660: 400 14px/14px `#232333`, margin-left 8.
- Minutes: `div.zoom-virtual-filter-select-input` 150×32 at 682, value "40"; options **0, 15, 30, 40** (40 ✓). Menu 150×152.
- "min" at x=840, same style as "hr".
- **Basic-plan banner** `div.zoom-banner.zoom-banner--warning.free-tip.paywall-free-user-alert.mgb-lg` at (502,518) **810×76**: `margin: 0 0 24px 170px; max-width:810px`, bg `#FFF9F2` + `linear-gradient(rgba(255,255,255,.5))`, border 1px `#E1BD93`, radius 12, padding 16. Icon 20×20 warning triangle **`#B36200`** (`sch-warning.svg`) at (519,535); body at x=551 (icon + 12): `<p>` 400 14px/**21px** `#222325`: "You can schedule meetings for up to 40 minutes each with your current Basic plan. Need more time?" + newline link "Upgrade to Zoom Workplace Pro" `#0D6BDE`. Clone: render as static (P1 decision) [D].

### 5.5 Time Zone [M]
`div.zoom-virtual-filter-select-input` 490×32 at 502, input (514,624 446×20) value "(GMT-7:00) Pacific Time (US and Canada)", chevron at x=967. Option label format **`(GMT±H:MM) Label`** — hour not zero-padded, offset is the *current* DST offset (Los Angeles shows −7:00 in October). 149 options (Appendix B). Filtering (§6.4) and menu flip-above behaviour measured (`sch-09-timezone-filter.jpg`).

### 5.6 Recurring meeting [M]
Checkbox at (502,677) + label "Recurring meeting" (526,675) 400 14px/18px `#232333`. No label in the label column. Checking it expands (instant, no animation) — see §8.1.

### 5.7 Invitees [M]
- `span.zoom-autocomplete.long-width#pmc-item` > `input[role=combobox].zoom-input__inner` 490×32, placeholder **"Enter user names or email addresses"**.
- Always-visible banner `div.zoom-banner--warning.invite-email-warning` (502,760) 810×73, margin-top 8: "Participants won't receive this meeting invite until your calendar is connected." (`<p>` 14px/21px) + `a.zoom-link` "Connect calendar" → `/profile?page_from=client` (_blank).
- Typing shows `div.zoom-floating.zoom-autocomplete__menu.attendee-suggestion` (490 wide, 4px under input, radius 12, border `#DFE3E8`, large shadow, list margin 11, `zoom-zoom-in` animation .3s). Row `li.zoom-autocomplete__option` 51px tall, padding `6px 8px`, radius 8, hover `rgba(110,118,128,.12)`: 24px round avatar (`zoom-avatar--sm`, bg per-letter: `T` → `#555B62` gray, `N` → `#9D3B0F` orange; initial 600 10px/24px white) · 8px · `p.name` 400 14px/20px `#323539` · `p.email-name` 400 12px/16px `#6E7680`.
- Invalid entry (e.g. "notanemail"): same row but `.is-disabled` (`cursor:not-allowed`) with right-aligned `span.validate-error` **"Invalid email"** 400 14px/18px `#B22424`.
- Selecting a valid suggestion (click) clears the input and appends to `div.attendee-list-scrollbar.mgt-md` (margin-top 16, under the banner): `div.normal-user` **490×40**, flex, `padding-right:8px`: avatar 24 · `span.email-name` 400 14px/14px `#232333` `padding:0 8px` (ellipsis) · remove button 24×24 round tertiary icon (`aria-label="Remove test@example.com"`, 14px × `#555B62`, `sch-close.svg`). List max height 350, scrollbar thumb 6px `rgba(0,0,0,.42)`. (Programmatic Enter did not add the address — clone may also accept Enter/comma for valid emails [D].)
- Screens: `sch-13-invitee-suggestion.jpg`, `sch-14-invitee-added.jpg`.

### 5.8 Meeting ID [M]
`div.zoom-radio-group.pt-sm` (padding-top 4): radio 1 at (502,864) "Generate Automatically"; radio 2 at (718,864) "Personal Meeting ID 492 555 0101" (label 400 14px/18px `#222325`, label starts 8px after the 16px radio, `.zoom-radio{margin-right:32px}`). Selecting PMI hides Template / Whiteboard / Docs / Interpretation rows (re-indexes `base-options-*`).

### 5.9 Template [M]
Virtual select 490×32, placeholder **"Select a template"** (`#686F79`). Menu (502, below) 490×88: group header `div.zoom-virtual-filter-select-group-option` "Personal templates" 400 12px/16px `#686F79` padding 8 + option "None".

### 5.10 Whiteboard [M]
Label "Whiteboard" + info icon button 16×16 at (415,976) (`zoom-button--sm --tertiary` icon `#8E9194`, `sch-info.svg`) → hover info popover (§6.9): bullet list "Can only add 1 whiteboard." / "Whiteboard access is granted to invitees after the event is scheduled. Removing invitees won't revoke their whiteboard access." Control: `button.zoom-button--md.--secondary` **150×32** "Add Whiteboard": bg `#F1F4F6`, radius 12, padding `6px 14px`, 14px whiteboard icon `#0D6BDE` (`sch-whiteboard.svg`) + 4px + 400 14px/18px `#0D6BDE`. (Opens a whiteboard picker dialog — not exercised.)

### 5.11 Docs [M]
`button.zoom-button--secondary` **109×32** "Add Docs" with 14px doc icon (`sch-docs.svg`). A hidden "Learn more about Add Docs" info button exists in DOM.

### 5.12 Security [M]
```
div#security[role=group]
├─ div.passcode.mgb-md > div.passcode-wrapper (flex, align-items:baseline)
│   ├─ span.zoom-checkbox.mgr-md  [disabled + checked]  "Passcode"  (label #ADB1B8)
│   └─ div.zoom-set-password#passcode (width 200) > form.zoom-info-popover__trigger > input[aria-label=Passcode]
│  p#passcodeTip.desc.mgl-lg.mgt-xs "Only users who have the invite link or passcode can join the meeting"
├─ div.waiting-room.mgb-md  checkbox "Waiting Room"
│  p#waitroomTip.desc "Only users admitted by the host can join the meeting"
└─ div.enforce-signed-in (display:none)  "Require authentication to join"
```
- Passcode checkbox (502,1091) disabled-checked: bg+border `#AACDF8`; label "Passcode" `#ADB1B8`.
- Passcode input at **x=609** (checkbox+label 91px + `mgr-md` 16), 200×32, `maxlength=10`, default = random 6-char mixed-case alphanumeric (`<passcode>`).
- Descriptions `p.desc`: 400 14px/**21px** **`#686F79`**, `margin: 4px 0 0 24px` (x=526).
- Waiting Room checkbox (502,1159) unchecked; description at y=1181.
- **Passcode rules popover** (shown while the input is focused/hovered): `div.zoom-floating.is-info-popover` data-side=bottom, **200×74** under the input (arrow 14px at top), radius 12 (inner `.zoom-info-popover` padding 16, radius 16), border `#DFE3E8`, large shadow. Title "Passcode must include:" 600 14px/18px `#222325` (margin-bottom 4); item row: 16px icon + 4px + "At least 1 characters" 400 14px/18px — valid: ✓ `#247F40` (`sch-checkmark.svg`), invalid (empty): ✕ `#DA1639` (`sch-x-small.svg`). `"a b"`, `"abc!@#"`, `"abcdefghij"` all valid (no error). Empty → input `.is-errored` (border `#FF6682`), no message text. Screenshot `sch-15-passcode-rules.jpg`.

### 5.13 Divider + Encryption [M]
- Divider = `.advanced-options-0::before{content:"";display:table;width:827px;height:1px;border-top:1px solid #EDEDF4;margin:0 0 32px 160px}`.
- `div.zoom-radio-group.pt-sm.pb-sm` (padding 4/4): radio (502,1282) + 16px green shield-check `#09A639` (`sch-shield-check.svg`) at 526 + 4px + "Enhanced encryption" 14px/18px + 20×20 info button (695,1280) | 32px | radio (747) + shield-lock `#09A639` (`sch-shield-lock.svg`) + "End-to-end encryption" + info (949).
- Info popovers (hover, data-side=top): Enhanced → "Encryption key stored in the cloud."; End-to-end → "Encryption key stored on your local device. No one else can obtain your encryption key, not even Zoom."
- Choosing **End-to-end** shows a closable warning banner (502, +4) 810×70, padding `16px 47px 16px 16px`: "Several features will be automatically disabled when using end-to-end encryption, including cloud recording and phone/SIP/H.323 dial-in." + `a` "**Learn More**" (margin-left 12, `#0D6BDE`, → support article, _blank) + × close 24px; **and hides** Whiteboard, Docs, Zoom AI, Workflow, My Notes and Meeting chat rows. Screenshot `sch-16-e2e-encryption.jpg`.

### 5.14 Zoom AI [M]
- Parent tri-state checkbox `span.zoom-checkbox.is-indeterminate-container.is-has-region.pt-sm.pb-sm` (display:block) with `i.zoom-checkbox__mixed[role=checkbox]`, label "Automatically start Zoom AI" 14px/18px `#232333` + 20×20 info button (hover: "Automatically start meeting questions and meeting summary").
- Children (indented to x=524, 22px region padding): "Automatically start meeting questions" (y+32), "Automatically start meeting summary" (y+68). Parent becomes **indeterminate** (blue box with white 10×2 bar) when one child is checked; checks/unchecks both when clicked.
- When "questions" is on: `p.option-desc` "Who can ask questions about this meeting’s transcript?" 400 14px/18px `#2A2B2D` (margin `4px 0 8px`) + select **418×32** (`aic-long-select`) default "All participants only from when they join"; options: All participants and invitees · All participants only from when they join ✓ · Only meeting host · Participants and invitees in our organization · Participants in our organization only from when they join.
- When "summary" is on: "Who will receive a summary after this meeting?" + 24px info button (hover: "Your selection may be limited based on your sharing settings.") + select 418×32 default "Only meeting host"; options: Only meeting host ✓ · Only meeting host, co-hosts, and alternative hosts · Only meeting host and meeting invitees in our organization · All meeting invitees including those outside of our organization.
- Hidden in DOM: "Automatically start deepfake risk detection" option.

### 5.15 Workflow [M]
Text button "Attach workflow to this meeting" (502,1469) 400 14px/18px `#0D6BDE` (opens a workflow picker — not exercised).

### 5.16 My Notes [M]
Checkbox (checked) "Allow participants to transcribe meeting with My Notes" (`input#note`), then `div.zoom-radio-group.is-vertical.note-transcript-scope.mgt-xs` (margin-left 24, radios at x=526, vertical pitch 29 = 16 + `margin-bottom:8px` + 4/1 padding): "Only participants in your organization" (y 1554) / **"All participants"** ✓ (y 1583). Unticking the checkbox hides the radio group.

### 5.17 Meeting chat [M]
Checked checkbox "Allow users to access meeting chats before and after the meeting" (label 14px/18px `#232333`).

### 5.18 Video [M]
Two `.sub-section` rows (display:flex), pitch **33px** (1697 → 1730): name span **120px** wide 400 14px/14px `#232333` ("Host" / "Participant"); radio group starts x=638 (16px after the name): "on" ✓ (radio 638, label 662) — 32px — "off" (radio 711, label 735). Hidden sr-only labels "Host video", "Panelist video".

### 5.19 Options [M]
- `button.zoom-button--text.is-pure-text.option-btn` "Show" (502,1781) 35×26, padding `4px 0`, `aria-label="Show More Options, Collapsed"` → "Hide" / "Hide More Options, Expanded". Instant toggle.
- Expanded list (checkbox rows `pdt-xs pdb-xs`, **28px pitch**, first row 32px below the button top):
  1. **Allow participants to join anytime** — ✓ checked by default (`.jbh-wrapper`)
  2. Mute participants upon entry — off
  3. Automatically record meeting on the local computer — off (`#auto-rec`, has hidden sub-option "On the local computer")
  4. Approve or block entry to users from specific regions/countries — off; ticking opens the **region dialog** (§8.6)
- None are disabled for this Basic account.

### 5.20 Interpretation [M]
Checkbox + label **"Select sign language interpretation video channels below. You can assign interpreters at any time."** (666px wide). Checking reveals: email input 200×32 placeholder **"john@company.com"** · 10px · language virtual select 300×32 default **"American Sign Language"** · 32×32 round × button · next line (y+58) tertiary button "+ Add Sign Language Interpreter" (232×32, `margin-left:-12px`, 14px plus icon). Screenshot `sch-18-interpretation.jpg`.

---

## 6. Components & states

### 6.1 Text input `.zoom-input__inner` (md) [M from CSS]
| State | Style |
|---|---|
| default | h32, `padding:6px 11px`, `border:1px solid #C1C6CE`, radius 12, bg transparent, 400 14px/18px `#222325`, `box-sizing:border-box` |
| placeholder | `#686F79` |
| hover (not focused) | bg `rgba(110,118,128,.12)`; placeholder `#5E646D` |
| focus | border `#4B96F1` + `box-shadow: inset 0 0 0 1px #4B96F1`; `outline:none` |
| error `.is-errored` | border `#FF6682`; focused: + `inset 0 0 0 1px #FF6682` |
| disabled | border `rgba(173,177,184,.25)`, text/placeholder `#ADB1B8`, `cursor:not-allowed` |
| read-only | border `#C1C6CE`, bg `#F7F9FA`, text `#686F79` |
No transitions. Textarea `.zoom-textarea__inner` is identical (default padding `8px 12px`, autoresize `6px 12px`, `resize:vertical`, thin scrollbar `#949494`).

### 6.2 Select trigger `.zoom-select-input` / `.zoom-virtual-filter-select-input` / `.zoom-calendar-filter-select-input` [M]
| State | Style |
|---|---|
| default | border 1px `#C1C6CE`, radius 12, bg `#FFF` (`.zoom-select`), height 32; value 400 14px/18px `#222325` starting 12px from the left edge; chevron 12×12 `#555B62` `position:absolute; top:50%; right:9px; transform:translateY(-50%)` |
| placeholder | `#686F79` (hover `#5E646D`) |
| hover | bg `rgba(110,118,128,.12)` |
| open / focusing | chevron `rotate(180deg)` (`.zoom-inline-chevron-icon{transition:transform .3s linear}`); filter-selects: border `#4B96F1` + `::after{inset:-1px; border:2px solid #4B96F1; border-radius:inherit}`; filterable selects clear the input and show the current value as placeholder |
| error | border `#FF6682` |
| disabled | border `rgba(173,177,184,.25)`, text & chevron `#ADB1B8`, `cursor:not-allowed` |
Filter-select input inner: `height:20px`, wrapper padding `5px 31px 5px 11px` (time select `5px 7px`).

### 6.3 Dropdown menu (all selects) [M]
- `div.zoom-floating.zoom-select__menu` (or `__virtual-filter-select__menu`, `__calendar-filter-select__menu`) appended to `<body>`, `position:absolute`, **width = trigger width**, top = trigger bottom **+4px** (flips above with `data-side=top` when no room), z-index 105–119, bg `#FFF`, border 1px `#DFE3E8`, **radius 12**, `box-shadow: 0 12px 24px 0 rgb(0 0 0/.08), 0 6px 12px 0 rgb(0 0 0/.08)`.
- Inner `.zoom-scrollbar__wrap` `max-height:208px` (native scrollbar hidden; custom 6px thumb `rgba(0,0,0,.42)` fades in on hover, radius 6, `transition: opacity .3s ease-out`); list `margin:11px` → total menu height = n×32 + 24 (e.g. 2 options → 88, 4 → 152, ≥6 → 210).
- Option: `display:flex; align-items:center; min-height:32px; padding:6px 8px; border-radius:8px`; text 400 14px/18px `#222325`, ellipsis; unselected siblings `padding-right:32px`; **hover** bg `rgba(110,118,128,.12)`; **selected**: no bg, text unchanged, 16×16 ✓ `#222325` (`margin-left:8px`, `sch-checkmark.svg`); **keyboard/virtual focus** (`.is-virtual-focusing`): bg `rgba(10,10,10,.12)` + 2×(h−12) bar `#4B96F1` at `left:-8px`; disabled `#ADB1B8`.
- Group title: 400 12px/16px `#686F79`, padding 8; groups separated by 1px `#DFE3E8` line inset 8px.
- Empty state: `.zoom-virtual-filter-select__empty` padding 12, centred "**No matching data**" 400 14px/20px `#686F79` (menu 46px tall).
- Open/close animation `zoom-zoom-in-top`: `transform: scaleY(0→1)` + `opacity 0→1`, **300ms `cubic-bezier(.23,1,.32,1)`**, `transform-origin: center top` (bottom when `data-side=top`).
- On open the list auto-scrolls so the selected option is visible. Esc closes AM/PM-type selects; outside click closes all.
- Screenshot `sch-08-time-dropdown.jpg` (selected 11:00 with ✓ and focus bg).

### 6.4 Typing / filtering behaviour [M]
| Control | Behaviour |
|---|---|
| Start time | Prefix/numeric filter: `3` → 3:00, 3:15, 3:30, 3:45; `3:3` → 3:30; `13` → 1:00, 1:15, 1:30, 1:45 + created "13"; `9:10` → created option "9:10" (Enter accepts → stored `09:10`, appended into the list); `abc` → created "abc" but Enter rejects it (value unchanged). Menu height shrinks to fit results. |
| Time zone | Case-insensitive **substring** of the label: `india` → "(GMT-4:00) Indiana (East)", "(GMT+5:30) India"; `kol` → "(GMT+5:30) Mumbai, Kolkata, New Delhi"; `+5:30` → India, Mumbai…, Colombo; `GMT-1` → Midway, Pago Pago, Hawaii, Greenland, Cape Verde; no match → "No matching data". Clearing + outside click keeps the previous value. |
| Duration min / Template | same virtual filter select (filterable). |

### 6.5 Checkbox `.zoom-checkbox` [M]
- Box `span.zoom-checkbox__inner` 16×16, `top:2px` relative (box sits 2px below the label top), border 1px `#939BA4`, radius 4, `transition: border-color .2s cubic-bezier(.71,-.46,.29,1.46), background-color .2s cubic-bezier(.71,-.46,.29,1.46)`. Check mark = two 2px white (`#F7F9FA`) bars rotated 45° (`::before 2×9 at (7,3)`, `::after 5×2 at (4,10)`), opacity 0→1.
- Label `span.zoom-checkbox__label` `margin-left:8px; padding:1px 0`, 400 14px/18px `#232333`. Native `input.zoom-checkbox__original` is invisible (opacity 0) behind the box.
- States: hover bg `rgba(110,118,128,.12)`; active `rgba(110,118,128,.42)`; **checked** bg+border `#0D6BDE` (hover `#0C60C8`, active `#084085`); **indeterminate** same blue + 10×2 white bar at (2,6); disabled border `#ADB1B8` bg `rgba(173,177,184,.25)`, label `#ADB1B8`; **disabled-checked** bg+border `#AACDF8`; keyboard focus `outline:2px solid #4B96F1; outline-offset:2px`.

### 6.6 Radio `.zoom-radio` [M]
- `display:inline-block; margin-right:32px` (last 0); wrap `inline-flex; align-items:center; min-height:20px`.
- Circle `div[role=radio].zoom-radio__inner` 16×16, border 1px `#939BA4`, `margin-right:8px`; knob `i.zoom-radio__knob` 8×8 white, `transform: translate(-50%,-50%) scale(0→1)`, **`transition: transform .15s ease-in`**.
- Label 400 14px/18px `#222325`. Checked: bg+border `#0D6BDE` (hover `#0C60C8`, active `#084085`); hover (unchecked) bg `rgba(110,118,128,.12)`; disabled border `#ADB1B8` bg `rgba(173,177,184,.25)`, label `#ADB1B8`; disabled-checked `#ADB1B8`; focus `outline:2px solid #4B96F1`. Vertical groups: `display:block; margin-bottom:8px`.

### 6.7 Date picker [M]
- Popover `div.zoom-floating.zoom-date-picker__popover.is-popover-container` (body child) **280×336** day view / 280×248 month & year views; `position:absolute`, left aligned to the field (x=502), 4px gap, z-index 108 (still under the fixed header, z 1030); bg `#FFF`, border 1px `#DFE3E8`, **radius 16**, **`box-shadow: 0 4px 8px 0 rgb(0 0 0/.08), 0 2px 4px 0 rgb(0 0 0/.08)`**; flips to `data-side=top` (above the field) when there is not enough room below — with the description open the day view opened above (top 98, bottom 434, field at 438). Animation `zoom-zoom-in-top` 300ms.
- `.zoom-date-panel__body{width:278px; padding:15px}`; header h24: left group « (Previous year) ‹ (Previous month) — buttons 24×24 round tertiary icon, 14px glyphs `#555B62` (`sch-dp-prev-year.svg`, `sch-dp-prev-month.svg`); centred title = two clickable spans "October" (591,114 62×24) and "2026" (653) 600 14px/24px `#222325`, `padding:0 2px`, radius 4, hover bg `rgba(110,118,128,.12)`; right group › » (`sch-dp-next-month.svg`, `sch-dp-next-year.svg`).
- Weekday row (y+32): S M T W T F S — 32×32 cells 400 14px/30px **`#686F79`** (each has a tooltip trigger with the full weekday name [D]).
- Day grid: always **6 rows × 7**, cell `div.zoom-date-table__cell` 32×32, `margin: 8px 4px 0 0` (last column margin 0) → **pitch 36 × 40**, border 1px transparent, radius 999, 400 14px/30px.

| Day state (`td` class) | Style |
|---|---|
| `available normal` | `#222325`, `cursor:pointer`; hover bg `rgba(110,118,128,.12)` [D, same token as month cells] |
| `prev-month disabled` / `normal disabled` (past) | `#ADB1B8`, `cursor:not-allowed`, `aria-disabled=true` |
| `available next-month` | **`#686F79`**, selectable |
| `current` (selected) | bg `#ECF4FD` (`--zoom-color-component-toggle-button-background-selected`), border 1px `#A8CCF8`, text `#0D6BDE` **600** |
| `today` not selected | bg **`#0D6BDE`**, text `#FFF`; hover `#0C60C8` |
| keyboard focus | `::after` 2px `#4B96F1` ring inset −4px, radius 2 |
Cell `aria-label` format: "Wednesday,October 7,2026 selected" / "… not selected".
- Clicking a day sets the field (MM/DD/YYYY) and closes the popover; Esc closes. Reopening returns to the day view.
- **Month view** (click "October"): header « 2026 » only; 3×4 grid of `zoom-month-table__cell` **54×32**, `margin:16px 40px 0 0`, radius 999; Jan–Sep (past) `#ADB1B8`; Oct selected style; Nov, Dec `#222325`.
- **Year view** (click "2026"): header label "2020 - 2029" (not clickable); 12 cells 2019…2030; 2019–2025 `#ADB1B8`, 2026 selected, 2027–2029 `#222325`, 2030 (next decade) `#686F79`.
- Screens: `sch-06-datepicker-day.jpg`, `sch-07-datepicker-year.jpg`.

### 6.8 Buttons (`.zoom-button`) [M]
| Variant | Size | Default | Hover | Active | Disabled |
|---|---|---|---|---|---|
| primary md (Save) | h32, `padding:6px 14px`, radius 12, label **500** 14px/18px | bg `#0D6BDE`, `#FFF` | `#0C60C8` | `#084085` | bg `rgba(173,177,184,.25)`, text `#ADB1B8`, `cursor:not-allowed` (`.is-primary-disabled`) |
| secondary md (Cancel, Add Whiteboard/Docs) | same, label 400 | bg `#F1F4F6`, text `#0D6BDE` | bg `rgba(110,118,128,.12)`, text `#0C60C8` | bg `rgba(110,118,128,.42)`, text `#084085` | same as primary disabled |
| tertiary md | `padding:6px 8px` | transparent, `#0D6BDE` | bg `.12` grey, `#0C60C8` | `.42` grey, `#084085` | text `#ADB1B8` |
| text / pure-text (Add Description, Show, Workflow) | `height:auto; padding:0; radius 4` | `#0D6BDE` 400 | `#0C60C8` | `#084085` | `#ADB1B8` |
| icon tertiary (info, ×, date arrows) | md 32×32 / sm 24×24 round (`border-radius:100%`), icon 16/14px | transparent, `#555B62` | bg `rgba(110,118,128,.12)` | bg `.42` | – |
Icon + label gap 4px; adjacent buttons `margin-left:8px`; keyboard focus `outline:2px solid #4B96F1; outline-offset:2px`. `.is-loading` keeps the colour (cursor not-allowed). No transitions on buttons.

### 6.9 Info popover / tooltip [M]
- Info popover (hover on ⓘ buttons, passcode field): `div.zoom-floating.is-info-popover` — border 1px `#DFE3E8`, radius 12, large shadow, z ~148; inner `.zoom-info-popover{max-width:320px; padding:16px; border-radius:16px; 400 14px/18px}` (title 600 14px/18px, margin-bottom 4); 14×14 arrow (rotated square with border) pointing at the trigger; default side top, flips. Enter/leave: `opacity` + `transform: scale(0→1)` **200ms `cubic-bezier(.4,0,.2,1)`** (`zoom-tooltip-enter-*`). Stays open while the pointer is over the popover.
- Dark tooltip (`.zoom-floating.is-tooltip`, used for truncated option text): radius 4, padding `2px 6px`, 400 12px/16px, white text on translucent dark (`--zoom-color-state-contrary-strong-transparent-hover`), `backdrop-filter: blur(15px)`, small shadow, max-width 320.

### 6.10 Banner `.zoom-banner` [M]
`padding:16px; border-radius:12px; color:#222325; transition: opacity .3s`; `__main{display:flex; align-items:center}`; icon 20px `align-self:flex-start`; body `margin: 0 8px 0 12px`; content 400 14px/18px (schedule page `<p>` overrides to 14px/21px); closable → `padding-right:47px` + × at `top:13px; right:13px`.
| Kind | bg | overlay | border | icon |
|---|---|---|---|---|
| warning | `#FFF9F2` | `linear-gradient(rgba(255,255,255,.5))` | `#E1BD93` | triangle `#B36200` |
| info | `#F2F8FF` | `rgba(255,255,255,.6)` | `#A8CCF8` | `#3B90F7` |
| success | `#F2FFF6` | `rgba(255,255,255,.4)` | `#9ECEAD` | `#09A639` |
| danger | `#FFF2F5` | `rgba(255,255,255,.6)` | `#F6AAB8` | – |
On this page banners are max-width 810.

### 6.11 Dialog `.zoom-dialog` (region dialog) [M]
Overlay `.zoom-overlay` fixed, bg **`rgba(0,0,0,.2)`**, z 2001; dialog centred (`margin:auto` in a flex `.zoom-overlay-dialog`), **640×330**, bg `#FFF`, **radius 32**, large shadow; header `padding:32px 32px 24px`, title 700 20px/24px `#222325` (`padding-right:40px`), close 32×32 round icon button at `top:28px; right:32px` (16px ×); body `padding:0 32px`; footer `padding:32px; text-align:right` → Cancel (secondary 73×32) + 8px + Save (primary 60×32). Animation `fade-in-linear`: `opacity 0→1` + `translate3d(0,-20px,0)→0`, 300ms. Screenshot `sch-17-region-dialog.jpg`.

### 6.12 Form error `.zoom-form-item__error` [M]
`display:flex; margin-top:4px`; icon 12px `#DA1639` (`margin-top:2px`); text `margin-left:4px` 400 12px/16px `#DA1639`. Duration row suppresses errors (`.zoom-form-item__error{display:none}` in durationItem CSS).

---

## 7. Dropdown contents (verbatim)

- **Start time (48)**: `12:00, 12:15, 12:30, 12:45, 1:00, 1:15, 1:30, 1:45, 2:00, 2:15, 2:30, 2:45, 3:00, 3:15, 3:30, 3:45, 4:00, 4:15, 4:30, 4:45, 5:00, 5:15, 5:30, 5:45, 6:00, 6:15, 6:30, 6:45, 7:00, 7:15, 7:30, 7:45, 8:00, 8:15, 8:30, 8:45, 9:00, 9:15, 9:30, 9:45, 10:00, 10:15, 10:30, 10:45, 11:00, 11:15, 11:30, 11:45` (menu 173×210, scrolled to the selected item).
- **AM/PM**: `AM, PM` (menu 104×88).
- **Duration hr**: disabled at `0` (Basic). **Duration min**: `0, 15, 30, 40` (Basic).
- **Template**: group "Personal templates" → `None`.
- **Recurrence**: `Daily, Weekly, Monthly, No Fixed Time`. Repeat every: Daily `1–99` "day(s)", Weekly `1–50` "week(s)", Monthly `1–10` "month(s)". Monthly "Day [1–31] of the month" / "[First, Second, Third, Fourth, Last] [Sunday … Saturday] of the month". End "After [1–60] occurrences".
- **Time zone — representative 30 (verbatim)**:
  `(GMT-11:00) Midway Island, Samoa` · `(GMT-10:00) Hawaii` · `(GMT-8:00) Alaska` · `(GMT-7:00) Pacific Time (US and Canada)` · `(GMT-7:00) Arizona` · `(GMT-6:00) Mountain Time (US and Canada)` · `(GMT-6:00) Mexico City` · `(GMT-5:00) Central Time (US and Canada)` · `(GMT-5:00) Bogota` · `(GMT-4:00) Eastern Time (US and Canada)` · `(GMT-4:00) Indiana (East)` · `(GMT-3:00) Sao Paulo` · `(GMT-3:00) Buenos Aires, Georgetown` · `(GMT-2:30) Newfoundland and Labrador` · `(GMT+0:00) Universal Time UTC` · `(GMT+0:00) Greenwich Mean Time` · `(GMT+1:00) London` · `(GMT+2:00) Amsterdam, Berlin, Rome, Stockholm, Vienna` · `(GMT+2:00) Paris` · `(GMT+3:00) Athens` · `(GMT+3:00) Moscow` · `(GMT+4:00) Dubai` · `(GMT+5:00) Islamabad, Karachi, Tashkent` · `(GMT+5:30) India` · `(GMT+5:30) Mumbai, Kolkata, New Delhi` · `(GMT+5:45) Kathmandu` · `(GMT+7:00) Bangkok` · `(GMT+8:00) Beijing, Shanghai` · `(GMT+9:00) Osaka, Sapporo, Tokyo` · `(GMT+11:00) Canberra, Melbourne, Sydney` — full 149-entry list with IANA ids in **Appendix B**.

---

## 8. Conditional UI

### 8.1 Recurring meeting expanded [M] (`sch-10-recurring-daily.jpg`, `sch-11-recurring-monthly.jpg`, `sch-12-recurring-nofixedtime.jpg`)
- Next to the checkbox label (x=679, after 26px): `span.recurrence-text` summary **700 14px/24px `#232333`**, e.g. "Every day, until Oct 13, 2026, 7 occurrence(s)"; Weekly "Every week on Wed, until Nov 18, 2026, 7 occurrence(s)"; Monthly "Every month on the 7 of the month, until Apr 7, 2027, 7 occurrence(s)" / "Every month on the First Sun, until Apr 7, 2027, 6 occurrence(s)"; After-N "Every month on the First Sun, 7 occurrence(s)"; No Fixed Time "Meet anytime".
- Nested sub-form inside the widgets column: sub-labels at x=502 (wrapper 160 + gap 10 → controls at **x=672**), rows 57px apart (`recurring-form-item mgb-md`):
  - **Recurrence** `*` (asterisk after label) — select 200×32, default **Daily**.
  - **Repeat every** — select 100×32 (`short-width`) "1" + "day(s)|week(s)|month(s)" (8px, 14px/14px `#232333`).
  - **Occurs on** (Weekly) — 7 checkboxes Sun Mon Tue Wed Thu Fri Sat, 16px between items; the start date's weekday is **checked + disabled** when it is the only one.
  - **Occurs on** (Monthly) — radio "Day [100×32 select: 7] of the month" / radio "[150×32 First] [150×32 Sunday] of the month" (second line disabled until its radio is chosen; row gap ~40).
  - **End date** — radios (`.recurring-end-data`, flex-wrap, row-gap 10): "No end time" · "By [date input 240×32, default start + 6 occurrences]" (default ✓) · next line "After [100×32 select 7, disabled] occurrences".
- **No Fixed Time** hides When, Duration (+banner) and Time Zone rows and the other recurrence sub-rows.

### 8.2 Personal Meeting ID chosen [M]
Template, Whiteboard, Docs and Interpretation rows disappear (form re-indexes).

### 8.3 End-to-end encryption chosen [M] — see §5.13.

### 8.4 Zoom AI children — see §5.14. ### 8.5 My Notes off — radios hidden.

### 8.6 "Approve or block entry…" dialog [M]
Title "Approve or block entry to users from specific regions/countries"; radios "Only allow users from selected countries/regions" ✓ / "Block users from selected countries/regions" (29px pitch); bold sub-title "Countries/Regions" (700 14px/24px `#232333`, margin `16px 0 4px`); multi-select 576×32 with a pre-filled tag **"India ×"** (`zoom-tag--info` 53×20, bg `#F7F9FA`, radius 5, padding `2px 2px 2px 6px`, 12px/16px). Cancel closes and **unticks** the option.

---

## 9. Sticky footer bar [M]
```
div.zoom-sticky[enabled=true] (style height:80px)            natural slot at end of content (y=1891)
├─ div.zoom-sticky__placeholder (height 80, width 987)
└─ div(.zoom-sticky--fixed while form overflows viewport)    position:fixed; bottom:0; left:332; width:987; height:80; z-index:100
   └─ div.align-left.sticky-btn-wrapper                       bg #FFF; padding:24px 0; text-align:left
       ├─ button.zoom-button--md.--primary.save-btn  "Save"   332,712  60×32
       └─ button.zoom-button--md.--secondary         "Cancel" 400,712  73×32 (margin-left 8)
```
- Becomes fixed whenever the placeholder's top is below the viewport bottom (i.e. on load at 768px); reverts to static when the user scrolls to the end (y=157 in the bottom screenshot). No shadow, no border, no transition. Width matches the content column only (side menu stays visible to its left).
- With keyboard navigation active (`body.is-vue3-keyboard-event`) the fixed copy is `visibility:hidden` [M from CSS].
- **Save** never clicked. States from CSS: hover `#0C60C8`, active `#084085`, disabled `rgba(173,177,184,.25)` / `#ADB1B8` [M]; loading spinner [D].
- **Cancel** → full navigation to `https://zoom.us/meeting#/upcoming` (schedule) / `https://zoom.us/meeting#/pmi/4925550101` (PMI edit), no unsaved-changes prompt [M]. Clone: Cancel → `/wc/meetings`.

---

## 10. Edit page (PMI) — `https://zoom.us/meeting/4925550101/edit` [M] (`sch-19-edit-pmi.jpg`)
| Aspect | Schedule | Edit (Personal Meeting Room) |
|---|---|---|
| `<title>` | Schedule a Meeting - Zoom | **Edit Meeting - Zoom** |
| H1 | Schedule Meeting | **`Edit "<Host Name>'s Personal Meeting Room"`** (same 600 20px/22px) |
| Back link | "Back to Meetings" → `/meeting#/upcoming` | same |
| Rows | 19 rows (§4) | **Personal Meeting ID** (label 160 wide; value `div.pmi-number` "492 555 0101" 400 14px/32px `#232333`, plain text) → **Security** → divider → **Encryption** → **Zoom AI** → **Workflow** → **My Notes** → **Video** → **Options** |
| Missing on edit | – | Topic, Description, When, Duration (+banner), Time Zone, Recurring, Invitees, Meeting ID radios, Template, Whiteboard, Docs, Meeting chat, Interpretation |
| Prefill | – | Passcode = PMI passcode (disabled-checked); **Waiting Room ✓ checked**; Enhanced encryption; AI off; My Notes ✓ / All participants; Video on/on; Options: join anytime ✓, others off |
| Buttons | Save / Cancel | **Save / Cancel** (same classes/sizes) |
| Cancel → | `/meeting#/upcoming` | **`/meeting#/pmi/4925550101`** |
Row y on edit (banner collapsed): back link 172, H1 214, PMI row 268, Security 325 (h134), Encryption 484+33, Zoom AI 572, Workflow 706, My Notes 761, Video 875, Options 965 [M].
A regular scheduled meeting's edit page could not be captured (account has no upcoming meetings); PRD's "same form, title Edit Meeting, prefilled" remains [D].

---

## 11. Animations summary [M]
| Element | Property | Duration / easing |
|---|---|---|
| Select / time / date-picker / autocomplete menus (`zoom-zoom-in-top`) | `transform: scaleY(0→1)`, `opacity 0→1`, origin top (bottom when flipped) | 300ms `cubic-bezier(.23,1,.32,1)` |
| Info popover / tooltip | `opacity`, `transform: scale(0→1)` | 200ms `cubic-bezier(.4,0,.2,1)` |
| Select chevron | `rotate(0→180deg)` | 300ms linear |
| Side-menu group chevron | `rotate(-90deg→0)` | 300ms ease-in-out |
| Checkbox box | `border-color`, `background-color` | 200ms `cubic-bezier(.71,-.46,.29,1.46)` |
| Radio knob | `transform: scale(0→1)` | 150ms ease-in |
| Banners | `opacity` (fade on dismiss) | 300ms |
| Dialog | `opacity` + `translateY(-20px→0)` | 300ms |
| Scrollbar thumb track | `opacity` | 300ms ease-out |
| Header nav arrows (`.arrow` img) | all | 250ms |

---

## 12. Tokens resolved on this page [M]
`--zoom-color-border-input #C1C6CE` · `--zoom-color-border-primary #4B96F1` · `--zoom-color-border-error #FF6682` · `--zoom-color-border-neutral #939BA4` · `--zoom-color-border-subtle-neutral #DFE3E8` · `--zoom-color-border-subtle-primary #A8CCF8` · `--zoom-color-border-subtle-warning #E1BD93` · `--zoom-color-border-subtle-success #9ECEAD` · `--zoom-color-border-subtle-error #F6AAB8` · `--zoom-color-text-stronger-neutral #222325` · `--zoom-color-text-strong-neutral #555B62` · `--zoom-color-text-neutral #686F79` · `--zoom-color-text-primary #0D6BDE` · `--zoom-color-text-error #DA1639` · `--zoom-color-text-success #247F40` · `--zoom-color-state-primary-hover #0C60C8` · `--zoom-color-state-primary-press #084085` · `--zoom-color-state-subtle-neutral-hover rgb(110 118 128/.12)` · `--zoom-color-state-subtle-neutral-press rgb(110 118 128/.42)` · `--zoom-color-state-neutral-hover #5E646D` · `--zoom-color-state-disable #ADB1B8` · `--zoom-color-state-subtle-disable rgb(173 177 184/.25)` · `--zoom-color-state-subtle-primary-disable #AACDF8` · `--zoom-color-virtual-focus-hover rgb(10 10 10/.12)` · `--zoom-color-fill-subtle-neutral #F1F4F6` · `--zoom-color-fill-subtler-neutral #F7F9FA` · `--zoom-color-fill-subtler-primary #F2F8FF` · `--zoom-color-fill-subtler-warning #FFF9F2` · `--zoom-color-fill-subtler-success #F2FFF6` · `--zoom-color-fill-subtler-error #FFF2F5` · `--zoom-color-fill-warning #B36200` · `--zoom-color-icon-neutral #8E9194` · `--zoom-color-icon-strong-neutral #555B62` · `--zoom-color-icon-success #09A639` · `--zoom-color-icon-primary #3B90F7` · `--zoom-color-underlay-dark rgb(0 0 0/.2)` · `--zoom-color-component-toggle-button-background-selected #ECF4FD` · `--zoom-box-shadow 0 12px 24px 0 rgb(0 0 0/.08), 0 6px 12px 0 rgb(0 0 0/.08)` · `--zoom-box-shadow-small 0 4px 8px 0 rgb(0 0 0/.08), 0 2px 4px 0 rgb(0 0 0/.08)`.
Portal-only colours: header text `#666484`, black strip `#00031F`, side menu bg `#F7F7FA`, divider `#EDEDF4`, footer `#39394D`, banner-success measured bg `rgb(228,247,235)`, "New" badge text `#2057B1`, upgrade pill `#00F0EA`/`#0B5CFF`, invitee suggestion text `#323539`/`#6E7680`, "Invalid email" `#B22424`.

Source CSS (downloaded to scratch `sch/css/`): `chunk-vendor.DyTqOAn0.css` (all `.zoom-*` components), `index.DI6hobH1.css` (schedule layout), `*Item.*.css` (per-row), `zoom-ui.DVS4344l.css` (fe-popups side menu/badge/banner), `side-menu-free.Qzvk-Y8t.css` (upgrade pill), `top_nav.min.css` (header).

---

## 13. Screenshots & icons saved

**Screenshots** (`docs/reference/screens/`, 800px-wide captures of 1366×768; passcode masked):
`sch-01-top.jpg` (header, banner, side menu, top rows) · `sch-02-middle.jpg` (Time Zone → Security) · `sch-03-advanced.jpg` (Encryption → Options) · `sch-04-bottom-footer.jpg` (static sticky bar + footer) · `sch-05-topic-error-description.jpg` · `sch-06-datepicker-day.jpg` · `sch-07-datepicker-year.jpg` · `sch-08-time-dropdown.jpg` · `sch-09-timezone-filter.jpg` · `sch-10-recurring-daily.jpg` · `sch-11-recurring-monthly.jpg` · `sch-12-recurring-nofixedtime.jpg` · `sch-13-invitee-suggestion.jpg` · `sch-14-invitee-added.jpg` · `sch-15-passcode-rules.jpg` · `sch-16-e2e-encryption.jpg` · `sch-17-region-dialog.jpg` · `sch-18-interpretation.jpg` · `sch-19-edit-pmi.jpg` (19 files).

**Icons** (`docs/reference/icons/`, `currentColor` unless noted):
| File | Use | Rendered size / colour |
|---|---|---|
| `sch-zoom-logo.svg` | header logo (original blue fills) | 110×25 |
| `sch-topbar-search.svg` | black-strip Search | 20 / `#FFF` |
| `sch-nav-arrow-down-grey.svg` | Host / Web App chevron (fill `#666484`) | 10×5 |
| `sch-nav-arrow-down.svg` | Products/Solutions/Resources hover arrow (white) | 8×4 |
| `sch-external-link.svg` | side menu ↗ | 14 / `#222325` |
| `sch-submenu-chevron.svg` | side-menu group chevron | 10 in 16 box / `#555B62` |
| `sch-upgrade-star.svg` | Upgrade to Pro | 14 / `#0B5CFF` |
| `sch-banner-success.svg` | marketing banner (green circle + white check) | 20 |
| `sch-close.svg` | banner ×, invitee remove | 14 / `#555B62` |
| `sch-back-chevron.svg` | Back to Meetings | 14 / `#0D6BDE` |
| `sch-plus.svg` | + Add Description / + Add Sign Language Interpreter | 14 / `#0D6BDE` |
| `sch-calendar.svg` | date input | 14 / `#555B62` |
| `sch-select-chevron.svg` | all select chevrons | 12 / `#555B62` (`#ADB1B8` disabled) |
| `sch-checkmark.svg` | selected option ✓, passcode rule ✓ | 16 / `#222325` (`#247F40` rule) |
| `sch-x-small.svg` | passcode rule ✕ | 16 / `#DA1639` |
| `sch-info.svg` | ⓘ buttons | 14 / `#8E9194` (label) or `#686F79` (radio/checkbox suffix) |
| `sch-whiteboard.svg` | Add Whiteboard | 14 / `#0D6BDE` |
| `sch-docs.svg` | Add Docs | 14 / `#0D6BDE` |
| `sch-shield-check.svg` | Enhanced encryption | 16 / `#09A639` |
| `sch-shield-lock.svg` | End-to-end encryption | 16 / `#09A639` |
| `sch-warning.svg` | warning banners | 20 / `#B36200` |
| `sch-error-circle.svg` | field error | 12 / `#DA1639` |
| `sch-dp-prev-year.svg`, `sch-dp-prev-month.svg`, `sch-dp-next-month.svg`, `sch-dp-next-year.svg` | date-picker header | 14 / `#555B62` |
(26 files.)

---

## Appendix A — trimmed raw CSS (Zoom `chunk-vendor` design-system rules, variables resolved, md sizes only, high-contrast/RTL/unrelated variants removed)

```css
/* ==== .zoom-input* ==== */
.zoom-input{position:relative;display:inline-flex;align-items:center;width:100%;color:#222325;font-size:14px}
.zoom-input.is-counted{padding-bottom:20px}
.zoom-input__inner{display:inline-block;box-sizing:border-box;width:100%;height:32px;padding:6px 11px;border:1px solid #C1C6CE;border-radius:12px;background-color:transparent;color:#222325;-webkit-appearance:none;-moz-appearance:none;appearance:none;font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-input__inner::placeholder{color:#686F79;opacity:1}
.zoom-input__inner:focus-visible{outline:none}
.zoom-input__inner:focus:not(.is-disabled,.is-bare){border-color:#4B96F1;box-shadow:inset 0 0 0 1px #4B96F1}
.zoom-input__inner:hover:not(:focus,.is-disabled,.is-readonly,.is-bare){background-color:rgb(110 118 128 / .12)}
.zoom-input__inner:hover:not(:focus,.is-disabled,.is-readonly,.is-bare)::placeholder{color:#5E646D}
.zoom-input__inner.is-disabled{border-color:rgb(173 177 184 / .25);color:#ADB1B8;cursor:not-allowed}
.zoom-input__inner.is-disabled::placeholder{color:#ADB1B8}
.zoom-input__inner.is-readonly{border-color:#C1C6CE;background-color:#F7F9FA;color:#686F79;cursor:not-allowed}
.zoom-input__inner.is-readonly::placeholder{color:#686F79}
.zoom-input__inner.is-errored{border-color:#FF6682}
.zoom-input__inner.is-errored:focus:not(.is-disabled){border-color:#FF6682;box-shadow:inset 0 0 0 1px #FF6682}
.zoom-input__inner.is-bare{border:none}
.zoom-input__count{position:absolute;bottom:0;left:0;color:#686F79;font-weight:400;font-style:normal;font-size:12px;line-height:16px}
.zoom-input__count.is-exceed{color:#DA1639}

/* ==== .zoom-textarea* ==== */
.zoom-textarea{position:relative;display:inline-block;width:100%;height:100%}
.zoom-textarea__count{margin-top:4px;color:#686F79;font-weight:400;font-style:normal;font-size:12px;line-height:16px}
.zoom-textarea__count.is-exceed{color:#DA1639}
.zoom-textarea__inner{display:block;box-sizing:border-box;width:100%;height:60px;padding:8px 12px;border:1px solid #C1C6CE;border-radius:12px;background-color:transparent;color:#222325;font-size:14px;line-height:18px;resize:vertical;-webkit-appearance:none;-moz-appearance:none;appearance:none;scrollbar-width:thin;scrollbar-color:#949494 transparent}
.zoom-textarea__inner:focus-visible{outline:none}
.zoom-textarea__inner::placeholder{color:#686F79;opacity:1}
.zoom-textarea__inner:focus:not(.is-disabled,.is-bare){border-color:#4B96F1;box-shadow:inset 0 0 0 1px #4B96F1}
.zoom-textarea__inner:hover:not(:focus,.is-disabled,.is-readonly,.is-bare){background-color:rgb(110 118 128 / .12)}
.zoom-textarea__inner:hover:not(:focus,.is-disabled,.is-readonly,.is-bare)::placeholder{color:#5E646D}
.zoom-textarea__inner.is-errored{border-color:#FF6682}
.zoom-textarea__inner.is-errored:focus:not(.is-disabled){border-color:#FF6682;box-shadow:inset 0 0 0 1px #FF6682}
.zoom-textarea__inner.is-disabled{border-color:rgb(173 177 184 / .25);color:#ADB1B8;cursor:not-allowed}
.zoom-textarea__inner.is-disabled::placeholder{color:#ADB1B8}
.zoom-textarea__inner.is-readonly{border-color:#C1C6CE;background-color:#F7F9FA;color:#686F79;cursor:not-allowed}
.zoom-textarea__inner.is-readonly::placeholder{color:#686F79}
.zoom-textarea__inner.is-has-rows{height:auto}
.zoom-textarea__inner.is-bare{border:none}
.zoom-textarea__inner.is-autoresize{padding-top:6px;padding-bottom:6px}
.is-vue3-keyboard-event .zoom-textarea .zoom-textarea__inner.is-disabled:focus{border-color:#4B96F1;box-shadow:inset 0 0 0 1px #4B96F1}

/* ==== .zoom-select* (zoom-select / zoom-select-input / zoom-select-option) ==== */
.zoom-input__prepend-select .zoom-select-input{border-right:none;border-top-right-radius:0;border-bottom-right-radius:0}
.zoom-input__prepend-select>.zoom-select--md .zoom-select-input--md{height:32px}
.zoom-input__append-select .zoom-select-input{border-left:none;border-top-left-radius:0;border-bottom-left-radius:0}
.zoom-input__append-select>.zoom-select--md .zoom-select-input--md{height:32px}
.zoom-select-input{position:relative;box-sizing:border-box;border:1px solid #C1C6CE;border-radius:12px;cursor:pointer}
.zoom-select-input:hover:not(.is-disabled){background-color:rgb(110 118 128 / .12)}
.zoom-select-input:hover:not(.is-disabled) .zoom-select-input__span.is-placeholder{color:#5E646D}
.zoom-select-input__wrapper{position:relative;display:flex;align-items:center;overflow-x:hidden;overflow-y:auto;min-height:30px;padding-right:31px;padding-left:11px;font-size:14px;line-height:1}
.zoom-select-input__span{display:inline-block;overflow:hidden;min-width:60px;max-width:100%;border:none;color:#222325;outline:0;text-overflow:ellipsis;white-space:nowrap;font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-select-input__span::-webkit-scrollbar{width:0;height:0}
.zoom-select-input__span:focus{outline:none}
.zoom-select-input__span.is-placeholder{color:#686F79}
.zoom-select-input__span.is-disabled{color:#ADB1B8}
.zoom-select-input__chevron{position:absolute;top:50%;right:9px}
.zoom-select-input.is-disabled{border-color:rgb(173 177 184 / .25);cursor:not-allowed}
.zoom-select-input.is-errored{border-color:#FF6682}
.zoom-select{position:relative;display:inline-block;background-color:#FFF}
.zoom-select__leading{position:absolute;top:50%;left:9px;display:flex;height:14px;color:#686F79;font-size:14px;transform:translateY(-50%)}
.zoom-select__leading.is-disabled{color:#ADB1B8}
.zoom-select__list{margin:11px;padding:0;outline:0}
.zoom-select__list.is-no-data{height:0;margin:0}
.zoom-select__empty{padding:12px;color:#686F79;outline:0;font-size:14px;text-align:center}
.zoom-select-option{display:flex;align-items:center;min-height:32px;padding:6px 8px;border-radius:8px;outline:none;outline-offset:2px;text-align:left;cursor:pointer}
.zoom-select-option:hover:not(.is-disabled){background-color:rgb(110 118 128 / .12)}
.zoom-select-option .is-clipped{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.zoom-select-option .is-clipped:after{content:"";display:block}
.zoom-select-option .zoom-checkbox{display:block}
.zoom-select-option .zoom-checkbox .zoom-checkbox__wrap{display:flex}
.zoom-select-option .zoom-checkbox .zoom-checkbox__wrap .zoom-checkbox__label,.zoom-select-option__checkbox-content{flex:1;min-width:0}
.zoom-select-option__checkbox-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.zoom-select-option__content{flex:1;color:#222325;font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-select-option__desc{color:#686F79}
.zoom-select-option__helper-icon{margin-left:8px}
.zoom-select-option.is-sibling-selected{padding-right:32px}
.zoom-select-option.is-disabled{color:#ADB1B8;cursor:not-allowed}
.zoom-select-option.is-disabled .zoom-select-option__content,.zoom-select-option.is-disabled .zoom-select-option__desc{color:#ADB1B8}
.zoom-select-option__checkmark{margin-left:8px;color:#222325;font-size:16px}
.is-vue3-keyboard-event .zoom-select-option:focus{outline:2px solid #4B96F1}
.zoom-virtual-filter-select__prepend-select .zoom-select-input{border-right:none;border-top-right-radius:0;border-bottom-right-radius:0}
.zoom-form-item__widgets>.zoom-select{vertical-align:middle}
.zoom-pagination__sizes .zoom-select{width:160px}

/* ==== .zoom-virtual-filter-select* (Time Zone, Template, Duration-min) ==== */
.zoom-virtual-filter-select-input{position:relative;box-sizing:border-box;border:1px solid #C1C6CE;border-radius:12px;cursor:pointer}
.zoom-virtual-filter-select-input:hover:not(.is-focusing,.is-disabled){background-color:rgb(110 118 128 / .12)}
.zoom-virtual-filter-select-input:hover:not(.is-focusing,.is-disabled) .zoom-virtual-filter-select-input__inner::placeholder{color:#5E646D}
.zoom-virtual-filter-select-input.is-focusing:not(.is-disabled){border-color:#4B96F1}
.zoom-virtual-filter-select-input.is-focusing:not(.is-disabled):after{content:"";position:absolute;top:-1px;right:-1px;bottom:-1px;left:-1px;border:2px solid #4B96F1;border-radius:inherit;pointer-events:none}
.zoom-virtual-filter-select-input.is-focusing:not(.is-disabled).is-errored{border-color:#FF6682}
.zoom-virtual-filter-select-input.is-focusing:not(.is-disabled).is-errored:after{border-color:#FF6682}
.zoom-virtual-filter-select-input.is-errored{border-color:#FF6682}
.zoom-virtual-filter-select-input__wrapper{position:relative;display:flex;flex-wrap:wrap;align-items:center;overflow-x:hidden;overflow-y:auto;padding:5px 31px 5px 11px;font-size:14px;line-height:1}
.zoom-virtual-filter-select-input__inner{display:inline-block;flex-grow:1;align-self:end;width:1%;height:20px;border:none;background-color:transparent;color:#222325;outline:0;font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-virtual-filter-select-input__inner::placeholder{color:#686F79;font-size:14px}
.zoom-virtual-filter-select-input__inner:focus{outline:none}
.zoom-virtual-filter-select-input__inner.is-disabled{color:#ADB1B8;cursor:not-allowed}
.zoom-virtual-filter-select-input__inner.is-disabled::placeholder{color:#ADB1B8}
.zoom-virtual-filter-select-input__chevron{position:absolute;top:50%;right:9px}
.zoom-virtual-filter-select-input.is-disabled{border-color:rgb(173 177 184 / .25);cursor:not-allowed}
.zoom-virtual-filter-select-option{display:flex;align-items:center;min-height:32px;padding:6px 8px;border-radius:8px;outline:none;outline-offset:2px;text-align:left;cursor:pointer}
.zoom-virtual-filter-select-option:hover:not(.is-disabled){background-color:rgb(110 118 128 / .12)}
.zoom-virtual-filter-select-option .is-clipped{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.zoom-virtual-filter-select-option .is-clipped:after{content:"";display:block}
.zoom-virtual-filter-select-option__content{flex:1;color:#222325;font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-virtual-filter-select-option__desc{color:#686F79}
.zoom-virtual-filter-select-option.is-sibling-selected{padding-right:32px}
.zoom-virtual-filter-select-option.is-disabled{color:#ADB1B8;cursor:not-allowed}
.zoom-virtual-filter-select-option.is-disabled .zoom-virtual-filter-select-option__content,.zoom-virtual-filter-select-option.is-disabled .zoom-virtual-filter-select-option__desc{color:#ADB1B8}
.zoom-virtual-filter-select-option__checkmark{margin-left:8px;color:#222325;font-size:16px}
.is-vue3-keyboard-event .zoom-virtual-filter-select-option:focus{outline:2px solid #4B96F1}
.zoom-virtual-filter-select{position:relative;display:inline-block}
.zoom-virtual-filter-select__list{margin:11px;padding:0;outline:0}
.zoom-virtual-filter-select__list.is-no-margin{margin-top:0;margin-bottom:0}
.zoom-virtual-filter-select__list.is-no-margin-bottom{margin-bottom:0}
.zoom-virtual-filter-select__empty{padding:12px;color:#686F79;outline:0;font-size:14px;text-align:center}
.zoom-virtual-filter-select__empty-inner{display:inline-block;text-align:center}
.zoom-form-item__widgets>.zoom-virtual-filter-select{vertical-align:middle}

/* ==== .zoom-calendar-filter-select* (start time) ==== */
.zoom-calendar-filter-select-input{position:relative;box-sizing:border-box;border:1px solid #C1C6CE;border-radius:12px;cursor:pointer}
.zoom-calendar-filter-select-input:hover:not(.is-focusing,.is-disabled){background-color:rgb(110 118 128 / .12)}
.zoom-calendar-filter-select-input:hover:not(.is-focusing,.is-disabled) .zoom-calendar-filter-select-input__inner::placeholder{color:#5E646D}
.zoom-calendar-filter-select-input.is-focusing:not(.is-disabled){border-color:#4B96F1}
.zoom-calendar-filter-select-input.is-focusing:not(.is-disabled):after{content:"";position:absolute;top:-1px;right:-1px;bottom:-1px;left:-1px;border:2px solid #4B96F1;border-radius:inherit;pointer-events:none}
.zoom-calendar-filter-select-input.is-focusing:not(.is-disabled).is-errored{border-color:#FF6682}
.zoom-calendar-filter-select-input.is-focusing:not(.is-disabled).is-errored:after{border-color:#FF6682}
.zoom-calendar-filter-select-input.is-disabled{border-color:rgb(173 177 184 / .25);cursor:not-allowed}
.zoom-calendar-filter-select-input.is-errored{border-color:#FF6682}
.zoom-calendar-filter-select-input__wrapper{position:relative;display:flex;flex-wrap:wrap;align-items:center;overflow-x:hidden;overflow-y:auto;padding:5px 31px 5px 11px;font-size:14px;line-height:1}
.zoom-calendar-filter-select-input__inner{display:inline-block;flex-grow:1;width:1%;height:20px;border:none;background-color:transparent;color:#222325;outline:0;font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-calendar-filter-select-input__inner::placeholder{color:#686F79;font-size:14px}
.zoom-calendar-filter-select-input__inner:focus{outline:none}
.zoom-calendar-filter-select-input__inner.is-disabled{color:#ADB1B8;cursor:not-allowed}
.zoom-calendar-filter-select-input__inner.is-disabled::placeholder{color:#ADB1B8}
.zoom-calendar-filter-select-input__chevron{position:absolute;top:50%;right:9px}
.zoom-calendar-filter-select-option{position:relative;display:flex;align-items:center;min-height:32px;padding:6px 8px;border-radius:8px;outline:none;outline-offset:2px;text-align:left;cursor:pointer}
.zoom-calendar-filter-select-option:hover:not(.is-disabled){background-color:rgb(110 118 128 / .12)}
.zoom-calendar-filter-select-option .is-virtual-focusing{outline:2px solid #4B96F1;outline-offset:2px}
.zoom-calendar-filter-select-option .is-clipped{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.zoom-calendar-filter-select-option .is-clipped:after{content:"";display:block}
.zoom-calendar-filter-select-option.is-created{margin:-8px 8px 8px}
.zoom-calendar-filter-select-option.is-virtual-focusing,.zoom-calendar-filter-select-option.is-virtual-focusing:hover{background-color:rgb(10 10 10 / .12)}
.zoom-calendar-filter-select-option.is-virtual-focusing:after{content:"";position:absolute;top:6px;left:-8px;width:2px;height:calc(100% - 12px);border-radius:2px;background-color:#4B96F1}
.zoom-calendar-filter-select-option__content{flex:1;color:#222325;font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-calendar-filter-select-option__content.is-view-all{color:#0D6BDE}
.zoom-calendar-filter-select-option__desc{color:#686F79}
.zoom-calendar-filter-select-option__helper-icon{margin-left:8px}
.zoom-calendar-filter-select-option.is-sibling-selected{padding-right:32px}
.zoom-calendar-filter-select-option.is-disabled{color:#ADB1B8;cursor:not-allowed}
.zoom-calendar-filter-select-option.is-disabled .zoom-calendar-filter-select-option__content,.zoom-calendar-filter-select-option.is-disabled .zoom-calendar-filter-select-option__desc{color:#ADB1B8}
.zoom-calendar-filter-select-option__checkmark{margin-left:8px;color:#222325;font-size:16px}
.is-vue3-keyboard-event .zoom-calendar-filter-select-option:focus{outline:2px solid #4B96F1}
.zoom-calendar-filter-select{position:relative;display:inline-block}
.zoom-calendar-filter-select__list{margin:11px;padding:0;outline:0}
.zoom-calendar-filter-select__list.is-no-margin{margin-top:0;margin-bottom:0}
.zoom-calendar-filter-select__list.is-no-data{height:0;margin:0}
.zoom-calendar-filter-select__empty{padding:12px;color:#686F79;outline:0;font-size:14px;text-align:center}
.zoom-calendar-filter-select__empty-inner{display:inline-block;text-align:center}

/* ==== .zoom-checkbox* ==== */
.zoom-checkbox{display:inline-flex;min-height:20px;font-size:inherit;line-height:1}
.zoom-checkbox .zoom-checkbox__suffix .zoom-button__inner-icon{color:#686F79}
.zoom-checkbox.is-indeterminate-container,.zoom-checkbox.is-has-region{flex-wrap:wrap}
.zoom-checkbox__mixed{position:absolute;width:16px;height:16px;margin:0;outline:none}
.zoom-checkbox__label{margin-left:8px;padding:1px 0}
.zoom-checkbox__wrap{position:relative;display:inline-flex;margin-bottom:0;outline:none;word-break:break-word;cursor:pointer;font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-checkbox__wrap:hover .zoom-checkbox__inner:not(.is-disabled){border-color:#939BA4;background-color:rgb(110 118 128 / .12)}
.zoom-checkbox__wrap:active .zoom-checkbox__inner:not(.is-disabled){border-color:#939BA4;background-color:rgb(110 118 128 / .42)}
.zoom-checkbox__wrap.is-indeterminate:not(.is-disabled):hover .zoom-checkbox__inner{border-color:#0C60C8;background-color:#0C60C8}
.zoom-checkbox__wrap.is-indeterminate:not(.is-disabled):active .zoom-checkbox__inner{border-color:#084085;background-color:#084085}
.zoom-checkbox__wrap.is-indeterminate .zoom-checkbox__inner{border-color:#0D6BDE;background-color:#0D6BDE}
.zoom-checkbox__wrap.is-indeterminate .zoom-checkbox__inner:before{content:"";position:absolute;top:6px;left:2px;width:10px;height:2px;border:1px solid #F7F9FA;border-radius:2px;background-color:#F7F9FA}
.zoom-checkbox__wrap.is-indeterminate .zoom-checkbox__inner .zoom-checkbox__knob{opacity:0}
.zoom-checkbox__wrap.is-indeterminate .zoom-checkbox__inner.is-disabled{border-color:#AACDF8;background-color:#AACDF8}
.zoom-checkbox__wrap.is-checked:not(.is-disabled):hover .zoom-checkbox__inner{border-color:#0C60C8;background-color:#0C60C8}
.zoom-checkbox__wrap.is-checked:not(.is-disabled):active .zoom-checkbox__inner{border-color:#084085;background-color:#084085}
.zoom-checkbox__wrap.is-checked .zoom-checkbox__inner{border-color:#0D6BDE;background-color:#0D6BDE}
.zoom-checkbox__wrap.is-checked .zoom-checkbox__knob{opacity:1}
.zoom-checkbox__wrap.is-checked.is-disabled .zoom-checkbox__inner{border-color:#AACDF8;background-color:#AACDF8}
.zoom-checkbox__wrap.is-disabled{color:#ADB1B8;cursor:not-allowed}
.zoom-checkbox__wrap.is-disabled .zoom-checkbox__inner{border-color:#ADB1B8;background-color:rgb(173 177 184 / .25);cursor:not-allowed}
.zoom-checkbox__inner{position:relative;top:2px;display:inline-block;flex:0 0 16px;width:16px;height:16px;border:1px solid #939BA4;border-radius:4px;cursor:pointer;transition:border-color .2s cubic-bezier(.71,-.46,.29,1.46),background-color .2s cubic-bezier(.71,-.46,.29,1.46)}
.zoom-checkbox__knob{position:absolute;top:-1px;left:1px;width:100%;height:100%;opacity:0;transform:rotate(45deg)}
.zoom-checkbox__knob:before{content:"";position:absolute;top:3px;left:7px;box-sizing:border-box;width:2px;height:9px;border:1px solid #F7F9FA;border-radius:2px;background-color:#F7F9FA}
.zoom-checkbox__knob:after{content:"";position:absolute;top:10px;left:4px;box-sizing:border-box;width:5px;height:2px;border:1px solid #F7F9FA;border-radius:2px;background-color:#F7F9FA}
.zoom-checkbox__original{position:absolute;z-index:-1;width:16px;height:16px;margin:0;outline:none;opacity:0}
.zoom-checkbox__region{width:100%;margin-top:8px;padding-left:22px}
.zoom-checkbox__description{width:100%;margin-top:4px;padding-left:22px;color:#686F79;font-weight:400;font-style:normal;font-size:12px;line-height:16px}
.zoom-checkbox__suffix{display:inline-flex;align-items:center;margin-left:4px}
.is-vue3-keyboard-event .zoom-checkbox .zoom-checkbox__original:focus+.zoom-checkbox__inner{outline:2px solid #4B96F1;outline-offset:2px}
.is-vue3-keyboard-event .zoom-checkbox .zoom-checkbox__mixed:focus~.zoom-checkbox__inner{outline:2px solid #4B96F1;outline-offset:2px}
.zoom-checkbox-group .zoom-checkbox{margin-right:24px}
.zoom-checkbox__title{margin-bottom:8px;color:#222325;font-weight:600;font-style:normal;font-size:14px;line-height:18px}
.zoom-checkbox-group.is-vertical .zoom-checkbox{display:flex;width:100%;margin-right:0}
.zoom-checkbox-group.is-vertical .zoom-checkbox+.zoom-checkbox{margin-top:8px}

/* ==== .zoom-radio* ==== */
.zoom-radio{display:inline-block;margin-right:32px;line-height:1}
.zoom-radio:last-child{margin-right:0}
.zoom-radio .zoom-radio__suffix .zoom-button__inner-icon{color:#686F79}
.zoom-radio__wrap{display:inline-flex;align-items:center;min-height:20px;cursor:pointer}
.zoom-radio__wrap:not(.is-disabled):hover .zoom-radio__inner{background-color:rgb(110 118 128 / .12)}
.zoom-radio__wrap:not(.is-disabled):active .zoom-radio__inner{background-color:rgb(110 118 128 / .42)}
.zoom-radio__wrap.is-checked:not(.is-disabled):hover .zoom-radio__inner{border-color:#0C60C8;background-color:#0C60C8}
.zoom-radio__wrap.is-checked:not(.is-disabled):active .zoom-radio__inner{border-color:#084085;background-color:#084085}
.zoom-radio__wrap.is-checked .zoom-radio__inner{border-color:#0D6BDE;background-color:#0D6BDE}
.zoom-radio__wrap.is-checked .zoom-radio__knob{transform:translate(-50%,-50%) scale(1)}
.zoom-radio__wrap.is-checked.is-disabled .zoom-radio__inner{border-color:#ADB1B8;background-color:#ADB1B8}
.zoom-radio__wrap.is-disabled{cursor:not-allowed}
.zoom-radio__wrap.is-disabled .zoom-radio__inner{border-color:#ADB1B8;background-color:rgb(173 177 184 / .25);cursor:not-allowed}
.zoom-radio__wrap.is-disabled .zoom-radio__label{color:#ADB1B8}
.zoom-radio__region{margin-top:8px;padding-left:24px}
.zoom-radio__description{margin-top:4px;padding-left:24px;color:#686F79;font-weight:400;font-style:normal;font-size:12px;line-height:16px}
.zoom-radio__label{flex:1;color:#222325;font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-radio__inner{position:relative;box-sizing:border-box;width:16px;height:16px;margin-right:8px;border:1px solid #939BA4;border-radius:100%;outline-offset:2px;cursor:pointer}
.zoom-radio__inner:hover{background-color:rgb(110 118 128 / .12)}
.zoom-radio__inner:active{background-color:rgb(110 118 128 / .42)}
.zoom-radio__knob{position:absolute;top:50%;left:50%;width:8px;height:8px;border-radius:100%;background-color:#FFF;transition:transform .15s ease-in;transform:translate(-50%,-50%) scale(0)}
.zoom-radio__suffix{display:inline-flex;align-items:center;margin-left:4px}
.is-vue3-keyboard-event .zoom-radio .zoom-radio__inner:focus{outline:2px solid #4B96F1}
.zoom-radio-group{line-height:1}
.zoom-radio-group.is-vertical>.zoom-radio{display:block;margin-right:0;margin-bottom:8px}
.zoom-radio__title{margin-bottom:8px;color:#222325;font-weight:600;font-style:normal;font-size:14px;line-height:18px}

/* ==== .zoom-button* ==== */
.zoom-button--sm .zoom-loading.is-inlined-in-button{border-radius:6px}
.zoom-button{position:relative;display:inline-flex;vertical-align:middle;justify-content:center;align-items:center;box-sizing:border-box;border:none;outline-offset:2px;font-family:inherit;white-space:nowrap;cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none;font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-button+.zoom-button{margin-left:8px}
.zoom-button--primary{font-weight:500;background-color:#0D6BDE;color:#FFF}
.zoom-button--primary:focus{color:#FFF;outline:none}
.zoom-button--primary:hover:not(.is-loading){background-color:#0C60C8;color:#FFF}
.zoom-button--primary:active:not(.is-loading){background-color:#084085;color:#FFF}
.zoom-button--secondary{background-color:#F1F4F6;color:#0D6BDE}
.zoom-button--secondary.zoom-button__icon{background-color:var(--zoom-color-fill-contrary-subtler-transparent);color:#222325}
.zoom-button--secondary.zoom-button__icon:focus{color:#222325;outline:none}
.zoom-button--secondary.zoom-button__icon:hover:not(.is-loading){background-color:rgb(110 118 128 / .12);color:#222325}
.zoom-button--secondary.zoom-button__icon:active:not(.is-loading){background-color:rgb(110 118 128 / .42);color:#222325}
.zoom-button--secondary:focus{color:#0D6BDE;outline:none}
.zoom-button--secondary:hover:not(.is-loading){background-color:rgb(110 118 128 / .12);color:#0C60C8}
.zoom-button--secondary:active:not(.is-loading){background-color:rgb(110 118 128 / .42);color:#084085}
.zoom-button--tertiary{background-color:transparent;color:#0D6BDE}
.zoom-button--tertiary:focus{color:#0D6BDE;outline:none}
.zoom-button--tertiary:hover:not(.is-loading){background-color:rgb(110 118 128 / .12);color:#0C60C8}
.zoom-button--tertiary:active:not(.is-loading){background-color:rgb(110 118 128 / .42);color:#084085}
.zoom-button--text{font-weight:400;background-color:transparent;color:#0D6BDE}
.zoom-button--text:focus{color:#0D6BDE;outline:none}
.zoom-button--text:hover:not(.is-loading){color:#0C60C8}
.zoom-button--text:active:not(.is-loading){color:#084085}
.zoom-button--text.is-pure-text{height:auto;padding:0;border:none;border-radius:4px}
.zoom-button--text.is-pure-text-small{font-size:12px;line-height:16px}
.zoom-button__inner-icon+.zoom-button__label{margin-left:4px}
.zoom-button__inner-icon+.zoom-button__label.is-visible-hidden{margin-right:0;margin-left:0;visibility:hidden}
.zoom-button__inner-icon.is-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}
.zoom-button--md{height:32px;padding:6px 14px;border-radius:12px;font-size:14px}
.zoom-button--md .zoom-button__inner-icon{font-size:14px}
.zoom-button--md.zoom-button__icon .zoom-button__inner-icon{font-size:16px}
.zoom-button--md.zoom-button--tertiary{padding:6px 8px}
.zoom-button--sm{height:24px;line-height:16px;padding:2px 10px;border-radius:999px;font-size:12px}
.zoom-button--sm .zoom-button__inner-icon{font-size:12px}
.zoom-button--sm.zoom-button__icon .zoom-button__inner-icon{font-size:14px}
.zoom-button--sm.zoom-button--tertiary{padding:2px 8px}
.zoom-button__icon{padding:0}
.zoom-button__icon.zoom-button--tertiary{background-color:transparent;color:#555B62}
.zoom-button__icon.zoom-button--tertiary:focus{color:#555B62;outline:none}
.zoom-button__icon.zoom-button--tertiary:hover:not(.is-loading){background-color:rgb(110 118 128 / .12);color:#555B62}
.zoom-button__icon.zoom-button--tertiary:active:not(.is-loading){background-color:rgb(110 118 128 / .42);color:#555B62}
.zoom-button__icon.zoom-button--md{width:32px;height:32px;padding:0;border-radius:100%;font-size:16px}
.zoom-button__icon.zoom-button--sm{width:24px;height:24px;padding:0;border-radius:100%;font-size:14px}
.zoom-button.is-primary-disabled{cursor:not-allowed;background-color:rgb(173 177 184 / .25);color:#ADB1B8}
.zoom-button.is-primary-disabled:focus{color:#ADB1B8;outline:none}
.zoom-button.is-primary-disabled:hover:not(.is-loading){background-color:rgb(173 177 184 / .25);color:#ADB1B8}
.zoom-button.is-primary-disabled:active:not(.is-loading){background-color:rgb(173 177 184 / .25);color:#ADB1B8}
.zoom-button.is-secondary-disabled{cursor:not-allowed;background-color:rgb(173 177 184 / .25);color:#ADB1B8}
.zoom-button.is-secondary-disabled:focus{color:#ADB1B8;outline:none}
.zoom-button.is-secondary-disabled:hover:not(.is-loading){background-color:rgb(173 177 184 / .25);color:#ADB1B8}
.zoom-button.is-secondary-disabled:active:not(.is-loading){background-color:rgb(173 177 184 / .25);color:#ADB1B8}
.zoom-button.is-tertiary-disabled{cursor:not-allowed;background-color:transparent;color:#ADB1B8}
.zoom-button.is-tertiary-disabled:focus{color:#ADB1B8;outline:none}
.zoom-button.is-tertiary-disabled:hover:not(.is-loading){background-color:transparent;color:#ADB1B8}
.zoom-button.is-tertiary-disabled:active:not(.is-loading){background-color:transparent;color:#ADB1B8}
.zoom-button.is-text-disabled{cursor:not-allowed;background-color:transparent;color:#ADB1B8}
.zoom-button.is-text-disabled:focus{color:#ADB1B8;outline:none}
.zoom-button.is-text-disabled:hover:not(.is-loading){color:#ADB1B8}
.zoom-button.is-text-disabled:active:not(.is-loading){color:#ADB1B8}
.zoom-button.is-loading{cursor:not-allowed}
.is-vue3-keyboard-event .zoom-button:focus{outline:2px solid #4B96F1}
.zoom-radio .zoom-radio__suffix .zoom-button__inner-icon{color:#686F79}
.zoom-radio__suffix .zoom-button__icon.zoom-button--sm{width:20px;height:20px;border-radius:4px}
.zoom-checkbox .zoom-checkbox__suffix .zoom-button__inner-icon{color:#686F79}
.zoom-checkbox__suffix .zoom-button__icon.zoom-button--sm{width:20px;height:20px;border-radius:4px}
.zoom-form-item .zoom-form-item__label-suffix .zoom-button__inner-icon{color:#8E9194}
.zoom-form-item__label-suffix .zoom-button__icon.zoom-button--sm{width:16px;height:16px;border-radius:4px}
.zoom-date-panel__prev-btn .zoom-button+.zoom-button{margin:0}
.zoom-date-panel__next-btn .zoom-button+.zoom-button{margin:0}
.zoom-banner .zoom-button.zoom-banner--closable{position:absolute;top:13px;right:13px}
.zoom-banner.is-bleed .zoom-button.zoom-banner--closable{top:14px;right:14px}

/* ==== .zoom-date* (date input / panel / table / month table) ==== */
.zoom-date-table{table-layout:fixed;font-size:14px}
.zoom-date-table th{color:#686F79;font-weight:400;text-align:center}
.zoom-date-table th:last-child .zoom-date-table__cell{margin-right:0}
.zoom-date-table td{padding:0;color:#222325;outline:none}
.zoom-date-table td:last-child .zoom-date-table__cell{margin-right:0}
.zoom-date-table td.current .zoom-date-table__cell,.zoom-date-table td.select-date .zoom-date-table__cell{border:1px solid #A8CCF8;background-color:var(--zoom-color-component-toggle-button-background-selected);color:#0D6BDE;font-weight:600}
.zoom-date-table td.prev-month .zoom-date-table__cell,.zoom-date-table td.next-month .zoom-date-table__cell{color:#686F79}
.zoom-date-table td.disabled .zoom-date-table__cell{color:#ADB1B8;cursor:not-allowed}
.zoom-date-table__cell{position:relative;width:32px;height:32px;border:1px solid transparent;border-radius:999px;font-weight:400;font-size:14px;line-height:30px;cursor:pointer}
.zoom-date-table__cell:focus{outline:none}
.zoom-date-table__cell span{position:relative}
.is-vue3-keyboard-event .zoom-date-table td .zoom-date-table__cell:focus:after{content:"";position:absolute;top:-4px;right:-4px;bottom:-4px;left:-4px;border:2px solid #4B96F1;border-radius:2px;pointer-events:none}
.is-vue3-keyboard-event .zoom-date-table.is-show-weeks td .zoom-date-table__cell:focus:after{top:-2px;right:-2px;bottom:-2px;left:-2px}
.zoom-month-table{table-layout:fixed;font-size:14px}
.zoom-month-table td{padding:0;color:#222325;outline:none}
.zoom-month-table td.today:not(.current){color:#FFF}
.zoom-month-table td.today:not(.current) .zoom-month-table__cell{background-color:#0D6BDE}
.zoom-month-table td.today:not(.current) .zoom-month-table__cell:hover{background-color:#0C60C8}
.zoom-month-table td.available:not(.current,.today) .zoom-month-table__cell:hover{background-color:rgb(110 118 128 / .12)}
.zoom-month-table td.current .zoom-month-table__cell{border:1px solid #A8CCF8;background-color:var(--zoom-color-component-toggle-button-background-selected);color:#0D6BDE;font-weight:600}
.zoom-month-table td.next .zoom-month-table__cell,.zoom-month-table td.prev .zoom-month-table__cell{color:#686F79}
.zoom-month-table td.disabled .zoom-month-table__cell{color:#ADB1B8;cursor:not-allowed}
.zoom-month-table td:last-child .zoom-month-table__cell{margin-right:0}
.zoom-month-table__cell{width:54px;height:32px;margin:16px 40px 0 0;border:1px solid transparent;border-radius:999px;outline:none;font-weight:400;font-size:14px;line-height:30px;cursor:pointer}
.zoom-month-table__cell:focus{outline:none}
.zoom-month-table__cell span{position:relative}
.is-vue3-keyboard-event .zoom-month-table td .zoom-month-table__cell:focus{outline:2px solid #4B96F1;outline-offset:2px}
.zoom-date-panel{position:relative}
.zoom-date-panel__body{position:relative;width:278px;padding:15px;text-align:center}
.zoom-date-panel__header{height:24px}
.zoom-date-panel__prev-btn{float:left}
.zoom-date-panel__prev-btn .zoom-button+.zoom-button{margin:0}
.zoom-date-panel__next-btn{float:right}
.zoom-date-panel__next-btn .zoom-button+.zoom-button{margin:0}
.zoom-date-panel__header-label{display:inline-block;padding:0 2px;color:#222325;outline:none;font-weight:600;font-size:14px;line-height:24px}
.zoom-date-panel__header-label-btn{border-radius:4px;cursor:pointer}
.zoom-date-panel__header-label-btn:hover{background-color:rgb(110 118 128 / .12)}
.is-vue3-keyboard-event .zoom-date-panel .zoom-date-panel__header-label:focus{border-radius:4px;outline:2px solid #4B96F1;outline-offset:2px}
.zoom-date-picker{position:relative;display:inline-block;width:240px}
.zoom-date-picker__calendar.zoom-icon{position:absolute;top:9px;right:10px;width:14px;height:14px;color:#555B62;font-size:14px}
.zoom-date-picker__popover .zoom-popover{max-width:700px;padding:0}
.zoom-date-input{display:flex;align-items:center;min-width:0;height:32px;padding:0 9px 0 11px;border:1px solid #C1C6CE;border-radius:12px;background-color:#FFF;outline:none;cursor:pointer}
.zoom-date-input:hover:not(.is-disabled){background-color:rgb(110 118 128 / .12)}
.zoom-date-input:hover:not(.is-disabled) .zoom-date-input__label.is-placeholder{color:#5E646D}
.zoom-date-input__label{display:flex;flex:1;align-items:center;overflow:hidden;min-width:0;color:#222325;text-overflow:ellipsis;white-space:nowrap;font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-date-input__label:focus{outline:none}
.zoom-date-input__label.is-placeholder{color:#686F79}
.zoom-date-input.is-disabled{border-color:rgb(173 177 184 / .25);cursor:not-allowed}
.zoom-date-input.is-disabled .zoom-date-picker__calendar,.zoom-date-input.is-disabled .zoom-date-input__label{color:#ADB1B8}

/* ==== .zoom-form-item* ==== */
.zoom-form-item{margin-bottom:16px}
.zoom-form-item:last-child{margin-bottom:0}
.zoom-form-item .zoom-form-item__label-suffix .zoom-button__inner-icon{color:#8E9194}
.zoom-form-item__label-wrapper{display:flex;align-items:center;margin-bottom:4px;line-height:1}
.zoom-form-item__label-wrapper.is-no-margin{margin-bottom:0}
.zoom-form-item__label-content{flex:1}
.zoom-form-item__widgets{line-height:1}
.zoom-form-item__widgets>.zoom-virtual-filter-select{vertical-align:middle}
.zoom-form-item__widgets>.zoom-select{vertical-align:middle}
.zoom-form-item__widgets>.zoom-filter-tree-select{vertical-align:middle}
.zoom-form-item__widgets>.zoom-tree-select{vertical-align:middle}
.zoom-form-item__label{color:#222325;font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-form-item__label-suffix{display:contents;font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-form-item__label-suffix .zoom-button__icon.zoom-button--sm{width:16px;height:16px;border-radius:4px}
.zoom-form-item__label-suffix-inner{width:0;margin-left:4px}
.zoom-form-item__asterisk{margin-left:4px;color:#DA1639;font-weight:400;font-style:normal;font-size:12px;line-height:16px}
.zoom-form-item__error{display:flex;margin-top:4px}
.zoom-form-item__error-icon.zoom-icon{margin-top:2px;color:#DA1639;font-size:12px}
.zoom-form-item__error-text{margin-left:4px;color:#DA1639;font-weight:400;font-style:normal;font-size:12px;line-height:16px}

/* ==== .zoom-banner* ==== */
.zoom-banner{position:relative;box-sizing:border-box;padding:16px;border:1px solid #A8CCF8;border-radius:12px;background-color:#F2F8FF;color:#222325;opacity:1;transition:opacity .3s}
.zoom-banner .zoom-button.zoom-banner--closable{position:absolute;top:13px;right:13px}
.zoom-banner.is-closable{padding-right:47px}
.zoom-banner.is-bleed{border:none;border-bottom:1px solid #A8CCF8;border-radius:0}
.zoom-banner.is-bleed.zoom-banner--success{border-bottom-color:#9ECEAD}
.zoom-banner.is-bleed.zoom-banner--warning{border-bottom-color:#E1BD93}
.zoom-banner.is-bleed .zoom-button.zoom-banner--closable{top:14px;right:14px}
.zoom-banner__main{display:flex;align-items:center;margin:0}
.zoom-banner--success{border:1px solid #9ECEAD;background-color:#F2FFF6;background-image:linear-gradient(rgb(255 255 255 / .4))}
.zoom-banner--warning{border:1px solid #E1BD93;background-color:#FFF9F2;background-image:linear-gradient(rgb(255 255 255 / .5))}
.zoom-banner__icon{align-self:self-start}
.zoom-banner__body{flex:1;margin-right:8px;margin-left:12px}
.zoom-banner__content{font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-banner-fade-enter-from,.zoom-banner-fade-leave-active{opacity:0}

/* ==== .zoom-floating / .zoom-popover* / .zoom-info-popover / .zoom-tooltip* ==== */
.zoom-floating{position:absolute;z-index:2000;min-width:10px;border:1px solid #DFE3E8;border-radius:12px;background-color:#FFF;color:#222325;box-shadow:0 12px 24px 0 rgb(0 0 0 / .08),0 6px 12px 0 rgb(0 0 0 / .08);font-size:14px}
.zoom-floating[data-side=right] .zoom-floating__arrow:after{left:-1px;border-top:0;border-right:0;border-bottom-left-radius:3px}
.zoom-floating[data-side=left] .zoom-floating__arrow:after{border-bottom:0;border-left:0;border-top-right-radius:3px}
.zoom-floating[data-side=top] .zoom-floating__arrow:after{border-top:0;border-left:0;border-bottom-right-radius:3px}
.zoom-floating[data-side=bottom] .zoom-floating__arrow:after{top:-1px;border-right:0;border-bottom:0;border-top-left-radius:3px}
.zoom-floating__arrow{position:absolute;width:14px;height:14px;pointer-events:none}
.zoom-floating__arrow:after{content:"";position:absolute;left:0;box-sizing:content-box;width:100%;height:100%;border:1px solid #DFE3E8;background-color:#FFF;transform:rotate(45deg)}
.zoom-floating.is-tooltip{border:none;border-radius:4px;background-color:var(--zoom-color-state-contrary-strong-transparent-hover);color:#FFF;box-shadow:0 4px 8px 0 rgb(0 0 0 / .08),0 2px 4px 0 rgb(0 0 0 / .08);-webkit-backdrop-filter:blur(15px);backdrop-filter:blur(15px)}
.zoom-tooltip{max-width:320px;padding:2px 6px;overflow-wrap:break-word;font-weight:400;font-style:normal;font-size:12px;line-height:16px}
.zoom-tooltip:focus{outline:none}
.zoom-tooltip-enter-active,.zoom-tooltip-leave-active{transition:opacity .2s cubic-bezier(.4,0,.2,1),transform .2s cubic-bezier(.4,0,.2,1);transform:scale(1)}
.zoom-tooltip-enter-from,.zoom-tooltip-leave-to{opacity:0;transform:scale(0)}
.zoom-info-popover{max-width:320px;padding:16px;border-radius:16px;overflow-wrap:break-word;font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-info-popover:focus{outline:none}
.zoom-info-popover__title{margin-bottom:4px;overflow-wrap:break-word;font-weight:600;font-style:normal;font-size:14px;line-height:18px}
.zoom-info-popover-enter-active,.zoom-info-popover-leave-active{transition:opacity .2s cubic-bezier(.4,0,.2,1),transform .2s cubic-bezier(.4,0,.2,1);transform:scale(1)}
.zoom-info-popover-enter-from,.zoom-info-popover-leave-to{opacity:0;transform:scale(0)}
.zoom-floating.is-popover-container{border-radius:16px}
.zoom-popover{position:relative;max-width:360px;padding:16px}
.zoom-popover--closable{position:absolute;top:16px;right:16px}
.zoom-popover__content{line-height:18px}
.zoom-popover__body.is-padding-for-close{padding-right:26px}
.zoom-popover__title{margin-bottom:4px;font-weight:600;font-style:normal;font-size:14px;line-height:18px}
.zoom-popover__title.is-padding-for-close{padding-right:26px}
.zoom-popover__actionable{margin-top:16px;text-align:right}
.zoom-floating.zoom-date-picker__popover{box-shadow:0 4px 8px 0 rgb(0 0 0 / .08),0 2px 4px 0 rgb(0 0 0 / .08)}
.zoom-date-picker__popover .zoom-popover{max-width:700px;padding:0}
.zoom-floating.vjs-progress-bar__engagement-tooltip{cursor:default;border:1px solid #DFE3E8;border-radius:16px;background-color:#FFF;color:#222325;box-shadow:0 12px 24px 0 rgb(0 0 0 / .08),0 6px 12px 0 rgb(0 0 0 / .08);-webkit-backdrop-filter:none;backdrop-filter:none}
.zoom-floating.vjs-progress-bar__engagement-tooltip .zoom-tooltip{box-sizing:border-box;max-width:360px;padding:16px;background-color:transparent}
.zoom-player .vjs-control-tooltip .zoom-tooltip,.zoom-player .vjs-multi-stream-tile-switch-tooltip .zoom-tooltip{white-space:nowrap}
.zoom-ai-citation__popover .zoom-popover{width:340px}
.zoom-ai-apps-menu__popover .zoom-popover{box-sizing:border-box;width:360px;padding:0;outline:none}
.zoom-ai-compose-modal__modal .zoom-popover{max-width:none!important;padding:0;border-radius:12px}
.zoom-ai-compose-modal__modal .zoom-popover .zoom-inline-icon-button.zoom-popover--closable{top:15px;right:16px;width:24px!important;height:24px!important;line-height:24px}
.zoom-ai-compose-modal__modal .zoom-popover .zoom-popover__title{padding:18px 50px 18px 16px;font-weight:700;font-style:normal;font-size:16px;line-height:20px}
.zoom-sticker-panel__popover .zoom-info-popover{padding:0}

/* ==== Transitions ==== */
.zoom-fade-in-linear-enter-active,.zoom-fade-in-linear-leave-active{transition:opacity .3s linear}
.zoom-fade-in-linear-enter-from,.zoom-fade-in-linear-leave-to{opacity:0}
.zoom-zoom-in-top-enter-active,.zoom-zoom-in-top-leave-active{opacity:1;transition:transform .3s cubic-bezier(.23,1,.32,1),opacity .3s cubic-bezier(.23,1,.32,1);transform:scaleY(1);transform-origin:center top}
.zoom-zoom-in-top-enter-active[data-side^=top],.zoom-zoom-in-top-leave-active[data-side^=top]{transform-origin:center bottom}
.zoom-zoom-in-top-enter-from,.zoom-zoom-in-top-leave-active{opacity:0;transform:scaleY(0)}
.fade-in-linear-enter-active .zoom-overlay-dialog{animation:fade-in-linear-in .3s}
.fade-in-linear-leave-active .zoom-overlay-dialog{animation:fade-in-linear-out .3s}
.fade-in-linear-enter-active{animation:modal-fade-in .3s}
.fade-in-linear-leave-active{animation:modal-fade-out .3s}

/* ==== .zoom-dialog / .zoom-overlay ==== */
.fade-in-linear-enter-active .zoom-overlay-dialog{animation:fade-in-linear-in .3s}
.fade-in-linear-leave-active .zoom-overlay-dialog{animation:fade-in-linear-out .3s}
.zoom-overlay{position:fixed;top:0;right:0;bottom:0;left:0;overflow:auto;height:100%;background-color:rgb(0 0 0 / .2)}
.zoom-overlay.is-transparent{background-color:transparent}
.zoom-dialog{position:relative;box-sizing:border-box;margin:auto;border-radius:32px;background-color:#FFF;box-shadow:0 12px 24px 0 rgb(0 0 0 / .08),0 6px 12px 0 rgb(0 0 0 / .08)}
.zoom-dialog.is-sm{width:448px}
.zoom-dialog.is-md{width:684px}
.zoom-dialog.is-lg{width:920px}
.zoom-dialog.is-fullscreen{overflow:auto;width:100%;height:100%;margin-top:0;margin-bottom:0;border-radius:0}
.zoom-dialog__header{padding:32px 32px 24px}
.zoom-dialog__close.zoom-button{position:absolute;top:28px;right:32px}
.zoom-dialog__title{padding-right:40px;color:#222325;overflow-wrap:break-word;font-weight:700;font-style:normal;font-size:20px;line-height:24px}
.zoom-dialog__body{padding:0 32px;color:#222325}
.zoom-dialog__body.is-lost-footer{margin:0 0 32px}
.zoom-dialog__footer{box-sizing:border-box;padding:32px;text-align:right}
.zoom-overlay-dialog{position:fixed;top:0;right:0;bottom:0;left:0;display:flex;overflow:auto}
.zoom-overlay-share-panel{position:fixed;top:0;left:0;display:flex;overflow:auto;width:100%;height:100%}

/* ==== .zoom-link / .zoom-inline-chevron-icon / .zoom-set-password-rules / .zoom-autocomplete ==== */
.zoom-inline-chevron-icon{color:#555B62;transition:transform .3s linear}
.zoom-inline-chevron-icon.is-expanded{transform:rotate(180deg)}
.zoom-inline-chevron-icon.is-transform-vertical-align{transform:translateY(-50%)}
.zoom-inline-chevron-icon.is-transform-vertical-align.is-expanded{transform:translateY(-50%) rotate(180deg)}
.zoom-inline-chevron-icon.is-disabled{color:#ADB1B8}
.zoom-link{display:inline-flex;align-items:center;padding:0;border-radius:4px;color:#0D6BDE;outline-offset:2px;text-decoration:none}
.zoom-link .zoom-link__arrow{margin-left:4px;color:#0D6BDE;font-size:14px}
.zoom-link:hover{color:#0C60C8;text-decoration:underline}
.zoom-link:hover .zoom-link__arrow{color:#0C60C8}
.zoom-link:active{color:#084085;text-decoration:underline}
.zoom-link:active .zoom-link__arrow{color:#084085}
.zoom-link--sm{font-weight:400;font-style:normal;font-size:12px;line-height:16px}
.zoom-link--sm .zoom-link__arrow{font-size:12px}
.zoom-link--md{font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-link--lg{font-weight:400;font-style:normal;font-size:16px;line-height:20px}
.zoom-link--lg .zoom-link__arrow{font-size:16px}
.zoom-link.is-disabled{color:#ADB1B8;cursor:not-allowed}
.zoom-link.is-disabled .zoom-link__arrow{color:#ADB1B8}
.is-vue3-keyboard-event .zoom-link:focus{outline:2px solid #4B96F1}
.zoom-autocomplete{position:relative;display:inline-block;line-height:1}
.zoom-autocomplete__menu.is-no-border{border:0}
.zoom-autocomplete__list{margin:11px;padding:0;outline:0}
.zoom-autocomplete__option{min-height:32px;padding:6px 8px;border-radius:8px;outline:none;outline-offset:2px;text-align:left;cursor:pointer;font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-autocomplete__option:hover{background-color:rgb(110 118 128 / .12)}
.zoom-autocomplete__option.is-truncated{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.zoom-autocomplete__option.is-truncated:after{content:"";display:block}
.is-vue3-keyboard-event .zoom-autocomplete__option:focus{outline:2px solid #4B96F1}
.zoom-set-password-rules__section.is-last-child{margin-top:4px}
.zoom-set-password-rules__title{margin-bottom:4px;color:#222325;font-weight:600;font-style:normal;font-size:14px;line-height:18px}
.zoom-set-password-rules__item{display:flex;align-items:center;color:#686F79;font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-set-password-rules__item-text{margin-left:4px}
.zoom-set-password-rules__item-text.is-succeed{color:#247F40}
.zoom-set-password-rules__item-text.is-failed{color:#DA1639}
.zoom-set-password-rules__icon.is-succeed{color:#247F40}
.zoom-set-password-rules__icon.is-failed{color:#DA1639}

/* ==== Schedule-page layout (index.DI6hobH1.css + per-row chunks, verbatim, data-v scopes removed) ==== */
.schedule-content{min-height:600px;word-break:break-word}
.schedule-content .zoom-form-item__row{display:flex;gap:10px;margin-bottom:25px}
.schedule-content .zoom-form-item__row .zoom-form-item__label-wrapper{width:160px;padding-top:4px;padding-bottom:4px;flex-shrink:0;align-items:start}
.schedule-content .zoom-form-item__row .zoom-form-item__widgets{flex:1}
.schedule-content .zoom-form-item__row .zoom-form-item__widgets .zoom-form-item__row .zoom-form-item__label-wrapper{width:auto}
.schedule-content .zoom-form-item__row .option-btn{padding-top:4px;padding-bottom:4px}
.schedule-content .long-width{width:490px!important}
.schedule-content .middle-long-width{width:260px!important}
.schedule-content .middle-width{width:150px!important}
.schedule-content .short-width{width:100px!important}
.schedule-content .free-tip{margin-left:170px;max-width:810px}
.schedule-content .zoom-banner.zoom-banner--warning{max-width:810px}
.schedule-content .when-date-select{z-index:1050!important}
.schedule-content .align-left{text-align:left}
.schedule-content .pt-sm{padding-top:4px}  .schedule-content .pb-sm{padding-bottom:4px}
.sticky-btn-wrapper{background-color:#fff;padding-top:24px;padding-bottom:24px}
.is-vue3-keyboard-event .schedule-content .zoom-sticky--fixed{visibility:hidden}
.content-wrap .back-link .zoom-link__inner{display:inline-flex;align-items:center;gap:5px}
/* small screens (<768px, inside @media): */
.schedule-content .zoom-form-item__row{display:block;margin-bottom:20px}
.schedule-content .zoom-form-item__row .zoom-form-item__label-wrapper{width:100%}
.agenda-btn{display:inline-flex;align-items:center;gap:5px}
.time-select-view{display:inline-block;height:32px}
.time-select-view .zoom-calendar-filter-select-input__wrapper{padding:5px 7px}
.when-item-widget{display:flex;flex-wrap:wrap;gap:8px}
.duration-item-widget{display:flex;align-items:center}
.duration-item-widget .zoom-form-item__error{display:none}
.recurrence-summary{display:inline-flex;flex-wrap:wrap;line-height:24px}
.recurrence-text{font-weight:700}
.recurring-end-data,.recurring-end-data .zoom-form-item__row{margin-bottom:0!important}
.recurring-end-data .zoom-radio-group{display:flex;flex-wrap:wrap;row-gap:10px}
.recurring-form-item .zoom-form-item__label-wrapper{width:160px!important}
.recurring-form-item .zoom-form-item__widgets,.recurring-form-item .end-date-radio{display:inline-flex;align-items:center}
.recurring-form-item .end-date-radio .zoom-radio__label{display:inline-flex;align-items:center;gap:3px}
.pmi-number{line-height:32px}
#security p.desc,#security .meeting-label{color:#686F79}
.passcode-wrapper{display:flex;align-items:baseline}
.encryption-item .icon{top:2px}
.sub-section{display:flex}
.jbh-wrapper{display:flex;align-items:center;flex-wrap:wrap}
.auto-rec-item{display:flex;align-items:center;flex-wrap:wrap}
.note-transcript-scope{margin-left:24px}
.option-desc{font-size:14px;font-weight:400;line-height:18px;color:#2a2b2d;margin-bottom:8px;margin-top:4px}
.select-user-container{width:100%;max-width:490px;max-height:350px}
.normal-user{height:40px;width:100%;display:flex;align-items:center;padding-right:8px}
.normal-user .email-name{padding:0 8px;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.search-item{display:flex;align-items:center;cursor:pointer;margin-bottom:3px}
.search-item .name{font-weight:400;color:#323539;font-size:14px;line-height:20px;overflow:hidden;text-overflow:ellipsis}
.search-item .email-name{color:#6e7680;font-size:12px;line-height:16px}
.search-item .txt-wrapper{flex:1;min-width:0;margin-left:8px;margin-right:8px}
.invite-email-warning{margin-top:8px}
.attendee-drop{width:490px!important}
.wb-label-desc{font-size:14px;line-height:18px;margin-left:16px;margin-bottom:0}
.wb-label-desc li{list-style:disc}
.add-interpreter{margin-left:-12px}

/* ==== Portal side menu (zoom-ui.DVS4344l.css fe-popups-* + app-side-menu + side-menu-free) ==== */
.fe-popups-side-menu__nav{padding:4px}
.fe-popups-side-menu__sub{padding-left:24px}
.fe-popups-side-menu__item-content{display:flex;align-items:center;min-height:32px;margin-bottom:4px;padding:6px 8px;border-radius:12px;color:#222325;outline-offset:2px;text-decoration:none;white-space:nowrap;cursor:pointer;user-select:none;font-weight:400;font-size:14px;line-height:18px}
.frame-side-menu .fe-popups-side-menu__item-content{flex-wrap:wrap;padding-top:3px;padding-bottom:3px}
.fe-popups-side-menu__item-content:hover{background-color:rgb(110 118 128 / .12);color:#222325}
.fe-popups-side-menu__item-content:active{background-color:rgb(110 118 128 / .42);color:#222325}
.fe-popups-side-menu__item-content.is-active{background-color:#F2F8FF;color:#0D6BDE}
.fe-popups-side-menu__item-content.is-title{margin-top:12px;cursor:text}
.fe-popups-side-menu__item-content.is-title:hover,.fe-popups-side-menu__item-content.is-title:active{background-color:transparent}
.fe-popups-side-menu__item-placeholder{width:16px;margin-right:8px}
.fe-popups-side-menu__item-label{flex:1;min-width:1px;white-space:initial;padding-top:4px;padding-bottom:4px}
.fe-popups-side-menu__item-badge{margin-left:8px}
.fe-popups-side-menu__item-icon-pop{margin-left:8px}
.fe-popups-side-menu__item-title{flex:1;color:#686F79;font-size:12px}
.fe-popups-side-menu__submenu-icon{width:16px;height:16px;margin-right:8px;transition:transform .3s ease-in-out;transform:rotate(-90deg)}
.fe-popups-side-menu__submenu-icon--expanded{transform:rotate(0)}
.is-vue3-keyboard-event .fe-popups-side-menu__item-content:focus{outline:2px solid #4B96F1}
.fe-popups-side-menu.frame-side-menu{background-color:transparent;width:100%!important;padding:0 4px 64px 0}
.fe-popups-badge__custom{display:inline-flex;align-items:center;gap:4px;max-height:16px;padding:0 4px;border:1px solid transparent;border-radius:999px;font-weight:500;font-size:10px;line-height:16px}
.fe-popups-badge__custom.is-blue{border-color:#A8CCF8;background-color:#F2F8FF;color:#2057B1}
.portal-side-menu-footer{text-align:center}
.side-upgrade-btn{border-radius:24px;border:1px solid #00f0ea;color:#0b5cff;background:linear-gradient(180deg,rgba(0,240,234,.25) 0%,rgba(0,240,234,.11) 100%)}
```

## Appendix B — full Time Zone option list (149, in menu order; `IANA id | label`)

```
1. Pacific/Midway | (GMT-11:00) Midway Island, Samoa
2. Pacific/Pago_Pago | (GMT-11:00) Pago Pago
3. Pacific/Honolulu | (GMT-10:00) Hawaii
4. America/Adak | (GMT-9:00) Aleutian Islands
5. America/Anchorage | (GMT-8:00) Alaska
6. America/Juneau | (GMT-8:00) Juneau
7. America/Vancouver | (GMT-7:00) Vancouver
8. America/Los_Angeles | (GMT-7:00) Pacific Time (US and Canada)   ← default for this account
9. America/Tijuana | (GMT-7:00) Tijuana
10. America/Phoenix | (GMT-7:00) Arizona
11. America/Mazatlan | (GMT-7:00) Mazatlan
12. America/Whitehorse | (GMT-7:00) Yukon
13. America/Edmonton | (GMT-6:00) Edmonton
14. America/Denver | (GMT-6:00) Mountain Time (US and Canada)
15. America/Regina | (GMT-6:00) Saskatchewan
16. America/Mexico_City | (GMT-6:00) Mexico City
17. America/Guatemala | (GMT-6:00) Guatemala
18. America/El_Salvador | (GMT-6:00) El Salvador
19. America/Managua | (GMT-6:00) Managua
20. America/Costa_Rica | (GMT-6:00) Costa Rica
21. America/Tegucigalpa | (GMT-6:00) Tegucigalpa
22. America/Chihuahua | (GMT-6:00) Chihuahua
23. America/Monterrey | (GMT-6:00) Monterrey
24. America/Winnipeg | (GMT-5:00) Winnipeg
25. America/Chicago | (GMT-5:00) Central Time (US and Canada)
26. America/Panama | (GMT-5:00) Panama
27. America/Bogota | (GMT-5:00) Bogota
28. America/Lima | (GMT-5:00) Lima
29. America/Eirunepe | (GMT-5:00) Acre
30. America/Montreal | (GMT-4:00) Montreal
31. America/New_York | (GMT-4:00) Eastern Time (US and Canada)
32. America/Indianapolis | (GMT-4:00) Indiana (East)
33. America/Puerto_Rico | (GMT-4:00) Puerto Rico
34. America/Caracas | (GMT-4:00) Caracas
35. America/La_Paz | (GMT-4:00) La Paz
36. America/Guyana | (GMT-4:00) Guyana
37. America/Halifax | (GMT-3:00) Halifax
38. America/Santiago | (GMT-3:00) Santiago
39. America/Montevideo | (GMT-3:00) Montevideo
40. America/Araguaina | (GMT-3:00) Recife
41. America/Argentina/Buenos_Aires | (GMT-3:00) Buenos Aires, Georgetown
42. America/Sao_Paulo | (GMT-3:00) Sao Paulo
43. Canada/Atlantic | (GMT-3:00) Atlantic Time (Canada)
44. America/St_Johns | (GMT-2:30) Newfoundland and Labrador
45. America/Noronha | (GMT-2:00) Fernando de Noronha
46. America/Godthab | (GMT-1:00) Greenland
47. Atlantic/Cape_Verde | (GMT-1:00) Cape Verde Islands
48. Atlantic/Azores | (GMT+0:00) Azores
49. UTC | (GMT+0:00) Universal Time UTC
50. Etc/Greenwich | (GMT+0:00) Greenwich Mean Time
51. Atlantic/Reykjavik | (GMT+0:00) Reykjavik
52. Africa/Casablanca | (GMT+0:00) Casablanca
53. Africa/Nouakchott | (GMT+0:00) Nouakchott
54. Europe/Dublin | (GMT+1:00) Dublin
55. Europe/London | (GMT+1:00) London
56. Europe/Lisbon | (GMT+1:00) Lisbon
57. Africa/Bangui | (GMT+1:00) West Central Africa
58. Africa/Algiers | (GMT+1:00) Algiers
59. Africa/Tunis | (GMT+1:00) Tunis
60. Europe/Belgrade | (GMT+2:00) Belgrade, Bratislava, Ljubljana
61. CET | (GMT+2:00) Sarajevo, Skopje, Zagreb
62. Europe/Oslo | (GMT+2:00) Oslo
63. Europe/Copenhagen | (GMT+2:00) Copenhagen
64. Europe/Brussels | (GMT+2:00) Brussels
65. Europe/Berlin | (GMT+2:00) Amsterdam, Berlin, Rome, Stockholm, Vienna
66. Europe/Amsterdam | (GMT+2:00) Amsterdam
67. Europe/Rome | (GMT+2:00) Rome
68. Europe/Stockholm | (GMT+2:00) Stockholm
69. Europe/Vienna | (GMT+2:00) Vienna
70. Europe/Luxembourg | (GMT+2:00) Luxembourg
71. Europe/Paris | (GMT+2:00) Paris
72. Europe/Zurich | (GMT+2:00) Zurich
73. Europe/Madrid | (GMT+2:00) Madrid
74. Africa/Harare | (GMT+2:00) Harare, Pretoria
75. Europe/Warsaw | (GMT+2:00) Warsaw
76. Europe/Prague | (GMT+2:00) Prague Bratislava
77. Europe/Budapest | (GMT+2:00) Budapest
78. Africa/Tripoli | (GMT+2:00) Tripoli
79. Africa/Johannesburg | (GMT+2:00) Johannesburg
80. Africa/Khartoum | (GMT+2:00) Khartoum
81. Europe/Helsinki | (GMT+3:00) Helsinki
82. Africa/Nairobi | (GMT+3:00) Nairobi
83. Europe/Sofia | (GMT+3:00) Sofia
84. Europe/Istanbul | (GMT+3:00) Istanbul
85. Europe/Athens | (GMT+3:00) Athens
86. Europe/Bucharest | (GMT+3:00) Bucharest
87. Asia/Nicosia | (GMT+3:00) Nicosia
88. Asia/Beirut | (GMT+3:00) Beirut
89. Asia/Damascus | (GMT+3:00) Damascus
90. Asia/Jerusalem | (GMT+3:00) Jerusalem
91. Asia/Amman | (GMT+3:00) Amman
92. Africa/Cairo | (GMT+3:00) Cairo
93. Europe/Moscow | (GMT+3:00) Moscow
94. Asia/Baghdad | (GMT+3:00) Baghdad
95. Asia/Kuwait | (GMT+3:00) Kuwait
96. Asia/Riyadh | (GMT+3:00) Riyadh
97. Asia/Bahrain | (GMT+3:00) Bahrain
98. Asia/Qatar | (GMT+3:00) Qatar
99. Asia/Aden | (GMT+3:00) Aden
100. Africa/Djibouti | (GMT+3:00) Djibouti
101. Africa/Mogadishu | (GMT+3:00) Mogadishu
102. Europe/Kiev | (GMT+3:00) Kyiv
103. Europe/Minsk | (GMT+3:00) Minsk
104. Europe/Chisinau | (GMT+3:00) Chisinau
105. Asia/Tehran | (GMT+3:30) Tehran
106. Asia/Dubai | (GMT+4:00) Dubai
107. Asia/Muscat | (GMT+4:00) Muscat
108. Asia/Baku | (GMT+4:00) Baku, Tbilisi, Yerevan
109. Asia/Kabul | (GMT+4:30) Kabul
110. Asia/Yekaterinburg | (GMT+5:00) Yekaterinburg
111. Asia/Tashkent | (GMT+5:00) Islamabad, Karachi, Tashkent
112. Asia/Almaty | (GMT+5:00) Astana, Almaty
113. Asia/Calcutta | (GMT+5:30) India
114. Asia/Kolkata | (GMT+5:30) Mumbai, Kolkata, New Delhi
115. Asia/Colombo | (GMT+5:30) Colombo
116. Asia/Kathmandu | (GMT+5:45) Kathmandu
117. Asia/Dacca | (GMT+6:00) Dacca
118. Asia/Dhaka | (GMT+6:00) Dhaka
119. Asia/Rangoon | (GMT+6:30) Rangoon
120. Asia/Novosibirsk | (GMT+7:00) Novosibirsk
121. Asia/Krasnoyarsk | (GMT+7:00) Krasnoyarsk
122. Asia/Bangkok | (GMT+7:00) Bangkok
123. Asia/Saigon | (GMT+7:00) Vietnam
124. Asia/Jakarta | (GMT+7:00) Jakarta
125. Asia/Irkutsk | (GMT+8:00) Irkutsk, Ulaanbaatar
126. Asia/Shanghai | (GMT+8:00) Beijing, Shanghai
127. Asia/Hong_Kong | (GMT+8:00) Hong Kong SAR
128. Asia/Taipei | (GMT+8:00) Taipei
129. Asia/Kuala_Lumpur | (GMT+8:00) Kuala Lumpur
130. Asia/Singapore | (GMT+8:00) Singapore
131. Australia/Perth | (GMT+8:00) Perth
132. Asia/Yakutsk | (GMT+9:00) Yakutsk
133. Asia/Seoul | (GMT+9:00) Seoul
134. Asia/Tokyo | (GMT+9:00) Osaka, Sapporo, Tokyo
135. Australia/Darwin | (GMT+9:30) Darwin
136. Asia/Vladivostok | (GMT+10:00) Vladivostok
137. Pacific/Port_Moresby | (GMT+10:00) Guam, Port Moresby
138. Australia/Brisbane | (GMT+10:00) Brisbane
139. Australia/Adelaide | (GMT+10:30) Adelaide
140. Australia/Sydney | (GMT+11:00) Canberra, Melbourne, Sydney
141. Australia/Hobart | (GMT+11:00) Hobart
142. Australia/Lord_Howe | (GMT+11:00) Lord Howe IsIand
143. Asia/Magadan | (GMT+11:00) Magadan
144. Pacific/Guadalcanal | (GMT+11:00) Solomon Islands
145. Pacific/Noumea | (GMT+11:00) New Caledonia
146. Asia/Kamchatka | (GMT+12:00) Kamchatka
147. Pacific/Fiji | (GMT+12:00) Fiji Islands, Marshall Islands
148. Pacific/Auckland | (GMT+13:00) Auckland, Wellington
149. Pacific/Apia | (GMT+13:00) Independent State of Samoa
```
