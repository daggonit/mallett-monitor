"use client";
import { useState, useEffect, useCallback } from "react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const LOGO = "data:image/jpeg;base64,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";

const SUPA_URL = "https://plmqthtdafqnkqrmgtos.supabase.co/rest/v1";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsbXF0aHRkYWZxbmtxcm1ndG9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1OTk0MzcsImV4cCI6MjA5MTE3NTQzN30.DPPq9pJjFZ8OkwdmRJbD5P4ZTc9LGNxIwSWha5lvCwU";

const supaFetch = async (table, query = "") => {
  const res = await fetch(`${SUPA_URL}/${table}?${query}`, { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } });
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
  return res.json();
};
const supaUpsert = async (table, data) => {
  const res = await fetch(`${SUPA_URL}/${table}`, { method: "POST", headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=representation" }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error(`Supabase upsert error: ${res.status}`);
  return res.json();
};

// ─── Purple Industrial Palette ──────────────────────────────────────────────
const C = {
  bg: "#111016", surface: "#1a1821", surfaceLight: "#221f2b",
  purple: "#7c5cbf", purpleLight: "#9b7fd4", purpleDark: "#5a3d96",
  purpleMuted: "#4a3a6b", purpleGlow: "rgba(124,92,191,0.15)",
  amber: "#d4a24c", amberLight: "#e0b96a",
  red: "#c45e5e", teal: "#4ca8a0",
  textPrimary: "#e8e4ef", textSecondary: "#9890a8", textMuted: "#5e586e",
  border: "rgba(124,92,191,0.15)", borderLight: "rgba(124,92,191,0.08)",
  cardBg: "rgba(26,24,33,0.8)", inputBg: "#16141d", inputBorder: "rgba(124,92,191,0.25)",
  white: "#ffffff",
};

const INSULATION_TYPES = [
  { id: "blown_thin", label: 'Blown Fiberglass (6-8")', rValue: 19 },
  { id: "blown_thick", label: 'Blown Fiberglass (10-12")', rValue: 30 },
  { id: "cellulose", label: 'Blown Cellulose (8-10")', rValue: 30 },
  { id: "batts_r13", label: "Batts R-13 (older)", rValue: 13 },
  { id: "batts_r19", label: "Batts R-19", rValue: 19 },
  { id: "batts_r30", label: "Batts R-30", rValue: 30 },
  { id: "batts_r38", label: "Batts R-38 (new code)", rValue: 38 },
  { id: "spray_open", label: "Open-Cell Spray Foam", rValue: 25 },
  { id: "spray_closed", label: "Closed-Cell Spray Foam", rValue: 42 },
  { id: "none", label: "Little / None", rValue: 4 },
];
const SEER_BY_AGE = [
  { id: "pre2000", label: "Pre-2000", seer: 9 }, { id: "2000_2005", label: "2000–2005", seer: 11 },
  { id: "2006_2015", label: "2006–2015", seer: 13.5 }, { id: "2015_2022", label: "2015–2022", seer: 15 },
  { id: "2023_plus", label: "2023+", seer: 16 },
];

function computeU(mix) {
  if (!mix?.length) return 0.05;
  const r = mix.reduce((s, e) => { const t = INSULATION_TYPES.find(x => x.id === e.typeId); return s + (t ? t.rValue * (e.pct / 100) : 0); }, 0);
  return r > 0 ? +(1 / r).toFixed(4) : 0.05;
}
function calcSavings(project, readings) {
  if (!readings?.length || readings.length < 10) return { kwhSaved: 0, dollarsSaved: 0, avgAtticDelta: 0, avgIndoorDelta: 0, baselineDelta: 0, uValue: 0.05, cop: 4.1 };
  const ins = typeof project.insulation === "string" ? JSON.parse(project.insulation) : (project.insulation || []);
  const u = project.ceiling_u || computeU(ins); const seer = project.seer || 14; const cop = seer / 3.412;
  const bEnd = Math.floor(readings.length * 0.1); const bl = readings.slice(0, Math.max(bEnd, 1)); const cur = readings.slice(Math.max(bEnd, 1));
  if (!cur.length) return { kwhSaved: 0, dollarsSaved: 0, avgAtticDelta: 0, avgIndoorDelta: 0, baselineDelta: 0, uValue: +u.toFixed(4), cop: +cop.toFixed(2) };
  const avg = (a, fn) => a.reduce((s, x) => s + fn(x), 0) / a.length;
  const bD = avg(bl, x => x.temp_attic - x.temp_outdoor); const cD = avg(cur, x => x.temp_attic - x.temp_outdoor); const iD = avg(cur, x => x.temp_indoor - x.temp_outdoor);
  const red = Math.max(0, bD - cD); const sqFt = project.sq_ft || 1800;
  const kwh = +(red * cur.length * 2 * sqFt * u / (cop * 3412)).toFixed(1);
  const dol = +(kwh * (project.utility_rate || 0.118)).toFixed(2);
  return { kwhSaved: kwh, dollarsSaved: dol, avgAtticDelta: +cD.toFixed(1), avgIndoorDelta: +iD.toFixed(1), baselineDelta: +bD.toFixed(1), uValue: +u.toFixed(4), cop: +cop.toFixed(2) };
}
function getCumData(project, readings) {
  if (!readings?.length || readings.length < 10) return [];
  const ins = typeof project.insulation === "string" ? JSON.parse(project.insulation) : (project.insulation || []);
  const u = project.ceiling_u || computeU(ins); const cop = (project.seer || 14) / 3.412;
  const sqFt = project.sq_ft || 1800; const rate = project.utility_rate || 0.118;
  const bEnd = Math.floor(readings.length * 0.1); const bl = readings.slice(0, Math.max(bEnd, 1));
  const bD = bl.reduce((s, x) => s + (x.temp_attic - x.temp_outdoor), 0) / bl.length;
  const dayMap = {};
  readings.slice(Math.max(bEnd, 1)).forEach(x => { const d = new Date(x.recorded_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }); if (!dayMap[d]) dayMap[d] = []; dayMap[d].push(x); });
  let ck = 0, cd = 0;
  return Object.entries(dayMap).map(([day, a]) => {
    const dd = a.reduce((s, x) => s + (x.temp_attic - x.temp_outdoor), 0) / a.length;
    const red = Math.max(0, bD - dd); const btu = red * a.length * 2 * sqFt * u;
    ck += btu / (cop * 3412); cd += (btu / (cop * 3412)) * rate;
    return { day, kwh: +ck.toFixed(1), dollars: +cd.toFixed(2) };
  });
}

// ─── Fonts & Shared ─────────────────────────────────────────────────────────
const heading = "'Barlow Condensed', 'Arial Narrow', sans-serif";
const body = "'Barlow', sans-serif";
const mono = "'JetBrains Mono', 'Fira Code', monospace";
const inpS = { background: C.inputBg, border: `1px solid ${C.inputBorder}`, borderRadius: 6, padding: "9px 12px", color: C.textPrimary, fontSize: 13, fontFamily: body, outline: "none", width: "100%" };
const lblS = { fontSize: 10, color: C.textMuted, fontFamily: mono, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6, display: "block" };
const cardStyle = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" };

// ─── Login ──────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [e, setE] = useState(""); const [p, setP] = useState(""); const [err, setErr] = useState("");
  const go = () => { if (e && p) onLogin(); else setErr("Enter email and password"); };
  return (
    <div style={{ minHeight: "100vh", background: `radial-gradient(ellipse at 30% 20%, ${C.purpleGlow}, transparent 60%), ${C.bg}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: body }}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800&family=Barlow:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <div style={{ width: 380, ...cardStyle, padding: "44px 36px", textAlign: "center" }}>
        <img src={LOGO} alt="M" style={{ width: 80, height: 80, borderRadius: 12, objectFit: "cover", marginBottom: 20, border: `2px solid ${C.purpleMuted}` }} />
        <h1 style={{ fontFamily: heading, fontWeight: 700, fontSize: 26, color: C.textPrimary, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>Mallett Made</h1>
        <div style={{ fontSize: 11, color: C.purple, fontFamily: mono, letterSpacing: "0.15em", marginBottom: 32 }}>RADIANT MONITOR</div>
        <div style={{ textAlign: "left", marginBottom: 14 }}><label style={lblS}>Email</label><input type="email" value={e} onChange={x => setE(x.target.value)} style={inpS} placeholder="you@example.com" /></div>
        <div style={{ textAlign: "left", marginBottom: 20 }}><label style={lblS}>Password</label><input type="password" value={p} onChange={x => setP(x.target.value)} style={inpS} placeholder="••••••••" onKeyDown={x => x.key === "Enter" && go()} /></div>
        {err && <div style={{ color: C.red, fontSize: 12, marginBottom: 12 }}>{err}</div>}
        <button onClick={go} style={{ width: "100%", padding: "12px 0", background: `linear-gradient(135deg, ${C.purple}, ${C.purpleDark})`, color: C.textPrimary, border: "none", borderRadius: 8, fontSize: 14, fontFamily: heading, fontWeight: 600, cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase" }}>Sign In</button>
        <div style={{ marginTop: 16, fontSize: 12, color: C.textMuted }}>Credentials provided at install</div>
      </div>
    </div>
  );
}

// ─── Components ─────────────────────────────────────────────────────────────
function Pill({ label, value, unit, accent }) {
  return (<div style={{ ...cardStyle, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 4, minWidth: 110 }}>
    <span style={{ fontSize: 9, color: C.textMuted, fontFamily: mono, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
    <span style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, fontFamily: heading }}>{value ?? "—"}<span style={{ fontSize: 12, color: accent, marginLeft: 3, fontFamily: mono }}>{unit}</span></span>
  </div>);
}
const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (<div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 12, fontFamily: mono, boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
    <div style={{ color: C.textMuted, marginBottom: 6 }}>{label}</div>
    {payload.map(p => (<div key={p.dataKey} style={{ color: p.color, marginBottom: 3 }}>{p.name}: {p.value}{p.dataKey === "dollars" ? "" : p.dataKey === "kwh" ? " kWh" : "°F"}</div>))}
  </div>);
};
function Card({ project, sel, onClick, readings }) {
  const lat = readings?.[readings.length - 1]; const sav = calcSavings(project, readings); const hasData = !!lat;
  return (<div onClick={onClick} style={{ cursor: "pointer", ...cardStyle, background: sel ? C.surfaceLight : C.surface, borderColor: sel ? C.purple : C.border, padding: "14px 16px", transition: "all 0.2s", position: "relative", overflow: "hidden" }}>
    {sel && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${C.purple}, ${C.amber})` }} />}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
      <div><div style={{ color: C.textPrimary, fontWeight: 600, fontSize: 13, fontFamily: heading, letterSpacing: "0.03em" }}>{project.address}</div><div style={{ color: C.textMuted, fontSize: 11, fontFamily: mono, marginTop: 2 }}>{project.city}</div></div>
      <div style={{ background: hasData ? `${C.teal}20` : `${C.amber}20`, color: hasData ? C.teal : C.amber, fontSize: 9, padding: "2px 8px", borderRadius: 20, fontFamily: mono, fontWeight: 500 }}>{hasData ? "LIVE" : "NO DATA"}</div>
    </div>
    {hasData && <div style={{ display: "flex", gap: 14 }}>
      <div><div style={{ color: C.textMuted, fontSize: 9, fontFamily: mono }}>ATTIC</div><div style={{ color: C.red, fontSize: 17, fontWeight: 700, fontFamily: heading }}>{lat.temp_attic}°</div></div>
      <div><div style={{ color: C.textMuted, fontSize: 9, fontFamily: mono }}>INDOOR</div><div style={{ color: C.teal, fontSize: 17, fontWeight: 700, fontFamily: heading }}>{lat.temp_indoor}°</div></div>
      <div style={{ marginLeft: "auto", textAlign: "right" }}><div style={{ color: C.textMuted, fontSize: 9, fontFamily: mono }}>SAVED</div><div style={{ color: C.purple, fontSize: 17, fontWeight: 700, fontFamily: heading }}>${sav.dollarsSaved}</div></div>
    </div>}
  </div>);
}

