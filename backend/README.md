# Zoom Workplace Clone — backend

FastAPI + SQLAlchemy 2.0 + Pydantic v2 + SQLite. REST API under `/api`, WebSocket signalling under
`/ws/meetings/{number}`, OpenAPI docs at **`/docs`**. Spec: `PRD.md` §9–§10 at the repo root.

## Run

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements-dev.txt        # runtime deps only: requirements.txt
.venv/bin/uvicorn app.main:app --reload --port 8000  # creates data/zoom.db and seeds it if empty
```

| Command | What it does |
|---|---|
| `.venv/bin/python -m app.seed` | create tables, seed only if the database is empty |
| `.venv/bin/python -m app.seed --reset` | drop everything and seed again (times are relative to "now") |
| `.venv/bin/pytest` | run the test suite (88 tests, ~1 s) |
| `.venv/bin/ruff check . && .venv/bin/ruff format --check .` | lint + format check |

Production: `uvicorn app.main:app --host 0.0.0.0 --port $PORT` (one process: the room registry is
in memory).

### Environment

| Variable | Default | Purpose |
|---|---|---|
| `DATABASE_URL` | `sqlite:///<backend>/data/zoom.db` | SQLAlchemy URL |
| `FRONTEND_ORIGIN` | `http://localhost:3000,http://localhost:3100…3103` | CORS allow-list (comma-separated) |
| `APP_URL` | `http://localhost:3000` | frontend origin used in invite links (`{APP_URL}/j/{number}?pwd=…`) |
| `SECRET_KEY` | dev value | signs participant tokens — **set it in production** |
| `SEED_ON_START` | `if-empty` | `if-empty` \| `reset` (reseed every boot, keeps "today" fresh) \| `off` |
| `SEED_USER_NAME`, `SEED_USER_EMAIL` | Alex Morgan, alex.morgan@example.com | the default user |

## Layout

```
app/
  main.py          app factory: routers, CORS, error envelope, startup (tables, seed, stale-instance
                   recovery, janitor)
  core/            config (env), db (engine/session, PRAGMA foreign_keys=ON), security (participant
                   tokens), errors ({"error": {code, message}}), clock
  models/          one ORM model per file + enums + column types (UTC text timestamps, 0/1 booleans)
  schemas/         Pydantic request/response models per resource
  repositories/    database queries only
  services/        business logic: meetings, meeting_queries (upcoming/day/previous), entry
                   (validate/start/join/end), participants (in-meeting state, host transfer, host
                   commands), instances (lifecycle/cleanup), id_generator, formatting, timezones,
                   invitation, presenters (ORM → schema)
  routers/         thin HTTP/WS handlers
  realtime/        protocol (typed messages), room_manager, connection, hub (socket lifecycle),
                   handlers (relay, media state, host commands), welcome, janitor
  seed.py, seed_data.py
tests/             pytest + Starlette TestClient
```

## Data model (PRD §10.1)

```
users 1─* meetings 1─* meeting_instances 1─* participants
             └─* meeting_invitees
```

| Table | Purpose | Key rules |
|---|---|---|
| `users` | accounts; id 1 is the seeded default user, the rest are contacts | `email`, `pmi` unique; `CHECK length(pmi)=10` |
| `meetings` | a meeting **definition**: scheduled, instant or the PMI | `type IN ('instant','scheduled','pmi')`; scheduled ⇒ `start_time`; `uses_pmi` ⇒ scheduled; topic 1–200, description ≤ 2000, passcode 1–10 or NULL, duration 0–1440; soft delete via `deleted_at`; partial unique indexes: one owner per number (`WHERE uses_pmi = 0`), one PMI per host (`WHERE type='pmi'`); `(host_id, start_time) WHERE deleted_at IS NULL` |
| `meeting_invitees` | emails invited to a scheduled meeting (stored only) | `UNIQUE(meeting_id, email)`, cascade delete |
| `meeting_instances` | one actual **occurrence** (a PMI runs many times) | `uuid` unique; **one live instance per meeting** (`UNIQUE(meeting_id) WHERE ended_at IS NULL`); Mute-All settings `allow_unmute`, `mute_on_entry` |
| `participants` | one browser entry (`client_id`) into an instance | role `host`/`attendee`, status `in_meeting`/`left`/`removed`, media state, join/leave times; `user_id` set for host-path entries, NULL for guests (`ON DELETE SET NULL`) |

