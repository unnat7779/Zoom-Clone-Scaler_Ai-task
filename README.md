# Zoom Workplace Clone

A pixel-faithful clone of the **Zoom Workplace web app** (`app.zoom.us`) — dashboard, instant meetings, join by ID or invite link, scheduling, and a real multi-party video meeting with host controls — built for the Scaler SDE Fullstack assignment.

| | |
|---|---|
| **Live app** | https://frontend-bay-beta-22.vercel.app |
| **API** | https://zoom-clone-api-gk6q.onrender.com — OpenAPI docs at [`/docs`](https://zoom-clone-api-gk6q.onrender.com/docs) |
| **Repository** | https://github.com/unnat7779/Zoom-Clone-Scaler_Ai-task |
| **Spec** | [`PRD.md`](PRD.md) — every screen measured from the real Zoom web app at 1366×768 |
| **New to the code?** | Start with [`walkthrough.md`](walkthrough.md) — a beginner-friendly guide to navigating the codebase |

> Not affiliated with Zoom Communications, Inc. Zoom's name, logo and icons are used only to reproduce its UI for this educational assignment.

## Features

| Area | What works |
|---|---|
| **Dashboard** (`/wc/home`) | Zoom Workplace shell (header with profile/settings placeholders, left rail), live clock, **New meeting / Join / Schedule** buttons, per-day **Upcoming meetings** widget, **Recent meetings** card |
| **Instant meeting** | Unique 11-digit meeting ID, passcode, shareable invite link (`/j/{id}?pwd=…`), straight into the room as host. Optional "Use my Personal Meeting ID". |
| **Join** | Join modal (meeting ID or invite link, live ID formatting, history), dark pre-join page with camera/mic preview, display name, passcode, meeting-existence validation ("This meeting link is invalid (3,001)") and waiting-for-host state |
| **Schedule** | Zoom web-portal style form: topic, description, date picker, time, duration, time zone, meeting ID, passcode, waiting room, video and meeting options → stored in SQLite → shown in Upcoming; meeting detail, edit and delete |
| **Meetings tab** | Upcoming / Previous lists, PMI card, detail with Start, Copy Invitation, Edit, Delete |
| **Meeting room** | Real audio/video over WebRTC (mesh, up to 8), speaker & gallery views, active-speaker ring, mute/video, device selection, participants panel, meeting info + invite link copy, leave / end for all, host transfer |
| **Host controls** (bonus) | Mute All, mute a participant, remove a participant |
| **Responsive** (bonus) | Zoom's own breakpoints (1080 / 1024 / 768) on desktop/tablet; on phones a Zoom-styled bottom tab bar, full-screen sheets, touch-size targets and a full-screen meeting room — tested on iPhone/Android/iPad sizes in portrait and landscape |

Zoom UI outside the assignment's scope (chat, reactions, screen share, AI, search, calendar connect…) is rendered pixel-for-pixel but is static.

## Tech stack

- **Frontend:** Next.js (App Router) + React + TypeScript, CSS Modules with Zoom's real design tokens, TanStack Query, WebRTC.
- **Backend:** Python, FastAPI, SQLAlchemy 2, Pydantic v2, WebSockets (signalling, roster, host controls).
- **Database:** SQLite.

## Architecture

```
Browser (Next.js SPA)
 ├─ REST  → FastAPI /api/*                      → SQLite
 ├─ WS    → FastAPI /ws/meetings/{number}?token= (signalling, roster, host commands)
 └─ WebRTC peer-to-peer mesh between participants (STUN)
```

```
frontend/src/
  app/            thin routes
  features/       shell · portal · home · join · meetings · schedule · meeting-room (+ realtime)
  shared/         ui (common components) · styles (tokens.css) · icons · hooks · media · lib · types
backend/app/
  core/ models/ schemas/ repositories/ services/ routers/ realtime/  seed.py
```

## Database schema

```
users 1─* meetings 1─* meeting_instances 1─* participants
             └─* meeting_invitees
```

- **meetings** — a meeting *definition* (instant, scheduled or the user's PMI): topic, description, start time, duration, time zone, passcode, invite token, options; soft-deleted.
- **meeting_instances** — each actual *occurrence* (a PMI can run many times); at most one live instance per meeting (partial unique index). Recent/Previous meetings are built from ended instances.
- **participants** — one browser entry into an instance: role (host/attendee), status, media state, join/leave times.
- **meeting_invitees** — emails attached to a scheduled meeting.

Details (constraints, indexes, API, WebSocket protocol): [`backend/README.md`](backend/README.md) and [`PRD.md` §9–§10](PRD.md).

## Run locally

Requirements: Node 20+ and Python 3.12+.

```bash
# backend (http://localhost:8000, seeds the database on first start)
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements-dev.txt
.venv/bin/uvicorn app.main:app --reload --port 8000
```

```bash
# frontend (http://localhost:3000)
cd frontend
cp .env.example .env.local      # points at http://localhost:8000
npm install
npm run dev
```

Tests and checks: `cd backend && .venv/bin/pytest && .venv/bin/ruff check .` (90 tests) · `cd frontend && npm test && npm run lint && npx tsc --noEmit && npm run build` (477 unit tests, see [`docs/TESTING.md`](docs/TESTING.md)).

To try a real call, start a meeting in one browser and join it from a **different browser, device or a private window** with the meeting ID or invite link. Two tabs of the same browser share one client id, so the second tab takes over the first session — exactly like Zoom's "You have joined this meeting on another device".

> The backend runs on Render's free plan: after ~15 minutes of inactivity it sleeps, so the first request can take up to a minute while it wakes up. Data is re-seeded on every start.

## Deployment

- **Backend:** Render web service, free plan (`render.yaml`, root `backend/`, `uvicorn app.main:app --host 0.0.0.0 --port $PORT`). Env: `FRONTEND_ORIGIN` and `APP_URL` = the frontend URL, a random `SECRET_KEY`, `PYTHON_VERSION=3.12.7`, `SEED_ON_START=reset`.
- **Frontend:** Vercel project with root `frontend/` (`frontend/vercel.json` pins the Next.js framework) and `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_WS_URL` (`wss://…`), `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_PLAN=pro`.

## Assumptions

- **No login**: a seeded default user ("Alex Morgan") is always signed in. Because every browser is that user, the **role comes from the entry path**: *New meeting* / *Start* → host; *Join* / invite link → attendee.
- Data is seeded on first start (upcoming meetings relative to "today", past meetings with participants). On free hosting the SQLite file is ephemeral, so data resets on redeploy.
- Video uses a WebRTC **mesh** (best for ≤ 8 people) with public STUN only; very restrictive networks would need a TURN server.
- The UI mimics a Zoom **Pro** account's schedule form (hours selectable) so the Duration field is fully usable.
- Screens were measured from the real Zoom web app at 1366×768; see `PRD.md` and `docs/requirements/` for every value and the deliberate deviations (e.g. the Recent meetings section the assignment asks for).