// ─── Form Components ────────────────────────────────────────────────────────
function InsulSel({ value, onChange }) {
  const [sel, setSel] = useState(value || []);
  const tog = id => { let n = sel.find(s => s.typeId === id) ? sel.filter(s => s.typeId !== id) : [...sel, { typeId: id, pct: 0 }]; const ev = n.length ? Math.floor(100 / n.length) : 0, rm = n.length ? 100 - ev * n.length : 0; n = n.map((s, i) => ({ ...s, pct: ev + (i === 0 ? rm : 0) })); setSel(n); onChange(n); };
  const upd = (id, v) => { const n = sel.map(s => s.typeId === id ? { ...s, pct: Math.max(0, Math.min(100, Number(v) || 0)) } : s); setSel(n); onChange(n); };
  const tot = sel.reduce((s, e) => s + e.pct, 0);
  return (<div>
    <label style={lblS}>Insulation Types (select all present)</label>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
      {INSULATION_TYPES.map(t => { const on = !!sel.find(s => s.typeId === t.id); return (<button key={t.id} onClick={() => tog(t.id)} style={{ background: on ? `${C.purple}20` : "transparent", border: `1px solid ${on ? C.purple : C.inputBorder}`, borderRadius: 6, padding: "6px 11px", color: on ? C.purpleLight : C.textMuted, fontSize: 12, fontFamily: body, cursor: "pointer", fontWeight: on ? 600 : 400 }}>{t.label}</button>); })}
    </div>
    {sel.length > 1 && (<div style={{ background: C.inputBg, borderRadius: 8, padding: 12, border: `1px solid ${C.border}` }}>
      <div style={{ fontSize: 10, color: C.textMuted, fontFamily: mono, marginBottom: 8 }}>COVERAGE % {tot !== 100 && <span style={{ color: C.red, marginLeft: 8 }}>Total: {tot}%</span>}{tot === 100 && <span style={{ color: C.teal, marginLeft: 8 }}>✓ 100%</span>}</div>
      {sel.map(s => { const t = INSULATION_TYPES.find(x => x.id === s.typeId); return (<div key={s.typeId} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}><span style={{ color: C.textSecondary, fontSize: 12, fontFamily: body, minWidth: 170 }}>{t?.label}</span><input type="number" min="0" max="100" value={s.pct} onChange={e => upd(s.typeId, e.target.value)} style={{ ...inpS, width: 65, textAlign: "center" }} /><span style={{ color: C.textMuted, fontSize: 12, fontFamily: mono }}>%</span></div>); })}
      <div style={{ marginTop: 6, fontSize: 11, color: C.textMuted, fontFamily: mono }}>Blended R-value: <span style={{ color: C.purple, fontWeight: 600 }}>R-{(1 / computeU(sel)).toFixed(1)}</span></div>
    </div>)}
    {sel.length === 1 && <div style={{ fontSize: 11, color: C.textMuted, fontFamily: mono, marginTop: 4 }}>R-value: <span style={{ color: C.purple, fontWeight: 600 }}>R-{INSULATION_TYPES.find(x => x.id === sel[0].typeId)?.rValue}</span></div>}
  </div>);
}
function SeerIn({ seer, src, onS, onSrc }) {
  const [m, setM] = useState(src || "exact"); const [ag, setAg] = useState("2006_2015");
  const sw = v => { setM(v); onSrc(v); if (v === "age") { const g = SEER_BY_AGE.find(x => x.id === ag); onS(g?.seer || 13); } };
  return (<div>
    <label style={lblS}>AC Efficiency (SEER)</label>
    <div style={{ background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, marginBottom: 6 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {[["exact", "I found the SEER"], ["age", "Estimate by age"]].map(([v, l]) => (<button key={v} onClick={() => sw(v)} style={{ flex: 1, background: m === v ? `${C.purple}18` : "transparent", border: `1px solid ${m === v ? C.purple : C.inputBorder}`, borderRadius: 6, padding: "8px 10px", color: m === v ? C.purpleLight : C.textMuted, fontSize: 12, fontFamily: body, cursor: "pointer", fontWeight: m === v ? 600 : 400 }}>{l}</button>))}
      </div>
      {m === "exact" ? (<div><input type="number" min="6" max="30" step="0.5" value={seer} onChange={e => onS(Number(e.target.value))} style={{ ...inpS, marginBottom: 8 }} placeholder="e.g. 14" /><div style={{ fontSize: 11, color: C.textMuted, fontFamily: body, lineHeight: 1.6 }}><span style={{ color: C.purple, fontWeight: 600 }}>Where to find it:</span> Yellow EnergyGuide sticker on outdoor condenser.</div></div>
      ) : (<div><div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
        {SEER_BY_AGE.map(g => (<button key={g.id} onClick={() => { setAg(g.id); onS(g.seer); }} style={{ background: ag === g.id ? `${C.purple}18` : "transparent", border: `1px solid ${ag === g.id ? C.purple : C.inputBorder}`, borderRadius: 6, padding: "6px 11px", color: ag === g.id ? C.purpleLight : C.textMuted, fontSize: 12, fontFamily: body, cursor: "pointer", fontWeight: ag === g.id ? 600 : 400 }}>{g.label} <span style={{ color: C.textMuted, marginLeft: 3, fontSize: 11 }}>~{g.seer}</span></button>))}
      </div><div style={{ fontSize: 11, color: C.textMuted, fontFamily: body, lineHeight: 1.6 }}><span style={{ color: C.amber, fontWeight: 600 }}>Estimate by age:</span> Data plate on outdoor unit.</div></div>)}
    </div>
    <div style={{ fontSize: 11, color: C.textMuted, fontFamily: mono }}>SEER: <span style={{ color: C.purple }}>{seer}</span> → COP: <span style={{ color: C.purple }}>{(seer / 3.412).toFixed(2)}</span></div>
  </div>);
}
function Form({ project, onSave, onCancel }) {
  const ins = typeof project?.insulation === "string" ? JSON.parse(project.insulation) : (project?.insulation || []);
  const [sq, setSq] = useState(project?.sq_ft || ""); const [ht, setHt] = useState(project?.hvac_tons || "");
  const [se, setSe] = useState(project?.seer || 14); const [ss, setSs] = useState(project?.seer_source || "exact");
  const [ur, setUr] = useState(project?.utility_rate || 0.118); const [insul, setInsul] = useState(ins);
  return (<div style={{ ...cardStyle, padding: 24 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
      <div style={{ fontFamily: heading, fontWeight: 700, fontSize: 18, color: C.textPrimary, letterSpacing: "0.04em", textTransform: "uppercase" }}>Install Intake</div>
      <div style={{ fontSize: 10, color: C.textMuted, fontFamily: mono, background: C.inputBg, padding: "4px 10px", borderRadius: 6 }}>Fill on-site</div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
      <div><label style={lblS}>Ceiling Sq Ft</label><input type="number" value={sq} onChange={e => setSq(e.target.value)} style={inpS} placeholder="1850" /></div>
      <div><label style={lblS}>HVAC Tonnage</label><input type="number" step="0.5" value={ht} onChange={e => setHt(e.target.value)} style={inpS} placeholder="3" /></div>
      <div><label style={lblS}>Utility $/kWh</label><input type="number" step="0.001" value={ur} onChange={e => setUr(Number(e.target.value))} style={inpS} placeholder="0.118" /></div>
    </div>
    <div style={{ marginBottom: 20 }}><SeerIn seer={se} src={ss} onS={setSe} onSrc={setSs} /></div>
    <div style={{ marginBottom: 20 }}><InsulSel value={insul} onChange={setInsul} /></div>
    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
      {onCancel && <button onClick={onCancel} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 20px", color: C.textMuted, fontSize: 12, fontFamily: body, cursor: "pointer" }}>Cancel</button>}
      <button onClick={() => onSave({ sq_ft: Number(sq), hvac_tons: Number(ht), seer: se, seer_source: ss, utility_rate: ur, insulation: JSON.stringify(insul), ceiling_u: computeU(insul) })} style={{ background: `linear-gradient(135deg, ${C.purple}, ${C.purpleDark})`, border: "none", borderRadius: 8, padding: "9px 24px", color: C.textPrimary, fontSize: 12, fontFamily: heading, fontWeight: 600, cursor: "pointer", letterSpacing: "0.04em", textTransform: "uppercase" }}>Save</button>
    </div>
  </div>);
}
function Loader() {
  return (<div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 200 }}>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    <div style={{ width: 32, height: 32, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.purple}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
  </div>);
}

// ─── Chart label formatter ──────────────────────────────────────────────────
function formatChartData(readings, range) {
  if (!readings.length) return [];
  const sampleRate = Math.max(1, Math.floor(readings.length / 60));
  return readings.filter((_, i) => i % sampleRate === 0).map(r => {
    const d = new Date(r.recorded_at);
    let label;
    if (range <= 1) {
      label = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    } else if (range <= 7) {
      label = d.toLocaleDateString("en-US", { weekday: "short", hour: "numeric" });
    } else {
      label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    return { label, attic: +r.temp_attic, indoor: +r.temp_indoor, outdoor: +r.temp_outdoor };
  });
}

// ─── Main App ───────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [auth, setAuth] = useState(false);
  const [projects, setProjects] = useState([]);
  const [readings, setReadings] = useState({});
  const [selId, setSelId] = useState(null);
  const [range, setRange] = useState(7);
  const [form, setForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  const loadProjects = useCallback(async () => {
    try { const data = await supaFetch("projects", "select=*&order=install_date.desc"); setProjects(data); if (data.length && !selId) setSelId(data[0].id); } catch (e) { console.error(e); }
  }, [selId]);
  const loadReadings = useCallback(async (pid) => {
    try { const data = await supaFetch("readings", `select=*&project_id=eq.${pid}&order=recorded_at.asc&limit=5000`); setReadings(prev => ({ ...prev, [pid]: data })); } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { if (!auth) return; setLoading(true); loadProjects().then(() => setLoading(false)); }, [auth, loadProjects]);
  useEffect(() => { if (selId && auth) loadReadings(selId); }, [selId, auth, loadReadings]);
  useEffect(() => { if (!auth || !selId) return; const i = setInterval(() => { loadReadings(selId); setLastRefresh(new Date()); }, 60000); return () => clearInterval(i); }, [auth, selId, loadReadings]);

  if (!auth) return <LoginScreen onLogin={() => setAuth(true)} />;

  const proj = projects.find(p => p.id === selId);
  const allR = readings[selId] || [];
  const cutoff = Date.now() - range * 86400000;
  const filteredR = allR.filter(r => new Date(r.recorded_at).getTime() > cutoff);
  const sav = calcSavings(proj, allR); const lat = allR[allR.length - 1]; const cum = getCumData(proj, allR);
  const chartData = formatChartData(filteredR, range);
  const totD = projects.reduce((s, p) => s + calcSavings(p, readings[p.id] || []).dollarsSaved, 0);
  const totK = projects.reduce((s, p) => s + calcSavings(p, readings[p.id] || []).kwhSaved, 0);
  const uV = proj ? (proj.ceiling_u || computeU(typeof proj.insulation === "string" ? JSON.parse(proj.insulation) : (proj.insulation || []))) : 0.05;
  const handleSave = async (data) => { try { await supaUpsert("projects", { id: selId, ...data }); await loadProjects(); setForm(false); } catch (e) { alert("Failed to save."); } };

  const btnStyle = (active) => ({ padding: "5px 12px", fontSize: 11, fontFamily: mono, cursor: "pointer", borderRadius: 6, border: `1px solid ${active ? C.purple : C.border}`, background: active ? `${C.purple}20` : "transparent", color: active ? C.purpleLight : C.textMuted, fontWeight: active ? 600 : 400, transition: "all 0.15s" });

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textPrimary, fontFamily: body }}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800&family=Barlow:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${C.purpleMuted};border-radius:2px}input:focus{border-color:${C.purple}!important;box-shadow:0 0 0 3px ${C.purple}1a}input::placeholder{color:${C.textMuted}}`}</style>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: C.surface, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img src={LOGO} alt="" style={{ width: 38, height: 38, borderRadius: 8, objectFit: "cover", border: `2px solid ${C.purpleMuted}` }} />
          <div><div style={{ fontFamily: heading, fontWeight: 700, fontSize: 18, color: C.textPrimary, letterSpacing: "0.08em", textTransform: "uppercase" }}>Mallett Made</div><div style={{ fontSize: 9, color: C.purple, fontFamily: mono, letterSpacing: "0.15em" }}>RADIANT MONITOR</div></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: C.textMuted, fontFamily: mono, letterSpacing: "0.08em" }}>ALL SITES · TOTAL SAVED</div>
            <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.textPrimary, fontFamily: heading }}>${totD.toFixed(2)}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.amber, fontFamily: mono }}>{totK.toFixed(0)} kWh</div>
            </div>
          </div>
          <div style={{ background: `${C.purple}15`, border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 14px", fontSize: 11, color: C.textSecondary, fontFamily: mono }}>{projects.length} sites</div>
          <button onClick={() => setAuth(false)} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, padding: "5px 12px", color: C.textMuted, fontSize: 11, fontFamily: mono, cursor: "pointer" }}>Sign Out</button>
        </div>
      </div>

      {loading ? <Loader /> : (
        <div style={{ display: "flex", height: "calc(100vh - 61px)" }}>
          <div style={{ width: 274, borderRight: `1px solid ${C.border}`, padding: "18px 14px", overflowY: "auto", flexShrink: 0, display: "flex", flexDirection: "column", gap: 8, background: C.surface }}>
            <div style={{ fontSize: 9, color: C.textMuted, fontFamily: mono, letterSpacing: "0.12em", marginBottom: 4, padding: "0 2px" }}>INSTALL LOCATIONS</div>
            {projects.map(p => (<Card key={p.id} project={p} sel={p.id === selId} onClick={() => { setSelId(p.id); setForm(false); loadReadings(p.id); }} readings={readings[p.id] || []} />))}
            {!projects.length && <div style={{ color: C.textMuted, fontSize: 13, padding: 12 }}>No projects yet.</div>}
          </div>

          {proj ? (
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", background: `radial-gradient(ellipse at 70% 10%, ${C.purpleGlow}, transparent 50%), ${C.bg}` }}>
              <div style={{ marginBottom: 24, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <h1 style={{ fontFamily: heading, fontWeight: 800, fontSize: 28, color: C.textPrimary, letterSpacing: "0.04em", textTransform: "uppercase" }}>{proj.address}</h1>
                  <div style={{ color: C.textMuted, fontSize: 12, fontFamily: mono, marginTop: 4 }}>
                    {proj.city} {proj.install_date && `· ${new Date(proj.install_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`} {proj.sq_ft && `· ${proj.sq_ft.toLocaleString()} sq ft`}
                  </div>
                  <div style={{ color: C.textMuted, fontSize: 10, fontFamily: mono, marginTop: 2 }}>Auto-refreshes 60s · {allR.length} readings</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button onClick={() => { loadReadings(selId); setLastRefresh(new Date()); }} style={btnStyle(false)}>↻ Refresh</button>
                  <button onClick={() => setForm(!form)} style={btnStyle(form)}>{form ? "✕ Close" : "✎ Edit"}</button>
                  <div style={{ display: "flex", gap: 4 }}>{[1, 7, 14, 30].map(d => (<button key={d} onClick={() => setRange(d)} style={btnStyle(range === d)}>{d}d</button>))}</div>
                </div>
              </div>

              {form && <div style={{ marginBottom: 24 }}><Form project={proj} onSave={handleSave} onCancel={() => setForm(false)} /></div>}

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
                <Pill label="Attic" value={lat?.temp_attic} unit="°F" accent={C.red} />
                <Pill label="Indoor" value={lat?.temp_indoor} unit="°F" accent={C.teal} />
                <Pill label="Outdoor" value={lat?.temp_outdoor} unit="°F" accent={C.amber} />
                <Pill label="kWh Saved" value={sav.kwhSaved} unit="kWh" accent={C.purple} />
                <Pill label="$ Saved" value={`$${sav.dollarsSaved}`} unit="" accent={C.purpleLight} />
                <Pill label="SEER" value={proj.seer} unit="" accent={C.teal} />
              </div>

              {chartData.length > 0 ? (
                <div style={{ ...cardStyle, padding: "20px 16px 12px", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, padding: "0 8px" }}>
                    <div style={{ fontFamily: heading, fontWeight: 700, fontSize: 16, color: C.textPrimary, letterSpacing: "0.04em", textTransform: "uppercase" }}>Temperature History</div>
                    <div style={{ display: "flex", gap: 16 }}>{[[C.red, "Attic"], [C.teal, "Indoor"], [C.amber, "Outdoor"]].map(([c, l]) => (<div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: C.textMuted, fontFamily: mono }}><div style={{ width: 14, height: 2, background: c, borderRadius: 1 }} />{l}</div>))}</div>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <XAxis dataKey="label" tick={{ fill: C.textMuted, fontSize: 9, fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false} interval={Math.max(0, Math.floor(chartData.length / 8) - 1)} angle={-30} textAnchor="end" height={45} />
                      <YAxis tick={{ fill: C.textMuted, fontSize: 10, fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false} />
                      <Tooltip content={<Tip />} />
                      <Line type="monotone" dataKey="attic" name="Attic" stroke={C.red} strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="indoor" name="Indoor" stroke={C.teal} strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="outdoor" name="Outdoor" stroke={C.amber} strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{ ...cardStyle, padding: 40, marginBottom: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 14, color: C.textMuted }}>Waiting for sensor data...</div>
                  <div style={{ fontSize: 12, color: C.textMuted, fontFamily: mono, marginTop: 8 }}>Readings appear once the ESP32 starts posting</div>
                </div>
              )}

              {cum.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div style={{ ...cardStyle, padding: "20px 16px 12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "0 8px" }}>
                      <div style={{ fontFamily: heading, fontWeight: 700, fontSize: 14, color: C.textPrimary, textTransform: "uppercase", letterSpacing: "0.04em" }}>Cumulative $ Saved</div>
                      <div style={{ fontFamily: heading, fontWeight: 700, fontSize: 22, color: C.purple }}>${cum[cum.length - 1]?.dollars || 0}</div>
                    </div>
                    <ResponsiveContainer width="100%" height={140}>
                      <AreaChart data={cum} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <defs><linearGradient id="gD" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.purple} stopOpacity={0.25} /><stop offset="100%" stopColor={C.purple} stopOpacity={0.02} /></linearGradient></defs>
                        <XAxis dataKey="day" tick={{ fill: C.textMuted, fontSize: 9, fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                        <YAxis tick={{ fill: C.textMuted, fontSize: 9, fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
                        <Tooltip content={<Tip />} />
                        <Area type="monotone" dataKey="dollars" name="$ Saved" stroke={C.purple} strokeWidth={2} fill="url(#gD)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ ...cardStyle, padding: "20px 16px 12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "0 8px" }}>
                      <div style={{ fontFamily: heading, fontWeight: 700, fontSize: 14, color: C.textPrimary, textTransform: "uppercase", letterSpacing: "0.04em" }}>Cumulative kWh Saved</div>
                      <div style={{ fontFamily: heading, fontWeight: 700, fontSize: 22, color: C.teal }}>{cum[cum.length - 1]?.kwh || 0}</div>
                    </div>
                    <ResponsiveContainer width="100%" height={140}>
                      <AreaChart data={cum} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <defs><linearGradient id="gK" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.teal} stopOpacity={0.25} /><stop offset="100%" stopColor={C.teal} stopOpacity={0.02} /></linearGradient></defs>
                        <XAxis dataKey="day" tick={{ fill: C.textMuted, fontSize: 9, fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                        <YAxis tick={{ fill: C.textMuted, fontSize: 9, fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false} />
                        <Tooltip content={<Tip />} />
                        <Area type="monotone" dataKey="kwh" name="kWh Saved" stroke={C.teal} strokeWidth={2} fill="url(#gK)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ ...cardStyle, padding: 20 }}>
                  <div style={{ fontFamily: heading, fontWeight: 700, fontSize: 14, marginBottom: 16, color: C.textPrimary, textTransform: "uppercase", letterSpacing: "0.04em" }}>Savings Breakdown</div>
                  {[["Baseline Attic Δ", `${sav.baselineDelta}°F`, C.textMuted], ["Current Attic Δ", `${sav.avgAtticDelta}°F`, C.amber], ["Indoor-Outdoor Δ", `${sav.avgIndoorDelta}°F`, C.teal], ["Blended U-Value", `${typeof uV === "number" ? uV.toFixed(4) : uV}`, C.textSecondary], ["SEER / COP", `${proj.seer || 14} / ${sav.cop}`, C.teal], ["kWh Saved", `${sav.kwhSaved} kWh`, C.purple], ["Cost Saved", `$${sav.dollarsSaved}`, C.purpleLight], ["Utility Rate", `$${proj.utility_rate || 0.118}/kWh`, C.textMuted]].map(([l, v, c]) => (<div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 12 }}><span style={{ color: C.textMuted, fontFamily: mono }}>{l}</span><span style={{ color: c, fontWeight: 600, fontFamily: mono }}>{v}</span></div>))}
                </div>
                <div style={{ ...cardStyle, padding: 20 }}>
                  <div style={{ fontFamily: heading, fontWeight: 700, fontSize: 14, marginBottom: 16, color: C.textPrimary, textTransform: "uppercase", letterSpacing: "0.04em" }}>Install Specs</div>
                  {[["Square Footage", proj.sq_ft ? `${proj.sq_ft.toLocaleString()} sq ft` : "—"], ["HVAC Capacity", proj.hvac_tons ? `${proj.hvac_tons} tons` : "—"], ["SEER", `${proj.seer || 14} (${proj.seer_source || "est."})`], ["Blended R-Value", `R-${typeof uV === "number" ? (1 / uV).toFixed(1) : "—"}`], ["Sensor: Attic", proj.sensor_attic || "—"], ["Sensor: Indoor", proj.sensor_indoor || "—"], ["Sensor: Outdoor", proj.sensor_outdoor || "—"]].map(([l, v]) => (<div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 12, gap: 12 }}><span style={{ color: C.textMuted, fontFamily: mono, flexShrink: 0 }}>{l}</span><span style={{ color: C.textSecondary, fontFamily: mono, textAlign: "right" }}>{v}</span></div>))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ textAlign: "center", color: C.textMuted }}><div style={{ fontSize: 16, marginBottom: 8 }}>No project selected</div></div></div>
          )}
        </div>
      )}
    </div>
  );
}
