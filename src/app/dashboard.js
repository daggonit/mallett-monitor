"use client";
import { useState, useEffect, useCallback } from "react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const LOGO = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABQAFADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD1PJz1NLk+ppO5ooAXJ9TSZI7miigA3H1NG4+poxyAM5oIIOCMH0NAC5PqaMn1NJRQAuT6mgE5HJpKB1FAB3ozQaSgBaqXs8qLHBbbftM5KoWGQgH3nI7gDt3JA71a6VUtgZb66uGH3SII8/3V5b82J/75FAHD/EHw/wCJLu21DUNL16e1tY7NM2UQYtcsmST8v3T0HHXHNSfDjQfEVjotrdaprs8kVxE8i2bgsYt4XaSW53Lgnb05+tdb4gTzPDmpxlSwe1kUgdwVIxR4eQReG9MjClQlrGoU9gFAxQBZsbiSWN4rgKLmE7JdvQ8ZDD2Yc+3I7VZHSqk4MWo206jiUGCTH4sp/Agj/gVW6AFoHUUlKOooAWigdRRQBzfjjxTJ4Ts9Mu1SJoZ75IbjeCcRkEsVwevy9a62uN8f2EOqv4d0+4AMNzqZhfPo0Mg/rXZUAFFFFABRRRQAUUUUAFFFFAH/2Q==";

// ── Supabase config ──────────────────────────────────────────────────────────
const SUPA_PROJECT = "plmqthtdafqnkqrmgtos";
const SUPA_URL     = `https://${SUPA_PROJECT}.supabase.co`;
const SUPA_REST    = `${SUPA_URL}/rest/v1`;
const SUPA_AUTH    = `${SUPA_URL}/auth/v1`;
const SUPA_KEY     = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsbXF0aHRkYWZxbmtxcm1ndG9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1OTk0MzcsImV4cCI6MjA5MTE3NTQzN30.DPPq9pJjFZ8OkwdmRJbD5P4ZTc9LGNxIwSWha5lvCwU";
const ADMIN_EMAIL  = "mallettmadesolutions@gmail.com";

