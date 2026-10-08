# 02 — Meetings (Workplace Meetings tab + Web-portal Meetings pages + Meeting detail)

Captured live on 2026-10-07 at a **1366×768** viewport (own browser tab; viewport emulation re-applied before every measurement batch). Prefix `mtg`.
Sources: `https://app.zoom.us/wc/meetings` (PWA 7.2.0.3239), `https://zoom.us/meeting#/…` (web portal "meeting-list" Vue app), PWA CSS (`scratchpad/zoomcss/main.css`), portal CSS (`scratchpad/mtg/*.css`), PWA/portal JS bundles (read in-page for render logic + i18n strings).

Legend: **[M]** measured from DOM/computed style/CSS/JS source · **[D]** derived/inferred.

> **How the "scheduled meeting" states were captured.** The account has no scheduled or past meetings. To see real Zoom rendering of scheduled items, notices, private meetings, recurring groups and the portal Previous list, I intercepted the *responses* of the list XHRs inside my own tab (`/wc/pwa-meeting/list`, `/rest/meeting/list`) and appended fake meetings. Nothing was sent to Zoom; no meeting was created/edited/deleted. **All styles, layout, class names, client-side strings and conditional logic in those states are [M]**; the *data values* (topics, numbers, and in the portal list the server-provided group titles like "Tue, Oct 6" and times like "03:00 PM") were mine and are marked [D] where the format matters.

---

## 1. Corrections to PRD.md

| PRD section | PRD says | Measured / found |
|---|---|---|
| §5.1 Fonts (Workplace) | `system-ui, "SF Pro", "Segoe UI", "Almaden Sans", …` | On `/wc/meetings` every element computes to `Emoji, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Liberation Sans", Arial, sans-serif` (an injected `body *{font-family:var(--emoji-font,Emoji), system-ui, …}` rule). `html` itself keeps the PRD stack. Visually identical on macOS (system-ui → SF Pro). [M] |
| §5.1 / general | (not stated) | The Workplace page runs a CSS reset (`html,body,div,span,…{margin:0;padding:0;border:0;font:inherit}` + `body{line-height:1}`), so **any text without an explicit line-height has line-height = font-size** (e.g. "Upcoming" 14px/14px, "No upcoming meetings" 14px/14px, "Add a calendar" 14px/14px, invitation `<pre>` 13px/13px). Reproduce with `line-height:1` on the Meetings container. [M] |
| §7.3 left column / divider | "1px divider `#EDEDF4`" between columns | Column divider is `div.meetings-container__v-divider`: **2px wide**, full height, `background:#7D7D8821` (= rgba(125,125,136,.13), ≈ `#EEEEEF` on white). The 1px `#EDEDF4` lines are the *horizontal* ones (PMI divider, group dividers, add-calendar divider). [M] |
| §7.3 header | title should become a segmented control | Zoom's "Upcoming" is a plain `<span>` (no click handler, no menu, not focusable). It is **not** a dropdown. Header is 360×46, padding 16, title centered; refresh button absolutely positioned `left:16px; top:50%; translateY(-50%)`. [M] (Segmented control stays a clone-only addition [D].) |
| §7.3 refresh | icon button 21×23 radius 4 padding 4, icon 13px `#000` | Confirmed. Add: bg `#FFF`, hover `#0000000F`, active `#0000004D`; **click is debounced 3000 ms** and replaces *both* panes with a 24px spinner until `/wc/pwa-meeting/list` returns (~360 ms). [M] |
| §7.3 PMI card | 328×78, radius 12, hover `#E7F1FD`, selected `#0E71EB` | Confirmed. Also: `<button>` with UA padding `1px 6px`, unselected bg `#FFF`; number 18/21 700 `#232333` + 4px gap + label 13/16 `#747487`. **PMI is selected by default only when there are no scheduled meetings**; after a list load with meetings, the **first meeting item is selected** (observed after refresh). [M] |
| §7.3 meeting item | line order "time, topic, Meeting ID"; hover/selected | Real order is **topic → (Private) → time → Host → Meeting ID**: topic 16/19 700 `#232333`; time `10:00 AM - 10:40 AM`; `Host: {hostName}` (shown for *every* non-PMI Zoom meeting, including your own; single-line ellipsis); `Meeting ID: 812 3456 7890`. Item 123px tall (320 wide when the list scrollbar is visible). [M] |
| §7.3 live badge | green "Live" pill after the time [D] | Zoom shows **no badge in the list**. Liveness/near-start appears only in the **detail time row** as ` \| ` + notice: `In Progress` (blue `#0E72ED`, server status), `Starts in {N} minutes` (blue, 30→2 min before), `Starts in 1 minute` (blue), `NOW` (red `#FD4C4C`, between start and end). Updated every 1 s. [M] |
| §7.3 group labels | "Today", "Tomorrow", "Wed, Oct 14" | Confirmed format `ddd, MMM D`; **different year adds `, YYYY`** ("Fri, Jan 15, 2027"). Recurring meetings with no fixed time go into a last group labelled **"Recurring"** and show no time line. Groups are separated by `meetings__groups-divider` (1px `#EDEDF4`, margin `0 36px`). [M] |
| §7.3 empty | "No upcoming meetings" 14px `rgba(4,4,19,.56)` | Confirmed: 14px/14px, flex-centered in the whole list area (360×408 at y=203). [M] |
| §7.3 Add a calendar | "keep text, make it open /meeting/schedule" | Zoom: `<a href="/profile?page_from=client" target="__blank">` (opens profile page in a new window) + **hover popover** (240 wide, top, arrow) "Connect to your work or personal calendar to view all upcoming meetings here". Footer is 360×34 (padding 10 0) under a full-width 1px `#EDEDF4` divider. Text/icon `#0E72ED` 14px/14px, icon 13px, gap 4. [M] |
| §7.3 right detail rows | rows "time · …", "Host: …", number | PMI detail shows **only topic + number** (no host, no time). Scheduled detail order: topic (24/29 700 `#39394D`, mb 32) → optional `Private 🔒` (14/20) → time row (13/16 `#232333`) with notice → `Host: {name}` → `Meeting ID: …`; each row margin `16px 0`. Time row has **no date** (date is conveyed by the list group). [M] |
| §7.3 buttons | Start/Copy Invitation/Edit/Delete (Delete label hover `#DA1639`) | Buttons: `z-button size-32` (h32, padding 0 20, radius 8, 14/20 **700**), row `margin:32px 0`, each `margin:0 16px 10px 0`, wraps. Start bg `#0E72ED` (hover/active = 9 % black overlay → ≈`#0D68D8`). Copy/Edit/Delete: bg `#FFF`, border 1px `#DFE3E8`, text `#131619`, 12px left icon; hover bg `#F7F9FA` text `#0E71EB` (Delete hover text **`#E02828`**); focus bg `#F1F4F6`. Delete icon is an **×**. Other-host meetings show only **Join**. [M] |
| §7.3 Edit | → `/meeting/{number}/edit` | Zoom calls `window.open("https://app.zoom.us/meeting/{number}/edit?from=pwa","_blank")`. [M] |
| §7.3 Delete | confirm "Delete this meeting?" | Real modal: 560 wide, header "Zoom" logo row + ×, title **"Delete Meeting"**, text "You can recover this meeting within 7 days from the **Recently Deleted** page on the Zoom web portal", buttons **Delete** (destructive `#DE2828`) + **Cancel** (secondary). Overlay `rgba(255,255,255,.75)`. Failure toast "Delete meeting failed". [M] |
| §7.3 copy feedback | tooltip "Copied to clipboard" [D] 2 s | Workplace: tooltip **"Copied!"** (58×24, white, border 1px `#DFE3E8`, radius 4, small shadow, 12px/16px `#2A2B2D`, 6px above the button, fade 300 ms) — stays until mouseleave/blur. Portal: toast **"Copied to clipboard"** (green success message, top-center, 3 s). [M] |
| §7.3 Show Meeting Invitation | 13px `#0E72ED` padding `1px 6px`; block 13px `#000` pre-wrap | Link: 13px, **line-height 8px** (box 157×10), margin `12px 0 16px`, hover underline `#0E71EB`; toggles to "Hide Meeting Invitation". Block: `<pre>` 13px/13px `#000`, `white-space:pre` (container `break-spaces`), no max-width (fills 874px), container flex-1 with internal scroll (6px scrollbar); spinner 24px (margin 10px 20px) while loading. [M] |
| §7.3 Previous tab | Workplace "Upcoming \| Previous" | Zoom Workplace has **no Previous view**. The portal (`zoom.us/meeting#/previous`) has it — spec in §B.6; use it as the visual source for "Recent meetings". [M] |
| §7.4.4 detail page | label grid **170px**, rows Topic, Description, Time, Meeting ID, Security, Invite Link (+Copy Invitation text button), Video, Options; Start/Edit/Delete (red label) | Portal detail uses **160px** label column (`zm-form-item__header` width 160, padding `4px 12px 4px 0`), content at +160, rows margin-bottom 20, labels 14px/24px `#131619`, values 14px/21px `#232333`. Rows: Topic, (Description), (Time), Meeting ID, Security (✓ Passcode ******** **Show**/Hide, ✓ waiting-room line), Invite Link (link + small **copy icon** "Copy the Link"), Add to (Google / Outlook .ics / Yahoo), divider, Encryption, My Notes, Video (Host on / Participant on), Options. **Sticky footer action bar**: Start · Copy Invitation (opens a dialog) · Edit · Delete · Save as Template. Delete is a neutral button; red only in the confirm dialog. [M] |
| §7.4.1 / portal | page bg white | Portal content column x=332, **w=987** (page has a 15px scrollbar). A dismissible 51px green marketing banner sits between header and content (omit). All portal text has **letter-spacing 0.42px**. [M] |
| §10.5 invitation | "Passcode" last line + one blank line | PMI invitation (Workplace) uses **CRLF** line endings and ends with `Passcode: <passcode>` followed by **three** CRLFs; no `Time:` line for PMI (matches PRD). [M] |
| /meeting/{bad} | (not specified) | `zoom.us/meeting/{nonexistent}` renders **"Invalid meeting ID. (3,001)"** 18px/25.7px `#232333` centered, top padding 50 (title "Error - Zoom"). `zoom.us/meeting/{PMI}` redirects to `/meeting#/pmi/{PMI}`. [M] |

---

## A. Workplace Meetings tab — `https://app.zoom.us/wc/meetings`

Screens: `mtg-01-meetings-tab-pmi.jpg`, `mtg-02…tooltip`, `mtg-03…invitation`, `mtg-04…popover`, `mtg-05…simulated-items`, `mtg-06…now-notice`, `mtg-07…delete-confirm`, `mtg-08…recurring-group`, `mtg-09…private`, `mtg-10…loading`.

### A.1 Structure

