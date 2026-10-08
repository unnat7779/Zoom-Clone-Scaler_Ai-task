# Zoom Workplace clone — frontend

Next.js 16 (App Router, Turbopack) + React 19 + strict TypeScript, CSS Modules, TanStack Query, date-fns, clsx.
The architecture specification is in `../PRD.md`.

```bash
npm install
cp .env.example .env.local      # point NEXT_PUBLIC_API_URL / NEXT_PUBLIC_WS_URL at the backend
npm run dev                     # http://localhost:3000 (agents: npm run dev -- -p 31xx)
npm run lint && npm run typecheck && npm run build
npm run gen:icons               # regenerate src/shared/icons/generated from ../docs/reference/icons
```

| Env | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | FastAPI origin (client adds `/api`) |
| `NEXT_PUBLIC_WS_URL` | API origin with `ws(s)://` | signalling origin (`/ws/meetings/{n}`) |
| `NEXT_PUBLIC_APP_URL` | `window.location.origin` | public origin for invite links |
| `NEXT_PUBLIC_PLAN` | `pro` | `basic` makes Schedule imitate the 40-minute plan |
| `NEXT_PUBLIC_TURN_URL/USERNAME/CREDENTIAL` | — | optional TURN server |

Cache Components / Partial Prefetching are **off** (`next.config.ts`): the app is a client-rendered SPA, so routes
unmount on navigation and `params` / `useSearchParams` need no extra Suspense boundaries (dynamic routes already
render on demand; static pages that read search params wrap them in `<Suspense>`).

## Layout

```
src/
  app/                       routes only (thin pages → feature components); providers.tsx = Query + Toast
  features/
    shell/                   Workplace header, rail, content card, profile menu (+ Status / Help submenus), Settings,
                             Search and About dialogs, Activity Center panel, placeholders
    portal/                  zoom.us header + side menu
    home | join | meetings | schedule | meeting-room   phase-2 features (index.ts exports placeholders now)
  shared/
    styles/  icons/  ui/  hooks/  lib/  types/
```

Features import `shared/*` freely and other features only through their `index.ts`.

## Routes