// ── Auth helpers ─────────────────────────────────────────────────────────────
const authHeaders = (token) => ({
  apikey: SUPA_KEY,
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

async function signIn(email, password) {
  const r = await fetch(`${SUPA_AUTH}/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: SUPA_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error_description || d.msg || "Login failed");
  return d; // { access_token, user, ... }
}

async function signOut(token) {
  await fetch(`${SUPA_AUTH}/logout`, {
    method: "POST",
    headers: authHeaders(token),
  });
}

// ── REST helpers (use user JWT, not anon key, so RLS applies) ────────────────
const supaFetch = async (token, table, query = "") => {
  const r = await fetch(`${SUPA_REST}/${table}?${query}`, {
    headers: authHeaders(token),
  });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
};

const supaUpsert = async (token, table, data) => {
  const r = await fetch(`${SUPA_REST}/${table}`, {
    method: "POST",
    headers: {
      ...authHeaders(token),
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
};

const supaInsert = async (token, table, data) => {
  const r = await fetch(`${SUPA_REST}/${table}`, {
    method: "POST",
    headers: {
      ...authHeaders(token),
      Prefer: "return=representation",
    },
    body: JSON.stringify(data),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    console.error("Insert error:", err);
    throw new Error(JSON.stringify(err));
  }
  return r.json();
};

const supaUpdate = async (token, table, id, data) => {
  const r = await fetch(`${SUPA_REST}/${table}?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      ...authHeaders(token),
      Prefer: "return=representation",
    },
    body: JSON.stringify(data),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    console.error("Update error:", err);
    throw new Error(JSON.stringify(err));
  }
  return r.json();
};

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = { bg: "#0c0d0f", surface: "#141517", surfaceLight: "#1c1d21", lime: "#7fff00", limeLight: "#a3ff4f", limeDark: "#5cc700", limeMuted: "#3a5c1a", limeGlow: "rgba(127,255,0,0.08)", limeBorder: "rgba(127,255,0,0.15)", silver: "#c0c0c8", silverLight: "#dcdce4", red: "#e85d5d", amber: "#e0a840", textPrimary: "#e8e8ec", textSecondary: "#9898a4", textMuted: "#585864", border: "rgba(200,200,220,0.1)", inputBg: "#111214", inputBorder: "rgba(127,255,0,0.2)" };

const INSULATION_TYPES = [{ id: "blown_thin", label: 'Blown Fiberglass (6-8")', rValue: 19 },{ id: "blown_thick", label: 'Blown Fiberglass (10-12")', rValue: 30 },{ id: "cellulose", label: 'Blown Cellulose (8-10")', rValue: 30 },{ id: "batts_r13", label: "Batts R-13", rValue: 13 },{ id: "batts_r19", label: "Batts R-19", rValue: 19 },{ id: "batts_r30", label: "Batts R-30", rValue: 30 },{ id: "batts_r38", label: "Batts R-38 (code)", rValue: 38 },{ id: "spray_open", label: "Open-Cell Spray", rValue: 25 },{ id: "spray_closed", label: "Closed-Cell Spray", rValue: 42 },{ id: "none", label: "Little / None", rValue: 4 }];
const SEER_BY_AGE = [{ id: "pre2000", label: "Pre-2000", seer: 9 },{ id: "2000_2005", label: "2000-05", seer: 11 },{ id: "2006_2015", label: "2006-15", seer: 13.5 },{ id: "2015_2022", label: "2015-22", seer: 15 },{ id: "2023_plus", label: "2023+", seer: 16 }];
const AC_TYPES = [{ id: "central", label: "Central AC", seer: 14 },{ id: "heat_pump", label: "Heat Pump", seer: 15 },{ id: "window", label: "Window Unit(s)", seer: 10 },{ id: "mini_split", label: "Mini-Split", seer: 18 },{ id: "evap", label: "Evaporative", seer: null },{ id: "none", label: "No AC", seer: null }];

function computeU(m) { if (!m?.length) return 0.05; const r = m.reduce((s, e) => { const t = INSULATION_TYPES.find(x => x.id === e.typeId); return s + (t ? t.rValue * (e.pct / 100) : 0); }, 0); return r > 0 ? +(1 / r).toFixed(4) : 0.05; }
function refAtticTemp(o) { if (o < 60) return o + 8; if (o < 80) return o + 15 + (o - 60) * 1.25; return o + 40 + (o - 80) * 0.8; }

function calcSavings(proj, rd) {
  if (!rd?.length || rd.length < 10 || !proj) return { kwhSaved: 0, dollarsSaved: 0, refDelta: 0, actualDelta: 0, reduction: 0, uValue: 0.05, cop: 4.1 };
  const ins = typeof proj.insulation === "string" ? JSON.parse(proj.insulation) : (proj.insulation || []);
  const u = proj.ceiling_u || computeU(ins), seer = proj.seer || 14, cop = seer / 3.412, sq = proj.sq_ft || 1800;
  let tR = 0, tA = 0; rd.forEach(r => { const o = +r.temp_outdoor; tR += refAtticTemp(o) - o; tA += +r.temp_attic - o; });
  const aR = tR / rd.length, aA = tA / rd.length, red = Math.max(0, aR - aA);
  const kwh = +(red * rd.length * 2 * sq * u / (cop * 3412)).toFixed(1);
  return { kwhSaved: kwh, dollarsSaved: +(kwh * (proj.utility_rate || 0.118)).toFixed(2), refDelta: +aR.toFixed(1), actualDelta: +aA.toFixed(1), reduction: +red.toFixed(1), uValue: +u.toFixed(4), cop: +cop.toFixed(2) };
}
function getCumData(proj, rd) {
  if (!rd?.length || rd.length < 10 || !proj) return [];
  const ins = typeof proj.insulation === "string" ? JSON.parse(proj.insulation) : (proj.insulation || []);
  const u = proj.ceiling_u || computeU(ins), cop = (proj.seer || 14) / 3.412, sq = proj.sq_ft || 1800, rate = proj.utility_rate || 0.118;
  const dm = {}; rd.forEach(x => { const d = new Date(x.recorded_at).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/New_York" }); if (!dm[d]) dm[d] = []; dm[d].push(x); });
  let ck = 0, cd = 0;
  return Object.entries(dm).map(([day, a]) => { const rD = a.reduce((s, x) => s + (refAtticTemp(+x.temp_outdoor) - +x.temp_outdoor), 0) / a.length; const aD = a.reduce((s, x) => s + (+x.temp_attic - +x.temp_outdoor), 0) / a.length; const red = Math.max(0, rD - aD); const b = red * a.length * 2 * sq * u; ck += b / (cop * 3412); cd += (b / (cop * 3412)) * rate; return { day, kwh: +ck.toFixed(1), dollars: +cd.toFixed(2) }; });
}
function fmtChart(rd, days) {
  if (!rd.length) return []; const sr = Math.max(1, Math.floor(rd.length / 60));
  return rd.filter((_, i) => i % sr === 0).map(r => { const d = new Date(r.recorded_at), o = +r.temp_outdoor; let l; if (days <= 1) l = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" }); else if (days <= 7) l = d.toLocaleDateString("en-US", { weekday: "short", hour: "numeric", timeZone: "America/New_York" }); else l = d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/New_York" }); return { label: l, attic: +r.temp_attic, outdoor: o, refAttic: Math.round(refAtticTemp(o)) }; });
}

const hd = "'Rajdhani', sans-serif", bd = "'Exo 2', sans-serif", mn = "'Share Tech Mono', monospace";
const inp = { background: C.inputBg, border: `1px solid ${C.inputBorder}`, borderRadius: 6, padding: "9px 12px", color: C.textPrimary, fontSize: 13, fontFamily: bd, outline: "none", width: "100%" };
const lbl = { fontSize: 10, color: C.textMuted, fontFamily: mn, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6, display: "block" };
const crd = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.3)" };
const btn = (on) => ({ padding: "5px 12px", fontSize: 11, fontFamily: mn, cursor: "pointer", borderRadius: 6, border: `1px solid ${on ? C.lime : C.border}`, background: on ? "rgba(127,255,0,0.1)" : "transparent", color: on ? C.lime : C.textMuted, fontWeight: on ? 600 : 400 });
const dt = { ...inp, width: "auto", fontSize: 11, padding: "5px 8px", colorScheme: "dark" };