```
div.meetings-container#home-tabpanel-meetings [role=tabpanel, aria-labelledby=home-tab-meetings]   x80 y68 1280×578 (flex row, overflow hidden)
├─ div.meetings-container__left                       360×578  flex column, position relative
│  └─ div.meetings-container__left-tabs               flex column, height 100%
│     ├─ div.meetings-container__header               360×46  padding 16, flex center
│     │  ├─ button.meetings-container__left-header__refresh   (absolute, left 16, centered)
│     │  │   └─ i.zmicon[role=img aria-label="Refresh"] > svg 13×13
│     │  └─ span.meetings-container__header-title  "Upcoming"
│     └─ div.meetings-container__left-body            360×532 (flex 1)
│        └─ div.meetings                              flex column, height 100%
│           ├─ button.meetings__pmi[.meetings__pmi--selected]
│           │   ├─ p.meetings__pmi-number  "492 555 0101"
│           │   └─ p.meetings__pmi-txt     "My Personal Meeting ID (PMI)"
│           ├─ div.meetings__pmi-divider
│           ├─ (div.meetings__host-filter — only if ≥3 "schedule for" hosts)
│           ├─ div.meetings__groups#meetingsMeetingGroup [role=listbox tabindex=0]  (flex 1, height 0, overflow auto)
│           │   ├─ div.meetings__groups-empty "No upcoming meetings"      (when empty)
│           │   └─ per day: div.meetings__group
│           │        ├─ div.meetings__group-label  "Today"
│           │        └─ div.meetings__meeting-item[--selected] [role=option, tabindex 0|-1, aria-selected, data-select-id]
│           │             ├─ div.meetings__meeting-item-topic
│           │             ├─ span "Private"                     (private & !canViewDetail)
│           │             ├─ div.meetings__meeting-item-time
│           │             ├─ div.meetings__meeting-item-host.overflow-ellipsis-1  "Host: …"
│           │             └─ div.meetings__meeting-item-meeting-id  "Meeting ID: …"
│           │      div.meetings__groups-divider (between groups, not after last)
│           ├─ div.add-calendar__divider              (only when calendar not connected)
│           └─ div.add-calendar.add-calendar-meetings-panel > div.add-calendar__container > a.prism-Popover-trigger
│                 ├─ i.add-calendar__icon > svg 13×13
│                 └─ span.add-calendar__txt "Add a calendar"
├─ div.meetings-container__v-divider                  2×578
└─ div.meetings-container__right                      918×578
   └─ div.meetings__detail                             padding 48 4 40 40, flex column
      ├─ div#meetings-detail-info-aria-desc.meetings__detail-info
      │   ├─ div.meetings__detail-topic
      │   ├─ span.meetings__detail-private > span"Private" + i.black-lock-icon     (private only)
      │   ├─ div.meetings__detail-time > span time [+ span " | " + span.meetings__detail-time-notice[-now]]
      │   ├─ div.meetings__detail-host  "Host: …"
      │   └─ div.meetings__detail-number
      ├─ div.meetings__detail-btns
      │   ├─ button.z-button.z-button-size-32.z-button-type-normal.meetings__detail-btn-start  "Start"
      │   ├─ (button …meetings__detail-btn-join "Join")
      │   ├─ (button …tertiary.meetings__detail-btn-msg-channel)
      │   ├─ button …tertiary.prism-Tooltip-trigger.meetings__detail-btn-copy  [icon] "Copy Invitation"
      │   ├─ (button …secondary.meetings__detail-btn-view-onzoom "View Event")
      │   ├─ button …tertiary.meetings__detail-btn-edit  [icon] "Edit"
      │   └─ button#meetings-detail-btn-delete-aria …tertiary.meetings__detail-btn-delete [×] "Delete"
      └─ div.meetings__detail-invitation
          ├─ button.meetings__detail-invitation-link "Show Meeting Invitation" | "Hide Meeting Invitation"
          └─ div.meetings__detail-invitation-content > pre | i.z-loading
```
Container: `.meetings-container` sits in the white content card (`main-body-layout_appsContainer`: bg `#FFF`, radius 12, overflow hidden, 1280 wide). With Zoom's promo banner the card is 578 tall (y 68→646); **without the banner (our clone) the card is 694 tall** (68→762) [M for column 694, D for removing banner].

### A.2 Left column measurements [M]

| Element | Box (x,y,w,h) | Styles |
|---|---|---|
| `.meetings-container__left` | 80,68,360,578 | flex column, `position:relative`, `flex:0 0 auto`, width 360 |
| `.meetings-container__header` | 80,68,360,46 | `display:flex; align-items:center; justify-content:center; padding:16px; position:relative; flex:0 0 auto` |
| refresh button | 96,80,21,23 | `position:absolute; left:16px; top:50%; transform:translateY(-50%)`; bg `#FFF`; border none; radius 4; padding 4; font-size 13px (icon 13×13, color `#000`); cursor pointer. Hover bg `#0000000F`; active bg `#0000004D`. aria-label on icon: "Refresh" |
| title "Upcoming" | 225,84,70,14 | 14px/14px **700** `#131619` (`.meetings-container__header-title`); static text |
| `.meetings__pmi` | 96,114,328,78 | `display:flex; flex-direction:column; align-items:center; justify-content:center; height:78px; margin:0 16px; border:none; border-radius:12px; background:#FFF`; (UA padding `1px 6px`) |
| `.meetings__pmi-number` | 198,133,124,21 | 18px/21px **700** `#232333`, margin `0 0 4px` |
| `.meetings__pmi-txt` | 170,158,179,16 | 13px/16px 400 `#747487` |
| `.meetings__pmi-divider` | 116,192,288,1 | bg `#EDEDF4`, height 1, margin `0 36px 10px` |
| `.meetings__groups` | 80,203,360,408 | `flex:1 1 auto; height:0; overflow:auto; width:100%` |
| `.meetings__groups-empty` | 80,203,360,408 | flex center, 14px/14px `#0404138F` (rgba(4,4,19,.56)) |
| `.add-calendar__divider` | 80,611,360,1 | bg `#EDEDF4` |
| `.add-calendar` | 80,612,360,34 | flex center, padding `10px 0`, font 14px |
| link `a` | 203,622,114,14 | `href="/profile?page_from=client" target="__blank"`; color `#0D6BDE` (text spans override) |
| `.add-calendar__icon` | 203,623,13,13 | `#0E72ED`, font-size 13 |
| `.add-calendar__txt` | 220,621,97,17 | 14px/14px `#0E72ED`, margin-left 4; hover color unchanged `#0E72ED` |
| `.meetings-container__v-divider` | 440,68,2,578 | `background:#7D7D8821; width:2px; height:100%; flex:0 0 auto` |

**PMI card states [M CSS]**
| State | bg | number | label |
|---|---|---|---|
| default | `#FFF` | `#232333` | `#747487` |
| hover | `#E7F1FD` | same | same |
| selected (`--selected`, incl. hover) | `#0E71EB` | `#FFF` | `#FFF` |
| keyboard focus | global `:focus{outline:2px solid #2D8CFF; outline-offset:1px}`; suppressed for mouse (`[data-whatintent=mouse] :focus{outline:none!important}`) |
Click → selects PMI (dispatch select id). No transitions (computed `transition: all` 0s).

### A.3 Scheduled meeting list (rendered with injected data) [M]

| Element | Measured | CSS |
|---|---|---|
| group label | 96,203,320×40 | `color:#747487; font-size:13px; font-weight:700; line-height:16px; margin:0 16px; padding:12px 20px` (text x=116) |
| meeting item | 96,253,320×123 (328 wide when no scrollbar) | `border-radius:12px; color:#747487; font-size:13px; line-height:16px; margin:10px 16px; padding:8px 20px` (vertical margins collapse → 10px between items, first item 10px under label) |
| topic | 280×19 | `color:#232333; font-size:16px; font-weight:700; line-height:19px; overflow-wrap:break-word; margin:8px 0` — **wraps to multiple lines** (3 lines = 57px) |
| "Private" span | inline, 13/16 `#747487` | rendered between topic and time when `isPrivate && !canViewDetail` |
| time | 280×16 | 13/16 `#747487`, margin `8px 0`, e.g. `10:00 AM - 10:40 AM` (`h:mm A - h:mm A`; 24h users `H:mm - H:mm`) |
| host | 280×16 | `Host: {hostName}`, single-line ellipsis (`overflow:hidden; text-overflow:ellipsis; white-space:nowrap`) |
| meeting id | 280×16 | `Meeting ID: 812 3456 7890` (Webinars: `Webinar ID: …`; non-Zoom calendar events: "Not a Zoom meeting") |
| group divider | 116,785,280×1 | `.meetings__groups-divider{background:#EDEDF4;height:1px;margin:0 36px}` |

Item height: 8 pad + 8 + 19 + 8 + 16 + 8 + 16 + 8 + 16 + 8 + 8 pad = **123px**; 4-line rows stack with 10px gaps; groups: label 40 + items; divider sits 10px under the last item.

**Item states [M CSS]**: default transparent bg, text `#747487`/topic `#232333`; hover bg `#E7F1FD`; selected (and selected:hover) bg `#0E71EB`, all text `#FFF`. Click or Enter/Space selects (`onKeyDown` keyCode 13/32). Selected item gets `tabindex=0`, others `-1`; Up/Down move focus (Zoom a11y "LIST_ITEM_POLICY"). On mount, if the selected item's index > 1 the previous item is `scrollIntoView()`'d.

**Grouping & ordering [M JS]**: groups by local day of `startTime`; label: same day → `Today`; next day → `Tomorrow`; else `ddd, MMM D`; if year ≠ current year → `ddd, MMM D, YYYY`. Meetings of type Repeat (3) with `startTime 0` (no fixed time) → final group `Recurring`, no time line. The list request is `POST /wc/pwa-meeting/list?from=pwa&startTime={start of today, unix s}`; response items carry `topic, hostName, hostId, meetingNumber, duration, type (0 PreSchedule,1 Instant,2 Schedule,3 Repeat), exType (0 Normal,1 PMI,2 Webinar,3 Simulive), startTime (unix s), recurringType, canViewDetail, scheduleOptions*`.

**Scroll behaviour**: only `.meetings__groups` scrolls (PMI card and footer stay fixed). Scrollbar (WebKit): width 8px, track `#0000000F` radius 3 + `inset 0 0 5px #00000014`, thumb `#0000001F` radius 3 + `inset 0 0 10px #0003`. When the scrollbar shows, items shrink to 320 wide. [M]

