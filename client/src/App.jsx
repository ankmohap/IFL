import { useState, useEffect, useCallback } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const ADMIN_CREDENTIALS = { username: "admin", password: "ifl@2019" };

const DEFAULT_PLAYERS = [
  { id: 1, team: "CSK", name: "MS Dhoni", role: "WK", country: "India" },
  { id: 2, team: "CSK", name: "Suresh Raina", role: "BAT", country: "India" },
  { id: 3, team: "CSK", name: "Faf du Plessis", role: "BAT", country: "SA" },
  { id: 4, team: "CSK", name: "Ambati Rayudu", role: "BAT", country: "India" },
  { id: 5, team: "CSK", name: "Shane Watson", role: "ALL", country: "AUS" },
  { id: 6, team: "CSK", name: "Kedar Jadhav", role: "ALL", country: "India" },
  { id: 7, team: "CSK", name: "R Jadeja", role: "ALL", country: "India" },
  { id: 8, team: "CSK", name: "Dwayne Bravo", role: "ALL", country: "WI" },
  { id: 9, team: "CSK", name: "Imran Tahir", role: "BOWL", country: "SA" },
  { id: 10, team: "CSK", name: "Harbhajan Singh", role: "BOWL", country: "India" },
  { id: 11, team: "CSK", name: "Deepak Chahar", role: "BOWL", country: "India" },
  { id: 12, team: "CSK", name: "Sam Billings", role: "WK", country: "ENG" },
  { id: 13, team: "MI", name: "Rohit Sharma", role: "BAT", country: "India" },
  { id: 14, team: "MI", name: "Hardik Pandya", role: "ALL", country: "India" },
  { id: 15, team: "MI", name: "Kieron Pollard", role: "ALL", country: "WI" },
  { id: 16, team: "MI", name: "Quinton de Kock", role: "WK", country: "SA" },
  { id: 17, team: "MI", name: "Jasprit Bumrah", role: "BOWL", country: "India" },
  { id: 18, team: "MI", name: "Lasith Malinga", role: "BOWL", country: "SL" },
  { id: 19, team: "MI", name: "Suryakumar Yadav", role: "BAT", country: "India" },
  { id: 20, team: "MI", name: "Ishan Kishan", role: "WK", country: "India" },
  { id: 21, team: "RCB", name: "Virat Kohli", role: "BAT", country: "India" },
  { id: 22, team: "RCB", name: "AB de Villiers", role: "WK", country: "SA" },
  { id: 23, team: "RCB", name: "Chris Gayle", role: "BAT", country: "WI" },
  { id: 24, team: "RCB", name: "Yuzvendra Chahal", role: "BOWL", country: "India" },
  { id: 25, team: "RCB", name: "Dale Steyn", role: "BOWL", country: "SA" },
  { id: 26, team: "RCB", name: "Marcus Stoinis", role: "ALL", country: "AUS" },
  { id: 27, team: "RCB", name: "Parthiv Patel", role: "WK", country: "India" },
  { id: 28, team: "KKR", name: "Dinesh Karthik", role: "WK", country: "India" },
  { id: 29, team: "KKR", name: "Andre Russell", role: "ALL", country: "WI" },
  { id: 30, team: "KKR", name: "Sunil Narine", role: "ALL", country: "WI" },
  { id: 31, team: "KKR", name: "Shubman Gill", role: "BAT", country: "India" },
  { id: 32, team: "KKR", name: "Kuldeep Yadav", role: "BOWL", country: "India" },
  { id: 33, team: "SRH", name: "David Warner", role: "BAT", country: "AUS" },
  { id: 34, team: "SRH", name: "Jonny Bairstow", role: "WK", country: "ENG" },
  { id: 35, team: "SRH", name: "Kane Williamson", role: "BAT", country: "NZ" },
  { id: 36, team: "SRH", name: "Rashid Khan", role: "BOWL", country: "AFG" },
  { id: 37, team: "SRH", name: "Bhuvneshwar Kumar", role: "BOWL", country: "India" },
  { id: 38, team: "SRH", name: "Vijay Shankar", role: "ALL", country: "India" },
  { id: 39, team: "DC", name: "Rishabh Pant", role: "WK", country: "India" },
  { id: 40, team: "DC", name: "Shikhar Dhawan", role: "BAT", country: "India" },
  { id: 41, team: "DC", name: "Shreyas Iyer", role: "BAT", country: "India" },
  { id: 42, team: "DC", name: "Kagiso Rabada", role: "BOWL", country: "SA" },
  { id: 43, team: "DC", name: "Axar Patel", role: "ALL", country: "India" },
  { id: 44, team: "RR", name: "Sanju Samson", role: "WK", country: "India" },
  { id: 45, team: "RR", name: "Jos Buttler", role: "WK", country: "ENG" },
  { id: 46, team: "RR", name: "Ben Stokes", role: "ALL", country: "ENG" },
  { id: 47, team: "RR", name: "Jofra Archer", role: "BOWL", country: "ENG" },
  { id: 48, team: "RR", name: "Steve Smith", role: "BAT", country: "AUS" },
  { id: 49, team: "KXIP", name: "Lokesh Rahul", role: "WK", country: "India" },
  { id: 50, team: "KXIP", name: "Chris Gayle", role: "BAT", country: "WI" },
  { id: 51, team: "KXIP", name: "David Miller", role: "BAT", country: "SA" },
  { id: 52, team: "KXIP", name: "R Ashwin", role: "ALL", country: "India" },
  { id: 53, team: "KXIP", name: "Mohammed Shami", role: "BOWL", country: "India" },
  { id: 54, team: "KXIP", name: "Mayank Agarwal", role: "BAT", country: "India" },
];

const DEFAULT_MATCHES = [
  { id: 1, date: "2019-03-23", teamA: "Chennai Super Kings", teamAabbr: "CSK", teamB: "Royal Challengers Bangalore", teamBabbr: "RCB", venue: "Chennai", winner: "CSK" },
  { id: 2, date: "2019-03-24", teamA: "Kolkata Knight Riders", teamAabbr: "KKR", teamB: "Sunrisers Hyderabad", teamBabbr: "SRH", venue: "Kolkata", winner: "KKR" },
  { id: 3, date: "2019-03-24", teamA: "Mumbai Indians", teamAabbr: "MI", teamB: "Delhi Capitals", teamBabbr: "DC", venue: "Mumbai", winner: "MI" },
  { id: 4, date: "2019-03-25", teamA: "Rajasthan Royals", teamAabbr: "RR", teamB: "Kings XI Punjab", teamBabbr: "KXIP", venue: "Jaipur", winner: "KXIP" },
  { id: 5, date: "2019-03-26", teamA: "Royal Challengers Bangalore", teamAabbr: "RCB", teamB: "Mumbai Indians", teamBabbr: "MI", venue: "Bangalore", winner: "RCB" },
  { id: 6, date: "2019-03-27", teamA: "Delhi Capitals", teamAabbr: "DC", teamB: "Chennai Super Kings", teamBabbr: "CSK", venue: "Delhi", winner: "DC" },
  { id: 7, date: "2019-03-28", teamA: "Sunrisers Hyderabad", teamAabbr: "SRH", teamB: "Rajasthan Royals", teamBabbr: "RR", venue: "Hyderabad", winner: "SRH" },
  { id: 8, date: "2019-03-29", teamA: "Kings XI Punjab", teamAabbr: "KXIP", teamB: "Kolkata Knight Riders", teamBabbr: "KKR", venue: "Mohali", winner: "KKR" },
  { id: 9, date: "2019-03-30", teamA: "Chennai Super Kings", teamAabbr: "CSK", teamB: "Mumbai Indians", teamBabbr: "MI", venue: "Chennai", winner: "CSK" },
  { id: 10, date: "2019-03-31", teamA: "Delhi Capitals", teamAabbr: "DC", teamB: "Sunrisers Hyderabad", teamBabbr: "SRH", venue: "Delhi", winner: "DC" },
  { id: 11, date: "2019-04-01", teamA: "Royal Challengers Bangalore", teamAabbr: "RCB", teamB: "Kolkata Knight Riders", teamBabbr: "KKR", venue: "Bangalore", winner: "" },
  { id: 12, date: "2019-04-02", teamA: "Rajasthan Royals", teamAabbr: "RR", teamB: "Mumbai Indians", teamBabbr: "MI", venue: "Jaipur", winner: "" },
];

const IPL_TEAM_COLORS = {
  CSK: { bg: "#f5a623", text: "#1a1a2e" }, MI: { bg: "#004BA0", text: "#fff" },
  RCB: { bg: "#D41A1A", text: "#fff" }, KKR: { bg: "#3A225D", text: "#B3A123" },
  SRH: { bg: "#FF6B00", text: "#fff" }, DC: { bg: "#17479E", text: "#D71920" },
  RR: { bg: "#EA1A85", text: "#fff" }, KXIP: { bg: "#D71920", text: "#ccc" },
  PBKS: { bg: "#D71920", text: "#fff" }, GT: { bg: "#1C2C5B", text: "#fff" },
  LSG: { bg: "#00AEEF", text: "#1a1a1a" },
};
const ROLE_COLORS = { WK: "#f39c12", BAT: "#27ae60", BOWL: "#2980b9", ALL: "#8e44ad" };
const ROLE_LABELS = { WK: "Wicket Keeper", BAT: "Batsman", BOWL: "Bowler", ALL: "All-rounder" };
const ALL_IPL_TEAMS = [
  { name: "Chennai Super Kings", abbr: "CSK" }, { name: "Mumbai Indians", abbr: "MI" },
  { name: "Royal Challengers Bangalore", abbr: "RCB" }, { name: "Kolkata Knight Riders", abbr: "KKR" },
  { name: "Sunrisers Hyderabad", abbr: "SRH" }, { name: "Delhi Capitals", abbr: "DC" },
  { name: "Rajasthan Royals", abbr: "RR" }, { name: "Kings XI Punjab", abbr: "KXIP" },
  { name: "Punjab Kings", abbr: "PBKS" }, { name: "Gujarat Titans", abbr: "GT" },
  { name: "Lucknow Super Giants", abbr: "LSG" },
];

// ─── STORAGE (API-BACKED) ────────────────────────────────────────────────────
const STORE_DEFAULTS = {
  ifl_users: {},
  ifl_master_players: DEFAULT_PLAYERS,
  ifl_master_matches: DEFAULT_MATCHES,
  ifl_match_stats: {},
  ifl_allowed_phones: [],
};

