# 04 — Join flows (Join modal, portal /join, invite-link launch page, invalid-link page)

Captured 2026-10-07 at a **1366×768** viewport (DPR 2) from the signed-in account. All values are **[M]** (measured from DOM / computed style / downloaded CSS / shipped JS) unless marked **[D]** (inferred). Only fake meeting numbers (`12345678901`, `9876543210`) were used. No meeting was started or joined.

Raw material in the scratch folder `scratchpad/join/`:
- CSS: `pwa-main.css`, `pwa-other.css` (app.zoom.us PWA 7.2.0.3239), `portal-all.min.css`, `portal-top_nav.min.css`, `portal-zoom-components.min.css`, `portal-app-common.css`
- Extracted rules: `extracted-pwa-join-modal.css`, `extracted-prism-button.css`, `extracted-portal-join.css`, `extracted-launch-page.css`
- JS used to confirm behaviour: `js_main.js` (PWA; join modal controller `BC`, view `zC`, modal `ZC`), `portal-join.min.js` and `portal-all.min.js` (`SB.initNoAndUrlInput`, `SB.formatConfNo`), `launch-meeting.js`

---

## 1. Corrections to PRD.md

| PRD § | PRD says | Measured / actual Zoom behaviour |
|---|---|---|
| 7.1.2 input padding | `6px 40px 6px 16px`, no reason given | The 40 px right padding leaves room for a **meeting-history toggle**: a 24×24 round chevron button inside the field (right 8, vertically centred). It is rendered only when the signed-in user has join history. **Zoom has no clear (×) button.** |
| 7.1.2 / 5.4 input focus | "Focus border 1px `#4B96F1`" | Join-modal input: **the border does not change on focus** (stays `#C1C6CE`, no box-shadow). The global PWA rule `:focus{outline:2px solid #2D8CFF;outline-offset:1px}` comes later in the CSS than `.join-meeting-modal__input{outline:none}`, so focus shows a **2 px `#2D8CFF` outline, offset 1 px**, following the 12 px radius. |
| 7.1.2 enable rule | "disabled until ≥9 digits" | Join is enabled when the value with spaces removed matches **`^\d{9,11}$`** or the Personal Link Name regex **`^[a-zA-Z][a-zA-Z0-9.\-_]{4,39}$`** (5–40 characters, starting with a letter). Examples: `abcde` enabled, `abcd` disabled, `1abcde` disabled, `123-456-7890` disabled. |
| 7.1.2 formatting | 9→3-3-3, 10→3-3-4, 11→3-4-4 | Formatting is **progressive while typing**: 1–3 digits unchanged; 4–6 → `123 45`; 7–10 → `123 456 7`…`123 456 7890`; 11 → `123 4567 8901`. Digit-only input is **capped at 11 digits** (the 12th is ignored). Text input is capped at **40 characters** and is not formatted. Whitespace is stripped. A change that adds a character outside `[A-Za-z0-9._-]` is **rejected as a whole**, so the previous value is kept. |
| 7.1.2 URL paste | "extract the number, keep pwd" | Correct, but this happens **only in `onPaste`**. Typing a URL is rejected because of `:` and `/`. Paste rules are in §2.6: all query params (not only `pwd`) are kept and appended to the join URL. |
| 7.1.2 submit | `GET …/validate` → inline error "Invalid meeting ID. Please check and try again." | **Zoom shows no inline error in the modal.** Join (or Enter) closes the modal at once and SPA-pushes `/wc/{number}/join?fromPWA=1` (pasted params are prepended: `?pwd=…&fromPWA=1`). The Workplace shell stays; the content area shows a white panel with "‹ Back" and an iframe that renders **"This meeting link is invalid (3,001)"**. See §2.8 and the recommendation in §7. |
| 7.1.2 close | "Escape / Cancel / overlay click closes" | Escape closes (if the history dropdown is open, the first Escape closes only the dropdown). Cancel closes. **Overlay click does NOT close** (`shouldCloseOnOverlayClick:false`). The modal is not draggable (`isDraggable:false`). |
| 7.1.2 (missing) | — | While joining, the Join label becomes **"Joining..."** and the button is disabled. The modal closes in the same tick, so this state is barely visible. The deep link **`/wc/join`** redirects (replace) to `/wc/home` with the Join modal open. |
| 5.3 motion | popovers/modals fade+scale [D] | Join modal open and close are **instant**: no CSS transition or animation on the overlay, content or modal, and `closeTimeoutMS` is 0. The history dropdown is instant too. |
| 5.4 Button / secondary hover | "Hover bg `#6E76801F` over `#F1F4F6` [D]" | On the **Join modal Cancel** button, hover and active cause **no visual change**. The PWA rule `.join-meeting-modal__footer .join-meeting-modal__button:first-child{background:#f1f4f6;color:#0d6bde}` (specificity 0,3,0) beats prism's `:where(:hover)` rules (0,1,0). The primary Join button does change: hover `#0C60C8`, active `#084085`. |
| 5.4 focus | `outline:2px solid #4B96F1; offset 2px` | Prism buttons (Cancel, Join): exactly that, but only after keyboard use, when `<html>` has `.prism-navigation-with-keyboard`. Other focusable elements in the PWA (input, history toggle, history items) use the global `outline: 2px solid #2D8CFF; outline-offset: 1px` (history items: offset 0). |
| 5.1 fonts | app stack `system-ui, "SF Pro", …` | `html` uses that stack, but nx-chat's `style.css` (injected into app.zoom.us) sets `body * { font-family: var(--emoji-font,Emoji), system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Liberation Sans", Arial, sans-serif !important }`, so the modal's computed font is that stack. On macOS both resolve to SF; no visual difference [D]. |
| 7.5 invalid page | "portal header + centred text 16px `#222325`, 64px from top" | **Top-level `/wc/{n}/join`**: full marketing/portal chrome (40 px black top bar + 64 px nav = 104 px fixed header, big dark footer `#39394D`). Message `This meeting link is invalid (3,001)`: **400 18px/25.71px `#232333`**, letter-spacing 0.42px, "Almaden Sans", centred, text top **y=195**. `/wc/join/{n}` 302-redirects to `/wc/{n}/join`. **In the PWA (`?from=pwa`, iframe)**: header and footer hidden, message **600 20px/28.57px**, `.box{padding:100px!important}` → text top 142 px inside the iframe. |
| 7.5 pre-join | (spec for a valid meeting) | Not capturable: every fake number yields the invalid page. The real Zoom web-client pre-join (name/preview) was **not** observed; keep PRD §7.5 [D]. |
| 10.3 / invite URL | invite `…/j/{n}?pwd=` opens the pre-join page | On zoom.us, `/j/{n}` is a **launch page** ("Join meeting" + "Join from Zoom Workplace app" + "Join from browser"). It does not validate the number. "Join from browser" goes to `/wc/join/{n}?ref_from=launch&fromPWA=1[&pwd=…]`. See §4. |
| (portal) | — | Portal **zoom.us/join** formatting differs from the modal: a trailing space after 3 and 6 digits (`123 `, `123 456 `), PLN lower-cased, invalid input shows an **inline error under the field** ("Please enter a valid meeting ID."). See §3. |