All timestamps are UTC ISO-8601 `TEXT` (`2026-10-08T05:30:00.000Z`), booleans `INTEGER` 0/1,
`PRAGMA foreign_keys = ON` on every connection. Derived (never stored): *live* = instance with
`ended_at IS NULL`; *upcoming*, *day* and *previous* views per §10.1.

**Number resolution.** `GET/PATCH/DELETE /api/meetings/{number}` address the non-deleted owner row
(`uses_pmi = 0`), or `?id=` for a `uses_pmi` calendar entry. Join-by-number goes to whichever row
sharing the number has the live instance, else the owner. Only one live instance may exist per number.

## REST API (`/api`, JSON snake_case, errors `{"error": {"code", "message"}}`)

| Method & path | Body / query | Response | Errors |
|---|---|---|---|
| `GET /api/health` | — | `{ok: true}` | |
| `GET /api/me` | — | `User` | |
| `GET /api/users` | `?q=&limit=8` | `User[]` (other users) | |
| `GET /api/meetings` | `?view=upcoming[&from=ISO]` · `?view=day&date=YYYY-MM-DD[&tz=IANA]` · `?view=previous[&limit=50]` | `MeetingListItem[]` / `InstanceListItem[]` | 422 |
| `POST /api/meetings` | `ScheduleRequest` | `201 Meeting` | 422 (`Topic is required`, `The start time has already passed`, …) |
| `GET /api/meetings/pmi` · `PATCH /api/meetings/pmi` | `{passcode?, waiting_room?, join_before_host?, mute_upon_entry?, host_video_on?, participant_video_on?}` | `Meeting` | 409 `MEETING_LIVE` |
| `POST /api/meetings/instant` | `{use_pmi?}` | `201 {meeting, invite_url, start_url}` (meeting has a live instance) | |
| `GET /api/meetings/{number}` | `?id=` | `Meeting` | 404 `MEETING_NOT_FOUND` (also when deleted) |
| `PATCH /api/meetings/{number}` | partial `ScheduleRequest` (no `use_pmi`), `?id=` | `Meeting` | 400 `NOT_SCHEDULED`, 409 `MEETING_LIVE`, 422 |
| `DELETE /api/meetings/{number}` | `?id=` | `204` (soft delete) | 400 `PMI_NOT_DELETABLE`, 409 `MEETING_LIVE` |
| `GET /api/meetings/{number}/invitation` | `?id=` | `{text}` (CRLF, PRD §10.5) | 404 |
| `GET /api/meetings/{number}/validate` | `?pwd=` | `{exists, topic, is_live, has_host, requires_passcode, passcode_ok, join_before_host, start_time, duration_minutes, participant_video_on, mute_upon_entry}` | never 404 — `exists: false` |
| `POST /api/meetings/{number}/start` | `{client_id, display_name}`, `?id=` | `{participant, token, instance_id}` | 403 `REMOVED`, 404, 409 `MEETING_FULL` |
| `POST /api/meetings/{number}/join` | `{client_id, display_name, pwd?, passcode?, audio_muted, video_on}` | `{participant, token, instance_id}` | 404 `MEETING_NOT_FOUND`, 403 `WRONG_PASSCODE`, 409 `MEETING_NOT_STARTED`, 409 `MEETING_FULL`, 403 `REMOVED` |
| `POST /api/meetings/{number}/end` | `{token}` | `204` | 401 `UNAUTHORIZED`, 403 `NOT_HOST` |
| `GET /api/instances/{uuid}` | — | `{instance: InstanceListItem, meeting: Meeting \| null, participants: ParticipantRecord[]}` | 404 `INSTANCE_NOT_FOUND` |

Shapes (see `/docs` for the full schemas):
- `User` = `{id, display_name, email, pmi, pmi_formatted, timezone, avatar_color, initials}`
- `Meeting` = `{id, meeting_number, type, uses_pmi, topic, description, start_time, duration_minutes,
  timezone, time_label, passcode, invite_url, waiting_room, join_before_host, mute_upon_entry,
  host_video_on, participant_video_on, is_recurring, host_id, host_name, is_live, invitees,
  created_at, updated_at}`
