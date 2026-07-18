# Task Manager — Full-Stack Application

A full-stack Task Manager built with **React** (Vite), **Express**, and **MySQL**.  
Designed from day one for Docker Compose containerization and Kubernetes/EKS deployment.

---

## Architecture

```
┌─────────────┐       HTTP/JSON        ┌─────────────┐       TCP/3306       ┌─────────────┐
│   Frontend   │  ───────────────────▶  │   Backend    │  ───────────────▶  │   MySQL DB   │
│  React/Vite  │       (CORS)          │   Express    │    mysql2/promise   │   8.0+       │
│  Port 3000   │  ◀───────────────────  │   Port 5000  │  ◀───────────────  │   Port 3306  │
└─────────────┘                        └─────────────┘                     └─────────────┘
```

Each service runs as an independent process — no shared code, no cross-imports.

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MySQL 8.0+ running locally (or via Docker: `docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=rootpassword mysql:8.0`)

### 1. Initialize the database

```bash
mysql -u root -p < db/init.sql
```

### 2. Start the backend

```bash
cd backend
cp .env.example .env   # or use the provided .env
npm install
npm run dev            # nodemon — auto-restarts on changes
```

The API will be available at `http://localhost:5000/api/tasks`.  
Health check: `http://localhost:5000/health`

### 3. Start the frontend

```bash
cd frontend
cp .env.example .env   # or use the provided .env
npm install
npm run dev            # Vite dev server on port 3000
```

Open `http://localhost:3000` in your browser.

---

## API Reference

| Method   | Endpoint          | Description                          |
|----------|-------------------|--------------------------------------|
| `GET`    | `/api/tasks`      | List all tasks (filter: `?status=`)  |
| `GET`    | `/api/tasks/:id`  | Get a single task                    |
| `POST`   | `/api/tasks`      | Create a new task                    |
| `PUT`    | `/api/tasks/:id`  | Update a task                        |
| `DELETE` | `/api/tasks/:id`  | Delete a task                        |
| `GET`    | `/health`         | Health check (includes DB status)    |

### Task Resource

```json
{
  "id": 1,
  "title": "Build REST API",
  "description": "Implement CRUD routes for tasks",
  "status": "in-progress",
  "due_date": "2026-07-20",
  "created_at": "2026-07-18T10:00:00.000Z",
  "updated_at": "2026-07-18T12:30:00.000Z"
}
```

**Status values:** `todo`, `in-progress`, `done`

---

## Environment Variables

### Backend (`backend/.env`)

| Variable        | Default          | Description                                      |
|-----------------|------------------|--------------------------------------------------|
| `PORT`          | `5000`           | Server listen port                               |
| `DB_HOST`       | `localhost`      | MySQL host (change to service name in Compose)   |
| `DB_PORT`       | `3306`           | MySQL port                                       |
| `DB_USER`       | `root`           | MySQL user                                       |
| `DB_PASSWORD`   | `rootpassword`   | MySQL password (**use K8s Secrets in prod**)      |
| `DB_NAME`       | `taskmanager`    | MySQL database name                              |
| `CORS_ORIGIN`   | `*`              | Allowed CORS origin (set to frontend URL in prod)|

### Frontend (`frontend/.env`)

| Variable              | Default                   | Description                          |
|-----------------------|---------------------------|--------------------------------------|
| `VITE_API_BASE_URL`   | `http://localhost:5000`   | Backend API base URL                 |

---

## Containerization Notes

When you're ready to write Dockerfiles and a `docker-compose.yml`, here's what to know:

### Frontend
- **Build**: Multi-stage — `node:18-alpine` for build, `nginx:alpine` to serve
- **VITE_API_BASE_URL is baked at build time** by Vite. For Docker Compose, pass it as a build arg. For Kubernetes, consider a runtime config injection strategy:
  - Option A: Entrypoint script that writes `window.__RUNTIME_CONFIG__` to a JS file
  - Option B: Fetch a `config.json` from a ConfigMap-mounted path at app startup
- **Port**: Expose 80 (nginx) or 3000 (dev server)

### Backend
- **Build**: Single-stage `node:18-alpine`, copy source, `npm ci --omit=dev`
- **Port**: Expose `$PORT` (default 5000) — maps to a K8s Service
- **DB connection retries**: Already implemented in `src/config/db.js` — handles slow MySQL startup
- **Health endpoint**: `GET /health` is ready for Docker `healthcheck` and K8s liveness/readiness probes

### Database
- **Image**: `mysql:8.0`
- **Init script**: Mount `db/init.sql` to `/docker-entrypoint-initdb.d/init.sql`
- **Persistent volume**: Mount a named volume to `/var/lib/mysql`
- **Healthcheck**: `mysqladmin ping -h localhost`
- **Environment**: `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE=taskmanager`

### Docker Compose `environment:` mapping

```yaml
# Example (do NOT create this file yet)
services:
  backend:
    environment:
      - DB_HOST=db            # ← service name, not localhost
      - DB_PORT=3306
      - DB_USER=root
      - DB_PASSWORD=rootpassword
      - DB_NAME=taskmanager
      - CORS_ORIGIN=*
    ports:
      - "5000:5000"

  frontend:
    build:
      args:
        - VITE_API_BASE_URL=http://localhost:5000   # ← host-facing URL
    ports:
      - "3000:80"

  db:
    volumes:
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
      - mysql_data:/var/lib/mysql
```

### Kubernetes migration
- Backend port → `Service` (ClusterIP internally, NodePort/LoadBalancer/Ingress for external)
- DB credentials → `Secret` (not ConfigMap)
- Frontend API URL → `ConfigMap` (injected at runtime, not build time)
- MySQL → Consider managed RDS instead of a StatefulSet for production

---

## Project Structure

```
cloud-app/
├── frontend/              # React app (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/    # TaskCard, TaskForm, TaskList, etc.
│   │   ├── api/           # Fetch-based API client
│   │   ├── App.jsx        # Main app component
│   │   ├── App.css        # Component styles
│   │   ├── index.css      # Design tokens + global styles
│   │   └── main.jsx       # React entry point
│   ├── .env
│   ├── package.json
│   └── vite.config.js
├── backend/               # Express REST API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js      # MySQL connection pool
│   │   ├── routes/
│   │   │   └── tasks.js   # CRUD route handlers
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   └── index.js       # Server entry point
│   ├── .env
│   └── package.json
├── db/
│   └── init.sql           # Schema + seed data
└── README.md
```