let DB_CACHE = { ...STORE_DEFAULTS };

const normalizeStore = (store = {}) => ({
  ifl_users: store.ifl_users || {},
  ifl_master_players: Array.isArray(store.ifl_master_players) && store.ifl_master_players.length > 0
    ? store.ifl_master_players
    : DEFAULT_PLAYERS,
  ifl_master_matches: Array.isArray(store.ifl_master_matches) && store.ifl_master_matches.length > 0
    ? store.ifl_master_matches
    : DEFAULT_MATCHES,
  ifl_match_stats: store.ifl_match_stats && typeof store.ifl_match_stats === "object" ? store.ifl_match_stats : {},
  ifl_allowed_phones: Array.isArray(store.ifl_allowed_phones) ? store.ifl_allowed_phones.map(x => String(x)) : [],
});

async function bootstrapStore() {
  try {
    const r = await fetch("/api/bootstrap");
    if (!r.ok) throw new Error("bootstrap failed");
    const data = await r.json();
    const missingPlayers = !Array.isArray(data.store?.ifl_master_players) || data.store.ifl_master_players.length === 0;
    const missingMatches = !Array.isArray(data.store?.ifl_master_matches) || data.store.ifl_master_matches.length === 0;
    DB_CACHE = normalizeStore(data.store || {});
    if (missingPlayers) save("ifl_master_players", DB_CACHE.ifl_master_players);
    if (missingMatches) save("ifl_master_matches", DB_CACHE.ifl_master_matches);
  } catch {
    DB_CACHE = { ...STORE_DEFAULTS };
  }
}