### A.4 "Add a calendar" popover [M]
- Trigger: hover (prism Popover, `variant:simple`, `width:240`, placement top, arrow).
- Box: x140 y534 **240×80**, bg `#FFF`, border 1px `#DFE3E8`, radius **10**, shadow `0 12px 24px #00000014, 0 6px 12px #00000014`, z-index 1300; body padding 12; text centered 14px/18px 400 `#2A2B2D`: "Connect to your work or personal calendar to view all upcoming meetings here".
- Arrow 16×16 square rotated 45° (`matrix(.707,.707,-.707,.707,0,5.65)`), white, right/bottom borders 1px `#DFE3E8`, radius `50% 0 4px`; centered on the link. Popover bottom 8px above the link.
- Animation: `opacity 300ms cubic-bezier(0.4,0,0.2,1)`.
- Click: native link to `/profile?page_from=client` in a window named `__blank` (no JS). Clone [D]: keep text + popover; open `/meeting/schedule` or a static profile page.

### A.5 Right detail [M]

**PMI (default)** — `mtg-01`
| Element | Box | Style |
|---|---|---|
| `.meetings__detail` | 442,68,918×578 | `display:flex; flex-direction:column; padding:48px 4px 40px 40px` |
| topic "My Personal Meeting ID (PMI)" | 482,116,874×29 | 24px/29px **700** `#39394D`, margin-bottom 32 |
| number "492 555 0101" | 482,177,874×16 | 13px/16px 400 `#232333`, margin `16px 0` |
| `.meetings__detail-btns` | 482,241,874×42 | `display:flex; flex-wrap:wrap; margin:32px 0`; children `margin:0 16px 10px 0` |
| Start | 482,241,75×32 | `z-button-size-32` + `type-normal`: bg `#0E72ED`, text `#FFF` 14px/20px 700, padding `0 20px`, radius 8 |
| Copy Invitation | 573,241,162×32 | bg `#FFF`, border 1px `#DFE3E8`, text `#131619` 14/20 700; icon 12×12 at x594 (`mtg-meetings-copy.svg`), icon→text gap 4 |
| Edit | 751,241,85×32 | same as Copy; icon `mtg-meetings-edit.svg` 12px |
| `.meetings__detail-invitation` | 482,315,874×291 | `display:flex; flex-direction:column; align-items:flex-start; flex:1 1 auto` |
| "Show Meeting Invitation" | 482,327,157×10 | `<button>`: no bg/border, `#0E72ED`, 13px, **line-height 8px**, padding `1px 6px`, margin `12px 0 16px`, text-align center; hover `#0E71EB` + underline |

**Scheduled meeting (own)** — `mtg-05`, `mtg-06`
| Element | Box | Style / copy |
|---|---|---|
| topic | 482,116,874×29 (wraps) | 24/29 700 `#39394D`, mb 32 |
| time row `.meetings__detail-time` | 482,177 (spans y178 h15) | 13/16 `#232333`, margin `16px 0`: `<span>10:58 PM - 11:28 PM</span><span> \| </span><span class="meetings__detail-time-notice">…</span>` |
| notice (blue) | e.g. x618 | `.meetings__detail-time-notice{color:#0E72ED}` |
| notice NOW (red) | | `.meetings__detail-time-notice-now{color:#FD4C4C}` text "NOW" |
| host | 482,209 | `Host: {hostName}` 13/16 `#232333`, margin 16 0 |
| number | 482,241 | `Meeting ID: 812 3456 7891` |
| buttons | y305 | Start 75 · Copy Invitation 162 · Edit 85 · **Delete 103** (x852; × icon `mtg-meetings-delete-x.svg` 12px) |
| Show Meeting Invitation | y391 | as above |

Notice logic (recomputed every 1000 ms) [M JS]:
```
if (meeting.status)                         → "In Progress"            (blue)
else {
  if (allDay calendar event)                → "All-day event"
  if now ∈ [start−30min, start−1min)        → "Starts in {N} minutes"  N = floor((start−now)/1min)   (blue)
  if now ∈ [start−1min, start)              → "Starts in 1 minute"     (blue)
  if now ∈ [start, start+duration]          → "NOW"                    (red #FD4C4C)
}
```
(Observed: 10 min before → "Starts in 9 minutes"; ≤1 min → "Starts in 1 minute"; inside window → "NOW"; status=1 → "In Progress".) Recurring meetings with a time show the time but no "Recurring" text (feature flag); with no fixed time: no time row at all.

**Private meeting of another host** (`scheduleOptions5 & 512`, `canViewDetail=false`) — `mtg-09`
- List: topic, "Private", time, `Host: Jane Doe`; **no** Meeting ID.
- Detail: topic; `span.meetings__detail-private` (14px/20px `#232333`, inline) = `<span style="margin-right:8px">Private</span><i class="black-lock-icon">` (8×10 lock, `rgba(4,4,19,.56)`, `mtg-meetings-private-lock.svg`); time row (no notice styling difference); `Host: …`. **No buttons, no invitation link.**

**Other host's meeting (not private)**: list shows Meeting ID; detail shows topic, time, host, number and **only a "Join" button** (69×32, same blue normal style, id `meetings-detail-btn-join-aria`). No Copy/Edit/Delete/Show invitation.

**Button availability matrix [M JS `Kh()`]**
| Meeting | Start | Join | Copy Invitation | Edit | Delete | Show invitation |
|---|---|---|---|---|---|---|
| PMI (own) | ✓ | – | ✓ | ✓ | – | ✓ |
| Scheduled / recurring (own or "schedule-for") | ✓ | – | ✓ | ✓ | ✓ | ✓ |
| Webinar / simulive (own) | ✓ / Join | – | ✓ | ✓ | – | ✓ |
| Someone else's | – | ✓ | – | – | – | – |
| Private & no view rights | – | – | – | – | – | – |
Start/Join are **disabled** while the user is already in a meeting; Edit/Delete disabled for the meeting currently running. Disabled tertiary: bg `#FFF`, text `#6E7680`; disabled normal: bg `#F2F2F7`, text `#909096`.

**Button states [M CSS]**
| Button | default | hover | active | focus (all inputs) | disabled |
|---|---|---|---|---|---|
| Start / Join (`type-normal`) | bg `#0E72ED`, `#FFF` | `linear-gradient(0deg,#00000017,#00000017),#0E72ED` | same as hover | `outline:2px solid #4793F1; outline-offset:2px` (keyboard only) | bg `#F2F2F7`, `#909096` |
| Copy / Edit (tertiary) | bg `#FFF`, border `#DFE3E8`, `#131619` | bg `#F7F9FA`, text `#0E71EB` | — | bg `#F1F4F6`, text `#0E71EB` (+outline for keyboard) | bg `#FFF`, `#6E7680` |
| Delete (tertiary) | same | bg `#F7F9FA`, text **`#E02828`** | — | bg `#F1F4F6`, `#E02828` | bg `#FFF`, `#6E7680` |
Icons inherit `currentColor` (so they turn blue/red on hover).

**Actions [M]**
- **Start** — not clicked (task). Code: `startMeetingWithMeetingNumber(number, {omn})` → launches the in-app web client (no popup).
- **Join** — `joinMeeting(number,{pwd})`.
- **Copy Invitation** — fetches invitation (`POST /wc/pwa-meeting/detail?from=pwa&mn=…` → `inviteEmailWithTime`; fallback `https://zoom.us/j/{number}`), copies with `copy-to-clipboard` (hidden span + `execCommand('copy')`), then opens tooltip **"Copied!"** (see A.6). If the copy fails, no feedback.
- **Edit** — `window.open("https://app.zoom.us/meeting/{number}/edit?from=pwa","_blank")` (observed for PMI).
- **Delete** — opens modal A.8.
- **Show/Hide Meeting Invitation** — toggles; first open fetches the same invitation text.

### A.6 "Copied!" tooltip [M] — `mtg-02`
- prism Tooltip, controlled `open`, `placement:"top"`, `offset:6`; content `<span style="display:block;text-align:center">Copied!</span>`.
- Box 58×24 at x625 y211 (centered over Copy Invitation; bottom edge 6px above button). bg `#FFF`, border 1px `#DFE3E8`, radius **4**, shadow `0 4px 8px #00000014, 0 2px 4px #00000014`, padding `3px 6px`, text 12px/16px 400 `#2A2B2D`, z-index 1500, no arrow.
- Enter/exit: `opacity 300ms cubic-bezier(0.4,0,0.2,1)`.
- Closes on `mouseleave` or `blur` of the button (no timer). Clone [D]: also auto-close after 2 s for touch.

### A.7 Meeting invitation block [M] — `mtg-03`
- Link toggles text "Show Meeting Invitation" ↔ "Hide Meeting Invitation".
- `div.meetings__detail-invitation-content`: `align-self:stretch; flex:1 1 auto; height:0; overflow:auto; font-size:13px; white-space:break-spaces; word-break:break-word; margin-bottom:0`; scrollbar 6px (same colors as list). While loading: `i.z-loading` 24×24 spinner with margin `10px 20px`.
- `<pre>`: 13px, **line-height 13px**, weight 400, color `#000`, font = page font (not monospace), `white-space:pre`, margin 0, width 874 (no max width). 11 lines → 143px.
- PMI text (CRLF endings), verbatim template:
```
{Host name} is inviting you to a scheduled Zoom meeting.

Topic: {Host name}'s Personal Meeting Room

Join Zoom Meeting
https://us05web.zoom.us/j/{PMI digits}?pwd=<token>

Meeting ID: 492 555 0101
Passcode: <passcode>


```

### A.8 Delete Meeting confirm modal [M] — `mtg-07`
- ReactModal overlay `.z-modal-confirm__overlay`: fixed, z 1001, bg **`rgba(255,255,255,.75)`** (CSS source says `#ffffffe6`, computed .75).
- `.z-modal-confirm-outer-content`: 560×184, centered (x403 y260; `margin-top:-4rem`), bg `#FFF`, radius 8, shadow `0 0 20px #2626264D`, `max-width:80vw; min-width:25vw`.
- Header (40 tall, padding `10px 6px`, space-between): 20×20 Zoom logo (`mtg-modal-confirm-logo.png`) + "Zoom" 12px/12px `#000` (margin-left 6); close × icon 12px, padding 4, hover/active bg `#6A6A6A1A`.
- Body padding `10px 16px 0`: `h5` "Delete Meeting" 14px **600** `#222325`; `p` margin-top 24 (1.5rem), 14px/19.2px `#000`: "You can recover this meeting within 7 days from the <a href="/meeting/trashcan/list" target="_blank">Recently Deleted</a> page on the Zoom web portal" (link `#0D6BDE`). For another host's meeting the text is prefixed "{Host name}. ".
- Footer: flex-end, padding `0 16px 16px`, gap 10 (margin-right 10, margin-bottom 10): **Delete** (`z-button-size-32 type-destructive`: 85×32 bg `#DE2828`, hover `+9% black`, active `+18% black`, text white 14/20 700) · **Cancel** (`type-secondary` 87×32: bg `#F1F4F6`, text `#131619`, hover `#DFE3E8`, active `#C1C6CE`).
- Delete → `POST delete {mn, occurrence(ms), meetingMasterEventId}` → remove item; on error toast "Delete meeting failed" (failure icon). Escape/× /Cancel close.

