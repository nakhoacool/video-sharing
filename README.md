# Video Sharing App

Full-stack video sharing platform. Users register, log in, and share YouTube links. Real-time notifications via WebSockets alert all connected users when new video shared.

**Stack:** Rails 8 API (PostgreSQL, JWT auth, Action Cable) + React 19 + TypeScript frontend.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Ruby | 4.0.3 |
| Rails | ~> 8.1.3 |
| Node.js | 20+ |
| npm | 10+ |
| PostgreSQL | 16+ |
| Docker & Docker Compose | 24+ / 2.20+ |

---

## Installation & Configuration

### 1. Clone

```bash
git clone <repository-url>
cd video_sharing
```

### 2. API dependencies

```bash
cd api
bundle install
```

### 3. Client dependencies

```bash
cd ../client
npm install
```

### 4. Environment configuration

API reads DB connection from env vars. Create `api/.env` (or export in shell):

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=yourpassword
ALLOWED_ORIGINS=http://localhost:5173
```

CORS allowed origins must match client dev URL (`http://localhost:5173` by default).

Generate Rails credentials master key if missing:

```bash
cd api
bin/rails credentials:edit
```

---

## Database Setup

```bash
cd api

# Create databases
bin/rails db:create

# Run migrations
bin/rails db:migrate

# Seed sample data (optional — 3 users + sample videos)
bin/rails db:seed
```

Seed credentials:
- Emails: `alice@example.com`, `bob@example.com`, `carol@example.com`
- Password (all): `password123`

---

## Running the Application

### API server

```bash
cd api
bin/rails server
# Runs on http://localhost:3000
```

### Client dev server

```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

Open `http://localhost:5173` in browser.

### Test suite

**API (RSpec):**

```bash
cd api
bundle exec rspec
```

**Client (Vitest):**

```bash
cd client
npm run test
```

---

## Docker Deployment

Requires `RAILS_MASTER_KEY` from `api/config/master.key`.

### Build & run all services

```bash
# From project root
RAILS_MASTER_KEY=$(cat api/config/master.key) docker compose up --build
```

Services started:
- `db` — PostgreSQL 16 on internal network
- `api` — Rails app (port 80 internal)
- `client` — React app via Nginx (port **80** → host)

Access app at `http://localhost`.

### Run migrations in container

```bash
docker compose exec api bin/rails db:migrate
docker compose exec api bin/rails db:seed   # optional
```

### Stop

```bash
docker compose down
# To also remove DB volume:
docker compose down -v
```

---

## Usage

1. **Register** — create account with name, email, password.
2. **Login** — authenticate; JWT stored client-side.
3. **Share video** — paste YouTube URL with title and optional description. Validates YouTube URL format.
4. **Video feed** — paginated list of all shared videos, newest first.
5. **Real-time notifications** — all logged-in users receive a toast notification when any user shares a new video (Action Cable WebSocket).

### API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/auth/register` | Register new user |
| `POST` | `/api/v1/auth/login` | Login, returns JWT |
| `GET` | `/api/v1/videos` | List all videos |
| `POST` | `/api/v1/videos` | Share a video (auth required) |
| `GET` | `/up` | Health check |

Authenticated requests require header: `Authorization: Bearer <token>`

---

## Troubleshooting

**`PG::ConnectionBad` on API start**
- PostgreSQL not running or env vars wrong. Verify `DATABASE_HOST`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`.

**`CORS` errors in browser**
- `ALLOWED_ORIGINS` env var must match exact client origin (include protocol + port). No trailing slash.

**`Migrations pending` error**
- Run `bin/rails db:migrate` (local) or `docker compose exec api bin/rails db:migrate` (Docker).

**`master.key` missing / `ActiveSupport::MessageEncryptor::InvalidMessage`**
- `api/config/master.key` not present. Regenerate: `bin/rails credentials:edit` or obtain from team.

**WebSocket connection fails**
- Ensure `ALLOWED_ORIGINS` includes client origin. In Docker, client and API communicate via internal network; no extra config needed.

**Docker port 80 already in use**
- Change host port in `docker-compose.yml`: `"8080:80"` under `client.ports`.

**`bundle install` fails on `pg` gem**
- PostgreSQL client libs required. macOS: `brew install libpq`. Ubuntu: `sudo apt-get install libpq-dev`.