// ── Login screen ──────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [email, setEmail] = useState(""), [pass, setPass] = useState(""), [err, setErr] = useState(""), [loading, setLoading] = useState(false);

  const doLogin = async () => {
    if (!email || !pass) { setErr("Enter email and password"); return; }
    setLoading(true); setErr("");
    try {
      const session = await signIn(email, pass);
      onLogin(session);
    } catch (e) {
      setErr(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: `radial-gradient(ellipse at 30% 20%, ${C.limeGlow}, transparent 60%), ${C.bg}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: bd }}>
      <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Exo+2:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
      <div style={{ width: 380, ...crd, padding: "44px 36px", textAlign: "center" }}>
        <img src={LOGO} alt="" style={{ width: 80, height: 80, borderRadius: 12, objectFit: "cover", marginBottom: 20, border: `2px solid ${C.limeMuted}` }} />
        <h1 style={{ fontFamily: hd, fontWeight: 700, fontSize: 28, color: C.textPrimary, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 }}>Mallett Made</h1>
        <div style={{ fontSize: 11, color: C.lime, fontFamily: mn, letterSpacing: "0.2em", marginBottom: 32 }}>RADIANT MONITOR</div>
        <div style={{ textAlign: "left", marginBottom: 14 }}>
          <label style={lbl}>Email</label>
          <input type="email" value={email} onChange={x => setEmail(x.target.value)} style={inp} placeholder="you@example.com" />
        </div>
        <div style={{ textAlign: "left", marginBottom: 20 }}>
          <label style={lbl}>Password</label>
          <input type="password" value={pass} onChange={x => setPass(x.target.value)} style={inp} placeholder="••••••••" onKeyDown={x => x.key === "Enter" && doLogin()} />
        </div>
        {err && <div style={{ color: C.red, fontSize: 12, marginBottom: 12 }}>{err}</div>}
        <button onClick={doLogin} disabled={loading} style={{ width: "100%", padding: "12px 0", background: `linear-gradient(135deg, ${C.limeDark}, ${C.limeMuted})`, color: "#0c0d0f", border: "none", borderRadius: 8, fontSize: 14, fontFamily: hd, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", letterSpacing: "0.08em", textTransform: "uppercase", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Pill({ label, value, unit, accent }) { return (<div style={{ ...crd, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 4, minWidth: 110 }}><span style={{ fontSize: 9, color: C.textMuted, fontFamily: mn, letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</span><span style={{ fontSize: 24, fontWeight: 700, color: C.textPrimary, fontFamily: hd }}>{value ?? "—"}<span style={{ fontSize: 12, color: accent, marginLeft: 4, fontFamily: mn }}>{unit}</span></span></div>); }
const TT = ({ active, payload, label }) => { if (!active || !payload?.length) return null; return (<div style={{ background: C.surface, border: `1px solid ${C.limeBorder}`, borderRadius: 8, padding: "10px 14px", fontSize: 12, fontFamily: mn, boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}><div style={{ color: C.textMuted, marginBottom: 6 }}>{label}</div>{payload.map(p => (<div key={p.dataKey} style={{ color: p.color, marginBottom: 3 }}>{p.name}: {p.value}{p.dataKey === "dollars" ? "" : p.dataKey === "kwh" ? " kWh" : "°F"}</div>))}</div>); };

function SideCard({ project: p, sel, onClick, readings: rd }) {
  const lat = rd?.[rd.length - 1], sav = calcSavings(p, rd), has = !!lat;
  return (<div onClick={onClick} style={{ cursor: "pointer", ...crd, background: sel ? C.surfaceLight : C.surface, borderColor: sel ? C.lime : C.border, padding: "14px 16px", position: "relative", overflow: "hidden" }}>
    {sel && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${C.lime}, ${C.amber})` }} />}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
      <div><div style={{ color: C.textPrimary, fontWeight: 600, fontSize: 14, fontFamily: hd }}>{p.address}</div><div style={{ color: C.textMuted, fontSize: 11, fontFamily: mn, marginTop: 2 }}>{p.city}</div></div>
      <div style={{ background: has ? "rgba(127,255,0,0.1)" : "rgba(224,168,64,0.1)", color: has ? C.lime : C.amber, fontSize: 9, padding: "2px 8px", borderRadius: 20, fontFamily: mn }}>{has ? "LIVE" : "NO DATA"}</div>
    </div>
    {has && <div style={{ display: "flex", gap: 12 }}>
      <div><div style={{ color: C.textMuted, fontSize: 9, fontFamily: mn }}>ATTIC</div><div style={{ color: C.red, fontSize: 16, fontWeight: 700, fontFamily: hd }}>{lat.temp_attic}°</div></div>
      <div><div style={{ color: C.textMuted, fontSize: 9, fontFamily: mn }}>OUTSIDE</div><div style={{ color: C.amber, fontSize: 16, fontWeight: 700, fontFamily: hd }}>{lat.temp_outdoor}°</div></div>
      <div style={{ marginLeft: "auto", textAlign: "right" }}><div style={{ color: C.textMuted, fontSize: 9, fontFamily: mn }}>SAVED</div><div style={{ color: C.lime, fontSize: 16, fontWeight: 700, fontFamily: hd }}>${sav.dollarsSaved}</div></div>
    </div>}
  </div>);
}

