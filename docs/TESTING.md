# Tests

## Frontend (`frontend/`)

Unit tests use [Vitest](https://vitest.dev) (+ `@testing-library/react` and `jsdom` for the hook and storage tests).

```bash
cd frontend
npm test                          # vitest run (all *.test.ts[x] under src/)
npx vitest                        # watch mode
npx vitest run src/features/schedule   # one folder
```

Add `npm test` to the frontend quality gates next to `npm run lint`, `npx tsc --noEmit` and `npm run build`.

**Conventions**

- Test files sit next to the code: `foo.ts` → `foo.test.ts`. Import `describe` / `it` / `expect` / `vi` from `vitest` (no globals).
- Tests run in **`TZ=America/New_York`** (set in `vitest.config.mts` and checked in `vitest.setup.ts`), so local-day and DST cases
  behave the same on every machine. Build local dates with `new Date(y, m - 1, d, h, min)` and API instants with `…Z` strings.
- The default environment is `node`. Files that need `window`, `localStorage` or React put `// @vitest-environment jsdom` on their
  first line. `localStorage` / `sessionStorage` are cleared and real timers restored after every test; mocks, stubbed globals
  (`vi.stubGlobal`) and env vars (`vi.stubEnv`) are restored automatically.
- Prefer table-driven tests of pure functions (`it.each`). Use `vi.useFakeTimers()` / `vi.setSystemTime()` for anything time-based.
- Known bugs are recorded as `it.todo(...)` with a comment, so they show up in every run without failing it.

**What is covered**

| Area | Files |
|---|---|
| Shared lib | `format` (meeting numbers, clock/date/range, relative day labels around midnight, DST and year ends), `calendar` (6 × 7 month grid across DST, date keys), `routes`, `storage` + `identity`, `joinHistory` (dedupe, cap 20, malformed data), `meetingSession`, `api/client` (error envelope, 422, network, abort) |
| Shared UI | `DayGrid` (cell labels, selected / today / outside / disabled states, tab stop) |
| Home | `joinInput` (progressive formatting, 9–11 digits, link names, pasted invite URLs with `pwd`), `useJoinMeetingInput`, `eventCard` (15-minute windows), `dayKey` |
| Join | `joinErrors` (error code → form message / page), `preJoinStage` |
| Schedule | `zonedTime` (wall clock ⇄ instant, DST gap and overlap, half-hour zones), `time` (typed-time parsing, filter, 12/24 h), `timeZones`, `formValues` (create/edit/PATCH/PMI body), `calendar` (decades), `DatePickerPanel` (past days disabled), `useScheduleValidation` (5-minute tolerance) |
| Meetings | `notice`, `grouping` |
| Meeting room | `roomReducer`, `roomUiReducer`, `messageHandler` (fake peers/client), `signalingClient` (fake WebSocket: 1/2/4/8/8 s backoff, heartbeat, terminal codes), `galleryLayout`, `speakerLayout`, `toolbarOverflow`, `participantRows`, `leftPage` |

Not covered yet: components (apart from `DayGrid` and the Schedule `DatePickerPanel`), `PeerManager` / media hooks (need WebRTC and `getUserMedia` fakes) and the TanStack Query hooks.

## Backend (`backend/`)

```bash
cd backend && .venv/bin/pytest -q
```
