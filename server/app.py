#!/usr/bin/env python3
import json
import mimetypes
import os
import sqlite3
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT_DIR / "server" / "data"
DB_PATH = Path(os.getenv("DB_PATH", str(DATA_DIR / "ifl.sqlite3")))
PORT = int(os.getenv("PORT", "4000"))
CLIENT_DIST = ROOT_DIR / "client" / "dist"

VALID_KEYS = {"ifl_users", "ifl_master_players", "ifl_master_matches", "ifl_match_stats", "ifl_allowed_phones"}


def get_conn():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    with get_conn() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              username TEXT NOT NULL UNIQUE,
              password TEXT NOT NULL,
              team_name TEXT NOT NULL,
              points INTEGER NOT NULL DEFAULT 0,
              created_at TEXT NOT NULL DEFAULT (datetime('now')),
              updated_at TEXT NOT NULL DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS players (
              id INTEGER PRIMARY KEY,
              team TEXT NOT NULL,
              name TEXT NOT NULL,
              role TEXT NOT NULL,
              country TEXT NOT NULL,
              created_at TEXT NOT NULL DEFAULT (datetime('now')),
              updated_at TEXT NOT NULL DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS matches (
              id INTEGER PRIMARY KEY,
              match_date TEXT NOT NULL,
              team_a TEXT NOT NULL,
              team_a_abbr TEXT NOT NULL,
              team_b TEXT NOT NULL,
              team_b_abbr TEXT NOT NULL,
              venue TEXT NOT NULL,
              winner TEXT,
              created_at TEXT NOT NULL DEFAULT (datetime('now')),
              updated_at TEXT NOT NULL DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS user_players (
              user_id INTEGER NOT NULL,
              player_id INTEGER NOT NULL,
              created_at TEXT NOT NULL DEFAULT (datetime('now')),
              PRIMARY KEY (user_id, player_id),
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
              FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS predictions (
              user_id INTEGER NOT NULL,
              match_id INTEGER NOT NULL,
              pick TEXT NOT NULL,
              is_correct INTEGER,
              points_awarded INTEGER NOT NULL DEFAULT 0,
              created_at TEXT NOT NULL DEFAULT (datetime('now')),
              updated_at TEXT NOT NULL DEFAULT (datetime('now')),
              PRIMARY KEY (user_id, match_id),
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
              FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS store_kv (
              key TEXT PRIMARY KEY,
              value_json TEXT NOT NULL,
              updated_at TEXT NOT NULL DEFAULT (datetime('now'))
            );
            """
        )


def _bool_from_db(value):
    if value is None:
        return None
    return bool(value)


def read_store():
    with get_conn() as conn:
        players = [
            {
                "id": int(r["id"]),
                "team": r["team"],
                "name": r["name"],
                "role": r["role"],
                "country": r["country"],
            }
            for r in conn.execute(
                "SELECT id, team, name, role, country FROM players ORDER BY id"
            )
        ]

        matches = [
            {
                "id": int(r["id"]),
                "date": r["match_date"],
                "teamA": r["team_a"],
                "teamAabbr": r["team_a_abbr"],
                "teamB": r["team_b"],
                "teamBabbr": r["team_b_abbr"],
                "venue": r["venue"],
                "winner": r["winner"] or "",
            }
            for r in conn.execute(
                """
                SELECT id, match_date, team_a, team_a_abbr, team_b, team_b_abbr, venue, winner
                FROM matches
                ORDER BY match_date, id
                """
            )
        ]

        users = {}
        users_by_id = {}
        for r in conn.execute(
            "SELECT id, username, password, team_name, points FROM users ORDER BY username"
        ):
            u = {
                "password": r["password"],
                "teamName": r["team_name"],
                "players": [],
                "points": int(r["points"] or 0),
                "predictions": {},
            }
            users[r["username"]] = u
            users_by_id[int(r["id"])] = u

        for r in conn.execute(
            "SELECT user_id, player_id FROM user_players ORDER BY user_id, player_id"
        ):
            u = users_by_id.get(int(r["user_id"]))
            if u is not None:
                u["players"].append(int(r["player_id"]))

        for r in conn.execute(
            "SELECT user_id, match_id, pick, is_correct, points_awarded FROM predictions ORDER BY user_id, match_id"
        ):
            u = users_by_id.get(int(r["user_id"]))
            if u is None:
                continue
            u["predictions"][str(r["match_id"])] = {
                "pick": r["pick"],
                "correct": _bool_from_db(r["is_correct"]),
                "pts": int(r["points_awarded"] or 0),
            }

        stats_row = conn.execute(
            "SELECT value_json FROM store_kv WHERE key = ?", ("ifl_match_stats",)
        ).fetchone()
        match_stats = {}
        if stats_row is not None:
            try:
                parsed = json.loads(stats_row["value_json"])
                if isinstance(parsed, dict):
                    match_stats = parsed
            except Exception:
                match_stats = {}

        phones_row = conn.execute(
            "SELECT value_json FROM store_kv WHERE key = ?", ("ifl_allowed_phones",)
        ).fetchone()
        allowed_phones = []
        if phones_row is not None:
            try:
                parsed = json.loads(phones_row["value_json"])
                if isinstance(parsed, list):
                    allowed_phones = [str(x) for x in parsed]
            except Exception:
                allowed_phones = []

    return {
        "ifl_users": users,
        "ifl_master_players": players,
        "ifl_master_matches": matches,
        "ifl_match_stats": match_stats,
        "ifl_allowed_phones": allowed_phones,
    }


def write_key(key, value):
    with get_conn() as conn:
        conn.execute("BEGIN")
        now = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

        if key == "ifl_master_players":
            players = value if isinstance(value, list) else []
            conn.execute("DELETE FROM players")
            for p in players:
                conn.execute(
                    """
                    INSERT INTO players (id, team, name, role, country, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        int(p.get("id", 0)),
                        str(p.get("team", "")),
                        str(p.get("name", "")),
                        str(p.get("role", "")),
                        str(p.get("country", "India")),
                        now,
                        now,
                    ),
                )
            conn.execute(
                "DELETE FROM user_players WHERE player_id NOT IN (SELECT id FROM players)"
            )
            conn.commit()
            return

        if key == "ifl_master_matches":
            matches = value if isinstance(value, list) else []
            conn.execute("DELETE FROM matches")
            for m in matches:
                winner = m.get("winner")
                winner_val = str(winner) if winner else None
                conn.execute(
                    """
                    INSERT INTO matches (id, match_date, team_a, team_a_abbr, team_b, team_b_abbr, venue, winner, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        int(m.get("id", 0)),
                        str(m.get("date", "")),
                        str(m.get("teamA", "")),
                        str(m.get("teamAabbr", "")),
                        str(m.get("teamB", "")),
                        str(m.get("teamBabbr", "")),
                        str(m.get("venue", "")),
                        winner_val,
                        now,
                        now,
                    ),
                )
            conn.execute(
                "DELETE FROM predictions WHERE match_id NOT IN (SELECT id FROM matches)"
            )
            conn.commit()
            return

        if key == "ifl_users":
            users = value if isinstance(value, dict) else {}
            conn.execute("DELETE FROM predictions")
            conn.execute("DELETE FROM user_players")
            conn.execute("DELETE FROM users")

            user_id_map = {}
            for username, user in users.items():
                cur = conn.execute(
                    """
                    INSERT INTO users (username, password, team_name, points, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    (
                        str(username),
                        str(user.get("password", "")),
                        str(user.get("teamName", "Untitled Team")),
                        int(user.get("points", 0) or 0),
                        now,
                        now,
                    ),
                )
                user_id_map[username] = int(cur.lastrowid)

            for username, user in users.items():
                uid = user_id_map.get(username)
                if uid is None:
                    continue

                for pid in user.get("players", []) or []:
                    conn.execute(
                        "INSERT OR IGNORE INTO user_players (user_id, player_id, created_at) VALUES (?, ?, ?)",
                        (uid, int(pid), now),
                    )

                predictions = user.get("predictions", {}) or {}
                for match_id, pred in predictions.items():
                    corr = pred.get("correct")
                    if corr is None:
                        corr_val = None
                    else:
                        corr_val = 1 if bool(corr) else 0
                    conn.execute(
                        """
                        INSERT OR REPLACE INTO predictions (user_id, match_id, pick, is_correct, points_awarded, created_at, updated_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                        """,
                        (
                            uid,
                            int(match_id),
                            str(pred.get("pick", "")),
                            corr_val,
                            int(pred.get("pts", 0) or 0),
                            now,
                            now,
                        ),
                    )

            conn.commit()
            return

        if key in {"ifl_match_stats", "ifl_allowed_phones"}:
            if key == "ifl_match_stats":
                payload = value if isinstance(value, dict) else {}
            else:
                payload = [str(x) for x in value] if isinstance(value, list) else []
            conn.execute(
                """
                INSERT INTO store_kv (key, value_json, updated_at)
                VALUES (?, ?, ?)
                ON CONFLICT(key) DO UPDATE SET
                  value_json = excluded.value_json,
                  updated_at = excluded.updated_at
                """,
                (key, json.dumps(payload), now),
            )
            conn.commit()
            return

        conn.rollback()
        raise ValueError(f"Invalid key: {key}")


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def _send_json(self, status_code, payload):
        data = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,PUT,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(data)

    def _send_file(self, file_path: Path):
        body = file_path.read_bytes()
        content_type, _ = mimetypes.guess_type(str(file_path))
        self.send_response(200)
        self.send_header("Content-Type", content_type or "application/octet-stream")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,PUT,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/api/health":
            self._send_json(200, {"ok": True})
            return

        if path == "/api/bootstrap":
            try:
                self._send_json(200, {"store": read_store()})
            except Exception as exc:
                self._send_json(500, {"error": "Failed to bootstrap store", "details": str(exc)})
            return

        if path.startswith("/api/store/"):
            key = path.replace("/api/store/", "", 1)
            if key not in VALID_KEYS:
                self._send_json(400, {"error": f"Invalid key: {key}"})
                return
            try:
                store = read_store()
                self._send_json(200, {"value": store.get(key)})
            except Exception as exc:
                self._send_json(500, {"error": "Failed to load store value", "details": str(exc)})
            return

        # Static serving for production build
        if CLIENT_DIST.exists():
            relative = path.lstrip("/") or "index.html"
            target = (CLIENT_DIST / relative).resolve()
            if str(target).startswith(str(CLIENT_DIST.resolve())) and target.is_file():
                self._send_file(target)
                return
            index_file = CLIENT_DIST / "index.html"
            if index_file.is_file():
                self._send_file(index_file)
                return

        self._send_json(404, {"error": "Not found"})

    def do_PUT(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if not path.startswith("/api/store/"):
            self._send_json(404, {"error": "Not found"})
            return

        key = path.replace("/api/store/", "", 1)
        if key not in VALID_KEYS:
            self._send_json(400, {"error": f"Invalid key: {key}"})
            return

        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length) if length > 0 else b"{}"
        try:
            payload = json.loads(raw.decode("utf-8"))
            value = payload.get("value")
        except Exception:
            self._send_json(400, {"error": "Invalid JSON body"})
            return

        try:
            write_key(key, value)
            self._send_json(200, {"ok": True})
        except Exception as exc:
            self._send_json(500, {"error": "Failed to persist store value", "details": str(exc)})


def run():
    init_db()
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print(f"IFL Python server running on http://localhost:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    run()
