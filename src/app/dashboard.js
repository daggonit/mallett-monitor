"use client";
import { useState, useEffect, useCallback } from "react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const LOGO = "data:image/jpeg;base64,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";

const SUPA_URL = "https://plmqthtdafqnkqrmgtos.supabase.co/rest/v1";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsbXF0aHRkYWZxbmtxcm1ndG9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1OTk0MzcsImV4cCI6MjA5MTE3NTQzN30.DPPq9pJjFZ8OkwdmRJbD5P4ZTc9LGNxIwSWha5lvCwU";

const supaFetch = async (table, query = "") => {
  const res = await fetch(`${SUPA_URL}/${table}?${query}`, {
    headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
  });
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
  return res.json();
};

const supaUpsert = async (table, data) => {
  const res = await fetch(`${SUPA_URL}/${table}`, {
    method: "POST",
    headers: {
      apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Supabase upsert error: ${res.status}`);
  return res.json();
};

const C = {
  forest: "#1a5c38", forestDark: "#134a2c", accent: "#2d8f56",
  cream: "#f5f0e1", creamDark: "#e8e0cc", creamLight: "#faf7ee",
  gold: "#c9a84c", goldLight: "#d4b965", danger: "#c45e4a",
  muted: "#8a9e8f", mutedLight: "#a8b8ab",
  textDark: "#1a2e22", textMid: "#4a6350", textLight: "#7a917f",
  white: "#ffffff", cardBorder: "rgba(26,92,56,0.12)",
  inputBorder: "rgba(26,92,56,0.18)",
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
  { id: "pre2000", label: "Pre-2000", seer: 9 },
  { id: "2000_2005", label: "2000–2005", seer: 11 },
  { id: "2006_2015", label: "2006–2015", seer: 13.5 },
  { id: "2015_2022", label: "2015–2022", seer: 15 },
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
  const u = project.ceiling_u || computeU(ins);
  const seer = project.seer || 14;
  const cop = seer / 3.412;
  const bEnd = Math.floor(readings.length * 0.1);
  const bl = readings.slice(0, Math.max(bEnd, 1));
  const cur = readings.slice(Math.max(bEnd, 1));
  if (!cur.length) return { kwhSaved: 0, dollarsSaved: 0, avgAtticDelta: 0, avgIndoorDelta: 0, baselineDelta: 0, uValue: +u.toFixed(4), cop: +cop.toFixed(2) };
  const avg = (a, fn) => a.reduce((s, x) => s + fn(x), 0) / a.length;
  const bD = avg(bl, x => x.temp_attic - x.temp_outdoor);
  const cD = avg(cur, x => x.temp_attic - x.temp_outdoor);
  const iD = avg(cur, x => x.temp_indoor - x.temp_outdoor);
  const red = Math.max(0, bD - cD);
  const sqFt = project.sq_ft || 1800;
  const dhr = red * cur.length * 2;
  const btu = dhr * sqFt * u;
  const kwh = +(btu / (cop * 3412)).toFixed(1);
  const dol = +(kwh * (project.utility_rate || 0.118)).toFixed(2);
  return { kwhSaved: kwh, dollarsSaved: dol, avgAtticDelta: +cD.toFixed(1), avgIndoorDelta: +iD.toFixed(1), baselineDelta: +bD.toFixed(1), uValue: +u.toFixed(4), cop: +cop.toFixed(2) };
}

function getCumData(project, readings) {
  if (!readings?.length || readings.length < 10) return [];
  const ins = typeof project.insulation === "string" ? JSON.parse(project.insulation) : (project.insulation || []);
  const u = project.ceiling_u || computeU(ins);
  const cop = (project.seer || 14) / 3.412;
  const sqFt = project.sq_ft || 1800;
  const rate = project.utility_rate || 0.118;
  const bEnd = Math.floor(readings.length * 0.1);
  const bl = readings.slice(0, Math.max(bEnd, 1));
  const bD = bl.reduce((s, x) => s + (x.temp_attic - x.temp_outdoor), 0) / bl.length;
  const dayMap = {};
  readings.slice(Math.max(bEnd, 1)).forEach(x => {
    const d = new Date(x.recorded_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (!dayMap[d]) dayMap[d] = [];
    dayMap[d].push(x);
  });
  let ck = 0, cd = 0;
  return Object.entries(dayMap).map(([day, a]) => {
    const dd = a.reduce((s, x) => s + (x.temp_attic - x.temp_outdoor), 0) / a.length;
    const red = Math.max(0, bD - dd), dhr = red * a.length * 2, btu = dhr * sqFt * u;
    ck += btu / (cop * 3412); cd += (btu / (cop * 3412)) * rate;
    return { day, kwh: +ck.toFixed(1), dollars: +cd.toFixed(2) };
  });
}

const serif = "'Playfair Display', Georgia, serif";
const sans = "'Source Sans 3', sans-serif";
const mono = "'IBM Plex Mono', monospace";
const inpS = { background: C.white, border: `1px solid ${C.inputBorder}`, borderRadius: 6, padding: "9px 12px", color: C.textDark, fontSize: 13, fontFamily: sans, outline: "none", width: "100%" };
const lblS = { fontSize: 10, color: C.textLight, fontFamily: mono, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, display: "block" };

function LoginScreen({ onLogin }) {
  const [e, setE] = useState(""); const [p, setP] = useState(""); const [err, setErr] = useState("");
  const go = () => { if (e && p) onLogin(); else setErr("Enter email and password"); };
  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${C.creamLight}, ${C.creamDark}, ${C.cream})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: sans }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Source+Sans+3:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <div style={{ width: 380, background: C.white, borderRadius: 16, boxShadow: "0 4px 24px rgba(26,92,56,0.08)", padding: "40px 36px", textAlign: "center" }}>
        <img src={LOGO} alt="M" style={{ width: 72, height: 72, borderRadius: 14, objectFit: "cover", marginBottom: 16, border: `2px solid ${C.cardBorder}` }} />
        <h1 style={{ fontFamily: serif, fontWeight: 700, fontSize: 22, color: C.forest, marginBottom: 4 }}>Mallett Made</h1>
        <div style={{ fontSize: 12, color: C.textLight, fontFamily: mono, letterSpacing: "0.1em", marginBottom: 28 }}>RADIANT MONITOR</div>
        <div style={{ textAlign: "left", marginBottom: 14 }}><label style={lblS}>Email</label><input type="email" value={e} onChange={x => setE(x.target.value)} style={inpS} placeholder="you@example.com" /></div>
        <div style={{ textAlign: "left", marginBottom: 20 }}><label style={lblS}>Password</label><input type="password" value={p} onChange={x => setP(x.target.value)} style={inpS} placeholder="••••••••" onKeyDown={x => x.key === "Enter" && go()} /></div>
        {err && <div style={{ color: C.danger, fontSize: 12, marginBottom: 12 }}>{err}</div>}
        <button onClick={go} style={{ width: "100%", padding: "12px 0", background: C.forest, color: C.cream, border: "none", borderRadius: 8, fontSize: 14, fontFamily: sans, fontWeight: 600, cursor: "pointer" }}>Sign In</button>
        <div style={{ marginTop: 16, fontSize: 12, color: C.textLight }}>Credentials provided at install</div>
      </div>
    </div>
  );
}

function Pill({ label, value, unit, accent }) {
  return (<div style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 10, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 4, minWidth: 110, boxShadow: "0 1px 3px rgba(26,92,56,0.04)" }}>
    <span style={{ fontSize: 10, color: C.textLight, fontFamily: mono, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
    <span style={{ fontSize: 22, fontWeight: 700, color: C.textDark, fontFamily: serif }}>{value ?? "—"}<span style={{ fontSize: 13, color: accent, marginLeft: 3, fontFamily: sans }}>{unit}</span></span>
  </div>);
}

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (<div style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 8, padding: "10px 14px", fontSize: 12, fontFamily: mono, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
    <div style={{ color: C.textLight, marginBottom: 6 }}>{label}</div>
    {payload.map(p => (<div key={p.dataKey} style={{ color: p.color, marginBottom: 3 }}>{p.name}: {p.value}{p.dataKey === "dollars" ? "" : p.dataKey === "kwh" ? " kWh" : "°F"}</div>))}
  </div>);
};

function Card({ project, sel, onClick, readings }) {
  const lat = readings?.[readings.length - 1];
  const sav = calcSavings(project, readings);
  const hasData = !!lat;
  return (<div onClick={onClick} style={{ cursor: "pointer", background: sel ? "rgba(26,92,56,0.08)" : C.white, border: `1px solid ${sel ? C.forest : C.cardBorder}`, borderRadius: 10, padding: "14px 16px", transition: "all 0.2s", position: "relative", overflow: "hidden" }}>
    {sel && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${C.forest}, ${C.accent})` }} />}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
      <div><div style={{ color: C.textDark, fontWeight: 600, fontSize: 13, fontFamily: serif }}>{project.address}</div><div style={{ color: C.textLight, fontSize: 11, fontFamily: mono, marginTop: 2 }}>{project.city}</div></div>
      <div style={{ background: hasData ? `${C.forest}18` : `${C.gold}18`, color: hasData ? C.forest : C.gold, fontSize: 9, padding: "2px 8px", borderRadius: 20, fontFamily: mono, fontWeight: 500 }}>{hasData ? "LIVE" : "NO DATA"}</div>
    </div>
    {hasData && <div style={{ display: "flex", gap: 14 }}>
      <div><div style={{ color: C.textLight, fontSize: 9, fontFamily: mono }}>ATTIC</div><div style={{ color: "#c45e4a", fontSize: 17, fontWeight: 700, fontFamily: serif }}>{lat.temp_attic}°</div></div>
      <div><div style={{ color: C.textLight, fontSize: 9, fontFamily: mono }}>INDOOR</div><div style={{ color: C.accent, fontSize: 17, fontWeight: 700, fontFamily: serif }}>{lat.temp_indoor}°</div></div>
      <div style={{ marginLeft: "auto", textAlign: "right" }}><div style={{ color: C.textLight, fontSize: 9, fontFamily: mono }}>SAVED</div><div style={{ color: C.forest, fontSize: 17, fontWeight: 700, fontFamily: serif }}>${sav.dollarsSaved}</div></div>
    </div>}
  </div>);
}