const save = (k, v) => {
  DB_CACHE[k] = v;
  void fetch(`/api/store/${k}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value: v }),
  }).catch(() => {});
};

const load = (k, def) => (DB_CACHE[k] !== undefined ? DB_CACHE[k] : def);
const getPlayers = () => load("ifl_master_players", DEFAULT_PLAYERS);
const getMatches = () => load("ifl_master_matches", DEFAULT_MATCHES);
const getMatchStats = () => load("ifl_match_stats", {});
const getAllowedPhones = () => load("ifl_allowed_phones", []);
const normalizePhone = (v) => String(v || "").replace(/\D/g, "");
const isValidPhone = (v) => v.length >= 10 && v.length <= 15;

const POINT_RULES = {
  RUN: 1,
  CATCH: 5,
  RUNOUT_STUMPING: 10,
  WICKET: 20,
  BONUS_3_WICKETS: 25,
  BONUS_5_WICKETS: 50,
  BONUS_50_RUNS: 25,
  BONUS_75_RUNS: 50,
  BONUS_100_RUNS: 100,
  MAN_OF_MATCH: 50,
  MATCH_WINNER_PICK: 50,
};

const n = (v) => Math.max(0, Number(v) || 0);

function scorePlayerPerformance(stat = {}) {
  const runs = n(stat.runs);
  const catches = n(stat.catches);
  const runouts = n(stat.runouts);
  const wickets = n(stat.wickets);

  let bonusRuns = 0;
  if (runs >= 100) bonusRuns = POINT_RULES.BONUS_100_RUNS;
  else if (runs >= 75) bonusRuns = POINT_RULES.BONUS_75_RUNS;
  else if (runs >= 50) bonusRuns = POINT_RULES.BONUS_50_RUNS;

  let bonusWickets = 0;
  if (wickets >= 5) bonusWickets = POINT_RULES.BONUS_5_WICKETS;
  else if (wickets >= 3) bonusWickets = POINT_RULES.BONUS_3_WICKETS;

  return (
    runs * POINT_RULES.RUN +
    catches * POINT_RULES.CATCH +
    runouts * POINT_RULES.RUNOUT_STUMPING +
    wickets * POINT_RULES.WICKET +
    bonusRuns +
    bonusWickets
  );
}

function recomputeAndPersistUsers() {
  const users = JSON.parse(JSON.stringify(load("ifl_users", {})));
  const matches = getMatches();
  const matchStats = getMatchStats();

  Object.entries(users).forEach(([, user]) => {
    const squad = new Set((user.players || []).map(Number));
    const predictions = user.predictions || {};
    let totalPoints = 0;

    matches.forEach((match) => {
      const mid = String(match.id);
      const mStat = matchStats[mid] || {};
      const pStats = mStat.players || {};
      const pred = predictions[mid];
      let matchPoints = 0;

      if (match.winner) {
        if (pred?.pick) {
          const ok = pred.pick === match.winner;
          pred.correct = ok;
          pred.pts = ok ? POINT_RULES.MATCH_WINNER_PICK : 0;
          matchPoints += pred.pts;
        }
      } else if (pred) {
        pred.correct = null;
        pred.pts = 0;
      }

      Object.entries(pStats).forEach(([pid, stat]) => {
        if (squad.has(Number(pid))) matchPoints += scorePlayerPerformance(stat);
      });

      if (mStat.motmPlayerId && squad.has(Number(mStat.motmPlayerId))) {
        matchPoints += POINT_RULES.MAN_OF_MATCH;
      }

      totalPoints += matchPoints;
    });

    user.predictions = predictions;
    user.points = totalPoints;
  });

  save("ifl_users", users);
  return users;
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Barlow:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0a0e1a;--surface:#111827;--sf2:#1a2235;--border:#1e2d40;--acc:#f97316;--acc2:#3b82f6;--gold:#f5a623;--text:#e2e8f0;--muted:#64748b;--ok:#10b981;--err:#ef4444;--adm:#8b5cf6}
body{background:var(--bg);color:var(--text);font-family:'Barlow',sans-serif;min-height:100vh}
h1,h2,h3,h4{font-family:'Rajdhani',sans-serif;letter-spacing:.03em}

.btn{font-family:'Rajdhani',sans-serif;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border:none;cursor:pointer;padding:10px 22px;border-radius:4px;font-size:14px;transition:all .18s;display:inline-flex;align-items:center;gap:6px}
.btn-primary{background:var(--acc);color:#fff}.btn-primary:hover{background:#ea6c05;transform:translateY(-1px);box-shadow:0 4px 20px rgba(249,115,22,.4)}
.btn-secondary{background:var(--sf2);color:var(--text);border:1px solid var(--border)}.btn-secondary:hover{border-color:var(--acc);color:var(--acc)}
.btn-danger{background:var(--err);color:#fff}.btn-danger:hover{background:#dc2626;transform:translateY(-1px)}
.btn-adm{background:var(--adm);color:#fff}.btn-adm:hover{background:#7c3aed;transform:translateY(-1px);box-shadow:0 4px 20px rgba(139,92,246,.4)}
.btn-ok{background:var(--ok);color:#fff}
.btn-sm{padding:6px 14px;font-size:12px}.btn-xs{padding:4px 10px;font-size:11px}

.card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:20px}
.tag{font-size:10px;font-family:'Rajdhani',sans-serif;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:2px 8px;border-radius:3px}

input,select,textarea{background:var(--sf2);border:1px solid var(--border);color:var(--text);padding:10px 14px;border-radius:6px;font-family:'Barlow',sans-serif;font-size:14px;width:100%;outline:none;transition:border .2s}
input:focus,select:focus,textarea:focus{border-color:var(--acc)}
input::placeholder,textarea::placeholder{color:var(--muted)}
label{font-size:12px;font-family:'Rajdhani',sans-serif;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:5px}
.fg{margin-bottom:16px}
.fr{display:grid;gap:14px}.fr2{grid-template-columns:1fr 1fr}.fr3{grid-template-columns:1fr 1fr 1fr}
.fe{color:var(--err);font-size:12px;margin-top:4px}

.nav{background:rgba(10,14,26,.97);border-bottom:1px solid var(--border);backdrop-filter:blur(10px);position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:12px 28px;gap:10px;flex-wrap:wrap}
.nav-logo{font-family:'Rajdhani',sans-serif;font-size:24px;font-weight:700}
.nav-logo span{color:var(--acc)}.nav-logo .abadge{font-size:11px;background:var(--adm);color:#fff;padding:2px 8px;border-radius:3px;margin-left:8px;vertical-align:middle}
.nav-links{display:flex;gap:4px;flex-wrap:wrap}
.nav-link{font-family:'Rajdhani',sans-serif;font-weight:600;font-size:13px;letter-spacing:.07em;text-transform:uppercase;cursor:pointer;padding:7px 14px;border-radius:4px;transition:all .15s;color:var(--muted);border:1px solid transparent}
.nav-link:hover{color:var(--text);background:var(--surface);border-color:var(--border)}
.nav-link.ua{color:var(--acc);background:rgba(249,115,22,.08);border-color:var(--acc)}
.nav-link.aa{color:var(--adm);background:rgba(139,92,246,.08);border-color:var(--adm)}

.login-bg{min-height:100vh;display:flex;align-items:center;justify-content:center;background:radial-gradient(ellipse at 20% 60%,rgba(249,115,22,.08) 0%,transparent 60%),radial-gradient(ellipse at 80% 30%,rgba(59,130,246,.07) 0%,transparent 60%),var(--bg)}
.adm-login-bg{min-height:100vh;display:flex;align-items:center;justify-content:center;background:radial-gradient(ellipse at 30% 50%,rgba(139,92,246,.1) 0%,transparent 60%),radial-gradient(ellipse at 70% 30%,rgba(59,130,246,.07) 0%,transparent 60%),var(--bg)}
.lcard{width:430px}
.lhero{text-align:center;margin-bottom:32px}
.lhero h1{font-size:48px;font-weight:700;line-height:1}.lhero h1 span{color:var(--acc)}.lhero h1 span.p{color:var(--adm)}
.lhero p{color:var(--muted);margin-top:8px;font-size:15px}
.ltabs{display:flex;background:var(--sf2);border-radius:6px;padding:3px;margin-bottom:24px}
.ltab{flex:1;text-align:center;padding:8px;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:13px;letter-spacing:.07em;text-transform:uppercase;cursor:pointer;border-radius:4px;transition:all .2s;color:var(--muted)}
.ltab.active{background:var(--acc);color:#fff}
.lswitch{text-align:center;margin-top:14px;font-size:13px;color:var(--muted)}
.lswitch span{color:var(--adm);cursor:pointer;text-decoration:underline}

.hero-banner{background:linear-gradient(135deg,#0f1729 0%,#1a0a0a 100%);border-bottom:1px solid var(--border);padding:36px 28px;position:relative;overflow:hidden}
.hero-banner::before{content:'IPL';position:absolute;right:-20px;top:-20px;font-family:'Rajdhani',sans-serif;font-size:200px;font-weight:700;color:rgba(255,255,255,.02);line-height:1;pointer-events:none}
.hstats{display:flex;gap:32px;margin-top:20px;flex-wrap:wrap}
.hstat-v{font-family:'Rajdhani',sans-serif;font-size:36px;font-weight:700;color:var(--acc);line-height:1}
.hstat-l{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-top:2px}

.adm-hdr{background:linear-gradient(135deg,#0f0a1f 0%,#0a0e1a 100%);border-bottom:1px solid rgba(139,92,246,.2);padding:28px}

.page{padding:28px;max-width:1200px;margin:0 auto}
.pt{font-size:28px;font-weight:700;margin-bottom:4px}
.ps{color:var(--muted);font-size:14px;margin-bottom:24px}
.sh{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px}

.tw{background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden;overflow-x:auto}
table{width:100%;border-collapse:collapse}
th{font-family:'Rajdhani',sans-serif;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);padding:10px 14px;text-align:left;border-bottom:2px solid var(--border);white-space:nowrap}
td{padding:12px 14px;border-bottom:1px solid var(--border);font-size:14px;vertical-align:middle}
tr:last-child td{border-bottom:none}
tr:hover td{background:rgba(255,255,255,.02)}

.modal-ov{position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:200;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);padding:20px}
.modal{background:var(--surface);border:1px solid var(--border);border-radius:12px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto}
.modal-hdr{display:flex;align-items:center;justify-content:space-between;padding:20px 24px 0}
.modal-title{font-family:'Rajdhani',sans-serif;font-size:20px;font-weight:700}
.modal-x{cursor:pointer;color:var(--muted);font-size:24px;line-height:1}.modal-x:hover{color:var(--err)}
.modal-body{padding:20px 24px 24px}
.modal-ft{padding:0 24px 24px;display:flex;gap:10px;justify-content:flex-end}

.confirm-box{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:24px;max-width:380px;width:100%}
.confirm-title{font-family:'Rajdhani',sans-serif;font-size:18px;font-weight:700;margin-bottom:8px}
.confirm-text{color:var(--muted);font-size:14px;margin-bottom:20px}
.confirm-acts{display:flex;gap:10px;justify-content:flex-end}

.pgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}
.pc{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:14px;cursor:pointer;transition:all .18s;position:relative;overflow:hidden}
.pc:hover{border-color:var(--acc2);transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.3)}
.pc.sel{border-color:var(--acc);background:rgba(249,115,22,.06)}
.pc.sel::after{content:'✓';position:absolute;top:8px;right:10px;color:var(--acc);font-size:16px;font-weight:700}
.pname{font-family:'Rajdhani',sans-serif;font-size:16px;font-weight:600;margin:4px 0 8px}
.pteam{font-size:10px;font-family:'Rajdhani',sans-serif;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.pmeta{display:flex;gap:6px;flex-wrap:wrap}
.pfilters{display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;align-items:center}
.fbtn{font-family:'Rajdhani',sans-serif;font-weight:600;font-size:12px;letter-spacing:.07em;text-transform:uppercase;padding:6px 14px;border-radius:4px;cursor:pointer;border:1px solid var(--border);background:var(--sf2);color:var(--muted);transition:all .15s}
.fbtn.active{border-color:var(--acc);color:var(--acc);background:rgba(249,115,22,.1)}

.mc{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:18px 22px;display:flex;flex-direction:column;gap:14px}
.mc-hdr{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}
.mc-date{font-size:12px;color:var(--muted);font-family:'Rajdhani',sans-serif;letter-spacing:.07em;text-transform:uppercase}
.mc-teams{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.mc-badge{display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 18px;border-radius:8px;cursor:pointer;border:2px solid transparent;transition:all .18s;min-width:110px}
.mc-badge:hover{border-color:currentColor}
.mc-badge.sel{border-color:var(--gold);box-shadow:0 0 18px rgba(245,166,35,.25)}
.mc-badge.ok{border-color:var(--ok)}.mc-badge.err{border-color:var(--err);opacity:.6}
.mc-vs{font-family:'Rajdhani',sans-serif;font-size:14px;font-weight:700;color:var(--muted)}
.wbadge{background:rgba(16,185,129,.1);border:1px solid var(--ok);color:var(--ok);padding:4px 12px;border-radius:4px;font-size:12px;font-family:'Rajdhani',sans-serif;font-weight:700;letter-spacing:.07em;text-transform:uppercase}
.pbadge{background:rgba(100,116,139,.1);border:1px solid var(--muted);color:var(--muted);padding:4px 12px;border-radius:4px;font-size:12px;font-family:'Rajdhani',sans-serif;font-weight:700;letter-spacing:.07em;text-transform:uppercase}

.lb{display:flex;flex-direction:column;gap:10px}
.lbr{display:flex;align-items:center;gap:16px;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:14px 18px;transition:all .15s}
.lbr:hover{transform:translateX(4px)}
.lbrank{font-family:'Rajdhani',sans-serif;font-size:24px;font-weight:700;width:36px;text-align:center}
.lbrank.g{color:var(--gold)}.lbrank.s{color:#94a3b8}.lbrank.b{color:#cd7c3c}
.lbinfo{flex:1}
.lbname{font-family:'Rajdhani',sans-serif;font-size:17px;font-weight:600}
.lbsub{font-size:12px;color:var(--muted)}
.lbpts{font-family:'Rajdhani',sans-serif;font-size:22px;font-weight:700;color:var(--acc)}
.lbptsl{font-size:10px;color:var(--muted);text-align:right;letter-spacing:.07em;text-transform:uppercase}

.pbar{background:var(--sf2);border-radius:999px;height:6px;overflow:hidden}
.pfill{height:100%;background:var(--acc);border-radius:999px;transition:width .4s}
.avatar{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Rajdhani',sans-serif;font-size:26px;font-weight:700;flex-shrink:0;background:linear-gradient(135deg,var(--acc),var(--acc2))}
.prof-hdr{display:flex;align-items:center;gap:20px;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:22px;margin-bottom:24px}
.ptsbig{font-family:'Rajdhani',sans-serif;font-size:48px;font-weight:700;color:var(--acc);line-height:1}
.divider{height:1px;background:var(--border);margin:24px 0}
.empty{text-align:center;padding:60px 20px;color:var(--muted)}
.empty .ico{font-size:48px;margin-bottom:12px}
.empty p{font-family:'Rajdhani',sans-serif;font-size:18px;margin-bottom:6px;color:var(--text)}

.toast{position:fixed;bottom:28px;right:28px;z-index:9999;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:14px 20px;font-size:14px;max-width:340px;box-shadow:0 8px 30px rgba(0,0,0,.5);animation:slideUp .3s ease}
.toast.success{border-left:4px solid var(--ok)}.toast.error{border-left:4px solid var(--err)}.toast.info{border-left:4px solid var(--acc2)}
@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}

.wopt{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:4px;border:1px solid var(--border);cursor:pointer;font-family:'Rajdhani',sans-serif;font-weight:600;font-size:12px;transition:all .15s}
.wopt:hover{border-color:var(--acc)}.wopt.sel{border-color:var(--ok);background:rgba(16,185,129,.1);color:var(--ok)}
.wopt.clr{color:var(--err);border-color:var(--err)}.wopt.cx{color:var(--muted)}

.astat{background:rgba(139,92,246,.08);border:1px solid rgba(139,92,246,.2);border-radius:8px;padding:14px 18px}
.astat-v{font-family:'Rajdhani',sans-serif;font-size:30px;font-weight:700;color:var(--adm)}
.astat-l{font-size:11px;color:var(--muted);letter-spacing:.07em;text-transform:uppercase}

@media(max-width:700px){
  .nav{padding:10px 14px}.page{padding:14px}.fr2,.fr3{grid-template-columns:1fr}
  .mc-badge{min-width:80px;padding:8px 10px}
}
`;

// ─── SHARED ───────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t); }, [onClose]);
  return <div className={`toast ${type}`}>{message}</div>;
}

function TeamBadge({ abbr, sm }) {
  const c = IPL_TEAM_COLORS[abbr] || { bg: "#334155", text: "#fff" };
  const sz = sm ? { fontSize: 11, padding: "2px 7px", borderRadius: 3 } : { fontSize: 13, padding: "5px 12px", borderRadius: 5 };
  return <span style={{ background: c.bg, color: c.text, fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, letterSpacing: ".07em", display: "inline-block", ...sz }}>{abbr}</span>;
}

function Modal({ title, onClose, children, footer }) {
  return (
    <div className="modal-ov" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-hdr">
          <div className="modal-title">{title}</div>
          <div className="modal-x" onClick={onClose}>×</div>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-ft">{footer}</div>}
      </div>
    </div>
  );
}

function Confirm({ title, text, onOk, onCancel, danger }) {
  return (
    <div className="modal-ov">
      <div className="confirm-box">
        <div className="confirm-title">{title}</div>
        <div className="confirm-text">{text}</div>
        <div className="confirm-acts">
          <button className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
          <button className={`btn btn-sm ${danger ? "btn-danger" : "btn-primary"}`} onClick={onOk}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

// ─── USER LOGIN ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin, onGoAdmin }) {
  const [tab, setTab] = useState("login");
  const [f, setF] = useState({ phone: "", password: "", teamName: "" });
  const [err, setErr] = useState("");
  const upd = p => setF(x => ({ ...x, ...p }));

  const submit = () => {
    const phone = normalizePhone(f.phone);
    if (!phone || !f.password) { setErr("Fill all required fields"); return; }
    if (!isValidPhone(phone)) { setErr("Enter a valid phone number"); return; }
    const allowedPhones = new Set(getAllowedPhones().map(normalizePhone));
    if (!allowedPhones.has(phone)) { setErr("Phone number is not allowed by admin"); return; }
    const users = load("ifl_users", {});
    if (tab === "login") {
      if (!users[phone]) { setErr("User not found for this phone number"); return; }
      if (users[phone].password !== f.password) { setErr("Wrong password"); return; }
      onLogin(phone, users[phone]);
    } else {
      if (!f.teamName.trim()) { setErr("Enter your fantasy team name"); return; }
      if (users[phone]) { setErr("Phone number already registered"); return; }
      const nu = {
        password: f.password,
        teamName: f.teamName.trim(),
        players: [],
        points: 0,
        predictions: {},
        squadSubmitted: false,
        squadValidated: false,
        squadFrozen: false,
      };
      users[phone] = nu; save("ifl_users", users); onLogin(phone, nu);
    }
  };

  return (
    <div className="login-bg">
      <div className="lcard card">
        <div className="lhero"><h1>IFL <span>2019</span></h1><p>Indian Fantasy League · IPL Edition</p></div>
        <div className="ltabs">
          <div className={`ltab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setErr(""); }}>Login</div>
          <div className={`ltab ${tab === "register" ? "active" : ""}`} onClick={() => { setTab("register"); setErr(""); }}>Register</div>
        </div>
        <div className="fg"><label>Phone Number</label><input placeholder="Your phone number" value={f.phone} onChange={e => upd({ phone: e.target.value })} onKeyDown={e => e.key === "Enter" && submit()} /></div>
        <div className="fg"><label>Password</label><input type="password" placeholder="Password" value={f.password} onChange={e => upd({ password: e.target.value })} onKeyDown={e => e.key === "Enter" && submit()} /></div>
        {tab === "register" && <div className="fg"><label>Fantasy Team Name</label><input placeholder="e.g. Bengal Bewdas" value={f.teamName} onChange={e => upd({ teamName: e.target.value })} onKeyDown={e => e.key === "Enter" && submit()} /></div>}
        {err && <div className="fe">⚠ {err}</div>}
        <button className="btn btn-primary" style={{ width: "100%", marginTop: 16, justifyContent: "center" }} onClick={submit}>
          {tab === "login" ? "Enter the Game" : "Create Account"}
        </button>
        <div className="lswitch">Admin? <span onClick={onGoAdmin}>Go to Admin Panel →</span></div>
      </div>
    </div>
  );
}

// ─── ADMIN LOGIN ──────────────────────────────────────────────────────────────
function AdminLoginPage({ onLogin, onGoUser }) {
  const [f, setF] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");
  const submit = () => {
    if (f.username === ADMIN_CREDENTIALS.username && f.password === ADMIN_CREDENTIALS.password) onLogin();
    else setErr("Invalid admin credentials");
  };
  return (
    <div className="adm-login-bg">
      <div className="lcard card" style={{ borderColor: "rgba(139,92,246,.3)" }}>
        <div className="lhero"><h1>IFL <span className="p">Admin</span></h1><p>Administrative Control Panel</p></div>
        <div style={{ background: "rgba(139,92,246,.08)", border: "1px solid rgba(139,92,246,.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "var(--muted)" }}>
          🔐 Restricted Access · Default: admin / ifl@2019
        </div>
        <div className="fg"><label>Username</label><input placeholder="admin" value={f.username} onChange={e => setF(x => ({ ...x, username: e.target.value }))} onKeyDown={e => e.key === "Enter" && submit()} /></div>
        <div className="fg"><label>Password</label><input type="password" placeholder="••••••••" value={f.password} onChange={e => setF(x => ({ ...x, password: e.target.value }))} onKeyDown={e => e.key === "Enter" && submit()} /></div>
        {err && <div className="fe">⚠ {err}</div>}
        <button className="btn btn-adm" style={{ width: "100%", marginTop: 16, justifyContent: "center" }} onClick={submit}>Access Admin Panel</button>
        <div className="lswitch">Not admin? <span onClick={onGoUser}>Go to Player Login →</span></div>
      </div>
    </div>
  );
}

// ─── ADMIN: PLAYERS ───────────────────────────────────────────────────────────
function AdminPlayers({ showToast }) {
  const [players, setPlayers] = useState(getPlayers);
  const [flt, setFlt] = useState({ search: "", team: "ALL", role: "ALL" });
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const blank = { name: "", team: "CSK", role: "BAT", country: "India" };
  const [form, setForm] = useState(blank);
  const [fe, setFe] = useState("");

  const persist = u => { setPlayers(u); save("ifl_master_players", u); };
  const openAdd = () => { setForm(blank); setFe(""); setModal({ mode: "add" }); };
  const openEdit = p => { setForm({ name: p.name, team: p.team, role: p.role, country: p.country }); setFe(""); setModal({ mode: "edit", p }); };

  const saveP = () => {
    if (!form.name.trim()) { setFe("Name required"); return; }
    let updated;
    if (modal.mode === "add") {
      const id = Math.max(0, ...players.map(x => x.id)) + 1;
      updated = [...players, { id, name: form.name.trim(), team: form.team.toUpperCase(), role: form.role, country: form.country || "India" }];
      showToast("Player added ✓", "success");
    } else {
      updated = players.map(x => x.id === modal.p.id ? { ...x, name: form.name.trim(), team: form.team.toUpperCase(), role: form.role, country: form.country || "India" } : x);
      showToast("Player updated ✓", "success");
    }
    persist(updated); setModal(null);
  };

  const delP = id => { persist(players.filter(x => x.id !== id)); setConfirm(null); showToast("Player removed", "info"); };

  const filtered = players.filter(p =>
    (flt.team === "ALL" || p.team === flt.team) &&
    (flt.role === "ALL" || p.role === flt.role) &&
    (!flt.search || p.name.toLowerCase().includes(flt.search.toLowerCase()))
  );
  const teams = [...new Set(players.map(p => p.team))].sort();

  return (
    <div className="page">
      <div className="sh">
        <div><div className="pt">Master Player Sheet</div><div className="ps">{players.length} players · source for user team selection</div></div>
        <button className="btn btn-adm" onClick={openAdd}>+ Add Player</button>
      </div>
      <div className="pfilters">
        <input placeholder="🔍 Search player..." style={{ width: 210 }} value={flt.search} onChange={e => setFlt(f => ({ ...f, search: e.target.value }))} />
        <select style={{ width: 130 }} value={flt.team} onChange={e => setFlt(f => ({ ...f, team: e.target.value }))}>
          <option value="ALL">All Teams</option>
          {teams.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select style={{ width: 130 }} value={flt.role} onChange={e => setFlt(f => ({ ...f, role: e.target.value }))}>
          <option value="ALL">All Roles</option>
          {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{k} – {v}</option>)}
        </select>
        <span style={{ fontSize: 13, color: "var(--muted)", marginLeft: "auto" }}>{filtered.length} results</span>
      </div>
      <div className="tw">
        <table>
          <thead><tr><th>#</th><th>Player Name</th><th>IPL Team</th><th>Role</th><th>Country</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(p => {
              const tc = IPL_TEAM_COLORS[p.team] || { bg: "#334", text: "#fff" };
              const rc = ROLE_COLORS[p.role];
              return (
                <tr key={p.id}>
                  <td style={{ color: "var(--muted)", fontSize: 12 }}>{p.id}</td>
                  <td><strong style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 15 }}>{p.name}</strong></td>
                  <td><span style={{ background: tc.bg, color: tc.text, fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 11, padding: "2px 8px", borderRadius: 3 }}>{p.team}</span></td>
                  <td><span className="tag" style={{ background: rc + "22", color: rc }}>{p.role}</span></td>
                  <td style={{ fontSize: 13 }}>{p.country !== "India" ? `🌍 ${p.country}` : p.country}</td>
                  <td><div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-secondary btn-xs" onClick={() => openEdit(p)}>✏ Edit</button>
                    <button className="btn btn-danger btn-xs" onClick={() => setConfirm({ id: p.id, name: p.name })}>🗑 Delete</button>
                  </div></td>
                </tr>
              );
            })}
            {filtered.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: "var(--muted)" }}>No players match filters</td></tr>}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal.mode === "add" ? "Add New Player" : "Edit Player"} onClose={() => setModal(null)}
          footer={<>
            <button className="btn btn-secondary btn-sm" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-adm btn-sm" onClick={saveP}>{modal.mode === "add" ? "Add Player" : "Save Changes"}</button>
          </>}>
          <div className="fg"><label>Full Name *</label><input placeholder="e.g. MS Dhoni" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div className="fr fr2">
            <div className="fg"><label>IPL Team *</label>
              <select value={form.team} onChange={e => setForm(f => ({ ...f, team: e.target.value }))}>
                {ALL_IPL_TEAMS.map(t => <option key={t.abbr} value={t.abbr}>{t.abbr} – {t.name}</option>)}
              </select>
            </div>
            <div className="fg"><label>Role *</label>
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{k} – {v}</option>)}
              </select>
            </div>
          </div>
          <div className="fg"><label>Country</label><input placeholder="India" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} /></div>
          {fe && <div className="fe">⚠ {fe}</div>}
        </Modal>
      )}
      {confirm && <Confirm danger title="Delete Player" text={`Remove "${confirm.name}" from master sheet?`} onOk={() => delP(confirm.id)} onCancel={() => setConfirm(null)} />}
    </div>
  );
}

// ─── ADMIN: MATCHES ───────────────────────────────────────────────────────────
function AdminMatches({ showToast, onRecalculate }) {
  const [matches, setMatches] = useState(getMatches);
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [winEdit, setWinEdit] = useState(null);
  const blank = { date: new Date().toISOString().split("T")[0], teamA: "Chennai Super Kings", teamAabbr: "CSK", teamB: "Mumbai Indians", teamBabbr: "MI", venue: "", winner: "" };
  const [form, setForm] = useState(blank);
  const [fe, setFe] = useState("");

  const persist = u => { setMatches(u); save("ifl_master_matches", u); };
  const getAbbr = name => ALL_IPL_TEAMS.find(t => t.name === name)?.abbr || name.slice(0, 4).toUpperCase();
  const setTA = n => setForm(f => ({ ...f, teamA: n, teamAabbr: getAbbr(n) }));
  const setTB = n => setForm(f => ({ ...f, teamB: n, teamBabbr: getAbbr(n) }));

  const openAdd = () => { setForm(blank); setFe(""); setModal({ mode: "add" }); };
  const openEdit = m => { setForm({ date: m.date, teamA: m.teamA, teamAabbr: m.teamAabbr, teamB: m.teamB, teamBabbr: m.teamBabbr, venue: m.venue, winner: m.winner || "" }); setFe(""); setModal({ mode: "edit", m }); };

  const saveM = () => {
    if (!form.date) { setFe("Date required"); return; }
    if (form.teamA === form.teamB) { setFe("Teams must differ"); return; }
    if (!form.venue.trim()) { setFe("Venue required"); return; }
    let updated;
    if (modal.mode === "add") {
      const id = Math.max(0, ...matches.map(x => x.id)) + 1;
      updated = [...matches, { id, date: form.date, teamA: form.teamA, teamAabbr: form.teamAabbr, teamB: form.teamB, teamBabbr: form.teamBabbr, venue: form.venue.trim(), winner: form.winner || "" }];
      showToast("Match added ✓", "success");
    } else {
      updated = matches.map(x => x.id === modal.m.id ? { ...x, ...form, venue: form.venue.trim() } : x);
      showToast("Match updated ✓", "success");
    }
    persist(updated.sort((a, b) => a.date.localeCompare(b.date)));
    onRecalculate?.();
    setModal(null);
  };

  const delM = id => {
    persist(matches.filter(x => x.id !== id));
    const stats = { ...getMatchStats() };
    delete stats[String(id)];
    save("ifl_match_stats", stats);
    onRecalculate?.();
    setConfirm(null);
    showToast("Match deleted", "info");
  };

  const setWinner = (matchId, abbr) => {
    persist(matches.map(m => m.id === matchId ? { ...m, winner: m.winner === abbr ? "" : abbr } : m));
    onRecalculate?.();
    showToast(abbr ? `Winner set: ${abbr} ✓` : "Winner cleared", "success");
    setWinEdit(null);
  };

  const grouped = matches.reduce((acc, m) => { const mo = m.date.slice(0, 7); (acc[mo] = acc[mo] || []).push(m); return acc; }, {});

  return (
    <div className="page">
      <div className="sh">
        <div><div className="pt">Match Schedule</div><div className="ps">{matches.length} matches · {matches.filter(m => m.winner).length} results declared · {matches.filter(m => !m.winner).length} pending</div></div>
        <button className="btn btn-adm" onClick={openAdd}>+ Add Match</button>
      </div>

      {Object.entries(grouped).map(([mo, mlist]) => (
        <div key={mo} style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 13, fontWeight: 700, color: "var(--muted)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 12 }}>
            {new Date(mo + "-01").toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </div>
          <div className="tw">
            <table>
              <thead><tr><th>ID</th><th>Date</th><th>Team A</th><th>Team B</th><th>Venue</th><th>Winner</th><th>Actions</th></tr></thead>
              <tbody>
                {mlist.map(m => (
                  <tr key={m.id}>
                    <td style={{ color: "var(--muted)", fontSize: 12 }}>{m.id}</td>
                    <td style={{ fontSize: 13 }}>{m.date}</td>
                    <td><TeamBadge abbr={m.teamAabbr} sm /></td>
                    <td><TeamBadge abbr={m.teamBabbr} sm /></td>
                    <td style={{ fontSize: 13, color: "var(--muted)" }}>📍 {m.venue}</td>
                    <td>
                      {winEdit === m.id ? (
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <div className={`wopt ${m.winner === m.teamAabbr ? "sel" : ""}`} onClick={() => setWinner(m.id, m.teamAabbr)}><TeamBadge abbr={m.teamAabbr} sm /> {m.teamAabbr}</div>
                          <div className={`wopt ${m.winner === m.teamBabbr ? "sel" : ""}`} onClick={() => setWinner(m.id, m.teamBabbr)}><TeamBadge abbr={m.teamBabbr} sm /> {m.teamBabbr}</div>
                          <div className="wopt clr" onClick={() => setWinner(m.id, "")}>✕ Clear</div>
                          <div className="wopt cx" onClick={() => setWinEdit(null)}>Close</div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {m.winner ? <span className="wbadge">🏆 {m.winner}</span> : <span className="pbadge">Pending</span>}
                          <button className="btn btn-secondary btn-xs" onClick={() => setWinEdit(m.id)}>Set Winner</button>
                        </div>
                      )}
                    </td>
                    <td><div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-secondary btn-xs" onClick={() => openEdit(m)}>✏ Edit</button>
                      <button className="btn btn-danger btn-xs" onClick={() => setConfirm({ id: m.id })}>🗑</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      {matches.length === 0 && <div className="empty"><div className="ico">📅</div><p>No matches yet</p><small>Add the first match</small></div>}

      {modal && (
        <Modal title={modal.mode === "add" ? "Add New Match" : "Edit Match"} onClose={() => setModal(null)}
          footer={<>
            <button className="btn btn-secondary btn-sm" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-adm btn-sm" onClick={saveM}>{modal.mode === "add" ? "Add Match" : "Save Changes"}</button>
          </>}>
          <div className="fr fr2">
            <div className="fg"><label>Date *</label><input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
            <div className="fg"><label>Venue *</label><input placeholder="e.g. Chennai" value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} /></div>
          </div>
          <div className="fr fr2">
            <div className="fg"><label>Team A *</label>
              <select value={form.teamA} onChange={e => setTA(e.target.value)}>
                {ALL_IPL_TEAMS.map(t => <option key={t.abbr} value={t.name}>{t.abbr} – {t.name}</option>)}
              </select>
            </div>
            <div className="fg"><label>Team B *</label>
              <select value={form.teamB} onChange={e => setTB(e.target.value)}>
                {ALL_IPL_TEAMS.map(t => <option key={t.abbr} value={t.name}>{t.abbr} – {t.name}</option>)}
              </select>
            </div>
          </div>
          <div className="fg"><label>Winner (optional)</label>
            <select value={form.winner} onChange={e => setForm(f => ({ ...f, winner: e.target.value }))}>
              <option value="">— Not decided yet —</option>
              <option value={form.teamAabbr}>{form.teamAabbr}</option>
              <option value={form.teamBabbr}>{form.teamBabbr}</option>
            </select>
          </div>
          {fe && <div className="fe">⚠ {fe}</div>}
        </Modal>
      )}
      {confirm && <Confirm danger title="Delete Match" text="Delete this match? User predictions for it may become invalid." onOk={() => delM(confirm.id)} onCancel={() => setConfirm(null)} />}
    </div>
  );
}

// ─── ADMIN: SCORING ───────────────────────────────────────────────────────────
function AdminScoring({ showToast, onRecalculate }) {
  const matches = getMatches();
  const players = getPlayers();
  const [stats, setStats] = useState(() => getMatchStats());
  const [matchId, setMatchId] = useState(() => (matches[0] ? String(matches[0].id) : ""));

  const match = matches.find(m => String(m.id) === String(matchId));
  const stat = (match && stats[String(match.id)]) || { players: {}, motmPlayerId: "" };
  const playerPool = match
    ? players.filter(p => p.team === match.teamAabbr || p.team === match.teamBabbr)
    : [];

  const updatePlayerStat = (pid, key, value) => {
    if (!match) return;
    const mid = String(match.id);
    const current = stats[mid] || { players: {}, motmPlayerId: "" };
    const pcur = current.players?.[pid] || { runs: 0, catches: 0, runouts: 0, wickets: 0 };
    const next = {
      ...stats,
      [mid]: {
        ...current,
        players: {
          ...current.players,
          [pid]: { ...pcur, [key]: Math.max(0, Number(value) || 0) },
        },
      },
    };
    setStats(next);
  };

  const setMotm = (pid) => {
    if (!match) return;
    const mid = String(match.id);
    const current = stats[mid] || { players: {}, motmPlayerId: "" };
    setStats({ ...stats, [mid]: { ...current, motmPlayerId: pid ? Number(pid) : "" } });
  };

  const saveScoring = () => {
    save("ifl_match_stats", stats);
    onRecalculate?.();
    showToast("Match scoring saved and leaderboard recalculated ✓", "success");
  };

  const clearScoring = () => {
    if (!match) return;
    const next = { ...stats };
    delete next[String(match.id)];
    setStats(next);
    save("ifl_match_stats", next);
    onRecalculate?.();
    showToast("Scoring cleared for this match", "info");
  };

  return (
    <div className="page">
      <div className="sh">
        <div><div className="pt">Points Scoring</div><div className="ps">Update match-wise player stats and recalculate all points</div></div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={clearScoring} disabled={!match}>Clear Match</button>
          <button className="btn btn-adm btn-sm" onClick={saveScoring}>Save & Recalculate</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="fg" style={{ marginBottom: 10 }}>
          <label>Select Match</label>
          <select value={matchId} onChange={e => setMatchId(e.target.value)}>
            {matches.map(m => <option key={m.id} value={m.id}>Match {m.id}: {m.teamAabbr} vs {m.teamBabbr} ({m.date})</option>)}
          </select>
        </div>
        <div style={{ fontSize: 13, color: "var(--muted)" }}>
          Runs: 1 each · Catch: 5 · Runout/Stumping: 10 · Wicket: 20 · 3W bonus: +25 · 5W bonus: +50 · 50/75/100 run bonus: +25/+50/+100 · MoM: +50 · Winner pick: +50
        </div>
      </div>

      {!match && <div className="empty"><p>No matches available</p></div>}

      {match && (
        <>
          <div className="card" style={{ marginBottom: 16 }}>
            <label>Man of the Match</label>
            <select value={stat.motmPlayerId || ""} onChange={e => setMotm(e.target.value)}>
              <option value="">— None —</option>
              {playerPool.map(p => <option key={p.id} value={p.id}>{p.name} ({p.team})</option>)}
            </select>
          </div>
          <div className="tw">
            <table>
              <thead><tr><th>Player</th><th>Team</th><th>Runs</th><th>Catches</th><th>Runout/Stump</th><th>Wickets</th><th>Points</th></tr></thead>
              <tbody>
                {playerPool.map(p => {
                  const ps = stat.players?.[p.id] || { runs: 0, catches: 0, runouts: 0, wickets: 0 };
                  return (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td><TeamBadge abbr={p.team} sm /></td>
                      {["runs", "catches", "runouts", "wickets"].map(k => (
                        <td key={k}><input type="number" min="0" value={ps[k] ?? 0} onChange={e => updatePlayerStat(p.id, k, e.target.value)} /></td>
                      ))}
                      <td style={{ fontWeight: 700, color: "var(--acc)" }}>{scorePlayerPerformance(ps)}</td>
                    </tr>
                  );
                })}
                {playerPool.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", padding: 24, color: "var(--muted)" }}>No players from selected fixture in master sheet</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ─── ADMIN: DASHBOARD ─────────────────────────────────────────────────────────
function AdminDash() {
  const players = getPlayers();
  const matches = getMatches();
  const users = load("ifl_users", {});
  const ul = Object.entries(users);
  const topUsers = ul.map(([un, u]) => ({ un, teamName: u.teamName, points: u.points || 0 })).sort((a, b) => b.points - a.points).slice(0, 5);
  const pending = matches.filter(m => !m.winner);

  return (
    <div className="page">
      <div className="pt">Dashboard</div>
      <div className="ps">IFL 2019 platform overview</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 12, marginBottom: 28 }}>
        {[
          { l: "Master Players", v: players.length, ico: "🏏" },
          { l: "Total Matches", v: matches.length, ico: "📅" },
          { l: "Pending Results", v: pending.length, ico: "⏳" },
          { l: "Registered Users", v: ul.length, ico: "👥" },
          { l: "Total Predictions", v: ul.reduce((s, [, u]) => s + Object.keys(u.predictions || {}).length, 0), ico: "🎯" },
          { l: "Overseas Players", v: players.filter(p => p.country !== "India").length, ico: "🌍" },
        ].map(s => (
          <div key={s.l} className="astat">
            <div style={{ fontSize: 24, marginBottom: 6 }}>{s.ico}</div>
            <div className="astat-v">{s.v}</div>
            <div className="astat-l">{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="card">
          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 14 }}>🏆 Top 5 Users</div>
          {topUsers.length === 0 ? <div style={{ color: "var(--muted)", fontSize: 13 }}>No users yet</div> :
            topUsers.map((u, i) => (
              <div key={u.un} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < topUsers.length - 1 ? "1px solid var(--border)" : "none" }}>
                <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 18, fontWeight: 700, color: i === 0 ? "var(--gold)" : "var(--muted)", width: 24, textAlign: "center" }}>
                  {["🥇", "🥈", "🥉"][i] || `#${i + 1}`}
                </span>
                <div style={{ flex: 1 }}><div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 15, fontWeight: 600 }}>{u.teamName}</div><div style={{ fontSize: 12, color: "var(--muted)" }}>📱 {u.un}</div></div>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 20, fontWeight: 700, color: "var(--acc)" }}>{u.points}</div>
              </div>
            ))
          }
        </div>
        <div className="card">
          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 14 }}>⏳ Pending Results</div>
          {pending.length === 0 ? <div style={{ color: "var(--muted)", fontSize: 13 }}>All results declared ✓</div> :
            pending.slice(0, 6).map((m, i) => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < Math.min(pending.length, 6) - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontFamily: "'Rajdhani',sans-serif", fontWeight: 600 }}>
                    <TeamBadge abbr={m.teamAabbr} sm /> <span style={{ color: "var(--muted)" }}>vs</span> <TeamBadge abbr={m.teamBabbr} sm />
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{m.date} · {m.venue}</div>
                </div>
                <span className="pbadge" style={{ fontSize: 10 }}>Pending</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN: USERS ─────────────────────────────────────────────────────────────
