import { useState, useEffect, useRef } from "react";
import { PageHead } from "@/components/SEO";

const AUTH_KEY = "_mab_auth";

const IconAnalytics = () => (
  <svg className="w-3.5 h-3.5 stroke-current flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
  </svg>
);

const IconUsers = () => (
  <svg className="w-3.5 h-3.5 stroke-current flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const IconSearch = () => (
  <svg className="w-3.5 h-3.5 stroke-current flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
  </svg>
);

const IconPlus = () => (
  <svg className="w-3.5 h-3.5 stroke-current flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconStar = () => (
  <svg className="w-3 h-3 stroke-current flex-shrink-0 inline" fill="currentColor" viewBox="0 0 24 24" stroke="none">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

// Soft Outline SVG Icons
const IconOverview = () => (
  <svg className="w-4 h-4 stroke-current flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

const IconTraffic = () => (
  <svg className="w-4 h-4 stroke-current flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const IconPages = () => (
  <svg className="w-4 h-4 stroke-current flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const IconDevices = () => (
  <svg className="w-4 h-4 stroke-current flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const IconCountries = () => (
  <svg className="w-4 h-4 stroke-current flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

const IconBrowsers = () => (
  <svg className="w-4 h-4 stroke-current flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12a4 4 0 108 0 4 4 0 10-8 0" />
  </svg>
);

const IconRealtime = () => (
  <svg className="w-4 h-4 stroke-current flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconEngagement = () => (
  <svg className="w-4 h-4 stroke-current flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconSocial = () => (
  <svg className="w-4 h-4 stroke-current flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

const IconReferral = () => (
  <svg className="w-4 h-4 stroke-current flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
  </svg>
);

const IconOrganic = () => (
  <svg className="w-4 h-4 stroke-current flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconSettings = () => (
  <svg className="w-3.5 h-3.5 stroke-current flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

export default function ManageAdmin() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [search, setSearch] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("analytics"); // "analytics", "users", or "settings"
  const [maintenance, setMaintenance] = useState({ enabled: false, title: "", message: "", eta: "" });
  const [maintenanceSaving, setMaintenanceSaving] = useState(false);
  const [maintenanceMsg, setMaintenanceMsg] = useState("");
  const [adminPw, setAdminPw] = useState("");
  const inputRef = useRef(null);

  // Re-enable scrolling on mounting this component
  useEffect(() => {
    if (authed) {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
      return () => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      };
    }
  }, [authed]);

  useEffect(() => {
    if (localStorage.getItem(AUTH_KEY) === "1") {
      setAuthed(true);
      setAdminPw(localStorage.getItem("_mab_pw") || "");
    }
  }, []);

  // Poll for real-time analytics and user list
  useEffect(() => {
    if (authed) {
      fetchAnalytics();
      fetchUsers();
      fetchMaintenance();

      const interval = setInterval(() => {
        fetchAnalytics();
        fetchUsers();
      }, 3000); // Poll every 3 seconds for live 100% real data updates

      return () => clearInterval(interval);
    }
  }, [authed]);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      setUsers([]);
    }
  }

  async function fetchMaintenance() {
    try {
      const res = await fetch("/api/admin/maintenance");
      const data = await res.json();
      if (!data.error) {
        setMaintenance(data);
      }
    } catch {}
  }

  async function saveMaintenance() {
    setMaintenanceSaving(true);
    setMaintenanceMsg("");
    try {
      const pw = adminPw || localStorage.getItem("_mab_pw") || "";
      const res = await fetch("/api/admin/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw, ...maintenance }),
      });
      const data = await res.json();
      if (data.success) {
        setMaintenanceMsg("saved");
        fetchMaintenance();
      } else {
        setMaintenanceMsg(data.error || "Failed to save");
      }
    } catch {
      setMaintenanceMsg("Server error");
    }
    setMaintenanceSaving(false);
  }

  async function fetchAnalytics() {
    try {
      const res = await fetch("/api/admin/analytics");
      const data = await res.json();
      if (!data.error) {
        setAnalytics(data);
      }
    } catch (e) {
      console.error("Analytics fetch error:", e);
    }
  }

  async function doLogin() {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem(AUTH_KEY, "1");
        localStorage.setItem("_mab_pw", pw);
        setAuthed(true);
      } else {
        setErr(data.error || "Wrong password");
      }
    } catch {
      setErr("Server connection failed. Run 'npm run dev' to verify.");
    }
    setLoading(false);
  }

  function logout() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem("_mab_pw");
    setAuthed(false);
    setPw("");
  }

  async function addUser() {
    const e = emailInput.trim().toLowerCase();
    if (!e) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: e }),
      });
      const data = await res.json();
      if (data.user) {
        setEmailInput("");
        setShowAdd(false);
        fetchUsers();
      } else {
        setErr(data.error || "Failed to add");
      }
    } catch {
      setErr("Server error");
    }
    setLoading(false);
  }

  async function toggleUnlimited(email) {
    const u = users.find((x) => x.email === email);
    if (!u) return;
    const newVal = !u.unlimited;
    try {
      await fetch("/api/admin/users/unlimited", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, value: newVal }),
      });
      fetchUsers();
    } catch (e) {
      console.error(e);
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.displayName || "").toLowerCase().includes(search.toLowerCase())
  );

  // SVG Chart Builders
  function renderTrafficGraph() {
    const graphData = analytics?.trafficGraph || [];
    if (graphData.length === 0) return <div className="text-xs text-slate-400 py-6 text-center">Loading chart...</div>;

    const totals = graphData.map(d => d.total);
    const maxVal = Math.max(...totals, 5);
    const width = 320;
    const height = 100;
    const padding = 15;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    const points = graphData.map((d, idx) => {
      const x = padding + (idx * (chartWidth / (graphData.length - 1)));
      const y = height - padding - ((d.total / maxVal) * chartHeight);
      return { x, y };
    });

    const pathD = points.reduce((acc, p, idx) => {
      return acc + `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`;
    }, "");

    const areaD = pathD + ` L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    // compute approximate path length for line animation
    let pathLength = 0;
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      pathLength += Math.sqrt(dx * dx + dy * dy);
    }

    const allZero = totals.every(t => t === 0);

    return (
      <div className="w-full">
        {allZero ? (
          <div className="text-[10px] text-slate-400 py-8 text-center italic">No traffic logged in this period</div>
        ) : (
          <svg
            className="w-full h-[100px] drop-shadow-sm"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="greenGradSoft" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2e7d32" stopOpacity="0.20" />
                <stop offset="100%" stopColor="#2e7d32" stopOpacity="0.0" />
              </linearGradient>
              <filter id="glowGreen">
                <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#2e7d32" floodOpacity="0.3" />
              </filter>
            </defs>
            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#cbd5e1" strokeDasharray="3,3" strokeWidth="0.5" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#94a3b8" strokeWidth="0.5" />
            <path d={areaD} fill="url(#greenGradSoft)" />
            <path
              d={pathD}
              fill="none"
              stroke="#2e7d32"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="line-chart-path"
              style={{ '--path-length': pathLength, strokeDasharray: pathLength, strokeDashoffset: pathLength }}
            />
            {points.map((p, idx) => (
              <g key={idx} style={{ animation: `fadeIn 0.3s ${0.3 + idx * 0.15}s both` }}>
                <circle cx={p.x} cy={p.y} r="3.5" fill="#2e7d32" stroke="#ffffff" strokeWidth="1.5" filter="url(#glowGreen)" />
                <text x={p.x} y={height - 2} fontSize="7" fill="#64748b" textAnchor="middle" fontWeight="500">
                  {graphData[idx].date}
                </text>
              </g>
            ))}
          </svg>
        )}
      </div>
    );
  }

  function renderDevicesDonut() {
    const devices = analytics?.devices;
    if (!devices) return <div className="text-xs text-slate-400 py-6 text-center">Loading breakdown...</div>;

    const mPct = devices.mobile.percentage || 0;
    const dPct = devices.desktop.percentage || 0;
    const tPct = devices.tablet.percentage || 0;
    const totalCount = devices.mobile.count + devices.desktop.count + devices.tablet.count;

    if (totalCount === 0) {
      return (
        <div className="flex items-center gap-4 mt-2">
          <svg width="70" height="70" viewBox="0 0 36 36" className="transform -rotate-90 flex-shrink-0">
            <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="4.5" />
          </svg>
          <div className="text-[11px] text-slate-400 italic">No devices logged yet</div>
        </div>
      );
    }

    const c = 100.5; // circumference
    const strokeM = (mPct / 100) * c;
    const strokeD = (dPct / 100) * c;
    const strokeT = (tPct / 100) * c;

    const offsetM = 0;
    const offsetD = strokeM;
    const offsetT = strokeM + strokeD;

    return (
      <div className="flex items-center gap-4 mt-2">
        <div className="relative flex-shrink-0">
          <svg width="72" height="72" viewBox="0 0 36 36" className="transform -rotate-90">
            <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="4.5" />
            {mPct > 0 && (
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#1a73e8"
                strokeWidth="4.5"
                strokeDasharray={`${strokeM} ${c - strokeM}`}
                strokeDashoffset={-offsetM}
                className="donut-segment"
                style={{ '--circ': c, '--final': -offsetM, strokeLinecap: 'round' }}
              />
            )}
            {dPct > 0 && (
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#8e24aa"
                strokeWidth="4.5"
                strokeDasharray={`${strokeD} ${c - strokeD}`}
                strokeDashoffset={-offsetD}
                className="donut-segment"
                style={{ '--circ': c, '--final': -offsetD, strokeLinecap: 'round', animationDelay: '0.15s' }}
              />
            )}
            {tPct > 0 && (
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#ff9800"
                strokeWidth="4.5"
                strokeDasharray={`${strokeT} ${c - strokeT}`}
                strokeDashoffset={-offsetT}
                className="donut-segment"
                style={{ '--circ': c, '--final': -offsetT, strokeLinecap: 'round', animationDelay: '0.3s' }}
              />
            )}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-600 pointer-events-none" style={{ animation: 'fadeIn 0.5s 0.5s both' }}>
            {totalCount}
          </div>
        </div>
        <div className="flex-1 text-[11px] space-y-1.5 text-slate-700">
          <div className="flex items-center justify-between px-1">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#1a73e8] shadow-sm"></span><span className="text-slate-500">Mobile</span></span>
            <span className="font-semibold text-slate-700">{mPct}% <span className="text-slate-400 font-normal">({devices.mobile.count})</span></span>
          </div>
          <div className="flex items-center justify-between px-1">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#8e24aa] shadow-sm"></span><span className="text-slate-500">Desktop</span></span>
            <span className="font-semibold text-slate-700">{dPct}% <span className="text-slate-400 font-normal">({devices.desktop.count})</span></span>
          </div>
          <div className="flex items-center justify-between px-1">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#ff9800] shadow-sm"></span><span className="text-slate-500">Tablet</span></span>
            <span className="font-semibold text-slate-700">{tPct}% <span className="text-slate-400 font-normal">({devices.tablet.count})</span></span>
          </div>
        </div>
      </div>
    );
  }

  function renderRealTimeBarChart() {
    const rtChart = analytics?.realTimeStats?.chart || [];
    if (rtChart.length === 0) return <div className="text-xs text-slate-400 py-6 text-center">Loading chart...</div>;

    const totals = rtChart.map(c => c.activeUsers);
    const maxActive = Math.max(...totals, 5);
    const width = 320;
    const height = 75;
    const padding = 10;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    const barWidth = (chartWidth / rtChart.length) * 0.55;
    const gap = (chartWidth / rtChart.length) * 0.45;

    const allZero = totals.every(t => t === 0);

    return (
      <div className="w-full mt-2">
        {allZero ? (
          <div className="text-[10px] text-slate-400 py-6 text-center italic">No active traffic in last 10 mins</div>
        ) : (
          <svg className="w-full h-[75px]" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="barGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#ff9800" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#ff9800" stopOpacity="0.85" />
              </linearGradient>
            </defs>
            {rtChart.map((d, idx) => {
              const x = padding + idx * (barWidth + gap);
              const barHeight = (d.activeUsers / maxActive) * chartHeight;
              const y = height - padding - barHeight;
              return (
                <g key={idx} className="bar-chart-rect" style={{ animationDelay: `${idx * 0.06}s` }}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx="2"
                    fill="url(#barGrad)"
                    className="opacity-80 hover:opacity-100 transition-all duration-200"
                    style={{ filter: 'drop-shadow(0 1px 2px rgba(255, 152, 0, 0.15))' }}
                  />
                </g>
              );
            })}
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#ff9800" opacity="0.2" strokeWidth="0.5" />
          </svg>
        )}
      </div>
    );
  }

  if (!authed) {
    return (
      <>
        <PageHead
          title="Admin Login"
          description="TryonAI admin panel login. Authorized access only."
          canonical="https://wingo30.com/manageadminbhai"
          noindex
        />
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-5">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-8 shadow-lg text-center">
            <div className="w-12 h-12 bg-[#2e7d32] rounded-xl flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">A</div>
            <h1 className="text-slate-800 text-xl font-bold mb-1">Admin Panel</h1>
            <p className="text-slate-500 text-sm mb-6">Server-side secure login</p>
            {err && <p className="text-red-500 text-sm mb-3 font-semibold">{err}</p>}
            <label htmlFor="adminPassword" style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", border: 0 }}>
              Admin Password
            </label>
            <input
              id="adminPassword"
              type="password"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 text-sm outline-none mb-3 focus:border-[#2e7d32] focus:bg-white transition-colors"
              placeholder="Admin Password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && doLogin()}
              ref={inputRef}
              autoFocus
            />
            <button
              className="w-full bg-[#2e7d32] text-white rounded-lg py-3 text-sm font-semibold hover:bg-[#25632a] disabled:opacity-50 transition-colors shadow-md cursor-pointer"
              onClick={doLogin}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHead
        title="Admin Dashboard"
        description="TryonAI admin dashboard. Analytics, user management, and platform monitoring."
        canonical="https://wingo30.com/manageadminbhai"
        noindex
      />
      {/* Scrollable Root Container */}
      <div className="fixed inset-0 overflow-y-auto bg-white text-slate-800 pb-20">
        {/* Top Navbar */}
        <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm backdrop-blur-md bg-opacity-95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 bg-[#2e7d32] rounded-lg flex items-center justify-center text-white font-bold text-sm">A</span>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">TryonAI Admin</h1>
              </div>
              <div className="flex items-center gap-3">
                <nav className="flex bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab("analytics")}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                      activeTab === "analytics"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <IconAnalytics /> Analytics Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab("users")}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                      activeTab === "users"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <IconUsers /> User Accounts
                  </button>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                      activeTab === "settings"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <IconSettings /> Settings
                  </button>
                </nav>
                <button
                  className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3.5 py-1.5 rounded-lg border border-red-100 transition-colors cursor-pointer"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Panels */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          {activeTab === "analytics" ? (
            <div>
              {/* Empty state alert if no visits have been logged yet */}
              {analytics && analytics.pageViewsCount === 0 && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6 flex items-start gap-3 text-blue-900 shadow-sm">
                  <svg className="w-5 h-5 stroke-current flex-shrink-0 mt-0.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <div>
                    <h4 className="font-bold text-sm">No Live Traffic Logged Yet</h4>
                    <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                      All metrics on this panel display strictly real data in real-time. To register traffic, open a new window or tab and visit the main site pages. Every user interaction will record live logs immediately.
                    </p>
                  </div>
                </div>
              )}

              {/* Responsive Grid containing the 11 feature boxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* 1. Analytics Overview (Amber/Orange - .big) */}
                <div className="relative overflow-hidden rounded-2xl p-5 border border-slate-100 flex flex-col justify-between min-h-[230px] big shadow-sm">
                  <div className="dot w-2 h-2 rounded-full absolute top-5 right-5"></div>
                  <div className="blob absolute -right-6 -bottom-6 w-20 h-20 rounded-full pointer-events-none"></div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <IconOverview />
                      <h3 className="text-slate-700 text-xs uppercase tracking-wider font-bold">Analytics Overview</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-slate-700 text-xs mt-3">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Registered Users</span>
                        <strong className="text-sm font-semibold">{analytics?.registeredUsersCount || 0}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Total Users</span>
                        <strong className="text-sm font-semibold">{analytics?.totalUsers || 0}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Active Users</span>
                        <strong className="text-sm font-semibold">{analytics?.activeUsers || 0}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Sessions</span>
                        <strong className="text-sm font-semibold">{analytics?.sessionsCount || 0}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-amber-200 border-opacity-30 pt-3">
                    <span className="text-[10px] text-slate-500 block">Total Page Views</span>
                    <p className="value text-2xl font-extrabold leading-none">{analytics?.pageViewsCount || 0}</p>
                  </div>
                </div>

                {/* 2. Site Traffic Graph (Green - .topno) */}
                <div className="relative overflow-hidden rounded-2xl p-5 border border-slate-100 flex flex-col justify-between min-h-[230px] topno shadow-sm">
                  <div className="dot w-2 h-2 rounded-full absolute top-5 right-5"></div>
                  <div className="blob absolute -right-6 -bottom-6 w-20 h-20 rounded-full pointer-events-none"></div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <IconTraffic />
                      <h3 className="text-slate-700 text-xs uppercase tracking-wider font-bold">Site Traffic Graph</h3>
                    </div>
                  </div>
                  <div className="my-auto flex items-center justify-center">
                    {renderTrafficGraph()}
                  </div>
                  <div className="flex justify-between items-end text-slate-500 mt-2 border-t border-green-200 border-opacity-30 pt-2">
                    <div>
                      <span className="text-[10px] block">Today&apos;s Traffic</span>
                      <strong className="value text-base font-bold">{analytics?.trafficGraph?.[6]?.total || 0} visits</strong>
                    </div>
                    <div className="text-[9px] text-right">7-day view</div>
                  </div>
                </div>

                {/* 3. Pages Section (Purple - .violet) */}
                <div className="relative overflow-hidden rounded-2xl p-5 border border-slate-100 flex flex-col justify-between min-h-[230px] violet shadow-sm">
                  <div className="dot w-2 h-2 rounded-full absolute top-5 right-5"></div>
                  <div className="blob absolute -right-6 -bottom-6 w-20 h-20 rounded-full pointer-events-none"></div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <IconPages />
                      <h3 className="text-slate-700 text-xs uppercase tracking-wider font-bold">Pages Section</h3>
                    </div>
                    <div className="space-y-2 max-h-[125px] overflow-y-auto pr-1">
                      {analytics && analytics.pagesRanking && analytics.pagesRanking.length > 0 ? (
                        analytics.pagesRanking.map((page, idx) => (
                          <div key={idx} className="text-xs text-slate-700">
                            <div className="flex justify-between font-medium mb-0.5">
                              <span className="truncate max-w-[170px]">{page.path}</span>
                              <span className="font-semibold">{page.count} views</span>
                            </div>
                            <div className="w-full bg-slate-200 bg-opacity-40 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-[#8e24aa] h-full rounded-full progress-bar-fill" 
                                style={{ width: `${Math.min(100, (page.count / (analytics.pagesRanking[0]?.count || 1)) * 100)}%` }}
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-slate-400 italic py-4 text-center">No visits registered</div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-purple-200 border-opacity-30 flex justify-between items-center">
                    <span className="text-[10px] text-slate-500">Top Visited Page</span>
                    <strong className="value text-xs font-bold truncate max-w-[150px]">
                      {analytics?.pagesRanking?.[0]?.path || "None"}
                    </strong>
                  </div>
                </div>

                {/* 4. Devices Section (Blue - .small) */}
                <div className="relative overflow-hidden rounded-2xl p-5 border border-slate-100 flex flex-col justify-between min-h-[230px] small shadow-sm">
                  <div className="dot w-2 h-2 rounded-full absolute top-5 right-5"></div>
                  <div className="blob absolute -right-6 -bottom-6 w-20 h-20 rounded-full pointer-events-none"></div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <IconDevices />
                      <h3 className="text-slate-700 text-xs uppercase tracking-wider font-bold">Devices Section</h3>
                    </div>
                    {renderDevicesDonut()}
                  </div>
                  <div className="mt-3 flex justify-between items-center text-xs">
                    <span className="text-[10px] text-slate-500">Breakdown Channel</span>
                    <strong className="value text-xs font-bold">Donut Display</strong>
                  </div>
                </div>

                {/* 5. Countries Section (Green - .topno) */}
                <div className="relative overflow-hidden rounded-2xl p-5 border border-slate-100 flex flex-col justify-between min-h-[230px] topno shadow-sm">
                  <div className="dot w-2 h-2 rounded-full absolute top-5 right-5"></div>
                  <div className="blob absolute -right-6 -bottom-6 w-20 h-20 rounded-full pointer-events-none"></div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <IconCountries />
                      <h3 className="text-slate-700 text-xs uppercase tracking-wider font-bold">Countries Section</h3>
                    </div>
                    <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                      {analytics && analytics.countries && analytics.countries.length > 0 ? (
                        analytics.countries.map((c, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-slate-700">
                            <span className="flex items-center gap-1.5">
                              <span className="text-sm leading-none">{c.flag}</span>
                              <span className="truncate max-w-[130px] font-medium">{c.name}</span>
                            </span>
                            <span className="font-semibold">{c.count}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-slate-400 italic py-4 text-center">No countries logged</div>
                      )}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-green-200 border-opacity-30 flex justify-between items-center">
                    <span className="text-[10px] text-slate-500">Top Country</span>
                    <strong className="value text-xs font-bold">
                      {analytics?.countries?.[0] ? `${analytics.countries[0].name} ${analytics.countries[0].flag}` : "None"}
                    </strong>
                  </div>
                </div>

                {/* 6. Browsers Section (Blue - .small) */}
                <div className="relative overflow-hidden rounded-2xl p-5 border border-slate-100 flex flex-col justify-between min-h-[230px] small shadow-sm">
                  <div className="dot w-2 h-2 rounded-full absolute top-5 right-5"></div>
                  <div className="blob absolute -right-6 -bottom-6 w-20 h-20 rounded-full pointer-events-none"></div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <IconBrowsers />
                      <h3 className="text-slate-700 text-xs uppercase tracking-wider font-bold">Browsers Section</h3>
                    </div>
                    <div className="space-y-2 max-h-[135px] overflow-y-auto pr-1">
                      {analytics && analytics.browsers && analytics.browsers.length > 0 ? (
                        analytics.browsers.map((b, idx) => (
                          <div key={idx} className="text-xs text-slate-700">
                            <div className="flex justify-between font-medium mb-0.5">
                              <span>{b.name}</span>
                              <span className="font-semibold">{b.count}</span>
                            </div>
                            <div className="w-full bg-slate-200 bg-opacity-40 h-1 rounded-full overflow-hidden">
                              <div 
                                className="bg-[#1a73e8] h-full rounded-full progress-bar-fill" 
                                style={{ width: `${Math.min(100, (b.count / (analytics.browsers[0]?.count || 1)) * 100)}%` }}
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-slate-400 italic py-4 text-center">No browsers logged</div>
                      )}
                    </div>
                  </div>
                  <div className="pt-1.5 border-t border-blue-200 border-opacity-30 flex justify-between items-center">
                    <span className="text-[10px] text-slate-500">Top Browser</span>
                    <strong className="value text-xs font-bold">{analytics?.browsers?.[0]?.name || "None"}</strong>
                  </div>
                </div>

                {/* 7. Real-time Section (Amber/Orange - .big) */}
                <div className="relative overflow-hidden rounded-2xl p-5 border border-slate-100 flex flex-col justify-between min-h-[230px] big shadow-sm">
                  <div className="dot w-2 h-2 rounded-full absolute top-5 right-5 animate-ping"></div>
                  <div className="dot w-2 h-2 rounded-full absolute top-5 right-5"></div>
                  <div className="blob absolute -right-6 -bottom-6 w-20 h-20 rounded-full pointer-events-none"></div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <IconRealtime />
                      <h3 className="text-slate-700 text-xs uppercase tracking-wider font-bold">Real-time Section</h3>
                    </div>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="value text-2xl font-extrabold">{analytics?.realTimeStats?.activeUsers || 0}</span>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">Active Users (5m)</span>
                    </div>
                    <div className="flex gap-4 text-[9px] text-slate-500 mt-1 font-semibold">
                      <span>New: <strong>{analytics?.realTimeStats?.newUsers || 0}</strong></span>
                      <span>Returning: <strong>{analytics?.realTimeStats?.returningUsers || 0}</strong></span>
                    </div>
                  </div>
                  <div className="my-1">
                    {renderRealTimeBarChart()}
                  </div>
                  <div className="text-[9px] text-slate-400 text-right mt-1 font-medium">Real-time Bar Chart</div>
                </div>

                {/* 8. Engagement Metrics (Purple - .violet) */}
                <div className="relative overflow-hidden rounded-2xl p-5 border border-slate-100 flex flex-col justify-between min-h-[230px] violet shadow-sm">
                  <div className="dot w-2 h-2 rounded-full absolute top-5 right-5"></div>
                  <div className="blob absolute -right-6 -bottom-6 w-20 h-20 rounded-full pointer-events-none"></div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <IconEngagement />
                      <h3 className="text-slate-700 text-xs uppercase tracking-wider font-bold">Engagement Metrics</h3>
                    </div>
                    <div className="space-y-3.5 text-xs text-slate-700 mt-3">
                      <div className="flex items-center justify-between border-b border-purple-200 border-opacity-20 pb-1.5">
                        <span className="font-medium text-slate-600">Pages per Session</span>
                        <strong className="text-sm font-bold text-slate-800">{analytics?.engagement?.pagesPerSession || "0.00"}</strong>
                      </div>
                      <div className="flex items-center justify-between border-b border-purple-200 border-opacity-20 pb-1.5">
                        <span className="font-medium text-slate-600">Sessions per User</span>
                        <strong className="text-sm font-bold text-slate-800">{analytics?.engagement?.sessionsPerUser || "0.00"}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-600">Views per User</span>
                        <strong className="text-sm font-bold text-slate-800">{analytics?.engagement?.viewsPerUser || "0.00"}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-1.5 flex justify-between items-center text-xs">
                    <span className="text-[10px] text-slate-500">Interaction Status</span>
                    <strong className="value text-xs font-bold">Live Data</strong>
                  </div>
                </div>

                {/* 9. Social Media Traffic (Purple - .violet) */}
                <div className="relative overflow-hidden rounded-2xl p-5 border border-slate-100 flex flex-col justify-between min-h-[230px] violet shadow-sm">
                  <div className="dot w-2 h-2 rounded-full absolute top-5 right-5"></div>
                  <div className="blob absolute -right-6 -bottom-6 w-20 h-20 rounded-full pointer-events-none"></div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <IconSocial />
                      <h3 className="text-slate-700 text-xs uppercase tracking-wider font-bold">Social Media Traffic</h3>
                    </div>
                    <p className="text-[9px] text-slate-400 mb-3 uppercase tracking-wider">Social Referrals</p>
                    <div className="space-y-4 text-xs text-slate-700 mt-2">
                      <div>
                        <div className="flex justify-between font-medium mb-1">
                          <span>Instagram traffic</span>
                          <span className="font-semibold">{analytics?.social?.instagram || 0}</span>
                        </div>
                        <div className="w-full bg-slate-200 bg-opacity-40 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#8e24aa] h-full rounded-full progress-bar-fill" 
                            style={{ 
                              width: `${Math.min(100, 
                                ((analytics?.social?.instagram || 0) / 
                                Math.max(1, (analytics?.social?.instagram || 0) + (analytics?.social?.facebook || 0))) * 100
                              )}%` 
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between font-medium mb-1">
                          <span>Facebook traffic</span>
                          <span className="font-semibold">{analytics?.social?.facebook || 0}</span>
                        </div>
                        <div className="w-full bg-slate-200 bg-opacity-40 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#8e24aa] h-full rounded-full progress-bar-fill" 
                            style={{ 
                              width: `${Math.min(100, 
                                ((analytics?.social?.facebook || 0) / 
                                Math.max(1, (analytics?.social?.instagram || 0) + (analytics?.social?.facebook || 0))) * 100
                              )}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-1.5 border-t border-purple-200 border-opacity-30 flex justify-between items-center text-xs">
                    <span className="text-[10px] text-slate-500">Total Social Hits</span>
                    <strong className="value text-xs font-bold">
                      {((analytics?.social?.instagram || 0) + (analytics?.social?.facebook || 0))}
                    </strong>
                  </div>
                </div>

                {/* 10. Referral Traffic (Green - .topno) */}
                <div className="relative overflow-hidden rounded-2xl p-5 border border-slate-100 flex flex-col justify-between min-h-[230px] topno shadow-sm">
                  <div className="dot w-2 h-2 rounded-full absolute top-5 right-5"></div>
                  <div className="blob absolute -right-6 -bottom-6 w-20 h-20 rounded-full pointer-events-none"></div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <IconReferral />
                      <h3 className="text-slate-700 text-xs uppercase tracking-wider font-bold">Referral Traffic</h3>
                    </div>
                    <p className="text-[9px] text-slate-400 mb-3 uppercase tracking-wider">External Referrals</p>
                    <div className="space-y-4 text-xs text-slate-700 mt-2">
                      <div>
                        <div className="flex justify-between font-medium mb-1">
                          <span>Google accounts referral</span>
                          <span className="font-semibold">{analytics?.referral?.googleAccounts || 0}</span>
                        </div>
                        <div className="w-full bg-slate-200 bg-opacity-40 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#2e7d32] h-full rounded-full progress-bar-fill" 
                            style={{ 
                              width: `${Math.min(100, 
                                ((analytics?.referral?.googleAccounts || 0) / 
                                Math.max(1, (analytics?.referral?.googleAccounts || 0) + (analytics?.referral?.otherApps || 0))) * 100
                              )}%` 
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between font-medium mb-1">
                          <span>Other app referrals</span>
                          <span className="font-semibold">{analytics?.referral?.otherApps || 0}</span>
                        </div>
                        <div className="w-full bg-slate-200 bg-opacity-40 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#2e7d32] h-full rounded-full progress-bar-fill" 
                            style={{ 
                              width: `${Math.min(100, 
                                ((analytics?.referral?.otherApps || 0) / 
                                Math.max(1, (analytics?.referral?.googleAccounts || 0) + (analytics?.referral?.otherApps || 0))) * 100
                              )}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-1.5 border-t border-green-200 border-opacity-30 flex justify-between items-center text-xs">
                    <span className="text-[10px] text-slate-500">Total Referrals</span>
                    <strong className="value text-xs font-bold">
                      {((analytics?.referral?.googleAccounts || 0) + (analytics?.referral?.otherApps || 0))}
                    </strong>
                  </div>
                </div>

                {/* 11. Organic Traffic (Blue - .small) */}
                <div className="relative overflow-hidden rounded-2xl p-5 border border-slate-100 flex flex-col justify-between min-h-[230px] small shadow-sm">
                  <div className="dot w-2 h-2 rounded-full absolute top-5 right-5"></div>
                  <div className="blob absolute -right-6 -bottom-6 w-20 h-20 rounded-full pointer-events-none"></div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <IconOrganic />
                      <h3 className="text-slate-700 text-xs uppercase tracking-wider font-bold">Organic Traffic</h3>
                    </div>
                    <p className="text-[9px] text-slate-400 mb-3 uppercase tracking-wider">Search Engine traffic</p>
                    <div className="space-y-4 text-xs text-slate-700 mt-2">
                      <div>
                        <div className="flex justify-between font-medium mb-1">
                          <span>Google organic search</span>
                          <span className="font-semibold">{analytics?.organic?.googleSearch || 0}</span>
                        </div>
                        <div className="w-full bg-slate-200 bg-opacity-40 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#1a73e8] h-full rounded-full progress-bar-fill" 
                            style={{ 
                              width: `${Math.min(100, 
                                ((analytics?.organic?.googleSearch || 0) / 
                                Math.max(1, (analytics?.organic?.googleSearch || 0) + (analytics?.organic?.duckDuckGo || 0))) * 100
                              )}%` 
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between font-medium mb-1">
                          <span>DuckDuckGo search</span>
                          <span className="font-semibold">{analytics?.organic?.duckDuckGo || 0}</span>
                        </div>
                        <div className="w-full bg-slate-200 bg-opacity-40 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#1a73e8] h-full rounded-full progress-bar-fill" 
                            style={{ 
                              width: `${Math.min(100, 
                                ((analytics?.organic?.duckDuckGo || 0) / 
                                Math.max(1, (analytics?.organic?.googleSearch || 0) + (analytics?.organic?.duckDuckGo || 0))) * 100
                              )}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-1.5 border-t border-blue-200 border-opacity-30 flex justify-between items-center text-xs">
                    <span className="text-[10px] text-slate-500">Total Organic Views</span>
                    <strong className="value text-xs font-bold">
                      {((analytics?.organic?.googleSearch || 0) + (analytics?.organic?.duckDuckGo || 0))}
                    </strong>
                  </div>
                </div>

              </div>
            </div>
          ) : activeTab === "users" ? (
            /* User Management Panel */
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">User Accounts List</h2>
                  <p className="text-sm text-slate-500">Manage developer licenses, permissions, and unlock restrictions.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    className="bg-[#2e7d32] hover:bg-[#25632a] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer w-full sm:w-auto"
                    onClick={() => setShowAdd(!showAdd)}
                  >
                    {showAdd ? "Cancel" : <><IconPlus /> Register New User</>}
                  </button>
                </div>
              </div>

              {showAdd && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 transition-all duration-300">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Add New Account</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#2e7d32] transition-colors"
                      placeholder="Enter user email (e.g. user@gmail.com)"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !loading && addUser()}
                    />
                    <button
                      className="bg-[#2e7d32] hover:bg-[#25632a] text-white text-xs font-semibold px-6 py-3 rounded-lg shadow-sm whitespace-nowrap disabled:opacity-50 transition-colors cursor-pointer"
                      onClick={addUser}
                      disabled={loading}
                    >
                      {loading ? "Adding..." : "Add User"}
                    </button>
                  </div>
                  {err && <p className="text-red-500 text-xs mt-2 font-medium">{err}</p>}
                </div>
              )}

              {/* Search user list */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 flex items-center gap-2 mb-6 focus-within:border-slate-300 border-solid">
                <IconSearch />
                <input
                  type="text"
                  className="flex-1 bg-transparent border-none outline-none text-slate-800 text-sm"
                  placeholder="Search accounts by email or display name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-slate-500 font-semibold">{filteredUsers.length} total user accounts found</p>
                <div className="flex gap-4 text-xs text-slate-500">
                  <span>Unlimited: <strong className="text-[#ff9800]">{users.filter(u => u.unlimited).length}</strong></span>
                  <span>Regular: <strong className="text-slate-700">{users.filter(u => !u.unlimited).length}</strong></span>
                </div>
              </div>

              {/* Users Grid */}
              <div className="space-y-3">
                {filteredUsers.length === 0 ? (
                  <div className="text-center text-slate-400 py-16 border border-dashed border-slate-200 rounded-xl">
                    <p className="text-sm">{users.length === 0 ? "No user accounts registered yet" : "No matching accounts found"}</p>
                  </div>
                ) : (
                  filteredUsers.map((u) => (
                    <div
                      key={u.email}
                      className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-bold text-slate-900 truncate">{u.displayName || u.email.split("@")[0]}</p>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              u.unlimited
                                ? "bg-amber-50 text-amber-600 border border-amber-100"
                                : "bg-slate-50 text-slate-500 border border-slate-200"
                            }`}
                          >
                            {u.unlimited ? <><IconStar /> Unlimited Access</> : "Standard (5/day)"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">{u.email}</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Registered: {u.createdAt ? new Date(u.createdAt).toLocaleString() : "Today"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          className={`text-xs font-semibold px-4 py-2 rounded-lg border cursor-pointer w-full sm:w-auto text-center transition-all ${
                            u.unlimited
                              ? "bg-red-50 hover:bg-red-100 text-red-600 border-red-100"
                              : "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200"
                          }`}
                          onClick={() => toggleUnlimited(u.email)}
                        >
                          {u.unlimited ? "Revoke Unlimited" : "Grant Unlimited"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* Settings Panel */
            <div className="max-w-2xl mx-auto">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-xl font-bold text-slate-900">Server Maintenance</h2>
                <p className="text-sm text-slate-500 mt-1">Manage global maintenance mode for all users.</p>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-6">
                {/* Toggle Switch */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Maintenance Status</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {maintenance.enabled ? (
                        <><span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1.5 animate-pulse" /> Active — users will see the maintenance dialog</>
                      ) : (
                        <><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5" /> Inactive — website works normally</>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => setMaintenance({ ...maintenance, enabled: !maintenance.enabled })}
                    className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer ${
                      maintenance.enabled ? "bg-red-500" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${
                        maintenance.enabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-6 space-y-5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Maintenance Title</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#2e7d32] focus:bg-white transition-colors"
                      placeholder="Server Under Maintenance"
                      value={maintenance.title}
                      onChange={(e) => setMaintenance({ ...maintenance, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Maintenance Message</label>
                    <textarea
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#2e7d32] focus:bg-white transition-colors resize-none"
                      rows={3}
                      placeholder="We are currently performing server maintenance..."
                      value={maintenance.message}
                      onChange={(e) => setMaintenance({ ...maintenance, message: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Estimated Time <span className="text-slate-400 font-normal">(Optional)</span></label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#2e7d32] focus:bg-white transition-colors"
                      placeholder="30 Minutes"
                      value={maintenance.eta}
                      onChange={(e) => setMaintenance({ ...maintenance, eta: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Admin Password</label>
                    <input
                      type="password"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#2e7d32] focus:bg-white transition-colors"
                      placeholder="Enter admin password to save"
                      value={adminPw}
                      onChange={(e) => setAdminPw(e.target.value)}
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5 flex items-center justify-between">
                  <div>
                    {maintenanceMsg === "saved" && (
                      <span className="text-xs font-semibold text-green-600">Settings saved successfully.</span>
                    )}
                    {maintenanceMsg && maintenanceMsg !== "saved" && (
                      <span className="text-xs font-semibold text-red-500">{maintenanceMsg}</span>
                    )}
                  </div>
                  <button
                    onClick={saveMaintenance}
                    disabled={maintenanceSaving}
                    className="bg-[#2e7d32] hover:bg-[#25632a] text-white text-xs font-semibold px-6 py-2.5 rounded-lg shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {maintenanceSaving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