### A.9 Loading & empty states [M] — `mtg-10`
- Loading (initial or refresh): left body and right pane each replaced by `div.loading-container` (flex center, 100%×100%) with `i.z-loading` 24×24 PNG spinner (`mtg-z-loading.png`), `animation: rotate-infinite 1s linear infinite`.
- Detail empty (nothing selected; e.g. no PMI): `.meetings__detail-empty` centered column: `span.meetings-empty-icon` **200×200** calendar illustration (`mtg-meetings-empty-detail.png`) + `span.meetings-empty-tips` 14px "Connect your calendar or schedule a meeting".
- List empty: "No upcoming meetings" (A.2).

### A.10 Host filter (only for users who schedule for ≥3 people) [M CSS/JS]
`.meetings__host-filter` (centered) > content (radius 4, padding `4px 6px`, hover `#E7F1FD`, active `#D4E6FC`) > button: prefix "meeting hosted by" 13px/14px `#0404138F` (mr 4) + host name 13px/14px `#000` + caret `#999` (ml 4); opens a radio dropdown (min-width 160, bottom). Not needed for the clone.

### A.11 Clone guidance for the "Previous" view inside Workplace [D]
Zoom Workplace has no Previous list. Keep §7.3's segmented header, but render previous items with the **same `meetings__meeting-item` component** (topic 16/19 700 → line 2 `Oct 6, 3:00 PM` → line 3 duration / `{n} participants` → `Meeting ID: …`), grouped with the same label style, and an empty state "No previous meetings" styled exactly like `.meetings__groups-empty`. For the detail pane reuse the scheduled layout; buttons: Start (PMI only) · Copy Invitation. Visual reference for previous-meeting rows: portal §B.6.

---

## B. Web-portal Meetings pages — `https://zoom.us/meeting#/…`

Screens: `mtg-11-portal-upcoming-empty`, `mtg-12-portal-previous-empty`, `mtg-13…daterange-picker`, `mtg-14…previous-list-simulated`, `mtg-15…upcoming-list-simulated`, `mtg-19…templates-empty`, `mtg-20…schedule-split-menu`.

`https://zoom.us/meeting` → `https://zoom.us/meeting#/upcoming` (no redirect to us05web for this page). Page title "My Meetings - Zoom". Font `"Almaden Sans", Helvetica, Arial`; **all text letter-spacing 0.42px** [M]. Portal shell (top bar, header, side menu with "Meetings" active) — see the Schedule spec; content column starts at **x=332**, width **987** (viewport 1366 minus 15px scrollbar) [M]. Vertical values below are with Zoom's 51px marketing banner present (content top y=158); subtract 54 for no banner [D].

### B.1 Structure
```
div#app > div.content-wrap > div.meetings-content (position:relative)
├─ div.meetings-header > header.mgb-md (display:flex; line-height:30px; margin-bottom 16)
│   ├─ h1 "Meetings"
│   └─ div.schedule-dropdown-wrap (flex, gap 10) > div.schedule-dropdown.zm-dropdown[aria-label="Schedule a meeting"]
│        └─ div.zm-button-group > button.zm-button--primary ("+ Schedule a Meeting") + button.zm-dropdown__caret-button[aria-label="Toggle dropdown"]
├─ div.upgrade-to-pro-banner        (only when the current list has data)
├─ div.meeting-tab > div.zm-tabs.zm-tabs--top > div.zm-tabs__header > div.zm-tabs__nav-wrap.is-scrollable
│     ├─ button.zm-tabs__nav-prev[aria-label="Scroll left"] / button.zm-tabs__nav-next[aria-label="Scroll right"]
│     └─ div.zm-tabs__nav-scroll > div.zm-tabs__nav[role=tablist aria-label="Tabs of meeting"]
│          └─ div.zm-tabs__item[role=tab id="tab-/upcoming"] > h2.router-link-item "Upcoming"   …×6
└─ div.content-wrap  (router view: Upcoming | Previous | AssetsList | Personal | Template | AgendasList)
```

### B.2 Header [M]
| Element | Box | Style |
|---|---|---|
| h1 "Meetings" | 332,190,769×34 | 24px/26.4px **600** `#222325`, ls .42 |
| Schedule main button | 1101,190,187×34 | `zm-button--primary`: bg `#0E72ED`, radius `8px 0 0 8px`, padding `6px 16px`, margin-right −1; content `i.zm-icon-add` (plus, icon font) + " Schedule a Meeting" 14px/20px **500** `#FFF`. Hover bg `#0956B5`. Click → `window.open("/meeting/schedule","_self")` (same tab) |
| caret button | 1287,190,32×34 | same blue, radius `0 8px 8px 0`, padding `0 5px`, `i.zm-icon-down`; `aria-haspopup=listbox`, toggles menu |
| dropdown menu `ul.zm-dropdown-menu` | 1078,228,241×155 | bg `#FFF`, border 1px transparent, radius 8, shadow `0 2px 12px rgba(35,35,51,.5)`, padding 4, margin-top 4, right-aligned to the caret |
| item content | | `display:block; border-radius:8px; line-height:24px; padding:4px 8px`, 14px `#131619`; icon 16 + text margin `0 8px`; hover/focus bg `#F1F4F6`; active bg `#0E72ED` text `#FFF` |
| item 1 | | calendar icon + "Schedule a Meeting" — `border-bottom:1px solid #DFE3E8; padding-bottom:8px; margin-bottom:8px` → same as main button |
| items 2–4 | | brand icon 16 + "Schedule from Zoom" / "Schedule from Google" / "Schedule from Microsoft" + external-link icon 14 at right. Actions: `window.open(url,"_blank")` with `https://zoom.us/router?page=calendar`, Chrome Web Store Zoom extension, Microsoft AppSource add-in. Clone [D]: show items 2–4 disabled or omit |

### B.3 Upgrade banner (shown when list has data) [M]
`.upgrade-to-pro-banner`: 987×56, bg `#F7F9FA`, radius 8, padding 8, margin `24px 0`; text 14px/20px `#131619`: "Your current Basic plan allows you to schedule meetings for up to 40 minutes each. Upgrade to Zoom Workplace Pro to schedule meetings for up to 30 hours with advanced meeting features. " + link "Discover Zoom Workplace Pro" `#0D6BDE`. Omit in clone [D].

### B.4 Tab bar [M]
| Part | Value |
|---|---|
| header | 987×52 at y240, margin-bottom 15 (content starts y306) |
| nav-wrap | padding `0 32px` (room for arrows), margin-bottom −1, `overflow:hidden`; `::after` bottom rule: absolute, bottom 0, width 100%, **1px solid `#DFE3E8`** (h2, z 1) |
| tab item | `display:inline-block; padding:0; margin-right:32px; line-height:24px`; `h2.router-link-item` 20px/24px **500** (CSS asks 600; computed 500), padding `14px 0`, `white-space:nowrap` |
| colors | inactive `#6E7680`; active and hover `#0E71EB` |
| active indicator | `.zm-tabs__item::after{position:absolute;bottom:0;left:0;width:100%;height:2px;border-radius:2px;background:#0E71EB;transition:background-color .2s}` (transparent when inactive) |
| arrows | `zm-tabs__nav-prev/next`: 30×20, absolute top 14, color `#6E7680`, icon font 20px `zm-icon-left/right`; disabled state same color, `cursor:not-allowed` |
| labels & routes | Upcoming `#/upcoming` · Previous `#/previous` · Attachments `#/assetsList` · Personal Room `#/pmi/{pmi}` · Meeting Templates `#/template/list` · Meeting Agendas `#/agendasList` |
| x positions | Upcoming 364 (w100) · Previous 496 (83) · Attachments 611 (124) · Personal Room 766 (147) · Meeting Templates 945 (185) · Meeting Agendas 1162 (170, clipped) |
| keyboard | `role=tab`, active `tabindex=0 aria-selected=true` |

### B.5 Upcoming tab [M]
**Empty (free user)** — `.basic-welcome` (width 600, `margin:90px auto`, centered, x526 y396):
- h2 "Welcome to Zoom Meetings!" 24px/26.4px **700** `#222325`, margin-bottom 16.
- p 16px/24px `#232333`: "Schedule new and manage existing meetings all in one place. You are currently limited to 40 minutes per meeting. Upgrade now if you need more time." + link " Learn More" `#0D6BDE`.
- buttons row margin-top 24, centered: **Schedule a Meeting** (primary small 169×32: padding 6 16, radius 8, 14/20 500) margin-right 8 · **Upgrade Now** (plain small 127×32: bg `#FFF`, border 1px `#DFE3E8`, `#131619`, hover bg `#F7F9FA`).
- Then `.promote-plugin` (y656): `border-top:1px solid #E4E4ED; padding:30px 0`; title "Save time by scheduling your meetings directly from your calendar." 16px/24px `#232333`, mb 10; two plugin items (40×40 sprite icon, gap 20): "Microsoft Outlook Plugin" 16/24 + link "Add Zoom" 14/24 `#0D6BDE`; "Chrome Extension" + "Download". Omit or keep static [D].

**With data** (rendered via injected data) — `mtg-15`: action row with date-range picker (default **today → today+3 months**, e.g. "10-07-2026 to 01-07-2027"), then the same `fixed-time-list` as Previous (B.6). Specific to Upcoming: in-progress meeting shows red **in-meeting icon** (icon font 16px `#FF5C5C`, title "In progress") after the topic and **Join** instead of Start, Edit disabled; group "recurring" shows title **"Recurring - No Fixed Time Meetings"** and time column "Recurring". Server group titles (e.g. "Today") and time strings are server-provided [D format].

### B.6 Previous tab (template for "Recent meetings") [M]
**Action row** (`div.action.clear-fix`, y306, h34):
- Date range editor `zm-date-editor--daterange`: 270×32, border 1px `#444B53`, radius 8, padding `0 10px`, calendar icon (icon font) left; two readonly inputs 93 wide 14px/30px `#131619` showing `MM-DD-YYYY` (value-format `yyyy-MM-dd`), separator "to" (padding 0 5); placeholder "Start Time"/"End Time". Transition `border-color .2s cubic-bezier(.645,.045,.355,1)`. Not clearable when meeting-event mode is on.
- Default range **[today − 3 months, yesterday]** (e.g. 07-07-2026 → 10-06-2026). Screen-reader text "July 7 2026 to October 6 2026".
- Help button (24×18, ghost, `zm-icon-help-outline`, margin-left 3, aria-label "Learn More about selcte time range" [sic]) → light tooltip to the right: "Only meetings in the selected time range will appear. You can see more meetings by updating the time range." (box 320×90, bg `#FFF`, radius 8, padding `8px 12px`, 14px/24px `#6E7680`, shadow `0 2px 12px rgba(35,35,51,.5)`, margin-left 12, arrow 6px).
- Date-range picker popover (`mtg-13`): 646×331, two months side by side, bg `#FFF`, radius 8, shadow `0 2px 12px rgba(35,35,51,.5)`, z 1000; header "July 2026" 16px/30px 500 `#131619` with «‹ / › » buttons; weekday row `Sun … Sat` 12px/30px; cells `td` 41×38 (padding 4 0), inner div 30 tall; in-range div bg `#DFE3E8` (start/end div rounded 15 on the outer side, margin 5); start/end/current date `a` 24×24 circle bg `#0E71EB` text `#FFF`; today `#0E71EB` 700; other-month `#6E7680` .5 opacity; hover text `#0E71EB`; disabled bg `#F5F7FA`. Opens with `zm-zoom-in-top` transition; closes on outside click.