---

## 2. Join Meeting modal (`https://app.zoom.us/wc/home` → **Join** action button)

### 2.1 Purpose / trigger
- Opened by the Home "Join" action button (`button[aria-label="Join"]`), which dispatches `setModal({name:'joinMeeting', data:{show:true}})`. It is also opened by visiting **`/wc/join`**: `history.replace('/wc/home')`, then the modal opens.
- Component tree: `ZC` (modal shell) → `zC` (view) with controller hook `BC({analyticsFrom:"Join Modal"})`.
- No `window.open` on any path (open mode is `iframe` because `PwaConfig.crossIsolationMode="dip"`; with `enableMeetingRoute=true` the PWA routes in-app).

### 2.2 DOM structure
```
body.prism-light.ReactModal__Body--open
└ div.ReactModalPortal
  └ div.ReactModal__Overlay.ReactModal__Overlay--after-open.join-meeting-modal__overlay.pwa-modal__overlay.pwa-modal__overlay--on  [style z-index:1001]
    └ div.ReactModal__Content.ReactModal__Content--after-open.pwa-modal__content.pwa-modal__content--centered  [role=dialog aria-modal=true tabindex=-1]
      └ div.react-draggable [style display:inline-block; transform:translate(0,0)]   (dragging disabled)
        └ div.join-meeting-modal
          └ div.join-meeting-modal__content
            ├ h2.join-meeting-modal__title  "Join Meeting"
            ├ div.join-meeting-modal__form#joinMeeting
            │ └ div.join-meeting-modal__meeting-id  (position:relative)
            │   ├ label.join-meeting-modal__label[for=join-meeting-modal-meeting-id]  "Meeting ID or Personal Link Name"
            │   ├ input#join-meeting-modal-meeting-id.join-meeting-modal__input[type=text]   (no placeholder, no maxlength attr)
            │   ├ span.join-meeting-modal__history-toggle[role=button tabindex=0 aria-label="Meeting history list" aria-haspopup=listbox aria-expanded]   (only if history.length>0)
            │   │ └ i.zmicon[role=img aria-label="Chevron Small Down"|"Chevron Small Up"] > svg 8×8 viewBox
            │   └ div.meeting-history  (only while open, see 2.7)
            └ footer.join-meeting-modal__footer
              ├ button.prism-Button-root.prism-light.join-meeting-modal__button.prism-Button-default.prism-Button-secondary.prism-Button-medium[aria-label=Cancel] > span.prism-Button-label "Cancel"
              └ button.prism-Button-root.….prism-Button-primary.prism-Button-medium[.prism-Button-disabled][aria-label=Join][aria-disabled=true tabindex=-1 when disabled] > span.prism-Button-label "Join" | "Joining..."
```
The disabled Join button uses `aria-disabled="true"` and `tabindex=-1`, not the `disabled` attribute, so the PWA rule `…:last-child:disabled` never matches. The disabled look comes from prism's `.prism-Button-disabled`.

