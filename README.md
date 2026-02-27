# IFL Full-Stack App (React + Python + SQLite)

## Repo structure

- `client/`: React + Vite frontend
- `server/app.py`: Python API server
- `server/data/`: SQLite data directory
- `Dockerfile`: single-image build for frontend + backend
- `.dockerignore`: optimized Docker build context
- `deploy/azure/`: Azure deployment examples and configs

## Local development

```bash
cd /Users/ankitmohapatra/Desktop/IFL
npm install
```

Run backend:

```bash
npm run dev:server
```

Run frontend:

```bash
npm run dev:client
```

Open [http://localhost:5173](http://localhost:5173).

## API endpoints

- `GET /api/health`
- `GET /api/bootstrap`
- `GET /api/store/:key`
- `PUT /api/store/:key`

Valid keys:

- `ifl_users`
- `ifl_master_players`
- `ifl_master_matches`
- `ifl_match_stats`
- `ifl_allowed_phones`

## SQLite schema

Auto-created on startup in `server/data/ifl.sqlite3`:

- `users`
- `players`
- `matches`
- `user_players`
- `predictions`

## Build container image

```bash
docker build -t ifl-fullstack:latest .
docker run --rm -p 4000:4000 -e PORT=4000 -e DB_PATH=/data/ifl.sqlite3 ifl-fullstack:latest
```

Open [http://localhost:4000](http://localhost:4000).

## Azure deployment

See:

- `deploy/azure/README.md`
- `deploy/azure/containerapp.yaml`
- `deploy/azure/webapp-settings.txt`

These include commands for:

- Azure Container Registry (ACR) image build/push
- Azure Container Apps deployment
- Azure App Service (Web App for Containers) deployment

## Runtime env vars

- `PORT` (default `4000`)
- `DB_PATH` (default `/data/ifl.sqlite3` in container; `server/data/ifl.sqlite3` locally)

## Squad refresh (best-effort from IPL teams pages)

One-time updater script:

```bash
python3 server/scripts/update_squads_from_iplt20.py
```

It refreshes `ifl_master_players` and remaps user squad selections by player name where possible.
