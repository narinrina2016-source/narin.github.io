import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// ─── DATA ────────────────────────────────────────────────────────────────────
const CAMBODIA_PROVINCES = [
  "ភ្នំពេញ","បន្ទាយមានជ័យ","បាត់ដំបង","កំពង់ចាម","កំពង់ឆ្នាំង",
  "កំពង់ស្ពឺ","កំពង់ធំ","កំពត","កណ្ដាល","កែប","កោះកុង","ក្រចេះ",
  "មណ្ឌលគីរី","ឧត្តរមានជ័យ","ប៉ៃលិន","ព្រះវិហារ","ព្រៃវែង",
  "ពោធិ៍សាត់","រតនគីរី","សៀមរាប","ព្រះសីហនុ","ស្ទឹងត្រែង",
  "ស្វាយរៀង","តាកែវ","ត្បូងឃ្មុំ"
];

const WORLD_COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda",
  "Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain",
  "Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan",
  "Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria",
  "Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde",
  "Central African Republic","Chad","Chile","China","Colombia","Comoros",
  "Congo","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark",
  "Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador",
  "Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji",
  "Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece",
  "Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras",
  "Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel",
  "Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati",
  "Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia",
  "Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi",
  "Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania",
  "Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro",
  "Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands",
  "New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia",
  "Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea",
  "Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania",
  "Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia",
  "Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe",
  "Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore",
  "Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea",
  "South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland",
  "Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo",
  "Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu",
  "Uganda","Ukraine","United Arab Emirates","United Kingdom","United States",
  "Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam",
  "Yemen","Zambia","Zimbabwe"
];

const MONTHS_KH = ["មករា","កុម្ភៈ","មីនា","មេសា","ឧសភា","មិថុនា","កក្កដា","សីហា","កញ្ញា","តុលា","វិច្ឆិកា","ធ្នូ"];
const MONTHS_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Mock initial data
const MOCK_FOREIGN = [
  { id:1, visit_date:"2026-05-09", country_name:"Japan", total_visitors:45, female_visitors:22, note:"Tour group", created_at:"2026-05-09" },
  { id:2, visit_date:"2026-05-09", country_name:"South Korea", total_visitors:38, female_visitors:19, note:"", created_at:"2026-05-09" },
  { id:3, visit_date:"2026-05-08", country_name:"United States", total_visitors:62, female_visitors:30, note:"Educational visit", created_at:"2026-05-08" },
  { id:4, visit_date:"2026-05-08", country_name:"France", total_visitors:27, female_visitors:15, note:"", created_at:"2026-05-08" },
  { id:5, visit_date:"2026-05-07", country_name:"Germany", total_visitors:33, female_visitors:18, note:"", created_at:"2026-05-07" },
  { id:6, visit_date:"2026-05-06", country_name:"China", total_visitors:88, female_visitors:40, note:"Group tour", created_at:"2026-05-06" },
  { id:7, visit_date:"2026-05-05", country_name:"Australia", total_visitors:41, female_visitors:21, note:"", created_at:"2026-05-05" },
  { id:8, visit_date:"2026-05-04", country_name:"Vietnam", total_visitors:55, female_visitors:28, note:"", created_at:"2026-05-04" },
];

const MOCK_LOCAL = [
  { id:1, visit_date:"2026-05-09", province_name:"ភ្នំពេញ", total_visitors:120, female_visitors:65, note:"សាលារៀន", created_at:"2026-05-09" },
  { id:2, visit_date:"2026-05-09", province_name:"សៀមរាប", total_visitors:85, female_visitors:42, note:"", created_at:"2026-05-09" },
  { id:3, visit_date:"2026-05-08", province_name:"កណ្ដាល", total_visitors:95, female_visitors:50, note:"", created_at:"2026-05-08" },
  { id:4, visit_date:"2026-05-08", province_name:"បាត់ដំបង", total_visitors:60, female_visitors:32, note:"", created_at:"2026-05-08" },
  { id:5, visit_date:"2026-05-07", province_name:"កំពត", total_visitors:45, female_visitors:24, note:"", created_at:"2026-05-07" },
  { id:6, visit_date:"2026-05-06", province_name:"ព្រះសីហនុ", total_visitors:38, female_visitors:20, note:"", created_at:"2026-05-06" },
  { id:7, visit_date:"2026-05-05", province_name:"ក្រចេះ", total_visitors:28, female_visitors:15, note:"", created_at:"2026-05-05" },
  { id:8, visit_date:"2026-05-04", province_name:"ស្ទឹងត្រែង", total_visitors:22, female_visitors:12, note:"", created_at:"2026-05-04" },
];