### 2.3 Measurements (1366×768) [M]
| Element | x, y, w × h | Styles |
|---|---|---|
| Overlay | 0, 0, 1366 × 768 | `position:fixed; inset:0; overflow:hidden; background:#0003` (`rgba(0,0,0,.2)`); z-index 1001 (inline, = modal z counter + 1) |
| Content | 0, 0, 1366 × 768 | `position:absolute; display:flex; align-items:center; justify-content:center; pointer-events:none; background:transparent` (children `pointer-events:visible`) |
| `.join-meeting-modal` | **459, 265, 448 × 238** | `width:min(448px,100vw - 48px); max-height:min(100vh - 40px,520px); padding:32px; background:#fff; border:none; border-radius:32px; box-shadow:0 6px 12px #00000014, 0 12px 24px #00000014; overflow:visible` |
| Title h2 | 491, 297, 384 × 24 | 700 20px/24px `#222325`, letter-spacing −0.45px, margin 0, left aligned |
| Form | 491, 345, 384 × 62 | margin-top 24 |
| Label | 491, 345, 384 × 18 | display block; 400 14px/18px `#222325`; letter-spacing −0.15px; margin-bottom 4 |
| Input | **491, 367, 384 × 40** | `background:#fff; border:1px solid #C1C6CE; border-radius:12px; padding:6px 40px 6px 16px; outline:none(overridden on :focus, see 2.4)`; text 400 14px/18px `#222325`, letter-spacing −0.15px; caret `#222325`; no placeholder |
| History toggle | **843, 375, 24 × 24** | `position:absolute; right:8px; top:30px` (in the field wrapper, 18 label + 4 gap + 8 → centred in the 40 px input); `display:flex; center; border-radius:999px; color:#555B62; cursor:pointer`; hover/focus bg `#F1F4F6` |
| Toggle icon | 848, 380, 14 × 14 | `zmicon` chevron, svg 14×14, `currentColor` (`#555B62`) |
| Footer | 491, 439, 384 × 32 | `display:flex; justify-content:flex-end; gap:16px; margin-top:32px` |
| Cancel | **732.5, 439, 71.5 × 32** | `border:none; border-radius:12px; padding:6px 14px; height/min-height 32; min-width:unset; box-shadow:none; background:#F1F4F6; color:#0D6BDE`; label 400 14px/18px, ls −0.15px (label box 747, 446, 43 × 18) |
| Join (disabled) | **820, 439, 55 × 32** | same box; bg `rgba(173,177,184,.25)` (`#ADB1B840`); label 500 14px/18px `#ADB1B8`; cursor not-allowed |
| Join (enabled) | 820, 439, 55 × 32 | bg `#0D6BDE`; label 500 14px/18px `#FFFFFF`; cursor pointer |

Vertical rhythm: 32 padding → title 24 → 24 → label 18 → 4 → input 40 → 32 → buttons 32 → 32 padding = 238.

### 2.4 States
| Element | State | Style [M] |
|---|---|---|
| Input | default | border 1px `#C1C6CE`, no shadow |
| Input | hover | no rule, no change |
| Input | focus (also mouse focus) | border unchanged `#C1C6CE`; **outline 2px solid `#2D8CFF`, outline-offset 1px** (global `:focus`) |
| Input | autofocus | focused in `onAfterOpen`; also `.select()`ed when the web client closes |
| Input | error | none: the modal has no error state |
| History toggle | hover / focus | bg `#F1F4F6`; on focus also outline 2px `#2D8CFF` offset 1px |
| History toggle | expanded | icon becomes "Chevron Small Up"; `aria-expanded=true` |
| Cancel | hover / active | **no change** (bg stays `#F1F4F6`, text `#0D6BDE`) |
| Cancel / Join | focus-visible (keyboard) | outline 2px solid `#4B96F1`, offset 2px (prism; only with `html.prism-navigation-with-keyboard`, added on first keyboard event) |
| Join | enabled hover | bg `#0C60C8` (`--state-primary-hover`) |
| Join | enabled active | bg `#084085` (`--state-primary-press`) |
| Join | disabled | bg `#ADB1B840`, text `#ADB1B8`, cursor not-allowed, hover/active unchanged, removed from the tab order |
| Join | joining | label `Joining...` (i18n "Joining" + "..."), disabled; the modal closes right away |
| Buttons | transitions | none (computed `transition-duration:0s`) |

### 2.5 Input rules (`P` setter in `BC`) [M, from code and tests]
```
onChange(v):
  v = v.replace(/\s/g,'')
  if v === ''            -> value = ''
  else if /^\d+$/.test(v) -> value = format(v.slice(0,11))
  else if /^[a-zA-Z0-9.\-_]+$/.test(v) -> value = v.slice(0,40)
  else                    -> (no state change → React restores previous value)
format(d): len<=3: d ; 4–6: d[0..3]+' '+rest ; 7–10: d[0..3]+' '+d[3..6]+' '+rest ; 11: d[0..3]+' '+d[3..7]+' '+d[7..]
isReady = /^\d{9,11}$/.test(noSpaces) || /^[a-zA-Z][a-zA-Z0-9.\-_]{4,39}$/.test(noSpaces)
  (PwaConfig.isSupportOneCharPersonalLink is false for this account; when true: /[a-zA-Z]/ && (/^[a-zA-Z]$/ || /^[a-zA-Z0-9][a-zA-Z0-9.\-_]{1,39}$/))
```
Observed results (input → value | Join):

| Input | Value | Join |
|---|---|---|
| `12345678` (typed) | `123 456 78` | disabled |
| `123456789` | `123 456 789` | enabled |
| `1234567890` | `123 456 7890` | enabled |
| `12345678901` | `123 4567 8901` | enabled |
| `12345678901234` | `123 4567 8901` | enabled (truncated) |
| `12 34` | `123 4` | disabled |
| `123 456 789` | `123 456 789` | enabled |
| `123-456-7890` | `123-456-7890` (treated as text) | disabled |
| `abc` / `abcd` | unchanged | disabled |
| `abcde`, `a1234`, `a.b-c`, `a_b_c`, `my-room`, `john.doe` | unchanged (case kept) | enabled |
| `1abcde`, `.abcde`, `-abcde`, `_abcde`, `12345678a` | unchanged | disabled |
| 41 × `a` | first 40 kept | enabled |
| `a b c` | `abc` | disabled |
| `abcde!`, `ab!cd`, `@#$%`, `中文`, `é` | rejected (previous value kept) | — |