function InsulSel({ value, onChange }) {
  const [sel, setSel] = useState(value || []);
  const tog = id => { let n = sel.find(s => s.typeId === id) ? sel.filter(s => s.typeId !== id) : [...sel, { typeId: id, pct: 0 }]; const ev = n.length ? Math.floor(100 / n.length) : 0, rm = n.length ? 100 - ev * n.length : 0; n = n.map((s, i) => ({ ...s, pct: ev + (i === 0 ? rm : 0) })); setSel(n); onChange(n); };
  const upd = (id, v) => { const n = sel.map(s => s.typeId === id ? { ...s, pct: Math.max(0, Math.min(100, Number(v) || 0)) } : s); setSel(n); onChange(n); };
  const tot = sel.reduce((s, e) => s + e.pct, 0);
  return (<div><label style={lbl}>Insulation (select all present)</label><div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>{INSULATION_TYPES.map(t => { const on = !!sel.find(s => s.typeId === t.id); return (<button key={t.id} onClick={() => tog(t.id)} style={{ ...btn(on), fontSize: 12, fontFamily: bd }}>{t.label}</button>); })}</div>
    {sel.length > 1 && (<div style={{ background: C.inputBg, borderRadius: 8, padding: 12, border: `1px solid ${C.border}` }}><div style={{ fontSize: 10, color: C.textMuted, fontFamily: mn, marginBottom: 8 }}>COVERAGE % {tot !== 100 && <span style={{ color: C.red, marginLeft: 8 }}>Total: {tot}%</span>}{tot === 100 && <span style={{ color: C.lime, marginLeft: 8 }}>✓</span>}</div>{sel.map(s => { const t = INSULATION_TYPES.find(x => x.id === s.typeId); return (<div key={s.typeId} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}><span style={{ color: C.textSecondary, fontSize: 12, fontFamily: bd, minWidth: 160 }}>{t?.label}</span><input type="number" min="0" max="100" value={s.pct} onChange={e => upd(s.typeId, e.target.value)} style={{ ...inp, width: 65, textAlign: "center" }} /><span style={{ color: C.textMuted, fontSize: 12 }}>%</span></div>); })}<div style={{ marginTop: 6, fontSize: 11, color: C.textMuted, fontFamily: mn }}>Blended: <span style={{ color: C.lime }}>R-{(1 / computeU(sel)).toFixed(1)}</span></div></div>)}
    {sel.length === 1 && <div style={{ fontSize: 11, color: C.textMuted, fontFamily: mn, marginTop: 4 }}>R: <span style={{ color: C.lime }}>R-{INSULATION_TYPES.find(x => x.id === sel[0].typeId)?.rValue}</span></div>}
  </div>);
}