**Empty state** (`mtg-12`): `.no-data` padding-top **120**, text-align center; `p` 14px/21px 400 **`#747487`**: "The user does not have any previous meetings.<br/>To schedule a new meeting click Schedule a Meeting." (two lines, y460). No illustration. When a date filter yields nothing: "You do not have any meeting during this period".

**List** (`fixed-time-list`; `mtg-14`) — page size 15:
```
div.meeting-fixed-list > div.fixed-time > div.mgb-lg (per day)
  └─ div.fixed-time-item
       ├─ div.title.mgb-lg > span "{day label}"            987×38, bg #F7F9FA, radius 8, padding 9px 12px, mb 24; 14px/20px 700 #232333
       └─ div.list (padding 0 12px)
            └─ div.meeting-item.mgb-xl.has-detail (display:flex; margin-bottom 32)
                 ├─ div.meeting-time (width 240, mr 24)
                 │    span.schedule-time  16px/22.86px 700 #232333     ("Recurring" for type 3)
                 │    p.local-date.mgt-sm 14px #6E7680 (optional, mt 8)
                 ├─ div.meeting-detail (width 350, mr 24)
                 │    a (zm-tooltip, href=/meeting/{number}) > span.topic  16px 700 #232323, single-line ellipsis, tooltip full topic (top-start) when truncated
                 │    span.icon  (in-progress icon #FF5C5C 16px "In progress"; no-passcode warning #F26D21 14px tooltip "This meeting does not have a passcode or Waiting Room.")
                 │    p.meeting-id.mgt-sm  "Meeting ID: 812 3456 7890"  14px/21px #6E7680, mt 8
                 │    p.host-name.mgt-xs   "Host: {name}" (only meetings of other hosts), mt 4
                 └─ div.meeting-action (flex 1; buttons opacity 0)
                      a.meeting-start  primary small 66×32 "Start"  (href /s/{number}, target _blank)  [Join when live]
                      a/button.meeting-edit plain small 61×32 "Edit" (margin-left 8) — href /meeting/{n}/edit?listType=previous; recurring(type 8) → "Edit Recurring Meeting" dialog
                      button.meeting-delete plain small 79×32 "Delete" (ml 8) — not for PMI(type 4)
                      button#reportToZoom (Previous only) link small 128×32, ml 10: 16px report icon + "Report to Zoom" 14px #747487 (hover #0E72ED) — wraps under the buttons at 1366
```
Measured rows: first item y514, second y624 (110 pitch with 1-line topic + Meeting ID + wrapped "Report to Zoom"). x: time 344, detail 608, actions 982.

Row states [M CSS]: hover/focus-within → time, local-date, topic and `p` text turn **`#0E71EB`**, topic underlined, all action buttons `opacity:1` (no background change, `cursor:default`). Buttons: `.zm-button` transition `.1s`; primary hover `#0956B5`; plain hover bg `#F7F9FA`; `:active` on action buttons sets opacity 0 (Zoom quirk) [M]. Expired upcoming rows (`has-expired`) grey `#6E7680`.

Free-plan nudge (first row only): `.upgrade-tip` under the time: bg `#F7F9FA`, radius 10, padding 8, margin-left −8, 14px/20px `#131619`: "Need more meeting time?" + link "Upgrade to Zoom Workplace Pro" `#0D6BDE` (omit [D]).

**Pagination** (only when total > 15; margin-top 32; layout `jumper, prev, pager, next, sizes, total`):
| Part | Measured |
|---|---|
| "Go to" + input | input 46×32, border 1px `#444B53`, radius 8, value centered 14px |
| prev / next | 32×32 icon buttons, border 1px `#DFE3E8`, radius 8, bg `#FFF`; disabled bg `#F1F4F6`; margin 0 8 |
| page numbers `li.number` | 30×32 (min-width 30), radius 8, margin `0 5px`, bg `#F2F2F7`, 14px/32px 700 `#131619`; hover text `#0E71EB` bg `#FFF`; active bg `#0E71EB` text `#FFF`; pressed bg `#D7E6F8`; keyboard focus `box-shadow:0 0 0 2px #fff,0 0 0 4px #0E72ED` |
| sizes | select 120×32 "15/page", bg `#F2F2F7`, radius 8, hover bg `#E7F1FD` text `#0E71EB` |
| total | "40 result(s)" 14px/20px `#131619`, margin-left 16 |

**Dialogs from list actions** (strings [M i18n]): End: title "Confirmation", "Are you sure you'd like to end this meeting?", "Topic:"/"Host:", buttons **End** (danger) / Cancel. Edit recurring: "Edit Recurring Meeting", "You are editing a recurring meeting", buttons "Edit This Occurrence" (primary) / "Edit All Occurrences" / "Cancel" (560 wide). Delete: title "Delete Meeting" / "Delete Recurring Meeting", text "You can recover this meeting within {7} days from <a>Recently Deleted</a>.", buttons "Delete" (danger `#E8173D`, hover `#B10E2C`) / "Cancel"; recurring: "Delete This Occurrence" / "Delete All Occurrences".

### B.7 Other tabs [M]
- **Meeting Templates** (`mtg-19`): centered two-line text "You do not have any meeting templates." / "You can choose an existing Meeting, edit it and save as a template." (same style as Previous no-data [D]).
- **Attachments**: date range (last month → today) + "Schedule a Meeting" + "No Data" + promote-plugin block.
- **Meeting Agendas**: sub-tabs "My agendas · Shared with me · Trash", Search, "No Data".
- Not needed for the clone beyond optional static tabs.

---

## C. Meeting detail — Personal Meeting Room (`zoom.us/meeting#/pmi/{PMI}`) — template for our `/meeting/{number}`

Screens: `mtg-17-portal-personal-room-detail.jpg`, `mtg-16-portal-copy-invitation-dialog.jpg`, `mtg-18-portal-meeting-invalid-id.jpg`.
`https://zoom.us/meeting/{PMI}` redirects here. It renders inside the Meetings page (title + tabs remain; "Personal Room" tab active).

### C.1 Structure
```
div (Personal page)
├─ div.zm-tabs.zm-tabs--capsule > header: div#tab-detail.zm-tabs__item.is-active "Details"
└─ div#pane-detail > div(min-height:500px)
    ├─ div.detail-content > form.zm-form.zm-form--label-left
    │   ├─ div (base options) > .base-options-N > div.zm-form-item.is-no-asterisk
    │   │      ├─ div.zm-form-item__header (width:160px) > label.zm-form-item__label
    │   │      └─ div.zm-form-item__content (margin-left:160px) > p / div …
    │   ├─ div (advanced options) > .advanced-options-0::before = divider …
    │   └─ div.lazy-component ×2 (Options etc. load on scroll)
    └─ div.zm-sticky (height 82) > div.detail-btns-wrapper   → becomes .zm-sticky-fixed.view-sticky-footer when the page is taller than the viewport
```

### C.2 Capsule tab [M]
"Details": 80×32 at x332 y394, bg **`#E7F1FD`**, text **`#0862D1`** 14px/32px 500, radius 6, padding `0 16px`; header margin-bottom 24; no underline. (Other capsule tabs for meetings with registration etc.: "Registration", "Email Settings", "Branding", "Polls/Quizzes", "Live Streaming" — inactive `#444B53` [D].)