function AdminUsers({ showToast, onRecalculate }) {
  const [users, setUsers] = useState(() => load("ifl_users", {}));
  const [confirm, setConfirm] = useState(null);

  const del = un => {
    const u = { ...users }; delete u[un];
    save("ifl_users", u); setUsers(u); setConfirm(null);
    onRecalculate?.();
    showToast(`User ${un} removed`, "info");
  };

  const setStatus = (un, patch, msg) => {
    const updated = { ...users, [un]: { ...users[un], ...patch } };
    save("ifl_users", updated);
    setUsers(updated);
    onRecalculate?.();
    showToast(msg, "success");
  };

  const rows = Object.entries(users).map(([un, u]) => ({
    un, teamName: u.teamName, points: u.points || 0,
    squad: (u.players || []).length,
    preds: Object.keys(u.predictions || {}).length,
    correct: Object.values(u.predictions || {}).filter(p => p.correct === true).length,
    submitted: !!u.squadSubmitted,
    validated: !!u.squadValidated,
    frozen: !!u.squadFrozen,
  })).sort((a, b) => b.points - a.points);

  return (
    <div className="page">
      <div className="pt">Registered Users</div>
      <div className="ps">{rows.length} users on the platform</div>
      <div className="tw">
        <table>
          <thead><tr><th>Rank</th><th>Phone</th><th>Team Name</th><th>Squad</th><th>Status</th><th>Predictions</th><th>Correct</th><th>Points</th><th>Actions</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.un}>
                <td style={{ color: i === 0 ? "var(--gold)" : "var(--muted)" }}>{["🥇", "🥈", "🥉"][i] || `#${i + 1}`}</td>
                <td><code style={{ background: "var(--sf2)", padding: "2px 8px", borderRadius: 4, fontSize: 12 }}>{r.un}</code></td>
                <td style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 15, fontWeight: 600 }}>{r.teamName}</td>
                <td>{r.squad}<span style={{ color: "var(--muted)", fontSize: 12 }}>/20</span></td>
                <td>
                  <span className="tag" style={{ background: r.frozen ? "rgba(239,68,68,.15)" : r.validated ? "rgba(16,185,129,.15)" : r.submitted ? "rgba(59,130,246,.15)" : "rgba(100,116,139,.15)", color: r.frozen ? "var(--err)" : r.validated ? "var(--ok)" : r.submitted ? "var(--acc2)" : "var(--muted)" }}>
                    {r.frozen ? "Frozen" : r.validated ? "Validated" : r.submitted ? "Submitted" : "Draft"}
                  </span>
                </td>
                <td>{r.preds}</td>
                <td style={{ color: "var(--ok)" }}>{r.correct}</td>
                <td style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 18, fontWeight: 700, color: "var(--acc)" }}>{r.points}</td>
                <td>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {!r.validated && <button className="btn btn-secondary btn-xs" onClick={() => setStatus(r.un, { squadValidated: true }, `${r.un} team validated`)}>Validate</button>}
                    {!r.frozen && <button className="btn btn-adm btn-xs" onClick={() => setStatus(r.un, { squadFrozen: true, squadValidated: true }, `${r.un} team frozen`)}>Freeze</button>}
                    {r.frozen && <button className="btn btn-secondary btn-xs" onClick={() => setStatus(r.un, { squadFrozen: false }, `${r.un} team unfrozen`)}>Unfreeze</button>}
                    <button className="btn btn-secondary btn-xs" onClick={() => setStatus(r.un, { squadSubmitted: false, squadValidated: false, squadFrozen: false }, `${r.un} set to draft`)}>Reset</button>
                    <button className="btn btn-danger btn-xs" onClick={() => setConfirm({ un: r.un })}>Remove</button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={9} style={{ textAlign: "center", padding: 32, color: "var(--muted)" }}>No users registered yet</td></tr>}
          </tbody>
        </table>
      </div>
      {confirm && <Confirm danger title="Remove User" text={`Remove ${confirm.un} and all their data?`} onOk={() => del(confirm.un)} onCancel={() => setConfirm(null)} />}
    </div>
  );
}