// ── Intake / Edit form (admin only) ──────────────────────────────────────────
function IntakeForm({ project: p, onSave, onCancel, isNew }) {
  const ins = typeof p?.insulation === "string" ? JSON.parse(p.insulation) : (p?.insulation || []);
  const [addr, setAddr] = useState(p?.address || "");
  const [city, setCity] = useState(p?.city || "");
  const [custEmail, setCustEmail] = useState(p?.customer_email || "");
  const [installDate, setInstallDate] = useState(p?.install_date ? p.install_date.slice(0, 10) : new Date().toISOString().slice(0, 10));
  const [sq, setSq] = useState(p?.sq_ft || ""), [ht, setHt] = useState(p?.hvac_tons || ""), [se, setSe] = useState(p?.seer || 14), [ss, setSs] = useState(p?.seer_source || "exact");
  const [ur, setUr] = useState(p?.utility_rate || 0.118), [insul, setInsul] = useState(ins), [acType, setAcType] = useState(p?.ac_type || "central");
  const [acCount, setAcCount] = useState(p?.ac_count || 1), [thermo, setThermo] = useState(p?.thermostat_temp || 72);
  const [seerMode, setSeerMode] = useState(ss), [ag, setAg] = useState("2006_2015");
  const swSeer = m => { setSeerMode(m); setSs(m); if (m === "age") { const g = SEER_BY_AGE.find(x => x.id === ag); setSe(g?.seer || 13); } };
  const selAc = id => { setAcType(id); const t = AC_TYPES.find(x => x.id === id); if (t?.seer) setSe(t.seer); };

  return (<div style={{ ...crd, padding: 24 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
      <div style={{ fontFamily: hd, fontWeight: 700, fontSize: 20, color: C.textPrimary, textTransform: "uppercase" }}>{isNew ? "New Project" : "Edit Project"}</div>
      <div style={{ fontSize: 10, color: C.textMuted, fontFamily: mn, background: C.inputBg, padding: "4px 10px", borderRadius: 6 }}>Admin</div>
    </div>

    {/* Location + customer */}
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>
      <div><label style={lbl}>Street Address</label><input value={addr} onChange={e => setAddr(e.target.value)} style={inp} placeholder="123 Main St" /></div>
      <div><label style={lbl}>City</label><input value={city} onChange={e => setCity(e.target.value)} style={inp} placeholder="Raleigh, NC" /></div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>
      <div><label style={lbl}>Customer Email (for portal access)</label><input type="email" value={custEmail} onChange={e => setCustEmail(e.target.value)} style={inp} placeholder="customer@email.com" /><div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>They log in with this email to see their project</div></div>
      <div><label style={lbl}>Install Date</label><input type="date" value={installDate} onChange={e => setInstallDate(e.target.value)} style={{ ...inp, colorScheme: "dark" }} /></div>
    </div>

    {/* Specs */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
      <div><label style={lbl}>Ceiling Sq Ft</label><input type="number" value={sq} onChange={e => setSq(e.target.value)} style={inp} placeholder="1850" /><div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>Top-floor footprint</div></div>
      <div><label style={lbl}>HVAC Tonnage</label><input type="number" step="0.5" value={ht} onChange={e => setHt(e.target.value)} style={inp} placeholder="3" /><div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>Outdoor unit data plate</div></div>
      <div><label style={lbl}>Utility $/kWh</label><input type="number" step="0.001" value={ur} onChange={e => setUr(Number(e.target.value))} style={inp} placeholder="0.118" /><div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>NC avg ~$0.118</div></div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
      <div><label style={lbl}>AC System Type</label><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{AC_TYPES.map(t => (<button key={t.id} onClick={() => selAc(t.id)} style={{ ...btn(acType === t.id), fontSize: 11, fontFamily: bd }}>{t.label}</button>))}</div>
        <div style={{ fontSize: 10, color: C.textMuted, marginTop: 6 }}>{acType === "window" ? "Count all window units" : acType === "evap" ? "Savings calc differs for evap" : acType === "none" ? "Comfort improvement only" : acType === "mini_split" ? "Ductless — may differ from ducted" : "Standard ducted"}</div>
      </div>
      <div><label style={lbl}>{acType === "window" ? "# Units" : "# Systems"}</label><input type="number" min="1" max="10" value={acCount} onChange={e => setAcCount(Number(e.target.value))} style={inp} /></div>
      <div><label style={lbl}>Thermostat °F</label><input type="number" min="60" max="85" value={thermo} onChange={e => setThermo(Number(e.target.value))} style={inp} placeholder="72" /></div>
    </div>
    <div style={{ marginBottom: 20 }}><label style={lbl}>SEER Rating</label><div style={{ background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>{[["exact", "Found SEER"], ["age", "Estimate by age"]].map(([v, l]) => (<button key={v} onClick={() => swSeer(v)} style={btn(seerMode === v)}>{l}</button>))}</div>
      {seerMode === "exact" ? (<div><input type="number" min="6" max="30" step="0.5" value={se} onChange={e => setSe(Number(e.target.value))} style={{ ...inp, marginBottom: 8 }} /><div style={{ fontSize: 11, color: C.textMuted }}><span style={{ color: C.lime }}>Where:</span> Yellow EnergyGuide sticker on condenser</div></div>
      ) : (<div><div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>{SEER_BY_AGE.map(g => (<button key={g.id} onClick={() => { setAg(g.id); setSe(g.seer); }} style={btn(ag === g.id)}>{g.label} ~{g.seer}</button>))}</div><div style={{ fontSize: 11, color: C.textMuted }}>Data plate on outdoor unit</div></div>)}
    </div><div style={{ fontSize: 11, color: C.textMuted, fontFamily: mn, marginTop: 6 }}>SEER: <span style={{ color: C.lime }}>{se}</span> → COP: <span style={{ color: C.lime }}>{(se / 3.412).toFixed(2)}</span></div></div>
    <div style={{ marginBottom: 20 }}><InsulSel value={insul} onChange={setInsul} /></div>
    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
      {onCancel && <button onClick={onCancel} style={{ ...btn(false), padding: "9px 20px" }}>Cancel</button>}
      <button onClick={() => onSave({
        address: addr, city, customer_email: custEmail || null, install_date: installDate,
        sq_ft: Number(sq), hvac_tons: Number(ht), seer: se, seer_source: ss,
        utility_rate: ur, insulation: JSON.stringify(insul), ceiling_u: computeU(insul),
        ac_type: acType, ac_count: acCount, thermostat_temp: thermo
      })} style={{ background: `linear-gradient(135deg, ${C.limeDark}, ${C.limeMuted})`, border: "none", borderRadius: 8, padding: "9px 24px", color: "#0c0d0f", fontSize: 13, fontFamily: hd, fontWeight: 700, cursor: "pointer", textTransform: "uppercase" }}>
        {isNew ? "Create Project" : "Save Changes"}
      </button>
    </div>
  </div>);
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [session, setSession] = useState(null);   // { access_token, user }
  const [isAdmin, setIsAdmin] = useState(false);
  const [projects, setProjects] = useState([]);
  const [readings, setReadings] = useState({});
  const [selId, setSelId] = useState(null);
  const [form, setForm] = useState(false);
  const [addingNew, setAddingNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savMode, setSavMode] = useState("period");

  const toL = d => { const o = d.getTimezoneOffset(); return new Date(d.getTime() - o * 60000).toISOString().slice(0, 16); };
  const [sd, setSd] = useState(() => { const d = new Date(); d.setDate(d.getDate() - 7); return toL(d); });
  const [ed, setEd] = useState(() => toL(new Date()));
  const qr = days => { const e = new Date(), s = new Date(); s.setDate(s.getDate() - days); setSd(toL(s)); setEd(toL(e)); };

  const token = session?.access_token;

  const loadP = useCallback(async () => {
    if (!token) return;
    try {
      const d = await supaFetch(token, "projects", "select=*&order=install_date.desc");
      setProjects(d);
      if (d.length && !selId) setSelId(d[0].id);
    } catch (e) { console.error(e); }
  }, [token, selId]);

  const loadR = useCallback(async pid => {
    if (!token) return;
    try {
      const d = await supaFetch(token, "readings", `select=*&project_id=eq.${pid}&order=recorded_at.asc&limit=10000`);
      setReadings(p => ({ ...p, [pid]: d }));
    } catch (e) { console.error(e); }
  }, [token]);

  useEffect(() => {
    if (session) {
      const email = session.user?.email || "";
      setIsAdmin(email === ADMIN_EMAIL);
      setLoading(true);
      loadP().then(() => setLoading(false));
    }
  }, [session]);

  useEffect(() => { if (selId && session) loadR(selId); }, [selId, session, loadR]);
  useEffect(() => { if (!session || !selId) return; const i = setInterval(() => loadR(selId), 60000); return () => clearInterval(i); }, [session, selId, loadR]);

  const handleLogin = (sess) => { setSession(sess); };
  const handleSignOut = async () => { if (token) await signOut(token); setSession(null); setProjects([]); setReadings({}); setSelId(null); };

  if (!session) return <Login onLogin={handleLogin} />;

  const proj = projects.find(p => p.id === selId), allR = readings[selId] || [];
  const sMs = new Date(sd).getTime(), eMs = new Date(ed).getTime(), days = (eMs - sMs) / 86400000;
  const fR = allR.filter(r => { const t = new Date(r.recorded_at).getTime(); return t >= sMs && t <= eMs; });
  const savAll = calcSavings(proj, allR), savPer = calcSavings(proj, fR), sav = savMode === "all" ? savAll : savPer;
  const lat = allR[allR.length - 1], cum = getCumData(proj, savMode === "all" ? allR : fR), cd = fmtChart(fR, days);
  const totD = projects.reduce((s, p) => s + calcSavings(p, readings[p.id] || []).dollarsSaved, 0);
  const totK = projects.reduce((s, p) => s + calcSavings(p, readings[p.id] || []).kwhSaved, 0);
  const uV = proj ? (proj.ceiling_u || computeU(typeof proj.insulation === "string" ? JSON.parse(proj.insulation) : (proj.insulation || []))) : 0.05;

  const saveEdit = async data => {
    try { await supaUpdate(token, "projects", selId, data); await loadP(); setForm(false); }
    catch (e) { alert("Save failed: " + e.message); }
  };

  const createProject = async data => {
    try {
      const [created] = await supaInsert(token, "projects", data);
      await loadP();
      setSelId(created.id);
      setAddingNew(false);
    } catch (e) { alert("Create failed: " + e.message); }
  };

  return (<div style={{ minHeight: "100vh", background: C.bg, color: C.textPrimary, fontFamily: bd }}>
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Exo+2:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
    <style>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${C.limeMuted};border-radius:2px}input:focus{border-color:${C.lime}!important;box-shadow:0 0 0 3px rgba(127,255,0,0.1)}input::placeholder{color:${C.textMuted}}`}</style>

    {/* Header */}
    <div style={{ borderBottom: `1px solid ${C.border}`, padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: C.surface, position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <img src={LOGO} alt="" style={{ width: 38, height: 38, borderRadius: 8, objectFit: "cover", border: `2px solid ${C.limeMuted}` }} />
        <div>
          <div style={{ fontFamily: hd, fontWeight: 700, fontSize: 20, color: C.textPrimary, letterSpacing: "0.08em", textTransform: "uppercase" }}>Mallett Made</div>
          <div style={{ fontSize: 9, color: C.lime, fontFamily: mn, letterSpacing: "0.2em" }}>RADIANT MONITOR</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {isAdmin && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: C.textMuted, fontFamily: mn }}>ALL SITES · TOTAL</div>
            <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.lime, fontFamily: hd }}>${totD.toFixed(2)}</div>
              <div style={{ fontSize: 13, color: C.amber, fontFamily: mn }}>{totK.toFixed(0)} kWh</div>
            </div>
          </div>
        )}
        {isAdmin && <div style={{ background: "rgba(127,255,0,0.06)", border: `1px solid ${C.limeBorder}`, borderRadius: 8, padding: "5px 14px", fontSize: 11, color: C.silver, fontFamily: mn }}>{projects.length} sites</div>}
        <div style={{ fontSize: 10, color: C.textMuted, fontFamily: mn, background: C.inputBg, padding: "4px 10px", borderRadius: 6 }}>{isAdmin ? "ADMIN" : session.user?.email}</div>
        <button onClick={handleSignOut} style={btn(false)}>Sign Out</button>
      </div>
    </div>

    {loading ? (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
        <style>{`@keyframes sp{to{transform:rotate(360deg)}}`}</style>
        <div style={{ width: 32, height: 32, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.lime}`, borderRadius: "50%", animation: "sp 0.8s linear infinite" }} />
      </div>
    ) : (
      <div style={{ display: "flex", height: "calc(100vh - 61px)" }}>

        {/* Sidebar */}
        <div style={{ width: 274, borderRight: `1px solid ${C.border}`, padding: "18px 14px", overflowY: "auto", flexShrink: 0, display: "flex", flexDirection: "column", gap: 8, background: C.surface }}>
          <div style={{ fontSize: 9, color: C.textMuted, fontFamily: mn, letterSpacing: "0.15em", marginBottom: 4 }}>LOCATIONS</div>
          {projects.map(p => (
            <SideCard key={p.id} project={p} sel={p.id === selId} onClick={() => { setSelId(p.id); setForm(false); setAddingNew(false); loadR(p.id); }} readings={readings[p.id] || []} />
          ))}
          {!projects.length && <div style={{ color: C.textMuted, fontSize: 13, padding: 12 }}>No projects yet.</div>}

          {/* Add Project button — admin only */}
          {isAdmin && (
            <button onClick={() => { setAddingNew(true); setForm(false); setSelId(null); }} style={{ marginTop: 8, width: "100%", padding: "10px 0", background: "transparent", border: `1px dashed ${C.limeMuted}`, borderRadius: 8, color: C.lime, fontFamily: mn, fontSize: 11, cursor: "pointer", letterSpacing: "0.1em" }}>
              + Add Project
            </button>
          )}
        </div>

        {/* Main content */}
        {addingNew ? (
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", background: C.bg }}>
            <IntakeForm project={null} isNew onSave={createProject} onCancel={() => setAddingNew(false)} />
          </div>
        ) : proj ? (
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", background: `radial-gradient(ellipse at 70% 10%, ${C.limeGlow}, transparent 50%), ${C.bg}` }}>
            <div style={{ marginBottom: 20, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <h1 style={{ fontFamily: hd, fontWeight: 700, fontSize: 30, color: C.textPrimary, textTransform: "uppercase" }}>{proj.address}</h1>
                <div style={{ color: C.textMuted, fontSize: 12, fontFamily: mn, marginTop: 4 }}>{proj.city} {proj.install_date && `· ${new Date(proj.install_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`} {proj.sq_ft && `· ${proj.sq_ft.toLocaleString()} sqft`}</div>
                <div style={{ color: C.textMuted, fontSize: 10, fontFamily: mn, marginTop: 2 }}>{allR.length} readings{lat && ` · Last: ${new Date(lat.recorded_at).toLocaleString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}`}</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <button onClick={() => loadR(selId)} style={btn(false)}>↻</button>
                {/* Edit button — admin only */}
                {isAdmin && <button onClick={() => setForm(!form)} style={btn(form)}>{form ? "✕" : "✎ Edit"}</button>}
                {[["1d", 1], ["7d", 7], ["14d", 14], ["30d", 30], ["All", 365]].map(([l, d]) => <button key={l} onClick={() => qr(d)} style={btn(false)}>{l}</button>)}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, color: C.textMuted, fontFamily: mn }}>FROM</span><input type="datetime-local" value={sd} onChange={e => setSd(e.target.value)} style={dt} />
              <span style={{ fontSize: 10, color: C.textMuted, fontFamily: mn }}>TO</span><input type="datetime-local" value={ed} onChange={e => setEd(e.target.value)} style={dt} />
              <span style={{ fontSize: 11, color: C.textMuted, fontFamily: mn }}>{fR.length}/{allR.length}</span>
            </div>

            {form && isAdmin && <div style={{ marginBottom: 24 }}><IntakeForm project={proj} onSave={saveEdit} onCancel={() => setForm(false)} /></div>}

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <button onClick={() => setSavMode("period")} style={btn(savMode === "period")}>Selected Period</button>
              <button onClick={() => setSavMode("all")} style={btn(savMode === "all")}>All Time</button>
              <span style={{ fontSize: 10, color: C.textMuted, fontFamily: mn }}>{savMode === "period" ? `${fR.length} readings` : `${allR.length} total`}</span>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
              <Pill label="Attic" value={lat?.temp_attic} unit="°F" accent={C.red} />
              <Pill label="Outdoor" value={lat?.temp_outdoor} unit="°F" accent={C.amber} />
              <Pill label="Attic Δ" value={sav.actualDelta} unit="°F" accent={C.amber} />
              <Pill label="Barrier Reduction" value={sav.reduction} unit="°F" accent={C.lime} />
              <Pill label="kWh Saved" value={sav.kwhSaved} unit="kWh" accent={C.lime} />
              <Pill label="$ Saved" value={`$${sav.dollarsSaved}`} unit="" accent={C.limeLight} />
            </div>

            {cd.length > 0 ? (<div style={{ ...crd, padding: "20px 16px 12px", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, padding: "0 8px" }}>
                <div style={{ fontFamily: hd, fontWeight: 700, fontSize: 17, color: C.textPrimary, textTransform: "uppercase" }}>Temperature</div>
                <div style={{ display: "flex", gap: 14 }}>{[[C.red, "Attic"], ["#ff6b6b", "No Barrier (est.)"], [C.amber, "Outdoor"]].map(([c, l]) => (<div key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: C.textMuted, fontFamily: mn }}><div style={{ width: 14, height: 2, background: c, opacity: l.includes("est") ? 0.5 : 1 }} />{l}</div>))}</div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={cd} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <XAxis dataKey="label" tick={{ fill: C.textMuted, fontSize: 9, fontFamily: mn }} tickLine={false} axisLine={false} interval={Math.max(0, Math.floor(cd.length / 8) - 1)} angle={-30} textAnchor="end" height={45} />
                  <YAxis tick={{ fill: C.textMuted, fontSize: 10, fontFamily: mn }} tickLine={false} axisLine={false} />
                  <Tooltip content={<TT />} />
                  <Line type="monotone" dataKey="refAttic" name="No Barrier (est.)" stroke="#ff6b6b" strokeWidth={1.5} dot={false} strokeDasharray="6 3" strokeOpacity={0.5} />
                  <Line type="monotone" dataKey="attic" name="Attic" stroke={C.red} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="outdoor" name="Outdoor" stroke={C.amber} strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                </LineChart>
              </ResponsiveContainer>
            </div>) : (<div style={{ ...crd, padding: 40, marginBottom: 16, textAlign: "center" }}><div style={{ color: C.textMuted }}>No data in range</div></div>)}

            {cum.length > 0 && (<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div style={{ ...crd, padding: "20px 16px 12px" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "0 8px" }}><div style={{ fontFamily: hd, fontWeight: 700, fontSize: 15, color: C.textPrimary, textTransform: "uppercase" }}>Cumulative $</div><div style={{ fontFamily: hd, fontWeight: 700, fontSize: 24, color: C.lime }}>${cum[cum.length - 1]?.dollars || 0}</div></div>
                <ResponsiveContainer width="100%" height={140}><AreaChart data={cum} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}><defs><linearGradient id="gD" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.lime} stopOpacity={0.2} /><stop offset="100%" stopColor={C.lime} stopOpacity={0.02} /></linearGradient></defs><XAxis dataKey="day" tick={{ fill: C.textMuted, fontSize: 9, fontFamily: mn }} tickLine={false} axisLine={false} interval="preserveStartEnd" /><YAxis tick={{ fill: C.textMuted, fontSize: 9, fontFamily: mn }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} /><Tooltip content={<TT />} /><Area type="monotone" dataKey="dollars" name="$ Saved" stroke={C.lime} strokeWidth={2} fill="url(#gD)" /></AreaChart></ResponsiveContainer></div>
              <div style={{ ...crd, padding: "20px 16px 12px" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "0 8px" }}><div style={{ fontFamily: hd, fontWeight: 700, fontSize: 15, color: C.textPrimary, textTransform: "uppercase" }}>Cumulative kWh</div><div style={{ fontFamily: hd, fontWeight: 700, fontSize: 24, color: C.amber }}>{cum[cum.length - 1]?.kwh || 0}</div></div>
                <ResponsiveContainer width="100%" height={140}><AreaChart data={cum} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}><defs><linearGradient id="gK" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.amber} stopOpacity={0.2} /><stop offset="100%" stopColor={C.amber} stopOpacity={0.02} /></linearGradient></defs><XAxis dataKey="day" tick={{ fill: C.textMuted, fontSize: 9, fontFamily: mn }} tickLine={false} axisLine={false} interval="preserveStartEnd" /><YAxis tick={{ fill: C.textMuted, fontSize: 9, fontFamily: mn }} tickLine={false} axisLine={false} /><Tooltip content={<TT />} /><Area type="monotone" dataKey="kwh" name="kWh" stroke={C.amber} strokeWidth={2} fill="url(#gK)" /></AreaChart></ResponsiveContainer></div>
            </div>)}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ ...crd, padding: 20 }}><div style={{ fontFamily: hd, fontWeight: 700, fontSize: 15, marginBottom: 16, color: C.textPrimary, textTransform: "uppercase" }}>Savings</div>
                {[["Ref. Δ (no barrier)", `${sav.refDelta}°F`, "#ff6b6b"], ["Actual Δ (w/ barrier)", `${sav.actualDelta}°F`, C.amber], ["Barrier Reduction", `${sav.reduction}°F`, C.lime], ["U-Value", `${typeof uV === "number" ? uV.toFixed(4) : uV}`, C.textSecondary], ["SEER / COP", `${proj.seer || 14} / ${sav.cop}`, C.silver], ["kWh Saved", `${sav.kwhSaved}`, C.lime], ["$ Saved", `$${sav.dollarsSaved}`, C.limeLight], ["Rate", `$${proj.utility_rate || 0.118}/kWh`, C.textMuted]].map(([l, v, c]) => (<div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 12 }}><span style={{ color: C.textMuted, fontFamily: mn }}>{l}</span><span style={{ color: c, fontWeight: 600, fontFamily: mn }}>{v}</span></div>))}
                <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 12, paddingTop: 12 }}><div style={{ fontSize: 10, color: C.textMuted, fontFamily: mn, marginBottom: 8 }}>REFERENCES</div><div style={{ fontSize: 11, color: C.textSecondary, lineHeight: 1.6 }}>DOE/ORNL field studies, SE US, dark shingles</div>
                  {[["ORNL/CON-275", "Radiant Barrier Fact Sheet"], ["DOE/CE-0335P", "Attic Fact Sheet"], ["FSEC-CR-1231-01", "FL Solar Energy Center"]].map(([id, t]) => (<div key={id} style={{ fontSize: 10, fontFamily: mn, color: C.textMuted, marginTop: 4 }}><span style={{ color: C.lime }}>{id}</span> — {t}</div>))}</div>
              </div>
              <div style={{ ...crd, padding: 20 }}><div style={{ fontFamily: hd, fontWeight: 700, fontSize: 15, marginBottom: 16, color: C.textPrimary, textTransform: "uppercase" }}>Specs</div>
                {[["Sq Ft", proj.sq_ft ? `${proj.sq_ft.toLocaleString()}` : "—"], ["HVAC", proj.hvac_tons ? `${proj.hvac_tons} tons` : "—"], ["AC Type", AC_TYPES.find(t => t.id === (proj.ac_type || "central"))?.label || "Central"], ["Thermostat", proj.thermostat_temp ? `${proj.thermostat_temp}°F` : "—"], ["SEER", `${proj.seer || 14} (${proj.seer_source || "est."})`], ["R-Value", `R-${typeof uV === "number" ? (1 / uV).toFixed(1) : "—"}`], ["Attic Sensor", proj.sensor_attic || "—"], ["Outdoor Sensor", proj.sensor_outdoor || "—"]].map(([l, v]) => (<div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 12, gap: 12 }}><span style={{ color: C.textMuted, fontFamily: mn, flexShrink: 0 }}>{l}</span><span style={{ color: C.silver, fontFamily: mn, textAlign: "right" }}>{v}</span></div>))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ color: C.textMuted, fontSize: 16 }}>No project selected</div>
          </div>
        )}
      </div>
    )}
  </div>);
}