| URL | File | Renders (owner) |
|---|---|---|
| `/` | `app/page.tsx` | redirect → `/wc/home` |
| `/wc/home` | `app/(workplace)/wc/home` | `HomePage` from `features/home` (HOME) |
| `/wc/join` | `app/(workplace)/wc/join` | `JoinShortcutPage` (HOME: replace → `/wc/home` + open Join modal) |
| `/wc/join/[number]` | `app/(workplace)/wc/join/[number]` | server redirect → `/wc/{n}/join`, query kept (JOIN; Zoom's `/wc/join/{n}` redirect) |
| `/wc/meetings` | `app/(workplace)/wc/meetings` | `MeetingsTabPage` from `features/meetings` (MEET), in `<Suspense>` |
| `/wc/team-chat`, `/wc/contacts` | `app/(workplace)/wc/*` | `ChatPlaceholderPage`, `ContactsPlaceholderPage` (shell, static) |
| `/wc/[number]/join` | `app/wc/[number]/join` | `PreJoinPage({number})` from `features/join` (JOIN) |
| `/wc/[number]/start` · `/meeting` · `/left` | `app/wc/[number]/*` | `StartMeetingPage` · `MeetingRoomPage` · `LeftMeetingPage` from `features/meeting-room` (ROOM) |
| `/j/[number]?pwd=` | `app/j/[number]` | `InviteLaunchPage` from `features/join` (Zoom's launch page; both buttons keep `pwd`) |
| `/meeting/schedule` | `app/(portal)/meeting/schedule` | `SchedulePage` from `features/schedule` (MEET) |
| `/meeting/[number]` · `/edit` | `app/(portal)/meeting/[number]/*` | `MeetingDetailPage` (meetings) · `EditMeetingPage` (schedule) (MEET) |

Layouts: `(workplace)/layout.tsx` → `WorkplaceShell`; `wc/[number]/layout.tsx` → `MeetingChromeGate` (shell only when
`?fromPWA=1`, never on `/left`); `(portal)/layout.tsx` → `PortalShell`. Every placeholder file starts with
`// PLACEHOLDER (phase 1, FE-core)` — replace the component, keep the export name (or update the route file you own).

---

## Shared layer

### Tokens — `src/shared/styles/`

`tokens.css` imports `tokens/base.css` then one file per area: `shell.css`, `portal.css` (FE-core) and
`home.css`, `join.css`, `meetings.css`, `schedule.css`, `room.css` (empty, owned by the phase-2 agents).

**Rule:** component CSS never contains a raw colour, shadow, radius, z-index or duration — add a variable to the right
token file. Prefer names in this order:

| Layer (base.css) | Names | Use for |
|---|---|---|
| 7 — semantic (end of file) | `--color-*` (`--color-text-primary #222325`, `--color-text-prism #2A2B2D`, `--color-text-tertiary`, `--color-text-link(-hover/-press)`, `--color-border-subtle`, `--color-border-input`, `--color-border-focus`, `--color-bg-app`, `--color-bg-surface`, `--color-bg-selected`…), `--color-state-hover/press` (`#6E76801F` / `#6E76806B`, they **replace** the resting bg), `--color-state-*-dark`, `--radius-{2,3,4,6,8,10,12,14,15,16,20,24,32}` / `--radius-pill` / `--radius-round`, `--shadow-{small,medium,large,join-modal,toast,home-action,pwa-confirm,meeting-history,portal-*,room-*}`, `--z-{inline-dropdown,loading-mask,portal-sticky,room-bars,room-toast,overlay,pwa-modal,profile-menu,room-dialog,portal-header,popover,tooltip,floating,zoom-dialog,toast}`, `--dur-{instant,100,150,200,225,250,300,400}` + `--ease-*`, `--ls-*` letter-spacings, `--font-app` / `--font-portal` / `--font-launch`, `--overlay-{dark,light,scrim}`, `--focus-ring-*` | everything |
| 7 — PWA legacy | `--zc-*` (PRD §5.2.3 names: `--zc-orange`, `--zc-blue-action`, `--zc-blue-link`, `--zc-text-legacy`, `--zc-text-dark`, `--zc-label-grey`, `--zc-text-day`, `--zc-divider-legacy`, `--zc-danger`…) | Home actions, Meetings tab |
| 7 — portal | `--portal-*` (PRD §5.2.5) | portal pages |
| 7 — room | `--mr-*` (PRD §5.2.4 dark palette), `--room-toolbar-bg`, `--room-header-bg`, `--mc-avatar-1…8` | meeting room |
| 5 — component vars (verbatim) | `--btn-*`, `--input-*`, `--menu-*`, `--tooltip-*`, `--dialog-*`, `--banner-*`, `--check-*`, `--radio-*`, `--toggle-*`, `--seg-*`, `--tabs-*`, `--avatar-*`, `--presence-*`, `--badge-*`, `--toast-*`, `--home-action-*`, `--rail-tab-*`, `--zbtn-*` | building controls |
| 1–4 (verbatim `06-tokens.css`) | `--zoom-color-*`, Prism unprefixed (`--text-stronger-neutral`…), `--zoom-box-shadow*`, `--typography-*`, `--zIndex-*` | raw design-system values |

`globals.css`: Workplace reset (`line-height: 1`, `box-sizing: border-box`), font smoothing, keyboard-only focus ring
(`:focus-visible { outline: 2px solid #4B96F1; outline-offset: 2px }`), `.visually-hidden`. Keyframes in CSS modules are
scoped — define them inside the module that uses them.

`touch.module.css` (`import touch from "@/shared/styles/touch.module.css"`): `touch.target` gives a small control an
invisible ≥44×44 tap area (`::after`, phones ≤767 and coarse pointers only), so Zoom's sizes stay unchanged.

### Icons — `src/shared/icons/`

`scripts/gen-icons.mjs` turns every `docs/reference/icons/*.svg` into `generated/<PascalName>Icon.tsx`
(`nav-home.svg` → `NavHomeIcon`, `room-react-nvf-nvf_coffee.svg` → `RoomReactNvfNvfCoffeeIcon`) and copies PNGs to
`public/zoom/` (`/zoom/mtg-z-loading.png`…). Import by file: `import { NavHomeIcon } from "@/shared/icons/generated/NavHomeIcon"`.
Props: `IconProps = SVGProps & { size?: number | string; title?: string }`; single-colour icons use `currentColor`
(set CSS `color`), default size is Zoom's (`1em` for most glyphs). Never edit generated files.

### UI kit — `src/shared/ui/` (`import { Button, … } from "@/shared/ui"`)

All accept `className`; states (hover / active / focus-visible / disabled / selected / loading) are built in.

| Component | Key props |
|---|---|
| `Button` | `family?: "zoom" \| "z" \| "portal"`. zoom (default): `variant` primary \| secondary \| secondary-neutral \| tertiary \| text \| overlay, `danger`, `size` sm(24) \| md(32) \| lg(40), `pureText`, `loading`. z (Meetings tab): `variant` normal \| tertiary \| tertiary-danger \| secondary \| destructive, `size` 24 \| 32 \| 40 \| 48; tertiary keeps its focus colours (`#F1F4F6` / `#0E71EB`) on any focus, the outline is keyboard-only. portal (zm-button): `variant` default \| primary \| plain \| danger \| link, `size` small \| large; plain's 1px border sits inside the size (small 32 tall). Common: `leadingIcon`, `trailingIcon`, `fullWidth`, `ref`. `buttonClassName()` gives the classes for links styled as buttons |
| `IconButton` | tertiary icon-only button: `label` (aria-label, required), `icon`, `size` sm 24 \| md 32 (glyph 14/16), `shape` circle \| rounded |
| `Input` | zoom-ui field: `size` sm \| md \| lg, `error`, `leadingIcon`, `trailingIcon`, `className` (wrapper/width), `inputClassName`, native input props + `ref` |
| `TextArea` | `size`, `error`, `autoResize={{ minRows, maxRows }}` (Schedule description: 2→4 rows) |
| `Select<V>` | `options: {value,label,description?,disabled?,group?}[]`, `value`, `onChange`, `placeholder`, `size`, `error`, `disabled`, `className` (width), `menuClassName`, `emptyText`. Custom listbox: arrows / Home / End / Enter / Space / Escape / Tab / type-ahead; opening turns the chevron only, keyboard focus adds the blue border + inset ring. Building blocks for other triggers (Schedule's filter selects): `SelectMenu` (trigger width, 4px below / flips above, scroll wrap 208px incl. the 11px list margins → n×32+24, max 210; group titles; ✓ row; keyboard-focus bar at `left:-8px`; selected row centred on open; layer `--select-menu-z`, default `--z-floating`, 105 inside `PortalShell`); `--select-menu-max-height` / `--select-option-min-height` enlarge it (portal phones: 44px rows), `SelectChevron({open})`, `useSelect`, `optionId` |
| `DayGrid` | `@/shared/ui/DayGrid` — zoom-ui `.zoom-date-table`: `month`, `selected`, `today`, `onSelect`, `isDisabled(day)`, `onMonthChange(month)`; 6×7 cells on a 36×40 pitch, weekday tooltips, roving focus (arrows / Home / End; with `onMonthChange` also Page Up / Down, and the keys may leave the month). `useVisibleMonth(initial)` → `{ month, showMonth, shiftMonths, shiftYears }` for the « ‹ › » header. Used by the Home day picker and the Schedule date picker |
| `Checkbox` | `checked`, `onChange(checked, event)`, `label`, `description`, `indeterminate`, `variant` zoom \| pwa, `legacyLabel` (#232333). pwa = `zm-pwa-checkbox`: centred, 7px before the mark (the hidden input's margins), label without padding, `#2D8CFF` ring on any focus |
| `RadioGroup` / `Radio` | group: `value`, `onChange`, `direction` horizontal (32px apart) \| vertical, `disabled`; radio: `value`, `label`, `description` |
| `Modal` | `open`, `onClose`, `variant` zoom \| join \| confirm \| portal \| bare, `size` sm \| md \| lg, `title`, `footer`, `showClose`, `closeOnOverlayClick` (false), `closeOnEscape` (true), `initialFocusRef` (portal: the dialog box itself, so Enter never confirms a Delete). Portal + focus trap + layered Escape + scroll lock. zoom and portal play Zoom's leave animation (`fade-in-linear-out .3s` / `dialog-fade-out .2s`) before unmounting; the others close at once. confirm: Zoom-logo header (× hover `--zc-confirm-close-hover`), `title` = 600 14/14 h5 |
| `Popover` | `open`, `onClose`, `anchorRef`, `placement` (`bottom-start`, `top`, `left-start`…), `offset`, `flip`, `matchAnchorWidth`, `viewportClamp` both \| horizontal (never pushed above/below its anchor), `anchored` (false: CSS places it, e.g. a full-screen sheet), `variant` floating (zoom-ui r12, z2000) \| prism (r10, z1300) \| dark (room dropdown) \| plain, `motion` fade \| zoom-in \| fade-linear \| none, `trapFocus`, `closeOnOutsideClick`, `closeOnEscape` |
| `Menu`, `MenuItem`, `MenuDivider`, `MenuGroupTitle` | menu: `tone` light \| dark, `density` default \| profile, `autoFocus`; item: `icon`, `trailing`, `trailingOnHover`, `selected` (✓), `danger`, `active`, `disabled`, `onSelect`. Arrow-key roving focus (`useMenuNavigation`) |
| `Tooltip` | `content`, single ref-able child, `variant` light (Prism white) \| dark (zoom-ui) \| mui-dark (header History), `placement`, `offset`, `open` (controlled, e.g. "Copied!"), `disabled` |
| `Avatar` | `name`, `size` 20 \| 24 \| 32 \| 40 \| 48 \| 64 \| 80 \| 110, `palette` workplace \| meeting, `color` (palette key, see `avatarColorFromHex`), `seed`, `shape` rounded (r10) \| circle \| chat (r6), `presence` (glyph + notch). Also `PresenceGlyph`, `PRESENCE_LABELS` |
| `Banner` | `kind` info \| success \| warning \| danger, `title`, `icon` (false hides), `actions`, `actionsBelow`, `onClose` (× at 13/13), `bleed` |
| `ToastProvider` / `useToast()` | `show({ message, title?, kind?, surface?: "workplace" \| "portal", duration?: ms \| null })`, `dismiss(id)`, `notAvailable()` → "This feature isn't available in this demo." (use it for every Static-UI-only control) |
| `StaticButton` | a `type="button"` whose click is `notAvailable()` (Static-UI-only links and controls); all other button props |
| `Spinner` | `size` 16 \| 24 \| 32 \| 48, `variant` spokes \| pwa, `tone` default \| light \| dark, `label` |
| `Badge` | zoom-ui label chip ("New"): `color` red \| blue \| gray \| green \| orange \| yellow \| purple \| cyan, `size` sm \| md |
| `FieldError` | 12px error circle + 12/16 `#DA1639` text (`.zoom-form-item__error`) |
| `Portal` | renders children into `document.body` after hydration; inside an `OverlayScope` they are wrapped in a `display: contents` element with the scope's class |
| `OverlayScope` | `className` — overlays (menus, popovers, tooltips, dialogs) rendered inside get this class, so they inherit a surface's variables though they live in `<body>` (`PortalShell`: portal font, tracking, select layer). `useOverlayScope()` reads it |
| `HoverPopover` | popover open while the pointer is over its trigger or itself, or the trigger has keyboard focus (`useHoverIntent`; the trigger gets `aria-describedby`): `content`, single ref-able child, `variant` prism ("Add a calendar", 16px arrow) \| info (Schedule ⓘ, passcode rules; 14px arrow) \| portal ("Copy the Link" light tooltip; 6px arrow), `placement`, `offset`, `forceOpen`, `toggleOnTap` (touch: a tap toggles it; touch hover never opens any variant), `className` (width; layer via `--hover-popover-z`) |
| `StickyFooter` | Zoom's JS sticky bar (`zoom-sticky` / `zm-sticky`, `useStickyFooter`): `height` (in-flow slot: Schedule 80, detail 82), `phoneHeight` (≤767 slot), `className` (the bar), `fixedClassName` (extra styles while pinned); `position: fixed; bottom: 0` with the slot's left/width while the slot is below the fold; stays in its slot while a phone keyboard is up (`useOnScreenKeyboard`) |
| `PortalPageHead` | zoom.us page head: `‹ Back to Meetings` link (`backHref`, `backLabel`) + H1 `title` (600 20px/22px, `margin: 20px 0 32px`) |

### Hooks — `src/shared/hooks/` (`import { useClock } from "@/shared/hooks"`)

| Hook | Contract |
|---|---|
| `useClickOutside(refs, handler, enabled)` | pointerdown outside every ref |
| `useEscapeKey(handler, enabled)` | layered: only the most recently enabled handler runs |
| `useClock("minute" \| "second")` | `Date \| null` (null while server rendering), ticks exactly on boundaries, one shared timer |
| `useClipboard({ resetAfter })` | `{ copy(text) → Promise<boolean>, copied }`; `copyText()` standalone |
| `useMediaQuery(query)` + `MEDIA` | live match (false on the server); `MEDIA.phone`, `.tablet`, `.narrowHeader`, `.wideHeader` |
| `useToggle(initial)` | `[on, toggle, setOn]` for visual-only switches and open/closed bits |
| `useElementSize(ref)` | content-box `Size` `{ width, height }`, kept current by a `ResizeObserver` (room stage) |
| `useLocalStorage(key, initial)` | `[value, setValue]` JSON, synced across components and tabs; `setValue(null)` removes |
| `useFocusTrap(ref, active, { initialFocusRef, restoreFocus })` | Tab cycling + focus restore |
| `useAnchoredPosition({ anchorRef, floatingRef, open, placement, offset, flip, matchAnchorWidth, viewportClamp })` | writes `top/left` + `data-side` on a `position: fixed` element, and `data-clamped` while it is pushed on screen (an arrow should hide); the maths is the pure `computeAnchoredPosition` (`@/shared/hooks/anchoredPosition`) |
| `useScrollLock(active)`, `useIsClient()` | modal scroll lock (pads the body by the hidden scrollbar and sets `--scroll-lock-gap` for fixed bars); hydration flag |
| `useLingering(open, exitMs)` | `@/shared/hooks/useLingering`: true for `exitMs` after `open` turns false, so an overlay can play its leave animation (light Tooltip, Modal, Schedule's E2E banner) |
| `useOnScreenKeyboard()` | `@/shared/hooks/useOnScreenKeyboard`: true while a text field has focus and the visual viewport is >150px shorter than the layout viewport (phone keyboard); `isOnScreenKeyboardOpen()`, `subscribeOnScreenKeyboard(cb)` |
| `useDocumentTitle(title \| null, delayMs = 0)` | `@/shared/hooks/useDocumentTitle`: data-dependent `document.title` while mounted ("Error - Zoom", "My Meetings - Zoom"; the launch page's delayed second title), restored on unmount |

### Lib — `src/shared/lib/`

- **API** (`@/shared/lib/api`): `apiFetch<T>(path, { method, body, query, signal })` → JSON; throws `ApiError { status, code, message }`
  (`{"error":{code,message}}`, FastAPI 422 → `VALIDATION_ERROR`, network → `NETWORK_ERROR`, status 0). `isApiError(e, code?)`.
  One function per endpoint (backend/README.md): `getMe`, `listUsers({q,limit})`, `listUpcomingMeetings(from?)`,
  `listDayMeetings(date, tz?)`, `listPreviousMeetings(limit)`, `getPmiMeeting`, `updatePmiMeeting`, `createInstantMeeting({use_pmi})`,
  `scheduleMeeting(body)`, `getMeeting({number,id})`, `updateMeeting(ref, body)`, `deleteMeeting(ref)`, `getMeetingInvitation(ref)`,
  `validateMeeting(number, pwd)`, `startMeeting(number, body, id?)`, `joinMeeting(number, body)`, `endMeeting(number, {token})`,
  `getInstance(uuid)`, `meetingSocketUrl(number, token)`. `queryKeys` — shared TanStack keys
  (invalidate `queryKeys.meetings.all` after any meeting mutation). `createQueryClient()` — 4xx never retried.
  Invitation (`@/shared/lib/api/invitation`, the one cache entry per meeting): `useMeetingInvitation(ref, { enabled })` (Meetings
  tab block, portal Copy Invitation dialog, room Invite window) and `useInvitationActions()` → `{ prefetch(ref), copy(ref) → Promise<boolean> }`
  (Home PMI submenu and calendar card, Meetings Copy Invitation). `useCurrentUser()` (`@/shared/lib/api/useCurrentUser`) —
  `{ user, isLoading, isError }` from `GET /api/me` (seeded fallback if the backend is down; header, Home, Schedule, portal, room).
  `queryKeys.users(q, limit)` keys the limit too (Contacts 50 vs the 8-user lookups).
- **Types**: `shared/types/api.ts` mirrors `backend/app/schemas` 1:1 (snake_case: `User`, `Meeting`, `MeetingListItem`,
  `InstanceListItem`, `Participant`, `ParticipantRecord`, `InstanceDetail`, `ScheduleRequest`, `MeetingSession`, `MeetingValidation`,
  `ApiErrorCode`…). `shared/types/realtime.ts` mirrors the WebSocket protocol (`ClientMessage`, `ServerMessage`, `HostCommand`;
  `welcome.participants` excludes `self`; SDP is a plain string).
- **`format.ts`**: `formatMeetingNumber` (9 → 3-3-3, 10 → 3-3-4, 11 → 3-4-4), `formatClockTime` (`11:06 PM`), `formatLongDate`
  (`Wednesday, October 7`), `formatTimeRange`, `meetingWindow(startIso, minutes)` → `{ start, end }`, `relativeDayName(date, now, names?)`
  (`Today` / `Tomorrow` / `Yesterday` or null; the Meetings group headers pick their names), `formatRelativeDayLabel` (`Today, Oct 7` /
  `Tomorrow, …` / `Yesterday, …` / `Fri, Oct 9`), `parseApiDate`, `toDateKey`, `getBrowserTimeZone`.
- **`calendar.ts`**: `parseDateKey`, `parseDateKeyOrNull` (strict, for URL params), `WEEKDAYS`, `monthGrid(month)` (42 days, Sunday first) — the date-table model behind `DayGrid`.
- **`identity.ts`**: `getClientId()` (UUID in `localStorage['zc.client_id']`). The pre-join's remembered name lives in `features/join`.
  `storage.ts`: `STORAGE_KEYS` (`zc.client_id`, `zc.display_name`, `zc.join_history`), `readStorage`, `writeStorage`, `subscribeStorage`.
- **`routes.ts`**: `routes.home()`, `.joinShortcut()`, `.meetings({tab, select})`, `.teamChat()`, `.contacts()`, `.preJoin(n, {pwd, fromPWA})`,
  `.start(n, {fromPWA})`, `.room(n, {fromPWA})`, `.left(n)`, `.schedule()`, `.meetingDetail(n, {id})`, `.meetingEdit(n, {id})`;
  `FROM_PWA_PARAM`.
- **`env.ts`**: `env.apiUrl`, `env.wsUrl`, `env.plan`, `env.turn`, `getAppUrl()`.
- **`avatar.ts`**: `getInitials`, `pickWorkplaceAvatarColor`, `pickMeetingAvatarColor`, `avatarColorFromHex`. `useMergedRef(a, b)` (`mergeRefs.ts`).

### Shell & portal integration (`@/features/shell`, `@/features/portal`)

- `WorkplaceShell` — header + rail + 1280×694 card (`calc(100vw − 86px) × calc(100vh − 74px)`); pages fill the card
  (`display: flex; flex-direction: column`, `overflow: hidden` — scroll inside your page). While the bell is pressed the
  card's column shrinks (946 at 1366) for the docked Activity Center (6px resize handle + 328px panel, 328–600 wide), so
  pages must not assume the card is `100vw − 86px` wide. ⌘K / Ctrl+K opens the static Search dialog unless another
  `aria-modal` dialog is open (and closes the profile menu / History popover). **Phones (≤767) [D]:** 56px header, a
  full-bleed card and a 56px bottom tab bar instead of the rail (`--shell-card-*` follow); Search, Settings, About,
  profile and Activity Center open as full-screen sheets. Heights use `100dvh`, and the chrome pads by
  `env(safe-area-inset-*)` (`viewport-fit=cover` on the Workplace routes). Prefer container queries over viewport media
  queries for page layouts inside the card.
- `useShellMeetingPresence(active)` — in-shell room: avatar shows "In a meeting", no rail tab selected.
- `useRailNavigationGuard(guard)` — `guard(href) => boolean`; return false to cancel a rail click (End/Leave popover first).
- `PortalShell` — fixed 104px header, 300px side menu (Meetings selected), content column at x=332 (`padding: 32px`,
  `32px 24px` ≤1279, `16px` ≤1023). The page scrolls with the document; a sticky bar should use `position: fixed; bottom: 0`
  (`StickyFooter`). Its root sets `--font-app: var(--font-portal)`, `letter-spacing: .42px` and tracking inheritance for
  form controls, and an `OverlayScope` gives the same (plus `--select-menu-z: 105`, under the header) to overlays — portal
  pages need no font or layer overrides of their own. The static zoom.us footer (`PortalFooter`, also exported) closes every
  portal page and Join's invalid-link page. Phones / touch: ☰ (≤1024) opens
  Zoom's navbar-collapse menu, the whole ≤1023 "Meetings" bar toggles the side menu, `html` gets scroll-padding for the
  fixed header and pinned bar, the focused field is kept above the on-screen keyboard, select menus get 44px rows and
  text fields 16px on touch phones; in phone landscape (≤500px tall) the header scrolls away.
- `usePortalHeaderOnly()` (`@/features/portal`) — while the calling component is mounted, `PortalShell` shows the header
  only (no side menu, no content padding), e.g. the invalid-meeting page (PRD §7.8.6).
- `DeleteMeetingModal` (`variant` pwa | portal) + `useDeleteMeetingFlow(ref, { onDeleted?, surface? })` (`@/features/meetings`) —
  the one "Delete Meeting" confirm (PRD §7.4.8, §7.8.5): Meetings tab, Home calendar card "…" menu, portal detail page.
- Also from `@/features/meetings`: `meetingRefOf(meeting)` / `startHref(ref)` (`?id=` for `uses_pmi` calendar entries; Home's
  calendar card uses them too), `useMeetingFromRoute(number)` + `MeetingLoadState` (detail / edit pages: not-found vs retry).

### Known gaps / deviations

- Portal text uses the Helvetica fallback of `"Almaden Sans"` (proprietary), so marketing-link widths differ by a few px.
- Static-UI-only controls (Admin Center, Download, Upgrade, profile rows, Help links, portal marketing links…) show the demo
  toast. The Search dialog, Activity Center and About modal are rendered but static: no search index (typing shows
  "No results"), no notifications (empty states), "Version: Clone 1.0".