function AdminAccess({ showToast }) {
  const [allowed, setAllowed] = useState(() => getAllowedPhones());
  const [phone, setPhone] = useState("");

  const addPhone = () => {
    const p = normalizePhone(phone);
    if (!isValidPhone(p)) { showToast("Enter valid phone (10-15 digits)", "error"); return; }
    if (allowed.map(normalizePhone).includes(p)) { showToast("Phone already allowed", "info"); return; }
    const next = [...allowed, p].sort();
    setAllowed(next);
    save("ifl_allowed_phones", next);
    setPhone("");
    showToast("Allowed phone added ✓", "success");
  };

  const removePhone = (p) => {
    const next = allowed.filter(x => normalizePhone(x) !== normalizePhone(p));
    setAllowed(next);
    save("ifl_allowed_phones", next);
    showToast("Allowed phone removed", "info");
  };

  return (
    <div className="page">
      <div className="pt">Allowed Phone Numbers</div>
      <div className="ps">Only these phone numbers can register and login</div>
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="fr fr2">
          <div className="fg"><label>Phone Number</label><input placeholder="e.g. 9876543210" value={phone} onChange={e => setPhone(e.target.value)} /></div>
          <div className="fg" style={{ display: "flex", alignItems: "end" }}><button className="btn btn-adm" onClick={addPhone}>Add Allowed Number</button></div>
        </div>
      </div>
      <div className="tw">
        <table>
          <thead><tr><th>#</th><th>Phone</th><th>Actions</th></tr></thead>
          <tbody>
            {allowed.map((p, i) => (
              <tr key={p}>
                <td style={{ color: "var(--muted)", fontSize: 12 }}>{i + 1}</td>
                <td><code style={{ background: "var(--sf2)", padding: "2px 8px", borderRadius: 4, fontSize: 12 }}>{p}</code></td>
                <td><button className="btn btn-danger btn-xs" onClick={() => removePhone(p)}>Remove</button></td>
              </tr>
            ))}
            {allowed.length === 0 && <tr><td colSpan={3} style={{ textAlign: "center", padding: 32, color: "var(--muted)" }}>No allowed phones configured</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── USER PAGES ───────────────────────────────────────────────────────────────
function BuildTeam({ user, onUpdate, showToast }) {
  const players = getPlayers();
  const [flt, setFlt] = useState({ role: "ALL", team: "ALL", search: "" });
  const sel = user.players || [];
  const MAX = 20, MF = 8;
  const isFrozen = !!user.squadFrozen;
  const isSubmitted = !!user.squadSubmitted;
  const isValidated = !!user.squadValidated;
  const fc = sel.filter(id => { const p = players.find(x => x.id === id); return p && p.country !== "India"; }).length;

  const toggle = id => {
    if (isFrozen) { showToast("Team is frozen by admin. Ask admin to unfreeze.", "error"); return; }
    if (sel.includes(id)) { onUpdate({ players: sel.filter(x => x !== id) }); return; }
    if (sel.length >= MAX) { showToast(`Max ${MAX} players`, "error"); return; }
    const p = players.find(x => x.id === id);
    if (p?.country !== "India" && fc >= MF) { showToast("Max 8 overseas players", "error"); return; }
    onUpdate({ players: [...sel, id] });
  };

  const submitTeam = () => {
    if (isFrozen) { showToast("Team is frozen by admin.", "error"); return; }
    if (sel.length !== MAX) { showToast(`Select exactly ${MAX} players before submitting`, "error"); return; }
    onUpdate({ squadSubmitted: true });
    showToast("Team submitted for admin validation", "success");
  };

  const filtered = players.filter(p =>
    (flt.role === "ALL" || p.role === flt.role) &&
    (flt.team === "ALL" || p.team === flt.team) &&
    (!flt.search || p.name.toLowerCase().includes(flt.search.toLowerCase()))
  );
  const teams = [...new Set(players.map(p => p.team))].sort();

  return (
    <div className="page">
      <div className="sh">
        <div><div className="pt">Build Your Squad</div><div className="ps">Select up to {MAX} players · Max 8 overseas</div></div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 28, fontWeight: 700, color: sel.length >= MAX ? "var(--ok)" : "var(--acc)" }}>
            {sel.length}<span style={{ fontSize: 14, color: "var(--muted)" }}>/{MAX}</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>{fc}/{MF} overseas</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <span className="tag" style={{ background: isFrozen ? "rgba(239,68,68,.15)" : isValidated ? "rgba(16,185,129,.15)" : isSubmitted ? "rgba(59,130,246,.15)" : "rgba(100,116,139,.15)", color: isFrozen ? "var(--err)" : isValidated ? "var(--ok)" : isSubmitted ? "var(--acc2)" : "var(--muted)" }}>
          {isFrozen ? "Frozen by Admin" : isValidated ? "Validated by Admin" : isSubmitted ? "Submitted" : "Draft"}
        </span>
        <button className="btn btn-primary btn-sm" onClick={submitTeam} disabled={isFrozen || sel.length !== MAX}>
          Submit Team
        </button>
      </div>
      <div style={{ marginBottom: 16 }}><div className="pbar"><div className="pfill" style={{ width: `${(sel.length / MAX) * 100}%` }} /></div></div>
      <div className="pfilters">
        <input placeholder="Search player..." style={{ width: 200 }} value={flt.search} onChange={e => setFlt(f => ({ ...f, search: e.target.value }))} />
        {[["ALL", "All"], ["WK", "WK"], ["BAT", "BAT"], ["ALL_", "ALL"], ["BOWL", "BOWL"]].map(([k, l]) => {
          const rk = k === "ALL_" ? "ALL" : k;
          const active = flt.role === rk && !(k === "ALL" && flt.role !== "ALL") || (k === "ALL" && flt.role === "ALL");
          const a2 = k === "ALL_" ? flt.role === "ALL" : flt.role === rk;
          return <button key={k} className={`fbtn ${k === "ALL" ? flt.role === "ALL" : flt.role === rk ? "active" : ""}`} onClick={() => setFlt(f => ({ ...f, role: rk }))}>{l}</button>;
        })}
        <select style={{ width: 120 }} value={flt.team} onChange={e => setFlt(f => ({ ...f, team: e.target.value }))}>
          <option value="ALL">All Teams</option>
          {teams.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="pgrid">
        {filtered.map(p => {
          const isSel = sel.includes(p.id);
          const tc = IPL_TEAM_COLORS[p.team] || { bg: "#334", text: "#fff" };
          const rc = ROLE_COLORS[p.role];
          return (
            <div key={p.id} className={`pc ${isSel ? "sel" : ""}`} style={{ cursor: isFrozen ? "not-allowed" : "pointer", opacity: isFrozen ? 0.75 : 1 }} onClick={() => toggle(p.id)}>
              <div className="pteam" style={{ color: tc.bg }}>{p.team}</div>
              <div className="pname">{p.name}</div>
              <div className="pmeta">
                <span className="tag" style={{ background: rc + "22", color: rc }}>{p.role}</span>
                {p.country !== "India" && <span className="tag" style={{ background: "rgba(99,102,241,.15)", color: "#818cf8" }}>🌍 {p.country}</span>}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div style={{ gridColumn: "1/-1", color: "var(--muted)", textAlign: "center", padding: 40 }}>No players match filters</div>}
      </div>
    </div>
  );
}

function MyTeam({ user, onUpdate, showToast }) {
  const players = getPlayers();
  const matches = getMatches();
  const matchStats = getMatchStats();
  const sel = (user.players || []).map(id => players.find(p => p.id === id)).filter(Boolean);
  const isFrozen = !!user.squadFrozen;
  const rem = id => {
    if (isFrozen) { showToast("Team is frozen by admin", "error"); return; }
    onUpdate({ players: (user.players || []).filter(x => x !== id) });
    showToast("Player removed", "info");
  };

  if (sel.length === 0) return <div className="page"><div className="pt">My Team — {user.teamName}</div><div className="empty"><div className="ico">🏏</div><p>No players selected</p><small>Head to Build Team</small></div></div>;

  const byRole = { WK: [], BAT: [], ALL: [], BOWL: [] };
  sel.forEach(p => { if (byRole[p.role]) byRole[p.role].push(p); });
  const selMap = new Map(sel.map(p => [String(p.id), p]));
  const breakdown = matches.map(m => {
    const ms = matchStats[String(m.id)] || {};
    const pstats = ms.players || {};
    const entries = Object.entries(pstats)
      .filter(([pid]) => selMap.has(String(pid)))
      .map(([pid, stat]) => ({ player: selMap.get(String(pid)), pts: scorePlayerPerformance(stat), stat }))
      .filter(x => x.pts > 0)
      .sort((a, b) => b.pts - a.pts);
    const playerPts = entries.reduce((s, x) => s + x.pts, 0);
    const motmPts = ms.motmPlayerId && selMap.has(String(ms.motmPlayerId)) ? POINT_RULES.MAN_OF_MATCH : 0;
    return { match: m, entries, total: playerPts + motmPts, motmPts };
  }).filter(x => x.entries.length > 0 || x.motmPts > 0);

  return (
    <div className="page">
      <div className="sh"><div><div className="pt">{user.teamName}</div><div className="ps">{sel.length} players selected</div></div></div>
      {Object.entries(byRole).map(([role, ps]) => ps.length > 0 && (
        <div key={role} style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span className="tag" style={{ background: ROLE_COLORS[role] + "22", color: ROLE_COLORS[role], fontSize: 12 }}>{ROLE_LABELS[role]}s</span>
            <span style={{ color: "var(--muted)", fontSize: 12 }}>{ps.length}</span>
          </div>
          <div className="pgrid">
            {ps.map(p => {
              const tc = IPL_TEAM_COLORS[p.team] || { bg: "#334", text: "#fff" };
              return (
                <div key={p.id} className="pc" style={{ cursor: "default" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div className="pteam" style={{ color: tc.bg }}>{p.team}</div>
                    <span style={{ cursor: "pointer", color: "var(--muted)", fontSize: 20, lineHeight: 1 }} onClick={() => rem(p.id)}>×</span>
                  </div>
                  <div className="pname">{p.name}</div>
                  <div className="pmeta">
                    <span className="tag" style={{ background: ROLE_COLORS[p.role] + "22", color: ROLE_COLORS[p.role] }}>{p.role}</span>
                    {p.country !== "India" && <span className="tag" style={{ background: "rgba(99,102,241,.15)", color: "#818cf8" }}>🌍</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div className="divider" />
      <div className="pt" style={{ fontSize: 20, marginBottom: 12 }}>Match-wise Player Points</div>
      {breakdown.length === 0 && <div style={{ color: "var(--muted)" }}>No individual player points recorded yet.</div>}
      {breakdown.map(row => (
        <div key={row.match.id} className="card" style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700 }}>Match {row.match.id}: {row.match.teamAabbr} vs {row.match.teamBabbr}</div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, color: "var(--acc)" }}>{row.total} pts</div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {row.entries.map(e => (
              <span key={`${row.match.id}-${e.player.id}`} className="tag" style={{ background: "rgba(59,130,246,.12)", color: "#93c5fd", fontSize: 11 }}>
                {e.player.name}: {e.pts}
              </span>
            ))}
            {row.motmPts > 0 && <span className="tag" style={{ background: "rgba(16,185,129,.14)", color: "var(--ok)", fontSize: 11 }}>MoM Bonus: +{row.motmPts}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function Predict({ user, onUpdate, showToast }) {
  const matches = getMatches();
  const preds = user.predictions || {};

  const predict = (matchId, abbr) => {
    if (preds[matchId]) { showToast("Already predicted", "error"); return; }
    const m = matches.find(x => x.id === matchId);
    if (!m) return;
    const newP = { ...preds, [matchId]: { pick: abbr, correct: null, pts: 0 } };
    onUpdate({ predictions: newP });
    if (m.winner && abbr === m.winner) showToast("🎉 Winner pick saved (+50 after recalculation)", "success");
    else if (m.winner && abbr !== m.winner) showToast("Pick saved (0 for winner-pick rule)", "error");
    else showToast(`Predicted ${abbr} — awaiting result`, "info");
  };

  return (
    <div className="page">
      <div className="pt">Match Predictions</div>
      <div className="ps">Predict the winner · 50 points for each correct pick</div>
      <div className="card" style={{ marginBottom: 14, fontSize: 13, color: "var(--muted)" }}>
        Runs 1 · Catch 5 · Runout/Stumping 10 · Wicket 20 · 3W +25 · 5W +50 · 50/75/100 runs +25/+50/+100 · MoM +50 · Match winner pick +50
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {matches.length === 0 && <div className="empty"><div className="ico">📅</div><p>No matches scheduled yet</p><small>Admin will add matches soon</small></div>}
        {matches.map(m => {
          const pred = preds[m.id];
          const cA = IPL_TEAM_COLORS[m.teamAabbr] || { bg: "#334", text: "#fff" };
          const cB = IPL_TEAM_COLORS[m.teamBabbr] || { bg: "#334", text: "#fff" };
          const locked = !!pred;
          return (
            <div key={m.id} className="mc">
              <div className="mc-hdr">
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <div className="mc-date">Match {m.id} · {m.date}</div>
                  {locked && <span style={{ fontSize: 11, fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, color: pred.correct === true ? "var(--ok)" : pred.correct === false ? "var(--err)" : "var(--muted)" }}>
                    {pred.correct === true ? "✓ +50 pts" : pred.correct === false ? "✗ 0 pts" : "⏳ Result pending"}
                  </span>}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>📍 {m.venue}</div>
              </div>
              <div className="mc-teams">
                {[{ abbr: m.teamAabbr, name: m.teamA, c: cA }, { abbr: m.teamBabbr, name: m.teamB, c: cB }].map((t, i) => {
                  const isPick = pred?.pick === t.abbr;
                  const cls = isPick ? (pred.correct === true ? "ok" : pred.correct === false ? "err" : "sel") : "";
                  return (
                    <div key={i}>
                      {i === 1 && <div className="mc-vs">VS</div>}
                      <div className={`mc-badge ${cls}`} style={{ background: t.c.bg + "22" }} onClick={() => !locked && predict(m.id, t.abbr)}>
                        <TeamBadge abbr={t.abbr} />
                        <span style={{ fontSize: 12, color: "var(--text)", marginTop: 4 }}>{t.name.split(" ").slice(-1)[0]}</span>
                      </div>
                    </div>
                  );
                })}
                <div style={{ marginLeft: "auto" }}>
                  {m.winner ? <span className="wbadge">🏆 {m.winner}</span> : <span className="pbadge">Upcoming</span>}
                </div>
              </div>
              {!locked && <div style={{ fontSize: 12, color: "var(--muted)" }}>Click a team to lock in your prediction</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Leaderboard({ me }) {
  const users = load("ifl_users", {});
  const rows = Object.entries(users).map(([un, u]) => ({ un, teamName: u.teamName, points: u.points || 0, preds: Object.keys(u.predictions || {}).length })).sort((a, b) => b.points - a.points);
  return (
    <div className="page">
      <div className="pt">Leaderboard</div>
      <div className="ps">Global rankings by prediction points</div>
      <div className="lb">
        {rows.length === 0 && <div className="empty"><div className="ico">🏆</div><p>No players yet</p></div>}
        {rows.map((r, i) => (
          <div key={r.un} className="lbr" style={r.un === me ? { borderColor: "var(--acc)", background: "rgba(249,115,22,.04)" } : {}}>
            <div className={`lbrank ${["g", "s", "b"][i] || ""}`}>{["🥇", "🥈", "🥉"][i] || `#${i + 1}`}</div>
            <div className="lbinfo">
              <div className="lbname">{r.teamName} {r.un === me && <span style={{ fontSize: 11, color: "var(--acc)", marginLeft: 6 }}>YOU</span>}</div>
              <div className="lbsub">📱 {r.un} · {r.preds} predictions</div>
            </div>
            <div><div className="lbpts">{r.points}</div><div className="lbptsl">Points</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Profile({ user, username }) {
  const matches = getMatches();
  const preds = user.predictions || {};
  const total = Object.keys(preds).length;
  const correct = Object.values(preds).filter(p => p.correct === true).length;
  const acc = total > 0 ? Math.round((correct / total) * 100) : 0;
  return (
    <div className="page">
      <div className="prof-hdr">
        <div className="avatar">{(user.teamName || "?")[0]}</div>
        <div style={{ flex: 1 }}><div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 22, fontWeight: 700 }}>{user.teamName}</div><div style={{ color: "var(--muted)", fontSize: 14 }}>📱 {username}</div></div>
        <div style={{ textAlign: "right" }}><div className="ptsbig">{user.points || 0}</div><div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".07em", textTransform: "uppercase" }}>Points</div></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 28 }}>
        {[
          { l: "Squad Size", v: (user.players || []).length, max: 20, u: "/20" },
          { l: "Predictions", v: total, max: matches.length || 1, u: `/${matches.length}` },
          { l: "Correct Picks", v: correct, max: total || 1, u: "" },
          { l: "Accuracy", v: acc, max: 100, u: "%" },
        ].map(s => (
          <div key={s.l} className="card">
            <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "'Rajdhani',sans-serif", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 6 }}>{s.l}</div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 32, fontWeight: 700, color: "var(--acc)" }}>{s.v}<span style={{ fontSize: 14, color: "var(--muted)" }}>{s.u}</span></div>
            <div className="pbar" style={{ marginTop: 8 }}><div className="pfill" style={{ width: `${(s.v / s.max) * 100}%` }} /></div>
          </div>
        ))}
      </div>
      <div className="pt" style={{ fontSize: 20, marginBottom: 14 }}>Recent Predictions</div>
      {Object.keys(preds).length === 0 ? <div style={{ color: "var(--muted)" }}>No predictions yet</div> :
        Object.entries(preds).slice(-8).reverse().map(([mid, pred]) => {
          const m = matches.find(x => x.id === parseInt(mid));
          if (!m) return null;
          return (
            <div key={mid} style={{ display: "flex", alignItems: "center", gap: 14, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 16px", marginBottom: 8 }}>
              <TeamBadge abbr={pred.pick} sm />
              <div style={{ flex: 1, fontSize: 13 }}><span style={{ color: "var(--muted)" }}>Match {mid}: </span>{m.teamA} vs {m.teamB}</div>
              <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, color: pred.correct === true ? "var(--ok)" : pred.correct === false ? "var(--err)" : "var(--muted)", fontSize: 14 }}>
                {pred.correct === true ? "+50" : pred.correct === false ? "0" : "⏳"} pts
              </span>
            </div>
          );
        })
      }
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState("user"); // user | admin-login | admin
  const [username, setUsername] = useState(null);
  const [user, setUser] = useState(null);
  const [upg, setUpg] = useState("predict");
  const [apg, setApg] = useState("dashboard");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let active = true;
    void bootstrapStore().finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);

  const showToast = useCallback((msg, type = "info") => setToast({ msg, type, k: Date.now() }), []);

  const onUserLogin = (un, ud) => { setUsername(un); setUser(ud); setUpg("predict"); };
  const onUserLogout = () => { setUsername(null); setUser(null); };
  const onAdminLogin = () => setMode("admin");
  const onAdminLogout = () => { setMode("user"); setApg("dashboard"); };

  const recomputeAllUsers = useCallback(() => {
    const users = recomputeAndPersistUsers();
    if (username && users[username]) setUser(users[username]);
  }, [username]);

  useEffect(() => {
    if (!ready) return;
    const users = recomputeAndPersistUsers();
    if (username && users[username]) setUser(users[username]);
  }, [ready, username]);

  const onUpdate = useCallback((patch) => {
    const users = load("ifl_users", {});
    const updated = { ...users[username], ...patch };
    users[username] = updated;
    save("ifl_users", users);
    const recalculated = recomputeAndPersistUsers();
    setUser(recalculated[username] || updated);
  }, [username]);

  const USER_PAGES = ["predict", "build", "myteam", "leaderboard", "profile"];
  const USER_LABELS = { predict: "Predictions", build: "Build Team", myteam: "My Team", leaderboard: "Leaderboard", profile: "Profile" };
  const ADM_PAGES = ["dashboard", "players", "matches", "scoring", "users", "access"];
  const ADM_LABELS = { dashboard: "Dashboard", players: "Players", matches: "Matches", scoring: "Scoring", users: "Users", access: "Access" };

  if (!ready) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="login-bg">
          <div className="lcard card">
            <div className="lhero">
              <h1>IFL <span>2019</span></h1>
              <p>Loading league data...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const T = toast && <Toast key={toast.k} message={toast.msg} type={toast.type} onClose={() => setToast(null)} />;

  // Admin login
  if (mode === "admin-login") return (<><style>{STYLES}</style><AdminLoginPage onLogin={onAdminLogin} onGoUser={() => setMode("user")} />{T}</>);

  // Admin panel
  if (mode === "admin") return (
    <>
      <style>{STYLES}</style>
      <nav className="nav">
        <div className="nav-logo">IFL <span>2019</span> <span className="abadge">ADMIN</span></div>
        <div className="nav-links">
          {ADM_PAGES.map(p => <div key={p} className={`nav-link ${apg === p ? "aa" : ""}`} onClick={() => setApg(p)}>{ADM_LABELS[p]}</div>)}
          <button className="btn btn-secondary btn-sm" onClick={onAdminLogout} style={{ marginLeft: 8 }}>Logout</button>
        </div>
      </nav>
      <div className="adm-hdr">
        <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 13, color: "var(--adm)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>⚙ Admin Control Panel</div>
        <h2 style={{ fontSize: 26 }}>IFL 2019 — Administration</h2>
      </div>
      {apg === "dashboard" && <AdminDash />}
      {apg === "players" && <AdminPlayers showToast={showToast} />}
      {apg === "matches" && <AdminMatches showToast={showToast} onRecalculate={recomputeAllUsers} />}
      {apg === "scoring" && <AdminScoring showToast={showToast} onRecalculate={recomputeAllUsers} />}
      {apg === "users" && <AdminUsers showToast={showToast} onRecalculate={recomputeAllUsers} />}
      {apg === "access" && <AdminAccess showToast={showToast} />}
      {T}
    </>
  );

  // User not logged in
  if (!username) return (<><style>{STYLES}</style><LoginPage onLogin={onUserLogin} onGoAdmin={() => setMode("admin-login")} />{T}</>);

  // User app
  const totalPts = user.points || 0;
  const correct = Object.values(user.predictions || {}).filter(p => p.correct === true).length;

  return (
    <>
      <style>{STYLES}</style>
      <nav className="nav">
        <div className="nav-logo">IFL <span>2019</span></div>
        <div className="nav-links">
          {USER_PAGES.map(p => <div key={p} className={`nav-link ${upg === p ? "ua" : ""}`} onClick={() => setUpg(p)}>{USER_LABELS[p]}</div>)}
          <button className="btn btn-secondary btn-sm" onClick={onUserLogout} style={{ marginLeft: 8 }}>Logout</button>
        </div>
      </nav>

      {upg === "predict" && (
        <div className="hero-banner">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="avatar" style={{ width: 44, height: 44, fontSize: 18 }}>{(user.teamName || "?")[0]}</div>
            <div><h2 style={{ fontSize: 22 }}>{user.teamName}</h2><div style={{ color: "var(--muted)", fontSize: 13 }}>📱 {username}</div></div>
          </div>
          <div className="hstats">
            <div><div className="hstat-v">{totalPts}</div><div className="hstat-l">Points</div></div>
            <div><div className="hstat-v">{correct}</div><div className="hstat-l">Correct Picks</div></div>
            <div><div className="hstat-v">{(user.players || []).length}</div><div className="hstat-l">Squad Size</div></div>
            <div><div className="hstat-v">{Object.keys(user.predictions || {}).length}/{getMatches().length}</div><div className="hstat-l">Predicted</div></div>
          </div>
        </div>
      )}

      {upg === "predict" && <Predict user={user} onUpdate={onUpdate} showToast={showToast} />}
      {upg === "build" && <BuildTeam user={user} onUpdate={onUpdate} showToast={showToast} />}
      {upg === "myteam" && <MyTeam user={user} onUpdate={onUpdate} showToast={showToast} />}
      {upg === "leaderboard" && <Leaderboard me={username} />}
      {upg === "profile" && <Profile user={user} username={username} />}
      {T}
    </>
  );
}