### C.3 Label/value grid [M]
- Tabs content padding `0 16px` → form x=348, width 955.
- `.zm-form-item`: margin-bottom **20**; header **160px** wide, padding `4px 12px 4px 0`; label 14px/**24px** 400 **`#131619`**, left aligned; content starts x=**508**, width 795.
- Values: `p.pdt-xs.pdb-xs` 14px/21px 400 `#232333`, padding `4px 0` (row height 32 for single-line).

| Row (label) | y (label) | Content [M] |
|---|---|---|
| Topic | 453 | `{Host name}'s Personal Meeting Room` |
| Meeting ID | 505 | `492 555 0101` |
| Security | 557 (row 73 tall) | line 1: ✓ (icon font 14px `#232333`, mr 4) "Passcode" + `********` (ml 8) + **Show** (`zm-button--link small`: padding `6px 0 6px 8px`, text 14px/20px 500 `#0956B5`, aria-label "show passcode ********") — toggles to **Hide** and reveals the real passcode (aria "hide passcode {passcode}"); line 2 (mb 8): ✓ "Everyone goes into the waiting room" 14px/21px |
| Invite Link | 650 | `<a target="_blank">https://us05web.zoom.us/j/{pmi}?pwd=<token></a>` 14px `#0D6BDE` + copy icon button (24×18, ghost, margin-left 8, icon font 16px `#6E7680`, aria-label "Copy Url") with light tooltip **"Copy the Link"** (top, 119×42, 14px/24px `#6E7680`, padding 8 12, radius 8, fade `opacity .2s linear`). Click → copies URL + toast "Copied to clipboard" |
| Add to | 702 | three links 16px/32px, margin-right 30, each with 20×20 sprite icon (margin `6px 4px 0 0`): **Google Calendar** `#0E71EB` → `/meeting/{token}/calendar/google/add`; **Outlook Calendar (.ics)** `#3171BB` → `/meeting/{token}/ics`; **Yahoo Calendar** `#952BCE` → calendar.yahoo.com (new tab) |
| *(divider)* | ~770 | `.advanced-options-0::before{content:"";display:table;width:100%;border-top:1px solid #EDEDF4;margin-bottom:32px}` |
| Encryption | 808 | shield-check 16px **`#09A639`** (`mtg-portal-shield-check.svg`, vertical-align sub, mr 4) + "Enhanced encryption" (p mt 4) |
| My Notes | 862 | "Allow participants to transcribe meeting with My Notes" + grey line "All participants" `#747487` |
| Video | 934 | two sub-rows (28px apart): "Host" (120px column) "on"; "Participant" "on" — 14px/20px `#232333` |
| Options | 1012 | `p.view-content` 14px/32px: "Allow participants to join anytime" (one `p` per enabled option, mb 16) |

For a **scheduled** meeting the same component adds rows [M i18n labels, D content]: **Description** (pmr.registerDesc), **Time** (pmr.meetingTime) e.g. `Oct 8, 2026 11:00 AM India` (+ recurrence lines), and Audio ("Telephone and Computer Audio"); Options lists any of: "Allow participants to join anytime", "Mute participants upon entry", "Automatically record meeting on the local computer", "Approve or block entry to users from specific regions/countries".

### C.4 Sticky action bar [M]
- In-flow placeholder `div.zm-sticky` 82px; when the bar would be below the viewport it becomes `.zm-sticky-fixed.view-sticky-footer`: `position:fixed; bottom:0; left:348px (aligned to form); width:955px; background:#FFF; border-top:1px solid #EDEDF4; z-index:10` (82.5px tall).
- `.detail-btns-wrapper`: padding `24px 0 24px 5px`, buttons inline with `margin-right:10px`.
- **PMI buttons**: **Start** (`zm-button--primary --small` 66×32, `<a href="/s/{pmi}">`) · **Copy Invitation** (`--plain --small` 155×34: copy icon font + text 14px/18px 500 `#131619`) → dialog C.5 · **Edit** (`--plain --small` 61×32, `<a href="/meeting/{pmi}/edit?from=pmi">`). When the PMI is live: **Join** (+ **End**, danger) instead.
- **Scheduled meeting buttons** [M template, D sizes]: **Start** (primary; label "Join Now" when live; `href=/s/{number}`, target _blank) · **Copy Invitation** (plain small + icon) · **Edit** (`/meeting/{n}/edit`; recurring → "Edit Recurring Meeting" dialog; disabled while live) · **Delete** (neutral button → "Delete Meeting" dialog) · **Save as Template** (→ "Save as a Meeting Template" dialog 640 wide, buttons "Save as Template" / "Cancel"). Clone: use small (h32) for all [D].
- Button states: primary bg `#0E72ED` hover `#0956B5`; plain bg `#FFF` border `#DFE3E8` hover bg `#F7F9FA`; disabled bg `#F1F4F6` text `#6E7680`; transition `.1s`.

### C.5 Copy Meeting Invitation dialog [M] — `mtg-16`
- Wrapper z 2001; overlay `.v-modal` fixed, bg `rgba(0,0,0,.5)`, z 2000.
- Dialog **700** wide, `margin-top:15vh` (y115), bg `#FFF`, border 1px `#DFE3E8`, radius 8, shadow `0 1px 3px rgba(0,0,0,.3)`, padding 24.
- Header (padding-bottom 16): title "Copy Meeting Invitation" **24px/32px 400 `#131619`** (no close ×).
- Body: readonly `textarea` 650×380, border 1px `#444B53`, radius 8, padding `4px 12px`, 14px/22px `#131619`, `resize:vertical`, aria-label "copy invitation content"; content = invitation text (A.7).
- Footer (padding-top 24, right aligned): **Copy Meeting Invitation** (primary small 195×32) · **Cancel** (plain small 82×32, margin-left 8). Copy → selects the textarea text, `execCommand("copy")`, shows toast; **dialog stays open**. Cancel closes.

### C.6 "Copied to clipboard" toast [M CSS + observed]
`.zm-message.zm-message--success`: `position:fixed; top:8px; left:50%; transform:translateX(-50%); min-width:200px; border-radius:8px; padding:10px 32px 10px 16px; display:flex; align-items:center; background:#F2FFF6; box-shadow:0 12px 24px rgba(19,22,25,.1); color:#131619`; icon 20px `#268543` (margin-right 8); text 14px/24px. Enter/leave: `opacity .3s, transform .4s` from `translate(-50%,-100%)`. Default duration 3000 ms [D: Element default; observed gone within ~2–3 s]. Variants: info `#F7F9FA`/`#6E7680`, warning `#FFF9F2`/`#B36200`, error `#FFF2F5`/`#E8173D`.

### C.7 Invalid meeting page [M] — `mtg-18`
`/meeting/{unknown}` → page title "Error - Zoom", portal header only (no side menu), `div.box` padding 50, centered `span.error-message` **"Invalid meeting ID. (3,001)"** 18px/25.7px 400 `#232333` (padding-left 4), followed by the portal footer. Use for our `/meeting/{number}` 404.

---

## D. Icons saved (`docs/reference/icons/`)

| File | Use | Rendered size / color [M] |
|---|---|---|
| `mtg-meetings-refresh.svg` | Meetings header refresh | 13×13, `#000` |
| `mtg-meetings-add-calendar.svg` | "Add a calendar" | 13×13, `#0E72ED` |
| `mtg-meetings-copy.svg` | Copy Invitation (Workplace); use also for portal icon-font copy | 12×12, `currentColor` (`#131619` / hover `#0E71EB`) |
| `mtg-meetings-edit.svg` | Edit | 12×12, currentColor |
| `mtg-meetings-delete-x.svg` | Delete (and modal close ×) | 12×12, currentColor |
| `mtg-meetings-private-lock.svg` | Private meeting lock | 8×10, `rgba(4,4,19,.56)` (converted to currentColor) |
| `mtg-meetings-empty-detail.png` | Detail empty illustration (calendar "12") | 200×200 |
| `mtg-z-loading.png` | 24px spinner (PWA), rotate 1s linear infinite | 48×48 source |
| `mtg-modal-confirm-logo.png` | Zoom logo in confirm-modal header | 20×20 (100×100 source) |
| `mtg-portal-shield-check.svg` | Encryption row | 16×16, `#09A639` |
| `mtg-portal-spinner.svg` | Portal loading mask spinner | 50×50, currentColor with stepped opacities |
Portal icon-font glyphs not extractable as SVG (`zm-icon-add`, `zm-icon-down`, `zm-icon-left/right`, `zm-icon-copy`, `zm-icon-checked`, `zm-icon-help-outline`, `zm-icon-date`, `zm-icon-in-meeting`): use existing SVGs (`chevron-down.svg`, `mtg-meetings-copy.svg`, `sch-close.svg`, etc.) at the stated sizes [D].

## E. Screenshots saved (`docs/reference/screens/`)
`mtg-01-meetings-tab-pmi.jpg` (default, PMI selected) · `mtg-02-copy-invitation-copied-tooltip.jpg` · `mtg-03-show-meeting-invitation.jpg` (pwd/passcode masked) · `mtg-04-add-calendar-popover.jpg` · `mtg-05-meetings-list-simulated-items.jpg` (scheduled items, "In Progress") · `mtg-06-scheduled-detail-now-notice.jpg` ("NOW" red, Delete button) · `mtg-07-delete-meeting-confirm.jpg` · `mtg-08-meetings-list-scrolled-recurring-group.jpg` · `mtg-09-private-meeting-detail.jpg` · `mtg-10-meetings-loading.jpg` · `mtg-11-portal-upcoming-empty.jpg` · `mtg-12-portal-previous-empty.jpg` · `mtg-13-portal-previous-daterange-picker.jpg` · `mtg-14-portal-previous-list-simulated.jpg` · `mtg-15-portal-upcoming-list-simulated.jpg` · `mtg-16-portal-copy-invitation-dialog.jpg` (masked) · `mtg-17-portal-personal-room-detail.jpg` (masked) · `mtg-18-portal-meeting-invalid-id.jpg` · `mtg-19-portal-templates-empty.jpg` · `mtg-20-portal-schedule-split-menu.jpg`.
(05/06/08/09/14/15 show injected demo data, not real meetings.)

---

## Appendix 1 — PWA CSS rules for the Meetings tab (verbatim from `main.css`, vehicle/`.vehicle-app` variants removed)

```css
/* containers */
.meetings-container{flex:1 1 auto;width:100%}
.meetings-container,.meetings-container__left{display:flex;height:100%;justify-content:flex-start}
.meetings-container__left{flex:0 0 auto;flex-direction:column;position:relative;width:360px}
.meetings-container__v-divider{background:#7d7d8821;flex:0 0 auto;height:100%;width:2px}
.meetings-container__right{flex:1 1 auto;height:100%}
.meetings-container__left-header__refresh{background-color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;left:16px;padding:4px;position:absolute;top:50%;transform:translateY(-50%)}
.meetings-container__left-header__refresh:hover{background-color:#0000000f}
.meetings-container__left-header__refresh:active{background-color:#0000004d}
.meetings-container__left-header__add{height:16px;width:16px}
.meetings-container__left-body{flex:1 1 auto;height:100%;width:100%}
.meetings-container__left-tabs{display:flex;flex-direction:column;height:100%}
.meetings-container__header{align-items:center;display:flex;flex:0 0 auto;justify-content:center;padding:16px;position:relative}
.meetings-container__header-title{color:#131619;font-size:14px;font-weight:700}

/* list */
.meetings{display:flex;flex-direction:column;height:100%;justify-content:flex-start;width:100%}
.meetings__groups-divider{background-color:#ededf4;height:1px;margin:0 36px}
.meetings__groups{flex:1 1 auto;height:0;overflow:auto;width:100%}
.meetings__groups::-webkit-scrollbar{width:8px}
.meetings__groups::-webkit-scrollbar-track{background:#0000000f;border-radius:3px;-webkit-box-shadow:inset 0 0 5px #00000014}
.meetings__groups::-webkit-scrollbar-thumb{background:#0000001f;border-radius:3px;-webkit-box-shadow:inset 0 0 10px #0003}
.meetings__groups-empty{align-items:center;color:#0404138f;display:flex;font-size:14px;height:100%;justify-content:center;width:100%}
.meetings__group{width:100%}
.meetings__group-pmi{margin:0 16px}
.meetings__pmi-divider{background-color:#ededf4;height:1px;margin:0 36px 10px}
.meetings__pmi{align-items:center;background-color:#fff;border:none;border-radius:12px;display:flex;flex-direction:column;height:78px;justify-content:center;margin:0 16px}
.meetings__pmi .meetings__pmi-number,.meetings__pmi .meetings__pmi-txt{margin:0;padding:0}
.meetings__pmi .meetings__pmi-number{color:#232333;font-size:18px;font-weight:700;line-height:21px;margin-bottom:4px}
.meetings__pmi .meetings__pmi-txt{color:#747487;font-size:13px;line-height:16px}
.meetings__pmi:hover{background-color:#e7f1fd}
.meetings__pmi--selected,.meetings__pmi--selected:hover{background-color:#0e71eb}
.meetings__pmi--selected .meetings__pmi-number,.meetings__pmi--selected .meetings__pmi-txt,.meetings__pmi--selected:hover .meetings__pmi-number,.meetings__pmi--selected:hover .meetings__pmi-txt{color:#fff}
.meetings__group-label{color:#747487;font-size:13px;font-weight:700;line-height:16px;margin:0 16px;padding:12px 20px}
.meetings__meeting-item{border-radius:12px;color:#747487;font-size:13px;line-height:16px;margin:10px 16px;padding:8px 20px}
.meetings__meeting-item:hover{background-color:#e7f1fd}
.meetings__meeting-item--selected,.meetings__meeting-item--selected:hover{background-color:#0e71eb;color:#fff}
.meetings__meeting-item--selected .meetings__meeting-item-topic,.meetings__meeting-item--selected:hover .meetings__meeting-item-topic{color:#fff}
.meetings__meeting-item-host,.meetings__meeting-item-meeting-id,.meetings__meeting-item-time,.meetings__meeting-item-topic{margin:8px 0}
.meetings__meeting-item-topic{color:#232333;font-size:16px;font-weight:700;line-height:19px;overflow-wrap:break-word}
.overflow-ellipsis-1{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* detail */
.meetings__detail{display:flex;flex-direction:column;height:100%;justify-content:flex-start;padding:48px 4px 40px 40px}
.meetings__detail-info{flex:0 0 auto}
.meetings__detail-topic{color:#39394d;font-size:24px;font-weight:700;line-height:29px;margin-bottom:32px}
.meetings__detail-host,.meetings__detail-number,.meetings__detail-private,.meetings__detail-time{color:#232333;font-size:13px;line-height:16px;margin:16px 0}
.meetings__detail-private{font-size:14px;line-height:20px}
.meetings__detail-private span{margin-right:8px}
.black-lock-icon{background:50%/100% 100% no-repeat url(data:image/svg+xml;base64,…);display:inline-block;height:10px;width:8px}
.meetings__detail-time-notice{color:#0e72ed}
.meetings__detail-time-notice-now{color:#fd4c4c}
.meetings__detail-btns{display:flex;flex:0 0 auto;flex-wrap:wrap;margin:32px 0}
.meetings__detail-btns>*{margin-bottom:10px;margin-right:16px}
.meetings__detail-btns .meetings__detail-btn__icon-l{font-size:12px}
.meetings__detail-btn-copy,.meetings__detail-btn-edit,.meetings__detail-btn-msg-channel{background-color:#fff;border:1px solid #dfe3e8;color:#131619}
.meetings__detail-btn-copy:hover,.meetings__detail-btn-edit:hover,.meetings__detail-btn-msg-channel:hover{background-color:#f7f9fa;color:#0e71eb}
.meetings__detail-btn-copy:focus,.meetings__detail-btn-edit:focus,.meetings__detail-btn-msg-channel:focus{background-color:#f1f4f6;color:#0e71eb}
.meetings__detail-btn-copy.disabled,.meetings__detail-btn-edit.disabled,.meetings__detail-btn-msg-channel.disabled{background-color:#fff;color:#6e7680}
.meetings__detail-btn-delete{background-color:#fff;border:1px solid #dfe3e8;color:#131619}
.meetings__detail-btn-delete:hover{background-color:#f7f9fa;color:#e02828}
.meetings__detail-btn-delete:focus{background-color:#f1f4f6;color:#e02828}
.meetings__detail-btn-delete.disabled{background-color:#fff;color:#6e7680}
.meetings__detail-invitation{align-items:flex-start;display:flex;flex:1 1 auto;flex-direction:column;justify-content:flex-start;width:auto}
.meetings__detail-invitation-link{background:none;border:none;color:#0e72ed;cursor:pointer;font-size:13px;line-height:8px;margin:12px 0 16px}
.meetings__detail-invitation-link:hover{color:#0e71eb;text-decoration-line:underline}
.meetings__detail-invitation-content{align-self:stretch;flex:1 1 auto;font-size:13px;height:0;margin-bottom:0;overflow:auto;white-space:break-spaces;word-break:break-word}
.meetings__detail-invitation-content::-webkit-scrollbar{width:6px}
.meetings__detail-invitation-content .z-loading{margin:10px 20px}
.loading-container,.meetings__detail-empty{align-items:center;display:flex;height:100%;justify-content:center;width:100%}
.meetings__detail-empty-content{align-items:center;display:flex;flex-direction:column;justify-content:center}
.meetings-empty-icon{background:50%/100% 100% no-repeat url(data:image/png;base64,…);display:inline-block;height:200px;width:200px}
.meetings-empty-tips{font-size:14px}
.z-loading{animation:rotate-infinite 1s linear infinite;background:50%/100% 100% no-repeat url(data:image/png;base64,…);display:inline-block;height:24px;width:24px}

/* host filter (multi-host schedulers only) */
.meetings__host-filter{width:100%}
.meetings__host-filter,.meetings__host-filter-content{align-items:center;display:flex;justify-content:center}
.meetings__host-filter-content{border-radius:4px;cursor:default;padding:4px 6px}
.meetings__host-filter-content:hover{background:#e7f1fd}
.meetings__host-filter-content:active{background:#d4e6fc}
.meetings__host-filter__prefix{color:#0404138f;font-size:13px;line-height:14px;margin-right:4px}
.meetings__host-filter__toggle{align-items:center;background:none;border:none;color:#000;cursor:pointer;display:inline-flex;font-size:13px;line-height:14px;padding:2px 4px;position:relative}
.meetings__host-filter__caret{color:#999;margin-left:4px}

/* add a calendar */
.add-calendar{font-size:14px}
.add-calendar,.add-calendar__container{align-items:center;display:flex;justify-content:center}
.add-calendar__container{margin:auto}
.add-calendar__icon{color:#0e72ed;font-size:13px}
.add-calendar__txt{color:#0e72ed;cursor:pointer;margin-left:4px}
.add-calendar__txt:hover{color:#0e72ed}
.add-calendar-meetings-panel{padding:10px 0}
.add-calendar__divider{background-color:#ededf4;height:1px;width:100%}

/* z-button (Workplace) */
.z-button{align-items:center;border:none;border-radius:6px;display:inline-flex;justify-content:center;padding:6px;white-space:nowrap}
.z-button:focus{outline:2px solid #4793f1;outline-offset:2px}
.z-button-size-32{border-radius:8px;font-size:14px;font-weight:700;height:32px;line-height:20px;padding:0 20px}
.z-button-size-32>*{margin-right:4px} .z-button-size-32>:last-child{margin-right:0}
.z-button-type-normal{background:#0e72ed;color:#fff}
.z-button-type-normal:active,.z-button-type-normal:hover{background:linear-gradient(0deg,#00000017,#00000017),#0e72ed}
.z-button-type-normal.disabled{background:#f2f2f7;color:#909096}
.z-button-type-secondary{background:#f1f4f6;color:#131619} .z-button-type-secondary:hover{background:#dfe3e8} .z-button-type-secondary:active{background:#c1c6ce}
.z-button-type-destructive{background:#de2828;color:#fff}
.z-button-type-destructive:hover{background:linear-gradient(0deg,#00000017,#00000017),#de2828}
.z-button-type-destructive:active{background:linear-gradient(0deg,#0000002e,#0000002e),#de2828}

/* global focus behaviour */
:focus{outline:2px solid #2d8cff;outline-offset:1px}
[data-whatintent=mouse] :focus{outline:none!important}

/* confirm modal */
.z-modal-confirm-outer-content{background-color:#fff;border-radius:8px;box-shadow:0 0 20px #2626264d;margin-top:-4rem;max-width:80vw;min-width:25vw;width:560px}
.z-modal-confirm__header{align-items:center;display:inline-flex;justify-content:space-between;padding:10px 6px;width:100%}
.z-modal-confirm__header-title{align-items:center;display:inline-flex;font-size:14px}
.z-modal-confirm__header-logo{…;display:inline-block;height:20px;width:20px}
.z-modal-confirm__header-txt{font-size:12px;margin-left:6px}
.z-modal-confirm__header-close{font-size:12px;margin-right:2px;padding:4px}
.z-modal-confirm__header-close:active,.z-modal-confirm__header-close:hover{background-color:#6a6a6a1a}
.z-modal-confirm__overlay{background-color:#ffffffe6}   /* computed rgba(255,255,255,.75) */
.z-modal-confirm__body{padding:10px 16px 0}
.z-modal-confirm__body h5{font-weight:600}
.z-modal-confirm__body-desc{font-size:14px;line-height:1.2rem;margin-top:1.5rem}
.z-modal-confirm__footer{border:none;display:flex;flex-wrap:wrap;justify-content:flex-end;padding:0 16px 16px;width:100%}
.z-modal-confirm__footer>*{margin-bottom:10px;margin-right:10px} .z-modal-confirm__footer>:last-child{margin-right:0}
```

### `.upcoming__*` (Home "upcoming" side widget of the PWA — not on the Meetings tab, listed for completeness)
```css
.upcoming__header{align-items:center;background:0 0/100% 144px no-repeat url(../images/upcoming-bg.png),#354b61;display:flex;flex:0 0 auto;flex-direction:column;height:144px;justify-content:center;width:100%}
.upcoming__header-time{font-size:40px;font-weight:500;line-height:48px}
.upcoming__header-day{font-size:13px;line-height:16px;margin-top:4px}
.upcoming__content{color:#232333;display:flex;flex:1 1 auto;flex-direction:column;overflow-y:auto;padding-top:20px}
.upcoming__content-empty{align-items:center;display:flex;font-size:14px;height:100%;justify-content:center;width:100%}
.upcoming__actions-popup{cursor:pointer;font-size:13px;width:125px}
.upcoming__actions-popup-item{height:30px;padding:0 10px}
.upcoming__actions-popup-item:hover{background-color:#0e71eb;color:#fff}
.upcoming__detail{color:#232333;cursor:default;font-size:13px;font-weight:400;line-height:16px;padding:0 24px}
.upcoming__detail-topic-wrapper{align-items:center;display:flex;width:100%}
.upcoming__detail-topic{color:#39394d;cursor:pointer;flex:1 1 auto;font-size:18px;font-weight:700;line-height:21px;overflow:hidden;padding-bottom:8px;padding-right:4px;text-overflow:ellipsis;white-space:nowrap;width:0}
.upcoming__detail-topic-private span{margin-right:8px}
.upcoming__detail-btns{flex:0 0 auto}
.upcoming__actions{align-items:center;display:flex}
.upcoming__detail-btn-more{margin-right:10px;padding:0 6px}
.upcoming__detail-host,.upcoming__detail-mn,.upcoming__detail-time{margin-top:16px}
.upcoming__detail-time-divider{background-color:#232333;display:inline-block;height:12px;margin:0 8px;vertical-align:middle;width:1px}
.upcoming__item{align-items:center;display:flex;justify-content:flex-start;padding:8px 15px}
.upcoming__item>*{flex:0 0 auto;margin:0 5px}
.upcoming__item-info{cursor:default;flex:1 1 auto;width:0}
.upcoming__item-time,.upcoming__item-topic{color:#0404138f;font-size:13px;line-height:16px;margin:.125rem 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%}
.upcoming__item-topic{color:#000;cursor:pointer}
.upcoming__divider{background-color:#ededf4;height:1px;width:100%}
.upcoming__footer{align-items:center;color:#747487;cursor:pointer;display:flex;flex:0 0 auto;font-size:13px;height:50px;justify-content:space-between;line-height:16px;padding:0 24px}
```
What these mean: the PWA's compact "upcoming" widget (used by the Home side panel / car UI) shows each meeting as a row with a "…" more button (size-24 secondary, `upcoming__detail-btn-more`) whose menu (width 125, rows 30px, hover blue/white) contains **Copy Invitation · Edit · Delete** (+ View Event), and a primary size-24 action **Start** / **Join** / **View** (`Kh()` logic). Footer text "View today's upcoming meetings ({n})". Time divider is a 1×12 `#232333` bar between date and time. The same notice classes (`meetings__detail-time-notice[-now]`) are used there.

## Appendix 2 — Portal key rules (meeting-list app)
```css
/* Meetings page */
header[data-v-a27b42c2]{display:flex;line-height:30px;position:relative}
header h1{font-size:24px;font-weight:600;flex:1;margin-bottom:0}
header .schedule-dropdown-wrap{display:flex;gap:10px}
.schedule-dropdown .zm-button{min-width:32px;font-size:14px;border-radius:8px;line-height:20px}
.schedule-dropdown .zm-button-group>.zm-button:first-child{padding:6px 16px;border-top-right-radius:0;border-bottom-right-radius:0}
.schedule-dropdown .zm-button-group>.zm-button:last-child{border-top-left-radius:0;border-bottom-left-radius:0}
.schedule-option.meeting-option{padding-bottom:8px;border-bottom:1px solid #dfe3e8;margin-bottom:8px}
.upgrade-to-pro-banner{border-radius:8px;padding:8px;background-color:#f7f9fa;font-size:14px;line-height:20px;color:#131619;margin:24px 0}
.meetings-content .meeting-tab .zm-tabs__item{line-height:24px;padding:0;margin-right:32px}
.meetings-content .meeting-tab .zm-tabs__item h2{color:#6e7680;font-size:20px;padding:14px 0;line-height:24px;font-weight:600}
.meetings-content .meeting-tab .zm-tabs__item.is-active h2,.meetings-content .meeting-tab .zm-tabs__item:hover h2{color:#0e71eb}
.meetings-content .meeting-tab .zm-tabs__nav-next,.meetings-content .meeting-tab .zm-tabs__nav-prev{position:absolute;top:14px;cursor:pointer;line-height:28px;width:30px;font-size:20px;text-align:center;color:#6e7680}
.zm-tabs__item:after{content:"";position:absolute;bottom:0;left:0;width:100%;height:2px;border-radius:2px;background-color:transparent;transition:background-color .2s}
.zm-tabs__item.is-active:after{background-color:#0e71eb}
.zm-tabs--capsule>.zm-tabs__header .zm-tabs__item{line-height:32px;padding:0 16px;font-size:14px;border-radius:6px}
.zm-tabs--capsule>.zm-tabs__header .zm-tabs__item.is-active{background-color:#e7f1fd;color:#0862d1}
/* lists */
.basic-welcome{margin:90px auto;width:600px;text-align:center} .basic-welcome h2{font-weight:700;font-size:24px} .basic-welcome p{font-size:16px}
.promote-plugin{border-top:1px solid #e4e4ed;padding:30px 0}
.promote-plugin .title{font-size:16px;line-height:24px;color:#232333;display:block;margin-bottom:10px}
.meeting-fixed-list .title{background:#f7f9fa;border-radius:8px;padding:9px 12px;font-size:14px;font-weight:700}
.meeting-fixed-list .list{padding:0 12px}
.meeting-fixed-list .list .meeting-item{display:flex}
.meeting-fixed-list .list .meeting-item .meeting-action{flex:1}
.meeting-fixed-list .list .meeting-item .meeting-time{font-size:16px;font-weight:700;width:240px;margin-right:24px}
.meeting-fixed-list .list .meeting-item .meeting-time .local-date{font-size:14px;font-weight:400;color:#6e7680}
.meeting-fixed-list .list .meeting-item.has-expired .meeting-detail a,.meeting-fixed-list .list .meeting-item.has-expired .meeting-time{color:#6e7680}
.meeting-fixed-list .list .meeting-item .meeting-detail{width:350px;margin-right:24px}
.meeting-fixed-list .list .meeting-item .meeting-detail a{color:#232323;font-weight:700;display:inline-block;line-height:normal}
.meeting-fixed-list .list .meeting-item .meeting-detail a span.topic{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.meeting-fixed-list .list .meeting-item .meeting-detail span.icon i{font-size:16px;color:#6e7680;margin-right:6px}
.meeting-fixed-list .list .meeting-item .meeting-detail span.icon i.zm-icon-in-meeting{color:#ff5c5c}
.meeting-fixed-list .list .meeting-item .meeting-detail span.icon i.zm-icon-warning-outline{color:#f26d21;font-size:14px}
.meeting-fixed-list .list .meeting-item .meeting-detail p{color:#6e7680;font-size:14px}
.meeting-fixed-list .list .meeting-item.has-detail:hover .local-date,.…:hover .schedule-time,.…:hover a,.…:hover p{color:#0e71eb}
.meeting-fixed-list .list .meeting-item.has-detail .meeting-detail a:hover span.topic{text-decoration:underline}
.meeting-fixed-list .list .meeting-item.has-detail:hover .meeting-action .zm-button{opacity:1}
.meeting-action .zm-button{opacity:0} .meeting-action .zm-button:focus-within{opacity:1}
.upgrade-tip{border-radius:10px;padding:8px;background-color:#f7f9fa;font-size:14px;line-height:20px;color:#131619;margin-left:-8px}
#reportToZoom .btn-name{margin-left:16px;padding-left:5px;color:#747487;font-weight:400}
#reportToZoom:hover .btn-name{color:#0e72ed}
.mgt-xs{margin-top:4px!important}.mgt-sm{margin-top:8px!important}.mgt-lg{margin-top:24px!important}.mgt-xl{margin-top:32px!important}.mgb-lg{margin-bottom:24px!important}.mgb-xl{margin-bottom:32px!important}
/* buttons */
.zm-button{display:inline-flex;align-items:center;justify-content:center;font-weight:600;transition:.1s;color:#131619;background-color:#fff}
.zm-button:hover{background:#dfe3e8}
.zm-button--primary{color:#fff;background-color:#0e72ed} .zm-button--primary:hover{background:#0956b5}
.zm-button--danger{color:#fff;background-color:#e8173d} .zm-button--danger:hover{background:#b10e2c}
.zm-button--plain{color:#131619;background-color:#fff;border-color:#dfe3e8} .zm-button--plain:hover{background:#f7f9fa}
.zm-button--small{min-width:32px;padding:6px 16px;font-size:14px;border-radius:8px;line-height:20px}
.zm-button--large{min-width:40px;padding:8px 16px;font-size:16px;border-radius:10px;line-height:24px}
.zm-button--link{padding-left:0;padding-right:0;color:#0956b5;background-color:transparent}
.zm-button.is-disabled{color:#6e7680;background-color:#f1f4f6;cursor:not-allowed}
/* dropdown menu */
.zm-dropdown-menu__item-content{display:block;border-radius:8px;line-height:24px;padding:4px 8px}
.zm-dropdown-menu__item:not(.is-disabled):hover .zm-dropdown-menu__item-content{background-color:#f1f4f6;color:#131619}
.zm-dropdown-menu__item:not(.is-disabled):active .zm-dropdown-menu__item-content{color:#fff;background-color:#0e72ed}
/* tooltip */
.zm-tooltip__popper{position:absolute;border-radius:8px;padding:8px 12px;z-index:2000;font-size:14px;line-height:24px;max-width:320px}
.zm-tooltip__popper.is-dark{background:#131619;color:#fff}
.zm-tooltip__popper.is-light{background:#fff;box-shadow:0 2px 12px 0 rgba(35,35,51,.5);border:1px solid transparent;color:#6e7680}
/* toast */
.zm-message{min-width:200px;border-radius:8px;position:fixed;left:50%;top:8px;transform:translateX(-50%);transition:opacity .3s,transform .4s,top .3s;padding:10px 32px 10px 16px;display:flex;align-items:center;box-shadow:0 12px 24px rgba(19,22,25,.1);color:#131619}
.zm-message--success{background-color:#f2fff6} .zm-message--success .zm-message__icon{color:#268543}
.zm-message__icon{margin-right:8px;font-size:20px;line-height:20px}
.zm-message__content{font-size:14px;line-height:24px}
.zm-message-fade-enter,.zm-message-fade-leave-active{opacity:0;transform:translate(-50%,-100%)}
/* pagination */
.zm-pagination.is-background .zm-pager li:not(.more){margin:0 5px;background-color:#f2f2f7;color:#131619;min-width:30px;border-radius:8px}
.zm-pagination.is-background .zm-pager li:not(.disabled):not(.more):hover{color:#0e71eb;background-color:#fff}
.zm-pagination.is-background .zm-pager li:not(.disabled).active{background-color:#0e71eb;color:#fff}
/* date table */
.zm-date-table td{width:32px;height:30px;padding:4px 0;text-align:center}
.zm-date-table td a{width:24px;height:24px;line-height:24px;border-radius:50%}
.zm-date-table td.today a{color:#0e71eb;font-weight:700}
.zm-date-table td.in-range div{background-color:#dfe3e8}
.zm-date-table td.start-date a,.zm-date-table td.end-date a,.zm-date-table td.current:not(.disabled) a{background-color:#0e71eb;color:#fff}
.zm-date-table td.next-month a,.zm-date-table td.prev-month a{color:#6e7680;opacity:.5}
```

## Appendix 3 — Verbatim strings (Workplace i18n, [M])
`Upcoming` · `My Personal Meeting ID (PMI)` · `No upcoming meetings` · `Add a calendar` · `Connect to your work or personal calendar to view all upcoming meetings here` · `Connect your calendar or schedule a meeting` · `Today` · `Tomorrow` · `Recurring` · `Private` · `Host` (`Host: {name}`) · `Meeting ID` · `Webinar ID` · `Not a Zoom meeting` · `This is not a Zoom meeting` · `Busy` · `Private Appointment` · `Start` · `Join` · `View` · `View Event` · `Copy Invitation` · `Copied!` · `Edit` · `Delete` · `Show Meeting Invitation` · `Hide Meeting Invitation` · `In Progress` · `All-day event` · `Starts in {0} minutes` · `Starts in 1 minute` · `NOW` · `Delete Meeting` · `You can recover this meeting within 7 days from the` · `Recently Deleted` · `page on the Zoom web portal` · `Cancel` · `Delete meeting failed` · `meeting hosted by` · `View today's upcoming meetings`.