function InsulSel({ value, onChange }) {
  const [sel, setSel] = useState(value || []);
  const tog = id => { let n = sel.find(s => s.typeId === id) ? sel.filter(s => s.typeId !== id) : [...sel, { typeId: id, pct: 0 }]; const ev = n.length ? Math.floor(100 / n.length) : 0, rm = n.length ? 100 - ev * n.length : 0; n = n.map((s, i) => ({ ...s, pct: ev + (i === 0 ? rm : 0) })); setSel(n); onChange(n); };
  const upd = (id, v) => { const n = sel.map(s => s.typeId === id ? { ...s, pct: Math.max(0, Math.min(100, Number(v) || 0)) } : s); setSel(n); onChange(n); };
  const tot = sel.reduce((s, e) => s + e.pct, 0);
  return (<div>
    <label style={lblS}>Insulation Types (select all present)</label>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
      {INSULATION_TYPES.map(t => { const on = !!sel.find(s => s.typeId === t.id); return (<button key={t.id} onClick={() => tog(t.id)} style={{ background: on ? `${C.forest}14` : C.white, border: `1px solid ${on ? C.forest : C.inputBorder}`, borderRadius: 6, padding: "6px 11px", color: on ? C.forest : C.textLight, fontSize: 12, fontFamily: sans, cursor: "pointer", fontWeight: on ? 600 : 400 }}>{t.label}</button>); })}
    </div>
    {sel.length > 1 && (<div style={{ background: C.creamLight, borderRadius: 8, padding: 12, border: `1px solid ${C.cardBorder}` }}>
      <div style={{ fontSize: 10, color: C.textLight, fontFamily: mono, marginBottom: 8 }}>COVERAGE % {tot !== 100 && <span style={{ color: C.danger, marginLeft: 8 }}>Total: {tot}%</span>}{tot === 100 && <span style={{ color: C.forest, marginLeft: 8 }}>✓ 100%</span>}</div>
      {sel.map(s => { const t = INSULATION_TYPES.find(x => x.id === s.typeId); return (<div key={s.typeId} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}><span style={{ color: C.textMid, fontSize: 12, fontFamily: sans, minWidth: 170 }}>{t?.label}</span><input type="number" min="0" max="100" value={s.pct} onChange={e => upd(s.typeId, e.target.value)} style={{ ...inpS, width: 65, textAlign: "center" }} /><span style={{ color: C.textLight, fontSize: 12, fontFamily: mono }}>%</span></div>); })}
      <div style={{ marginTop: 6, fontSize: 11, color: C.textLight, fontFamily: mono }}>Blended R-value: <span style={{ color: C.forest, fontWeight: 600 }}>R-{(1 / computeU(sel)).toFixed(1)}</span></div>
    </div>)}
    {sel.length === 1 && <div style={{ fontSize: 11, color: C.textLight, fontFamily: mono, marginTop: 4 }}>R-value: <span style={{ color: C.forest, fontWeight: 600 }}>R-{INSULATION_TYPES.find(x => x.id === sel[0].typeId)?.rValue}</span></div>}
  </div>);
}

