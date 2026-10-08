# PRD — Zoom Workplace Web Clone

**Version** 2.0 · **Date** 2026-10-07 · **Deadline** 1 day from assignment receipt
**Source assignment:** `assignment.pdf` (Scaler SDE Fullstack — Video Conferencing Platform / Zoom Clone)
**Status:** master spec. Merges the measured captures in `docs/requirements/01–08` into v1.0.

### Changelog v1.0 → v2.0
1. **Measured values everywhere.** About 400 [D] guesses replaced by [M] values from the live DOM, Zoom's CSS and Zoom's JS (shell, Home, calendar widget, Join modal, Meetings tab, portal Schedule/detail, room, pre-join).
2. **Design system rewritten (§5).** Two token systems (zoom-ui `#222325` vs Prism `#2A2B2D`), translucent hover/press states (`#6E76801F` / `#6E76806B`), two tooltip styles, real motion values, three focus models plus one clone rule, PWA vs meeting-client avatar palettes, real toast styles.
3. **Home (§7.1).** The calendar widget shows **one day at a time** (Today / prev / next / date picker), with Zoom's real event-card CSS. Real New-meeting popover and PMI submenu. Search dialog, History popover, Activity Center and profile menu are specified.
4. **Join (§7.2).** Zoom's real rules: 9–11 digits or a 5–40 character personal link name, progressive formatting, paste parsing, history chevron, no overlay-close, no animation. The invented inline error is **removed**. Unknown IDs now show Zoom's own **"This meeting link is invalid (3,001)"** page.
5. **Meetings tab and portal (§7.4–7.8).** Real list-item order and 123px items, 2px divider, "Starts in N minutes" / "NOW" notices, "Copied!" tooltip, real Delete modal. Portal header is **104px** (black strip + nav) with the real side menu. Schedule rows use real values (15-min times, Basic duration rules, 149 time zones, real states). The detail page uses the real **160px** label grid and a sticky action bar.
6. **Pre-join (§7.10)** is now Zoom's real **dark** page ("Enter Meeting Info", 700×394 preview, 392px form).
7. **Room (§8).** Real gallery algorithm (no gap, 60px padding), default **Speaker view**, real active-speaker ring `#48DD5D`, auto-hide 3000 ms, real toolbar groups / overflow / labels (toolbar Video label is always **"Video"**). Separate host and attendee toolbars, with **Leave** (`mtg-leave.svg`) for attendees. Host tools is a **right panel**. Real invite modal (702×542), More menu, Mute-All dialog (Cancel / Continue), participant More menu, toast lifetimes, End/Leave popovers.
8. **Responsive (§11).** Real breakpoints (1440 / 1080 / 1024 / 768 / 767). Zoom **never changes the rail**. Clone-only phone rules are marked [D].
9. **Data/API (§9–10).** Additions needed by the UI: soft delete (`deleted_at`, because Zoom's Delete copy promises 7-day recovery), per-day list endpoint for the Home widget, contacts endpoint for the invite list and invitee suggestions, `DUPLICATE_SESSION` error, Basic-plan duration rule (0 hr + 0/15/30/40 min). Chat tables/messages are kept only as optional future work.
10. **Acceptance checklist (§16)** rewritten with measured numbers. **§17** pruned to the gaps that remain.
11. **Scope narrowed to the assignment PDF (user decision).** Everything is built as an exact visual replica, but only the assignment's features are functional. Chat, reactions, screen share, captions, whiteboards, breakout rooms, AI, search, Activity Center, calendar connect, waiting room, hub entries and login are **"Static UI only (no-op)"** (§2). Chat is no longer part of the required realtime protocol (§9). Code must follow modern engineering guidelines (§0.5).

---

## 0. How to use this document (read first, every agent)

1. This PRD is the **single source of truth**. If a value here conflicts with your intuition or with "how Zoom usually looks", **this document wins**. All [M] values were measured live on 2026-10-07 at a **1366×768** viewport (DPR 1 unless noted) from `app.zoom.us` (PWA 7.2.0.3239), `zoom.us` (portal) and the web meeting client 7.2.0 (12783.ufb8n9u).
2. Coordinates such as `x=576 y=228 56×56` are absolute page pixels at 1366×768. They are there so you can **verify** placement. Build with flex/grid and the stated sizes and gaps, **not** absolute positioning (unless the spec says `position:absolute`).
3. The spec files under `docs/requirements/` are the raw captures. This PRD inlines every value needed to build. Only very long raw material (verbatim CSS appendices, the full time-zone list, full icon inventories) is referenced with "see `docs/requirements/NN-*.md` §X".
4. `docs/reference/screens/` contains the real account's name, PMI and camera frames. It is **git-ignored** and must never be committed or deployed. This PRD uses fake example values only (user "Alex Morgan", PMI `512 345 6789`, meeting `812 3456 7890`).

### 0.1 Legend
| Mark | Meaning |
|---|---|
| **[M]** | Measured from DOM / computed style / Zoom CSS / Zoom JS. Build exactly. |
| **[D]** | Derived or decided by us (not observable). May be tuned to look right next to [M] values. |
| **P0 / P1 / P2** | P0 = must ship (assignment core). P1 = should ship (bonus or strong fidelity). P2 = nice to have. Never start a P1 before every P0 in the same area works end-to-end. |
| **Static UI only (no-op)** (also written "static") | Outside the assignment's functional scope (§2.2). Render it pixel-perfect so the layout and visual states (hover, open/closed panels and menus) match Zoom. It changes no data and sends nothing: clicking does nothing, opens the static UI, or shows the light toast "This feature isn't available in this demo." (§5.8.13). |
| **Deviation from Zoom (assignment requirement)** | We knowingly differ from Zoom because the assignment requires it. Each one is listed in §2.3. |

### 0.2 Spec files (raw captures)
| File | Covers |
|---|---|
| `docs/requirements/01-shell-home.md` | Workplace header, rail, content card, Home, calendar widget (Appendix A = widget CSS), Search dialog, Activity Center, profile menu, rail placeholder pages, Settings modal |
| `docs/requirements/02-meetings.md` | Workplace Meetings tab, portal Meetings list (Upcoming/Previous), Personal Room detail, Copy Invitation dialog, invalid meeting ID page (Appendix 1–3 = CSS + strings) |
| `docs/requirements/03-schedule.md` | Portal chrome (104px header, side menu, footer), Schedule form row by row, every control and state, dropdown contents, recurrence, Edit (PMI). Appendix A = component CSS, **Appendix B = 149 time zones** |
| `docs/requirements/04-join.md` | Join modal (rules, paste, history), in-app web-client panel, portal `zoom.us/join`, `/j/{n}` launch page, invalid-link page |
| `docs/requirements/05-meeting-room.md` | Host in-meeting UI, menus, panels, dialogs, two-participant states. Appendix A = room CSS, B = auto-hide/toast JS, C = gallery constants |
| `docs/requirements/06-design-system.md` + `06-tokens.css` | Component families, states, type/spacing/radius/shadow/z-index/motion/focus, breakpoints. Appendix B = raw CSS per component. `06-tokens.css` = paste-ready tokens (6 layers incl. dark) |
| `docs/requirements/07-responsive.md` | Measurements at 1920/1440/1280/1024/768/390, breakpoint catalogue, clone rules |
| `docs/requirements/08-prejoin-and-live-media.md` | Real guest pre-join page (dark), audio-level meter, attendee in-meeting states |
| `docs/requirements/_AGENT_RULES.md` | Capture method (for future capture agents only) |

### 0.3 Reference assets
- `docs/reference/icons/` — **180 files**, Zoom's real SVGs (and a few PNGs) extracted from the DOM. Single-colour SVGs use `fill="currentColor"`; multi-colour ones keep their fills. Copy them into `frontend/public/icons/` or inline them as React components. The per-area inventory is in §5.9.
- `docs/reference/zoom-tokens.json` — Zoom's full `--zoom-color-*` token set (light and dark).
- `docs/requirements/06-tokens.css` — paste this into `frontend/styles/tokens.css` as-is (§5.2).

### 0.4 Reference screenshot index (`docs/reference/screens/`, 152 files, 800px wide)
Compare your build against these at 1366×768. Files 18–23 were captured at 1512 wide (the layouts are centred, so sizes hold).

| Prefix / files | Shows |
|---|---|
| **Original set** `01-home` · `02-home-new-meeting-dropdown` · `03/04-join-modal-empty/filled` · `05-meetings-tab` · `06/07/08-schedule-top/middle/bottom` · `09-schedule-datepicker` · `10-meeting-initial` · `11-meeting-toolbar` · `12-meeting-participants-panel` · `13-meeting-invite-modal` · `14-meeting-chat-panel` · `15-meeting-info-popover` · `16-meeting-more-menu` · `17-meeting-end-dialog` | v1.0 references (Home with promo, popovers, room states) |
| **Live media / attendee** `18-prejoin-guest-dark` · `19-meeting-attendee-speaker-view` · `20-meeting-view-menu` · `21-meeting-gallery-2` · `22-meeting-attendee-participants` · `23-meeting-attendee-leave` | Guest pre-join page; attendee toolbar, view menu, 2-tile gallery, attendee participants panel, Leave popover |
| **home-** `01-overview` · `02-search-dialog` · `03-activity-center` · `04-profile-menu-status` · `05-profile-menu-help` · `06-about-modal` · `07-new-meeting-pmi-submenu` · `08-calendar-empty-no-promo` · `09-calendar-date-picker` · `10-chat-tab` · `11-contacts-tab` · `12-settings-dialog` | Shell and Home details (spec 01) |
| **join-** `01-modal-empty` · `02-modal-history-open` · `03-modal-filled-focused` · `04-modal-submit-invalid-inapp` · `05-portal-join-empty` · `06-portal-join-filled-focused` · `07-portal-join-error` · `08-launch-page-from-portal` · `09-wc-invalid-link-toplevel` · `10-wc-invalid-link-footer` | Join flows (spec 04) |
| **mtg-** `01-meetings-tab-pmi` · `02-copy-invitation-copied-tooltip` · `03-show-meeting-invitation` · `04-add-calendar-popover` · `05-meetings-list-simulated-items` · `06-scheduled-detail-now-notice` · `07-delete-meeting-confirm` · `08-meetings-list-scrolled-recurring-group` · `09-private-meeting-detail` · `10-meetings-loading` · `11-portal-upcoming-empty` · `12-portal-previous-empty` · `13-portal-previous-daterange-picker` · `14-portal-previous-list-simulated` · `15-portal-upcoming-list-simulated` · `16-portal-copy-invitation-dialog` · `17-portal-personal-room-detail` · `18-portal-meeting-invalid-id` · `19-portal-templates-empty` · `20-portal-schedule-split-menu` | Meetings tab and portal meeting pages (spec 02). 05/06/08/09/14/15 show injected demo data |
| **sch-** `01-top` · `02-middle` · `03-advanced` · `04-bottom-footer` · `05-topic-error-description` · `06-datepicker-day` · `07-datepicker-year` · `08-time-dropdown` · `09-timezone-filter` · `10-recurring-daily` · `11-recurring-monthly` · `12-recurring-nofixedtime` · `13-invitee-suggestion` · `14-invitee-added` · `15-passcode-rules` · `16-e2e-encryption` · `17-region-dialog` · `18-interpretation` · `19-edit-pmi` | Schedule page and Edit PMI (spec 03) |
| **room-** `01-initial-host-toast` · `02-bars-visible-permission-bar` · `03-meeting-info-popover` · `04-encryption-popover` · `05-view-menu` · `06-view-sort-gallery-submenu` · `07-gallery-view-1p` · `08-audio-caret-menu` · `09-video-caret-menu` · `10-participants-caret-menu` · `11-host-tools-participants-panel` · `12-host-tools-panel` · `13-react-picker` · `14-react-all-emoji-picker` · `15-more-menu` · `16/17/18-settings-general/video/audio` · `19-show-captions-dialog` · `20-breakout-create-window` · `21-participants-panel` · `22-participants-popout-window` · `23-mute-all-dialog` · `24-participants-footer-more` · `25-invite-contacts` · `26-invite-email` · `27-chat-panel-first-open` · `28-chat-composer-with-text` · `29-chat-format-bar` · `30-chat-emoji-picker` · `31-speaker-view-2p` · `32-gallery-view-2p` · `33-participants-2p-guest-more-menu` · `34-stacked-panels-recipient-menu` · `35-participants-minimized-chat-expanded` · `36-end-popover` · `37-fullviewport-client` | Host meeting room (spec 05) |
| **resp-** `home-{1920,1440,1280,1024,768,390}` · `meetings-{…}` · `joinmodal-{…}` · `schedule-{…}` · `join-{1920,1440,1280,1024,768,390}` · `join-390-desktopUA` | Responsive captures (spec 07), 31 files |

### 0.5 Engineering guidelines
All code must adhere to clean architecture: clear separation of concerns, descriptive naming, strict typing, complete test suites, and consistent lint and formatting standards.

---

## 1. Product summary

Build a web clone of the **Zoom Workplace web app** (`app.zoom.us/wc/home`), the Zoom web-portal **Schedule Meeting** and **meeting detail** pages, and the Zoom **web meeting client** (pre-join + room). It must look and behave like Zoom: create instant meetings, join by ID or invite link, schedule meetings, see upcoming and recent meetings, and hold a real multi-party audio/video meeting with participants, chat and host controls.

### 1.1 Goals
- **G1 Visual parity:** at 1366×768, Home, the Join modal, the Meetings tab, the Schedule page, the meeting detail page, the pre-join page and the meeting room are visually indistinguishable from the reference screenshots (colours, sizes, type, radii, spacing, icons, states).
- **G2 Functional core:** all four assignment "Must Have" features work end-to-end against a FastAPI + SQLite backend.
- **G3 Real meetings:** two or more browsers can join the same meeting and see/hear each other (WebRTC), see the live participant list, mute/unmute themselves, turn video on/off, copy the invite link, leave or end; the host can Mute All, mute one participant and remove a participant (bonus).
- **G4 Gradeable engineering:** clean modular code, a well-normalised schema, seed data, README, public repo, deployed URL.

### 1.2 Non-goals (functional) — rendered as "Static UI only (no-op)"
In-meeting chat (sending/receiving), reactions, raise hand, screen share, captions, whiteboards, breakout rooms, AI features, global search, Activity Center, calendar connect, waiting room, recordings/summaries/notes, Team Chat, Contacts, billing/upgrades, phone dial-in, E2E encryption, login/signup, horizontal scaling of the signalling server. Where Zoom shows any of these, render it pixel-perfect (§2.2) so the screens match, but it does nothing.

### 1.3 Hard constraints (from the assignment)
| Constraint | Value |
|---|---|
| Frontend | **Next.js** (App Router, TypeScript) used as a single-page app: client-side navigation, no full reloads between screens |
| Backend | **Python + FastAPI** |
| Database | **SQLite**, own schema (graded) |
| Auth | None required: a seeded default user is "logged in" |
| Data | Database must be **seeded** |
| Repo | Public GitHub repo with a **README** (setup, stack, assumptions) |
| Deploy | Frontend + backend deployed (e.g. Vercel + Render/Railway) |
| Originality | Write all code from scratch. Do not copy code from Zoom-clone repos or Zoom's JS/CSS source; re-implement from these specs |

---

## 2. Scope & priorities

**Scope rule (user decision, v2.0):** implement **only what the assignment PDF scopes**, but as an **exact visual replica**. Everything else Zoom shows is rendered pixel-perfect as **"Static UI only (no-op)"**.

### 2.1 Functional features
| ID | Feature (assignment item) | Priority |
|---|---|---|
| F1 | Workplace shell: header (64px) with **profile and settings placeholders** (avatar → static profile menu; rail Settings → static Settings modal), left rail (80px; Home and Meetings functional), content card | P0 (Settings modal P1) |
| F2 | Home ("Landing Dashboard"): clock/date, **New meeting / Join / Schedule** buttons, New-meeting popover (Use PMI), **Upcoming meetings** = calendar widget (one day at a time), **Recent meetings card** | P0 |
| F3 | Instant meeting: unique 11-digit Meeting ID, passcode, shareable invite link, redirect into the room as host | P0 |
| F4 | Join by Meeting ID **or** invite link: Join modal with Zoom's input rules, in-shell web-client panel, **existence validation** ("This meeting link is invalid (3,001)"), dark **pre-join page with display name** | P0 |
| F5 | Schedule: Topic, Description, Date & Time picker (date + 15-min time + AM/PM), Duration, Time Zone, Meeting ID, Passcode, Video, Options; auto-generated link; stored in SQLite; meeting detail page; **shown in Upcoming** | P0 |
| F6 | Meetings tab (viewing/managing scheduled meetings): Upcoming list + PMI card + detail (Start, Copy Invitation, Show invitation) and a **Previous** view (recent meetings) | P0 |
| F6b | Edit (`/meeting/{n}/edit`) and Delete (confirm modal, soft delete) | P1 |
| F7 | Meeting room UI: header (info popover with invite link + copy), stage (speaker + gallery views), toolbar, **participants panel**, End/Leave | P0 |
| F8 | Real-time: WebRTC mesh audio/video, WebSocket signalling, live roster, **mute/unmute self, video on/off** (state reflected for everyone), leave / end for all | P0 |
| F15 | Invite / copy link: Participants caret "Copy invite link", Invite modal (Copy URL, Copy Invitation, Email tab opens mail compose) | P0 (copy link) / P1 (modal) |
| F9 | **Bonus — host controls:** Mute All (dialog Cancel/Continue), mute one participant, remove participant | P1 |
| F10 | **Bonus — responsive layout** (mobile, tablet, desktop) | P1 |
| F17 | `/j/{n}` launch page ("Join from Zoom Workplace app" / "Join from browser") | P1 (P0 = plain redirect to the pre-join page) |
| F21 | Fidelity extras that need a little code: History popover, tooltips, "Copied!" feedback, Meetings time notices, invitee autocomplete on Schedule, Join-modal history | P1 |
| F20 | Recurrence sub-form, personal link names, "Add to calendar" (.ics) | P2 |

### 2.2 "Static UI only (no-op)" — render pixel-perfect, no behaviour
| Area | Items |
|---|---|
| **Out of functional scope (user list)** | **In-meeting chat** (Chat button toggles the panel; the panel, coachmark, "Who can see your messages?" bar, recipient pill and composer render; typing is allowed but Send/Enter does nothing and no message is shown or stored) · **Reactions** (React picker may open; choosing does nothing) · **Screen share** (Share button and caret: no-op) · **Captions** · **Whiteboards** · **Breakout Rooms** · **AI** (Zoom AI header button, Schedule "Zoom AI" row) · **Search** (header search trigger / ⌘K: no-op, or opens the static dialog of §6.4 — P2) · **Activity Center** (bell: no-op, or toggles the static panel of §6.5 — P2) · **Calendar connect** ("Add a calendar", Schedule calendar banners, "Open Calendar") · **Waiting room** (Schedule checkbox is stored but has no runtime effect; Host tools "Enable waiting room" switch is static) · **Recordings / Summaries / My Notes** hub entries · **Login / Signup** (profile-menu Add account / Sign out) |
| Shell | Header Admin Center, Download, Upgrade; profile-menu Profile, Plans and billing, Help submenu, "Get more from Zoom" banner, "Download the Zoom app"; status submenu (P2: local glyph only); Settings modal contents; Chat and Contacts rail pages (placeholder screens, P1) |
| Home | Calendar "…" filters (Refresh works); promo carousel omitted |
| Portal | Black strip links, Products / Solutions / Resources / Plans & Pricing, Host ▾, Web App ▾ (except links to Home/Meetings), side-menu items other than Home and Meetings, "Upgrade to Pro", footer |
| Schedule | Template, Whiteboard, Docs, Encryption, Zoom AI, Workflow, My Notes, Meeting chat, Interpretation, region dialog, Recurring sub-form (P2 functional), Basic-plan and calendar banners |
| Meeting detail | Add to (Google / Outlook / Yahoo; P2 .ics), Encryption, My Notes, Save as Template |
| Room | Zoom AI, Switch to Zoom Workplace Client, Encryption popover "Report" / "Security settings", View menu items other than Speaker View / Gallery View / Fullscreen / Hide Self View, Join Audio / Leave computer audio, Test Speaker & Microphone, Microphone modes, Blur my background, Choose Background, Audio/Video Settings modal, Host tools panel (all switches and drill-ins; **"Mute All" lives in the Participants panel**), Lock Meeting, Make Host, Rename, Ask to Unmute, Stop Video (of others), Add Pin, Allow to Multi-pin, Put in Waiting Room, Report, Hide profile pictures, Suspend Participant Activities, Stop Incoming Video, Zoom Rooms invite tab, Contacts invite tab (list renders, Invite button stays disabled), chat File transfer / format bar / emoji picker / More chat options, panel Pop Out, meeting topic rename in the info popover (input renders; edits revert on blur) |

### 2.3 Deviation register — "Deviation from Zoom (assignment requirement)"
| # | Where | Zoom does | We do | Why |
|---|---|---|---|---|
| DV1 | Home §7.1.9 | No "Recent meetings" section | Add a **Recent meetings** card under the calendar widget, styled with the widget's own CSS (past-event cards) | Assignment: "Recent meetings section" |
| DV2 | Home §7.1.8 | Empty day shows only the beach illustration | When the selected day is empty but a later day has meetings, also show a "Next: {EEE, MMM d}" text button (Zoom's `.no__events--schedule` style) that jumps there | Assignment: scheduled meetings must be visible in "Upcoming" from Home |
| DV3 | Meetings tab §7.4.2 | Header is the static word "Upcoming"; Workplace has no Previous view | Header is a two-segment control **Upcoming \| Previous** | Assignment: recent meetings with details |
| DV4 | Schedule §7.6 | Opens the portal page in a new browser tab | Same tab, client-side route `/meeting/schedule` with the portal look | Assignment: SPA |
| DV5 | Edit §7.4 / §7.7 | `window.open(app.zoom.us/meeting/{n}/edit?from=pwa)` | Same tab `/meeting/{n}/edit` | SPA |
| DV6 | Schedule save §7.6.7 | Saved to Zoom cloud | Saved to our SQLite; appears in Home widget (for its day), Meetings → Upcoming and the detail page | Assignment |
| DV7 | Pre-join §7.10 | Zoom checks existence server-side and shows "This meeting link is invalid (3,001)" | **Same** (adopted). Our backend's `validate` endpoint drives it | Assignment: "Validate meeting existence" is satisfied by Zoom's own behaviour |
| DV8 | Pre-join / reCAPTCHA | Shows "Zoom is protected by reCAPTCHA…" | Omit the reCAPTCHA line (we don't use reCAPTCHA) | Honesty |
| DV9 | Guest leaves §8.14 | Signed-out guest lands on the Workplace sign-in page | Guest lands on `/wc/{n}/left` | No auth |
| DV10 | Room phones §11 | Not measured | ≤767px the room is always full-viewport, toolbar reduced, panels as sheets [D] | Usability bonus |
| DV11 | Meetings tab, Meetings list, Join on phones §11 | Zoom clips the detail pane at 390 | List full width, detail pushed full screen [D] | Usability bonus |
| DV12 | Calendar "Open Calendar" §7.1.6 | Opens Zoom Calendar (zcal.zoom.us) in a new tab | Navigates to `/wc/meetings` | No calendar product |

---

## 3. Users, identity & roles (no-auth model)

- **Default user** (seeded, `users.id = 1`): name `Alex Morgan` (initials **AM**), email `alex.morgan@example.com`, PWA avatar colour `#9053C2` (purple, the colour Zoom gives the current user), PMI = 10-digit number generated at seed time (examples here use `512 345 6789`), timezone `Asia/Kolkata`. The UI displays times in the **browser's** time zone; the stored user timezone is the fallback default for new schedules. Name and email can be overridden with env `SEED_USER_NAME`, `SEED_USER_EMAIL`.
- Because every browser is "the default user", the **role in a meeting is decided by the entry path**, not by the account:
  - **Host**: entering via *New meeting*, *Start* (Home event-card button or "…" menu, Meetings tab, meeting detail page; *New meeting* with "Use my PMI" starts the PMI) → `POST /start`. If the instance already has a connected host, the newcomer joins as `attendee`.
  - **Attendee**: entering via the *Join* modal, an invite link `/j/{number}?pwd=…`, or `/wc/{number}/join`.
- Each browser gets a persistent `client_id` (UUID v4 in `localStorage['zc.client_id']`). The last display name is stored in `localStorage['zc.display_name']` when "Remember my name for future meetings" is checked. Join-modal history lives in `localStorage['zc.join_history']` (§7.2.6).
- **Host transfer:** if the host leaves without ending, the host role passes to the attendee with the earliest `joined_at` (needed so Leave works; no UI to choose). That client shows the toast **"You are host now."** [M] for **3000 ms** [M]; everyone else gets **"{name} is the host now."** for 3000 ms [M]. (Zoom shows an "Assign a new host" step before the host leaves [J]; we skip it.)
- **Meetings with no host connected** (attendee joined a `join_before_host` meeting first): the meeting runs without a host; host-only controls are hidden. The first browser that uses a *Start* path becomes host.

---

## 4. Architecture

```
Browser (Next.js SPA, Vercel)
 ├─ REST  → FastAPI  /api/*          (meetings, join, users)  → SQLite (SQLAlchemy 2)
 ├─ WS    → FastAPI  /ws/meetings/{number}?token=…   (signalling, roster, chat, host commands)
 └─ WebRTC P2P mesh between participants (STUN stun:stun.l.google.com:19302; optional TURN via env)
```

- **Frontend:** Next.js 14/15 App Router, TypeScript strict, React 18/19. Styling: **CSS Modules + global CSS variables** (`styles/tokens.css` = `docs/requirements/06-tokens.css` plus the room palette in §5.2.4). No Tailwind, no UI kit: every component is hand-built to these specs. Server state: TanStack Query. Room state: one `useReducer` or Zustand store. Dates: `date-fns` + `date-fns-tz`.
- **Backend:** FastAPI, Pydantic v2, SQLAlchemy 2.0 ORM, SQLite file `backend/data/zoom.db`, Uvicorn. Tables are created on startup (`Base.metadata.create_all`) and seeded if empty (`app/seed.py`; also `python -m app.seed --reset`).
- **Realtime:** in-process `RoomManager` (dict of meeting_number → connected participants). One backend instance (documented limitation).
- **Mesh limit:** soft cap of **8** participants per instance; the 9th join gets `MEETING_FULL`.

### 4.1 Routes
| Route | Chrome | Purpose |
|---|---|---|
| `/` | — | Redirect to `/wc/home` |
| `/wc/home` | Workplace shell | Home (§7.1) |
| `/wc/join` | — | `replace('/wc/home')` and open the Join modal [M] |
| `/wc/meetings` | Workplace shell | Meetings tab. Query `?tab=upcoming\|previous&select={number\|instanceUuid}` |
| `/wc/team-chat`, `/wc/contacts` | Workplace shell | Placeholder pages (§6.8), P1 |
| `/wc/{number}/join` | Workplace shell when `fromPWA=1`, else full viewport | Invalid page or dark pre-join (§7.2.8, §7.10) |
| `/wc/{number}/start` | Workplace shell when `fromPWA=1`, else full viewport | Host start → room |
| `/wc/{number}/meeting` | same rule (`fromPWA=1` is carried through) | Meeting room (§8) |
| `/wc/{number}/left` | full viewport | "You have left the meeting." (§7.11) |
| `/wc/my/{name}` | Workplace shell | Personal link name join (P2; until then render the invalid page) |
| `/j/{number}` | Launch-page chrome | Invite link: launch page (P1) or redirect to `/wc/{number}/join?pwd=…` (P0) |
| `/meeting/schedule` | Portal shell | Schedule (§7.6) |
| `/meeting/{number}` | Portal shell | Meeting detail (§7.8); unknown → "Invalid meeting ID. (3,001)" |
| `/meeting/{number}/edit` | Portal shell | Edit (§7.7) |

The Workplace layout reads `useSearchParams()`. On `/wc/{n}/(join|start|meeting)` it renders the header/rail only when `fromPWA=1`.

### 4.2 Repository layout
```
/frontend
  app/
    layout.tsx                    # fonts, tokens.css, QueryClientProvider, LightToaster
    page.tsx                      # redirect → /wc/home
    (workplace)/layout.tsx        # WorkplaceShell (header + rail + content card; hidden for full-viewport meeting routes)
    (workplace)/wc/home/page.tsx
    (workplace)/wc/join/page.tsx  # redirect + open modal
    (workplace)/wc/meetings/page.tsx
    (workplace)/wc/team-chat/page.tsx   (workplace)/wc/contacts/page.tsx
    (workplace)/wc/[number]/join/page.tsx     # web-client panel → invalid page | pre-join
    (workplace)/wc/[number]/start/page.tsx
    (workplace)/wc/[number]/meeting/page.tsx
    wc/[number]/left/page.tsx
    j/[number]/page.tsx           # launch page / redirect
    (portal)/layout.tsx           # PortalShell (104px header + 300px side menu)
    (portal)/meeting/schedule/page.tsx
    (portal)/meeting/[number]/page.tsx
    (portal)/meeting/[number]/edit/page.tsx
  components/ui/          # Button (zoom-ui API), IconButton, Input, Textarea, Select, FilterSelect, Checkbox, Radio, Toggle,
                          # Modal, Popover, Menu, Tooltip (light + dark), Avatar, Presence, Banner, LightToast, Spinner, Skeleton, Icon
  components/workplace/   # Header, NavCluster, HistoryPopover, SearchTrigger, SearchDialog, ActivityCenter, ProfileMenu, LeftRail,
                          # HomeClock, HomeActionButton, NewMeetingPopover, PmiSubmenu, HubEntries,
                          # CalendarWidget (DateHeader, ToolsRow, DayPicker, MoreMenu, EventCard, EmptyDay), RecentMeetingsCard,
                          # JoinMeetingModal, MeetingHistoryDropdown, WebClientPanel, InvalidLinkPage
  components/meetings/    # MeetingsHeader, PmiCard, MeetingGroups, MeetingItem, MeetingDetail, TimeNotice, CopiedTooltip,
                          # InvitationBlock, DeleteMeetingModal, AddCalendarLink, ZButton
  components/portal/      # PortalHeader (black strip + nav), PortalSideMenu, PortalToast, ConfirmDialog
  components/schedule/    # ScheduleForm, FormRow, TopicInput, DescriptionToggle, DatePicker, TimeSelect, AmPmSelect,
                          # DurationSelect, TimezoneSelect, InviteesInput, PasscodeInput, StaticRows, StickyActionBar
  components/detail/      # DetailGrid, CopyInvitationDialog
  components/prejoin/     # PreJoinPage, PreviewCard, PreviewControls, AudioLevelIcon
  components/room/        # Room, MeetingHeader, InfoPill, InfoPopover, EncryptionPopover, ViewMenu, Stage, SpeakerView,
                          # GalleryView, VideoTile, NameTag, Toolbar, ToolbarButton, CaretMenu, ReactPicker, MoreMenu,
                          # RightPanels, PanelShell, ParticipantsPanel, ParticipantRow, ParticipantMenu, HostToolsPanel,
                          # ChatPanel, ChatMessage, ChatComposer, RecipientMenu, InviteModal, DarkDialog, RoomToasts,
                          # PermissionBar, LeaveBar, LeavePopover
  lib/api.ts  lib/format.ts  lib/ids.ts  lib/clipboard.ts  lib/joinInput.ts  lib/notice.ts  lib/gallery.ts  lib/avatar.ts
  lib/rtc/signaling.ts  lib/rtc/peerManager.ts  lib/rtc/media.ts  lib/rtc/activeSpeaker.ts  lib/rtc/audioLevel.ts
  hooks/useMeetingRoom.ts  hooks/useClock.ts  hooks/useAutoHide.ts  hooks/useNow.ts
  styles/tokens.css  styles/globals.css
  public/icons/*        # copied from docs/reference/icons
/backend
  app/main.py  app/config.py  app/db.py  app/models.py  app/schemas.py
  app/routers/users.py  app/routers/meetings.py  app/routers/join.py  app/routers/ws.py
  app/services/meeting_service.py  app/services/id_generator.py  app/services/invitation.py  app/services/timezones.py
  app/realtime/room_manager.py  app/realtime/protocol.py
  app/seed.py
  tests/test_meetings.py  tests/test_join.py  tests/test_ws.py
  requirements.txt
/docs/reference/...             # captured Zoom references (screens/ is git-ignored)
README.md  PRD.md
```

---
## 5. Design system

`frontend/styles/tokens.css` = **`docs/requirements/06-tokens.css` verbatim** (layers 1–6: 256 `--zoom-color-*`, shadows, Prism foundation and semantic colours, PWA legacy colours, component variables `--btn-*`, `--input-*`, `--menu-*`…, keyframes, dark block), plus the room palette in §5.2.4 and the portal colours in §5.2.5. Build components from layer-5 variables. Raw CSS for every component: see `docs/requirements/06-design-system.md` Appendix B.

### 5.1 Fonts [M]
| Surface | Computed `font-family` | Clone variable |
|---|---|---|
| Workplace shell, Home, Meetings tab, Join modal | `html`: `system-ui,"SF Pro","Segoe UI","Almaden Sans",Roboto,Ubuntu,Helvetica,Arial`. `body *` computes to `Emoji, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Liberation Sans", Arial, sans-serif` (injected by Zoom's chat bundle). Both resolve to SF Pro on macOS | `--font-app: system-ui, -apple-system, "SF Pro", "Segoe UI", Roboto, "Noto Sans", Ubuntu, Helvetica, Arial, sans-serif` |
| Meeting room, pre-join | `system-ui, "SF Pro", "Segoe UI", "Almaden Sans", Roboto, Ubuntu, Helvetica, Arial` | `--font-app` |
| Portal (Schedule, Edit, detail, invalid pages, `zoom.us/join`) | `"Almaden Sans", Helvetica, Arial`; **every text node has `letter-spacing:0.42px`** | `--font-portal: "Almaden Sans", Helvetica, Arial, sans-serif` + `letter-spacing:.42px` on the portal root |
| `/j/{n}` launch page | `Inter, "Open Sans", Helvetica, Arial, sans-serif` | `--font-launch` |

- Almaden Sans is proprietary; do **not** ship it. The stacks fall back exactly as Zoom's do.
- Workplace runs a CSS reset (`html,body,div,span,…{margin:0;padding:0;border:0;font:inherit}` + `body{line-height:1; cursor:default}`), so any text with no explicit line-height has **line-height = font-size** (e.g. Meetings "Upcoming" 14/14, invitation `<pre>` 13/13). Reproduce with `line-height:1` on the Workplace body. `* {box-sizing:border-box}`. `-webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale`.
- Non-standard weights in use: **590** (calendar card titles, download-CTA titles, Chat header; SF semibold), **510** (pre-join field labels). Write them as-is; browsers round when needed.
- `document.title` is **"Zoom"** on every `/wc/*` route [M]. Portal titles: "Schedule a Meeting - Zoom", "Edit Meeting - Zoom", "My Meetings - Zoom", "Error - Zoom". Launch page: "Launch Meeting - Zoom". Favicon: a single `.ico` (use our own neutral icon; do not hotlink Zoom's).

### 5.2 Colour tokens

#### 5.2.1 Two token systems (both [M])
- **zoom-ui** (`--zoom-color-*`): header, profile menu, calendar widget, promo widgets, portal components. Primary text **`#222325`**.
- **Prism** (React, unprefixed tokens on `.prism-light`): Join modal, New-meeting popover, white tooltips, Admin Center, Activity bell. Primary text and strongest icon **`#2A2B2D`**. Other differences: `--fill-elevated-stronger #FFFFFFE5` (vs `#FFFFFFF2`), `--border-success #48AD67` (vs `#4BAD67`), `--state-subtle-warning-*` `#B36200xx` (vs `#B26200xx`).
- **Rule:** text inside tooltips and Prism popovers uses `#2A2B2D`; everything else uses `#222325`.

#### 5.2.2 Core light tokens (zoom-ui) [M]
| Token | Value | Use |
|---|---|---|
| `--zoom-color-bg-default` / `fill-default` | `#FFFFFF` | cards, header, popovers, dialogs |
| `--zoom-color-bg-darker-neutral` | `#F1F4F6` | **app background**, left rail |
| `--zoom-color-fill-subtle-neutral` | `#F1F4F6` | secondary buttons, Download link |
| `--zoom-color-fill-subtler-neutral` | `#F7F9FA` | solid hover surface (hub entries, tertiary-outline hover), readonly input bg |
| `--zoom-color-fill-global-primary` / `fill-primary` / `text-primary` | `#0D6BDE` | primary buttons, links, selected date |
| `--zoom-color-state-primary-hover` / `-press` | `#0C60C8` / `#084085` | primary hover / active; text-button hover / active |
| `--zoom-color-fill-subtler-primary` | `#F2F8FF` | info banner bg, active side-menu item, live event card |
| `--zoom-color-component-toggle-button-background-selected` | `#ECF4FD` | selected date cell, secondary pill tab |
| `--zoom-color-text-stronger-neutral` | `#222325` | primary text |
| `--zoom-color-text-strong-neutral` / `icon-strong-neutral` | `#555B62` | secondary text, rail icons, tertiary icon buttons |
| `--zoom-color-text-neutral` | `#686F79` | tertiary text, **placeholders**, descriptions |
| `--zoom-color-state-neutral-hover` | `#5E646D` | placeholder on hover |
| `--zoom-color-icon-neutral` | `#8E9194` | ⓘ info icons |
| `--zoom-color-border-subtle-neutral` | `#DFE3E8` | header border, card/popover borders, dividers |
| `--zoom-color-border-input` | `#C1C6CE` | input / select borders |
| `--zoom-color-border-neutral` | `#939BA4` | checkbox / radio borders |
| `--zoom-color-border-strong-neutral` | `#555B62` | toggle border |
| `--zoom-color-border-primary` | `#4B96F1` | focus border, focus ring |
| `--zoom-color-border-subtle-primary` | `#A8CCF8` | info banner border, selected date ring |
| `--zoom-color-border-error` | `#FF6682` | error border |
| `--zoom-color-text-error` | `#DA1639` | asterisk, error text |
| `--zoom-color-text-success` | `#247F40` | passcode-rule ✓ |
| `--zoom-color-icon-success` | `#09A639` | shield icons, available presence |
| `--zoom-color-icon-primary` | `#3B90F7` | info banner icon |
| `--zoom-color-fill-warning` | `#B36200` | warning icon |
| `--zoom-color-state-disable` / `state-subtle-disable` | `#ADB1B8` / `#ADB1B840` | disabled text / disabled bg and border |
| `--zoom-color-state-subtle-primary-disable` | `#AACDF8` | disabled-checked checkbox |
| `--zoom-color-fill-subtler-warning` / `border-subtle-warning` | `#FFF9F2` / `#E1BD93` | warning banner |
| `--zoom-color-fill-subtler-success` / `border-subtle-success` | `#F2FFF6` / `#9ECEAD` | success banner |
| `--zoom-color-fill-subtler-error` / `border-subtle-error` | `#FFF2F5` / `#F6AAB8` | danger banner |
| `--zoom-color-underlay-dark` | `#00000033` | zoom-ui dialog scrim |
| `--zoom-color-underlay-dropShadow` | `#00000014` | all shadows |
| `--zoom-color-state-contrary-strong-transparent-hover` | `#000000A3` | dark tooltip bg |

#### 5.2.3 PWA hard-coded colours (Workplace legacy CSS, no token) [M]
| Name | Value | Use |
|---|---|---|
| `--zc-orange` | `#FF742E` | **New meeting** button (active `#E56829`, disabled `#F9CBB7`) |
| `--zc-blue-action` | `#0E71EB` | **Join / Schedule** buttons (active `#0C63CE`, disabled `#B1C7F6`), selected list items, New-meeting row hover, PWA checkbox checked |
| `--zc-blue-link` | `#0E72ED` | Meetings Start button, "Add a calendar", invitation link, focus on hub entries |
| `--zc-focus-legacy` | `#2D8CFF` | PWA global focus ring (offset 1) |
| `--zc-focus-zbutton` | `#4793F1` | z-button focus ring, Clear History text |
| `--zc-text-legacy` | `#232333` | clock, popover text, Meetings PMI/topic |
| `--zc-text-dark` | `#131619` | Meetings header title, z-button tertiary text, toast text |
| `--zc-text-muted-legacy` | `#747487` | Meetings list secondary text |
| `--zc-label-grey` | `#6E7680` | Home action labels, disabled tertiary text |
| `--zc-text-day` | `rgba(4,4,19,.56)` (`#0404138F`) | date under clock, empty states, chevron |
| `--zc-topic-dark` | `#39394D` | Meetings detail topic |
| `--zc-divider-legacy` | `#EDEDF4` | list dividers, calendar widget border |
| `--zc-row-border` | `#EDEDF3` | New-meeting popover row border |
| `--zc-hover-blue` | `#E7F1FD` | Meetings list hover |
| `--zc-search-bg` | `#ECEFF1` | header search (hover `#E8EBEE`, active `#DFE3E8`) |
| `--zc-search-text` | `#3D4349` | header search text/icon |
| `--zc-chevron-hover` | `#F2F2F7` | New-meeting chevron hover, disabled z-button bg |
| `--zc-disabled-legacy` | `#909096` | disabled z-button / action labels |
| `--zc-pwa-check-border` | `#BABACC` | PWA checkbox border |
| `--zc-v-divider` | `#7D7D8821` | Meetings 2px column divider |
| `--zc-danger` | `#DE2828` | destructive buttons (hover = +9% black ≈ `#CA2424`) |
| `--zc-danger-text` | `#E02828` | Delete hover text, unread badge |
| `--zc-now-red` | `#FD4C4C` | "NOW" notice |

#### 5.2.4 Meeting-room dark palette [M]
| Name | Value | Use |
|---|---|---|
| `--mr-bg-outer` | `#131619` | `#wc-content` root |
| `--mr-bg-stage` | `#0D0D0D` | stage (`#wc-container-left`) |
| `--mr-tile` | `#1A1A1A` | video / avatar tile |
| `--mr-bar` | `rgba(0,0,0,.7)` | header & toolbar |
| `--mr-pill-bg` | `rgba(0,0,0,.6)` | meeting-info pill |
| `--mr-panel-gutter` | `#040506` | right panel container, pre-join control bar |
| `--mr-panel` | `#1D1E20` | panels, info/encryption popovers, invite inner, dialogs, pre-join page bg |
| `--mr-panel-border` | `#313235` | panel border, dividers, participant row hover |
| `--mr-window-outer` | `#242424` (border `#333`) | invite modal outer, emoji picker |
| `--mr-pill` | `#2A2B2D` | panel footer pills, row menus, host-tools row hover |
| `--mr-menu-bg` | `rgba(0,0,0,.99)` | **all** dark dropdowns (View, carets, More) |
| `--mr-menu-border` | `rgba(255,255,255,.12)` | dropdown and popover borders |
| `--mr-menu-hover` | `#2B2B2B` | dark dropdown item hover |
| `--mr-divider` | `rgba(255,255,255,.09)` | dropdown dividers, Leave Meeting bg |
| `--mr-btn-hover` | `#6E768054` (rgba(110,118,128,.33)) | toolbar button hover, pill hover, row-menu hover |
| `--mr-btn-active` | `rgba(255,255,255,.18)` | toolbar button active |
| `--mr-text` | `#F7F9FA` (panels) / `#F5F7FB` (chat, invite) / `#F5F5F5` (menus headers, leave bar) | primary text |
| `--mr-text-80` | `rgba(255,255,255,.8)` | menu items, toast text, counters |
| `--mr-text-2` | `#9DA5B5` | chat "to:", passcode label, chat icons |
| `--mr-text-3` | `#ADADAD` | info/encryption popover labels |
| `--mr-text-4` | `#939BA4` | pre-join agreement, inactive invite tab |
| `--mr-icon-panel` | `#DFE3E8` (participants) / `#CAD1D5` (chat, host tools) | panel header icons |
| `--mr-link` | `#4B96F1` (invite link value) / `#75AFF5` (Copy URL, chat names) | links in dark UI |
| `--mr-primary` | `#0E71EB` (buttons, Invite, Continue) / `#0E72ED` (recipient pill, send, pre-join Join) | primary |
| `--mr-danger` | `#DE2828` (hover `#CA2424`) | End Meeting for All, attendee Leave Meeting, muted icons in the list |
| `--mr-end-icon` | `#FF0055` (`#F05`) | End hexagon, disallowed slash, Leave door |
| `--mr-encrypt` | `#25E55F` | encryption shield, Share icon while sharing |
| `--mr-speaking-ring` | `#48DD5D` | active-speaker ring `inset 0 0 0 2px` |
| `--mr-audio-level` | `#23D959` | mic audio-level meter fill |
| `--mr-warning` | `#FAAC2A` | permission-bar warning icon |
| `--mr-toast-bg` | `rgba(0,0,0,.93)` | room notifications |
| `--mr-leave-bg` | `rgba(9,10,10,.8)` | End/Leave popover |
| `--mr-leave-bar` | `rgba(0,0,0,.8)` + `backdrop-filter:blur(48px)` | toolbar replacement while leaving |
| `--mr-chat-bubble` | `#292F37` | chat message bubble |
| `--mr-copied` | `#00A832` | copied check icon |

Conflict note: v1.0 used `#23D959` as the speaking border. Spec 05 (CSS) shows the ring is `#48DD5D`; spec 08 (live) shows `#23D959` is the audio-level meter colour. Both are kept, each for its own role.

#### 5.2.5 Portal colours [M]
Header text `#666484`; black strip `#00031F`; header bg `rgba(255,255,255,.97)` + `box-shadow:0 0 2px 0 rgba(0,0,0,.2)`; side-menu bg `#F7F7FA`; form label `#222325` (Topic label `#232333`); values `#232333`; detail labels `#131619`; divider `#EDEDF4`; footer `#39394D`; "New" badge `#2057B1` on `#F2F8FF` / border `#A8CCF8`; Upgrade pill `#00F0EA` / `#0B5CFF`; invitee suggestion text `#323539` / `#6E7680`; "Invalid email" `#B22424`; portal primary hover `#0956B5`; portal danger `#E8173D` (hover `#B10E2C`); portal link button `#0956B5`.

### 5.3 Translucent state colours [M]
Zoom's hover/press backgrounds are **translucent and replace** the resting background (they are not overlays on top of it).

| State | Light | Dark | Used by |
|---|---|---|---|
| neutral hover | `#6E76801F` (rgba(110,118,128,.12)) | `#6E768054` | secondary/tertiary buttons, inputs, selects, options, menu rows, rail tab, checkbox |
| neutral press | `#6E76806B` (.42) | `#0000006B` | same |
| header item press | `#6E76803D` (.24) | — | Admin Center, Download, bell |
| primary-tinted hover / press (Prism tertiary) | `#0E72ED1F` / `#0E72ED6B` | `#0E72ED54` | Prism tertiary |
| collapsed search icon hover / press | `#52528017` / `#5252802E` | — | ≤1080 header |
| Meetings refresh hover / press | `#0000000F` / `#0000004D` | — | refresh button |
| z-button normal hover/active | `linear-gradient(0deg,#00000017,#00000017), #0E72ED` (≈ `#0D68D8`) | — | Meetings Start / Join |
| z-button destructive hover / active | +9% black (≈ `#CA2424`) / +18% black (≈ `#B62121`) over `#DE2828` | — | Delete modal |

### 5.4 Type scale [M]
| Style | Size / line-height | Weight (zoom-ui) |
|---|---|---|
| title-1 | 24/28 | 700 emphasis |
| title-2 | 20/24 | 700 emphasis |
| title-3 | 16/20 | 400 / 700 |
| body-1 | 14/18 | 400 / 600 |
| paragraph-1 | 14/20 | 400 |
| body-2 | 12/16 | 400 / 600 |
| caption | 10/16 | 400 / 500 |
Letter-spacing in Workplace: `-0.15px` (header items, buttons, Join modal label/input/buttons), `-0.31px` (16px/590 CTA titles, Chat header), `-0.45px` (Join modal title), `0.12px` (rail labels), `0.37px` (clock), `0.4px` (search trigger text). Portal: `0.42px` everywhere.

### 5.5 Radii, shadows, z-index [M]
**Radius:** 4 (tooltip, checkbox, text button, Meetings refresh, name tag) · 6 (header 24px icon buttons, room caret toggles, row icon buttons) · 8 (rail tab, search field, z-button 32, menu items, room toolbar buttons, room dropdowns, Delete modal, portal buttons/dialog) · 10 (PWA avatar, Prism popover, PWA toast, New-meeting popover, pre-join inputs/Join/control bar, chat bubble) · 12 (md buttons, inputs, selects, content card, banners, profile menu, floating menus, Meetings items/PMI card, invite outer, End popover) · 14 (room toast, pre-join preview card) · 15 (room panels) · 16 (hub entry, date-picker popovers, info popover) · 20 (Home action button, room info pill, panel footer pills) · 32 (dialogs: Join modal, zoom-dialog) · 999 (pills, sm buttons, icon-only buttons, Today pill).

**Shadows:**
| Token | Value | Used by |
|---|---|---|
| `--zoom-box-shadow-small` (= Prism `--shadow-sm`) | `0 4px 8px 0 #00000014, 0 2px 4px 0 #00000014` | tooltips (white and dark), Schedule date picker, segmented thumb |
| `--zoom-box-shadow` (= `--shadow-md`) | `0 12px 24px 0 #00000014, 0 6px 12px 0 #00000014` | popovers, profile menu, floating menus/selects, zoom-dialog, search dialog |
| Join modal | `0 6px 12px 0 #00000014, 0 12px 24px 0 #00000014` | `.join-meeting-modal` |
| `--zoom-box-shadow-large` | `0 24px 48px 0 #00000014, 0 12px 24px 0 #00000014` | History popover |
| PWA toast | `0 24px 48px rgba(19,22,25,.2), 0 12px 24px rgba(19,22,25,.1)` | light toast |
| Home action hover | `0 4px 11px 0 #B3B3B3` | action buttons |
| PWA confirm modal | `0 0 20px #2626264D` | Delete Meeting modal |
| Meeting history | `0 8px 24px rgba(35,35,51,.1)` | Join history dropdown |
| Portal light tooltip/dropdown | `0 2px 12px rgba(35,35,51,.5)` | portal dropdown, help tooltip |
| Room dark popover | `0 8px 24px rgba(0,0,0,.3)` | dark dropdowns, info popover, Settings |
| Room window | `0 10px 20px rgba(0,0,0,.5)` | invite modal, pop-out windows |
| Room dark dialog | `0 8px 24px rgba(0,0,0,.4)` | Mute All etc. |

**Z-index:** inline dropdowns 10 · loading mask 100 · portal sticky bar 100 · room header/toolbar 200 · room toasts 999 · Prism overlay 1000 · **PWA modal overlay 1001** · room overlay dialogs 1030 · portal fixed header 1030 · Popover/Dialog (Prism) 1300 · **Tooltip 1500** · zoom-ui floating 2000 · react-toastify 9999.

### 5.6 Motion [M]
| Component | Property / duration / easing |
|---|---|
| Home action button | `transform .15s ease, box-shadow .15s ease`; hover and `:focus` → `translateY(-4px)` + `0 4px 11px 0 #B3B3B3` |
| Left-rail tab hover | **none (instant)**; `transform .3s ease` only for drag-reorder |
| Header items (Admin, Download, profile), search trigger | none |
| Header Back/Forward/History (MUI) | `background-color, box-shadow, border-color .25s cubic-bezier(.4,0,.2,1)` |
| Prism tooltip / popover (white tooltip, New-meeting popover, "Copied!", "Add a calendar") | `opacity .3s cubic-bezier(.4,0,.2,1)`, no scale; mounts ≈10 ms after pointerenter (no delay) |
| zoom-ui tooltip / info popover | `opacity .2s, transform .2s cubic-bezier(.4,0,.2,1)` from `scale(0)` |
| zoom-ui floating menus, selects, date picker (`zoom-zoom-in-top`) | `transform: scaleY(0→1)` + `opacity 0→1`, `.3s cubic-bezier(.23,1,.32,1)`, origin top (bottom when flipped) |
| Profile menu & submenus | `opacity .3s linear` |
| History popover | `opacity 200ms cubic-bezier(.4,0,.2,1)` |
| zoom-ui dialog | keyframe `fade-in-linear-in .3s`: opacity 0→1 + `translateY(-20px)→0` |
| **Join modal** | **none** (instant open and close) |
| Search dialog backdrop | `opacity .225s cubic-bezier(.4,0,.2,1)` |
| PWA light toast | effectively instant (`animation-duration:10ms`) |
| Portal toast (`zm-message`) | `opacity .3s, transform .4s` from `translate(-50%,-100%)` |
| Select chevron | `rotate(0→180deg) .3s linear` |
| Checkbox box | `border-color, background-color .2s cubic-bezier(.71,-.46,.29,1.46)` |
| Radio knob | `transform scale(0→1) .15s ease-in` |
| Toggle (zoom-ui, room switch) | `.3s` (track bg, knob transform) |
| Banner close | `opacity .3s` |
| Portal side-menu group chevron | `rotate(-90deg→0) .3s ease-in-out` |
| Portal tabs active bar | `background-color .2s` |
| Room header / toolbar show-hide | `transform .2s ease-out`; hidden = `translateY(-48px)` / `translateY(52px)` |
| Room name tag | `bottom .2s ease-out` |
| Room stage resize (panel open/close) | `all .2s ease-in` |
| Room dark dialogs overlay | `opacity .15s ease-out` |
| Room react-picker tooltips | `all .15s ease` |
| Audio-level meter | `height .1s linear` |
| Spinners | zoom-ui 8-spoke `spinner-fade .8s linear infinite`; PWA `.z-loading` `rotate-infinite 1s linear infinite`; web-client loading 1.5s; launch-page ring `rotate 1.4s linear infinite` |
| Skeleton | `skeleton-pulse 1.5s ease-in-out infinite` (opacity 1→.33→1, scale 1→.99→1) |
Keyframes: see `06-tokens.css` (bottom) and `06-design-system.md` Appendix B.18.

### 5.7 Focus rings [M] → clone rule [D]
Zoom has three focus models: (1) PWA global `:focus{outline:2px solid #2D8CFF;outline-offset:1px}`, suppressed for mouse users (`[data-whatintent=mouse] :focus{outline:none!important}`); (2) Prism `outline:2px solid #4B96F1; offset 2px`, keyboard only; (3) zoom-ui `2px solid #4B96F1` keyboard only; text fields use an inset ring instead.

**Clone rule:**
| Element | Style |
|---|---|
| Everything (default) | `:focus-visible { outline: 2px solid #4B96F1; outline-offset: 2px }`; never on mouse focus |
| Rail tabs | same colour, `outline-offset:-4px` |
| Hub entries | `outline:2px solid #0E72ED; outline-offset:2px` |
| Meetings z-buttons | `outline:2px solid #4793F1; outline-offset:2px` |
| Join-modal input, history toggle, Meetings list items, New-meeting PWA checkbox | `outline:2px solid #2D8CFF; outline-offset:1px` (Zoom shows it on **mouse** focus of the Join input too [M]) |
| zoom-ui text fields / selects (portal, Schedule) | on `:focus` (any modality): border `#4B96F1` + `box-shadow: inset 0 0 0 1px #4B96F1`; error → `#FF6682` |
| Calendar card join controls | `box-shadow:0 0 0 2px #FFF, 0 0 0 4px #0E72ED; border-radius:6px` |
| Room | header buttons `outline:2px solid #2D8CFF; offset 1`; dark menu items `outline:1px solid #FFF` |

### 5.8 Core components

#### 5.8.1 Button — zoom-ui API (Workplace look) [M]
One `Button` component: `variant: primary | secondary | secondary-neutral | tertiary | text | overlay`, `danger`, `size: sm | md | lg`, `iconOnly`, `loading`, `disabled`. No transitions. Base: `inline-flex; align-items:center; justify-content:center; border:none; white-space:nowrap; font:400 14px/18px var(--font-app)`; icon–label gap 4; adjacent buttons `margin-left:8px`.

| Size | Height | Padding (tertiary) | Radius | Font | Icon-only box / glyph |
|---|---|---|---|---|---|
| sm | 24 | `2px 10px` (`2px 8px`) | **999** | 12/16 | 24 / 14, radius 100% |
| md | 32 | `6px 14px` (`6px 8px`) | **12** | 14/18 | 32 / 16, radius 100% |
| lg | 40 | `6px 16px` (`6px 12px`) | 12 | 14/18 | 40 / 18 |

| Variant | Default bg / text | Hover | Active | Disabled |
|---|---|---|---|---|
| primary (text **500**) | `#0D6BDE` / `#FFF` | `#0C60C8` | `#084085` | bg `#ADB1B840`, text `#ADB1B8`, `cursor:not-allowed` |
| primary-danger | `#DA1639` / `#FFF` | `#C41434` | `#830D23` | as primary |
| secondary | `#F1F4F6` / `#0D6BDE` | bg `#6E76801F`, text `#0C60C8` | bg `#6E76806B`, text `#084085` | bg `#ADB1B840`, text `#ADB1B8` |
| secondary-neutral / secondary icon-only | `#0000000A` / `#222325` | `#6E76801F` | `#6E76806B` | as above |
| tertiary | transparent / `#0D6BDE` | bg `#6E76801F`, text `#0C60C8` | bg `#6E76806B`, text `#084085` | text `#ADB1B8` |
| tertiary icon-only | transparent / `#555B62` | bg `#6E76801F` (icon unchanged) | bg `#6E76806B` | `#ADB1B8` |
| text (`is-pure-text`: `height:auto; padding:0; radius 4`) | transparent / `#0D6BDE` | text `#0C60C8` (**no underline**) | `#084085` | `#ADB1B8` |
| overlay (text 500) | `#0000006B` + `blur(15px)` / `#FFF` | `#313131CC` | `#000000CC` | text `#ADB1B8` |
Loading (`is-loading`): hover/active suppressed, `cursor:not-allowed`, inner mask inset −1px radius 8 (sm 6) bg `#FFFFFFCC` with a 16px 8-spoke spinner. Focus: §5.7.

#### 5.8.2 z-button — Workplace Meetings tab [M]
Base `inline-flex; border:none`. Size 32: `height:32px; padding:0 20px; border-radius:8px; font:700 14px/20px`; children `margin-right:4px` (no gap). Focus `2px solid #4793F1` offset 2.
| Type | Default | Hover | Active / focus | Disabled |
|---|---|---|---|---|
| normal (Start, Join) | `#0E72ED` / `#FFF` | `linear-gradient(0deg,#00000017,#00000017),#0E72ED` | same as hover | `#F2F2F7` / `#909096` |
| tertiary (Copy Invitation, Edit) | `#FFF`, border 1px `#DFE3E8`, text `#131619`, 12px leading icon | bg `#F7F9FA`, text `#0E71EB` | focus: bg `#F1F4F6`, text `#0E71EB` | `#FFF` / `#6E7680` |
| tertiary Delete | as tertiary, × icon | bg `#F7F9FA`, text **`#E02828`** | focus bg `#F1F4F6`, text `#E02828` | `#FFF` / `#6E7680` |
| secondary (Delete modal Cancel) | `#F1F4F6` / `#131619` | `#DFE3E8` | `#C1C6CE` | — |
| destructive (Delete modal Delete) | `#DE2828` / `#FFF` | +9% black | +18% black | `#F2F2F7` / `#909096` |
Icons inherit `currentColor`, so they turn blue/red on hover.

#### 5.8.3 Portal button `zm-button` (meeting detail, Copy Invitation dialog, portal lists) [M]
Base `inline-flex; font-weight:600` (computed 500 for primary small), `transition:.1s`. small: `min-width:32px; padding:6px 16px; border-radius:8px; font-size:14px; line-height:20px`. primary `#0E72ED`/`#FFF` hover `#0956B5`; plain `#FFF`, border 1px `#DFE3E8`, text `#131619`, hover `#F7F9FA`; danger `#E8173D` hover `#B10E2C`; link `transparent`, text `#0956B5`, no side padding; disabled `#F1F4F6` / `#6E7680`, `cursor:not-allowed`.

#### 5.8.4 Text input — zoom-ui md [M]
| State | Style |
|---|---|
| default | h32, `padding:6px 11px`, border 1px `#C1C6CE`, radius 12, bg transparent, 400 14px/18px `#222325` |
| placeholder | `#686F79` |
| hover (not focused) | **bg `#6E76801F`**, placeholder `#5E646D`, border unchanged |
| focus | border `#4B96F1` + `box-shadow: inset 0 0 0 1px #4B96F1`, `outline:none` |
| error `.is-errored` | border `#FF6682`; focused + `inset 0 0 0 1px #FF6682` |
| disabled | border `#ADB1B840`, text/placeholder `#ADB1B8`, `cursor:not-allowed` |
| readonly | border `#C1C6CE`, bg `#F7F9FA`, text `#686F79`, `cursor:not-allowed` |
No transitions. lg (h40) padding `6px 15px`. Textarea identical (padding `8px 12px`; autoresize `6px 12px`; `resize:vertical`; thin scrollbar `#949494`).
**Field error row** `.zoom-form-item__error`: `display:flex; margin-top:4px`; 12px error-circle icon `#DA1639` (`sch-error-circle.svg`, margin-top 2) + text `margin-left:4px` 400 12px/16px `#DA1639`.

#### 5.8.5 Select and dropdown list (zoom-ui) [M]
- **Trigger:** border 1px `#C1C6CE`, radius 12, bg `#FFF`, h32; value 400 14px/18px `#222325` 12px from the left; chevron 12px `#555B62` (`sch-select-chevron.svg`) at `right:9px`, vertically centred. Placeholder `#686F79` (hover `#5E646D`). Hover bg `#6E76801F`. Open/focusing: chevron `rotate(180deg)` (.3s linear); filter-selects get border `#4B96F1` + `::after{inset:-1px; border:2px solid #4B96F1; border-radius:inherit}` and clear their input, showing the current value as placeholder. Error border `#FF6682`. Disabled: border `#ADB1B840`, text and chevron `#ADB1B8`, `cursor:not-allowed`.
- **Menu:** appended to `<body>`, `position:absolute`, **width = trigger width**, top = trigger bottom **+4px** (flips above when no room, `data-side=top`), bg `#FFF`, border 1px `#DFE3E8`, **radius 12**, `--zoom-box-shadow`; inner list `margin:11px`, `max-height:208px`, custom 6px scrollbar thumb `rgba(0,0,0,.42)` fading in on hover. Height = n×32 + 24 (2 options → 88, 4 → 152, ≥6 → 210). Opens with `zoom-zoom-in-top` (§5.6). On open the selected option scrolls into view. Esc and outside click close.
- **Option:** `display:flex; align-items:center; min-height:32px; padding:6px 8px; border-radius:8px`; 400 14px/18px `#222325`, ellipsis; hover bg `#6E76801F`; **selected keeps `#222325`/400** and shows a 16px ✓ `#222325` at right (`margin-left:8px`, `sch-checkmark.svg`); unselected siblings get `padding-right:32px`; keyboard/virtual focus bg `rgba(10,10,10,.12)` + 2px `#4B96F1` bar at `left:-8px`; disabled `#ADB1B8`.
- **Group title** 400 12px/16px `#686F79`, padding 8; groups separated by a 1px `#DFE3E8` line inset 8px.
- **Empty:** padding 12, "**No matching data**" 400 14px/20px `#686F79` centred (menu 46px tall).

#### 5.8.6 Checkbox [M]
| Part | zoom-ui `.zoom-checkbox` (portal, Schedule) | PWA `.zm-pwa-checkbox` (New-meeting popover) |
|---|---|---|
| Box | 16×16, radius 4, 1px `#939BA4`, `position:relative; top:2px` | 16×16, radius 4, 1px **`#BABACC`** |
| Hover / press | bg `#6E76801F` / `#6E76806B` | — |
| Checked | bg + border `#0D6BDE`; check = two 2px `#F7F9FA` bars rotated 45° (`::before` 2×9 at (7,3), `::after` 5×2 at (4,10)) | bg **`#0E71EB`**, `border:0`, white 10px check |
| Checked hover / press | `#0C60C8` / `#084085` | — |
| Indeterminate | blue + 10×2 white bar at (2,6) | — |
| Disabled | border `#ADB1B8`, bg `#ADB1B840`, label `#ADB1B8` | bg `#D0E3FB`, border 1px `#F1F4F6`, text `#6E7680` |
| Disabled checked | bg + border `#AACDF8` | — |
| Label | `margin-left:8px; padding:1px 0`, 400 14px/18px `#232333` (Schedule) / `#222325` (others) | `margin-left:8px`, 14px/18px `#232333` |
| Focus | keyboard: `2px solid #4B96F1` offset 2 | `2px solid #2D8CFF` offset 1 |
| Motion | `.2s cubic-bezier(.71,-.46,.29,1.46)` | none |

#### 5.8.7 Radio `.zoom-radio` [M]
16×16 circle, 1px `#939BA4`, `margin-right:8px`; knob 8×8 white `translate(-50%,-50%) scale(0→1)` `.15s ease-in`. Checked bg + border `#0D6BDE` (hover `#0C60C8`, active `#084085`). Unchecked hover bg `#6E76801F`. Disabled border `#ADB1B8`, bg `#ADB1B840`, label `#ADB1B8`; disabled-checked `#ADB1B8`. Label 400 14px/18px `#222325`. Wrapper `inline-flex; align-items:center; min-height:20px`. Horizontal group `margin-right:32px` (last 0); vertical `display:block; margin-bottom:8px`.

#### 5.8.8 Toggle / switch [M]
- zoom-ui md: track 36×20 radius 999; off border 1px `#555B62`, bg `#FFF`, knob 12×12 `#555B62` at left 3 / bottom 3; on bg + border `#0D6BDE`, knob 16×16 white, `translateX(14px)`; hover off `#6E76801F`, on `#0C60C8`; disabled off border `#DFE3E8`, on `#AACDF8`. Motion .3s.
- **Room switch** (Prism small, dark): track 36×20 radius 10, off `#555B62`, on `#0D6BDE`, `transition: background .3s`; thumb 16×16 white radius 8, shadow `0 4px 8px #00000014, 0 2px 4px #00000014`, 2px inset, on = `translateX(16px)`, `transition: transform .3s`.

#### 5.8.9 Tooltips [M]
| Kind | Where | Style |
|---|---|---|
| **Prism white** | Activity Center bell, Meetings "Copied!" | bg `#FFF`, border 1px `#DFE3E8`, radius 4, padding `3px 6px`, 400 12px/16px **`#2A2B2D`**, `--shadow-sm`, z 1500, no arrow, max-width 360; bell: 8px below; "Copied!": 6px above; fade `opacity .3s cubic-bezier(.4,0,.2,1)` |
| **MUI dark** | header History | bg `#222325`, border .5px `#313235`, radius 4, padding `3px 6px`, 400 12px/16px `#F7F9FA`, `--shadow-sm`, 4px below; enter `opacity 150ms cubic-bezier(.4,0,.2,1) 100ms` |
| **zoom-ui dark** | truncated option text, date-picker weekday headers | bg `#000000A3` + `backdrop-filter:blur(15px)` (date picker: `rgba(0,0,0,.64)`), radius 4, padding `2px 6px`, 12px/16px white, max-width 320 |
| **Native `title`** | header Back "Back(⌘+[)", Forward "Forward(⌘+])" | OS tooltip |
| **zoom-ui info popover** | Schedule ⓘ buttons, passcode rules | border 1px `#DFE3E8`, radius 12 (inner 16), `--zoom-box-shadow`, padding 16, 400 14px/18px (title 600, mb 4), 14×14 arrow, max-width 320, `opacity + scale(0→1) .2s cubic-bezier(.4,0,.2,1)`; stays open while hovered |
| **Portal light tooltip** | "Copy the Link", date-range help | bg `#FFF`, radius 8, padding `8px 12px`, 14px/24px `#6E7680`, shadow `0 2px 12px rgba(35,35,51,.5)`, 6px arrow, `opacity .2s linear` |
| None | rail tabs, Home actions, hub entries, Search, Admin, Download, Upgrade, avatar, room toolbar buttons (aria-label only) | — |

#### 5.8.10 Popovers and menus (light) [M]
| Type | Spec |
|---|---|
| Prism popover (New-meeting options, "Add a calendar") | bg `#FFF`, 1px `#DFE3E8`, **radius 10**, `--shadow-md`, body padding 12 (New-meeting: 0), max-width 360, arrow 8px×1.414 radius `50% 0 4px 0`, 8px from trigger, z 1300, `opacity .3s` |
| zoom-ui floating menu (profile menu, calendar "…", selects) | bg `#FFF`, 1px `#DFE3E8`, **radius 12**, `--zoom-box-shadow`, menu padding 12, z 2000; date-picker containers radius 16 |
| zoom-ui dropdown item | min-height 28–32, padding `6px 8px`, radius 8, 14/18 `#222325`, icon `margin-right:8px`; hover `#6E76801F`, active `#6E76806B`; disabled `#ADB1B8`; danger `#DA1639` |
| Profile-menu row | 32 tall, padding `7px 8px`, radius 8, 14/18 `#222325`, 16px icon + 8px; hover `#6E76801F`, active `#6E76806B`; row with open submenu `.is-active` `#6E76801F` |
| Separator | 9 tall: `margin:8px 8px 0; padding-top:8px; border-top:1px solid #DFE3E8` |

#### 5.8.11 Dialogs [M]
| Dialog | Overlay | Box | Title | Footer |
|---|---|---|---|---|
| **Join modal** (§7.2) | `rgba(0,0,0,.2)`, z 1001, **no close on overlay click**, no animation | `min(448px,100vw - 48px)`, radius 32, padding 32, shadow (Join modal) | 20/24 700 `#222325` ls −.45 | flex-end, gap 16, margin-top 32 |
| **zoom-dialog** (Schedule region dialog) | `rgba(0,0,0,.2)`, z 2001 | 640 wide, radius 32, `--zoom-box-shadow`; header `32px 32px 24px`, body `0 32px`, footer 32 right-aligned | 700 20px/24px `#222325`, padding-right 40; close 32×32 round at top 28 / right 32 | Cancel (secondary) + 8 + Save (primary); `fade-in-linear .3s` |
| **PWA confirm** (Delete Meeting, §7.4.8) | `rgba(255,255,255,.75)`, z 1001 | 560 wide, radius 8, shadow `0 0 20px #2626264D`, `margin-top:-4rem` | `h5` 14px 600 `#222325` | flex-end, padding `0 16px 16px`, 10px gaps |
| **About modal** (P2) | `rgba(255,255,255,.75)` | 480×305, border .5px `rgba(35,35,51,.2)`, radius 12, shadow `0 8px 24px rgba(35,35,51,.1)`, padding `64px 46px 24px` | — | — |
| **Search dialog** (§6.4) | `rgba(0,0,0,.5)`, fade .225s; backdrop click does **not** close | 720×628, radius 12, `--zoom-box-shadow` | — | — |
| **Portal dialog** (Copy Meeting Invitation, §7.8.4) | `rgba(0,0,0,.5)`, z 2000 | 700 wide, `margin-top:15vh`, border 1px `#DFE3E8`, radius 8, shadow `0 1px 3px rgba(0,0,0,.3)`, padding 24 | 24px/32px 400 `#131619`, no × | padding-top 24, right-aligned |
| **Room dark dialog** (§8.12) | `rgba(0,0,0,.5)`, `opacity .15s ease-out` | 480 wide (580 large), bg `#1D1E20`, border 1px `#333`, radius 12, shadow `0 8px 24px rgba(0,0,0,.4)`, padding `32px 32px 24px` | 20px/30px 700 `#FFF` | right-aligned, 12px gaps |

#### 5.8.12 Banner `.zoom-banner` [M]
`padding:16px; border:1px solid; border-radius:12px; color:#222325; transition:opacity .3s`. Layout: icon 20px (`align-self:flex-start`) → body `margin:0 8px 0 12px` (title 14/18 600, content 14/18 400; Schedule page `<p>` 14px/21px) → actions. Closable: `padding-right:47px`, × 24px button at top 13 / right 13.
| Kind | bg | white layer (`background-image:linear-gradient(...)`) | border | icon |
|---|---|---|---|---|
| info | `#F2F8FF` | `rgba(255,255,255,.6)` | `#A8CCF8` | `#3B90F7` (`home-cal-info.svg`, `sch-info.svg`) |
| success | `#F2FFF6` | `rgba(255,255,255,.4)` | `#9ECEAD` | `#09A639` (`sch-banner-success.svg`) |
| warning | `#FFF9F2` | `rgba(255,255,255,.5)` | `#E1BD93` | `#B36200` triangle (`sch-warning.svg`) |
| danger | `#FFF2F5` | `rgba(255,255,255,.6)` | `#F6AAB8` | `#FF2638` |

#### 5.8.13 Toasts [M]
| Surface | Spec |
|---|---|
| **Workplace light toast** (react-toastify style) | container fixed **top-center, `top:50px`**, width 320, padding 4, z 9999; card bg `#FFF`, border 1px `#C1C6CE`, radius 10, min-height 40, padding 8 (body 2), shadow (PWA toast), `backdrop-filter:blur(10px)`; icon 24px area `padding:0 15px 0 6px` (success `#268543`, info `#0E72ED`, warn `#B36200`, failure `#E8173D`); title bold `#131619` mb 4; text 14px/20px `#131619`; close × 14px `#131619` mr 8; entrance instant; auto-close 3000 ms [D]. Used for: demo toast "This feature isn't available in this demo.", "Delete meeting failed" (failure), "Copied to clipboard" where Workplace needs one [D] |
| **Portal toast** `.zm-message--success` | fixed `top:8px; left:50%; translateX(-50%)`, min-width 200, radius 8, padding `10px 32px 10px 16px`, bg `#F2FFF6`, shadow `0 12px 24px rgba(19,22,25,.1)`, text 14px/24px `#131619`, icon 20px `#268543` mr 8; enter/leave `opacity .3s, transform .4s` from `translate(-50%,-100%)`; **3000 ms**. Variants: info `#F7F9FA`/`#6E7680`, warning `#FFF9F2`/`#B36200`, error `#FFF2F5`/`#E8173D`. Text "**Copied to clipboard**" |
| **Room toast** | §8.13 |

#### 5.8.14 Avatars and palettes [M]
| Context | Shape | Sizes | Palette |
|---|---|---|---|
| **Workplace / portal** (header, profile menu, invitee rows) | radius **10** (Workplace override; zoom-ui default is a circle — invitee suggestions use **round** 24px) | xs 20 (8px), sm 24 (10px), **md 32 (14px)**, lg 40 (16px), 48 (20px), 64 (24px) — initials 600 white, `line-height = box` | 8 colours, by `hash(user_id or email) % 8` in this order: green `#247F40`, purple `#9053C2`, teal `#007C7C`, steel `#2974A8`, gray `#555B62`, orange `#9D3B0F`, yellow `#B36200`, red `#DA1639`. **The current user is always purple `#9053C2`** |
| **Meeting client** (participants list, chat avatars) | radius 10 (list 32×32, initials **16px/32px 400**) / radius 6 (chat 32×32) | — | Self `#8E44AD` [M], guest `#D35400` [M]; others [D]: `#16A085 #2980B9 #C0392B #27AE60 #F39C12 #7F8C8D`. Pick by `hash(client_id) % 8` over `[#8E44AD, #D35400, …]`; the local user always gets `#8E44AD` on their own screen |
Initials: first letter of the first two words, uppercase ("Alex Morgan" → "AM"; "Chrome Guest" → "CG").

#### 5.8.15 Presence [M]
10×10 SVG glyphs with fixed colours (`ds-presence-*.svg` = `home-status-*.svg`): Available `#09A639` circle · Mobile `#09A639` phone · Busy `#FF2638` ✕-circle · Do Not Disturb `#FF2638` circle with white bar · Away `#8E9194` clock · Out of Office `#8E9194` calendar-✕ · Offline `#8E9194` ring · **In a meeting `#FF5500` camera (16×10 on the header avatar)** · Calendar event `#FF5500` · PBX `#FF5500`. On the 32px header avatar the glyph is absolutely positioned (Available at top-right x≈1343 y≈13; meeting glyph `right:-5.28px; top:-2.5px`) and the avatar square gets a rounded **notch** cut out around it (Zoom uses `clip-path: path(...)`). Clone: a CSS `mask` with a circle r=7 centred on the glyph, or a 2px white ring — visually equivalent [D]. In profile-menu rows the glyph is a `::before` 10×10 with `margin-right:10px`.

#### 5.8.16 Loading, skeleton, scrollbars [M]
- **8-spoke spinner** (zoom-ui): sizes 16/24/32/48, spoke width 2/3/4/6, height 25%, `top:38%; left:46%`, rotated 45° steps from −135° with `translateY(-120%)`, colour `#0000008F`, `spinner-fade .8s linear infinite`, delays −.3,−.2,−.1,0,−.7,−.6,−.5,−.4s.
- **PWA spinner** `.z-loading`: 24×24 PNG (`mtg-z-loading.png`), `rotate-infinite 1s linear infinite`.
- **Loading mask** `.zoom-loading`: absolute inset 0, bg `rgba(255,255,255,.8)`, `opacity .3s`; centred wrapper 64×64, padding 16, radius 16, bg `rgba(255,255,255,.7)` + `blur(15px)`, 32px spinner.
- **Skeleton** bar: radius 4, bg `#0000000A`, `skeleton-pulse 1.5s ease-in-out infinite`.
- **Scrollbars:** Workplace global `::-webkit-scrollbar{width:6px;height:6px}` track transparent radius 6, thumb `#C1C1C1` radius 6 (hover `#6B6B6B`). Meetings list 8px: track `#0000000F` radius 3 + `inset 0 0 5px #00000014`, thumb `#0000001F` radius 3 + `inset 0 0 10px #0003`. Calendar widget 8px, thumb `#0000006B` radius 8 min-height 40. Room lists 8px, track `rgba(255,255,255,.09)`, thumb `#707070` radius 6.

#### 5.8.17 Link and divider [M]
`.zoom-link`: `inline-flex`, radius 4, `#0D6BDE`, no underline; hover **underline** + `#0C60C8`; active underline + `#084085`; disabled `#ADB1B8`. Divider 1px `#DFE3E8`.

### 5.9 Icon inventory (`docs/reference/icons/`, 180 files)
Single-colour SVGs use `currentColor`; set the colour with CSS. Sizes are rendered sizes.

| Area | Files (size / colour) |
|---|---|
| Header | `pwa-zoom-logo.svg` (87×20, brand blue) · `header-back.svg`, `header-forward.svg` (14, `#ADB1B8` disabled / `#2A2B2D`) · `home-header-history.svg` (14, `#2A2B2D`) · `header-search.svg` (16, `#3D4349`; 12 `#686F79` in the dialog) · `header-bell.svg` (16, `#555B62`) |
| Rail | `nav-home.svg`, `home-nav-chat.svg`, `nav-meetings.svg`, `home-nav-contacts.svg`, `nav-settings.svg` (18, `#555B62` / `#222325`) |
| Home | `action-new-meeting.svg`, `action-join.svg`, `action-schedule.svg` (28, white; Schedule art shows a day number — render the **current day of month**) · `chevron-down.svg` (13.3, `#0404138F`) · `home-menu-chevron-right.svg` (14) · `pwa-record.svg`, `pwa-smart-summary.svg`, `pwa-my-notes.svg` (16, multi-colour) |
| Calendar widget | `home-cal-chevron-down.svg` (14, `#222325`) · `home-cal-open-calendar.svg` (14, `#555B62`) · `home-cal-today.svg` (12, `#222325`) · `home-cal-prev.svg`, `home-cal-next.svg` (14, `#555B62`) · `home-cal-more.svg` (14, `#555B62`) · `home-cal-refresh.svg` (14, `#222325`) · `home-cal-info.svg` (20, `#3B90F7`) · `home-empty-beach.svg` (89×90, multi-colour) |
| Search dialog | `home-search-close.svg` (14, `#686F79`) · `home-search-contacts.svg`, `home-search-channels.svg`, `home-search-messages.svg`, `home-search-files.svg` (12) |
| Profile menu | `home-menu-profile.svg`, `home-menu-settings.svg`, `home-menu-plans-billing.svg`, `home-menu-help.svg` (16, `#222325`) · `home-menu-external.svg` (14, hover-only) · `home-menu-download.svg` (14, `#0D6BDE`) · `home-menu-info.svg` (20) · `home-status-{available,busy,dnd,away,offline,in-meeting}.svg` and `ds-presence-*.svg` (10×10, fixed colours) |
| Join | `join-chevron-small-down.svg` / `-up.svg` (14, `#555B62`) · `join-chevron-small-left.svg` (20, `#0E71EB`) · `join-close-16.svg` (16) · `join-launch-zoom-logo.svg` (115×25, `#0B5CFF`) · `join-portal-alert.png` (18) |
| Meetings tab | `mtg-meetings-refresh.svg` (13, `#000`) · `mtg-meetings-add-calendar.svg` (13, `#0E72ED`) · `mtg-meetings-copy.svg`, `mtg-meetings-edit.svg`, `mtg-meetings-delete-x.svg` (12, currentColor) · `mtg-meetings-private-lock.svg` (8×10) · `mtg-meetings-empty-detail.png` (200×200) · `mtg-z-loading.png` (24) · `mtg-modal-confirm-logo.png` (20) · `upcoming-bg.png` (unused) |
| Portal / Schedule | `sch-zoom-logo.svg` (110×25) · `sch-topbar-search.svg` (20, white) · `sch-nav-arrow-down-grey.svg` (10×5, `#666484`) · `sch-nav-arrow-down.svg` (8×4) · `sch-external-link.svg` (14) · `sch-submenu-chevron.svg` (10 in 16 box, `#555B62`) · `sch-upgrade-star.svg` (14, `#0B5CFF`) · `sch-banner-success.svg` (20) · `sch-close.svg` (14, `#555B62`) · `sch-back-chevron.svg` (14, `#0D6BDE`) · `sch-plus.svg` (14, `#0D6BDE`) · `sch-calendar.svg` (14, `#555B62`) · `sch-select-chevron.svg` (12, `#555B62`) · `sch-checkmark.svg` (16) · `sch-x-small.svg` (16, `#DA1639`) · `sch-info.svg` (14, `#8E9194`) · `sch-whiteboard.svg`, `sch-docs.svg` (14, `#0D6BDE`) · `sch-shield-check.svg`, `sch-shield-lock.svg` (16, `#09A639`) · `sch-warning.svg` (20, `#B36200`) · `sch-error-circle.svg` (12, `#DA1639`) · `sch-dp-{prev-year,prev-month,next-month,next-year}.svg` (14, `#555B62`) · `mtg-portal-shield-check.svg` (16, `#09A639`) · `mtg-portal-spinner.svg` (50) |
| Room toolbar | `mtg-mic-on.svg`, `mtg-mic-muted.svg`, `mtg-video-on.svg`, `mtg-video-off.svg` (24, **real Zoom SVGs**) · `room-audio-disallowed.svg` (32×24), `room-video-disallowed.svg` (38×25) (multi-colour) · `mtg-participants.svg` (24) · `mtg-chat.svg` (24) · `mtg-react.svg` (26) · `mtg-share.svg` (27) · `room-hosttools.svg` (24, shield) · `mtg-more.svg` (24×25) · `mtg-end.svg` (24, `#F05` hexagon) · **`mtg-leave.svg`** (24, red door + white figure; attendee Leave) · `caret-up.svg` (12, white) |
| Room header & popovers | `room-info.svg` (16) · `room-encryption.svg` (18, `#25E55F`) · `room-ai.svg` (18) · `room-view-speaker.svg`, `room-view-gallery.svg`, `room-view-speaker-menu.svg`, `room-view-multispeaker.svg` (12) · `room-switch-native.svg` (16) · `room-chevron-right.svg` (16) · `room-copy-url.svg` (24) · `room-copied-check.svg` (16, `#00A832`) · `room-warning.svg` (14×13, `#FAAC2A`) · `room-network-good.svg` (16) · `room-sprite-check@2x.png` (13×12 menu ✓) · `room-sprite-close-x@2x.png` (16 toast ×) · `room-sprite-tile-muted@1.43x.png` (16 name-tag muted mic) |
| Room panels | `room-popout.svg`, `room-close.svg`, `room-merge.svg`, `room-collapse-to-title.svg`, `room-expand-all.svg` (16, `#DFE3E8`/`#CAD1D5`) · `room-back.svg` (20) · `room-pl-participants-list-audio-muted.svg`, `room-pl-participants-list-video-off.svg` (16, `#DE2828`) · `room-pl-video-on.svg` (16, `#747487`) · `room-pl-SvgEllipsis.svg` (16, `#DFE3E8`) |
| Room chat | `room-chat-SvgChatPersistentHeader.svg` (16, `#0E72ED`) · `room-chat-chat-format.svg`, `room-chat-file2.svg`, `room-chat-chat-emoji.svg`, `room-chat-chat-more.svg` (16, `#9DA5B5`) · `room-chat-chat-enter.svg` (16) · `room-fmt-*.svg` (11 format-bar icons, 24, `#9DA5B5`) |
| Room More / React / Invite | `room-more-{show-captions,breakout-rooms,whiteboards,settings,stop-incoming-video}.svg` (16) · `room-react-reactions-{1f44f,1f44d,1f602,1f62e,2764,1f389}.svg` (24) · `room-react-nvf-*.svg` (16) · `room-react-icons-more.svg` (16×4) · `room-invite-{default_email,gmail,yahoo_mail}.png` (≈83×61) |
Full per-file tables: `01-shell-home.md` §12, `02-meetings.md` §D, `03-schedule.md` §13, `04-join.md` §8, `05-meeting-room.md` §20, `06-design-system.md` §8, `08-prejoin-and-live-media.md`.

---
## 6. Workplace shell (F1, P0) — `home-08-calendar-empty-no-promo.jpg`, `01-home.jpg`

### 6.1 Layout skeleton (1366×768) [M]
```
div.home (flex column, bg #F1F4F6, 100vw×100vh, overflow hidden)
├─ header container                 0,0     1366×64   bg #FFF, border-bottom 1px #DFE3E8
├─ banner slot (empty)              0,64    1366×0    margin-bottom 4px, padding 0 6px
└─ mainBody                         0,68    1366×700  flex row, padding 0 6px 6px 0
    ├─ rail                         0,68    80×694    flex 0 0 80px, padding 0 4px, bg #F1F4F6, flex column, align-items center
    ├─ content column               80,68   1280×694  flex 1   (946 when the Activity Center panel is open)
    │   └─ content card             80,68   1280×694  bg #FFF, radius 12, overflow hidden, flex column
    ├─ drag handle (Activity Center only)   6×694, transparent, cursor col-resize
    └─ right panel (Activity Center only)   328×694, bg #FFF, radius 12, overflow hidden
```
Content card size at any viewport = `calc(100vw - 86px) × calc(100vh - 74px)`. Every Workplace page renders inside the card. Zoom also shows a "Workplace Pro" upsell banner under the card on some pages (Meetings, in-app web client); **omit it**, so the card is always 694 tall at 1366×768.

**Loading state [M]:** for ~1–3 s after load Zoom's header shows only the logo + "Workplace"; the right slot mounts later. Clone: render everything at once; while `/api/me` loads, show the right slot empty (no skeleton).

### 6.2 Top header [M]
`header` = `display:flex; justify-content:space-between; align-items:center; gap:48px; height:64px; padding:0 16px; background:#FFF; border-bottom:1px solid #DFE3E8`.

```
header
├─ left (16,19.5)  logo block: flex, gap 12
│   ├─ a (logo)  87×24 box, img 87×20 at (16,22)  pwa-zoom-logo.svg
│   └─ span "Workplace"  box x=114.8 w=118.7 h=24; 22px/24px 600 #222325; padding-left 12 (glyphs from x=126.8); cursor pointer
│        ::before divider: position absolute; left 0; top 50%; translateY(-50%); 1×20 #DFE3E8  (x=114.8, y 21.5–41.5)
└─ right (281.6 → 1350; flex 1; justify-content flex-end; gap 12)
    ├─ slot container: flex, gap 24
    │   ├─ leading (empty below 1440px; see §11)
    │   ├─ searchArea: flex 1 1; justify-content center; min-width 160; overflow hidden  (x 305.6 → 935.7)
    │   │   └─ cluster: flex, gap 6
    │   │       ├─ nav cluster 72×32 at x=376.7 → Back (377,20) · Forward (401,20) · History (425,20), each 24×24
    │   │       └─ search trigger 409.8×32 at (454.7,15.5)   width: clamp(160px, 30vw, 440px); flex-shrink 1
    │   └─ trailing: flex, gap 12 (959.7 → 1306)
    │       ├─ Admin Center   960,16 102×32
    │       ├─ Download       1074,16 91×32
    │       ├─ Upgrade        1177,16 85×32
    │       └─ Activity bell  1274,16 32×32
    └─ avatar button 1318,16 32×32  (12px after trailing; right padding 16)
```
All right-side controls are 32 tall at y=15.5–47.5.

| Element | Box | Style | States | Behaviour |
|---|---|---|---|---|
| Logo | img 87×20 @(16,22) | `pwa-zoom-logo.svg` | — | Clone: link to `/wc/home` |
| "Workplace" | — | 22/24 600 `#222325` | — | Clone: no-op (Zoom opens zoom.us) |
| Back / Forward | 24×24, radius 6, border 1px transparent, icon 14 (`header-back.svg` / `header-forward.svg`) | **disabled**: `#ADB1B8`, `cursor:not-allowed`, `aria-disabled=true` | enabled (never in our clone): `#2A2B2D`, hover `#6E76801F`, active `#6E76806B`; `transition: background-color .25s cubic-bezier(.4,0,.2,1)` | Zoom keeps them disabled outside Team Chat; **clone: always disabled** [M]. Native `title` "Back(⌘+[)" / "Forward(⌘+])" |
| History | 24×24 radius 6, `home-header-history.svg` 14 `#2A2B2D` | hover `rgba(110,118,128,.12)`, active `.42` | dark MUI tooltip "History" (§5.8.9), 4px below | Toggles the History popover (§6.3) |
| Search trigger | 409.8×32, radius 8, border 1px transparent, padding `0 12px`, gap 6, centred | bg `#ECEFF1`; icon `header-search.svg` 16 `#3D4349`; text "Search" + span "⌘ + K" (span padding `0 6px`) 14px/20px 400 `#3D4349`, ls 0.4px | hover `#E8EBEE`; active / `aria-expanded=true` `#DFE3E8`; no transition; no tooltip | **Static UI only (no-op).** Optional P2: click or ⌘K / Ctrl+K opens the static Search dialog (§6.4) |
| Admin Center | 102×32, radius 12, padding `6px 8px` | 14px/20px 400 `#555B62`, ls −.15px, transparent | hover/focus-visible bg `#6E76801F` + `#0C60C8`; active bg `#6E76803D` + `#084085` | static (no-op) |
| Download | 91×32, radius 12, padding `6px 14px` | bg `#F1F4F6`, 14px/18px 400 `#0D6BDE`, ls −.15px | hover bg `#6E76801F` + `#0C60C8`; active `#6E76803D` + `#084085`; focus-visible outline `2px solid #0D6BDE` offset 2 | static (no-op) |
| Upgrade | 85×32, radius 12, padding `6px 14px` | bg `#0D6BDE`, 14px/18px **500** `#FFF` | hover `#0C60C8`; active `#084085` | static (no-op) |
| Activity bell | 32×32, radius 999, border 1px transparent, `header-bell.svg` 16 `#555B62` | — | hover/focus-visible bg `#6E76801F`; pressed (`aria-pressed=true`) / active `#6E76803D`; **Prism white tooltip "Activity Center"** 98×24, 8px below, centred | **Static UI only (no-op)**: tooltip and hover only. Optional P2: toggles the static panel (§6.5) |
| Avatar | button 32×32 (radius 4, no hover effect); inner 32×32 radius 10 bg `#9053C2`, initials "AM" 14px/32px 600 `#FFF` | presence glyph §5.8.15 (Available green; **In a meeting** orange camera while this browser is in a meeting) | `aria-expanded` mirrors the menu; `aria-label="Alex Morgan, profile options"`; no tooltip | Click → profile menu (§6.6) — the assignment's **profile placeholder**. P0 |

### 6.3 History popover [M] (P1, static content)
`189×68` at (424.5, 51.5), bg `#FFF`, border 1px `#DFE3E8`, radius 8, padding 12, shadow `--zoom-box-shadow-large`, `opacity 200ms cubic-bezier(.4,0,.2,1)`. Content (padding 10): "**No session history yet**" 14px/18px 400 `#686F79`, margin-top 4. Toggle by clicking History again; outside click and Escape close [D].

### 6.4 Global Search dialog (⌘K) [M] — `home-02-search-dialog.jpg` (Static UI only; optional P2)
Opens on search-trigger click or **⌘K / Ctrl+K**; input autofocused. Closes on **Escape** and on ✕. **Backdrop click does not close it** [M].
```
backdrop  fixed inset 0, rgba(0,0,0,.5), opacity .225s cubic-bezier(.4,0,.2,1)
paper (role=dialog)  323,70  720×628, bg #FFF, radius 12, margin 32, --zoom-box-shadow, centred both axes
└─ content padding 24 → inner 672×580
   ├─ input row 672×36, inline-flex, align center, padding 2px 4px (no border, no bg)
   │   ├─ group (flex 1, padding 0 12px): magnifier 12×12 #686F79 + input wrapper (padding 4px 0 4px 12px)
   │   │    input h24, transparent, no border, 14px #2A2B2D, caret #0D6BDE, placeholder "Search"
   │   │    when non-empty: "Clear" tertiary small button 50×24, margin-left 18, 13px/16px #686F79
   │   └─ ✕ close 24×24 tertiary icon button, margin 4px 8px, icon 14 #686F79 (home-search-close.svg)
   ├─ chips row  padding 8px 12px
   │   └─ 5 chips: h24, padding 4px 8px, radius 100px, margin 2px 12px 2px 0 (last 0), no border, icon 12 + 4px gap, 13px/16px
   │        selected "Top results" (99w, search icon): bg #0D6BDE, text/icon #FFF
   │        others bg #F7F9FA, text #2A2B2D: "Contacts" 87w · "Chats & Channels" 140w (#) · "Messages" 93w · "Files" 60w
   └─ results 672×500, overflow-y auto
       └─ section header 672×40, flex space-between, padding 8px 12px
            title "Recent searches" 14px/21px 700 #2A2B2D  ← becomes "No results" after typing
            "Clear all" tertiary small 67×24, padding 4px 8px, 13px/16px #686F79, :active bg #F7F9FA
```
Clone behaviour (if built): chips toggle the selected style; typing shows "No results" and the inline **Clear** (Clear empties the field and restores "Recent searches"). No real search.

### 6.5 Activity Center (bell) — `home-03-activity-center.jpg` (Static UI only; optional P2)
| Part | Value |
|---|---|
| Layout [M] | Content column shrinks 1280→**946**; 6px drag handle (x 1026–1032, col-resize); panel **328×694 @ (1032,68)**, bg `#FFF`, radius 12, no border/shadow. Home re-centres in the 946 column (clock centre x≈553). Bell toggles it (`aria-pressed`) |
| Header [D] | ~48px: "…" icon at left, title **"Activity Center"** centred ~16px 500 `#222325`, ✕ at right |
| Tabs [D] | **"Focus"** (selected, ~14px 600 `#222325`, 2px `#0E72ED` underline) · **"Other"** (~14px 400 `#686F79`); right: filter icon and "mark all read" icon; 1px `#DFE3E8` rule under the tabs |
| Empty state [D] | party-popper illustration ≈140×128 (draw a simple one); **"You've cleared your suggestions"** ~16px 700 `#222325`; "Check out the rest of your notifications in the Other tab." ~14px/20px `#686F79` (≈290 wide, 2 lines); link **"View other notifications"** ~14px `#0E72ED` |

### 6.6 Profile menu (avatar) [M] — `home-04/05-profile-menu-*.jpg`, `home-06-about-modal.jpg` (P0 as the static profile placeholder; submenus and About modal P2)
**Root popover** **268×502 @ (1082, 51.5)** (right edge aligned to the avatar's right edge 1350, 4px below it), `position:fixed; z-index:1002`, bg `#FFF`, border 1px `#DFE3E8`, radius 12, `--zoom-box-shadow`, `opacity .3s linear`. Inner padding 6 + list padding 6 → rows 242 wide at x=1095. Row base §5.8.10 (32 tall, padding `7px 8px`, radius 8, hover `#6E76801F`, active `#6E76806B`). Outside click closes; clicking a row closes.

| # | Row | Box | Content |
|---|---|---|---|
| 0 | User info | 242×52 @ y=65, padding `7px 8px` | avatar 32 radius 10 `#9053C2` + 8px · name **"Alex Morgan"** 14px/18px `#222325` · email 12px/16px `#686F79`, margin-top 4, ellipsis |
| 1 | Status (submenu) | 242×32 @ y=117 | presence glyph `::before` 10×10 + 10px · current status text ("Available" / "In a Zoom meeting") 14/18 · chevron-right 16 `#222325` at right |
| — | separator | 9 | line at y=157, x 1103–1329 |
| 2 | Profile | y=166 | `home-menu-profile.svg` 16 + 8 · label · trailing `home-menu-external.svg` 14 with **opacity 0 → 1 on row hover** |
| 3 | Settings | y=198 | `home-menu-settings.svg` + external on hover. Clone: opens the rail Settings modal (§6.9) |
| 4 | Plans and billing | y=230 | `home-menu-plans-billing.svg` + external on hover. static |
| 5 | Help (submenu) | y=262 | `home-menu-help.svg` · chevron-right 16 |
| — | separator | 9 | line at y=302 |
| 6 | Add account | y=311 | label only, static |
| 7 | Sign out | y=343 | label only, static |
| 8 | Upgrade banner | 242×120 @ y=382 | info banner (§5.8.12), `margin:0 -8px -8px`, icon hidden; title **"Get more from Zoom"** 14/18 600; text "Upgrade to Zoom Workplace Pro for unlimited meetings and more" 12px/16px `#222325` (200 wide, 2 lines), mb 8; button **"Upgrade now"** sm primary 101×24 (12/16 500, ls .36px). Row has no hover bg. static |
| 9 | Download the Zoom app | 242×32 @ y=509 | full-width text button: `home-menu-download.svg` 14 + 4 + label 14px/32px `#0D6BDE` (hover `#0C60C8`), centred. static |

**Status submenu** (hover the status row): opens **to the left**, 232×186 at (847, 104.5) (3px gap to the root; top = row top − 12), same floating style, list padding 12, rows 206 wide: **Available · Busy · Do Not Disturb ›** (sub-submenu 232×218 to the left: "20 minutes", "1 hours", "2 hours", "4 hours", "8 hours", "24 hours" — sic) **· Away · Out of Office**. Selecting changes the avatar glyph locally (no backend) [D].
**Help submenu** 232×171 at (847, 250): **About Zoom Workplace** (→ About modal) · **Zoom Support** (external icon on hover) · **Zoom Community** (external on hover) · separator · **Report problem...** (static).
**About modal:** overlay `rgba(255,255,255,.75)`; 480×305 centred @(443,231.5), style §5.8.11, close ✕ 20×20 (icon 12, radius 30%, padding 4) at top-right; Zoom wordmark 106×24 · "Version: 7.2.0.3239 ( 0924 )" 14px/24px `#222230`, margin 24 0 · "Copyright ©2012-2026 Zoom Communications, Inc. All rights reserved." 14px/20px `rgba(4,4,19,.56)` · "Open Source Software ↗" 14px/24px `#0E72ED`, margin-top 54 (static). Clone: show "Version: Clone 1.0" instead of Zoom's build string [D].

### 6.7 Left rail [M]
- Container 80×694 at (0,68): `flex:0 0 80px; padding:0 4px; background:#F1F4F6; display:flex; flex-direction:column; align-items:center`. Tab list: flex column, `gap:2px`, width 72.
- **Tab** (`role=tab`): **72×56**, `border-radius:8px; padding:12px 0 8px; border:0; background:transparent; color:#555B62; cursor:pointer`; inner flex column centred; icon 18×18; label 10px/14px 400, ls 0.12px, margin-top 4, centred.
- **States:** default `#555B62`; **hover** bg `#6E76801F` + text `#222325` (**instant, no transition**); **selected** (`aria-selected=true`) bg `#FFF` + text `#222325` (hover keeps white); keyboard focus ring at `outline-offset:-4px`. **No tooltips.** Tabs are drag-reorderable in Zoom (`transform .3s ease`) — not needed (P2).
- **While a meeting is shown in the shell, no tab is selected** [M, `room-31`].

| Tab | Box | Icon | Route |
|---|---|---|---|
| Home | 4,68 | `nav-home.svg` | `/wc/home` |
| Chat | 4,126 | `home-nav-chat.svg` | `/wc/team-chat` (placeholder, §6.8) |
| Meetings | 4,184 | `nav-meetings.svg` | `/wc/meetings` |
| Contacts | 4,242 | `home-nav-contacts.svg` | `/wc/contacts` (placeholder, §6.8) |
| Settings (bottom) | 4,690 (`margin-top:auto; margin-bottom:16px`) | `nav-settings.svg` | opens the Settings modal (§6.9), not a route |
- Unused badges (for reference): red dot 8×8 `#DA1639`; counter 11px/14px white on `#DA1639`, radius 7, padding `0 4.3px`, `translate(-35%,-35%)` at the icon's top-right.
- The rail never changes with viewport size (§11). With a very short viewport the Settings tab's auto margin collapses to 4px.
- **Clicking a rail tab while in a meeting** [D]: open the End/Leave popover (§8.14); after the user picks Leave/End, navigate to the tab. Cancel keeps the meeting.

### 6.8 Placeholder pages (P1) [M]
- **Chat `/wc/team-chat`** (`home-10-chat-tab.jpg`): left sub-sidebar 328 wide (border-right 1px `#DFE3E8`): header "Chat ▾" 16px/20px 590 `#2A2B2D` ls −.31px at (104,91); gear icon button 32×32 radius 8 at x=319; round **+** button 32×32 `radial-gradient(141.42% 141.42% at 0 0, #508AFF 0%, #0B5CFF 100%)`. Filter pills at y=136 (h32, radius 20, border 1px `#DFE3E8`, gap 10): **All** (selected bg `#E7F1FD`, border `#A8CCF8`, 14px `#0D6BDE`), @ Mentions, Chats, ··· More. Collapsible groups (36px rows, chevron + 14px/20px `#555B62`): Apps, Chats & Channels, Starred, Shared spaces. Main pane empty state: chat-bubbles illustration + "Start chatting by clicking or creating a chat in the left sidebar." 16px/20px `#2A2B2D`, 400 wide, centred. All static.
- **Contacts `/wc/contacts`** (`home-11-contacts-tab.jpg`): left list 360 wide: search input 304×32 (radius 8, border 1px `#98A0A9`, padding `10px 10px 10px 25px`, placeholder "Search", 14px/24px) at (90,78) + "Add a contact" 24×24 button (radius 6, border 1px `#98A0A9`) at (404,81); list shows the seeded users (avatar 32 + name 14px `#222325`, 48px rows) [D: Zoom showed a spinner + "Loading" 16px `rgba(4,4,19,.56)`]. Right pane (border-left 2px `rgba(125,125,136,.13)`): 200×200 contact-book illustration + "View Contact info by clicking a contact in the left panel" 14px `rgba(4,4,19,.56)`.

### 6.9 Settings modal (rail Settings, profile Settings) [M] — `home-12-settings-dialog.jpg` (P1, the assignment's **settings placeholder**; contents static)
Transparent overlay; dialog **820×660 @ (273,54)**, bg `#FFF`, radius 12, shadow `0 0 24px rgba(0,0,0,.075)`. Header 46px, padding `13px 16px`: "Settings" 20px/20px 400 `#000`; close ✕ 16×16. 1px `#EDEDF4` rule. Left nav 170 wide (border-right 1px `#EDEDF4`, padding 16): items 137×32, radius 12, padding `0 12px`, margin `6px 0`, 16px/16px `#131619`, 20×20 icon tile radius 5 (Audio/Video `#82C786`, Chat `#70C3A0`, My account `#5B8DEF`) + 8px; **active** bg `#0E71EB`, text white. Items: **General, Audio, Video, Chat, My account**. General pane: "Navigation" 14px 700 + "Drag items to reorder the toolbar" 12px; "Reset to default" text button 12px 700 `#0E72ED`; "Auto-call" 14px 700 + checkbox "Automatically receive a call when a scheduled meeting starts" 14px/18px `#2A2B2D`. All static.

---
## 7. Screens

### 7.1 Home `/wc/home` (F2, P0) — `home-08-calendar-empty-no-promo.jpg`, `home-01-overview.jpg`

#### 7.1.1 Structure [M]
```
content card (main)  80,68 1280×694   flex column, justify flex-start, align-items center, overflow auto
├─ clock block       637.7,132 164.7×68   margin 64px 0 28px, flex column centred, color #232333
│   ├─ time  "11:06 PM"
│   └─ date  "Wednesday, October 7"
├─ actions           576,228 288×84.7    margin-bottom 24
│   └─ row: flex, justify-content center, align-items flex-start, gap 60, row-gap 32, flex-wrap wrap
│       ├─ column New meeting (56 wide, flex column, space-between, centred, color #6E7680)
│       ├─ column Join
│       └─ column Schedule
└─ cards column      420,336.7 600×425.3  flex column, flex 1, overflow auto (Workplace 6px scrollbar), width 600
    ├─ hub row       600×56, flex wrap, gap 16, margin-bottom 16
    ├─ calendar widget   600×300 at y=409, margin-bottom 16          (§7.1.6)
    └─ Recent meetings card  600 wide at y=725 (DV1)                 (§7.1.9)
```
Zoom also injects a "Workplace Pro – Limited time offer!" promo carousel (600×154 + 24 margin) between the hub row and the calendar: **omit it**. Without promo, Zoom's widget (`flex:1 1; height:300px`) flex-fills to **600×337**. Because our Recent card follows it, the clone uses **`flex:0 0 300px`** (Zoom's declared height) [D]. The Recent card header is then visible at the bottom edge and the column scrolls.

#### 7.1.2 Clock [M]
- Time `h:mm A` in the browser time zone ("11:06 PM"): 40px/40px **600** `#232333`, ls 0.37px.
- Date `EEEE, MMMM d` ("Wednesday, October 7"): 16px/20px 400 `rgba(4,4,19,.56)`, margin-top 8.
- Updates exactly on the minute boundary (Zoom's text changed at hh:mm:00.44 every minute): `setTimeout` to the next minute, then every 60 s. The date updates with it. No hover or click behaviour.

#### 7.1.3 Action buttons [M]
| | New meeting | Join | Schedule |
|---|---|---|---|
| Box | 56×56 @576,228 | 56×56 @692,228 | 56×56 @808,228 |
| Base | radius 20, padding 14, no border, icon 28×28 white, `margin-bottom:12px`; bg `#FF742E` | bg `#0E71EB` | bg `#0E71EB` |
| Icon | `action-new-meeting.svg` | `action-join.svg` | `action-schedule.svg` (draw the **current day of month** in the calendar art) |
| Hover and `:focus` | `transform:translateY(-4px); box-shadow:0 4px 11px 0 #B3B3B3` | same | same |
| Transition | `transform .15s ease, box-shadow .15s ease` | same | same |
| Active | bg `#E56829` | bg `#0C63CE` | bg `#0C63CE` |
| Disabled (while this browser is in a meeting) | bg `#F9CBB7`, no lift, `cursor:auto`, label `#909096` | bg `#B1C7F6` | bg `#B1C7F6` |
| Label | "New meeting" + chevron (551,296 105.6×16.7) | "Join" (707,296) | "Schedule" (806,296) |
| aria-label | "New meeting" | "Join" | "Schedule" |
| Click | Start an instant meeting (§7.3); with "Use my PMI" checked, start the PMI | Join modal (§7.2) | `/meeting/schedule` (DV4) |
- Labels: 14px/16px 400 `#6E7680`, nowrap, top = button bottom + 12 (y=296). Column pitch 116 (56 + 60 gap). No tooltips.
- **Chevron** (`.start-label__icon`): 16.67×16.67 button, `margin-left:4px`, no bg/border, `border-radius:30%`, `padding:.125em`, `chevron-down.svg` 13.33px `rgba(4,4,19,.56)`; **hover/focus bg `#F2F2F7`**; `aria-haspopup=true`, `aria-expanded` mirrors the popover. Click → New-meeting popover. Clicking the orange button itself starts the meeting at once.

#### 7.1.4 New-meeting options popover [M] — `02-home-new-meeting-dropdown.jpg`, `home-07-new-meeting-pmi-submenu.jpg`
- Prism popover `role=dialog`, **285×112 @ (506, 320.7)**: horizontally **centred on the chevron** (centre x 648.5), **8px below** it. bg `#FFF`, border 1px `#DFE3E8`, radius 10, `--zoom-box-shadow`, `opacity 300ms cubic-bezier(.4,0,.2,1)`, body padding 0, focus-trapped.
- Panel padding `5px 0`, 14px `#232333`, left-aligned. **No visible divider** between the two rows.
- **Row 1** (283×50, padding 16): PWA checkbox (§5.8.6: 16×16, border `#BABACC`, checked `#0E71EB` no border) + "**Use my Personal Meeting ID (PMI)**" 14px/18px `#232333`, margin-left 8. Persist in `localStorage['zc.use_pmi']`.
- **Row 2** (283×50, padding 16, `role=button`, `aria-haspopup`, `justify-content:space-between`): PMI "**512 345 6789**" (padding-left 8, margin-right 25) + `home-menu-chevron-right.svg` 14px at x=760.
- Row **hover and `[aria-expanded=true]`**: bg `#0E71EB`, text/icon `#FFF`.
- Closes on outside click and Escape.
- **PMI submenu** (hover row 2): **146×118 @ (786, 377)** — overlaps the popover's right edge by 5px, top aligned with row 2; same border/radius 10/shadow, `opacity .3s`. List padding `10px 0`, 14px `#232333`; items 144×32, `padding:0 24px`, `line-height:32px`, hover bg `#0E71EB` + `#FFF`. Items: **Copy ID** (copies the PMI digits) · **Copy Invitation** (copies the PMI invitation text, §10.5) · **PMI Settings** (→ `/meeting/{pmi}/edit`, §7.7). Zoom shows **no toast** after copying [M]; the clone matches. Clicking an item closes both popovers.

#### 7.1.5 Hub entries — Static UI only (no-op) [M]
| | Recordings | Summaries | My Notes |
|---|---|---|---|
| Box | 189×56 @420,337 | 189×56 @625,337 | 189×56 @831,337 |
| Icon wrap (32×32, radius 10, padding 8) | bg `#FFF2F5` | `linear-gradient(94deg,#76C7EA14 3.04%,#4E89FF14 42.49%,#A864E414 85.69%)` | same gradient |
| Icon 16 | `pwa-record.svg` | `pwa-smart-summary.svg` | `pwa-my-notes.svg` |
Card: `display:flex; align-items:center; gap:12px; flex:1 1 160px; height:56px; padding:8px 16px; background:#FFF; border:1px solid #DFE3E8; border-radius:16px; cursor:pointer`. Label 14px/18px **600** `#222325`, ls −0.15px, ellipsis. **Hover bg `#F7F9FA`**; focus-visible `outline:2px solid #0E72ED; outline-offset:2px`. No tooltip.

#### 7.1.6 Calendar widget — container, header, tools [M] (this is the assignment's **Upcoming meetings** section)
- **Container:** `display:block; width:600px; border:1px solid #EDEDF4; border-radius:8px; background:#FFF; overflow:hidden`. Content: [banner (omitted)] → date header → tools row → day list (flex 1, scrolls; 8px scrollbar, thumb `#0000006B` radius 8, min-height 40).
- The "You haven't connected your calendar yet. **Connect now** …" info banner (582×70, margin 8) is **omitted** (calendar connect is static scope; omitting it matches the no-banner capture `home-08`).
- **Date header** `.date-operation`: 598×44, flex space-between, `padding:0 16px 0 8px`.
  - Centre: date button 116×32 ("Today, Oct 7"), radius 12, `padding:2px 8px`, border none, **transparent bg**, label 14px/18px **700** `#222325`, trailing `home-cal-chevron-down.svg` 14 `#222325` that rotates 180° while the picker is open; hover bg `#6E76801F`; `aria-label="Select calendar date: Today, Oct 7"`. Click → day picker (§7.1.7).
  - Right: **Open Calendar** 24×24 round tertiary icon button, `home-cal-open-calendar.svg` 14 `#555B62`, hover `#6E76801F`, active `#6E76806B`, no tooltip. Click → `/wc/meetings` (DV12).
- **Tools row** `.data-tools`: 598×44, `padding:0 16px`, border-top and border-bottom 1px `#DFE3E8`, flex space-between.
  - **Today pill**: 66×24, `padding:2px 8px`, radius 999, border 1px `#98A0A9`, transparent; `home-cal-today.svg` 12 `#222325` + 4px + "Today" 12px/16px 400 `#222325`; hover bg `#6E76801F`. Click → selected day = today (always enabled).
  - **Previous / Next**: 24×24 round icon buttons, `padding:0 4px`, margin-left 8, `home-cal-prev.svg` / `home-cal-next.svg` 14 `#555B62`, `aria-label` "Previous" / "Next". Click shifts one day.
  - Right: **"…" More calendar actions** 24×24 (`home-cal-more.svg` 14 `#555B62`) → menu below.
- **Day label rule** [M]: `Today, Oct 7` / `Tomorrow, Oct 8` / `Yesterday, Oct 6`, otherwise **`EEE, MMM d`** (`Fri, Oct 9`, `Mon, Oct 5`).
- **"…" menu** [M]: zoom-ui floating menu 207×214, radius 12, border 1px `#DFE3E8`, `--zoom-box-shadow`, z 110, padding 12. Zoom places it to the right of the button where it gets clipped (bug); the clone opens it **below, right-aligned** to the button [D]. Content: caption "**Filter by**" 12px/16px `#686F79` (row 181×32, padding 8) → three checkbox rows (173×30, padding `6px 8px`, margin 4, label 14px/18px `#222325`): "Hosted by you", "With cloud recordings", "With meeting summary" (all unchecked; **static**) → 8px gap → "**Refresh**" (`home-cal-refresh.svg` 14 `#222325` + 8px). Refresh reloads the day and shows the loading overlay.

#### 7.1.7 Day picker [M] — `home-09-calendar-date-picker.jpg`
- Floating container **312×368**, radius **16**, border 1px `#DFE3E8`, `--zoom-box-shadow`, z 102, 10px under the date button, centred on it, with a 14×14 white rotated-square arrow. Inner padding 16; panel body 278 wide, padding 15. Render it in a portal (Zoom lets it be clipped by the content card; don't copy that).
- Header (24 tall): left « (Previous year) ‹ (Previous month) 24×24 round tertiary icon buttons; centre "October" "2026" 14px/24px **600** `#222325` (each label hoverable: radius 4, padding `0 2px`, hover `#6E76801F`; month/year views P2); right › (Next month) » (Next year).
- Table 7 columns × (header + 6 weeks). Cell 32×32, radius 999, border 1px transparent, 14px/30px, `margin:8px 4px 0 0` (36×40 per slot).
  - Weekday header S M T W T F S `#686F79` 400; hover shows a dark tooltip with the full day name ("Sunday": bg `rgba(0,0,0,.64)`, blur 15px, radius 4, padding `2px 6px`, 12px/16px white).
  - Current-month day `#222325`; previous/next-month days `#686F79`. **Past days are allowed** here.
  - **Today, not selected:** bg `#0D6BDE`, text `#FFF`, weight 400; hover `#0C60C8`.
  - **Selected** (`current`): bg `#ECF4FD`, border 1px `#A8CCF8`, text `#0D6BDE` **600** (today-and-selected looks the same).
  - Other days: hover bg `#6E76801F`.
- Click a day → label updates (e.g. "Mon, Oct 12"), picker closes. Clicking the date button again also closes it. Escape and outside click close.

#### 7.1.8 Day list, event cards, empty and loading states
**Data:** `GET /api/meetings?view=day&date=YYYY-MM-DD&tz={browser tz}` → every non-deleted scheduled meeting whose start falls on that local day, plus any instant/PMI instance that is live now (shown on Today), sorted by start time (§10.4). The selected day lives in the URL (`/wc/home?day=2026-10-08`) so refresh keeps it [D].

**Card states** (from Zoom's widget CSS, `01-shell-home.md` Appendix A.1) [M CSS]; the state class is computed every 30 s [D for the thresholds]:
| Class | When [D] | Style [M] |
|---|---|---|
| (default) | upcoming, starts > 15 min from now | bg `#FFF`, border 1px `#DFE3E8`; hover border `#98A0A9`, no shadow |
| `isComing` | start − 15 min ≤ now < start | bg `#F2F8FF`, border `#A8CCF8`; hover border `#4793F1`; status "Starting soon" |
| `now` | start ≤ now ≤ end, or the meeting has a live instance | same blue style; status "Now" |
| `isPast` | end < now and no instance happened | bg `#F8F9FA`; title **14px/16px `#6E7680`**; meta `#555B62`; hover border `#98A0A9` |
| `isPast joined` | end < now and an instance happened | blue style (`#F2F8FF` / `#A8CCF8`) |
| first non-past card after a past card | — | `margin-top:24px` |

**Card anatomy** (CSS [M], content [D]):
```
div.ax-container (padding 4px 16px)
└─ div.list-item  padding 8; border 1px; radius 12; margin 4px 0; position relative; cursor default
   └─ div.header (flex column)
      ├─ main row (flex, gap 8, align-items flex-start)
      │   ├─ left (flex 1, min-width 0)
      │   │   ├─ title     14px/20px weight 590 #323539, 2-line clamp, padding-right 4, word-break break-word   ← topic
      │   │   ├─ time      12px/16px, padding 1px 0  "10:00 AM - 10:40 AM"
      │   │   └─ indicator 12px/16px #323539, margin-top 2, max-width 200, ellipsis  "Meeting ID: 812 3456 7890"
      │   └─ right (flex-shrink 0)  status 10px 700 #AF1E30: "Starting soon" | "Now"   (isComing / now only)
      └─ more row (flex, align center, margin-top 4, min-height 26)
          ├─ action button (only when isComing / now / within 15 min after start): sm primary pill,
          │    font 14px/20px, padding 2px 10px, radius 100px, margin-right 10 → "Start" (opens /wc/{n}/start?fromPWA=1)
          │    or "Join" when an instance is live and another browser is host; focus ring box-shadow 0 0 0 2px #FFF, 0 0 0 4px #0E72ED
          └─ "…" (margin-left auto): padding 2px 4px 1px, transparent, icon 14 #555B62; hover bg hsla(213,8%,47%,.12) radius 6
```
- "…" menu [D] (zoom-ui floating menu, §5.8.10, right-aligned under the button): **Start** · **Copy Invitation** · **Edit** (P1) · **Delete** (P1, red `#DA1639`, opens the Delete modal §7.4.8).
- Card body click (not on a button) → `/wc/meetings?select={number}`.
- The current-time "flag" line (`.flag`: 1px `#FF5F0F` across the top at −3.5px with a 7px dot) is P2.
- **Empty day** [M]: centred column (padding `4px 16px`, 14px/20px): `home-empty-beach.svg` **89×90**, margin-bottom 24 → "**No meetings scheduled.**" 14px/20px 400 `#555B62`. **DV2:** if a later day has meetings, add a text button below, margin-top 4, 14px/20px `#0956B5`: "**Next: Thu, Oct 8**" → selects that day [D].
- **Loading** (day switch, Refresh) [M]: overlay over the list (`rgba(255,255,255,.8)`, `opacity .3s`) with a centred 64×64 wrapper (padding 16, radius 16, bg `rgba(255,255,255,.7)`, blur 15px) holding a 32px 8-spoke spinner.
- **Initial skeleton** [M]: bar `calc(100% − 32px)`×26 at margin `16px 16px 4px`; then cards `calc(100% − 32px)`×114, padding 8, radius 12, border 1px `#DFE3E8`, margin `4px 16px`, containing bars 100%×20, 126×16 (mt 5), 58×20 floated right (mt 8). Bars radius 4, bg `#0000000A`, `skeleton-pulse 1.5s`.

#### 7.1.9 Recent meetings card — **Deviation from Zoom (assignment requirement, DV1)** [D, built from the widget's CSS]
- Container: identical to the calendar widget (600 wide, border 1px `#EDEDF4`, radius 8, bg `#FFF`, overflow hidden), margin-bottom 16.
- Header row: 598×44, `padding:0 16px`, flex space-between, border-bottom 1px `#DFE3E8`: title "**Recent meetings**" 14px/18px **700** `#222325` (same as the date-button label) · right "**View all**" (zoom-ui sm tertiary: h24, padding `2px 8px`, radius 999, 12px/16px `#0D6BDE`, hover bg `#6E76801F` + `#0C60C8`) → `/wc/meetings?tab=previous`.
- List `.ax-container` (padding `4px 16px 8px`): up to **5** most recent **ended instances**, newest first, each rendered as a `.list-item.isPast` card: title = topic (14px/16px `#6E7680`, 1 line ellipsis); line 2 (12px/16px `#555B62`) `Tue, Oct 6 · 3:00 PM - 3:32 PM`; line 3 (12px/16px `#555B62`, margin-top 2) `32 min · 4 participants`. Hover border `#98A0A9`; `cursor:pointer`; click → `/wc/meetings?tab=previous&select={instance_uuid}`.
- Empty: "**No recent meetings.**" 14px/20px `#555B62`, centred, padding 24.
- Loading: two skeleton cards (§7.1.8).

### 7.2 Join Meeting (F4, P0) — `join-01…04-*.jpg`, `03/04-join-modal-*.jpg`

#### 7.2.1 Entry points
Home **Join** button · `/wc/join` (→ `replace('/wc/home')` then open the modal) · portal header "Join" (→ `/wc/join`) [D]. No `window.open` anywhere.

#### 7.2.2 Modal measurements [M]
```
overlay  fixed inset 0, background rgba(0,0,0,.2), z-index 1001 — covers header and rail
content  flex, align/justify centre, pointer-events none (children visible)
modal    459,265  448×238  width:min(448px,100vw - 48px); max-height:min(100vh - 40px,520px);
         padding 32; bg #FFF; border none; radius 32; box-shadow 0 6px 12px #00000014, 0 12px 24px #00000014; overflow visible
├─ h2 "Join Meeting"                 491,297 384×24   700 20px/24px #222325, ls -0.45px, left-aligned
├─ form (margin-top 24, position relative)
│   ├─ label "Meeting ID or Personal Link Name"   491,345 384×18   400 14px/18px #222325, ls -0.15px, margin-bottom 4, for=input
│   ├─ input#join-meeting-modal-meeting-id        491,367 384×40   bg #FFF; border 1px #C1C6CE; radius 12; padding 6px 40px 6px 16px;
│   │                                                               400 14px/18px #222325, ls -0.15px; caret #222325; NO placeholder
│   └─ history toggle (only when history exists)  843,375 24×24    position absolute; right 8; top 30; radius 999; color #555B62;
│        icon join-chevron-small-down.svg 14 (↔ -up when open); hover/focus bg #F1F4F6; role=button; aria-label "Meeting history list"
└─ footer (flex, justify-content flex-end, gap 16, margin-top 32)  491,439 384×32
    ├─ Cancel  732.5,439 71.5×32   border none; radius 12; padding 6px 14px; bg #F1F4F6; color #0D6BDE; 400 14px/18px, ls -0.15px
    └─ Join    820,439 55×32       same box; enabled bg #0D6BDE, label 500 14px/18px #FFF; disabled bg #ADB1B840, label #ADB1B8
```
Vertical rhythm: 32 + title 24 + 24 + label 18 + 4 + input 40 + 32 + buttons 32 + 32 = 238.

#### 7.2.3 States [M]
| Element | State | Style |
|---|---|---|
| Input | hover | no change |
| Input | focus (mouse **and** keyboard) | border stays `#C1C6CE`; **outline 2px solid `#2D8CFF`, offset 1px** (follows the 12px radius) |
| Input | on open | autofocused |
| Input | error | none — the modal has **no error state** |
| History toggle | hover / focus | bg `#F1F4F6` (+ focus outline 2px `#2D8CFF` offset 1) |
| Cancel | hover / active | **no visual change** |
| Cancel / Join | keyboard focus | `outline:2px solid #4B96F1; outline-offset:2px` |
| Join | enabled hover / active | `#0C60C8` / `#084085` |
| Join | disabled | bg `#ADB1B840`, text `#ADB1B8`, `cursor:not-allowed`, `aria-disabled=true`, `tabindex=-1` (not the `disabled` attribute) |
| Join | joining | label "**Joining...**", disabled (the modal closes in the same tick) |
| All | transitions | none; **open and close are instant** (no animation) |

#### 7.2.4 Input rules [M] (`lib/joinInput.ts`; port exactly)
```
onChange(v):
  v = v.replace(/\s/g, '')
  if v === ''                          → value = ''
  else if /^\d+$/.test(v)              → value = format(v.slice(0, 11))      // digits capped at 11
  else if /^[a-zA-Z0-9.\-_]+$/.test(v) → value = v.slice(0, 40)             // personal link name, case kept, no formatting
  else                                 → reject the change (keep the previous value)
format(d): len ≤ 3 → d ; 4–6 → d[0..3]+' '+d[3..] ; 7–10 → d[0..3]+' '+d[3..6]+' '+d[6..] ; 11 → d[0..3]+' '+d[3..7]+' '+d[7..]
isReady = /^\d{9,11}$/.test(noSpaces) || /^[a-zA-Z][a-zA-Z0-9.\-_]{4,39}$/.test(noSpaces)
```
| Input | Value | Join |
|---|---|---|
| `12345678` | `123 456 78` | disabled |
| `123456789` | `123 456 789` | enabled |
| `1234567890` | `123 456 7890` | enabled |
| `12345678901` | `123 4567 8901` | enabled |
| `12345678901234` | `123 4567 8901` (truncated) | enabled |
| `123-456-7890` | kept as text | disabled |
| `abcd` / `abcde` | unchanged | disabled / enabled |
| `1abcde`, `.abcde`, `12345678a` | unchanged | disabled |
| `a b c` | `abc` | disabled |
| `abcde!`, `@#$%`, `é` | rejected (previous value kept) | — |

#### 7.2.5 Paste [M] (`onPaste`, always `preventDefault`)
1. Read the clipboard text. Try `new URL(text)`. Accept it when the protocol is `https:`, the host is ours (`NEXT_PUBLIC_APP_URL` host) **or** matches `^([^.]+\.)*zoom(dev)?(\.[^.]+?)+$`, and the path starts with `/j/`, `/s/`, `/w/`, `/my/` (number = last path segment) or `/wc/` (`/wc/join/(\d{9,11})`, `/wc/(\d{9,11})/join`, `/wc/(\d{9,11})/start`, `/wc/my/(.+)`). Save **all** query params (e.g. `{pwd}`).
2. Otherwise: `text.split('?')[0].split('/').pop() || text`, and clear the saved params.
3. Remove characters outside `[a-zA-Z0-9.\-_]`, then run the normal setter (formatting, caps).
4. Typing after a paste clears the saved params.
Examples: `https://<app>/j/81234567890?pwd=abc` → `812 3456 7890`, params `{pwd:'abc'}` · `zoom.us/j/12345678901` → `123 4567 8901` (no params) · `Meeting ID: 123 456 7890` → `MeetingID1234567890` (a valid PLN).

#### 7.2.6 Meeting-history dropdown [M] (P1)
- Clone data: `localStorage['zc.join_history']` = up to 20 `{number, topic}` entries, newest first, added after a **successful** join. Hide the toggle when empty.
- Open: toggle click, Enter or Space (`aria-expanded=true`; the first item is auto-focused). Close: Escape on an item (stops propagation, so the modal stays), outside click, choosing an item, toggle again. Focus returns to the toggle.
- Choosing fills the input with the formatted number.
- Box: 384 wide at `top:calc(100% + 4px)` (491,411), z 10, bg `#FFF`, border 1px `rgba(186,186,204,.2)`, radius 8, shadow `0 8px 24px rgba(35,35,51,.1)`. List height `(n+1)×32`, max 8 rows (256), `overflow:auto`, 8px scrollbar.
- Item 382×32, `padding:0 12px`, flex space-between, `role=option`, `aria-label="the topic is {topic}, and ID is {number}"`: topic 500 14px/20px `#131619`, ellipsis, padding-right 24 · number 400 12px/16px `#6E7680` (space after 3 chars and before the last 4: `812 3456 7890`). Hover/focus: bg `#0E72ED`, both texts `#FFF`, outline 2px `#2D8CFF` offset 0.
- Last row "**Clear History**" (`role=button`): 500 14px/20px `#4793F1`. Clears the list and hides the toggle.

#### 7.2.7 Keyboard and close [M]
Focus trap: input → history toggle → Cancel → Join (only when enabled) → input. **Enter** in the input submits when `isReady`. **Escape** closes the modal (if the dropdown is open, the first Escape closes only the dropdown). **Overlay click does nothing.** Cancel closes; reopening starts empty with Join disabled. Not draggable.

#### 7.2.8 Submit → in-shell web-client panel (adopted from Zoom; replaces v1.0's inline error)
1. Join / Enter → label "Joining...", the modal closes immediately, and the app **pushes** `/wc/{digits}/join?fromPWA=1` (pasted params first: `/wc/{n}/join?pwd=abc&fromPWA=1`). A PLN pushes `/wc/my/{name}?fromPWA=1` (P2; until then it renders the invalid page).
2. The Workplace header and rail stay. No rail tab is selected. The content card shows the **web-client panel**:

| Element | Spec [M] |
|---|---|
| Panel | fills the content card (1280×694), bg `#FFF`, overflow hidden, position relative |
| Back button | at card-relative (38,32), 64×26, z 30, flex, transparent, no border, padding `1px 6px`, 14px/24px `#0E71EB`; icon `join-chevron-small-left.svg` **20×20** `#0E71EB` + "Back". Click → `/wc/home` |
| Loading | centred 32×32 spinner, `rotate-infinite 1.5s linear infinite`, until `validate` returns |
| **Unknown meeting** (`validate.exists=false`) | text "**This meeting link is invalid (3,001)**" — 600 **20px/28.57px** `#232333`, ls 0.42px, portal font, centred, padding-left 4; block padding 100 → text top at card y=142 (page y≈210) |
| Known meeting | the dark pre-join page (§7.10) fills the panel; Back stays visible at (38,32) [D] |
- The `validate` call satisfies the assignment's "validate meeting existence" (DV7). Existence is checked on the page, not in the modal, exactly like Zoom.

### 7.3 Instant meeting flow (F3, P0)
1. Click orange **New meeting** → `POST /api/meetings/instant {use_pmi}` (use_pmi from `zc.use_pmi`).
2. Backend creates a `meetings` row (`type='instant'`, topic `"{Host name}'s Zoom Meeting"`, unique **11-digit** number, 6-char passcode, invite token) — or reuses the PMI meeting — opens a `meeting_instances` row, and returns `{meeting, invite_url, start_url}`.
3. Frontend → `/wc/{number}/start?fromPWA=1` → `POST /api/meetings/{number}/start` → participant token → `/wc/{number}/meeting?fromPWA=1`, **inside the Workplace shell** (§8.1). **No pre-join for the host** [M: a signed-in host opening `/wc/{n}/join` is redirected to `/start` and joins at once].
4. Entry state [M from Zoom's default settings]: **mic muted** ("Mute my microphone when join a meeting" ✓) and **video off** ("Stop my video when joining" ✓). The browser asks for mic/camera permission on entry (`getUserMedia({audio:true, video:true})`, tracks disabled); if denied, show the permission bar (§8.13) and the disallowed icons.
5. Toast "**You are host now.**" for **3000 ms** (`room-01-initial-host-toast.jpg`).
6. The shareable link is available immediately: meeting-info popover (§8.4.3), Participants caret "Copy invite link" (§8.6.4), Invite modal (§8.11).
7. While this browser is in a meeting, the Home action buttons and Meetings Start/Join buttons are disabled (§7.1.3, §7.4.3).

---
### 7.4 Meetings tab `/wc/meetings` (F6, P0) — `mtg-01…10-*.jpg`, `05-meetings-tab.jpg`

#### 7.4.1 Structure [M]
Workplace CSS reset applies (`line-height:1` unless stated).
```
div.meetings-container [role=tabpanel]        80,68 1280×694   flex row, overflow hidden
├─ left                                        360×694  flex 0 0 auto, flex column, position relative
│  ├─ header                                   360×46   flex, align/justify centre, padding 16, position relative
│  │  ├─ refresh button (absolute left 16, top 50%, translateY(-50%))
│  │  └─ title "Upcoming"  (DV3: segmented Upcoming | Previous)
│  └─ body (flex 1) → list (flex column, height 100%)
│     ├─ PMI card                              (Upcoming only)
│     ├─ PMI divider
│     ├─ groups [role=listbox tabindex=0]      flex 1 1 auto, height 0, overflow auto  ← only this scrolls
│     │   ├─ empty text | per day: group label + items, group dividers between groups
│     ├─ add-calendar divider (1px full width)
│     └─ "Add a calendar" footer
├─ v-divider                                   2×694, background #7D7D8821
└─ right (flex 1 1 auto)                       918×694 → detail
```
At 1366×768 (no Zoom promo banner): header 68–114, PMI card 114–192, divider 192 (+10 margin), groups 203–727, footer divider 727, footer 728–762.

#### 7.4.2 Left column [M]
| Element | Box | Style |
|---|---|---|
| Refresh | 96,80 21×23 | bg `#FFF`, border none, radius 4, padding 4, `mtg-meetings-refresh.svg` 13×13 `#000`, `aria-label="Refresh"`; hover bg `#0000000F`; active `#0000004D`. Click is **debounced 3000 ms** and replaces **both** panes with the 24px spinner until the list returns |
| Title (Zoom) | 225,84 70×14 | "Upcoming" 14px/14px **700** `#131619`, plain text, not focusable |
| **Title (clone, DV3)** | centred in the 360 header | two text buttons 16px apart: active segment 14px/14px **700** `#131619`; inactive 14px/14px 400 `#747487` (hover `#131619`); active has a 2px `#0E71EB` bar, radius 2, 6px below the text [D]. URL `?tab=upcoming\|previous` |
| PMI card | 96,114 328×78 | `<button>` flex column centred, height 78, `margin:0 16px`, border none, radius 12, bg `#FFF` (UA padding `1px 6px`). Number "512 345 6789" 18px/21px **700** `#232333`, margin-bottom 4. Label "**My Personal Meeting ID (PMI)**" 13px/16px 400 `#747487` |
| PMI states | | hover bg `#E7F1FD`; **selected** (and selected:hover) bg `#0E71EB`, both texts `#FFF`; no transition; keyboard focus `2px solid #2D8CFF` offset 1 |
| PMI divider | 116,192 288×1 | bg `#EDEDF4`, `margin:0 36px 10px` |
| Group label | 96,203 320×40 | 13px/16px **700** `#747487`, `margin:0 16px; padding:12px 20px` |
| Meeting item | 96,253 328×123 (320 when the scrollbar shows) | radius 12, `margin:10px 16px` (vertical margins collapse → 10px between items), `padding:8px 20px`, 13px/16px `#747487`; `role=option`, `aria-selected`, tabindex 0 (selected) / −1 |
| Item lines (each `margin:8px 0`) | 280 wide | 1 **topic** 16px/19px **700** `#232333`, `overflow-wrap:break-word`, **wraps** (3 lines = 57px) · 2 **time** `10:00 AM - 10:40 AM` · 3 **`Host: Alex Morgan`** (single-line ellipsis; shown for every non-PMI meeting) · 4 **`Meeting ID: 812 3456 7890`** |
| Item states | | hover bg `#E7F1FD`; selected bg `#0E71EB`, all text `#FFF`. Click / Enter / Space selects; Up/Down move focus |
| Group divider | 280×1 | `background:#EDEDF4; height:1px; margin:0 36px`; sits 10px under the last item; none after the last group |
| Empty | groups area | "**No upcoming meetings**" (Previous: "**No previous meetings**" [D]) 14px/14px `rgba(4,4,19,.56)`, flex-centred in the whole area |
| Footer divider | 360×1 | bg `#EDEDF4` |
| Footer | 360×34 | flex centred, `padding:10px 0`: `mtg-meetings-add-calendar.svg` 13 `#0E72ED` + 4px + "**Add a calendar**" 14px/14px `#0E72ED` (hover unchanged). Static (no-op) |
| "Add a calendar" popover | 240×80, 8px above the link, centred on it | on **hover**: Prism popover (bg `#FFF`, border 1px `#DFE3E8`, radius **10**, `--zoom-box-shadow`, z 1300, body padding 12), text centred 14px/18px 400 `#2A2B2D`: "Connect to your work or personal calendar to view all upcoming meetings here"; 16×16 rotated-square arrow (white, right/bottom borders 1px `#DFE3E8`, radius `50% 0 4px`); `opacity 300ms cubic-bezier(.4,0,.2,1)` |
- **Scrollbar** (groups only): 8px; track `#0000000F` radius 3 + `inset 0 0 5px #00000014`; thumb `#0000001F` radius 3 + `inset 0 0 10px #0003`.
- **Grouping [M JS]:** by local day of `start_time`: same day → `Today`; next day → `Tomorrow`; else `ddd, MMM D` (`Wed, Oct 14`); a different year appends `, YYYY` (`Fri, Jan 15, 2027`). Sorted by start time. (Zoom puts recurring meetings with no fixed time in a last group "Recurring" with no time line — P2.)
- **Default selection [M]:** the **first meeting item** when the list has meetings; the PMI card only when there are none. `?select={number}` overrides. On mount, if the selected index > 1, scroll the previous item into view.
- **Upcoming data:** `GET /api/meetings?view=upcoming&from={start of today, local}` = scheduled meetings starting today or later (including ones earlier today) + any live instant meeting.
- **Previous data (DV3):** `GET /api/meetings?view=previous` = ended instances, newest first. Items reuse the meeting-item component: topic → time `3:00 PM - 3:32 PM` (actual start–end) → `Host: Alex Morgan` → `Meeting ID: …`, grouped by day with labels `Today` / `Yesterday` / `ddd, MMM D` [D]. No PMI card in Previous.

#### 7.4.3 Right detail — layout [M]
`.meetings__detail`: `display:flex; flex-direction:column; padding:48px 4px 40px 40px`.
| Element | Box | Style |
|---|---|---|
| Topic | 482,116 874×29 (wraps) | 24px/29px **700** `#39394D`, margin-bottom 32 |
| Rows (time, host, number) | 482,177… | 13px/16px 400 `#232333`, `margin:16px 0` each |
| Buttons row | y=241 (PMI) / y=305 (scheduled) | `display:flex; flex-wrap:wrap; margin:32px 0`; each button `margin:0 16px 10px 0` |
| Invitation area | flex 1 1 auto, flex column, align-items flex-start | "Show Meeting Invitation" link + block |

| Selected item | Rows (in order) | Buttons |
|---|---|---|
| **PMI** | topic "My Personal Meeting ID (PMI)" · number "512 345 6789" (no host, no time) | **Start** 75 · **Copy Invitation** 162 · **Edit** 85 |
| **Scheduled** | topic · time row `10:58 PM - 11:28 PM` [+ `<span> \| </span>` + notice] (**no date**: the list group carries the date) · `Host: Alex Morgan` · `Meeting ID: 812 3456 7891` | **Start** 75 · **Copy Invitation** 162 · **Edit** 85 · **Delete** 103 (× icon `mtg-meetings-delete-x.svg`) |
| **Previous (DV3)** [D] | topic · `Tue, Oct 6, 2026 · 3:00 PM - 3:32 PM` · `Host: Alex Morgan` · `Meeting ID: …` · `Duration: 32 min` · `Participants: 4` | **Start** (PMI and scheduled meetings that still exist) · **Copy Invitation** (if the meeting still exists) |
- Buttons are z-buttons (§5.8.2): Start = normal (75×32); Copy / Edit / Delete = tertiary with 12px icons (`mtg-meetings-copy.svg`, `mtg-meetings-edit.svg`, `mtg-meetings-delete-x.svg`), icon→text gap 4.
- **Availability [M]:** Start and Join are **disabled** while this browser is in a meeting; Edit and Delete are disabled while that meeting is live. (Other-host and private meetings exist in Zoom but not in our single-user data.)

#### 7.4.4 Time notice [M JS] (`lib/notice.ts`, recomputed every 1000 ms)
```
if meeting has a live instance                      → "In Progress"            colour #0E72ED
else if now ∈ [start − 30 min, start − 1 min)       → "Starts in {N} minutes"  N = floor((start − now)/1 min), #0E72ED
else if now ∈ [start − 1 min, start)                → "Starts in 1 minute"     #0E72ED
else if now ∈ [start, start + duration]             → "NOW"                    #FD4C4C
else                                                → no notice (and no " | ")
```
Rendered as `<span>10:58 PM - 11:28 PM</span><span> | </span><span class="notice">…</span>` in the time row. Examples observed: 10 min before → "Starts in 9 minutes".

#### 7.4.5 Actions
| Button | Behaviour |
|---|---|
| **Start** | `/wc/{number}/start?fromPWA=1` (host path, §3) |
| **Copy Invitation** | `GET /api/meetings/{n}/invitation` → copy text → "Copied!" tooltip (§7.4.6). On copy failure: no feedback |
| **Edit** | `/meeting/{n}/edit` (DV5; Zoom opens `app.zoom.us/meeting/{n}/edit?from=pwa` in a new tab). P1 |
| **Delete** | Delete Meeting modal (§7.4.8). P1 |
| **Show / Hide Meeting Invitation** | toggles the invitation block (§7.4.7); first open fetches the text |

#### 7.4.6 "Copied!" tooltip [M] — `mtg-02`
Prism white tooltip, placement top, **offset 6**: 58×24 centred over Copy Invitation (bottom edge 6px above the button); bg `#FFF`, border 1px `#DFE3E8`, radius 4, shadow `0 4px 8px #00000014, 0 2px 4px #00000014`, padding `3px 6px`, text "**Copied!**" 12px/16px 400 `#2A2B2D` centred, z 1500, no arrow; `opacity 300ms cubic-bezier(.4,0,.2,1)`. Closes on **mouseleave or blur** of the button (no timer); clone also auto-closes after 2 s on touch devices [D].

#### 7.4.7 Meeting invitation block [M] — `mtg-03`
- Link `<button>`: no bg/border, `#0E72ED`, **13px, line-height 8px** (box 157×10), padding `1px 6px`, `margin:12px 0 16px`; hover `#0E71EB` + underline. Text "Show Meeting Invitation" ↔ "Hide Meeting Invitation".
- Block: `align-self:stretch; flex:1 1 auto; height:0; overflow:auto; font-size:13px; white-space:break-spaces; word-break:break-word`; 6px scrollbar. While loading: 24px spinner, margin `10px 20px`.
- `<pre>`: 13px/**13px** 400 `#000`, page font (not monospace), `white-space:pre`, margin 0, no max-width. Text = §10.5 with **CRLF** line endings.

#### 7.4.8 Delete Meeting modal [M] — `mtg-07` (P1)
- Overlay fixed, z 1001, bg **`rgba(255,255,255,.75)`**.
- Box **560×184**, centred with `margin-top:-4rem` (x403 y260), `max-width:80vw; min-width:25vw`, bg `#FFF`, radius 8, shadow `0 0 20px #2626264D`.
- Header 40 tall, padding `10px 6px`, space-between: 20×20 logo (`mtg-modal-confirm-logo.png`) + "Zoom" 12px/12px `#000` (margin-left 6) · close × 12px (`mtg-meetings-delete-x.svg`), padding 4, margin-right 2, hover/active bg `#6A6A6A1A`.
- Body padding `10px 16px 0`: `h5` "**Delete Meeting**" 14px **600** `#222325`; `p` margin-top 24, 14px/19.2px `#000`: "You can recover this meeting within 7 days from the **Recently Deleted** page on the Zoom web portal" ("Recently Deleted" is a link `#0D6BDE`, static).
- Footer flex-end, padding `0 16px 16px`, children `margin:0 10px 10px 0` (last 0): **Delete** (z-button destructive 85×32: `#DE2828`, hover +9% black, active +18%, 14px/20px 700 white) · **Cancel** (z-button secondary 87×32: `#F1F4F6`, `#131619`, hover `#DFE3E8`, active `#C1C6CE`).
- Delete → `DELETE /api/meetings/{n}` (soft delete) → remove the item and select the next one. Error → light toast "**Delete meeting failed**" (failure icon). Escape, × and Cancel close.

#### 7.4.9 Loading and empty states [M] — `mtg-10`
- Loading (first load or Refresh): each pane is replaced by a flex-centred 24×24 spinner (`mtg-z-loading.png`, `rotate-infinite 1s linear infinite`).
- Nothing selected (should not happen; PMI always exists): centred column with `mtg-meetings-empty-detail.png` **200×200** + "Connect your calendar or schedule a meeting" 14px.

---
### 7.5 Portal shell (Schedule, Edit, meeting detail) [M] — `sch-01-top.jpg`, `sch-04-bottom-footer.jpg`
Page bg `#FFF`; font `--font-portal`, every text `letter-spacing:0.42px`. Zoom's page has a 15px vertical scrollbar (document width 1351); all x values below assume it.

#### 7.5.1 Header — **104px** fixed (P0 layout, links static)
Container `position:fixed; top:0; z-index:1030; background:rgba(255,255,255,.97); box-shadow:0 0 2px 0 rgba(0,0,0,.2)`; content starts at y=104.
| Part | Spec |
|---|---|
| **Black strip** 0,0 1351×40 | bg `#00031F`. Right-aligned, 20px apart, right edge 24px from the edge: **Search** (785,0 71×40: `sch-topbar-search.svg` 20×20 white + 5px + "Search" 300 14px/40px `#FFF`) · "Support" (876,10) · "1.888.799.9666" (951,10) · "Contact Sales" (1096,10) · "Request a Demo" (1212,10) — links 300 14px/15px `#FFF`. Static |
| **Nav bar** 0,40 1351×64 | logo `sch-zoom-logo.svg` **110×25 at (24,59)**, `margin:0 20px 0 24px` (clone → `/wc/home`) · "Products" (154,45 105×52), "Solutions" (258), "Resources" (366): 500 16px/52px `#666484`, padding `0 15px`, radius `20px 20px 0 0`, **no chevron at rest** (an 8×4 white arrow `sch-nav-arrow-down.svg` slides in on hover: `left:10px; opacity:1`, `transition: .25s`) · "Plans & Pricing" (499,61) 500 16px/20px `#666484`. Right: "**Schedule**" (922,40 105×64, 600 16px/20px `#666484`, padding `22px 15px`) → `/meeting/schedule` · "**Join**" (1027, 64×64) → `/wc/join` · "**Host**" + 10×5 chevron `sch-nav-arrow-down-grey.svg` (text 1106,62) · "**Web App**" + chevron (1188,62) · avatar 32×32 radius 10 `#9053C2` "AM" 600 14px/32px white at (1304,57). Nav hover: no background. Static except Schedule, Join and the logo |

#### 7.5.2 Body
- Zoom's dismissible green marketing banner ("Welcome to Zoom!…", 69px) is **omitted**.
- Two columns: **side menu 300 wide** (x 0–300, bg `#F7F7FA`, padding `8px 0`, scrolls with the page, not sticky) + content (`padding:32px`) → **content column x=332, width 987**. Content padding is `32px 24px` at 1024–1279 and `32px 16px` at ≤1023 (§11).
- Footer (`#39394D`, 500px, link columns) is **P2 static**; until then the page ends after the form.
- Zoom's floating support bubble (56×56 `#4488FF`) is omitted.

#### 7.5.3 Side menu [M]
- Inner width 296, `padding:0 4px 64px 0`; nav padding 4 → items at **x=4, width 288**.
- **Item:** `display:flex; align-items:center; min-height:32px; padding:3px 8px; margin-bottom:4px; border-radius:12px; color:#222325; 400 14px/18px; cursor:pointer`. Children: 16px invisible placeholder + 8px → label (flex 1, padding `4px 0`) at **x=36** → optional "New" badge → optional ↗ icon. Pitch **36**.
- **States:** hover bg `rgba(110,118,128,.12)`; pressed `rgba(110,118,128,.42)`; **selected** bg `#F2F8FF`, text `#0D6BDE` (`aria-current="page"`); keyboard focus `outline:2px solid #4B96F1`; no transition.
- **Section title** "My Products": row `margin-top:12px`, text 400 **12px/18px `#686F79`** at x=12, not hoverable.
- **"New" badge:** 32×16, margin-left 8, `padding:0 4px; border:1px solid #A8CCF8; border-radius:999px; background:#F2F8FF; color:#2057B1; 500 10px/16px`.
- **↗ icon:** `sch-external-link.svg` 14×14 `#222325` at x=270, margin-left 8.
- **Groups** (`aria-expanded`): chevron `sch-submenu-chevron.svg` (10×10 in a 16 box, `#555B62`) at x=12, `rotate(-90deg)` collapsed → `0` expanded, `transition: transform .3s ease-in-out`; label at x=36; sub-list `padding-left:24px` per level; show/hide is instant.
- Items in order (y offsets from the menu top + 12): **Home** · *My Products* (title) · **AI** New ↗ · **Meetings** (selected on all our portal pages) · Recordings · Summaries · **Hub** New ↗ · Whiteboards ↗ · Notes · Clips ↗ · Canvas ↗ · Paper ↗ · Sheets ↗ · Slides ↗ · Tasks ↗ · Scheduler ↗ · Discover More Products (margin-bottom 24) · ▸ My Account · ▸ Admin · ▸ Support. Sub-items: see `03-schedule.md` §3.4.
- **Upgrade to Pro** pill: centred in 296 (145×32, ≈788px below the first item), `padding:6px 14px; border-radius:24px; border:1px solid #00F0EA; background:linear-gradient(180deg,rgba(0,240,234,.25) 0%,rgba(0,240,234,.11) 100%)`; `sch-upgrade-star.svg` 14 `#0B5CFF` + 4px + "Upgrade to Pro" 400 14px/18px `#0B5CFF`. Static.
- Clone mapping: **Home → `/wc/home`**, **Meetings → `/wc/meetings`**; groups expand/collapse visually (P2); everything else static.

### 7.6 Schedule Meeting `/meeting/schedule` (F5, P0) — `sch-01…18-*.jpg`, `06–09-schedule-*.jpg`
**Deviation (DV4):** same-tab SPA route. `document.title` "Schedule a Meeting - Zoom".

#### 7.6.1 Page head [M]
- **Back link** at content top + 32 (Zoom 332,208 with banner; clone **332,136**): `sch-back-chevron.svg` 14 `#0D6BDE` + **5px** gap + "**Back to Meetings**" 400 14px/18px `#0D6BDE` (138×18). Hover `#0C60C8` + underline; active `#084085`. → `/wc/meetings`.
- **H1** "**Schedule Meeting**" 600 **20px/22px** `#222325`, `margin:20px 0 32px` (clone y=178). First form row at clone **y=232** (Zoom 304).

#### 7.6.2 Row layout [M]
`.zoom-form-item__row{display:flex; gap:10px; margin-bottom:25px}`; label wrapper **160px** (`padding:4px 0; align-items:start`) → controls column (flex 1) starts at **x=502** (width 817). Labels 400 14px/18px `#222325` (Topic label `#232333`), top at row y + 4. Nested vertical margins collapse, so every row is followed by 25px. Width classes: `long-width` 490, `middle-long-width` 260, `middle-width` 150, `short-width` 100. Banners: `max-width:810px`.

#### 7.6.3 Rows (top to bottom) [M]
`Δy` = offset from the Topic row top (clone absolute y = 232 + Δy). "F" = functional (stored), "S" = Static UI only.
| # | Label | Δy | Height | Control (x, size) | Default | F/S |
|---|---|---|---|---|---|---|
| 1 | `*` Topic | 0 | 32 | text input 502, 490×32 | "My Meeting" (value **and** placeholder), focused with all text selected on load | F |
| 1b | — | 57 | 19 (50+ open) | "+ Add Description" text button → textarea 490×50 | collapsed | F |
| 2 | When | 100 | 32 | date 502 240×32 · time 750 173×32 · AM/PM 931 104×32 (gaps 8) | today, next half-hour [D] | F |
| 3 | Duration | 157 | 32 | hr select 502 150×32 · "hr" 660 · min select 682 150×32 · "min" 840 | 0 hr 40 min | F |
| 3b | — | 214 | 76 | Basic-plan warning banner 502, 810×76, margin-bottom 24 | always (Basic) | S |
| 4 | Time Zone | 314 | 32 | filter select 502, 490×32 | browser time zone | F |
| 5 | (none) | 371 | 20 | checkbox "Recurring meeting" 502 | off | F (flag only) |
| 6 | Invitees | 416 | 113 | autocomplete 502 490×32 + warning banner 810×73 (margin-top 8) + added list | empty | F (P1) |
| 7 | Meeting ID | 554 | 30 | radios at 502 / 718 | Generate Automatically | F (PMI option P1) |
| 8 | Template | 609 | 32 | filter select 490×32, placeholder "Select a template" | empty | S |
| 9 | Whiteboard ⓘ | 666 | 32 | secondary button "Add Whiteboard" 150×32 | — | S |
| 10 | Docs | 723 | 32 | secondary button "Add Docs" 109×32 | — | S |
| 11 | Security | 780 | 134 | Passcode checkbox + input (609, 200×32); Waiting Room | passcode on (locked), WR off | F |
| — | divider | 939 | 1 | `border-top:1px solid #EDEDF4`, width 827, `margin:0 0 32px 160px` (x=492) | — | — |
| 12 | Encryption | 972 | 30 | radios Enhanced / End-to-end | Enhanced | S |
| 13 | Zoom AI | 1027 | 109 | tri-state parent + 2 children | all off | S |
| 14 | Workflow | 1161 | 30 | text button "Attach workflow to this meeting" | — | S |
| 15 | My Notes | 1216 | 89 | checkbox + 2 radios | on / "All participants" | S |
| 16 | Meeting chat | 1330 | 32 | checkbox | on | S |
| 17 | Video | 1387 | 65 | Host on/off, Participant on/off | on / on | F |
| 18 | Options | 1477 | 30 | text button "Show" → 4 checkboxes | collapsed | F (2 of 4) |
| 19 | Interpretation | 1532 | 30 | checkbox with long label | off | S |
| — | sticky bar | 1587 | 80 | Save / Cancel | — | F |

#### 7.6.4 Row details [M]
**1 Topic.** Label: asterisk `*` 400 12px/16px `#DA1639` at x=336 (margin-left 4) then "Topic" 14px/18px `#232333` at x=345. Input `zoom-input__inner` 490×32 (§5.8.4), `maxlength=200`, `autocomplete=off`, `aria-required=true`. **Error** (empty or whitespace-only, on blur and on Save): border `#FF6682` (+ inset ring when focused) and the error row "**Topic is required**" (§5.8.4) at y+36; the row grows 32→52 and pushes everything down 20px. Fixing the text removes it on blur. (`sch-05-topic-error-description.jpg`)

**1b Description.** Collapsed: inline-flex (gap 5) = `sch-plus.svg` 14 `#0D6BDE` at x=502 + text button "**Add Description**" 400 14px/18px `#0D6BDE` (521; hover `#0C60C8`, active `#084085`). Click hides the button, shows and focuses `textarea` 490×**50** (min-height 50, padding `6px 12px`, radius 12, placeholder "Add Description" `#686F79`, `maxlength=2000`, `resize:vertical`). Auto-height: 1–2 lines 50, 3 lines 68, ≥4 lines **86** (max) then scrolls. No counter. It stays open when blurred empty.

**2 When** (`display:flex; flex-wrap:wrap; gap:8px`):
- **Date** 240×32: bg `#FFF`, border 1px `#C1C6CE`, radius 12, padding `0 9px 0 11px`; text **MM/DD/YYYY** ("10/07/2026") 400 14px/18px `#222325`; `sch-calendar.svg` 14 `#555B62` at `top:9px; right:10px`. Hover bg `#6E76801F`; keyboard focus border `#4B96F1` + inset. Click → date picker (§7.6.6).
- **Start time** 173×32 (editable filter select; wrapper padding `5px 7px`; input 157×20; chevron at `right:9px`): options **every 15 minutes** `12:00, 12:15 … 11:45` (48, no leading zero). Open: input cleared, old value shown as placeholder, chevron rotated, border `#4B96F1` + 2px `::after` ring. Typing filters by prefix (`3` → 3:00 3:15 3:30 3:45; `3:3` → 3:30; `13` → 1:00…1:45 plus a created "13"). **Free times are accepted**: `9:10` + Enter → stored `09:10` and inserted into the list; `abc` + Enter is rejected (value unchanged). Menu 173×210, scrolled to the selected item (`sch-08-time-dropdown.jpg`).
- **AM/PM** 104×32 select (value at x=943): options **AM, PM** (menu 104×88). Escape closes.
- Default start: the next half-hour after now [D] (Zoom showed 11:00 AM at ~10:3x). Past dates are disabled in the picker. If the chosen date+time is more than 5 min in the past at Save, show an error row under When: "**The start time has already passed**" [D].

**3 Duration** (`display:flex; align-items:center`; this row never shows an error):
| Plan (`NEXT_PUBLIC_PLAN`) | Hour select (150×32) | Minute select (150×32, filterable) | Default | Banner 3b |
|---|---|---|---|---|
| `basic` [M] (what Zoom showed the captured Basic account) | **disabled** at "0": border `#ADB1B840`, value and chevron `#ADB1B8`, bg `#FFF`, `cursor:not-allowed` | **0, 15, 30, 40** (menu 150×152) | **0 hr 40 min** | shown |
| **`pro` (DEFAULT for this clone — the assignment needs a usable duration picker) [D]** | enabled, 0–24 (same box as the basic select but border `#C1C6CE`, value `#222325`) | 0, 15, 30, 45 | 1 hr 0 min | hidden |
"hr" / "min": 400 14px/14px `#232333`, margin-left 8 (x=660 / 840). Stored as `duration_minutes` (0–1440).
**3b Basic-plan banner** (Static): warning banner (§5.8.12) at (502, Δy 214) **810×76**, `margin:0 0 24px 170px` relative to the row; icon `sch-warning.svg` 20 `#B36200` at (519,+17); body `<p>` 400 14px/**21px** `#222325`: "You can schedule meetings for up to 40 minutes each with your current Basic plan. Need more time?" + new line link "**Upgrade to Zoom Workplace Pro**" `#0D6BDE` (no-op).

**4 Time Zone.** Filter select 490×32 (input 446×20 at x=514; chevron at x=967). Label format **`(GMT±H:MM) Label`** — hour not zero-padded, offset = the **current** DST offset (Los Angeles shows `(GMT-7:00)` in October). **149 options** in Zoom's order: see `03-schedule.md` **Appendix B** (IANA id + label); keep the same list in `services/timezones.py` and the frontend. Default: the browser's IANA zone (fallback `users.timezone`; if the zone is not in the list, the first entry with the same current offset) [D]. Filter = case-insensitive **substring** of the label (`india` → "(GMT-4:00) Indiana (East)", "(GMT+5:30) India"; `kol` → "(GMT+5:30) Mumbai, Kolkata, New Delhi"; `+5:30` → India, Mumbai…, Colombo); no match → "**No matching data**"; clearing + outside click keeps the previous value. Menu flips above when needed (`sch-09-timezone-filter.jpg`). Representative labels: `(GMT-7:00) Pacific Time (US and Canada)` · `(GMT-4:00) Eastern Time (US and Canada)` · `(GMT+0:00) Universal Time UTC` · `(GMT+1:00) London` · `(GMT+5:30) India` · `(GMT+5:30) Mumbai, Kolkata, New Delhi` · `(GMT+8:00) Beijing, Shanghai` · `(GMT+9:00) Osaka, Sapporo, Tokyo`.

**5 Recurring meeting.** Checkbox at (502,+2) + label "Recurring meeting" 400 14px/18px `#232333` (x=526); no label in the label column. P0 stores the flag only. **P2:** expanded sub-form (summary "Every day, until Oct 13, 2026, 7 occurrence(s)" 700 14px/24px `#232333`; Recurrence select 200×32 Daily/Weekly/Monthly/No Fixed Time; Repeat every; Occurs on; End date) — see `03-schedule.md` §8.1 and `sch-10…12-*.jpg`.

**6 Invitees** (P1):
- Autocomplete input 490×32, placeholder "**Enter user names or email addresses**".
- Always-visible warning banner below (502, +40) **810×73**, margin-top 8: "Participants won't receive this meeting invite until your calendar is connected." + link "**Connect calendar**" (static).
- Typing opens a suggestion menu (490 wide, 4px below the input, radius 12, border `#DFE3E8`, `--zoom-box-shadow`, list margin 11, `zoom-zoom-in` .3s). Sources: seeded users matching the text (`GET /api/users?q=`) + the typed text itself as an email row. Row 51px, padding `6px 8px`, radius 8, hover `#6E76801F`: 24px **round** avatar (PWA palette by first letter; initial 600 10px/24px white) · 8px · name 400 14px/20px `#323539` · email 400 12px/16px `#6E7680`. An invalid address shows the row disabled (`cursor:not-allowed`) with right-aligned "**Invalid email**" 400 14px/18px `#B22424`.
- Choosing a valid row clears the input and appends it to a list under the banner (margin-top 16, max-height 350, 6px scrollbar `rgba(0,0,0,.42)`): row **490×40**, flex, `padding-right:8px`: avatar 24 · email 400 14px/14px `#232333` `padding:0 8px` ellipsis · remove 24×24 round tertiary icon (`sch-close.svg` 14 `#555B62`, `aria-label="Remove {email}"`). Enter or comma on a valid email also adds it [D]. Stored in `meeting_invitees`; **no email is sent**.

**7 Meeting ID** (radio group, padding-top 4): "Generate Automatically" (radio 502) · "Personal Meeting ID 512 345 6789" (radio 718); `margin-right:32px`. Choosing PMI hides rows 8, 9, 10 and 19. Saving with PMI creates a calendar entry that **uses the PMI number** (§10.1 `uses_pmi`). P1 (P0 = Generate Automatically only, PMI radio still rendered).

**8 Template / 9 Whiteboard / 10 Docs** (Static): Template filter select (placeholder "Select a template" `#686F79`; menu 490×88 with group "Personal templates" → "None"). Whiteboard label + 16×16 ⓘ button at (415,+6) (`sch-info.svg` `#8E9194`; hover popover: bullet list "Can only add 1 whiteboard." / "Whiteboard access is granted to invitees after the event is scheduled. Removing invitees won't revoke their whiteboard access."); button "**Add Whiteboard**" secondary md 150×32 with `sch-whiteboard.svg` 14. Docs: secondary "**Add Docs**" 109×32 with `sch-docs.svg` 14.

**11 Security** [M] (`sch-15-passcode-rules.jpg`):
- Passcode wrapper `display:flex; align-items:baseline`: checkbox "Passcode" **disabled + checked** on Basic (box `#AACDF8`, label `#ADB1B8`; `pro`: enabled, unchecking sets passcode NULL) + 16px gap + input **200×32 at x=609**, `maxlength=10`, default = random 6-char mixed-case alphanumeric. Spaces and symbols are accepted.
- Rules info popover while the input is focused or hovered: **200×74** under the input (14px arrow at top), title "**Passcode must include:**" 600 14px/18px `#222325` (mb 4), row 16px icon + 4px + "At least 1 characters" 400 14px/18px — valid ✓ `#247F40` (`sch-checkmark.svg`), empty ✕ `#DA1639` (`sch-x-small.svg`). Empty → input border `#FF6682`, no text; Save is blocked [D].
- Description `p` 400 14px/**21px** `#686F79`, `margin:4px 0 0 24px` (x=526): "Only users who have the invite link or passcode can join the meeting".
- Checkbox "**Waiting Room**" (502, +68) + description "Only users admitted by the host can join the meeting". Stored (`waiting_room_enabled`), **no runtime effect** (waiting room is static scope).

**12 Encryption, 13 Zoom AI, 14 Workflow, 15 My Notes, 16 Meeting chat** (Static; controls toggle visually, nothing is stored):
- Encryption radios (padding 4/4): radio + `sch-shield-check.svg` 16 `#09A639` + 4px + "Enhanced encryption" + 20×20 ⓘ ("Encryption key stored in the cloud.") | 32px | radio + `sch-shield-lock.svg` + "End-to-end encryption" + ⓘ ("Encryption key stored on your local device. No one else can obtain your encryption key, not even Zoom."). (Zoom's E2E side effects — warning banner, hidden rows — are P2; `sch-16-e2e-encryption.jpg`.)
- Zoom AI: tri-state parent "**Automatically start Zoom AI**" + ⓘ, children at x=524: "Automatically start meeting questions", "Automatically start meeting summary" (parent indeterminate when one is checked). Sub-selects: `03-schedule.md` §5.14.
- Workflow: text button "**Attach workflow to this meeting**" 400 14px/18px `#0D6BDE`.
- My Notes: ✓ "Allow participants to transcribe meeting with My Notes"; vertical radios (margin-left 24, pitch 29): "Only participants in your organization" / ● "**All participants**".
- Meeting chat: ✓ "Allow users to access meeting chats before and after the meeting".

**17 Video** [M]: two sub-rows (`display:flex`), pitch **33px**: name span **120px** 400 14px/14px `#232333` ("Host" / "Participant"), radio group at x=638: "on" (radio 638, label 662) — 32px — "off" (radio 711, label 735). Defaults on / on. Stored (`host_video_on`, `participant_video_on`) and applied as the initial camera state on start/join.

**18 Options** [M]: text button "**Show**" 35×26, padding `4px 0`, `aria-label="Show More Options, Collapsed"` ↔ "**Hide**" ("Hide More Options, Expanded"); instant toggle. Expanded list: checkbox rows, **28px pitch**, first row 32px below the button top:
1. **Allow participants to join anytime** — ✓ **checked by default** → `join_before_host` (F)
2. Mute participants upon entry — off → `mute_upon_entry` (F: joiners start muted)
3. Automatically record meeting on the local computer — off (S)
4. Approve or block entry to users from specific regions/countries — off (S; Zoom opens a region dialog, `sch-17-region-dialog.jpg`, P2)

**19 Interpretation** (Static): checkbox + label "Select sign language interpretation video channels below. You can assign interpreters at any time." (666 wide). Reveal behaviour: `03-schedule.md` §5.20.

#### 7.6.5 Component states on this page
Inputs §5.8.4, selects and menus §5.8.5, checkbox §5.8.6, radio §5.8.7, buttons §5.8.1, info popovers §5.8.9, banners §5.8.12. Motion: menus `zoom-zoom-in-top` 300ms `cubic-bezier(.23,1,.32,1)`; info popovers 200ms; chevrons 300ms linear.

#### 7.6.6 Date picker [M] — `sch-06-datepicker-day.jpg`, `09-schedule-datepicker.jpg`
- Popover (portal) **280×336** (month/year views 280×248), left-aligned with the date field, 4px gap, z 108, bg `#FFF`, border 1px `#DFE3E8`, **radius 16**, **`--zoom-box-shadow-small`**; flips **above** the field when there is no room below; `zoom-zoom-in-top` 300ms.
- Body 278 wide, padding 15. Header 24 tall: « ‹ (24×24 round tertiary icon buttons, `sch-dp-prev-year.svg` / `sch-dp-prev-month.svg` 14 `#555B62`) · centre "October" "2026" 600 14px/24px `#222325` (clickable spans, radius 4, padding `0 2px`, hover `#6E76801F`) · › » (`sch-dp-next-month.svg`, `sch-dp-next-year.svg`).
- Weekday row: S M T W T F S, 32×32, 400 14px/30px `#686F79`.
- Grid always **6 rows × 7**; cell 32×32, `margin:8px 4px 0 0` (last column 0) → **pitch 36×40**, border 1px transparent, radius 999, 400 14px/30px.

| Day | Style |
|---|---|
| available | `#222325`, pointer; hover bg `#6E76801F` |
| **past** (incl. previous-month) | `#ADB1B8`, `cursor:not-allowed`, `aria-disabled=true` |
| next-month | `#686F79`, **selectable** |
| **selected** | bg `#ECF4FD`, border 1px `#A8CCF8`, text `#0D6BDE` **600** |
| **today, not selected** | bg **`#0D6BDE`**, text `#FFF`; hover `#0C60C8` |
| keyboard focus | `::after` 2px `#4B96F1` ring inset −4px |
- Cell `aria-label` "Wednesday,October 7,2026 selected" / "… not selected". Clicking a day sets the field and closes; Escape closes; reopening returns to the day view.
- **Month view** (click "October", P2): header « 2026 »; 3×4 cells 54×32 (`margin:16px 40px 0 0`, radius 999); past months `#ADB1B8`. **Year view** (click "2026", P2): label "2020 - 2029", cells 2019…2030; past years `#ADB1B8`, 2030 `#686F79` (`sch-07-datepicker-year.jpg`).

#### 7.6.7 Sticky action bar [M]
```
div.zoom-sticky (placeholder height 80, width 987) — natural slot after the last row
└─ bar (fixed while the slot is below the viewport): position fixed; bottom 0; left 332; width 987; height 80; z-index 100;
   background #FFF; padding 24px 0; text-align left; no shadow, no border, no transition
   ├─ Save    primary md 60×32 (332, viewport bottom − 56)
   └─ Cancel  secondary md 73×32, margin-left 8
```
- Becomes static when the user scrolls to the end. Width matches the content column (side menu stays visible).
- **Save:** validates (Topic, passcode, start time), then `POST /api/meetings`; while submitting the button keeps its colour, shows an inline 16px spinner and ignores clicks [D]. Success → `router.push('/meeting/{number}')` (§7.8). Failure → light toast with the API message [D].
- **Cancel:** → `/wc/meetings`, no unsaved-changes prompt [M].

### 7.7 Edit Meeting `/meeting/{number}/edit` (F6b, P1) — `sch-19-edit-pmi.jpg`
| Aspect | Scheduled meeting [D] | PMI (Personal Meeting Room) [M] |
|---|---|---|
| `document.title` | "Edit Meeting - Zoom" | "Edit Meeting - Zoom" |
| H1 (600 20px/22px) | `Edit "{topic}"` | `Edit "Alex Morgan's Personal Meeting Room"` |
| Back link | "Back to Meetings" → `/wc/meetings` | same |
| Rows | same as Schedule, prefilled from the meeting (Meeting ID radios become plain text "Meeting ID  812 3456 7890" 14px/32px `#232333`) | **Personal Meeting ID** (value "512 345 6789" 400 14px/32px `#232333`, plain text) → **Security** (passcode prefilled; **Waiting Room ✓**) → divider → **Encryption** → **Zoom AI** → **Workflow** → **My Notes** → **Video** (on/on) → **Options** (join anytime ✓) |
| Buttons | Save / Cancel (same bar) | Save / Cancel |
| Save → | `PATCH /api/meetings/{n}` → `/meeting/{n}` | `PATCH /api/meetings/pmi` → `/meeting/{pmi}` |
| Cancel → | `/meeting/{n}` | `/meeting/{pmi}` |
PMI row offsets (Zoom, banner collapsed): back link 172, H1 214, PMI row 268, Security 325 (h134), Encryption 484, Zoom AI 572, Workflow 706, My Notes 761, Video 875, Options 965. A live meeting cannot be edited (409 `MEETING_LIVE`).

---
### 7.8 Meeting detail `/meeting/{number}` (F5, P0) — `mtg-17-portal-personal-room-detail.jpg`, `mtg-16-portal-copy-invitation-dialog.jpg`
Shown after Save (§7.6.7) and from PMI Settings → Cancel. Portal shell (§7.5) with **Meetings** selected in the side menu. `document.title` "Meeting Details - Zoom" [D]. For a `uses_pmi` calendar entry the route is `/meeting/{pmi}?id={meeting_id}`.

#### 7.8.1 Page head [D]
Zoom renders the Personal Room detail inside its portal Meetings page (h1 "Meetings", "+ Schedule a Meeting" split button, tab bar, a "Details" capsule tab: 80×32, bg `#E7F1FD`, text `#0862D1` 14px/32px 500, radius 6). The scheduled-meeting page was not captured. Clone (both kinds): the Schedule page head — "Back to Meetings" link (§7.6.1) + H1 = topic (600 20px/22px `#222325`, `margin:20px 0 32px`). Rendering Zoom's tab bar for the PMI page is P2 (`02-meetings.md` §B.1–B.4).

#### 7.8.2 Label/value grid [M]
- Form starts at the content left (x=332 in the clone; Zoom x=348 inside its tab padding). Each `.zm-form-item`: **margin-bottom 20**; label column **160px**, padding `4px 12px 4px 0`, label 400 **14px/24px `#131619`**, left-aligned; content starts at +160.
- Values: `p` 400 **14px/21px `#232333`**, padding `4px 0` (single-line row = 32 tall).

| Row | Content |
|---|---|
| Topic | `Weekly Team Sync` (PMI: "Alex Morgan's Personal Meeting Room") |
| Description | only when set; `white-space:pre-wrap` |
| Time | scheduled only: `Oct 8, 2026 11:00 AM India` = `MMM d, yyyy hh:mm a` + the time-zone label without its `(GMT…)` prefix [D format] |
| Meeting ID | `812 3456 7890` |
| Security (73 tall) | line 1: ✓ (14px `#232333`, margin-right 4) "Passcode" + `********` (margin-left 8) + **Show** (link small: padding `6px 0 6px 8px`, 500 14px/20px `#0956B5`, `aria-label="show passcode ********"`) ↔ **Hide** revealing the real passcode. Line 2 (margin-bottom 8, only when enabled): ✓ "Everyone goes into the waiting room" 14px/21px. No passcode → line 1 omitted |
| Invite Link | `<a target=_blank>` full invite URL, 14px `#0D6BDE` + copy icon button (24×18, ghost, margin-left 8, `mtg-meetings-copy.svg` 16 `#6E7680`, `aria-label="Copy Url"`) with portal light tooltip "**Copy the Link**" (top, 119×42). Click → copy URL + portal toast "**Copied to clipboard**" |
| Add to | Static (P2: real `.ics`): three links 16px/32px, margin-right 30, each with a 20×20 icon (margin `6px 4px 0 0`): **Google Calendar** `#0E71EB` · **Outlook Calendar (.ics)** `#3171BB` · **Yahoo Calendar** `#952BCE` |
| *(divider)* | full-width `border-top:1px solid #EDEDF4`, margin-bottom 32 |
| Encryption | `mtg-portal-shield-check.svg` 16 `#09A639` (vertical-align sub, margin-right 4) + "Enhanced encryption" (static) |
| My Notes | "Allow participants to transcribe meeting with My Notes" + grey line "All participants" `#747487` (static) |
| Video | two sub-rows 28px apart: "Host" (120px column) "on"/"off"; "Participant" "on"/"off" — 14px/20px `#232333` |
| Options | one `p` per enabled option, 14px/32px, margin-bottom 16: "Allow participants to join anytime", "Mute participants upon entry" |

#### 7.8.3 Sticky action bar [M]
- In-flow placeholder 82px. When it would be below the viewport: `position:fixed; bottom:0; left:{form x}; width:{form width}; background:#FFF; border-top:1px solid #EDEDF4; z-index:10` (82.5 tall).
- Wrapper padding `24px 0 24px 5px`; buttons inline, `margin-right:10px`, portal `zm-button` small (§5.8.3):
  **Start** (primary 66×32 → `/wc/{n}/start?fromPWA=1`; label "**Join**" while live) · **Copy Invitation** (plain 155×34: copy icon + 500 14px/18px `#131619`) → dialog §7.8.4 · **Edit** (plain 61×32 → `/meeting/{n}/edit`; disabled while live) · **Delete** (plain; scheduled only) → dialog §7.8.5 · **Save as Template** (plain; static).

#### 7.8.4 Copy Meeting Invitation dialog [M]
Overlay `rgba(0,0,0,.5)` z 2000; dialog **700** wide, `margin-top:15vh`, bg `#FFF`, border 1px `#DFE3E8`, radius 8, shadow `0 1px 3px rgba(0,0,0,.3)`, padding 24. Header (padding-bottom 16): "**Copy Meeting Invitation**" 400 24px/32px `#131619` (no ×). Body: readonly `textarea` **650×380**, border 1px `#444B53`, radius 8, padding `4px 12px`, 14px/22px `#131619`, `resize:vertical`, `aria-label="copy invitation content"`, content = §10.5. Footer (padding-top 24, right-aligned): **Copy Meeting Invitation** (primary small 195×32) · **Cancel** (plain small 82×32, margin-left 8). Copy → select all, copy, portal toast "Copied to clipboard"; **the dialog stays open**. Cancel and Escape close.

#### 7.8.5 Portal Delete dialog [M strings, D layout]
Same frame as §7.8.4 (560 wide [D]). Title "**Delete Meeting**"; text "You can recover this meeting within 7 days from **Recently Deleted**." ("Recently Deleted" link static); buttons **Delete** (danger: `#E8173D`, hover `#B10E2C`, white) · **Cancel** (plain). Delete → soft delete → `/wc/meetings`.

#### 7.8.6 Invalid meeting page [M] — `mtg-18-portal-meeting-invalid-id.jpg`
Unknown or deleted number → `document.title` "Error - Zoom", portal header only (no side menu), centred `span` "**Invalid meeting ID. (3,001)**" 400 18px/25.7px `#232333` (padding-left 4) inside a box with padding 50.

### 7.9 Invite-link launch page `/j/{number}` (F17, P1; P0 = redirect) [M] — `join-08-launch-page-from-portal.jpg`
- **P0:** `/j/{n}?pwd=…` → `replace('/wc/{n}/join?pwd=…')` (full-viewport pre-join).
- **P1 (Zoom's page):** font `--font-launch`, bg `#FFF`, no scroll. Zoom does **not** validate the number here.
  | Element | Spec |
  |---|---|
  | Header | fixed 64px, bg `rgba(255,255,255,.97)`, shadow `0 0 2px rgba(0,0,0,.2)`; inner container 1200 wide centred; logo `join-launch-zoom-logo.svg` 115×25 `#0B5CFF` at (107,20) → `/wc/home`; right: "Support" and "English ▾" 400 12px `#0E71EB` (margin-left 24), static |
  | Main | `max-width:840px; min-height:calc(100vh - 214px); padding:40px; display:flex; flex-direction:column; justify-content:center; text-align:center` (263,64 840×554) |
  | Spinner | 38×38, margin-bottom 12: `conic-gradient(#fff 2%, #0E72ED)` ring, inner white disc 26px, 3px blue dot at the top; `rotate 1.4s linear infinite`; after ~2.5 s `opacity:0` (`.2s ease-in-out`) but keeps its space |
  | h1 | "**Join meeting**" 700 24px/40px `#232333`, padding `12px 0`, margin-bottom 52 (609,173) |
  | Buttons | column 400 wide, gap 20, at (483,289): **"Join from Zoom Workplace app"** 400×48, bg `#0D6BDE`, border 1px transparent, radius 8, padding `9px 15px`, 500 16px/20px `#FFF`, hover `#0C60C8`, active `#084085` · **"Join from browser"** 400×48, bg `#FFF`, border 1px `#939BA4`, radius 8, 400 16px/20px `#222325`, hover `#6E76801F`, active `#6E76806B`; keyboard focus `2px solid #4B96F1` offset 2 |
  | Text | hr spacer (margin `8px 0`) → "Don’t have the Zoom Workplace app installed? **Download Now**" 400 14px/24px `#232333` (link `#0E72ED`, static) → margin-top 20 → "By joining a meeting, you agree to our **Terms of Service** and **Privacy Statement**" (static links) |
  | Footer | (291,642): "©2026 Zoom Communications, Inc. All rights reserved." 400 14px/21px `rgba(4,4,19,.56)` + link row 14px/16px (padding `0 6px`, `border-left:1px solid` on all but the first): Trust Center · Acceptable Use Guidelines · Legal & Compliance · Do Not Sell My Personal Information · Cookie Preferences (static) |
- Clone mapping [D]: **"Join from Zoom Workplace app" → `/wc/{n}/join?pwd=…&fromPWA=1`** (our app *is* the Workplace app, so the meeting opens inside the shell). **"Join from browser" → `/wc/{n}/join?pwd=…`** (full viewport). No automatic `zoommtg://` launch and no "Did not open Zoom Workplace app?" popover.

### 7.10 Pre-join page `/wc/{number}/join` (F4, P0) [M] — `18-prejoin-guest-dark.jpg`
Captured live as a signed-out guest (spec 08). Same page in both chromes: full viewport, or inside the in-shell web-client panel when `fromPWA=1` (§7.2.8).

#### 7.10.1 Flow
1. On mount: `GET /api/meetings/{n}/validate?pwd=` (spinner meanwhile).
   - `exists:false` → **invalid page**: in-shell = §7.2.8 panel text; full viewport = portal header (§7.5.1) + centred "**This meeting link is invalid (3,001)**" 400 **18px/25.71px** `#232333`, ls .42, text top **y=195** (`#global-error` margin-top 40, box padding 50); `document.title` "Error - Zoom". (Satisfies "validate meeting existence", DV7.)
   - not live and `join_before_host=false` → **waiting state** [D]: same dark page; the form column shows the topic (24px/36px 700 `#FFF`), "**Waiting for the host to start this meeting.**" 14px/21px `#939BA4`, and the scheduled time (14px/21px `#939BA4`); poll `validate` every 5 s and switch to the form when live.
   - otherwise → the form. The passcode field shows only when the meeting has a passcode and the URL carries no valid `pwd`.
2. The browser requests mic + camera (`getUserMedia`). Initial state [M screenshot]: mic **on** (label "Mute"), video **off** ("Start Video") until the camera is granted; once granted, video turns **on** when the meeting's `participant_video_on` is on. `mute_upon_entry` forces the mic off.
3. **Join** → `POST /api/meetings/{n}/join {client_id, display_name, pwd?, passcode?, audio_muted, video_on}` → token → `/wc/{n}/meeting` (carrying `fromPWA`). The chosen mic/camera states and devices carry into the room. Save `zc.display_name` when "Remember my name" is checked (clear it when unchecked). Add `{number, topic}` to `zc.join_history`.
4. Errors [D copy]: `WRONG_PASSCODE` → passcode input error "**Incorrect meeting passcode**"; `MEETING_FULL` → error under Join "**This meeting is full.**"; `REMOVED` → "**You have been removed from this meeting.**"; `MEETING_NOT_STARTED` → waiting state.

#### 7.10.2 Layout [M]
```
div.preview-root (dark)          full viewport (or panel), bg #1D1E20, font --font-app, no header
└─ centred row (card + 40px + form)    1132 wide; at 1366×768 card at x=117, y≈187 [D]; in the panel x=74, y≈150 [D]
   ├─ preview card               700×394, bg #313235, radius 14, overflow hidden
   │   ├─ <video> mirrored self view, object-fit cover — or, camera off: placeholder rounded square 171×147, radius ≈24,
   │   │      bg #4A4B4E, white-ish person glyph #2C2D30 (head circle + shoulders), centred
   │   ├─ control bar            176×52, bg #040506, radius 10, centred horizontally, 13px above the card bottom
   │   │   ├─ mic button   88×52, radius 10: icon 24 at top 8 (mtg-mic-on.svg + audio meter / mtg-mic-muted.svg);
   │   │   │                label 12px/15px 400 #F7F9FA at top 31: "Mute" | "Unmute"; caret 24×24 radius 8 (caret-up.svg 12)
   │   │   │                at (x+62, y+2), aria "More audio controls" → microphone / speaker device menu
   │   │   └─ video button 88×52: mtg-video-on.svg / mtg-video-off.svg; label "Stop Video" | "Start Video"; caret → camera menu
   │   └─ Backgrounds button     118×30, bg #040506, radius 8, padding 7px 12px, bottom-right 10px inset; 16px icon +
   │                              "Backgrounds" 12px/15px rgba(255,255,255,.8) — Static
   └─ form                       392 wide, top = card top + 13
       ├─ title "Enter Meeting Info"   24px/36px 700 #FFF, centred
       ├─ label "Meeting Passcode"     14px/20px 510 #FFF, 5px above its input   (only when needed)
       ├─ input                         392×40, transparent, border 2px solid #555B62, radius 10, padding 0 18px, 14px #FFF
       ├─ label "Your Name" (12px after the previous input) + input 392×40 (same), prefilled from zc.display_name
       ├─ checkbox row 264×20, 12px below: 16px box (checked bg #0E72ED + white check, radius 3) + 4px +
       │      "Remember my name for future meetings" 13px/19.5px #FFF  (checked by default)
       ├─ Join button   400×40 (extends 4px past the inputs on both sides), radius 10, 16px 700
       ├─ agreement     16px below Join: 14px/21px #939BA4 'By clicking "Join", you agree to our Terms of Service and
       │                Privacy Statement.' (links 14px 500 #1890FF, static)
       └─ (Zoom's reCAPTCHA line is omitted — DV8)
footer (full viewport only)  bottom 18, centred: "© 2026 Zoom Communications, Inc. All rights reserved. Privacy & Legal
                              Policies | Send Report" 12px/18px #939BA4; links underlined rgba(255,255,255,.33), hover #DFE3E8 (static)
```
Vertical rhythm with the passcode row: card top 200 → title 213 → passcode label 249 → input 274 → name label 326 → input 351 → checkbox 403 → Join 434 → agreement 490. Without the passcode row everything moves up 77px and the block stays vertically centred with the card.

#### 7.10.3 States
| Element | State | Style |
|---|---|---|
| Inputs | placeholder / hover / focus / error | `#596069` / bg `#2A2B2D` / border `#0E71EB` / border `#B10E2C` + message 14px/18px `#E02828` 4px below [M CSS] |
| Join | disabled (name empty, or passcode shown and empty) | bg `rgba(255,255,255,.06)`, text `#ADB1B8` [M] |
| Join | enabled / hover | bg `#0E72ED`, text `#FFF` / `#0C60C8` [D] |
| Control buttons | hover / disabled | bg `rgba(255,255,255,.09)` / text `#6E7680` |
| Control icons | devices initialising | 24px white ring spinner (2px stroke) instead of the icon [M] |
| Control icons | permission denied | `room-audio-disallowed.svg` / `room-video-disallowed.svg` (red `#FF0055` slash + warning triangle); labels unchanged; click re-requests permission |
| Enter | in either input | submits when Join is enabled |

#### 7.10.4 Audio-level meter [M] (also on the in-room Mute button)
```
div (24×24, position relative)
├─ svg mic outline (white)
└─ div.inner  position absolute; left 8px; top 1px; width 8px; height 15px; border-radius 5px; overflow hidden
    └─ div.level  position absolute; bottom 0; width 8px; height = level × 100%; background #23D959; transition height .1s linear
```
`AnalyserNode` RMS → 0–100%, updated every animation frame, clamped; 0 when muted (the muted icon replaces it).

### 7.11 Left page `/wc/{number}/left` [D] (DV9)
Full viewport, bg `#FFF`, content centred: "**You have left the meeting.**" or "**This meeting has been ended by host.**" or "**You have been removed from this meeting.**" 700 20px/24px `#222325`; 24px below: primary md **Rejoin** (only if the meeting is live and the user was not removed) + 8px + secondary md **Return Home** (→ `/wc/home`). Used only for full-viewport (invite-link) participants; in-shell participants return to `/wc/home` [M].

---
## 8. Meeting room (F7/F8, P0) — `room-01…37-*.jpg`, `10–17-meeting-*.jpg`, `19–23-meeting-attendee-*.jpg`

All coordinates are relative to the room container: **1280×694** when the room is inside the Workplace shell (content card at page x=80, y=68); full-viewport differences in §8.16. Zoom renders the in-shell room in a same-origin iframe; we render a normal component that fills the card. "Static" items follow §2.2.

### 8.1 Placement and chrome
| Entry path | Chrome |
|---|---|
| New meeting, Start (Home / Meetings / detail page / PMI), Join modal, launch page "Join from Zoom Workplace app" (`fromPWA=1`) | Inside the Workplace shell: header + rail stay, **no rail tab selected** [M]; the room fills the content card |
| Invite link → "Join from browser" / P0 redirect (no `fromPWA`) | Full viewport, no shell |
- The room component is always `width:100%; height:100%` of its container. `document.title` stays "Zoom".
- Leaving or ending: in-shell → `/wc/home` [M]; full viewport → `/wc/{n}/left` (DV9).
- `beforeunload` while in a meeting → send `leave` over WS (no browser prompt). Rail clicks: §6.7.
- **Same client joining twice** (second tab with the same `client_id`): the older session gets the dialog "**You have joined this meeting on another platform.**" (§8.12) [M].

### 8.2 Structure and layers [M]
```
#wc-content                        1280×694, bg #131619
├─ stage (#wc-container-left)      bg #0D0D0D, width = 1280 − right panel (880 with a panel), transition all .2s ease-in
│  ├─ notification layer           absolute, top 10px below the header (y=58), full width, flex column centred, z 999, pointer-events none
│  ├─ header bar                   absolute top, 48px, z 200                       (§8.4)
│  ├─ video area                   speaker view | gallery view                      (§8.3)
│  └─ toolbar                      absolute bottom, 52px, z 200                     (§8.5)
└─ right container (only with a panel)  400 wide, bg #040506, padding 0 2px 4px 0, z 20   (§8.7)
Dialog portals: transparent non-blocking overlays (info/encryption popovers, invite modal, settings) or dim rgba(0,0,0,.5) (confirm dialogs).
```

### 8.3 Stage and video tiles

#### 8.3.1 Views [M]
- **Default view = Speaker View** for everyone [M: host capture with 1 participant; guest capture with 2]. The View menu (§8.4.4) switches to Gallery View. Store the choice per browser in `localStorage['zc.view']` [D].
- Tiles have **no gap** and **radius 0**; tile bg `#1A1A1A`.

#### 8.3.2 Speaker view [M]
| Participants | Geometry (1280×694 container) |
|---|---|
| 1 | one tile, 16:9 fitted to the full room height: **1234×694 at x=23** (header and toolbar overlay it) |
| ≥ 2 | **Filmstrip** at top: y=48, height **120** (padding `3px 0`), tiles **207×117**, the group centred horizontally (with 2 people: self at (536,51)). **Active tile**: largest 16:9 that fits in stage width × (stage height − 168), top y=168, centred horizontally → **935×526 at (172,168)** (1512×771 viewport: 1072×603) |
- Filmstrip = every participant except the one shown large, in join order; when they don't fit, show 32×117 page buttons at the ends (bg `rgba(255,255,255,.09)`, radius 4, white 3px-border chevron) [M CSS].
- The large tile shows the **active speaker**: the most recent participant whose audio level stayed above threshold (RMS > 0.02) for ≥ 300 ms [D]; it keeps the last speaker when nobody talks; initially the first remote participant, else self.

#### 8.3.3 Gallery view [M]
- Layout area **excludes the header and toolbar**: stage width × (stage height − 100) at y=48 (1280×594; 880×594 with a panel).
- **1 participant:** padding 0 → **1056×594 at x=112**.
- **≥ 2 participants:** padding **60** on all sides, **gap 0**, tiles 16:9, grid centred in both axes; rows fill top→bottom, last row centred.
  - 2 tiles @1280 → **580×326 at (60,182) and (640,182)**; @880 (panel open) → stacked **421×237 at (229,108) and (229,345)**; 1512 wide → 696×392 at x=60 / 756.
- Order: remote participants by join time, **self last** [M with 2 people].
- **Grid algorithm** [M JS] (`lib/gallery.ts`, port exactly). `allowed[n]` lists rows×cols:
```
1:[1x1] 2:[1x2,2x1] 3:[1x3,3x1,2x2] 4:[1x4,4x1,2x2] 5:[1x5,5x1,2x3,3x2] 6:[2x3,3x2,1x6,6x1]
7:[2x4,4x2,3x3,1x7,7x1] 8:[2x4,4x2,3x3,1x8,8x1] 9:[3x3,5x2,2x5,1x9,9x1] 10:[2x5,5x2,3x4,4x3,1x10,10x1]
11,12:[3x4,4x3,2x6,6x2,1xN,Nx1] 13,14:[5x3,3x5,2x7,7x2,4x4,1xN,Nx1] 15:[5x3,3x5,4x4,2x8,8x2,1x15,15x1]
16:[5x4,4x5,4x4,6x3,3x6,2x8,8x2] 17,18:[5x4,4x5,6x3,3x6,2x9,9x2] 19,20:[5x4,4x5,3x7,7x3,2x10,10x2]
21:[5x5,3x7,7x3,6x4,4x6,2x11,11x2] 22:[5x5,6x4,4x6,2x11,11x2] 23,24:[2x12,3x8,5x5,4x6,6x4,8x3,12x2] 25:[5x5]
W,H = area minus padding (60 each side when n ≥ 2)
for (r,c) in allowed[n]: unit = min(W/(16c), H/(9r)); tile = 16·unit × 9·unit
pick the (r,c) with the largest tile area.
```
- Max per page 25 (our mesh caps at 8, so no paging).
- **Active-speaker ring** [M]: `box-shadow: inset 0 0 0 2px #48DD5D` on the active tile, **only in gallery view and only when there are more than 2 participants**. No ring in speaker view [D].

#### 8.3.4 Tile content [M]
- **Video on:** `<video>` `object-fit:cover`; the local self view is **mirrored** ("Mirror my video" is on by default).
- **Video off (avatar mode):** the **display name** (not initials) centred: `font-size = tileWidth / 15`, line-height 1.5, weight 500, `#FFF`, `max-width:95%`, ellipsis, minimum 16px (1234 → 82.27px; 1056 → 70.4; 935 → 62.3; 580 → 38.7; 207 → 16px/24px).
- **Name tag** `.video-avatar__avatar-footer`: absolute bottom-left, `margin:0 0 4px 4px`, bg `rgba(0,0,0,.56)`, radius 4, padding `3px 5px 3px 0`, height 29, `max-width:calc(100% - 6px)`, flex align-centre, `transition: bottom .2s ease-out`.
  - Leading icon 16×16: **muted** → red muted-mic (`room-sprite-tile-muted@1.43x.png`); else **video on** → network bars `room-network-good.svg` white; else none [D for the no-icon case].
  - Name `span`: `margin-left:3px`, ellipsis. Font **15px/22.5px when the room is ≤ 720px tall** (in-shell room, 694) else **12px** (full viewport at 768) — Zoom uses `@media (max-height:720px)`; implement with a container query on the room height.
  - When the toolbar is visible and the tile reaches the bottom of the room, the tag moves up to sit just above the toolbar (tag bottom ≈ y 639); when the toolbar hides it returns to tile bottom − 4.
  - Shows the participant's name for the local tile too (not "You").

### 8.4 Header bar [M] — `room-02-bars-visible-permission-bar.jpg`
`position:absolute; top:0; width:100%; height:48px; display:flex; align-items:center; background:rgba(0,0,0,.7); z-index:200; transition:transform .2s ease-out`; hidden = `translateY(-48px)` (auto-hide §8.5.6).

#### 8.4.1 Left: meeting-info pill
Wrapper at x=4 (margin-left 4), y=13, **158×22** (auto width, max 600), bg `rgba(0,0,0,.6)`, radius 20. Button (`aria-label="Meeting information"`, `aria-expanded`): padding `3px 10px 3px 6px`; `room-info.svg` **16** white + title 12px/16px **700** `#FFF`, margin-left 6, ellipsis. Hover bg `rgba(255,255,255,.15)` radius 8; active/open `rgba(255,255,255,.22)`; keyboard focus 2px `#2D8CFF` offset 1. Click → info popover.

#### 8.4.2 Right side (`margin-left:auto`, right margin 22)
| x | Element | Spec |
|---|---|---|
| 1107 | **Encryption** (`aria-label="Encryption information"`) | 28×28 circle, `room-encryption.svg` 18 `#25E55F`; hover `rgba(255,255,255,.15)`, open `rgba(255,255,255,.22)`. Click → encryption popover (static content) |
| 1139 | **Zoom AI** | 28×28 circle, margin-right 4, `room-ai.svg` 18 `#F7F9FA`, hover `#6E768054`. **Static** (inert) |
| ~1175 | divider | 1px × ~20px, `rgba(255,255,255,.2)` [D] |
| 1198 | **View** (`aria-label="View"`, `aria-haspopup`) | 24×24, radius 8, padding `4px 6px`, 12px icon white: `room-view-speaker.svg` (speaker view) / `room-view-gallery.svg` (gallery). Hover bg `rgba(62,62,62,.88)` + `rgba(255,255,255,.8)`; focus/active `rgba(79,79,79,.88)`. Click → View menu |
| 1234 | **Switch to Zoom Workplace Client** | 24×24, bg `rgba(36,36,36,.88)`, radius 8, padding 4, `room-switch-native.svg` 16; hover `rgba(62,62,62,.88)` + opacity .8. **Static** |
Header popovers render in transparent, non-blocking layers; clicking the trigger again, clicking outside or Escape closes them.

#### 8.4.3 Meeting information popover [M] — `room-03-meeting-info-popover.jpg`
Absolute **x=5, y=53, 400×296** (min-height 220), bg `#1D1E20`, border 1px `rgba(255,255,255,.12)`, radius 8, shadow `0 8px 24px rgba(0,0,0,.3)`, padding `10px 24px 24px`, 12px white, z 1000.
| Row | Spec |
|---|---|
| Topic (host) | input wrapper 350×44, border 2px transparent, radius 10, padding 2; hover bg `#2E2E2E` + 15px pencil; focused border `2px solid #2D8CFF`, bg transparent; `<input>` 16px/24px **700** white, h36, `maxLength=99`, placeholder "Meeting Topic". **Static:** edits revert on blur (rename is out of scope) |
| Topic (attendee) | plain text 16px 700, margin `9px 0 18px 5px` |
| Rows | flex, `margin:8px 0 0 5px`, min-height 18, line-height 18; label column **120px** 14px `#ADADAD`; value 12px `#FFF`, `user-select:all` |
| **Invite Link** | row line-height 24; value `#4B96F1` 12px, single line, ellipsis, max-width 220; copy button 24×24 `room-copy-url.svg` → copies `invite_url`, then is replaced by `room-copied-check.svg` 16 `#00A832` for **5 s** |
| Meeting ID | formatted (`812 3456 7890`) |
| Host | "Alex Morgan (You)" for the host, else the host's name |
| Passcode | value, max-width 280, ellipsis (row hidden when there is no passcode) |
| Numeric Password Telephone/Room Systems | label wraps to 4 lines in the 120px column; value = 6-digit numeric derived from the passcode (§10.2). Static information |
| Participant ID | 6 digits = participant row id, zero-padded |

#### 8.4.4 View menu [M] — `room-05-view-menu.jpg`, `20-meeting-view-menu.jpg`
Dark dropdown (§8.6.1), anchored under View and right-aligned to it: x=978, y=38, **244** wide, 272 tall, **13px**. Items 242×25, padding `3px 20px 3px 28px`, margin `0 2px`, 13px/18.57px `rgba(255,255,255,.8)`; checked item: 13×12 white ✓ (`room-sprite-check@2x.png`) at left 10, top 8; right-side layout icons 12px `rgba(255,255,255,.8)` at right 8, top 7.
1. **Speaker View** ✓ (`room-view-speaker-menu.svg`) · **Gallery View** (`room-view-gallery.svg`) · Multi-speaker View (`room-view-multispeaker.svg`, static)
2. Sort Gallery By › (`room-chevron-right.svg`; static — Zoom swaps the menu in place with First Name (A - Z) · First Name (Z - A) · Last Name (A - Z) · Last Name (Z - A) · Entry Time (First - Last) · Entry Time (Last - First)) · Follow Host's Video Order (static)
3. **Hide Self View** (functional: removes the self tile; toggles to "Show Self View" [D]) · Hide Non-video Participants (static)
4. **Fullscreen** (Fullscreen API on the room container; label "Exit Fullscreen" while active)
Dividers: 1px `rgba(255,255,255,.09)`, margin `9px 0`. Choosing a view closes the menu and swaps the header icon.

#### 8.4.5 Encryption popover [M] — `room-04-encryption-popover.jpg` (static content)
Absolute right 5, top 53, **400×216**, same paper styling, 13px. "**Enhanced encryption is on**" 16px/18px 700 white · "You are connected to the Zoom Global Network via a data center in the United States." 13px/18px `#ADADAD` · row "Encryption" (label column 150 `#ADADAD`) · "Enabled" white · divider 1px `#313235` (margin-top 22) · "Report" 13px `#FF5C5C` · "Security settings" 13px white (both h20 buttons, padding `0 6px`, radius 6, hover `rgba(255,255,255,.09)`; static).

### 8.5 Toolbar (footer) [M] — `room-02…`, `11-meeting-toolbar.jpg`, `19-meeting-attendee-speaker-view.jpg`

#### 8.5.1 Container and layout
`position:absolute; bottom:0; width:100%; height:52px; background:rgba(0,0,0,.7); font-size:12px; z-index:200; transition:transform .2s ease-out`; hidden = `translateY(52px)`. Inner: `display:flex; justify-content:space-between; align-items:center; flex-wrap:nowrap` with three sections. The middle section is **not** truly centred: at 1280 → left 0–180, mid 426–948, right 1194–1280.

#### 8.5.2 Button anatomy
- Button: 48 tall, `margin:2px 0 0`, **min-width 86** (Audio/Video 90, Participants 91; grows with the label + 12px side margins), radius 8, transparent, white, `transition:none`.
- Icon layer: 24px tall, flex-centred, at the top (icon top y=647 in a 694 room).
- Label: 12px/16px 400 `#FFF`, `margin:4px 12px 0`, max-width 120, ellipsis (label top y=675).
- States: hover and focus-visible bg **`#6E768054`**; active bg `rgba(255,255,255,.18)` + text `rgba(255,255,255,.8)`; disabled `opacity:.5; pointer-events:none`.
- **Caret** toggle: 20×24, radius 6, `margin:4px`, at the top-right of its button (Audio caret x=66, Video 156, Participants 494, Chat 580, Share 752), `caret-up.svg` 12 white. Hover/focus-visible `rgba(255,255,255,.33)`; hovering the main button tints its caret `#6E768054`.
- **No hover tooltips** on toolbar buttons (aria-labels only).

#### 8.5.3 Buttons — host (1280 wide, no panel)
| Button | x / w | Icon | Label | aria-label | Click |
|---|---|---|---|---|---|
| Audio | 0 / 90 | unmuted `mtg-mic-on.svg` (+ audio meter §7.10.4) · muted `mtg-mic-muted.svg` · denied `room-audio-disallowed.svg` 32×24 | **Mute** / **Unmute** / **Audio** (denied) | "mute my microphone" / "unmute my microphone" | toggle mute (`media_state`); denied → re-request permission. (Zoom shows "Join Audio" with a headphones icon for ~1 s on entry — skip) |
| Audio caret | 66 | caret | — | "More audio controls" | §8.6.2 |
| Video | 90 / 90 | on `mtg-video-on.svg` · off `mtg-video-off.svg` · denied `room-video-disallowed.svg` 38×25 | **Video** (always, [M] live) | "stop my video" / "start my video" | toggle camera |
| Video caret | 156 | | | "More video controls" | §8.6.3 |
| Participants | 426 / 91 | `mtg-participants.svg` 24 + counter | **Participants** | "open the manage participants list pane" / "close …" | toggle Participants panel |
| Participants caret | 494 | | | "Participants Settings" | §8.6.4 |
| Chat | 518 / 86 | `mtg-chat.svg` 24 | **Chat** | "open the chat panel" | toggle Chat panel (**static UI**, §8.10) |
| Chat caret | 580 | | | "Chat Settings" | static menu |
| React | 604 / 86 | `mtg-react.svg` 26 | **React** | "React" | static picker (§8.6.6) |
| Share | 690 / 86 | `mtg-share.svg` 27 | **Share** | "Share" | **static (no-op)** |
| Share caret | 752 | | | "Host tools for share" | static |
| Host tools | 776 / 86 | `room-hosttools.svg` 24 | **Host tools** | "Host tools" | opens the static Host tools panel (§8.9) |
| More | 862 / 86 | `mtg-more.svg` 24×25 | **More** | "More meeting control" | §8.6.7 |
| End | 1194 / 86 | `mtg-end.svg` 24 | **End** | "End" | §8.14 |
Conflict note: spec 05 (JS strings) lists "Start Video"/"Stop Video" toolbar labels; spec 08 measured the live toolbar label as always **"Video"**. 08 wins (live capture). The pre-join page does use "Start Video"/"Stop Video".

#### 8.5.4 Buttons — attendee [M]
**Mute · Video** (left) · **Participants · Chat · React · Share · More** (centre) · **Leave** (right: `mtg-leave.svg` 24 — red `#F05` door + white walking figure; label "Leave"). No Host tools. With no host connected (attendee-only meeting) everyone gets this toolbar.

#### 8.5.5 Counters, badges, overflow
- **Participant count** at the icon's top-right: `position:absolute; top:-2px; left:calc(50% + 8px); width:22px`, 11px/16.5px `rgba(255,255,255,.8)`, centred ("1", "2", …).
- Unread chat badge (never shown — chat is static): min 18×18, padding `0 4px`, 12px, bg `#E02828`, border 2px `#FFF`, radius 10, `top:-8px; right:50%; transform:translate(100%)`.
- **Overflow** [M]: when the stage narrows (e.g. 880 with a panel), buttons that don't fit move into **More** (in this order [D]: Host tools → Share → React → Chat). Zoom also "promotes" an item picked from More as a temporary toolbar button after a 1px white divider (17×22 wrapper, margin `0 8px`) — P2.

#### 8.5.6 Auto-hide [M JS]
- Header and toolbar are visible on entry and on any `mousemove` inside the room (handler throttled to **1000 ms**); they hide **3000 ms** after the last move.
- They stay visible while: the pointer is over the toolbar, any toolbar dropdown/popover is open, the Leave bar is open, or "always show" is on.
- **Ctrl+\\** toggles "always show meeting controls" [M]. Touch: a tap on the stage toggles visibility [D].
- Both slide with `transform .2s ease-out`.

### 8.6 Toolbar menus and pickers

#### 8.6.1 Dark dropdown (shared) [M]
bg `rgba(0,0,0,.99)`, border 1px `rgba(255,255,255,.12)`, radius 8, shadow `0 8px 24px rgba(0,0,0,.3)`, padding `8px 0`. Item: padding `3px 20px 3px 28px`, margin `0 2px`, **12px** (caret menus) / 13px (View), colour `rgba(255,255,255,.8)`, flex, nowrap; hover/focus bg `#2B2B2B` (audio/video menus: `rgba(255,255,255,.1)` + text `#DDD`); keyboard focus `outline:1px solid #FFF`. Section header 12px/18px **700** `#F5F5F5`, padding `8px 16px`. Divider 1px `rgba(255,255,255,.09)`, margin `9px 0`. Checked item: 13×12 white ✓ at left 10, top 8. Caret menus open **upward**, bottom edge 1px above the toolbar (y=641), left-aligned near their caret.

#### 8.6.2 Audio caret menu — `room-08-audio-caret-menu.jpg`
x=62, **227×335**, items 23 tall (12px/17.14px), headers 34 tall.
```
Select a Microphone        (header)
✓ {audioinput devices}      functional (switch the outgoing track)
──
Select a Speaker
  {audiooutput devices}     functional where setSinkId exists
──
Microphone modes
✓ Background noise suppression     static
──
  Test Speaker & Microphone        static
  Leave computer audio             static
──
  Audio Settings                   opens the static Settings modal (§8.17)
```
Device labels need permission; when denied Zoom shows "Unrecognized microphone1" / "Unrecognized speaker1".

#### 8.6.3 Video caret menu — `room-09-video-caret-menu.jpg`
x=152, **221×189**: "Select a Camera" → ✓ {videoinput devices} (functional) │ "Blur my background" + room switch (§5.8.8; row 12px, padding `5px 30px`, space-between; static) · "Choose Background..." (static) │ "Video Settings..." (static modal).

#### 8.6.4 Participants caret menu — `room-10-participants-caret-menu.jpg`
x=490, **201×87**: **Invite ...** (opens the Invite modal §8.11) · **Copy invite link** (functional) · **Host tools for participants** (host; opens the static Host tools panel on its Participants page).
"Copy invite link" → copies `invite_url` and shows a tooltip above the Participants button for **≈2 s**: bg `#212326`, radius 5, padding `20px 30px`, min-width 220, 14px/21px white, text "**Invite link has been copied to clipboard**", 8px down-arrow (`border-top:8px solid #212326`), `position:absolute; left:50%; top:-72px; translate(-50%)`.

#### 8.6.5 Share caret
x=748, **165×41**: single item "Host tools for share" (static).

#### 8.6.6 React picker — `room-13-react-picker.jpg` (Static UI only)
Centred over React, bottom on the toolbar top: x=502, y=472, **290×170**, bg `rgba(0,0,0,.8)`, border 1px `rgba(255,255,255,.12)`, radius 12, shadow `0 6.14px 18.43px rgba(0,0,0,.2)`, `backdrop-filter:blur(15.36px)`, padding 8. Rows (`justify-content:space-around`, margin-bottom 8):
1. Seven 32×32 transparent buttons (radius 8, 8px apart; hover `rgba(255,255,255,.09)`, active `.18`): 👏 👍 😂 😮 ❤️ 🎉 (`room-react-reactions-{1f44f,1f44d,1f602,1f62e,2764,1f389}.svg` 24) + More (`room-react-icons-more.svg`).
2. Five 50×32 buttons (bg `rgba(255,255,255,.09)`, hover `.18`, active `.27`, 4px apart, 16px icons `room-react-nvf-*.svg`): Yes, No, Slow down, Speed up, I'm away.
3. **✋ Raise Hand** 272×32, bg `rgba(255,255,255,.09)`, 13px/19.5px 700 white.
4. **⏳ Be right back** 272×32.
Tooltips: bubble above (`top:-104%`), bg `#1D1E20`, 13px white, padding `4px 8px`, radius 6, border .5px `rgba(255,255,255,.09)`, 9px arrow, `all .15s ease`. Clicking anything just closes the picker. (Full emoji picker 320×355: `05-meeting-room.md` §6.5.)

#### 8.6.7 More menu [M] — `room-15-more-menu.jpg`
Left-aligned to More: x=862, bottom 639 (margin-bottom 4), **247×175**, dark dropdown with **padding 5**. Grid `repeat(3,75px)`, gap 5. Tile 75×60, radius 12, flex column centred, 16px icon, label 10px/15px white (max 2 lines); hover `rgba(255,255,255,.1)`.
- Host: **Show Captions** (`room-more-show-captions.svg`) · **Breakout Rooms** · **Whiteboards** · **Settings** · **Stop Incoming Video** — all **static** (Settings opens the static modal §8.17; Show Captions / Breakout Rooms may open their static dialogs §8.12, P2).
- Attendee: Show Captions · Whiteboards · Settings · Stop Incoming Video.
- Overflowed toolbar buttons (§8.5.5) are added as tiles and keep their behaviour.
- Full-width divider 1px `#313235`; footer (margin-top 8, centred): "Reset to default" 11px/16.5px `#DFE3E8` + **Reset** (50×24, radius 6, padding `3px 8px`, 12px/16px `#4B96F1`; static).

### 8.7 Right panel container [M]
- `x=880, 400×694`, bg `#040506`, padding `0 2px 4px 0`, z 20. The stage shrinks to 880 (header, toolbar and toasts re-centre over it; `transition: all .2s ease-in`).
- **Panel shell:** 398×686 at (880,4) (margin-top 4), bg `#1D1E20`, text `#F7F9FA`, border 1px `#313235`, radius **15**, overflow hidden, flex column.
- **Two panels open** (Participants + Chat): stacked; Participants on top 398×342 at y=4, Chat 398×340 at y=350 (4px gap) — `room-34-…`.
- **Minimize** (shown only when stacked; `room-collapse-to-title.svg`): the panel collapses to a **44px** title bar moved to the **bottom** (y=646) and the other takes the rest; its button becomes **Expand** (`room-expand-all.svg`) — `room-35-…`.
- **Pop Out** (`room-popout.svg`): static (Zoom opens a draggable 400×508 window; `05-meeting-room.md` §8.1).
- Header icons (16px, rect fill `#DFE3E8`; `#CAD1D5` in Chat and Host tools), 8px apart, at right 16: [Minimize] · Pop Out · Close.

### 8.8 Participants panel [M] — `room-21-participants-panel.jpg`, `22-meeting-attendee-participants.jpg`
- **Header:** 396×46, padding `12px 16px`, border-bottom 1px `#313235`, bg `#1D1E20`; title "**Participants (N)**" 14px/21px **500** `#F7F9FA` centred; icons per §8.7 (`aria-label` "minimize" / "Pop Out" / "Close").
- **List** starts at y=59, virtualised not required; scrollbar 8px, track `rgba(255,255,255,.09)`, thumb `#707070`, radius 6.
- **Row:** **390×44**, padding `6px 20px`, radius 4, 14px/18px white; hover bg `#313235`; no hover pills.
  - Avatar 32×32 radius 10, initials **16px/32px 400** white, meeting-client palette (§5.8.14); 12px gap.
  - Name 14px/18px + label with **no space** before it: host sees "Alex Morgan(Host, me)", "Chrome Guest(Guest)"; an attendee sees "Chrome Guest(Me)", "Alex Morgan(Host)". Labels: `(Host, me)` · `(Host)` · `(Me)` · `(Guest)` (attendees who joined via a join path). Label margin-right 5.
  - Right icons (gap 4), buttons 26×26, padding 5, radius 6, hover `rgba(0,0,0,.45)`:
    - **mic:** muted → `room-pl-participants-list-audio-muted.svg` red `#DE2828`, title "**Unmute**" (self, functional) / "**Ask to Unmute**" (others, static); unmuted → white mic icon (`mtg-mic-on.svg` at 16), title "**Mute**" (self: functional; others: **host only**, mutes that participant — bonus).
    - **video:** off → `room-pl-participants-list-video-off.svg` red, title "Start Video" (self functional); on → `room-pl-video-on.svg` `#747487`, title "Stop Video" (self functional; others static).
    - **"…"** `room-pl-SvgEllipsis.svg` 16 `#DFE3E8`, title "More options" → row menu.
  - `aria-label` "Alex Morgan (Host, me),computer audio muted,video off".
- **Order:** me first, then the host, then others by join time.
- **Row "More options" menu** — `room-33-…`: anchored under "…", right-aligned, min-width 160, bg `#2A2B2D`, border 1px `#313235`, radius 8, shadow `0 8px 24px rgba(0,0,0,.48)`, padding `5px 0`, margin-top 2; items 158×23, padding `3px 20px`, 12px/17.14px `#F7F9FA`, hover `#6E768054`, disabled `#596069`; dividers 1px `rgba(255,255,255,.09)` margin 9.
  - Self: **Start Video / Stop Video** (functional) │ Add Pin │ Rename (static)
  - Other, host view: Chat · Stop Video │ Add Pin │ Make Host · Rename │ Allow to Multi-pin │ Put in Waiting Room · **Remove** · Report — only **Remove** is functional (bonus); the rest are static. Attendee view of others: Chat · Add Pin (static).
- **Footer:** 396×50 at y=631, padding `10px 0`, flex `justify-content:space-around`, border-top `#313235`, radius `0 0 8px 8px`. Pills h30, padding `6px 24px`, radius 20, bg `#2A2B2D`, 12px/18px white, hover `#6E768054`:
  - Host: **Invite** (79) · **Mute All** (94; bonus, §8.12.1) · **More** (77) → drop-up menu 216×87 (bg `#2A2B2D`, border 1px `#3A3A3A`, radius 8, padding `8px 0`, items 12px white, padding `3px 20px 3px 25px`): Ask all to unmute · Mute all upon entry ✓ · Host tools for participants — **static**.
  - Attendee: **Invite** · **Unmute** / **Mute** (own mic).

### 8.9 Host tools panel [M] — `room-12-host-tools-panel.jpg`, `room-11-…` (Static UI only)
Same shell as §8.7 (398×686 at (880,4)). Header **56px**, padding `12px 16px`, no bottom border, title "**Host tools**" 14px/21px **700** centred; sub-pages show a Back button at left 16 (28×28, `room-back.svg` 20 `#DFE3E8`, hover `#6E768054` radius 4). Content padding `0 8px`.
- Row: flex space-between, padding 8, gap 24, radius 6, hover `#2A2B2D`; label 14px/21px `#F7F9FA`; right = room switch (§5.8.8). Divider 1px `#313235`, margin `10px 0 8px`. Drill-in rows 380×41, radius 8, chevron = 10×10 box with 2px `#939BA4` top/right borders rotated 45°. Section label 14px `#939BA4`; danger 14px `#E8173D`.
- Root: Enable waiting room ○ · Lock Meeting ○ · Hide profile pictures ○ │ **Participants ›** · **Advanced ›**.
- Participants: "Suspend Participant Activities" (danger) │ "Allow participants to:" · Chat ● · Rename Themselves ● · Unmute Themselves ● · Start Video ●.
- Advanced: AI › · My Notes › · Share › · Captions › · Whiteboards ›.
Switches toggle visually only; nothing is sent. (Mute All with "Allow participants to unmute themselves" lives in §8.12.1.)

### 8.10 Chat panel — Static UI only [M] — `room-27…30-*.jpg`, `14-meeting-chat-panel.jpg`
- **Shell:** 398×686 at (880,4) (stacked: 398×340), bg `#1D1E20`, radius 15.
- **Header** 398×37, padding 6, border-top 1px `#313235`, 14px **700** `#F5F7FB`, flex centred: left 24×24 button (padding 4) with `room-chat-SvgChatPersistentHeader.svg` 16 `#0E72ED` (static); title = meeting topic 14px/21px 700, ellipsis, padding `0 20px`, margin `0 40px 0 4px`; right (absolute right 10, 8px apart, 16px, `#CAD1D5`): [Minimize] · Pop Out (static) · Close.
- **First-open coachmark** (P2, static): 326×139 under the header icon, bg `#333`, border 1px `rgba(255,255,255,.12)`, radius 8, padding 14: "**Continue the Conversation**" 14px/21px 700 + "There's now a meeting group chat named after this meeting in Team Chat. Continue the conversation there at any time." 13px/19.5px + **Got it** (primary 49×21, radius 6, 13px) which dismisses it.
- **Empty list notice** (top, y=51, centred, padding `0 40px`): "**Messages addressed to "Meeting Group Chat" will also appear in the meeting group chat in Team Chat**" 12px/14px `rgba(255,255,255,.56)`.
- **"Who can see your messages?" bar:** 398×24, bg `rgba(255,255,255,.06)` (hover `.1`), 14px people icon + text 12px/24px `rgba(255,255,255,.56)` centred. Click → popover 306×218 above the bar (bg `#2A2A2A`, radius 10, shadow `0 2px 8px rgba(0,0,0,.3)`, padding `12px 16px`, 17px arrow down), two paragraphs 12px/18px `#F5F7FB`: "Everyone in the meeting can see and save your messages sent to Meeting Group Chat – and share them with apps and others. These messages will also be posted in the dedicated Meeting Group Chat in Team Chat, and everyone, including those not in the meeting, can see, save and share them." / "Only you and those you chat with can save your direct messages and share them with apps and others."
- **Composer** 398×157, bg `#1D1E20`, radius `0 0 15px 15px`, padding-top 4:
  - Recipient row h32, padding `0 6px`: "to:" 12px/18px `#9DA5B5` (margin-right 5) + pill h22, padding `2px 15px`, radius 10.5, bg `#0E72ED`, 12px/18px white, max-width 180: "**Meeting Group Chat**". Click opens the recipient menu (drop-up, 202 wide, bg `#2A2A2A`, border 1px `#3A3A3A`, radius 6, padding `8px 0`; items 24 tall, padding `3px 20px 3px 25px`, 12px/18px `#DFE3E8`, hover `#313235`; checked = 11×5 white L rotated −45° at left 9/top 9): Meeting Group Chat ✓ + each participant. Selecting only changes the pill text.
  - Editor (padding `4px 8px 8px`, height **85**, scroll-y): 14px/18px `#F5F7FB`, placeholder "**Type message here ...**" `#DFE3E8`. Typing works.
  - Bottom row h24 (padding-right 10): left 24×24 icon buttons (16px `#9DA5B5`): format (`room-chat-chat-format.svg`, margin-right 8), file (`room-chat-file2.svg`), emoji (`room-chat-chat-emoji.svg`), more (`room-chat-chat-more.svg`) — static. Right **send** 24×24 radius 6 (`room-chat-chat-enter.svg` 16): empty → bg `#333`, icon `#6B7280`; with text → bg `#0E72ED`, icon `#FFF`.
  - **Send / Enter does nothing** (no message is shown, sent or stored). Shift+Enter inserts a newline.
- Message rendering for a future chat implementation (bubbles `#292F37`, radius 10, padding `8px 10px`, 13px; header "{sender} to {receiver}" 12px `rgba(255,255,255,.4)`, timestamp on hover, own sender "Me", direct "(Privately)"): `05-meeting-room.md` §10.3.

### 8.11 Invite modal [M] — `room-25-invite-contacts.jpg`, `room-26-invite-email.jpg` (P1; copy buttons P0)
- Window **702×542** centred (x=289, y=76), bg `#242424`, border 1px `#333`, radius **12**, shadow `0 10px 20px rgba(0,0,0,.5)`, overflow hidden; transparent non-blocking overlay (z 1030); draggable by its header (P2). Inner 700×540 bg `#1D1E20`.
- Header: "**Invite People to join meeting 812 3456 7890**" 24px/36px **700** `#F5F7FB`, centred, margin `20px 0`.
- **Tabs:** track 342×30 centred (x=469), bg `#3A3A3A`, radius 8; three tabs 114×30, radius 8, text 13px/26px; selected bg `#313235` + shadow `0 1px 4px rgba(0,0,0,.3)`, text `#FFF`; others `#939BA4`: **Contacts** · **Zoom Rooms** · **Email**.
- **Contacts / Zoom Rooms** (static): tag input 660×42 at (310,193), border 1px `#555B62`, radius 8, padding 4, margin `10px 0`; search icon 21×18 margin `0 10px`; input 16px/32px `#F5F7FB`, placeholder "**Choose from the list or type to search**". Contacts shows the seeded users as tiles (54 tall, margin 7, padding 10, radius 9, avatar 28 radius 8, name 14px; selected bg `#0E72ED` white); selection toggles visually. Zoom Rooms list is empty.
- **Email** (functional): "**Choose your email service to send invitation**" 16px/22px 700 `#F5F7FB` centred (content margin `85px 100px 0`); three 165×91 buttons (margin-top 40) with images `room-invite-default_email.png` 83×61, `room-invite-gmail.png` 82×60, `room-invite-yahoo_mail.png` 84×61 (active opacity .8) + title 13px/19.5px `#F5F7FB` margin-top 10: **Default Email** (`mailto:?subject=…&body=…`) · **Gmail** (`https://mail.google.com/mail/?view=cm&su=…&body=…`) · **Yahoo Mail** (`https://compose.mail.yahoo.com/?subject=…&body=…`), new tab, body = invitation (§10.5).
- Divider 1px above the footer; footer padding 9.
- Footer left: **Copy URL** (80) and **Copy Invitation** (96): 14px/21px 400 `#75AFF5`, margin-right 28 → label becomes "**Copied**" for ≈1 s.
- Footer right (margin-right 16): "Passcode:" 13px/19.5px `#9DA5B5` (margin-right 11) · value 13px **600** `#F5F7FB` (max 220, margin-right 10) · **Invite** (67×32, radius 8, padding `0 16px`, margin `0 14px`, bg `#0E71EB`, 14px white; **opacity .6 and disabled until a contact is selected**; hover `#2681F2`; click just closes the modal — no invitations are sent) · **Cancel** (78×32, radius 8, border 1px `#555`, transparent, 14px `#F5F7FB`).

### 8.12 Dark dialogs [M]
Shared frame (§5.8.11 room dark dialog): overlay `rgba(0,0,0,.5)` (fade .15s), box 480 wide, bg `#1D1E20`, border 1px `#333`, radius 12, shadow `0 8px 24px rgba(0,0,0,.4)`, padding `32px 32px 24px`; title 20px/30px **700** white; body 14px white; footer right-aligned (padding-top 26): secondary h32 (padding `6px 20px`, radius 8, bg/border `#3A3A3A`, 14px white, hover `#444`) + 12px + primary h32 (radius 8, bg `#0E71EB`, hover `#0D65D4`, 14px **700** white) or danger (bg `#DE2828`, hover `#CA2424`).

| # | Dialog | Content |
|---|---|---|
| 8.12.1 | **Mute All** (bonus) — `room-23-mute-all-dialog.jpg` | 480×184 at (400,255): title "**Mute all current and new participants**" · checkbox ✓ "**Allow participants to unmute themselves**" (13px/19.5px; dark checkbox: 16px, border 1px `#707070`, radius 4; checked `#0E71EB`) · **Cancel** (86) · **Continue** (102) |
| 8.12.2 | Remove participant (bonus) [D copy] | title "**Remove {name}?**" · body "They won't be able to rejoin this meeting." · **Cancel** · **Remove** (danger) |
| 8.12.3 | Ended by host [D copy] | title "**This meeting has been ended by host**" · **OK** (primary) → in-shell `/wc/home`, full viewport `/wc/{n}/left` |
| 8.12.4 | Duplicate session [M] | "**You have joined this meeting on another platform.**" (2 lines in 414) · "This window will be exited." 14px/21px · **OK** primary 61×32 → `/wc/home` |
| 8.12.5 | Show Captions (static, P2) | 580×275: "Set the caption language for this meeting" · "Caption Language" 14px/21px 700 · "Captions will appear in this language for everyone." 12px/18px `rgba(255,255,255,.7)` · select 510×38 "English" · Cancel / Save (both just close) |
| 8.12.6 | Breakout Rooms (static, P2) | 420×424 window: `05-meeting-room.md` §13.5 |

### 8.13 Toasts and permission bar [M]
- **Layer:** absolute, full stage width, flex column centred, `top:10px` below the header (**y=58**), z 999, `pointer-events:none` (toasts `auto`). Toasts re-centre over the stage when a panel is open.
- **Toast:** max-width 750, centred, 10px between stacked toasts; inner flex align-centre, **padding `14px 16px`, radius 14, bg `rgba(0,0,0,.93)`, 14px/21px `rgba(255,255,255,.8)`**, no border. Optional buttons h24 radius 6 13px (bg `rgba(255,255,255,.09)`, hover `.18`, white); optional close 16×16 white × (`room-sprite-close-x@2x.png`), padding `0 10px 0 4px`.
- **Lifetimes [M JS]:** default **5000 ms**; host change toasts **3000 ms**; persistent toasts have no timer. Max 3 visible [D].
- **Messages:** "You are host now." (3000) · "{name} is the host now." (3000) · "The host has muted you." [D] · "The host has muted all participants." [D] · "You can't unmute yourself because the host muted everyone." [D]. **Zoom shows no "{name} joined / left" toasts** [M] — the roster and counter update silently (announce via `aria-live`).
- **Permission bar** (persistent, closable) — `room-02-…`: a toast **602×49 at (339,58)** in a 1280 stage: `room-warning.svg` 14×13 `#FAAC2A` + 10px + "**Please enable access to your microphone and camera for the best experience.**" where "microphone" and "camera" are underlined link-buttons `rgb(13,110,253)` 14px/21px, margin `0 3px` (click → re-request that permission); ✕ at right. Variants mention only the microphone or only the camera. Shown when a permission is denied; removed when granted.

### 8.14 End / Leave flow [M] — `room-36-end-popover.jpg`, `17-meeting-end-dialog.jpg`, `23-meeting-attendee-leave.jpg`
- Clicking End/Leave **replaces the toolbar content** with a bar: absolute bottom, full width × 52, bg `rgba(0,0,0,.8)`, `backdrop-filter:blur(48px)`, flex end-aligned, z 1: "☐ **Give feedback**" (transparent checkbox, 13px/19.5px `#F5F5F5`; static) + **Cancel** (70×32, bg `rgba(255,255,255,.04)`, hover `.09`, radius 8, padding `5px 12px`, margin `0 16px 0 32px`, 14px/18px `#F5F5F5`).
- **Popover** absolute **right 8, bottom 52** (x=1024, y=530): **248** wide, bg `rgba(9,10,10,.8)`, radius 12, padding 16; buttons **216×32**, radius 8, padding `0 16px`, 14px/32px white, 8px apart (last margin-bottom 8):
  - Host (248×112): **End Meeting for All** (bg `#DE2828`, hover `#CA2424`) · **Leave Meeting** (bg `rgba(255,255,255,.09)`, hover `.18`).
  - Attendee (248×72): **Leave Meeting** only, **red** `#DE2828`.
- Cancel or Escape restores the toolbar.
- **End Meeting for All** → `POST /api/meetings/{n}/end` + WS `meeting_ended` → this tab goes to `/wc/home` [M]; everyone else sees dialog 8.12.3.
- **Leave Meeting** (host) → host transfers to the earliest attendee (§3; Zoom asks "Assign a new host" first — skipped) → leave. Attendee → leave. Destination per §8.1.

### 8.15 Host controls — behaviour (F9, bonus P1)
| Action | UI entry | Effect | Server |
|---|---|---|---|
| **Mute All** | Participants footer **Mute All** pill (host only) → dialog 8.12.1 → Continue | every non-host participant's mic is muted (they disable their local track and update their icon/label); toast "The host has muted all participants." to them; new joiners start muted; if "Allow participants to unmute themselves" was unchecked, their Unmute shows the "can't unmute" toast instead of unmuting | `host_command {command:'mute_all', allow_unmute}` → `force_mute` to each + `settings_updated {allow_unmute, mute_on_entry:true}` |
| **Mute one** | Participants row mic icon (title "Mute") on an unmuted participant (host only) | that participant is muted; toast "The host has muted you." | `host_command {command:'mute', target}` → `force_mute` |
| **Remove** | Row "…" → **Remove** → dialog 8.12.2 → Remove | participant status `removed`; their client closes media, shows "You have been removed from this meeting." (in-shell: light toast + `/wc/home`; full viewport: left page) and **cannot rejoin this instance** (`REMOVED`) | `host_command {command:'remove', target}` → `removed` |
| End for all | End popover | ends the instance | `POST /end` → `meeting_ended` |
Hosts can never unmute someone. All host commands are **validated server-side** (sender must be the live host of that instance).

### 8.16 Full-viewport room (1366×768) [M] — `room-37-fullviewport-client.jpg`
Header 1366×48 at y=0; toolbar 1366×52 at y=716; 1-participant speaker tile 1365×768 (name 91px); name tag **12px**; permission bar 602×49 at (382,58); End at x=1280; middle group 469–990. Everything else identical.

### 8.17 In-room Settings modal (Static UI only, P2) — `room-16/17/18-settings-*.jpg`
Draggable modeless window **757×565** centred (x=261.5, y=64.5), bg `#1D1E20`, border .5px `rgba(0,0,0,.25)`, radius 8, shadow `0 8px 24px rgba(0,0,0,.3)`. Header 53px, padding 14, border-bottom 1px `rgba(255,255,255,.09)`, title "**Settings**" 16px/24px 700 `#F5F5F5` centred, close 18×18. Left tabs 211 wide (padding 16, border-right 1px `rgba(255,255,255,.09)`): tab 178×32, radius 12, padding-left 8, margin-bottom 8, 14px/32px; inactive `rgba(255,255,255,.54)`, **active bg `#4F9AF7`** text `#F5F5F5`; 24×24 icon chip radius 8 margin-right 12: General (white), Video `#AFD784`, Audio `#82C786`, Background `#4FD1E2`, Statistics `#C182D1`, About `#7A86CC`. Pane contents: `05-meeting-room.md` §12.

---
## 9. Real-time design (F8, P0)

### 9.1 Connection lifecycle
1. `POST /join` or `/start` returns `{participant, token, instance_id}` (`token` = `itsdangerous`-signed `participant_id:instance_id`, 12 h).
2. Client opens `wss://{API}/ws/meetings/{number}?token=…`. The server verifies the token and that the participant isn't `removed`, registers the socket, sets `status='in_meeting'`, and sends `welcome`. If the same `client_id` already has a socket in this instance, the old socket gets `error {code:'DUPLICATE_SESSION'}` and is closed (dialog 8.12.4).
3. **Newcomer initiates:** on `welcome` the new client creates one `RTCPeerConnection` per existing participant, adds its local tracks (always add both an audio and a video transceiver; disabled tracks when muted/off, so toggling never renegotiates), and sends `offer`s. Existing clients answer. (Avoids glare.)
4. ICE candidates are relayed as `ice`. Config: `{iceServers:[{urls:'stun:stun.l.google.com:19302'}, …(TURN from NEXT_PUBLIC_TURN_URL/USERNAME/CREDENTIAL if set)]}`.
5. Heartbeat: client `ping` every 20 s, server `pong`; the server drops sockets silent for 45 s → `participant_left {reason:'disconnected'}`.
6. On socket close: mark the participant `left` + `left_at`, broadcast `participant_left`. If it was the host and others remain → transfer host (§3) and broadcast `host_changed`. If nobody remains → close the instance (`ended_at = now`) after a 30 s grace period.
7. Reconnect: the client retries the WS with backoff 1, 2, 4, 8 s (max 5 tries) and shows a persistent room toast "**Reconnecting…**" [D]; on reconnect it re-sends offers to everyone. After 5 failures → leave as in §8.14.
8. Media-state changes (mute/unmute, video on/off) are sent as `media_state` and persisted on the participant row, so late joiners get them in `welcome`.

### 9.2 Message protocol (JSON `{"type": …}`)
**Required (P0)** — client → server:
| type | payload |
|---|---|
| `offer` / `answer` | `{to: participant_id, sdp}` |
| `ice` | `{to, candidate}` |
| `media_state` | `{audio_muted: bool, video_on: bool}` |
| `leave` | `{}` |
| `ping` | — |

**Required (P0)** — server → client:
| type | payload |
|---|---|
| `welcome` | `{self: Participant, participants: Participant[], meeting: {number, topic, host_name, invite_url, passcode, start_time, duration_minutes}, settings: {allow_unmute, mute_on_entry}}` |
| `participant_joined` / `participant_updated` | `{participant}` |
| `participant_left` | `{participant_id, reason: 'left' \| 'removed' \| 'disconnected'}` |
| `offer` / `answer` / `ice` | same as above plus `from` |
| `host_changed` | `{host_id, previous_host_id}` |
| `meeting_ended` | `{by}` |
| `error` | `{code, message}` — codes: `UNAUTHORIZED`, `REMOVED`, `DUPLICATE_SESSION`, `NOT_HOST`, `BAD_MESSAGE` |
| `pong` | — |

**Bonus (P1, host controls F9):**
| Direction | type | payload |
|---|---|---|
| client → server | `host_command` | `{command: 'mute_all', allow_unmute: bool}` · `{command: 'mute', target}` · `{command: 'remove', target}` |
| server → client | `force_mute` | `{by}` (target disables its mic, sends `media_state`) |
| server → client | `removed` | `{by}` (target closes media and leaves) |
| server → client | `settings_updated` | `{allow_unmute, mute_on_entry}` |

**Future / optional (not built in v1 — the UI for these is static):** `chat` (`{body, to: null | participant_id}`; `null` = "Meeting Group Chat"), `reaction`, `raise_hand`, `rename`, and host commands `lock`, `make_host`, `ask_unmute`, `stop_video`.

`Participant = {id, display_name, role: 'host' | 'attendee', is_guest, audio_muted, video_on, joined_at}`. Avatar colours are derived on the client (§5.8.14). `is_guest` = joined through a join path (label "(Guest)").

---

## 10. Backend

### 10.1 Database schema (SQLite) — graded
Design principles: 3NF. A **meeting** is the definition (what was scheduled); a **meeting instance** is one actual occurrence (a PMI or recurring meeting can run many times); participants belong to an instance. All timestamps are stored **UTC ISO-8601**. Booleans are INTEGER 0/1. `PRAGMA foreign_keys = ON` on every connection.

```sql
CREATE TABLE users (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  display_name     TEXT    NOT NULL,
  email            TEXT    NOT NULL UNIQUE,
  pmi              TEXT    NOT NULL UNIQUE CHECK (length(pmi) = 10),
  timezone         TEXT    NOT NULL DEFAULT 'Asia/Kolkata',      -- IANA id; fallback for new schedules
  created_at       TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE meetings (
  id                      INTEGER PRIMARY KEY AUTOINCREMENT,
  meeting_number          TEXT    NOT NULL CHECK (length(meeting_number) BETWEEN 10 AND 11),
  uses_pmi                INTEGER NOT NULL DEFAULT 0,   -- 1 = scheduled calendar entry that runs on the host's PMI number
  host_id                 INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type                    TEXT    NOT NULL CHECK (type IN ('instant','scheduled','pmi')),
  topic                   TEXT    NOT NULL CHECK (length(topic) BETWEEN 1 AND 200),
  description             TEXT    CHECK (description IS NULL OR length(description) <= 2000),
  start_time              TEXT,                 -- UTC; NULL for instant & pmi
  duration_minutes        INTEGER NOT NULL DEFAULT 40 CHECK (duration_minutes BETWEEN 0 AND 1440),  -- Zoom's Basic UI allows 0
  timezone                TEXT    NOT NULL,     -- IANA id chosen in the form
  passcode                TEXT    CHECK (passcode IS NULL OR length(passcode) BETWEEN 1 AND 10),  -- NULL = no passcode
  invite_token            TEXT    NOT NULL UNIQUE,  -- the ?pwd= value in links (32 url-safe chars)
  waiting_room_enabled    INTEGER NOT NULL DEFAULT 0,  -- stored and displayed only (waiting room is static UI)
  join_before_host        INTEGER NOT NULL DEFAULT 1,  -- "Allow participants to join anytime" (checked by default in Zoom)
  mute_upon_entry         INTEGER NOT NULL DEFAULT 0,
  host_video_on           INTEGER NOT NULL DEFAULT 1,
  participant_video_on    INTEGER NOT NULL DEFAULT 1,
  is_recurring            INTEGER NOT NULL DEFAULT 0,  -- flag only (recurrence rules are P2)
  deleted_at              TEXT,                        -- soft delete; Zoom's copy promises 7-day recovery
  created_at              TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at              TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  CHECK (type <> 'scheduled' OR start_time IS NOT NULL),
  CHECK (uses_pmi = 0 OR type = 'scheduled')
);
CREATE UNIQUE INDEX ux_meetings_number      ON meetings(meeting_number) WHERE uses_pmi = 0;   -- the number "owner"
CREATE UNIQUE INDEX ux_meetings_one_pmi     ON meetings(host_id) WHERE type = 'pmi';
CREATE INDEX        ix_meetings_host_start  ON meetings(host_id, start_time) WHERE deleted_at IS NULL;

CREATE TABLE meeting_invitees (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  meeting_id  INTEGER NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  email       TEXT    NOT NULL,
  UNIQUE (meeting_id, email)
);

CREATE TABLE meeting_instances (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  meeting_id     INTEGER NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,  -- the row that was started
  uuid           TEXT    NOT NULL UNIQUE,
  started_at     TEXT    NOT NULL,
  ended_at       TEXT,                           -- NULL = live
  allow_unmute   INTEGER NOT NULL DEFAULT 1,     -- set by Mute All's checkbox
  mute_on_entry  INTEGER NOT NULL DEFAULT 0      -- copied from meetings.mute_upon_entry; set to 1 by Mute All
);
CREATE INDEX        ix_instances_meeting  ON meeting_instances(meeting_id, started_at);
CREATE UNIQUE INDEX ux_one_live_instance  ON meeting_instances(meeting_id) WHERE ended_at IS NULL;

CREATE TABLE participants (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  instance_id    INTEGER NOT NULL REFERENCES meeting_instances(id) ON DELETE CASCADE,
  user_id        INTEGER REFERENCES users(id) ON DELETE SET NULL,  -- set for host-path entries, NULL for guests
  client_id      TEXT    NOT NULL,
  display_name   TEXT    NOT NULL CHECK (length(display_name) BETWEEN 1 AND 64),
  role           TEXT    NOT NULL CHECK (role IN ('host','attendee')),
  status         TEXT    NOT NULL CHECK (status IN ('in_meeting','left','removed')),
  audio_muted    INTEGER NOT NULL DEFAULT 1,
  video_on       INTEGER NOT NULL DEFAULT 0,
  joined_at      TEXT    NOT NULL,
  left_at        TEXT
);
CREATE INDEX ix_participants_instance_status ON participants(instance_id, status);
CREATE INDEX ix_participants_instance_client ON participants(instance_id, client_id);
```
**Optional (future chat — not created in v1):**
```sql
CREATE TABLE chat_messages (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  instance_id   INTEGER NOT NULL REFERENCES meeting_instances(id) ON DELETE CASCADE,
  sender_id     INTEGER NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  recipient_id  INTEGER REFERENCES participants(id) ON DELETE CASCADE,  -- NULL = "Meeting Group Chat"
  body          TEXT    NOT NULL CHECK (length(body) BETWEEN 1 AND 4096),
  sent_at       TEXT    NOT NULL
);
```
Relationships: `users 1─* meetings 1─* meeting_instances 1─* participants`; `meetings 1─* meeting_invitees`.

**Number resolution** (`meeting_service.resolve(number)`): the non-deleted row with `uses_pmi = 0` and that number (a generated meeting or the PMI). A `uses_pmi` calendar entry is started on **its own row** (so Recent shows its topic), but the service refuses a second live instance for any row that shares the number, and join-by-number goes to whichever row sharing that number has the live instance (else the owner row).

**Derived (never stored):**
- **Live** = has an instance with `ended_at IS NULL`.
- **Upcoming** (Meetings tab) = `type='scheduled' AND deleted_at IS NULL AND start_time >= {start of the user's local today}` + live instant meetings, sorted by `start_time`.
- **Day** (Home widget) = non-deleted scheduled meetings whose local start date = the requested date, + live instant/PMI instances when the date is today; each with `has_instance` (for the `joined` style) and `is_live`.
- **Previous / Recent** = instances with `ended_at IS NOT NULL`, newest first, with `COUNT(DISTINCT participants.client_id)` and `ended_at − started_at`.

### 10.2 Identifier generation (`services/id_generator.py`)
- **Meeting number:** 11 digits, first digit 8 or 9 (e.g. `81234567890`), `secrets`-random, retry on collision (max 5). **PMI:** 10 digits, first digit 2–9.
- **Passcode:** 6 chars from `[a-zA-Z0-9]` minus ambiguous `0OoIl1` (mixed case, like Zoom).
- **invite_token:** `secrets.token_urlsafe(24)` (32 chars). **Instance uuid:** `uuid4().hex`.
- **Numeric phone passcode** (info popover only, never stored): `int(sha256(passcode).hexdigest(), 16) % 10**6`, zero-padded to 6 [D].
- **Participant ID** (info popover): participant `id` zero-padded to 6.

### 10.3 Formatting (shared; `lib/format.ts` and `services/invitation.py`)
| Thing | Rule | Example |
|---|---|---|
| Meeting number display | 9 → `3 3 3`; 10 → `3 3 4`; 11 → `3 4 4` | `812 3456 7890`, `512 345 6789` |
| Join-modal typing | progressive (§7.2.4) | `123 456 78` |
| Invite URL | `{APP_URL}/j/{meeting_number}?pwd={invite_token}` | |
| Clock / times | `h:mm A` | `11:06 PM` |
| Time range | `h:mm A - h:mm A` | `10:00 AM - 10:40 AM` |
| Home date / clock date | `EEEE, MMMM d` | `Wednesday, October 7` |
| Calendar day label | `Today, MMM d` / `Tomorrow, MMM d` / `Yesterday, MMM d` / `EEE, MMM d` | `Fri, Oct 9` |
| Meetings group label | `Today` / `Tomorrow` / `EEE, MMM d` (+ `, yyyy` for another year) | `Wed, Oct 14` |
| Schedule date field | `MM/DD/YYYY` | `10/07/2026` |
| Time-zone label | `(GMT±H:MM) {label}` with the current offset | `(GMT+5:30) India` |
| Invitation / detail "Time" | `MMM d, yyyy hh:mm A` + tz label without the `(GMT…)` prefix [D] | `Oct 8, 2026 11:00 AM India` |

### 10.4 REST API (JSON; prefix `/api`; errors `{"error": {"code": "...", "message": "..."}}`)
| Method & path | Body / query | Response | Notes |
|---|---|---|---|
| `GET /api/me` | — | `User` (+ `pmi_formatted`, `avatar_color`, `initials`) | default user id 1 |
| `GET /api/users` | `?q=&limit=8` | `User[]` (other users) | Invite modal Contacts tiles, invitee suggestions |
| `GET /api/meetings` | `?view=upcoming&from=ISO` · `?view=day&date=YYYY-MM-DD&tz=IANA` · `?view=previous&limit=50` | `MeetingListItem[]` / `InstanceListItem[]` | §10.1 definitions; never includes passcodes |
| `GET /api/meetings/pmi` | — | `Meeting` | |
| `PATCH /api/meetings/pmi` | `{passcode?, waiting_room?, join_before_host?, mute_upon_entry?, host_video_on?, participant_video_on?}` | `Meeting` | Edit PMI (§7.7) |
| `POST /api/meetings/instant` | `{use_pmi?: bool}` | `201 {meeting, invite_url, start_url}` | creates the meeting (unless PMI) **and** a live instance |
| `POST /api/meetings` | `ScheduleRequest` | `201 Meeting` | `{topic, description?, start_local: "2026-10-08T11:00", timezone: IANA, duration_minutes, is_recurring, use_pmi, passcode: string\|null, waiting_room, join_before_host, mute_upon_entry, host_video_on, participant_video_on, invitees: string[]}`; server converts `start_local`+`timezone` to UTC; 422 if > 5 min in the past or invalid emails |
| `GET /api/meetings/{number}` | `?id=` (disambiguates `uses_pmi` entries) | `Meeting` (+ `is_live`, `invite_url`, `host_name`, `time_label`, `invitees`) | 404 `MEETING_NOT_FOUND` (also when deleted) |
| `PATCH /api/meetings/{number}` | partial `ScheduleRequest`, `?id=` | `Meeting` | 409 `MEETING_LIVE` |
| `DELETE /api/meetings/{number}` | `?id=` | `204` | soft delete; 409 `MEETING_LIVE`; 400 `PMI_NOT_DELETABLE` |
| `GET /api/meetings/{number}/invitation` | `?id=` | `{text}` | §10.5 (CRLF) |
| `GET /api/meetings/{number}/validate` | `?pwd=` | `{exists, topic, is_live, has_host, requires_passcode, passcode_ok, join_before_host, start_time, duration_minutes}` | used by the pre-join page; never leaks the passcode |
| `POST /api/meetings/{number}/start` | `{client_id, display_name}` | `{participant, token, instance_id}` | opens an instance if none; role host unless a host is connected (then attendee) |
| `POST /api/meetings/{number}/join` | `{client_id, display_name, pwd?, passcode?, audio_muted, video_on}` | `{participant, token, instance_id}` | `MEETING_NOT_FOUND` 404, `WRONG_PASSCODE` 403, `MEETING_NOT_STARTED` 409 (not live and `join_before_host=0`), `MEETING_FULL` 409, `REMOVED` 403. Not live + `join_before_host=1` → opens the instance with no host. `mute_on_entry` forces `audio_muted=1` |
| `POST /api/meetings/{number}/end` | `{token}` | `204` | host only (`NOT_HOST` 403) |
| `GET /api/instances/{uuid}` | — | `{instance, meeting, participants[]}` | Meetings → Previous detail |
| `GET /api/health` | — | `{ok:true}` | |
Passcode check on join: `pwd` (invite token) **or** `passcode` must match when `meetings.passcode IS NOT NULL`.

### 10.5 Invitation text (exact; CRLF line endings) [M template]
Scheduled:
```
{host_name} is inviting you to a scheduled Zoom meeting.

Topic: {topic}
Time: {Oct 8, 2026 11:00 AM} {time-zone label}

Join Zoom Meeting
{invite_url}

Meeting ID: {formatted number}
Passcode: {passcode}


```
- **PMI** [M]: topic `{host_name}'s Personal Meeting Room`, **no Time line**, and a blank line between Topic and "Join Zoom Meeting".
- **Instant:** topic `{host_name}'s Zoom Meeting`, no Time line (same shape as PMI).
- The text ends with the last line + **three CRLFs** [M]. Without a passcode the "Passcode:" line is omitted [D].
- Zoom uses the "scheduled Zoom meeting" sentence for every kind [M].

### 10.6 Seed data (`app/seed.py`, idempotent; times relative to "now" at seed time in `Asia/Kolkata`)
- **User:** Alex Morgan (id 1) + PMI meeting (`waiting_room_enabled=1`, passcode set, join anytime ✓ — matches Zoom's PMI defaults [M]; waiting room has no runtime effect).
- **Other users** (Contacts tiles, invitee suggestions, historical participants): Priya Sharma, Rahul Verma, Emily Chen, Daniel Kim, Sara Ali.
- **Scheduled** (durations ≤ 40 to fit the Basic duration control): "Morning Standup" (today, 2 h ago, 15 min → past card), "Weekly Team Sync" (today, next full hour, 30 min), "Design Review: Zoom Clone" (today +3 h, 40 min), "1:1 with Priya" (tomorrow 10:00, 30 min), "Sprint Planning" (+2 days 11:00, 40 min), "Client Demo – Acme Corp" (+6 days 16:00, 40 min, 3 invitees), "All Hands" (+9 days 09:30, 40 min).
- **Previous** (6 ended instances, 2–6 participants each, real join/leave times): "Daily Standup" (yesterday, 15 min), "Product Roadmap Q4" (−2 days, 40 min), "Alex Morgan's Zoom Meeting" (instant, −3 days, 18 min), PMI session (−4 days, 34 min), "Interview – Frontend Engineer" (−6 days, 38 min), "Retro" (−8 days, 40 min). Their meetings exist as scheduled rows on those days so the Home day view shows them as `isPast joined` cards.
- `python -m app.seed --reset` drops and recreates. Env `SEED_ON_START=reset` reseeds on every boot (keeps "today" data fresh on free hosting) [D].

### 10.7 Backend quality bar
Routers are thin; logic lives in `services/`; Pydantic schemas separate from ORM models; dependency-injected DB session; one error helper; CORS from `FRONTEND_ORIGIN`. pytest covers: number formatting, schedule validation (topic, start time, duration, passcode, emails), upcoming/day/previous queries (incl. soft delete), number resolution with `uses_pmi`, join error codes, host-only end, WS join → `media_state` → leave, `mute_all` / `remove` permissions.

---

## 11. Responsive behaviour (F10, P1) — `resp-*.jpg`
**Zoom-faithful rules are [Z]**; clone-only usability rules are **[D]** and live behind `@media (max-width:767px)` so desktop parity is untouched.

### 11.1 Breakpoints [M]
| Query | Workplace (`app.zoom.us`) | Portal (`zoom.us`) |
|---|---|---|
| ≥ 1440 (JS) | header "leading" slot shows "Discover Products ▾" (148×32) and "Pricing" (60×32) at x=282 (static ghost buttons: 14px/20px `#555B62`, radius 12, padding `6px 8px`, 24px apart, hover `#6E76801F` + `#0C60C8`) | — |
| ≥ 1281 | — | content padding 32 |
| 1081+ | search stretches to `clamp(160px,30vw,440px)`, centred | — |
| **≤ 1080** | Admin Center **and** Back/Forward/History hidden; search becomes a **32×32 icon button** (transparent, radius 8, 16px glyph, hover `#52528017`, active `#5252802E`), right-aligned 24px before the trailing cluster | — |
| ≤ 1279 | — | content padding `32px 24px` |
| **≤ 1024** | `.home__cards` width **96%** (wider than 600: 900 at 1024, 655 at 768); hub cards stretch (289 each at 1024) | desktop nav (Products/Solutions/Resources/Plans) and "Web App" hidden; **hamburger** 42×32 (radius 4, padding `9px 10px`, three 22×2 bars `#30ACFF` 4px apart, `.25s ease-in-out`) |
| **≤ 1023** | — | grid becomes block; side menu → full-width **38px bar** (bg `#EEEEEE`, radius 4.2, margin-bottom 16; "Meetings" 14px/38px `#0D6BDE` with padding-left 14; 40×34 chevron toggle at right that expands the menu inline); content padding `32px 16px` |
| **≤ 768** | "Workplace" word-mark, Download, Upgrade hidden (header = logo + search icon + bell + avatar); profile menu becomes a **full-screen sheet** (`inset:0; radius 0; no border/shadow`); Home shows the **"Download the Zoom app" CTA** (below) | — |
| **≤ 767** | — | header **50px** (no black strip; logo at (10,13); only "Join", "Host" 16px 600 `#666484` + hamburger); **Schedule rows stack** (`display:block; margin-bottom:20px`, label 100% with `padding:4px 0`); Topic, Time Zone, Invitees 100%; time on a new line under the date (`margin-bottom:8px`); duration selects 80% each; banners full width |
| ≤ 390 | — | sticky bar `padding:0 10px` |

### 11.2 What never changes [M]
- **The left rail stays 80px wide with 72×56 tabs at every width**, including 390 (no bottom tab bar). The content card is always `calc(100vw − 86px) × calc(100vh − 74px)`, radius 12 (304 wide at 390). *Clone: matched down to 768; on phones (≤ 767) the clone deliberately switches to a bottom tab bar — see §11.5 rule 0 (user decision "Zoom look, mobile-usable").*
- Header height 64 (Workplace). Clock 40px/40px 600 and `margin:64px 0 28px`. Action row `gap:60px; row-gap:32px`, fixed 288 wide, 56px columns.
- Meetings tab: left column **fixed 360px** (no media queries); the detail pane flex-shrinks (1472/992/832/576/320 at 1920/1440/1280/1024/768) and its buttons wrap.
- Join modal: `width:min(448px, 100vw − 48px)`, radius 32, padding 32, centred (342×238 at x=24 on a 390 screen); buttons stay right-aligned at 71/55px.
- Schedule label column stays 160px down to 768; controls keep fixed widths and wrap (at 1024 AM/PM wraps to a second line).

### 11.3 Per-page measurements [M] (see `07-responsive.md` §2 for full tables)
| | 1920×1080 | 1440×900 | 1280×720 | 1024×768 | 768×1024 | 390×844 |
|---|---|---|---|---|---|---|
| Search | 832,16 440×32 | 615,16 395×32 | 425,16 384×32 | icon 676,16 | icon 620,16 | icon 242,16 |
| Content card | 1834×1006 | 1354×826 | 1194×646 | 938×694 | 682×950 | 304×770 |
| Home cards column | 600 | 600 | 600 | 900 | 655 | 292 (hub cards stack 3× 292×56) |
| Home clock top | 132 | 132 | 132 | 132 | 210 (CTA above) | 228 |
| Join modal | 448×238 | 448×238 | 448×238 | 448×238 | 448×238 | 342×238 |
| Schedule controls x | 502 | 502 | 502 | 494 | 186 | stacked, 358 wide |

### 11.4 "Download the Zoom app" CTA (≤ 768) [M] (static)
First child of the Home content: container `padding:6px 6px 0`; card bg `#F2F8FF`, radius 10, padding 16, `display:flex; gap:8px`, colour `#2A2B2D`: title "**Download the Zoom app**" 16px/20px **590**, ls −0.31px; description "Download Zoom to access Chat, Phone, Docs, and more!" 14px/18px 400, ls −0.15px (670×72 at 768; 292×90 at 390). The clock keeps its 64px top margin below it.

### 11.5 Clone rules for phones (≤ 767) [D] — keep the app usable
0. **Shell (user decision "Zoom look, mobile-usable", deviation from Zoom):** the 80px rail becomes a 56px Zoom-styled bottom tab bar (Home, Meetings, Chat, Contacts, Settings; white, top border `#DFE3E8`, selected in Zoom blue, safe-area inset); 56px compact header (logo, search icon, bell, avatar); full-bleed content card; Search, Activity Center, profile, Settings and About open as full-screen sheets with a ✕; hover-only interactions also work by tap; small controls get invisible 44px tap areas; `100dvh` and `env(safe-area-inset-*)` throughout. Tablets (768–1023) keep Zoom's own layout.
1. Home: `.home__actions-row{gap:clamp(16px,8vw,60px)}` so "New meeting" isn't clipped (Zoom clips it); calendar widget `min-height:300px` (Zoom's collapses to 0 at 390).
2. Meetings tab (DV11): list 100% width; selecting an item pushes a full-width detail with a "‹ Back" (Join-panel style) header.
3. Room (DV10): always **full viewport** (no shell) on phones; toolbar shows Audio, Video, Participants, Chat, More, End/Leave (React, Share, Host tools move into More); panels open as full-screen sheets; gallery max 4 tiles per page (2×2) with swipe/arrows; header/toolbar toggle on tap.
4. Pre-join: card and form stack vertically (card `width:100%; aspect-ratio:16/9`, form 100%, 16px side margins).
5. `/j/{n}` launch page on a phone UA: show the normal page (never block joining; Zoom's phone redirect to an app-download page is not copied).

---
## 12. Non-functional requirements
- **Browsers:** latest Chrome, Edge, Safari 17+, Firefox. Camera/mic need HTTPS (localhost allowed in dev).
- **Performance:** Home interactive < 1.5 s on broadband; no layout shift after load (reserve heights; skeletons per §7.1.8; page-level placeholders `#F1F4F6` blocks radius 12 [D]).
- **Accessibility:** every icon button has an `aria-label`; reuse Zoom's measured labels: "New meeting", "Join", "Schedule", "Meeting history list", "Refresh", "Meeting information", "Encryption information", "View", "mute my microphone" / "unmute my microphone", "stop my video" / "start my video", "More audio controls", "More video controls", "open the manage participants list pane", "Participants Settings", "open the chat panel", "More meeting control", "End", "minimize", "Pop Out", "Close", "More options", "Select calendar date: Today, Oct 7", "Previous", "Next". Dialogs trap focus and close on Escape (except where §7.2.7 says otherwise). Visible focus rings per §5.7. Roster changes are announced through an `aria-live="polite"` region.
- **Security:** never return passcodes from list endpoints; validate host commands server-side; render all user text as text (never HTML); WS messages validated with Pydantic; rate-limit WS messages to 20/s per socket [D].
- **Code quality:** follow strict engineering standards (§0.5). Baseline: ESLint (frontend), Ruff (backend), no unhandled `any`, components < 250 lines, no copied Zoom JS/CSS — re-implement from these specs and tokens.

---

## 13. Deployment & configuration
| Part | Host | Settings |
|---|---|---|
| Frontend | Vercel | `NEXT_PUBLIC_API_URL=https://<api>`, `NEXT_PUBLIC_WS_URL=wss://<api>`, `NEXT_PUBLIC_APP_URL=https://<frontend>`, `NEXT_PUBLIC_PLAN=pro` (default; §7.6.4), optional `NEXT_PUBLIC_TURN_URL/USERNAME/CREDENTIAL` |
| Backend | Render Web Service (or Railway) | `uvicorn app.main:app --host 0.0.0.0 --port $PORT`; env `FRONTEND_ORIGIN`, `APP_URL`, `SECRET_KEY`, `DATABASE_URL=sqlite:///./data/zoom.db`, `SEED_ON_START=if-empty\|reset`; tables created + seeded on boot. Free tiers have ephemeral disks → data resets on redeploy (README). WebSockets must be enabled (default on Render). |
Local dev: `cd backend && python -m venv .venv && pip install -r requirements.txt && uvicorn app.main:app --reload` (port 8000) · `cd frontend && npm i && npm run dev` (port 3000).

---

## 14. README must include
Project overview + screenshots of **our** app (not Zoom's), live URLs, tech stack, architecture diagram (§4), DB schema/ER summary (§10.1), API table, local setup, env vars, seeding, **scope statement** (functional features per §2.1; everything in §2.2 is "Static UI only"), assumptions (default user, role by entry path, mesh limit 8, ephemeral SQLite on free hosting, no TURN by default, Basic-plan duration rule, Zoom trademarks used only for this educational clone and the project is not affiliated with Zoom), known limitations, and what's P1/P2.

---

## 15. Build plan (1-day timeline, in order)
| # | Milestone | Done when |
|---|---|---|
| M0 | Scaffold repo, `tokens.css` (= `06-tokens.css` + §5.2.4/5.2.5), icons configured, lint/format conventions | `npm run dev` + `uvicorn` both start |
| M1 | Backend models, id generator, seed, meetings CRUD (+ soft delete, `uses_pmi`), day/upcoming/previous queries, validate/start/join/end, tests | `pytest` green; `/api/meetings?view=day&date=today` returns seeded meetings |
| M2 | UI kit (§5.8) + Workplace shell + Home (clock, actions, New-meeting popover, hub, calendar widget per day, Recent card) + profile menu placeholder | Home matches `home-08` / `01-home` at 1366×768 |
| M3 | Join modal (rules, paste, history) + web-client panel + invalid page; Meetings tab (Upcoming + Previous, detail, notices, copy, invitation) | F2, F4 (no media yet), F6 acceptance pass |
| M4 | Portal shell + Schedule page (functional rows + static rows) + date picker + time/time-zone selects + detail page + Copy Invitation dialog | F5 acceptance pass |
| M5 | Pre-join (dark) + room UI (stage, header, info popover, View menu, toolbar, menus, participants panel, static chat/host-tools panels, End/Leave) with local media | visual match `room-*`, `18–23-*` |
| M6 | WS signalling + WebRTC mesh + roster + media state + host transfer + copy invite link / Invite modal | two browsers see/hear each other; mute/video reflect on both |
| M7 | Bonus: host controls (Mute All, mute one, remove), Edit/Delete, launch page, responsive | F9, F6b, F10, F17 acceptance pass |
| M8 | Deploy, README, final visual QA | live URLs work over HTTPS with 2 devices |

---

## 16. Acceptance checklist (QA script)

**Visual — run at 1366×768 and compare with `docs/reference/screens/`**
- [ ] V1 Shell: header 64px, bottom border 1px `#DFE3E8`, padding `0 16px`; logo 87×20 at (16,22); 1×20 divider then "Workplace" 22px/24px 600; search 410×32 at (455,16) bg `#ECEFF1` radius 8; Admin 102×32 at x=960, Download 91×32 at 1074 (`#F1F4F6` / `#0D6BDE`), Upgrade 85×32 at 1177 (`#0D6BDE`, 500), bell 32×32 at 1274, avatar 32×32 radius 10 `#9053C2` at 1318. Rail 80 wide, tabs 72×56 at y=68/126/184/242, Settings at y=690; selected tab white. Content card (80,68) 1280×694 radius 12.
- [ ] V2 Home: time top y=132, 40px/40px 600 `#232333`; date 16px/20px `rgba(4,4,19,.56)` 8px below; action buttons 56×56 radius 20 at x=576/692/808, y=228, colours `#FF742E` / `#0E71EB` / `#0E71EB`; hover lifts 4px with `0 4px 11px #B3B3B3` (.15s); labels 14px/16px `#6E7680` at y=296; chevron 16.67px with hover `#F2F2F7`.
- [ ] V3 Home cards: hub entries 189×56 at y=337, radius 16, border `#DFE3E8`, 16px gaps, hover `#F7F9FA`; calendar widget 600 wide at y=409, border 1px `#EDEDF4` radius 8, date header 44 + tools row 44 with `#DFE3E8` borders, "Today, Oct 7" 14px/18px 700, Today pill 66×24 with `#98A0A9` border; empty day shows the 89×90 beach + "No meetings scheduled." 14px/20px `#555B62`; event cards radius 12 padding 8, live/coming cards `#F2F8FF` / `#A8CCF8`; Recent card follows at y=725.
- [ ] V4 New-meeting popover 285×112 at (506,321), radius 10, rows 50 tall, hover `#0E71EB` + white, no divider; PMI submenu 146×118 at (786,377).
- [ ] V5 Join modal 448×238 at (459,265), radius 32, padding 32; title 20px/24px 700 ls −.45px; input 384×40 radius 12 padding `6px 40px 6px 16px`, focus = 2px `#2D8CFF` outline offset 1 (border unchanged); Cancel 71.5×32 `#F1F4F6`/`#0D6BDE`; Join 55×32 disabled `#ADB1B840`/`#ADB1B8`; overlay `rgba(0,0,0,.2)`; no animation; overlay click does not close.
- [ ] V6 Meetings tab: left column 360, header 46, refresh 21×23 at (96,80); PMI card 328×78 radius 12, selected `#0E71EB`; item 123px tall (topic 16px/19px 700, then time, Host, Meeting ID at 13px/16px `#747487`), hover `#E7F1FD`; column divider **2px** `#7D7D8821`; detail topic 24px/29px 700 `#39394D` at (482,116); Start 75×32 `#0E72ED` radius 8 700; Copy Invitation 162×32 / Edit 85×32 / Delete 103×32 white with `#DFE3E8` border; "Copied!" tooltip 58×24 white 6px above.
- [ ] V7 Portal: header 104 (40 black `#00031F` + 64 white); side menu 300 wide `#F7F7FA`, items 288×32 radius 12, Meetings selected `#F2F8FF`/`#0D6BDE`; content x=332; back link + H1 "Schedule Meeting" 600 20px/22px; labels 160 + 10 gap, controls at x=502; widths Topic 490, date 240, time 173, AM/PM 104, hr/min 150, Time Zone 490, passcode 200 at x=609; rows 25px apart; inputs radius 12 border `#C1C6CE`, hover bg `#6E76801F`, focus `#4B96F1` + inset ring; error border `#FF6682` + "Topic is required" 12px/16px `#DA1639` with icon; Duration hr disabled at 0 and minutes 0/15/30/40; date picker 280×336 radius 16; time menu 173 wide, 15-min options; sticky bar 80 tall with Save 60×32 and Cancel 73×32.
- [ ] V8 Detail page: 160px label column (14px/24px `#131619`), values 14px/21px `#232333`, rows 20px apart; Security with "********" + Show; Invite Link + copy icon; sticky bar Start / Copy Invitation / Edit / Delete; Copy Invitation dialog 700 wide with 650×380 textarea.
- [ ] V9 Pre-join: dark `#1D1E20`, no header; preview 700×394 `#313235` radius 14; control bar 176×52 `#040506` radius 10 with "Mute" / "Start Video" (12px/15px); form 392 wide 40px to the right; "Enter Meeting Info" 24px/36px 700; inputs 392×40 border 2px `#555B62` radius 10; Join 400×40 radius 10 16px 700, disabled `rgba(255,255,255,.06)` / `#ADB1B8`; agreement 14px/21px `#939BA4`.
- [ ] V10 Room (in shell): header 48 and toolbar 52, both `rgba(0,0,0,.7)`; info pill at (4,13) 158×22 radius 20; toolbar left 0–180, mid 426–948, right End at 1194; buttons ≥86×48 radius 8, 12px/16px labels, hover `#6E768054`; Video label always "Video"; End = `#F05` hexagon; attendee Leave = red door; 1-person speaker tile 1234×694 at x=23; 2-person gallery 580×326 at (60,182)/(640,182), gap 0; name tag 15px/22.5px, bg `rgba(0,0,0,.56)`, radius 4; panels 398×686 at (880,4) `#1D1E20` radius 15 border `#313235`; participant rows 390×44; End popover 248 wide at right 8 / bottom 52 with 216×32 buttons; toasts at y=58, radius 14, `rgba(0,0,0,.93)`.

**Functional**
- [ ] A1 Home shows a live clock (changes exactly on the minute) and today's seeded meetings in the calendar widget; prev/next/Today/day picker change the day and the label (`Tomorrow, Oct 8`, `Fri, Oct 9`); Recent shows the 5 newest ended meetings with duration and participant count; "View all" opens Meetings → Previous.
- [ ] A2 New meeting → unique 11-digit ID, passcode and invite link (visible in the info popover) → room inside the shell as host, mic muted, video off, toast "You are host now." for 3 s. With "Use my PMI" checked → the PMI number is used.
- [ ] A3 Join modal: typing `12345678901` shows `123 4567 8901`; `abcde` enables Join, `abcd` doesn't; `!` is rejected; pasting `https://<app>/j/81234567890?pwd=x` fills `812 3456 7890`; Escape closes, overlay click doesn't; an unknown ID shows "This meeting link is invalid (3,001)" in the panel with "‹ Back"; a known ID shows the dark pre-join → name → room as attendee; history chevron lists it next time.
- [ ] A4 An invite link in another browser → (launch page →) pre-join (name required; passcode only if the link has no pwd) → joins the same live meeting; a wrong passcode is rejected; a not-started meeting without "join anytime" shows the waiting state and continues when the host starts.
- [ ] A5 Schedule: topic/description/date/time (incl. typed `9:10`)/duration/time zone → Save → stored in SQLite → detail page with invite link → appears in Home (on its day) and Meetings → Upcoming with "Starts in N minutes" / "NOW" notices; empty topic shows "Topic is required"; past days can't be picked. Edit and Delete (soft) work; the Delete modal shows Zoom's copy.
- [ ] A6 Two browsers: both tiles visible, audio audible; mute/unmute and video on/off reflect on both sides (tile icon, name tag, participants row icons, toolbar label/icon); the participant count updates; Copy invite link shows "Invite link has been copied to clipboard"; Speaker ↔ Gallery switch works; with 3+ people the green ring follows the speaker in gallery.
- [ ] A7 Bonus host controls: Mute All (Cancel/Continue dialog) mutes the other browsers; un-ticking "Allow participants to unmute themselves" blocks their Unmute; the row mic icon mutes one participant; Remove kicks a participant who then cannot rejoin that instance; End Meeting for All ends it for everyone; host Leave transfers host ("You are host now." on the new host).
- [ ] A8 After a meeting ends it appears first in Recent meetings and Meetings → Previous with the right duration and participant count.
- [ ] A9 Refreshing any page keeps state (URL-driven); browser back/forward work; header Back/Forward stay disabled (as in Zoom).
- [ ] A10 Static UI: chat panel opens and accepts typing but sends nothing; React, Share, Host tools, More items, hub entries, search, bell do nothing harmful and show no errors.
- [ ] A11 Responsive: at 1024 the search is an icon and Admin Center is hidden; at 768 Download/Upgrade/"Workplace" are hidden and Home shows the download CTA; the rail stays 80px; at 390 every P0 flow (home → join → pre-join → room → leave; schedule) is usable.

---

## 17. Assumptions & open questions

### 17.1 Assumptions (decided)
1. Role is decided by the entry path (§3); every browser is the default user.
2. The calendar widget is the assignment's "Upcoming meetings" section (one day at a time, as in Zoom) and DV2 adds a "Next:" jump; Meetings → Upcoming lists everything.
3. "Validate meeting existence" is satisfied by Zoom's own pattern: the Join modal never validates; the pre-join page shows "This meeting link is invalid (3,001)" (DV7).
4. The clone mimics a Zoom **Pro** account by default (hour select enabled 0–24, minutes 0/15/30/45, no 40-minute banner) so the assignment's Duration field is fully usable; `NEXT_PUBLIC_PLAN=basic` switches to the exact Basic-account UI that was captured (hour select disabled, 0/15/30/40, banner shown, passcode forced on).
5. Meetings with more than 8 participants are out of scope (mesh).
6. Zoom logos and icons are Zoom trademarks used only for this educational assignment; the README carries a non-affiliation disclaimer.
7. Scope follows the assignment PDF only (§2); chat, reactions, share and the other §2.2 items are pixel-perfect static UI.

### 17.2 Remaining unknowns (no measured data — build the [D] value and revisit if a capture becomes possible)
| # | Gap | Current decision |
|---|---|---|
| U1 | Real **scheduled** meeting detail page (only the PMI detail was captured) and its page head | §7.8.1 head + PMI grid |
| U2 | Real **scheduled** meeting edit page (only Edit PMI captured) | same form, H1 `Edit "{topic}"` |
| U3 | Calendar-widget **event card DOM and copy** (only CSS observed; account had no events) | §7.1.8 anatomy, "Starting soon" / "Now", "…" menu items |
| U4 | Pre-join for a **signed-in non-host** inside the Workplace shell; Back button visibility over the dark page | dark page inside the panel, Back visible |
| U5 | Waiting-for-host state copy and layout | §7.10.1 |
| U6 | Enabled pre-join Join hover colour | `#0C60C8` |
| U7 | Toast copy for force-mute, mute-all, removed; Remove-participant confirm copy; meeting-ended dialog copy | §8.12, §8.13 [D] strings |
| U8 | Speaker-view filmstrip with 3+ participants (paging, order) and whether the large tile ever shows the ring | filmstrip = all but the active speaker; no ring in speaker view |
| U9 | Name-tag leading icon when a participant is unmuted with video off | no icon |
| U10 | Meeting-client avatar palette beyond `#8E44AD` and `#D35400` | flat-UI palette §5.8.14 |
| U11 | Default schedule start time rule (next 15-min vs 30-min slot) | next half-hour |
| U12 | Invitation "Time:" format (hour zero-padding, tz label) | `MMM d, yyyy hh:mm A` + label without `(GMT…)` |
| U13 | Room UI on phone widths (Zoom web client not captured on mobile) | §11.5 rules |
| U14 | Toolbar overflow order when space runs out | Host tools → Share → React → Chat |
| U15 | Clicking a rail tab during a meeting (Zoom keeps the meeting in a mini view) | open the End/Leave popover first (§6.7) |
| U16 | Activity Center internals (cross-origin iframe; static scope anyway) | §6.5 [D] |

### 17.3 Resolved since v1.0 (for reviewers)
Pre-join visuals (now measured, dark page) · populated Meetings list and detail notices · Join-modal rules and error behaviour (no inline error) · gallery gap/padding and grid algorithm · active-speaker colour · toast lifetimes and position · room menus, panels, invite modal, End popover · portal header height and side menu · Schedule control values (15-min times, Basic duration, 149 time zones) · responsive breakpoints (rail never changes) · avatar palettes · focus models · motion values.