// ─── I18N ─────────────────────────────────────────────────────────────────────
const T = {
  km: {
    appTitle: "ប្រព័ន្ធគ្រប់គ្រងស្ថិតិភ្ញៀវទេសចរ",
    subtitle: "មជ្ឈមណ្ឌលប្រល័យពូជសាសន៍ជើងឯក",
    login: "ចូលប្រើប្រព័ន្ធ",
    username: "ឈ្មោះអ្នកប្រើ",
    password: "លេខសម្ងាត់",
    loginBtn: "ចូល",
    dashboard: "ផ្ទាំងគ្រប់គ្រង",
    foreignVisitor: "ភ្ញៀវបរទេស",
    localVisitor: "ភ្ញៀវជាតិ",
    reports: "របាយការណ៍",
    admin: "គ្រប់គ្រងទិន្នន័យ",
    logout: "ចាកចេញ",
    todayTotal: "ភ្ញៀវសរុបថ្ងៃនេះ",
    todayForeign: "ភ្ញៀវបរទេស",
    todayLocal: "ភ្ញៀវជាតិ",
    totalFemale: "ភ្ញៀវស្រីសរុប",
    addForeign: "បញ្ចូលភ្ញៀវបរទេស",
    addLocal: "បញ្ចូលភ្ញៀវជាតិ",
    visitDate: "ថ្ងៃខែឆ្នាំ",
    country: "ឈ្មោះប្រទេស",
    province: "ឈ្មោះខេត្ត",
    totalVisitors: "ចំនួនភ្ញៀវសរុប",
    femaleVisitors: "ចំនួនភ្ញៀវស្រី",
    note: "កំណត់សម្គាល់",
    save: "រក្សាទុក",
    cancel: "បោះបង់",
    edit: "កែប្រែ",
    delete: "លុប",
    search: "ស្វែងរក",
    from: "ពី",
    to: "ដល់",
    filter: "ស្ទង់",
    exportPdf: "នាំចេញ PDF",
    exportExcel: "នាំចេញ Excel",
    print: "បោះពុម្ព",
    daily: "ប្រចាំថ្ងៃ",
    monthly: "ប្រចាំខែ",
    yearly: "ប្រចាំឆ្នាំ",
    topCountries: "ប្រទេសកំពូល",
    topProvinces: "ខេត្តកំពូល",
    darkMode: "ងងឹត",
    lightMode: "ភ្លឺ",
    male: "ភ្លៀង",
    female: "ស្រី",
    persons: "នាក់",
    selectCountry: "-- ជ្រើសប្រទេស --",
    selectProvince: "-- ជ្រើសខេត្ត --",
    required: "ត្រូវការ",
    deleteConfirm: "តើអ្នកចង់លុបទិន្នន័យនេះ?",
    yes: "យល់ព្រម",
    no: "ទេ",
    noData: "គ្មានទិន្នន័យ",
    statisticsTitle: "ស្ថិតិប្រចាំខែ (ឆ្នាំ ២០២៦)",
    distribution: "ការបែងចែក",
    welcome: "សូមស្វាគមន៍",
    sessionMsg: "admin",
    foreignStats: "ស្ថិតិភ្ញៀវបរទេស",
    localStats: "ស្ថិតិភ្ញៀវជាតិ",
  },
  en: {
    appTitle: "Tourist Statistics Management System",
    subtitle: "Choeung Ek Genocidal Center",
    login: "System Login",
    username: "Username",
    password: "Password",
    loginBtn: "Login",
    dashboard: "Dashboard",
    foreignVisitor: "Foreign Visitors",
    localVisitor: "Local Visitors",
    reports: "Reports",
    admin: "Data Management",
    logout: "Logout",
    todayTotal: "Today's Total",
    todayForeign: "Foreign Visitors",
    todayLocal: "Local Visitors",
    totalFemale: "Total Female",
    addForeign: "Add Foreign Visitor",
    addLocal: "Add Local Visitor",
    visitDate: "Visit Date",
    country: "Country",
    province: "Province",
    totalVisitors: "Total Visitors",
    femaleVisitors: "Female Visitors",
    note: "Note",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    search: "Search",
    from: "From",
    to: "To",
    filter: "Filter",
    exportPdf: "Export PDF",
    exportExcel: "Export Excel",
    print: "Print",
    daily: "Daily",
    monthly: "Monthly",
    yearly: "Yearly",
    topCountries: "Top Countries",
    topProvinces: "Top Provinces",
    darkMode: "Dark",
    lightMode: "Light",
    male: "Male",
    female: "Female",
    persons: "pax",
    selectCountry: "-- Select Country --",
    selectProvince: "-- Select Province --",
    required: "Required",
    deleteConfirm: "Are you sure to delete this record?",
    yes: "Yes",
    no: "No",
    noData: "No Data",
    statisticsTitle: "Monthly Statistics (2026)",
    distribution: "Distribution",
    welcome: "Welcome",
    sessionMsg: "admin",
    foreignStats: "Foreign Visitor Statistics",
    localStats: "Local Visitor Statistics",
  }
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const getStyles = (dark) => ({
  bg: dark ? "#0f172a" : "#f0f4f8",
  surface: dark ? "#1e293b" : "#ffffff",
  surface2: dark ? "#273549" : "#f8fafc",
  border: dark ? "#334155" : "#e2e8f0",
  text: dark ? "#f1f5f9" : "#1e293b",
  textMuted: dark ? "#94a3b8" : "#64748b",
  primary: "#1e40af",
  primaryLight: "#3b82f6",
  accent: "#c8a84b",
  danger: "#dc2626",
  success: "#16a34a",
  warning: "#d97706",
  sidebar: dark ? "#0f172a" : "#1e3a5f",
  sidebarText: "#e2e8f0",
  sidebarActive: "#c8a84b",
  cardBg: dark ? "#1e293b" : "#ffffff",
  inputBg: dark ? "#273549" : "#f8fafc",
  shadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.08)",
});