function SeerIn({ seer, src, onS, onSrc }) {
  const [m, setM] = useState(src || "exact"); const [ag, setAg] = useState("2006_2015");
  const sw = v => { setM(v); onSrc(v); if (v === "age") { const g = SEER_BY_AGE.find(x => x.id === ag); onS(g?.seer || 13); } };
  return (<div>
    <label style={lblS}>AC Efficiency (SEER)</label>
    <div style={{ background: C.creamLight, border: `1px solid ${C.cardBorder}`, borderRadius: 10, padding: 14, marginBottom: 6 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {[["exact", "I found the SEER"], ["age", "Estimate by age"]].map(([v, l]) => (<button key={v} onClick={() => sw(v)} style={{ flex: 1, background: m === v ? `${C.forest}12` : C.white, border: `1px solid ${m === v ? C.forest : C.inputBorder}`, borderRadius: 6, padding: "8px 10px", color: m === v ? C.forest : C.textLight, fontSize: 12, fontFamily: sans, cursor: "pointer", fontWeight: m === v ? 600 : 400 }}>{l}</button>))}
      </div>
      {m === "exact" ? (<div><input type="number" min="6" max="30" step="0.5" value={seer} onChange={e => onS(Number(e.target.value))} style={{ ...inpS, marginBottom: 8 }} placeholder="e.g. 14" /><div style={{ fontSize: 11, color: C.textLight, fontFamily: sans, lineHeight: 1.6 }}><span style={{ color: C.forest, fontWeight: 600 }}>Where to find it:</span> Yellow EnergyGuide sticker on outdoor condenser — side panel or access cover.</div></div>
      ) : (<div><div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
        {SEER_BY_AGE.map(g => (<button key={g.id} onClick={() => { setAg(g.id); onS(g.seer); }} style={{ background: ag === g.id ? `${C.forest}14` : C.white, border: `1px solid ${ag === g.id ? C.forest : C.inputBorder}`, borderRadius: 6, padding: "6px 11px", color: ag === g.id ? C.forest : C.textLight, fontSize: 12, fontFamily: sans, cursor: "pointer", fontWeight: ag === g.id ? 600 : 400 }}>{g.label} <span style={{ color: C.textLight, marginLeft: 3, fontSize: 11 }}>~{g.seer}</span></button>))}
      </div><div style={{ fontSize: 11, color: C.textLight, fontFamily: sans, lineHeight: 1.6 }}><span style={{ color: C.gold, fontWeight: 600 }}>How to estimate age:</span> Data plate on outdoor unit — manufacture date or serial number.</div></div>)}
    </div>
    <div style={{ fontSize: 11, color: C.textLight, fontFamily: mono }}>SEER: <span style={{ color: C.forest }}>{seer}</span> → COP: <span style={{ color: C.forest }}>{(seer / 3.412).toFixed(2)}</span></div>
  </div>);
}

function Form({ project, onSave, onCancel }) {
  const ins = typeof project?.insulation === "string" ? JSON.parse(project.insulation) : (project?.insulation || []);
  const [sq, setSq] = useState(project?.sq_ft || ""); const [ht, setHt] = useState(project?.hvac_tons || "");
  const [se, setSe] = useState(project?.seer || 14); const [ss, setSs] = useState(project?.seer_source || "exact");
  const [ur, setUr] = useState(project?.utility_rate || 0.118); const [insul, setInsul] = useState(ins);
  return (<div style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(26,92,56,0.04)" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
      <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 16, color: C.textDark }}>Install Intake</div>
      <div style={{ fontSize: 10, color: C.textLight, fontFamily: mono, background: C.creamLight, padding: "4px 10px", borderRadius: 6 }}>Fill on-site</div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
      <div><label style={lblS}>Ceiling Sq Ft</label><input type="number" value={sq} onChange={e => setSq(e.target.value)} style={inpS} placeholder="1850" /></div>
      <div><label style={lblS}>HVAC Tonnage</label><input type="number" step="0.5" value={ht} onChange={e => setHt(e.target.value)} style={inpS} placeholder="3" /></div>
      <div><label style={lblS}>Utility $/kWh</label><input type="number" step="0.001" value={ur} onChange={e => setUr(Number(e.target.value))} style={inpS} placeholder="0.118" /></div>
    </div>
    <div style={{ marginBottom: 20 }}><SeerIn seer={se} src={ss} onS={setSe} onSrc={setSs} /></div>
    <div style={{ marginBottom: 20 }}><InsulSel value={insul} onChange={setInsul} /></div>
    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
      {onCancel && <button onClick={onCancel} style={{ background: "transparent", border: `1px solid ${C.cardBorder}`, borderRadius: 8, padding: "9px 20px", color: C.textLight, fontSize: 12, fontFamily: sans, cursor: "pointer" }}>Cancel</button>}
      <button onClick={() => onSave({ sq_ft: Number(sq), hvac_tons: Number(ht), seer: se, seer_source: ss, utility_rate: ur, insulation: JSON.stringify(insul), ceiling_u: computeU(insul) })} style={{ background: C.forest, border: "none", borderRadius: 8, padding: "9px 24px", color: C.cream, fontSize: 12, fontFamily: sans, fontWeight: 600, cursor: "pointer" }}>Save</button>
    </div>
  </div>);
}