### 2.6 Paste (`onPaste`, always `preventDefault`) [M]
1. Read `clipboardData.getData('text')`.
2. Try `new URL(text)`. It is accepted when the protocol is `https:`, the hostname matches `^([^.]+\.)*zoom(dev)?(\.[^.]+?)+$` or `…zoomgov(dev)?…`, and the path starts with `/j/`, `/s/`, `/w/` or `/my/` (number = last path segment) or with `/wc/` (number taken from `/wc/join/(\d{9,11})`, `/wc/(\d{9,11})/join`, `/wc/start/…`, `/wc/(\d{9,11})/start` or `/wc/my/(.+)`). All search params are saved (`{pwd:'…', …}`).
3. Otherwise: `text.split('?')[0].split('/').pop() || text`, and saved params are cleared.
4. Characters outside `[a-zA-Z0-9.\-_]` are removed, then the result goes through the normal setter (formatting, caps).
5. Typing after a paste (`onChange`) clears the saved params.

| Pasted | Result |
|---|---|
| `https://zoom.us/j/12345678901?pwd=abc` | `123 4567 8901`, params `{pwd}` → join URL `/wc/12345678901/join?pwd=abc&fromPWA=1` |
| `https://us05web.zoom.us/j/9876543210?pwd=…` | `987 654 3210` |
| `http://zoom.us/j/12345678901`, `https://example.com/j/12345678901`, `zoom.us/j/12345678901` | `123 4567 8901` (fallback path, no params) |
| `https://zoom.us/my/john.doe` | `john.doe` |
| `https://app.zoom.us/wc/join/12345678901`, `…/wc/12345678901/join?pwd=x`, `/s/…`, `/w/…?tk=a` | `123 4567 8901` |
| `Meeting ID: 123 456 7890` | `MeetingID1234567890` (enabled as a PLN) |