- `MeetingListItem` = `{id, meeting_number, type, uses_pmi, topic, start_time, duration_minutes,
  timezone, host_name, is_live, has_instance, has_host}` — never a passcode; for a live
  instant/PMI meeting `start_time` is when it started
- `InstanceListItem` = `{uuid, meeting_id, meeting_number, type, uses_pmi, topic, host_name,
  started_at, ended_at, duration_minutes, participant_count, meeting_exists}`
- `Participant` = `{id, display_name, role, is_guest, audio_muted, video_on, joined_at}`
- `ScheduleRequest` = `{topic, description?, start_local: "2026-10-08T11:00", timezone,
  duration_minutes, is_recurring?, use_pmi?, passcode? (omitted → random, null → none), waiting_room?,
  join_before_host? (true), mute_upon_entry?, host_video_on? (true), participant_video_on? (true),
  invitees?: string[]}`

**Roles by entry path (PRD §3).** `start` makes the caller host unless another browser already
hosts the live instance (a second tab of the same browser keeps the host role); `join` always enters
as attendee (`is_guest: true`). A not-live meeting with `join_before_host` opens a host-less instance
on join; the next `start` becomes host. Mesh cap: 8 browsers per instance.

## WebSocket `/ws/meetings/{number}?token=…` (PRD §9)

The token comes from `start`/`join`. On connect the server sends `welcome` first, then tells everyone
else `participant_joined`. Every message is JSON `{"type": …}`.

| Direction | type | payload |
|---|---|---|
| → server | `offer` / `answer` | `{to, sdp}` (SDP text) |
| → server | `ice` | `{to, candidate}` (`RTCIceCandidateInit` or null) |
| → server | `media_state` | `{audio_muted, video_on}` |
| → server | `leave` · `ping` (every 20 s) | — |
| → server | `host_command` | `{command: "mute_all", allow_unmute}` · `{command: "mute", target}` · `{command: "remove", target}` |
| ← client | `welcome` | `{self, participants (everyone connected except self), meeting: {number, topic, host_name, invite_url, passcode, numeric_passcode, start_time, duration_minutes}, settings: {allow_unmute, mute_on_entry}}` |
| ← client | `participant_joined` / `participant_updated` | `{participant}` (a `participant_joined` for a known id means it reconnected) |
| ← client | `participant_left` | `{participant_id, reason: left \| removed \| disconnected}` |
| ← client | `offer` / `answer` / `ice` | same as sent, plus `from` |
| ← client | `host_changed` | `{host_id, previous_host_id}` |
| ← client | `force_mute` · `removed` | `{by}` |
| ← client | `settings_updated` | `{allow_unmute, mute_on_entry}` |
| ← client | `meeting_ended` | `{by}` (host participant id; null when the token's meeting already ended) |
| ← client | `error` | `{code: UNAUTHORIZED \| REMOVED \| DUPLICATE_SESSION \| NOT_HOST \| BAD_MESSAGE, message}` |
| ← client | `pong` | — |

Lifecycle: a second socket of the same `client_id` displaces the older one (`DUPLICATE_SESSION`,
close 4409); a socket silent for 45 s is closed (4408) and reported as `disconnected`; when the host
leaves, the earliest-joined connected attendee becomes host (`host_changed`); host commands are
authorised server-side (`NOT_HOST`); after Mute All without "allow unmute", an attendee's unmute is
refused (`NOT_HOST`) and their state stays muted; a removed browser cannot rejoin that instance
(`REMOVED`). A janitor marks never-connected participants `left` after 60 s and ends instances that
have been empty for 30 s; instances left live by a previous process are ended at startup. Messages are
rate limited per socket (20/s, burst 100).

## Seed data (PRD §10.6)

Alex Morgan (id 1, PMI generated, waiting room on) + 5 contacts; 7 scheduled meetings from today to
+9 days (relative to the seed time in Asia/Kolkata); 6 ended instances (2–6 participants) for
Previous / Recent, whose scheduled rows show on the Home day view as past "joined" cards.
