# IFL Fantasy League - Current Functionalities

This document lists the functionalities currently implemented in the project.

## 1) Authentication and Access

- User login and registration are based on **phone number** (unique identifier).
- Registration requires:
  - phone number
  - password
  - fantasy team name
- Login requires:
  - phone number
  - password
- Only phone numbers in admin-managed allowlist can register/login.
- Admin authentication is separate (admin username/password).

## 2) Admin Access Control

- Admin page includes **Access** module:
  - add allowed phone numbers
  - remove allowed phone numbers
- If phone is not in allowed list:
  - user cannot register
  - user cannot login

## 3) User Team Workflow

- Users can build squad from master player pool.
- Squad constraints:
  - max 20 players
  - max 8 overseas players
- User can **Submit Team**.
- Squad lifecycle states:
  - Draft
  - Submitted
  - Validated
  - Frozen
- If Frozen:
  - user cannot modify squad until admin unfreezes.

## 4) Admin User Controls

- Admin can view all users and their metadata.
- Admin actions per user:
  - Validate team
  - Freeze team
  - Unfreeze team
  - Reset status to draft
  - Remove user

## 5) Players Management (Admin)

- Manage master player sheet:
  - add player
  - edit player
  - delete player
  - filter by team, role, search

## 6) Match Management (Admin)

- Manage match schedule:
  - add match
  - edit match
  - delete match
  - set/clear winner

## 7) Match Scoring Management (Admin)

- Admin **Scoring** module to enter per-match player stats:
  - runs
  - catches
  - runouts/stumpings
  - wickets
  - man of the match
- Save/Clear scoring data per match.
- Recalculates all users’ points after scoring updates.

## 8) Points and Leaderboard Logic

- Leaderboard points are cumulative from:
  - prediction points
  - individual selected-player match points
  - man-of-the-match bonus
- Current prediction rule:
  - correct winner prediction = +50
  - wrong winner prediction = 0
- Individual player scoring:
  - run = 1
  - catch = 5
  - runout/stumping = 10
  - wicket = 20
  - 3 wickets bonus = +25
  - 5 wickets bonus = +50
  - 50 runs bonus = +25
  - 75 runs bonus = +50
  - 100 runs bonus = +100
  - man of the match = +50 (if selected in user squad)
- Recalculation occurs on:
  - app load
  - user updates (predictions/squad)
  - admin match winner updates
  - admin scoring updates
  - relevant admin user actions

## 9) User Views

- Build Team
- My Team
- Predictions
- Leaderboard
- Profile
- My Team includes **match-wise player points breakdown** showing per-match contribution.

## 10) Squad Data Refresh

- One-time script added for best-effort IPL squad refresh:
  - `server/scripts/update_squads_from_iplt20.py`
- Updates master players and remaps existing user squads by player name where possible.

## 11) Backend and Data Storage

- Backend implemented in Python (`server/app.py`).
- API endpoints:
  - `GET /api/health`
  - `GET /api/bootstrap`
  - `GET /api/store/:key`
  - `PUT /api/store/:key`
- SQLite database with tables:
  - `users`
  - `players`
  - `matches`
  - `user_players`
  - `predictions`
  - `store_kv` (for additional persisted keys)
- Persisted store keys:
  - `ifl_users`
  - `ifl_master_players`
  - `ifl_master_matches`
  - `ifl_match_stats`
  - `ifl_allowed_phones`

## 12) Deployment and Containerization

- Multi-stage `Dockerfile` for full app image.
- `.dockerignore` for lean build context.
- Azure deployment assets included under `deploy/azure`:
  - Container Apps and Web App references/commands.