const PIE_COLORS = ["#1e40af","#c8a84b","#16a34a","#dc2626","#7c3aed","#0891b2","#ea580c"];

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("km");
  const [dark, setDark] = useState(false);
  const [page, setPage] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [foreignData, setForeignData] = useState(MOCK_FOREIGN);
  const [localData, setLocalData] = useState(MOCK_LOCAL);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const s = getStyles(dark);
  const t = T[lang];
  const today = new Date().toISOString().split("T")[0];

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const todayForeign = foreignData.filter(r => r.visit_date === today);
  const todayLocal = localData.filter(r => r.visit_date === today);
  const todayForeignTotal = todayForeign.reduce((a,b) => a + b.total_visitors, 0);
  const todayLocalTotal = todayLocal.reduce((a,b) => a + b.total_visitors, 0);
  const todayTotal = todayForeignTotal + todayLocalTotal;
  const totalFemale = [...foreignData, ...localData].reduce((a,b) => a + b.female_visitors, 0);

  // Google Fonts for Khmer
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Hanuman:wght@400;700&family=Kantumruy+Pro:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);

  const rootStyle = {
    fontFamily: "'Kantumruy Pro', 'Hanuman', sans-serif",
    background: s.bg,
    minHeight: "100vh",
    color: s.text,
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s ease",
  };

  if (!isLoggedIn) {
    return (
      <div style={rootStyle}>
        <GoogleFontsLink />
        <LoginPage s={s} t={t} lang={lang} setLang={setLang} dark={dark} setDark={setDark}
          onLogin={() => { setIsLoggedIn(true); setPage("dashboard"); }} />
      </div>
    );
  }

  return (
    <div style={rootStyle}>
      <GoogleFontsLink />
      {toast && <Toast msg={toast.msg} type={toast.type} s={s} />}
      {modal && <Modal modal={modal} setModal={setModal} s={s} t={t} />}
      <div style={{ display:"flex", minHeight:"100vh" }}>
        {/* SIDEBAR */}
        <Sidebar s={s} t={t} page={page} setPage={setPage}
          sidebarOpen={sidebarOpen} onLogout={() => { setIsLoggedIn(false); setPage("login"); }} />
        {/* MAIN */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <Navbar s={s} t={t} lang={lang} setLang={setLang} dark={dark} setDark={setDark}
            sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
            onLogout={() => { setIsLoggedIn(false); setPage("login"); }} />
          <main style={{ flex:1, overflowY:"auto", padding:"24px" }}>
            {page === "dashboard" && (
              <DashboardPage s={s} t={t} lang={lang}
                todayTotal={todayTotal} todayForeign={todayForeignTotal}
                todayLocal={todayLocalTotal} totalFemale={totalFemale}
                foreignData={foreignData} localData={localData} />
            )}
            {page === "foreign" && (
              <ForeignPage s={s} t={t} foreignData={foreignData}
                setForeignData={setForeignData} showToast={showToast} setModal={setModal} today={today} />
            )}
            {page === "local" && (
              <LocalPage s={s} t={t} localData={localData}
                setLocalData={setLocalData} showToast={showToast} setModal={setModal} today={today} />
            )}
            {page === "reports" && (
              <ReportsPage s={s} t={t} lang={lang} foreignData={foreignData} localData={localData} />
            )}
            {page === "admin" && (
              <AdminPage s={s} t={t} foreignData={foreignData} localData={localData}
                setForeignData={setForeignData} setLocalData={setLocalData}
                showToast={showToast} setModal={setModal} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// ─── GOOGLE FONTS ─────────────────────────────────────────────────────────────
function GoogleFontsLink() {
  return null; // handled in useEffect
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, s }) {
  const color = type === "success" ? s.success : type === "error" ? s.danger : s.warning;
  return (
    <div style={{
      position:"fixed", top:20, right:20, zIndex:9999,
      background: color, color:"#fff",
      padding:"12px 24px", borderRadius:10,
      fontFamily:"'Kantumruy Pro','Hanuman',sans-serif",
      boxShadow:"0 8px 30px rgba(0,0,0,0.2)",
      fontSize:14, animation:"slideIn 0.3s ease",
    }}>
      {msg}
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ modal, setModal, s, t }) {
  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:9000,
      display:"flex", alignItems:"center", justifyContent:"center"
    }}>
      <div style={{
        background: s.surface, borderRadius:16, padding:32, maxWidth:400, width:"90%",
        boxShadow:"0 20px 60px rgba(0,0,0,0.3)", textAlign:"center"
      }}>
        <div style={{ fontSize:48, marginBottom:12 }}>⚠️</div>
        <p style={{ fontSize:16, marginBottom:24, color:s.text }}>{modal.msg}</p>
        <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
          <button onClick={() => { modal.onConfirm(); setModal(null); }}
            style={{ ...btnStyle(s.danger), padding:"10px 28px" }}>{t.yes}</button>
          <button onClick={() => setModal(null)}
            style={{ ...btnStyle(s.textMuted), padding:"10px 28px" }}>{t.no}</button>
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginPage({ s, t, lang, setLang, dark, setDark, onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const handleLogin = () => {
    if (user === "admin" && pass === "admin123") {
      onLogin();
    } else {
      setErr(lang === "km" ? "ឈ្មោះអ្នកប្រើ ឬ លេខសម្ងាត់មិនត្រឹមត្រូវ!" : "Invalid username or password!");
    }
  };

  return (
    <div style={{
      minHeight:"100vh", background: dark ? "#0f172a" : "linear-gradient(135deg,#1e3a5f 0%,#0f172a 50%,#1a2744 100%)",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:20, position:"relative", overflow:"hidden"
    }}>
      {/* Background pattern */}
      <div style={{
        position:"absolute", inset:0, opacity:0.05,
        backgroundImage:"repeating-linear-gradient(45deg,#c8a84b 0,#c8a84b 1px,transparent 0,transparent 50%)",
        backgroundSize:"20px 20px"
      }} />

      {/* Logo / Header */}
      <div style={{ textAlign:"center", marginBottom:32, position:"relative" }}>
        <div style={{
          width:90, height:90, borderRadius:"50%",
          background:"linear-gradient(135deg,#c8a84b,#e8c76b)",
          display:"flex", alignItems:"center", justifyContent:"center",
          margin:"0 auto 16px", fontSize:36,
          boxShadow:"0 8px 30px rgba(200,168,75,0.4)"
        }}>🏛️</div>
        <h1 style={{ color:"#c8a84b", fontSize:22, fontWeight:700, margin:"0 0 8px",
          fontFamily:"'Kantumruy Pro','Hanuman',sans-serif" }}>{t.appTitle}</h1>
        <p style={{ color:"#94a3b8", fontSize:14, margin:0,
          fontFamily:"'Kantumruy Pro','Hanuman',sans-serif" }}>{t.subtitle}</p>
      </div>

      {/* Card */}
      <div style={{
        background: dark ? "#1e293b" : "rgba(255,255,255,0.97)",
        borderRadius:20, padding:"36px 40px", width:"100%", maxWidth:420,
        boxShadow:"0 25px 60px rgba(0,0,0,0.4)",
        position:"relative", border:"1px solid rgba(200,168,75,0.2)"
      }}>
        <h2 style={{ textAlign:"center", color: dark?"#f1f5f9":"#1e293b",
          fontSize:18, marginBottom:28, fontFamily:"'Kantumruy Pro','Hanuman',sans-serif" }}>{t.login}</h2>

        {err && <div style={{ background:"#fee2e2", color:"#dc2626", padding:"10px 16px",
          borderRadius:8, marginBottom:16, fontSize:13,
          fontFamily:"'Kantumruy Pro','Hanuman',sans-serif" }}>{err}</div>}

        <div style={{ marginBottom:18 }}>
          <label style={labelStyle(dark)}>{t.username}</label>
          <input value={user} onChange={e=>setUser(e.target.value)}
            placeholder={lang==="km"?"admin":"admin"}
            style={inputStyle(dark)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
        </div>
        <div style={{ marginBottom:24 }}>
          <label style={labelStyle(dark)}>{t.password}</label>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)}
            placeholder="••••••••"
            style={inputStyle(dark)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
        </div>
        <div style={{ fontSize:12, color:"#64748b", marginBottom:16, textAlign:"center" }}>
          Demo: admin / admin123
        </div>
        <button onClick={handleLogin} style={{
          width:"100%", padding:"14px", borderRadius:10, border:"none",
          background:"linear-gradient(135deg,#1e40af,#3b82f6)",
          color:"#fff", fontSize:16, fontWeight:600, cursor:"pointer",
          fontFamily:"'Kantumruy Pro','Hanuman',sans-serif",
          boxShadow:"0 4px 15px rgba(30,64,175,0.4)"
        }}>{t.loginBtn}</button>

        {/* Lang/Dark toggles */}
        <div style={{ display:"flex", justifyContent:"center", gap:12, marginTop:20 }}>
          <button onClick={()=>setLang(lang==="km"?"en":"km")}
            style={{ ...smallBtn, background:"rgba(200,168,75,0.15)", color:"#c8a84b", border:"1px solid #c8a84b" }}>
            {lang==="km"?"EN":"ខ្មែរ"}
          </button>
          <button onClick={()=>setDark(!dark)}
            style={{ ...smallBtn, background:"rgba(255,255,255,0.1)", color: dark?"#f1f5f9":"#1e293b",
              border:"1px solid rgba(255,255,255,0.2)" }}>
            {dark?"☀️":"🌙"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({ s, t, page, setPage, sidebarOpen, onLogout }) {
  const navItems = [
    { key:"dashboard", icon:"📊", label: t.dashboard },
    { key:"foreign", icon:"✈️", label: t.foreignVisitor },
    { key:"local", icon:"🏠", label: t.localVisitor },
    { key:"reports", icon:"📋", label: t.reports },
    { key:"admin", icon:"⚙️", label: t.admin },
  ];
  const w = sidebarOpen ? 240 : 0;
  return (
    <div style={{
      width: w, minWidth: w, background: s.sidebar,
      display:"flex", flexDirection:"column",
      transition:"width 0.3s ease, min-width 0.3s ease",
      overflow:"hidden", flexShrink:0,
      boxShadow:"4px 0 20px rgba(0,0,0,0.2)"
    }}>
      {/* Logo */}
      <div style={{ padding:"24px 20px 20px", borderBottom:`1px solid rgba(255,255,255,0.1)` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:28 }}>🏛️</span>
          <div>
            <div style={{ color:"#c8a84b", fontSize:13, fontWeight:700, lineHeight:1.3,
              fontFamily:"'Kantumruy Pro','Hanuman',sans-serif", whiteSpace:"nowrap" }}>
              {t.appTitle}
            </div>
            <div style={{ color:"#64748b", fontSize:10, whiteSpace:"nowrap" }}>{t.subtitle}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"16px 0" }}>
        {navItems.map(item => (
          <button key={item.key} onClick={()=>setPage(item.key)} style={{
            width:"100%", display:"flex", alignItems:"center", gap:12,
            padding:"12px 20px", border:"none", cursor:"pointer",
            background: page===item.key ? "rgba(200,168,75,0.15)" : "transparent",
            color: page===item.key ? "#c8a84b" : "#94a3b8",
            borderLeft: page===item.key ? "3px solid #c8a84b" : "3px solid transparent",
            fontSize:14, fontFamily:"'Kantumruy Pro','Hanuman',sans-serif",
            transition:"all 0.2s", textAlign:"left",
          }}>
            <span style={{ fontSize:18, flexShrink:0 }}>{item.icon}</span>
            <span style={{ whiteSpace:"nowrap" }}>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding:"16px 20px", borderTop:"1px solid rgba(255,255,255,0.1)" }}>
        <button onClick={onLogout} style={{
          width:"100%", padding:"10px 16px", borderRadius:8, border:"1px solid rgba(220,38,38,0.3)",
          background:"rgba(220,38,38,0.1)", color:"#f87171", cursor:"pointer",
          fontSize:14, fontFamily:"'Kantumruy Pro','Hanuman',sans-serif",
          display:"flex", alignItems:"center", gap:8, justifyContent:"center"
        }}>
          🚪 {t.logout}
        </button>
      </div>
    </div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar({ s, t, lang, setLang, dark, setDark, sidebarOpen, setSidebarOpen, onLogout }) {
  const today = new Date();
  return (
    <div style={{
      height:64, background: s.surface, borderBottom:`1px solid ${s.border}`,
      display:"flex", alignItems:"center", padding:"0 24px",
      gap:16, flexShrink:0, boxShadow: s.shadow,
    }}>
      <button onClick={()=>setSidebarOpen(!sidebarOpen)} style={{
        width:36, height:36, borderRadius:8, border:`1px solid ${s.border}`,
        background:s.surface2, cursor:"pointer", color:s.text, fontSize:18
      }}>☰</button>

      <div style={{ flex:1 }}>
        <span style={{ fontSize:14, color:s.textMuted, fontFamily:"'Kantumruy Pro','Hanuman',sans-serif" }}>
          {lang==="km" ? `ថ្ងៃទី${today.getDate()} ${MONTHS_KH[today.getMonth()]} ${today.getFullYear()+543}` :
            today.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"}) }
        </span>
      </div>

      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
        <button onClick={()=>setLang(lang==="km"?"en":"km")} style={{
          ...smallBtn, background:s.surface2, color:s.text, border:`1px solid ${s.border}`
        }}>
          {lang==="km"?"EN":"ខ្មែរ"}
        </button>
        <button onClick={()=>setDark(!dark)} style={{
          ...smallBtn, background:s.surface2, color:s.text, border:`1px solid ${s.border}`
        }}>
          {dark?"☀️":"🌙"}
        </button>
        <div style={{
          width:36, height:36, borderRadius:"50%",
          background:"linear-gradient(135deg,#1e40af,#3b82f6)",
          display:"flex", alignItems:"center", justifyContent:"center",
          color:"#fff", fontSize:16, cursor:"pointer"
        }} title="admin">👤</div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function DashboardPage({ s, t, lang, todayTotal, todayForeign, todayLocal, totalFemale, foreignData, localData }) {
  const months = lang==="km" ? MONTHS_KH : MONTHS_EN;
  // Monthly chart data (mock)
  const monthlyData = months.map((m, i) => ({
    name: m,
    foreign: [45,62,88,120,234,180,95,110,75,42,38,60][i] || 0,
    local: [280,320,450,590,820,680,370,410,290,180,160,240][i] || 0,
  }));

  // Pie data
  const pieLocal = [
    { name:"ភ្នំពេញ", value:320 }, { name:"សៀមរាប", value:185 },
    { name:"កណ្ដាល", value:195 }, { name:"បាត់ដំបង", value:160 },
    { name:"ផ្សេងៗ", value:240 }
  ];
  const pieForeign = [
    { name:"Japan", value:145 }, { name:"China", value:188 },
    { name:"USA", value:162 }, { name:"Korea", value:138 },
    { name:"Others", value:267 }
  ];

  // Top countries
  const countryMap = {};
  foreignData.forEach(r => { countryMap[r.country_name] = (countryMap[r.country_name]||0) + r.total_visitors; });
  const topCountries = Object.entries(countryMap).sort((a,b)=>b[1]-a[1]).slice(0,5);

  // Top provinces
  const provMap = {};
  localData.forEach(r => { provMap[r.province_name] = (provMap[r.province_name]||0) + r.total_visitors; });
  const topProvinces = Object.entries(provMap).sort((a,b)=>b[1]-a[1]).slice(0,5);

  const cards = [
    { label:t.todayTotal, value:todayTotal, icon:"👥", color:"#1e40af", bg:"rgba(30,64,175,0.1)" },
    { label:t.todayForeign, value:todayForeign, icon:"✈️", color:"#0891b2", bg:"rgba(8,145,178,0.1)" },
    { label:t.todayLocal, value:todayLocal, icon:"🏠", color:"#16a34a", bg:"rgba(22,163,74,0.1)" },
    { label:t.totalFemale, value:totalFemale, icon:"👩", color:"#c8a84b", bg:"rgba(200,168,75,0.1)" },
  ];

  return (
    <div>
      <PageHeader title={t.dashboard} icon="📊" s={s} />

      {/* Summary Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:20, marginBottom:28 }}>
        {cards.map(card => (
          <div key={card.label} style={{
            background: s.cardBg, borderRadius:16, padding:"24px 20px",
            boxShadow: s.shadow, border:`1px solid ${s.border}`,
            position:"relative", overflow:"hidden"
          }}>
            <div style={{ position:"absolute", top:-10, right:-10, width:70, height:70,
              borderRadius:"50%", background:card.bg, display:"flex",
              alignItems:"center", justifyContent:"center", fontSize:28 }}>
              {card.icon}
            </div>
            <div style={{ color:s.textMuted, fontSize:12, marginBottom:8,
              fontFamily:"'Kantumruy Pro','Hanuman',sans-serif" }}>{card.label}</div>
            <div style={{ color:card.color, fontSize:36, fontWeight:700 }}>{card.value.toLocaleString()}</div>
            <div style={{ color:s.textMuted, fontSize:11, marginTop:4,
              fontFamily:"'Kantumruy Pro','Hanuman',sans-serif" }}>{t.persons}</div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
        {/* Bar Chart */}
        <div style={{ background:s.cardBg, borderRadius:16, padding:24, boxShadow:s.shadow, border:`1px solid ${s.border}` }}>
          <h3 style={chartTitle(s)}>{t.statisticsTitle}</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData.slice(0,6)}>
              <CartesianGrid strokeDasharray="3 3" stroke={s.border} />
              <XAxis dataKey="name" tick={{ fill:s.textMuted, fontSize:11 }} />
              <YAxis tick={{ fill:s.textMuted, fontSize:11 }} />
              <Tooltip contentStyle={{ background:s.surface, border:`1px solid ${s.border}`, borderRadius:8 }}
                labelStyle={{ color:s.text }} />
              <Legend />
              <Bar dataKey="foreign" name={t.foreignVisitor} fill="#1e40af" radius={[4,4,0,0]} />
              <Bar dataKey="local" name={t.localVisitor} fill="#c8a84b" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Line Chart */}
        <div style={{ background:s.cardBg, borderRadius:16, padding:24, boxShadow:s.shadow, border:`1px solid ${s.border}` }}>
          <h3 style={chartTitle(s)}>{t.yearly}</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={s.border} />
              <XAxis dataKey="name" tick={{ fill:s.textMuted, fontSize:10 }} />
              <YAxis tick={{ fill:s.textMuted, fontSize:11 }} />
              <Tooltip contentStyle={{ background:s.surface, border:`1px solid ${s.border}`, borderRadius:8 }} />
              <Legend />
              <Line type="monotone" dataKey="foreign" name={t.foreignVisitor} stroke="#1e40af" strokeWidth={2} dot={{ r:4 }} />
              <Line type="monotone" dataKey="local" name={t.localVisitor} stroke="#c8a84b" strokeWidth={2} dot={{ r:4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20, marginBottom:20 }}>
        {/* Pie Local */}
        <div style={{ background:s.cardBg, borderRadius:16, padding:24, boxShadow:s.shadow, border:`1px solid ${s.border}` }}>
          <h3 style={chartTitle(s)}>{t.topProvinces}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieLocal} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({name,percent})=>`${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                {pieLocal.map((_,i) => <Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background:s.surface, borderRadius:8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Pie Foreign */}
        <div style={{ background:s.cardBg, borderRadius:16, padding:24, boxShadow:s.shadow, border:`1px solid ${s.border}` }}>
          <h3 style={chartTitle(s)}>{t.topCountries}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieForeign} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({name,percent})=>`${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                {pieForeign.map((_,i) => <Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background:s.surface, borderRadius:8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Top Lists */}
        <div style={{ background:s.cardBg, borderRadius:16, padding:24, boxShadow:s.shadow, border:`1px solid ${s.border}` }}>
          <h3 style={chartTitle(s)}>{t.topCountries}</h3>
          {topCountries.map(([name,val],i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ width:22, height:22, borderRadius:"50%", background:PIE_COLORS[i],
                  display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:10, fontWeight:700 }}>{i+1}</span>
                <span style={{ fontSize:13, color:s.text }}>{name}</span>
              </div>
              <span style={{ fontSize:13, fontWeight:700, color:PIE_COLORS[i] }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── FOREIGN VISITOR FORM ────────────────────────────────────────────────────
function ForeignPage({ s, t, foreignData, setForeignData, showToast, setModal, today }) {
  const empty = { visit_date:today, country_name:"", total_visitors:"", female_visitors:"", note:"" };
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.visit_date) e.visit_date = true;
    if (!form.country_name) e.country_name = true;
    if (!form.total_visitors) e.total_visitors = true;
    if (!form.female_visitors) e.female_visitors = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (editId) {
      setForeignData(prev => prev.map(r => r.id===editId ? {...r,...form,total_visitors:+form.total_visitors,female_visitors:+form.female_visitors} : r));
      showToast("កែប្រែបានជោគជ័យ! ✓");
    } else {
      setForeignData(prev => [...prev, {...form, id:Date.now(), total_visitors:+form.total_visitors, female_visitors:+form.female_visitors, created_at:today}]);
      showToast("បញ្ចូលទិន្នន័យបានជោគជ័យ! ✓");
    }
    setForm(empty); setEditId(null); setErrors({});
  };

  const handleEdit = (row) => {
    setForm({ visit_date:row.visit_date, country_name:row.country_name, total_visitors:row.total_visitors, female_visitors:row.female_visitors, note:row.note });
    setEditId(row.id);
  };

  const handleDelete = (id) => {
    setModal({ msg: t.deleteConfirm, onConfirm: () => {
      setForeignData(prev => prev.filter(r => r.id !== id));
      showToast("លុបបានជោគជ័យ!", "error");
    }});
  };

  return (
    <div>
      <PageHeader title={t.foreignVisitor} icon="✈️" s={s} />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
        {/* Form */}
        <div style={cardStyle(s)}>
          <h3 style={{ color:s.text, marginBottom:20, fontFamily:"'Kantumruy Pro','Hanuman',sans-serif", fontSize:16 }}>
            {editId ? t.edit : t.addForeign}
          </h3>
          <FormField label={t.visitDate} error={errors.visit_date}>
            <input type="date" value={form.visit_date} onChange={e=>setForm({...form,visit_date:e.target.value})}
              style={inputStyle2(s,errors.visit_date)} />
          </FormField>
          <FormField label={t.country} error={errors.country_name}>
            <select value={form.country_name} onChange={e=>setForm({...form,country_name:e.target.value})}
              style={inputStyle2(s,errors.country_name)}>
              <option value="">{t.selectCountry}</option>
              {WORLD_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>
          <FormField label={t.totalVisitors} error={errors.total_visitors}>
            <input type="number" min="0" value={form.total_visitors} onChange={e=>setForm({...form,total_visitors:e.target.value})}
              style={inputStyle2(s,errors.total_visitors)} />
          </FormField>
          <FormField label={t.femaleVisitors} error={errors.female_visitors}>
            <input type="number" min="0" value={form.female_visitors} onChange={e=>setForm({...form,female_visitors:e.target.value})}
              style={inputStyle2(s,errors.female_visitors)} />
          </FormField>
          <FormField label={t.note}>
            <textarea value={form.note} onChange={e=>setForm({...form,note:e.target.value})}
              rows={3} style={{...inputStyle2(s), resize:"vertical"}} />
          </FormField>
          <div style={{ display:"flex", gap:10, marginTop:8 }}>
            <button onClick={handleSubmit} style={btnStyle(s.primary)}>{editId?t.edit:t.save}</button>
            {editId && <button onClick={()=>{setForm(empty);setEditId(null);setErrors({});}} style={btnStyle(s.textMuted)}>{t.cancel}</button>}
          </div>
        </div>
        {/* Table */}
        <div style={cardStyle(s)}>
          <h3 style={{ color:s.text, marginBottom:20, fontFamily:"'Kantumruy Pro','Hanuman',sans-serif", fontSize:16 }}>
            {t.foreignStats}
          </h3>
          <DataTable data={foreignData} type="foreign" s={s} t={t}
            onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}

// ─── LOCAL VISITOR FORM ───────────────────────────────────────────────────────
function LocalPage({ s, t, localData, setLocalData, showToast, setModal, today }) {
  const empty = { visit_date:today, province_name:"", total_visitors:"", female_visitors:"", note:"" };
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.visit_date) e.visit_date = true;
    if (!form.province_name) e.province_name = true;
    if (!form.total_visitors) e.total_visitors = true;
    if (!form.female_visitors) e.female_visitors = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (editId) {
      setLocalData(prev => prev.map(r => r.id===editId ? {...r,...form,total_visitors:+form.total_visitors,female_visitors:+form.female_visitors} : r));
      showToast("កែប្រែបានជោគជ័យ! ✓");
    } else {
      setLocalData(prev => [...prev, {...form, id:Date.now(), total_visitors:+form.total_visitors, female_visitors:+form.female_visitors, created_at:today}]);
      showToast("បញ្ចូលទិន្នន័យបានជោគជ័យ! ✓");
    }
    setForm(empty); setEditId(null); setErrors({});
  };

  const handleEdit = (row) => {
    setForm({ visit_date:row.visit_date, province_name:row.province_name, total_visitors:row.total_visitors, female_visitors:row.female_visitors, note:row.note });
    setEditId(row.id);
  };

  const handleDelete = (id) => {
    setModal({ msg: t.deleteConfirm, onConfirm: () => {
      setLocalData(prev => prev.filter(r => r.id !== id));
      showToast("លុបបានជោគជ័យ!", "error");
    }});
  };

  return (
    <div>
      <PageHeader title={t.localVisitor} icon="🏠" s={s} />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
        <div style={cardStyle(s)}>
          <h3 style={{ color:s.text, marginBottom:20, fontFamily:"'Kantumruy Pro','Hanuman',sans-serif", fontSize:16 }}>
            {editId ? t.edit : t.addLocal}
          </h3>
          <FormField label={t.visitDate} error={errors.visit_date}>
            <input type="date" value={form.visit_date} onChange={e=>setForm({...form,visit_date:e.target.value})}
              style={inputStyle2(s,errors.visit_date)} />
          </FormField>
          <FormField label={t.province} error={errors.province_name}>
            <select value={form.province_name} onChange={e=>setForm({...form,province_name:e.target.value})}
              style={inputStyle2(s,errors.province_name)}>
              <option value="">{t.selectProvince}</option>
              {CAMBODIA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </FormField>
          <FormField label={t.totalVisitors} error={errors.total_visitors}>
            <input type="number" min="0" value={form.total_visitors} onChange={e=>setForm({...form,total_visitors:e.target.value})}
              style={inputStyle2(s,errors.total_visitors)} />
          </FormField>
          <FormField label={t.femaleVisitors} error={errors.female_visitors}>
            <input type="number" min="0" value={form.female_visitors} onChange={e=>setForm({...form,female_visitors:e.target.value})}
              style={inputStyle2(s,errors.female_visitors)} />
          </FormField>
          <FormField label={t.note}>
            <textarea value={form.note} onChange={e=>setForm({...form,note:e.target.value})}
              rows={3} style={{...inputStyle2(s), resize:"vertical"}} />
          </FormField>
          <div style={{ display:"flex", gap:10, marginTop:8 }}>
            <button onClick={handleSubmit} style={btnStyle(s.primary)}>{editId?t.edit:t.save}</button>
            {editId && <button onClick={()=>{setForm(empty);setEditId(null);setErrors({});}} style={btnStyle(s.textMuted)}>{t.cancel}</button>}
          </div>
        </div>
        <div style={cardStyle(s)}>
          <h3 style={{ color:s.text, marginBottom:20, fontFamily:"'Kantumruy Pro','Hanuman',sans-serif", fontSize:16 }}>
            {t.localStats}
          </h3>
          <DataTable data={localData} type="local" s={s} t={t}
            onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}

// ─── REPORTS ─────────────────────────────────────────────────────────────────
function ReportsPage({ s, t, lang, foreignData, localData }) {
  const [tab, setTab] = useState("daily");
  const [fromDate, setFromDate] = useState("2026-05-01");
  const [toDate, setToDate] = useState("2026-05-09");
  const [search, setSearch] = useState("");

  const allData = [
    ...foreignData.map(r => ({...r, type:"foreign", location:r.country_name})),
    ...localData.map(r => ({...r, type:"local", location:r.province_name}))
  ].filter(r => {
    if (r.visit_date < fromDate || r.visit_date > toDate) return false;
    if (search && !r.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a,b) => b.visit_date.localeCompare(a.visit_date));

  const totalAll = allData.reduce((a,b)=>a+b.total_visitors,0);
  const totalFemAll = allData.reduce((a,b)=>a+b.female_visitors,0);

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    const headers = "Date,Type,Location,Total,Female,Note\n";
    const rows = allData.map(r =>
      `${r.visit_date},${r.type==="foreign"?"Foreign":"Local"},${r.location},${r.total_visitors},${r.female_visitors},"${r.note||''}"`
    ).join("\n");
    const blob = new Blob([headers+rows], {type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="visitor-report.csv"; a.click();
  };

  return (
    <div>
      <PageHeader title={t.reports} icon="📋" s={s} />

      {/* Filter */}
      <div style={{...cardStyle(s), marginBottom:20}}>
        <div style={{ display:"flex", gap:16, flexWrap:"wrap", alignItems:"flex-end" }}>
          <div>
            <label style={labelStyle2(s)}>{t.from}</label>
            <input type="date" value={fromDate} onChange={e=>setFromDate(e.target.value)} style={inputStyle2(s)} />
          </div>
          <div>
            <label style={labelStyle2(s)}>{t.to}</label>
            <input type="date" value={toDate} onChange={e=>setToDate(e.target.value)} style={inputStyle2(s)} />
          </div>
          <div style={{ flex:1, minWidth:200 }}>
            <label style={labelStyle2(s)}>{t.search}</label>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search..."
              style={{...inputStyle2(s), width:"100%"}} />
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={handlePrint} style={btnStyle("#475569")}>🖨️ {t.print}</button>
            <button onClick={handleExportCSV} style={btnStyle(s.success)}>📊 {t.exportExcel}</button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:20 }}>
        {[
          {l:"Total Records",v:allData.length,c:"#1e40af"},
          {l:"Total Visitors",v:totalAll,c:"#16a34a"},
          {l:"Female Visitors",v:totalFemAll,c:"#c8a84b"},
          {l:"Male Visitors",v:totalAll-totalFemAll,c:"#0891b2"},
        ].map(card => (
          <div key={card.l} style={{...cardStyle(s), padding:"16px 20px"}}>
            <div style={{ color:s.textMuted, fontSize:11 }}>{card.l}</div>
            <div style={{ color:card.c, fontSize:28, fontWeight:700 }}>{card.v.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={cardStyle(s)}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:"'Kantumruy Pro','Hanuman',sans-serif", fontSize:13 }}>
            <thead>
              <tr style={{ background: s.primary }}>
                {["#","Date","Type","Location","Total","Female","Male","Note"].map(h=>(
                  <th key={h} style={{ padding:"12px 14px", color:"#fff", textAlign:"left", whiteSpace:"nowrap", fontWeight:600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allData.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign:"center", padding:40, color:s.textMuted }}>{t.noData}</td></tr>
              ) : allData.map((r,i) => (
                <tr key={r.id+r.type} style={{ background: i%2===0 ? s.surface : s.surface2,
                  borderBottom:`1px solid ${s.border}` }}>
                  <td style={tdStyle}>{i+1}</td>
                  <td style={tdStyle}>{r.visit_date}</td>
                  <td style={tdStyle}>
                    <span style={{ padding:"2px 10px", borderRadius:20, fontSize:11,
                      background: r.type==="foreign"?"rgba(8,145,178,0.15)":"rgba(22,163,74,0.15)",
                      color: r.type==="foreign"?"#0891b2":"#16a34a", fontWeight:600 }}>
                      {r.type==="foreign"?"✈️ Foreign":"🏠 Local"}
                    </span>
                  </td>
                  <td style={tdStyle}>{r.location}</td>
                  <td style={{...tdStyle, fontWeight:700, color:s.primary}}>{r.total_visitors}</td>
                  <td style={{...tdStyle, color:"#c8a84b"}}>{r.female_visitors}</td>
                  <td style={tdStyle}>{r.total_visitors - r.female_visitors}</td>
                  <td style={{...tdStyle, color:s.textMuted}}>{r.note||"-"}</td>
                </tr>
              ))}
            </tbody>
            {allData.length > 0 && (
              <tfoot>
                <tr style={{ background: s.surface2, fontWeight:700 }}>
                  <td colSpan={4} style={{...tdStyle, color:s.text}}>សរុប / Total</td>
                  <td style={{...tdStyle, color:s.primary}}>{totalAll}</td>
                  <td style={{...tdStyle, color:"#c8a84b"}}>{totalFemAll}</td>
                  <td style={tdStyle}>{totalAll-totalFemAll}</td>
                  <td style={tdStyle}></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN PAGE ───────────────────────────────────────────────────────────────
function AdminPage({ s, t, foreignData, localData, setForeignData, setLocalData, showToast, setModal }) {
  const [activeTab, setActiveTab] = useState("foreign");
  const [search, setSearch] = useState("");

  const filtered = (data, type) => data.filter(r => {
    const loc = type==="foreign" ? r.country_name : r.province_name;
    return !search || loc.toLowerCase().includes(search.toLowerCase()) || r.visit_date.includes(search);
  });

  const handleDeleteForeign = (id) => setModal({ msg: t.deleteConfirm, onConfirm: () => {
    setForeignData(prev => prev.filter(r=>r.id!==id));
    showToast("លុបបានជោគជ័យ!", "error");
  }});
  const handleDeleteLocal = (id) => setModal({ msg: t.deleteConfirm, onConfirm: () => {
    setLocalData(prev => prev.filter(r=>r.id!==id));
    showToast("លុបបានជោគជ័យ!", "error");
  }});

  return (
    <div>
      <PageHeader title={t.admin} icon="⚙️" s={s} />

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:20 }}>
        {[
          {l:t.foreignVisitor, v:foreignData.length, c:"#0891b2"},
          {l:t.localVisitor, v:localData.length, c:"#16a34a"},
          {l:"Total Records", v:foreignData.length+localData.length, c:"#1e40af"},
        ].map(c => (
          <div key={c.l} style={{...cardStyle(s), padding:"16px 20px", textAlign:"center"}}>
            <div style={{ color:c.c, fontSize:32, fontWeight:700 }}>{c.v}</div>
            <div style={{ color:s.textMuted, fontSize:12, fontFamily:"'Kantumruy Pro','Hanuman',sans-serif" }}>{c.l}</div>
          </div>
        ))}
      </div>

      <div style={cardStyle(s)}>
        {/* Tabs */}
        <div style={{ display:"flex", gap:0, marginBottom:20, background:s.surface2, borderRadius:10, padding:4 }}>
          {[{k:"foreign",l:t.foreignVisitor,i:"✈️"},{k:"local",l:t.localVisitor,i:"🏠"}].map(tab => (
            <button key={tab.k} onClick={()=>setActiveTab(tab.k)} style={{
              flex:1, padding:"10px 16px", borderRadius:8, border:"none", cursor:"pointer",
              background: activeTab===tab.k ? s.primary : "transparent",
              color: activeTab===tab.k ? "#fff" : s.textMuted,
              fontSize:14, fontFamily:"'Kantumruy Pro','Hanuman',sans-serif",
              transition:"all 0.2s"
            }}>{tab.i} {tab.l}</button>
          ))}
        </div>

        {/* Search */}
        <div style={{ marginBottom:16 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder={`🔍 ${t.search}...`} style={{...inputStyle2(s), width:280}} />
        </div>

        {/* Table */}
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13,
            fontFamily:"'Kantumruy Pro','Hanuman',sans-serif" }}>
            <thead>
              <tr style={{ background:s.primary }}>
                {["#","Date", activeTab==="foreign"?"Country":"Province","Total","Female","Note","Actions"].map(h=>(
                  <th key={h} style={{ padding:"12px 14px", color:"#fff", textAlign:"left", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered(activeTab==="foreign"?foreignData:localData, activeTab).map((r,i) => (
                <tr key={r.id} style={{ background:i%2===0?s.surface:s.surface2, borderBottom:`1px solid ${s.border}` }}>
                  <td style={tdStyle}>{i+1}</td>
                  <td style={tdStyle}>{r.visit_date}</td>
                  <td style={tdStyle}>{activeTab==="foreign"?r.country_name:r.province_name}</td>
                  <td style={{...tdStyle,fontWeight:700,color:s.primary}}>{r.total_visitors}</td>
                  <td style={{...tdStyle,color:"#c8a84b"}}>{r.female_visitors}</td>
                  <td style={{...tdStyle,color:s.textMuted}}>{r.note||"-"}</td>
                  <td style={tdStyle}>
                    <div style={{ display:"flex", gap:6 }}>
                      <button onClick={()=>activeTab==="foreign"?handleDeleteForeign(r.id):handleDeleteLocal(r.id)}
                        style={{...smallBtn, background:"rgba(220,38,38,0.1)", color:s.danger, border:"none", padding:"4px 10px"}}>
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered(activeTab==="foreign"?foreignData:localData, activeTab).length===0 && (
                <tr><td colSpan={7} style={{ textAlign:"center", padding:40, color:s.textMuted }}>{t.noData}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── DATA TABLE ───────────────────────────────────────────────────────────────
function DataTable({ data, type, s, t, onEdit, onDelete }) {
  return (
    <div style={{ overflowX:"auto", maxHeight:450, overflowY:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12,
        fontFamily:"'Kantumruy Pro','Hanuman',sans-serif" }}>
        <thead style={{ position:"sticky", top:0, zIndex:1 }}>
          <tr style={{ background:s.primary }}>
            {["Date", type==="foreign"?"Country":"Province","Total","Female","Actions"].map(h=>(
              <th key={h} style={{ padding:"10px 12px", color:"#fff", textAlign:"left", whiteSpace:"nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length===0 ? (
            <tr><td colSpan={5} style={{ textAlign:"center", padding:30, color:s.textMuted }}>{t.noData}</td></tr>
          ) : data.map((r,i) => (
            <tr key={r.id} style={{ background:i%2===0?s.surface:s.surface2, borderBottom:`1px solid ${s.border}` }}>
              <td style={tdStyle}>{r.visit_date}</td>
              <td style={tdStyle}>{type==="foreign"?r.country_name:r.province_name}</td>
              <td style={{...tdStyle,fontWeight:700,color:s.primary}}>{r.total_visitors}</td>
              <td style={{...tdStyle,color:"#c8a84b"}}>{r.female_visitors}</td>
              <td style={tdStyle}>
                <div style={{ display:"flex", gap:4 }}>
                  <button onClick={()=>onEdit(r)} style={{...smallBtn,background:"rgba(30,64,175,0.1)",color:s.primary,border:"none",padding:"3px 8px",fontSize:11}}>✏️</button>
                  <button onClick={()=>onDelete(r.id)} style={{...smallBtn,background:"rgba(220,38,38,0.1)",color:s.danger,border:"none",padding:"3px 8px",fontSize:11}}>🗑️</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function PageHeader({ title, icon, s }) {
  return (
    <div style={{ marginBottom:24, paddingBottom:16, borderBottom:`2px solid ${s.accent}` }}>
      <h2 style={{ color:s.text, fontSize:22, margin:0, display:"flex", alignItems:"center", gap:10,
        fontFamily:"'Kantumruy Pro','Hanuman',sans-serif" }}>
        <span>{icon}</span> {title}
      </h2>
    </div>
  );
}

function FormField({ label, error, children }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ display:"block", fontSize:12, fontWeight:600, marginBottom:6, color:"#64748b",
        fontFamily:"'Kantumruy Pro','Hanuman',sans-serif" }}>
        {label} {error && <span style={{ color:"#dc2626" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── STYLE UTILS ─────────────────────────────────────────────────────────────
const labelStyle = (dark) => ({
  display:"block", fontSize:12, fontWeight:600, marginBottom:6,
  color: dark?"#94a3b8":"#475569", fontFamily:"'Kantumruy Pro','Hanuman',sans-serif"
});
const labelStyle2 = (s) => ({
  display:"block", fontSize:12, fontWeight:600, marginBottom:6,
  color:s.textMuted, fontFamily:"'Kantumruy Pro','Hanuman',sans-serif"
});
const inputStyle = (dark) => ({
  width:"100%", padding:"12px 14px", borderRadius:10, fontSize:14, outline:"none",
  border:`1.5px solid ${dark?"#334155":"#e2e8f0"}`,
  background: dark?"#273549":"#f8fafc",
  color: dark?"#f1f5f9":"#1e293b",
  fontFamily:"'Kantumruy Pro','Hanuman',sans-serif",
  boxSizing:"border-box"
});
const inputStyle2 = (s, err) => ({
  width:"100%", padding:"10px 12px", borderRadius:8, fontSize:13, outline:"none",
  border:`1.5px solid ${err?"#dc2626":s.border}`,
  background: s.inputBg, color: s.text,
  fontFamily:"'Kantumruy Pro','Hanuman',sans-serif",
  boxSizing:"border-box"
});
const btnStyle = (bg) => ({
  padding:"10px 20px", borderRadius:8, border:"none", cursor:"pointer",
  background:bg, color:"#fff", fontSize:13, fontWeight:600,
  fontFamily:"'Kantumruy Pro','Hanuman',sans-serif"
});
const smallBtn = {
  padding:"6px 12px", borderRadius:7, cursor:"pointer", fontSize:12,
  fontFamily:"'Kantumruy Pro','Hanuman',sans-serif"
};
const cardStyle = (s) => ({
  background: s.cardBg, borderRadius:16, padding:24,
  boxShadow: s.shadow, border:`1px solid ${s.border}`, marginBottom:0
});
const chartTitle = (s) => ({
  color:s.text, fontSize:14, fontWeight:600, marginBottom:16, margin:"0 0 16px",
  fontFamily:"'Kantumruy Pro','Hanuman',sans-serif"
});
const tdStyle = {
  padding:"10px 14px", verticalAlign:"middle", whiteSpace:"nowrap"
};