### 2.7 Meeting-history dropdown (`WC`) [M]
- Data: `getHistoryMeetingList()` (the user's previously joined meetings). This account had 1 entry (topic "A B's Zoom Meeting", number shown `810 9876 5432`).
- Open with a toggle click, Enter or Space. `aria-expanded=true`; the first (selected) item is auto-focused.
- Close with Escape on an item (stopPropagation, so the modal stays), a click outside, choosing an item, or Escape/toggle on the toggle. After closing, focus returns to the toggle.
- Choosing an item fills the input with the formatted number (`P(meetingNo)`), closes, and remembers the selected index.
- Last row is **"Clear History"** (`role=button`, `aria-label="Clear History"`): clears the list, closes, and the toggle disappears.

| Element | Measured |
|---|---|
| `.meeting-history` | 491, 411, 384 × 66; `position:absolute; top:calc(100% + 4px); width:100%; z-index:10`; bg `#FFF`; border 1px `rgba(186,186,204,.2)`; radius 8; shadow `0 8px 24px rgba(35,35,51,.1)`; flex column |
| `.meeting-history-list` | inline `height:(n+1)×32px`, max 8 rows (256 px); `overflow:auto`; scrollbar 8 px, thumb `#0000001F` radius 3 |
| `.meeting-history-item` | 382 × 32 (inline `height:32px`), `padding:0 12px`, 13px/24px, flex space-between, user-select none, `role=option`, `aria-selected`, `aria-label="the topic is {topic}, and ID is {number}"` |
| item hover / focus | bg `#0E72ED`; topic and number `#FFF`; outline 2px `#2D8CFF` offset 0 |
| `__topic` | 500 14px/20px `#131619`; flex 1; ellipsis; padding-right 24 |
| `__number` | 400 12px/16px `#6E7680`; format: insert a space after 3 characters and before the last 4 (`810 9876 5432`, `987 654 3210`) |
| Clear History row | `.meeting-history-clear` text 500 14px/20px `#4793F1` (`color:inherit` on topic) |

### 2.8 Keyboard, focus and close behaviour [M]
- **Focus trap** (react-modal): Tab cycles **input → history toggle → Cancel → Join (only when enabled) → input**. Shift+Tab goes in reverse.
- **Enter** in the input calls `onJoin` if `isReady` (otherwise nothing happens). Enter/Space on the toggle toggles the dropdown.
- **Escape**: closes the modal (`shouldCloseOnEsc:true`); focus goes to `<body>`. With the dropdown open, the first Escape closes only the dropdown.
- **Overlay click**: no effect.
- **Cancel**: closes. Reopening starts fresh (empty value, Join disabled).
- **Open/close animation**: none. Open adds `--after-open` classes on the next frame with no transition. Close removes the portal immediately (no `--before-close` phase).

### 2.9 Submitting a fake ID (12345678901) [M]
Sequence observed:
1. Enter or Join → `onJoin`: `isJoining=true` (label "Joining..."), `d.xb.joinMeeting('12345678901', params)`, then `onJoinSuccess` → the modal closes in the same tick (the label change never paints).
2. `history.pushState('/wc/12345678901/join?fromPWA=1')` (with pasted params: `/wc/12345678901/join?pwd=test&fromPWA=1`). About 1.5 s later the same URL is replaced (`replaceState`).
3. **No `window.open`**, no toast, no inline error.
4. The Workplace shell (header + left rail) stays. The content card area is replaced by the web-client panel:

| Element | Measured |
|---|---|
| `div.pwa-webclient` | 80, 68, 1280 × 578 (in this account, a 112 px "Workplace Pro" upsell banner sat below it, y≈650–762; without it the panel fills the content card [D]). Inline `z-index:0; border-radius:8px`; `background:#fff; overflow:hidden; position:absolute` |
| `button.pwa-webclient__back` | 118, 100, 64 × 26 (`left:38px; top:32px`, z 30); `display:flex; align-items:center; background:transparent; border:none; padding:1px 6px; color:#0E71EB; 14px/24px`; text "Back"; icon `i.pwa-webclient__back-icon` "Chevron Small Left" **20×20** `#0E71EB` (`join-chevron-small-left.svg`). Click → `push('/wc/home')`, web client removed |
| `div.pwa-webclient__iframe-wrapper` | fills panel; z 20; transparent |
| `iframe#webclient.pwa-webclient__iframe` | `src=https://app.zoom.us/wc/12345678901/join?from=pwa` (`?pwd=…&from=pwa` when pasted); `border:none; display:block; 100%×100%`; `role=presentation` |
| iframe document | title "Error - Zoom"; `body.body_hide_footer` white; header height 0; `#global-error.mini-layout` `min-height:400px; margin-top:40px`; `.box` `text-align:center; border:0; padding:100px !important` |
| `span.error-message` | iframe-local 467, 142, 332 × 26 → page ≈ 547, 210. Text **"This meeting link is invalid (3,001)"** (source has a line break before "(3,001)" which renders as a space). **600 20px/28.57px `#232333`**, letter-spacing 0.42px, `"Almaden Sans", Helvetica, Arial`, padding-left 4, centred |
| Loading state (before the iframe paints) | `.pwa-webclient__loading`: centred (`translate(-50%,-50%)`), z 30; 32 × 32 spinner PNG rotating 1.5s linear infinite (`rotate-infinite`) [M CSS; not seen live] |

A Personal Link Name would route to `/my/{name}?fromPWA=1` in-app [M code; not exercised, because a real PLN could belong to a real person].

---

## 3. Portal Join page — `https://zoom.us/join`

### 3.1 Structure
```
#header_container (portal header, 64px, fixed; no black top bar on this page)
#content_container.zoom-newcontent [style min-height:872px]  (padding-top 104 → page scrolls; layout width 1351 with scrollbar)
└ #content.main-content
  └ #join-conf.mini-layout (max-width 480; margin 0 auto; padding-top 10; text-align left)
    └ .mini-layout-body
      ├ .page-header[style text-align:center] > h1[style font-size:24px] "Join Meeting"
      └ .box
        └ form#join-form.form-vertical[action="javascript:;"] (max-width 360; margin 0 auto)
          ├ .form-group.confno[style margin-bottom:16px] > .controls
          │   ├ label[for=join-confno][style color:#2a2b2d;font-size:14px;margin-bottom:10px] "Meeting ID or Personal Link Name"
          │   ├ input#join-confno.form-control.input-lg.confno[type=text autocomplete=off maxlength=40 placeholder="Enter Meeting ID or Personal Link Name" aria-describedby=error-span]
          │   └ #errorContainer.wc-new-syle (text-align center)
          │       └ #join-errormsg.error.hideme[role=alert] > i (alert icon) + span#error-span
          ├ .form-group[style margin-bottom:72px] > .controls.wc-new-syle
          │   └ a#btnSubmit.btn.btn-primary.user.submit[role=button href="javascript:;" aria-disabled disabled] "Join"
          └ .form-group > .controls.wc-new-syle
              └ a#btnRoomSystemJoin.doc[href="https://zoom.us/meeting/rooms"] "Join a meeting from an H.323/SIP room system"
#footer_container (fixed bottom, 56px)
```

### 3.2 Measurements [M]
| Element | x, y, w × h | Styles |
|---|---|---|
| Page | — | body bg `#FFF`; font `"Almaden Sans", Helvetica, Arial`; base 14px/20px `#232333`, letter-spacing 0.42px |
| Header | 0, 0, 1351 × 64 | bg `rgba(255,255,255,.97)`, shadow `0 0 2px rgba(0,0,0,.2)`; logo img 110×25 at (24,19); right nav "Support" (828), "Schedule" (922), "Join" (1027) — 600 16px/20px `#666484`, padding `22px 15px`, h 64; "Host ▾" (1106), "Web App ▾" (1188) 600 16px; avatar 32×32 r10 `#9053C2` "AB" 600 14px at (1304,17) |
| `#join-conf` | 435.5, 104, 480 × 374 | padding-top 10 |
| h1 | 435.5, 186, 480 × 26 | **600 24px/26.4px `#222325`**, ls 0.42px, centred, margin `72px 0 48px` |
| Label | 495.5, 260, 232 × 20 | 400 14px/20px `#2A2B2D`, inline-block, margin-bottom 10 |
| Input | **495.5, 290, 360 × 40** | `border:1px solid #C1C6CE; border-radius:12px; padding:0 16px; background:#fff; box-shadow:none`; text **100 (lighter) 15px/32px `#232333`**, ls 0.45px; placeholder `#747487`; `transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out` |
| Join button | **495.5, 346, 360 × 40** | `a.btn`: radius 12, padding `5px 16px`, 400 **16px/31px**, ls 0.48px, centred; border 1px |
| Error row (when shown) | icon 572, 346, 18 × 18; text 590, 347 | `#join-errormsg` margin-top 16, 12px/17.14px, centred; icon `alert.png` 18×18 (`join-portal-alert.png`); span 400 12px `#A94442`, padding-left 4, vertical-align top. The Join button moves down to y=385 |
| H.323/SIP link | 514.5, 459, 322 × 19 | 400 14px/20px `#0D6BDE`, centred; `href=https://zoom.us/meeting/rooms` |
| Footer | 0, 712, 1351 × 56 | `position:fixed; bottom:0; bg white; min-height 56; text-align center`. Span (margin-top 24): "© 2026 Zoom Communications, Inc. All rights reserved." 300 14px `#666` + link "Privacy & Legal Policies" `#747487` → `https://explore.zoom.us/en/legal`. Then (margin-left 8 / ul margin-left 40) language dropdown "English ▾" `#0E71EB` 14px with 4px CSS caret. The menu opens **upward** (`bottom:36px`, min-width 240, padding 8, radius 8, border 1px #fff, shadow `0 6px 12px rgba(0,0,0,.18)`, arrow 6px) with 17 locales: English, Español, Deutsch, 简体中文, 繁體中文, Français, Português, 日本語, Русский, 한국어, Italiano, Tiếng Việt, Polski, Türkçe, Bahasa Indonesia, Nederlands, Svenska |
| Chat bubble | 1275, 692, 56 × 56 | third-party "livesdk" support widget, `#4488FF` circle (skip in the clone [D]) |

### 3.3 States [M]
| Element | State | Style |
|---|---|---|
| Input | focus (mouse) | border `#4B96F1`, no shadow (`.form-control:focus`) |
| Input | focus (keyboard, `body.is-vue3-keyboard-event`) | + outline 2px solid `#4B96F1`, offset 2px |
| Input | error (`.error`) | text and border `#B94A48` |
| Input | error + focus | border `#953B39`, `box-shadow:0 0 6px #D59392` |
| Join | disabled (initial / invalid) | JS inline: `background-color:rgba(82,82,128,.09); border-color:#fff; color:#909096`; attr `disabled` → `.btn[disabled]{pointer-events:none; cursor:not-allowed}` (opacity forced 1 inline) |
| Join | enabled | JS inline: `background-color:#0d6bde; border-color:#0d6bde; color:#fff`; cursor pointer |
| Join | hover | inline bg wins over `.btn.btn-primary:hover{#2681F2}`, so **no colour change** |
| Join | active | `.btn:active` adds `box-shadow: inset 0 3px 5px rgba(0,0,0,.125)` |
| Join | focus | `.btn:focus{outline:5px auto -webkit-focus-ring-color; outline-offset:-2px}` |
| Link | hover | bootstrap `a:hover{text-decoration:underline}` [D colour] |

### 3.4 Behaviour [M]
- Autofocus on the input when the page loads.
- **Typing (keyup, 10 ms delay):** digits-first values go through `SB.formatConfNo` and are capped at 11 digits. A trailing space appears after 3 and after 6 digits: `1`, `123 `, `123 4`, `123 456 `, `123 456 7`, `123 456 789`, `123 456 7890`, `123 4567 8901`. Keypress blocks non-digits and the 12th digit. Text-first values are lower-cased, a leading `.` is removed, and characters outside `[A-Za-z0-9._-]` are dropped (`John.Doe` → `john.doe`). Full-width digits and characters are converted to half-width.
- **Enable rule** (on change, keyup, input, blur): empty → disabled. Digits-first → enabled only at exactly 9, 10 or 11 digits. Otherwise length ≥ 5.
- **Submit** (Enter in the field or the Join button; the handler ignores only `.disabled` class, so Enter still validates):
  - empty → error "Please enter a valid meeting ID."
  - digits-first with a count other than 9–11 → "Please enter a valid meeting ID."
  - text shorter than 3 → "This personal link name is not valid. Please check and re-enter again."
  - valid number → `SB.jump('/j/{digits}?from=join')` (same tab)
  - valid name → `/my/{name}?from=join`
  - Editing hides the error again.
- **Fake ID 12345678901 →** navigates to `https://zoom.us/j/12345678901?from=join`, which is the launch page (§4). No existence check happens here.

---

## 4. Invite-link landing (launch page) — `https://zoom.us/j/12345678901` (also `?pwd=test`, `?from=join`)

The page is identical for all three variants. The number is **not validated**. The document title is "Launch Meeting - Zoom", then "Join from Zoom Workplace app - Zoom". After about 2.5 s the URL gains `#success` (the automatic protocol launch has fired). The embedded browser showed no OS dialog.

### 4.1 Structure and measurements [M]
| Element | x, y, w × h | Styles |
|---|---|---|
| Page | — | font `Inter, "Open Sans", Helvetica, Arial, sans-serif`; bg `#FFF`; no scroll (doc height 768) |
| Header `#header_container` | 0, 0, 1366 × 64 | fixed; bg `rgba(255,255,255,.97)`; shadow `0 0 2px rgba(0,0,0,.2)`; inner `.container` 1200 wide centred; logo svg 115×25 `#0B5CFF` at (107,20) → `/` (`join-launch-zoom-logo.svg`); right: "Support" → `/zendesk/sso?return_to=https://support.zoom.us/hc/en-us` and "English ▾" (margin-left 24), both 400 12px `#0E71EB` |
| Main `#zoom-ui-frame` | 263, 64, 840 × 554 | max-width 840, `min-height:calc(100vh - 214px)`, padding 40, flex column, `justify-content:center`, text-align centre, `role=main` |
| Spinner | 664, 126, 38 × 38 (margin-bottom 12) | ring: `conic-gradient(#fff 2%, #0E72ED)`, radius 50%, inner white disc 26 px, 3 px blue dot at top; `rotate 1.4s linear infinite`. Visible about 2.5 s, then `opacity:0` (transition 0.2s ease-in-out) but still takes up space |
| h1 | 609, 173, 148 × 64 | "Join meeting" — **700 24px/40px `#232333`**, padding 12px 0, margin-bottom 52 |
| Button column | 483, 289, 400 wide | flex column, gap 20, max-width 400 |
| Primary button | **483, 289, 400 × 48** | `zoom-button--lg--primary`: bg `#0D6BDE`; border 1px transparent; radius 8; padding `9px 15px`; label **500 16px/20px #FFF** "Join from Zoom Workplace app". Hover `#0C60C8`, active `#084085`; keyboard focus outline 2px `#4B96F1` offset 2 |
| Secondary button | **483, 357, 400 × 48** | bg `#FFF`; border 1px `#939BA4`; radius 8; label **400 16px/20px `#222325`** "Join from browser". Hover bg `rgba(110,118,128,.12)`, active `.42` |
| hr | — | height 0, margin 8px 0 (invisible spacer) |
| Line 1 (h3) | 303, 421, 760 × 24 | "Don’t have the Zoom Workplace app installed? **Download Now**" — 400 14px/24px `#232333`; link `#0E72ED`, no underline |
| Line 2 (h3, margin-top 20) | 303, 465, 760 × 24 | "By joining a meeting, you agree to our **Terms of Service** and **Privacy Statement**" — links `https://zoom.us/en-us/terms`, `https://zoom.us/en-us/privacy` |
| Footer `#footer` | 291, 642, 784 × 41 | p1 "©2026 Zoom Communications, Inc. All rights reserved." 400 14px/21px `rgba(4,4,19,.56)` centred. p2 links (14px/16px, padding 0 6, margin 2 0, `border-left:1px solid` currentColor on all but the first): Trust Center (`/en-us/trust`), Acceptable Use Guidelines, Legal & Compliance, Do Not Sell My Personal Information, Cookie Preferences |
| "Did not open" popover | 893, 268, 360 × 90 | Appeared after the portal submit, anchored to the right of the primary button; it did **not** appear within 8 s on a direct visit. `div.zoom-popover`: bg `#FFF`, border 1px `#DFE3E8`, radius 8, shadow `0 12px 24px #00000014, 0 6px 12px #00000014`, padding 12, max-width 360. Title "Did not open Zoom Workplace app?" 600 16px/20px `#323539` (mb 4). Body "Please **download** and install the app and click Join from Zoom Workplace app again." 400 14px/20px `#323539`, link `#0E71EB`. Close × 20×20 at top 11 right 12, 16 px icon (`join-close-16.svg`), `aria-label="Close this popover"` |

### 4.2 Targets (hrefs; decoded from `window.launchBase64`) [M]
| Control | Target |
|---|---|
| Join from browser | `https://zoom.us/wc/join/{n}?ref_from=launch&fromPWA=1[&pwd=<token>][&from=join]` |
| Join from Zoom Workplace app | protocol URL built from `{action, confno:{n}, pwd, uname, tk, …}`; scheme **`zoommtg://`**, or **`zoomus://`** on macOS/mobile (`Ks()`). Fired automatically on load through a hidden iframe. **Not clicked.** |
| Download Now / "download" | `https://zoom.us/launch/download/<token>` (fallback `https://zoom.us/download`) |
| PWA variant (not shown as a button here) | `https://app.zoom.us/wc?mn={n}&ref_from=launch[&pwd=<token>]` |

---

## 5. Invalid meeting link page — `https://app.zoom.us/wc/join/12345678901` and `https://app.zoom.us/wc/12345678901/join`

- `/wc/join/{n}` **redirects** (HTTP, `redirectCount=1`) to `/wc/{n}/join`. Both render the same server page; title **"Error - Zoom"**.
- Top-level, this is a full portal page with no Workplace shell:

| Element | x, y, w × h | Styles [M] |
|---|---|---|
| Body | 0, 0, 1351 × 1043 (scrolls) | bg `#39394D` (footer colour shows below content); font `"Almaden Sans", Helvetica, Arial` |
| Black top bar `nav#black-topbar` | 0, 0, 1351 × 40 | bg `#00031F`; right items: "Search" (icon 20 + 300 14px/40px #FFF), "Support", "1.888.799.9666" (tel:), "Contact Sales", "Request a Demo": 300 14px `#FFF`, ls 0.42px |
| Nav bar | 0, 40, 1351 × 64 | bg `rgba(255,255,255,.97)`; logo img 110×25 at (24,59); "Products" / "Solutions" / "Resources" dropdown buttons 500 16px/52px `#666484` (radius 20 20 0 0, padding 0 15, chevron 20 px); "Plans & Pricing" 500 16px; right: "Schedule" → `/meeting/schedule`, "Join" → `/join`, "Host ▾", "Web App ▾", avatar 32 r10 at (1304,57) |
| `#content_container.zoom-newcontent` | 0, 0, 1351 × 544 | bg `#FFF`; padding-top 104 (under the fixed 104 px header) |
| `#global-error.mini-layout` | 0, 144, 1351 × 400 | inline `min-height:400px; margin-top:40px` |
| `.box` | 0, 144, 1351 × 126 | inline `text-align:center; border:0`; CSS `padding:50px; font-size:18px` |
| `span.error-message` | **530.5, 195, 290 × 23** | "This meeting link is invalid (3,001)" — **400 18px/25.71px `#232333`**, ls 0.42px, padding-left 4, vertical-align top |
| Footer `#footer_container` | 0, 544, 1351 × 500 | bg `#39394D`; `display:table` columns with padding `0 12px 0 24px`: **About** (24), **Download** (257), **Sales** (513), **Support** (758), **Language** + **Currency** (1003). Headings 600 16px/17.6px `#EAEAEA`; links 400 14px/24px `#FFF` (one per row, 24 px apart, list starts 34 px below the heading); Language/Currency dropdown toggles: border 1px `rgba(255,255,255,.3)`, radius 4, padding 4 15 ("English ▾", "Indian Rupee ₹ ▾"); social icons 36×36 circles (sprite `social_icons_footer.png`): WordPress, LinkedIn, X, YouTube, Facebook, Instagram. Bottom `.info` row (y≈712 when scrolled; 14px #FFF centred, padding 20 0): "Copyright ©2026 Zoom Communications, Inc. All rights reserved." + Terms · Privacy · Trust Center · Acceptable Use Guidelines · Legal & Compliance · Your Privacy Choices · Cookie Preferences (links padding 0 6) |

- **`?from=pwa` variant** (the iframe inside the Workplace app; §2.9): `body.body_hide_footer`, header height 0, `#content_container.content_container_hide_header{padding-top:0}`; inline `<style>`: `.error-message{font-size:20px;font-weight:600}` and `.box{padding:100px!important}` → text at (510,142) 332×26 in a 1366 viewport.
- Footer link list (verbatim, top-level page): About — Zoom Blog, Customers, Our Team, Careers, Integrations, Partners, Investors, Press, Sustainability & ESG, Zoom Cares, Media Kit, How to Videos, Developer Platform, Zoom Ventures, Zoom Merchandise Store · Download — Zoom Workplace App, Zoom Room Apps, Zoom Rooms Controller, Browser Extension, Outlook Plug-in, Android App, Zoom Virtual Backgrounds · Sales — 1.888.799.9666, Contact Sales, Plans & Pricing, Request a Demo, Webinars and Events, Zoom Experience Center · Support — Test Zoom, Account, Support Center, Learning Center, Zoom Community, Feedback, Contact Us, Accessibility, Developer support, Privacy, Security, Legal Policies, and Modern Slavery Act Transparency Statement.

---

## 6. Other observations
- `/wc/join` (no number), signed in → redirect to `/wc/home` + Join modal. For guests or Tesla mode, a full-page variant exists (`.join-page`, z 700, white; `.join{margin:148px auto 0; width:60%; min-width:300px}`; title 700 24px/32px; input `.join-meetingId` 40 h, border 1px `#909096`, radius 10, 15px; buttons `.btn-cancel`/`.btn-join`) [M CSS; not rendered for this account].
- Join modal z-index increments per opened modal (`modalZIndex+1`); body gets `ReactModal__Body--open` with no scroll-lock styles.
- `PwaConfig`: `crossIsolationMode:"dip"`, `enableMeetingRoute:true`, `isSupportOneCharPersonalLink:false`. Open mode `"tab"` (which would use `window.open` plus a "popup blocked" toast with Retry) is **not** active for this account.
- The Home avatar showed `is-meeting` status because another agent was hosting a meeting; it did not affect the modal.

## 7. Recommendations for the clone [D]
1. Build the modal pixel-exact as in §2.3 and §2.4, including the history toggle. Back it with `localStorage['zc.join_history']`: `{number, topic}` saved on successful join. Hide the toggle when the list is empty.
2. Copy the input rules exactly (§2.5 and §2.6).
3. To match Zoom, Join should **navigate** to `/wc/{n}/join?pwd=…` (no in-modal validation) and let the pre-join page render the **invalid page** (§5, PWA variant: 600 20px `#232333`, centred, with a "‹ Back" link at 38/32 that returns to `/wc/home`). If the team keeps PRD's inline error as a UX improvement, mark it as a deliberate deviation.
4. Optionally add `/j/{n}` as a launch page (§4) whose "Join from browser" goes to `/wc/{n}/join?pwd=…`; "Join from Zoom Workplace app" can be a no-op or hidden.
5. No modal animations; overlay click must not close the modal.

## 8. Saved assets
**Screenshots** (`docs/reference/screens/`):
1. `join-01-modal-empty.jpg` — modal at open (history toggle visible, Join disabled)
2. `join-02-modal-history-open.jpg` — history dropdown open (first item focused/blue, "Clear History")
3. `join-03-modal-filled-focused.jpg` — `123 4567 8901`, focus outline, Join enabled
4. `join-04-modal-submit-invalid-inapp.jpg` — after Join: in-app web-client panel with "Back" + "This meeting link is invalid (3,001)"
5. `join-05-portal-join-empty.jpg` — zoom.us/join default
6. `join-06-portal-join-filled-focused.jpg` — focused, 11-digit formatted, Join enabled
7. `join-07-portal-join-error.jpg` — "Please enter a valid meeting ID." error state
8. `join-08-launch-page-from-portal.jpg` — zoom.us/j/12345678901 launch page with "Did not open Zoom Workplace app?" popover
9. `join-09-wc-invalid-link-toplevel.jpg` — app.zoom.us/wc/12345678901/join top-level invalid page
10. `join-10-wc-invalid-link-footer.jpg` — same page scrolled to the footer

**Icons** (`docs/reference/icons/`):
| File | Use | Rendered size / colour |
|---|---|---|
| `join-chevron-small-down.svg` | history toggle (closed) | 14×14, `#555B62` |
| `join-chevron-small-up.svg` | history toggle (open) | 14×14, `#555B62` |
| `join-chevron-small-left.svg` | web-client "Back" | 20×20, `#0E71EB` |
| `join-close-16.svg` | launch-page popover close | 16×16 in 20×20 button, `#222325` [D colour] |
| `join-launch-zoom-logo.svg` | launch-page header logo | 115×25, `#0B5CFF` |
| `join-portal-alert.png` | portal join error icon | 18×18 PNG (red circle "!") |
