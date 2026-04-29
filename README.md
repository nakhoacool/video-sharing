# Video Sharing App

A full-stack platform where users register, log in, and share YouTube links. Real-time WebSocket notifications (Action Cable) alert all connected users when a new video is posted.

**Stack:** Rails 8 API · PostgreSQL · JWT auth · Action Cable · React 19 · TypeScript

---

## Live Demo

Deployed on **Render.com**: <https://video-sharing-client-m4ya.onrender.com/>

> **Note:** The app runs on Render's free tier and spins down after inactivity. The first request after a period of no use may take **30–60 seconds** to respond while the server wakes up. Subsequent requests will be fast.

---

## Features

| Feature | Details |
|---------|---------|
| Register & login | JWT stored client-side; required for sharing videos |
| Share a video | Paste a YouTube URL with title and optional description; URL format is validated |
| Video feed | Paginated list of all shared videos, newest first |
| Live notifications | All logged-in users receive a toast via WebSocket when any user shares a new video |

---

## Prerequisites

| Tool | Version |
|------|---------|
| Ruby | 4.0.3 |
| Rails | ~> 8.1.3 |
| Node.js | 22+ |
| npm | 10+ |
| PostgreSQL | 16+ |
| Docker | 29+ |
| Docker Compose | 5.0+ |

---

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/nakhoacool/video-sharing.git
cd video_sharing
```

### 2. Install dependencies

```bash
# API
cd api && bundle install

# Client
cd ../client && npm install
```

### 3. Start PostgreSQL

The easiest way is via Docker:

```bash
docker run --name postgres \
  -e POSTGRES_PASSWORD=<your-db-password> \
  -d -p 5432:5432 postgres
```

> **Note:** The default user is `postgres`. To use a custom user, add `-e POSTGRES_USER=<username>` to the command.

### 4. Set environment variables

The API reads its database connection from shell variables. Export these before starting the server:

```bash
export DATABASE_HOST=localhost
export DATABASE_PORT=5432
export DATABASE_USERNAME=<your-db-username>
export DATABASE_PASSWORD=<your-db-password>
export ALLOWED_ORIGINS=http://localhost:5173
```

> **CORS:** `ALLOWED_ORIGINS` must exactly match the client origin — include protocol and port, no trailing slash.

### 5. Generate Rails credentials

```bash
# Run from api/ with env vars already exported
cd api
rm -f config/credentials.yml.enc config/master.key
bin/rails credentials:edit
```

> This creates a new `master.key`. Keep it safe — you'll need it for Docker deployment.

### 6. Set up the database

```bash
# Run from api/ with env vars already exported
cd api && bin/rails db:prepare
```

Three seed accounts are created (password: `password123` for all):

- `alice@example.com`
- `bob@example.com`
- `carol@example.com`

### 7. Run the app

Open two terminals:

```bash
# Terminal 1 — API server (http://localhost:3000)
# Run with env vars already exported
cd api && bin/rails server

# Terminal 2 — Client dev server (http://localhost:5173)
cd client && npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Running Tests

```bash
# API — RSpec (run from api/ with env vars exported)
cd api && bundle exec rspec

# Client — Vitest
cd client && npm run test
```

---

## Docker Deployment

You need the `RAILS_MASTER_KEY` from `api/config/master.key` before building.

```bash
# From project root
cp .env.example .env
```

Edit `.env` and set:

```env
RAILS_MASTER_KEY=<value from api/config/master.key>
```

Then build and start all services:

```bash
docker compose up --build -d
```

Access the app at `http://localhost`.

| Service | Description |
|---------|-------------|
| `db` | PostgreSQL 16 on internal network |
| `api` | Rails app (port 80, internal) |
| `client` | React via Nginx → host port 80 |

```bash
# Stop services
docker compose down

# Stop and remove the DB volume
docker compose down -v
```

---

## API Reference

All authenticated endpoints require the header:

```
Authorization: Bearer <token>
```

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/auth/register` | — | Register a new user |
| `POST` | `/api/v1/auth/login` | — | Login; returns JWT |
| `GET` | `/api/v1/videos` | — | List all videos |
| `POST` | `/api/v1/videos` | ✓ | Share a video |
| `GET` | `/up` | — | Health check |

---

## Troubleshooting

**`PG::ConnectionBad` on API start**

PostgreSQL is not running or the env vars are wrong. Verify `DATABASE_HOST`, `DATABASE_USERNAME`, and `DATABASE_PASSWORD`, and confirm the container is up with `docker ps`.

---

**CORS errors in browser**

`ALLOWED_ORIGINS` must be an exact match for the client origin — protocol, host, and port, with no trailing slash.

---

**`ActiveSupport::MessageEncryptor::InvalidMessage`**

The master key is missing or mismatched. Regenerate credentials:

```bash
cd api
rm -f config/credentials.yml.enc config/master.key
bin/rails credentials:edit
```

---

**WebSocket connection fails**

Ensure `ALLOWED_ORIGINS` includes the client origin. In Docker, the client and API communicate over the internal network — no extra configuration is needed.

---

**Live demo is slow on first load**

The app runs on Render's free tier and spins down after inactivity. The first request after a long idle period may take 30–60 seconds while the server wakes up. Subsequent requests will be fast.