function Loader() {
  return (<div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 200 }}>
    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    <div style={{ width: 32, height: 32, border: `3px solid ${C.cardBorder}`, borderTop: `3px solid ${C.forest}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
  </div>);
}

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
    try {
      const data = await supaFetch("projects", "select=*&order=install_date.desc");
      setProjects(data);
      if (data.length && !selId) setSelId(data[0].id);
    } catch (e) { console.error("Failed to load projects:", e); }
  }, [selId]);

  const loadReadings = useCallback(async (projectId) => {
    try {
      const data = await supaFetch("readings", `select=*&project_id=eq.${projectId}&order=recorded_at.asc&limit=5000`);
      setReadings(prev => ({ ...prev, [projectId]: data }));
    } catch (e) { console.error("Failed to load readings:", e); }
  }, []);

  useEffect(() => {
    if (!auth) return;
    setLoading(true);
    loadProjects().then(() => setLoading(false));
  }, [auth, loadProjects]);

  useEffect(() => {
    if (!selId || !auth) return;
    loadReadings(selId);
  }, [selId, auth, loadReadings]);

  useEffect(() => {
    if (!auth || !selId) return;
    const interval = setInterval(() => {
      loadReadings(selId);
      setLastRefresh(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, [auth, selId, loadReadings]);

  if (!auth) return <LoginScreen onLogin={() => setAuth(true)} />;

  const proj = projects.find(p => p.id === selId);
  const allR = readings[selId] || [];
  const cutoff = Date.now() - range * 86400000;
  const filteredR = allR.filter(r => new Date(r.recorded_at).getTime() > cutoff);
  const sav = calcSavings(proj, allR);
  const lat = allR[allR.length - 1];
  const cum = getCumData(proj, allR);
  const sampleRate = Math.max(1, Math.floor(filteredR.length / 100));
  const chartData = filteredR.filter((_, i) => i % sampleRate === 0).map(r => ({
    label: new Date(r.recorded_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric" }),
    attic: +r.temp_attic, indoor: +r.temp_indoor, outdoor: +r.temp_outdoor,
  }));
  const totD = projects.reduce((s, p) => s + calcSavings(p, readings[p.id] || []).dollarsSaved, 0);
  const totK = projects.reduce((s, p) => s + calcSavings(p, readings[p.id] || []).kwhSaved, 0);
  const uV = proj ? (proj.ceiling_u || computeU(typeof proj.insulation === "string" ? JSON.parse(proj.insulation) : (proj.insulation || []))) : 0.05;

  const handleSave = async (data) => {
    try {
      await supaUpsert("projects", { id: selId, ...data });
      await loadProjects();
      setForm(false);
    } catch (e) { console.error("Save failed:", e); alert("Failed to save."); }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.cream, color: C.textDark, fontFamily: sans }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Source+Sans+3:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${C.cardBorder};border-radius:2px}.rb{background:${C.white};border:1px solid ${C.cardBorder};cursor:pointer;transition:all .15s;border-radius:6px}.rb:hover{border-color:${C.forest}!important;color:${C.forest}!important}input:focus{border-color:${C.forest}!important;box-shadow:0 0 0 3px ${C.forest}1a}`}</style>

      <div style={{ borderBottom: `1px solid ${C.cardBorder}`, padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: C.forest, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={LOGO} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", border: `2px solid ${C.accent}` }} />
          <div><div style={{ fontFamily: serif, fontWeight: 700, fontSize: 17, color: C.cream }}>Mallett Made</div><div style={{ fontSize: 9, color: C.mutedLight, fontFamily: mono, letterSpacing: "0.1em" }}>RADIANT MONITOR</div></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: C.mutedLight, fontFamily: mono }}>ALL SITES · TOTAL SAVED</div>
            <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.cream, fontFamily: serif }}>${totD.toFixed(2)}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.goldLight, fontFamily: mono }}>{totK.toFixed(0)} kWh</div>
            </div>
          </div>
          <div style={{ background: `${C.accent}30`, border: `1px solid ${C.accent}50`, borderRadius: 8, padding: "5px 14px", fontSize: 11, color: C.creamDark, fontFamily: mono }}>{projects.length} sites</div>
          <button onClick={() => setAuth(false)} style={{ background: "transparent", border: `1px solid ${C.accent}50`, borderRadius: 6, padding: "5px 12px", color: C.creamDark, fontSize: 11, fontFamily: mono, cursor: "pointer" }}>Sign Out</button>
        </div>
      </div>

      {loading ? <Loader /> : (
        <div style={{ display: "flex", height: "calc(100vh - 61px)" }}>
          <div style={{ width: 274, borderRight: `1px solid ${C.cardBorder}`, padding: "18px 14px", overflowY: "auto", flexShrink: 0, display: "flex", flexDirection: "column", gap: 8, background: C.creamLight }}>
            <div style={{ fontSize: 10, color: C.textLight, fontFamily: mono, letterSpacing: "0.08em", marginBottom: 4, padding: "0 2px" }}>INSTALL LOCATIONS</div>
            {projects.map(p => (<Card key={p.id} project={p} sel={p.id === selId} onClick={() => { setSelId(p.id); setForm(false); loadReadings(p.id); }} readings={readings[p.id] || []} />))}
            {projects.length === 0 && <div style={{ color: C.textLight, fontSize: 13, fontFamily: sans, padding: 12 }}>No projects yet.</div>}
          </div>

          {proj ? (
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
              <div style={{ marginBottom: 24, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <h1 style={{ fontFamily: serif, fontWeight: 800, fontSize: 24, color: C.textDark }}>{proj.address}</h1>
                  <div style={{ color: C.textLight, fontSize: 12, fontFamily: mono, marginTop: 4 }}>
                    {proj.city} {proj.install_date && `· Installed ${new Date(proj.install_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`} {proj.sq_ft && `· ${proj.sq_ft.toLocaleString()} sq ft`}
                  </div>
                  <div style={{ color: C.textLight, fontSize: 10, fontFamily: mono, marginTop: 2 }}>Auto-refreshes every 60s · {allR.length} readings</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button onClick={() => { loadReadings(selId); setLastRefresh(new Date()); }} style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 8, padding: "6px 14px", color: C.textLight, fontSize: 12, fontFamily: sans, cursor: "pointer" }}>↻ Refresh</button>
                  <button onClick={() => setForm(!form)} style={{ background: form ? `${C.forest}12` : C.white, border: `1px solid ${form ? C.forest : C.cardBorder}`, borderRadius: 8, padding: "6px 14px", color: form ? C.forest : C.textLight, fontSize: 12, fontFamily: sans, cursor: "pointer", fontWeight: form ? 600 : 400 }}>{form ? "✕ Close" : "✎ Edit Install"}</button>
                  <div style={{ display: "flex", gap: 4 }}>{[1, 7, 14, 30].map(d => (<button key={d} className="rb" onClick={() => setRange(d)} style={{ padding: "5px 10px", fontSize: 11, fontFamily: mono, color: range === d ? C.forest : C.textLight, borderColor: range === d ? C.forest : C.cardBorder, fontWeight: range === d ? 600 : 400 }}>{d}d</button>))}</div>
                </div>
              </div>

              {form && <div style={{ marginBottom: 24 }}><Form project={proj} onSave={handleSave} onCancel={() => setForm(false)} /></div>}

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
                <Pill label="Attic" value={lat?.temp_attic} unit="°F" accent="#c45e4a" />
                <Pill label="Indoor" value={lat?.temp_indoor} unit="°F" accent={C.accent} />
                <Pill label="Outdoor" value={lat?.temp_outdoor} unit="°F" accent={C.gold} />
                <Pill label="kWh Saved" value={sav.kwhSaved} unit="kWh" accent={C.forest} />
                <Pill label="$ Saved" value={`$${sav.dollarsSaved}`} unit="" accent={C.forest} />
                <Pill label="SEER" value={proj.seer} unit="" accent={C.accent} />
              </div>

              {chartData.length > 0 ? (
                <div style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "20px 16px 12px", marginBottom: 16, boxShadow: "0 1px 3px rgba(26,92,56,0.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, padding: "0 8px" }}>
                    <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 15, color: C.textDark }}>Temperature History</div>
                    <div style={{ display: "flex", gap: 16 }}>{[["#c45e4a", "Attic"], [C.accent, "Indoor"], [C.gold, "Outdoor"]].map(([c, l]) => (<div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.textLight, fontFamily: mono }}><div style={{ width: 16, height: 2, background: c, borderRadius: 1 }} />{l}</div>))}</div>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <XAxis dataKey="label" tick={{ fill: C.textLight, fontSize: 9, fontFamily: "IBM Plex Mono" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                      <YAxis tick={{ fill: C.textLight, fontSize: 10, fontFamily: "IBM Plex Mono" }} tickLine={false} axisLine={false} />
                      <Tooltip content={<Tip />} />
                      <Line type="monotone" dataKey="attic" name="Attic" stroke="#c45e4a" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="indoor" name="Indoor" stroke={C.accent} strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="outdoor" name="Outdoor" stroke={C.gold} strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: 40, marginBottom: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 14, color: C.textLight, fontFamily: sans }}>Waiting for sensor data...</div>
                  <div style={{ fontSize: 12, color: C.muted, fontFamily: mono, marginTop: 8 }}>Readings appear here once the ESP32 starts posting</div>
                </div>
              )}

              {cum.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "20px 16px 12px", boxShadow: "0 1px 3px rgba(26,92,56,0.04)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "0 8px" }}>
                      <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 14, color: C.textDark }}>Cumulative $ Saved</div>
                      <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 20, color: C.forest }}>${cum[cum.length - 1]?.dollars || 0}</div>
                    </div>
                    <ResponsiveContainer width="100%" height={140}>
                      <AreaChart data={cum} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <defs><linearGradient id="gD" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.forest} stopOpacity={0.2} /><stop offset="100%" stopColor={C.forest} stopOpacity={0.02} /></linearGradient></defs>
                        <XAxis dataKey="day" tick={{ fill: C.textLight, fontSize: 9, fontFamily: "IBM Plex Mono" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                        <YAxis tick={{ fill: C.textLight, fontSize: 9, fontFamily: "IBM Plex Mono" }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
                        <Tooltip content={<Tip />} />
                        <Area type="monotone" dataKey="dollars" name="$ Saved" stroke={C.forest} strokeWidth={2} fill="url(#gD)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "20px 16px 12px", boxShadow: "0 1px 3px rgba(26,92,56,0.04)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "0 8px" }}>
                      <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 14, color: C.textDark }}>Cumulative kWh Saved</div>
                      <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 20, color: C.accent }}>{cum[cum.length - 1]?.kwh || 0}</div>
                    </div>
                    <ResponsiveContainer width="100%" height={140}>
                      <AreaChart data={cum} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <defs><linearGradient id="gK" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.accent} stopOpacity={0.2} /><stop offset="100%" stopColor={C.accent} stopOpacity={0.02} /></linearGradient></defs>
                        <XAxis dataKey="day" tick={{ fill: C.textLight, fontSize: 9, fontFamily: "IBM Plex Mono" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                        <YAxis tick={{ fill: C.textLight, fontSize: 9, fontFamily: "IBM Plex Mono" }} tickLine={false} axisLine={false} />
                        <Tooltip content={<Tip />} />
                        <Area type="monotone" dataKey="kwh" name="kWh Saved" stroke={C.accent} strokeWidth={2} fill="url(#gK)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(26,92,56,0.04)" }}>
                  <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 14, marginBottom: 16, color: C.textDark }}>Savings Breakdown</div>
                  {[["Baseline Attic Δ", `${sav.baselineDelta}°F`, C.textLight], ["Current Attic Δ", `${sav.avgAtticDelta}°F`, C.gold], ["Indoor-Outdoor Δ", `${sav.avgIndoorDelta}°F`, C.accent], ["Blended U-Value", `${typeof uV === "number" ? uV.toFixed(4) : uV}`, C.textMid], ["SEER / COP", `${proj.seer || 14} / ${sav.cop}`, C.accent], ["kWh Saved", `${sav.kwhSaved} kWh`, C.forest], ["Cost Saved", `$${sav.dollarsSaved}`, C.forest], ["Utility Rate", `$${proj.utility_rate || 0.118}/kWh`, C.textLight]].map(([l, v, c]) => (<div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 12 }}><span style={{ color: C.textLight, fontFamily: mono }}>{l}</span><span style={{ color: c, fontWeight: 600, fontFamily: mono }}>{v}</span></div>))}
                </div>
                <div style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(26,92,56,0.04)" }}>
                  <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 14, marginBottom: 16, color: C.textDark }}>Install Specs</div>
                  {[["Square Footage", proj.sq_ft ? `${proj.sq_ft.toLocaleString()} sq ft` : "—"], ["HVAC Capacity", proj.hvac_tons ? `${proj.hvac_tons} tons` : "—"], ["SEER", `${proj.seer || 14} (${proj.seer_source || "est."})`], ["Blended R-Value", `R-${typeof uV === "number" ? (1 / uV).toFixed(1) : "—"}`], ["Sensor: Attic", proj.sensor_attic || "—"], ["Sensor: Indoor", proj.sensor_indoor || "—"], ["Sensor: Outdoor", proj.sensor_outdoor || "—"]].map(([l, v]) => (<div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 12, gap: 12 }}><span style={{ color: C.textLight, fontFamily: mono, flexShrink: 0 }}>{l}</span><span style={{ color: C.textMid, fontFamily: mono, textAlign: "right" }}>{v}</span></div>))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center", color: C.textLight }}><div style={{ fontSize: 16, marginBottom: 8 }}>No project selected</div></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
