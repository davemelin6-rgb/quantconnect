import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient.js";

const T = { bg:"#04080F", s1:"#080E1C", border:"rgba(90,130,200,0.1)", ink:"#EDF2FF", sub:"#8A9EC0", dim:"#445268", cyan:"#22D3EE" };

const SECTORS = [
  { id:"ai",             label:"AI & Machine Learning", icon:"🧠" },
  { id:"quantum",        label:"Quantum Computing",     icon:"⚛️" },
  { id:"defence",        label:"Defence & Space",       icon:"🛡️" },
  { id:"biotech",        label:"Biotech & MedTech",     icon:"🧬" },
  { id:"semiconductors", label:"Semiconductors",        icon:"🔬" },
];

const EXPERIENCE_LEVELS = [
  { id:"beginner",     label:"Beginner",      desc:"Less than 1 year",     icon:"🌱" },
  { id:"intermediate", label:"Intermediate",  desc:"1–3 years",            icon:"📈" },
  { id:"advanced",     label:"Advanced",      desc:"3–10 years",           icon:"🎯" },
  { id:"expert",       label:"Expert",        desc:"10+ years",            icon:"🏆" },
];

const field = (label, children) => (
  <div style={{ marginBottom: 20 }}>
    <label style={{ display:"block", fontSize:".72rem", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:T.dim, marginBottom:8 }}>
      {label}
    </label>
    {children}
  </div>
);

const input = (props) => (
  <input {...props} style={{
    width:"100%", background:T.s1, border:`1px solid ${T.border}`,
    borderRadius:10, color:T.ink, padding:"12px 14px",
    fontSize:".92rem", outline:"none", fontFamily:"inherit",
    ...props.style,
  }} />
);

export default function ProfilePage({ session, onBack }) {
  const [profile,   setProfile]  = useState(null);
  const [saving,    setSaving]   = useState(false);
  const [saved,     setSaved]    = useState(false);

  // form fields
  const [username,   setUsername]   = useState("");
  const [fullName,   setFullName]   = useState("");
  const [age,        setAge]        = useState("");
  const [bio,        setBio]        = useState("");
  const [experience, setExperience] = useState("");
  const [sectors,    setSectors]    = useState([]);

  useEffect(() => {
    if (!session?.user?.id) return;
    supabase.from("profiles").select("*").eq("id", session.user.id).single()
      .then(({ data }) => {
        if (!data) return;
        setProfile(data);
        setUsername(data.username || "");
        setFullName(data.full_name || "");
        setAge(data.age || "");
        setBio(data.bio || "");
        setExperience(data.trading_experience || "");
        setSectors(data.trading_sectors ? data.trading_sectors.split(",").filter(Boolean) : []);
      });
  }, [session]);

  function toggleSector(id) {
    setSectors(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    await supabase.from("profiles").upsert({
      id:                session.user.id,
      username,
      full_name:         fullName,
      age:               age ? parseInt(age) : null,
      bio,
      trading_experience: experience,
      trading_sectors:   sectors.join(","),
    }, { onConflict: "id" });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const avatarLetter = (username || fullName || "?")[0]?.toUpperCase();
  const AVATAR_COLORS = ["#00b4ff","#8B5CF6","#10B981","#F59E0B","#ff3c50","#22D3EE"];
  let h = 0; for (let i=0;i<(username||"").length;i++) h=(h*31+(username||"").charCodeAt(i))&0xffff;
  const avatarColor = profile?.avatar_color || AVATAR_COLORS[h % AVATAR_COLORS.length];

  return (
    <div style={{ minHeight:"100vh", background:T.bg }}>

      {/* Header */}
      <header style={{ padding:"16px 24px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:T.sub, cursor:"pointer", fontSize:".88rem", fontFamily:"inherit", display:"flex", alignItems:"center", gap:8 }}>
          ← Back
        </button>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:"1rem", color:T.ink }}>
          <span style={{ color:T.cyan }}>Connect</span>Quants
        </div>
        <div style={{ width:60 }} />
      </header>

      <div style={{ maxWidth:520, margin:"0 auto", padding:"40px 24px 80px" }}>

        {/* Avatar */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:40 }}>
          <div style={{ width:80, height:80, borderRadius:"50%", background:avatarColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2rem", fontWeight:700, color:"#fff", marginBottom:12 }}>
            {avatarLetter}
          </div>
          <div style={{ fontWeight:700, color:T.ink, fontSize:"1.1rem" }}>{username || "Set your username"}</div>
          <div style={{ fontSize:".78rem", color:T.dim, marginTop:4 }}>{session?.user?.email}</div>
        </div>

        <form onSubmit={handleSave}>

          {/* Basic info */}
          <div style={{ background:T.s1, border:`1px solid ${T.border}`, borderRadius:16, padding:"24px", marginBottom:16 }}>
            <div style={{ fontSize:".68rem", fontWeight:700, letterSpacing:".16em", textTransform:"uppercase", color:T.dim, marginBottom:20 }}>Basic Info</div>

            {field("Username", input({ value:username, onChange:e=>setUsername(e.target.value), placeholder:"How you appear to others" }))}
            {field("Full Name", input({ value:fullName, onChange:e=>setFullName(e.target.value), placeholder:"Optional" }))}
            {field("Age", input({ value:age, onChange:e=>setAge(e.target.value), type:"number", min:18, max:100, placeholder:"Optional" }))}
            {field("Email",
              <div style={{ padding:"12px 14px", background:"rgba(255,255,255,.03)", border:`1px solid ${T.border}`, borderRadius:10, color:T.dim, fontSize:".92rem" }}>
                {session?.user?.email}
              </div>
            )}
            {field("Short Bio",
              <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Tell other investors a bit about yourself..."
                style={{ width:"100%", background:T.s1, border:`1px solid ${T.border}`, borderRadius:10, color:T.ink, padding:"12px 14px", fontSize:".88rem", outline:"none", fontFamily:"inherit", minHeight:80, resize:"vertical" }} />
            )}
          </div>

          {/* Trading experience */}
          <div style={{ background:T.s1, border:`1px solid ${T.border}`, borderRadius:16, padding:"24px", marginBottom:16 }}>
            <div style={{ fontSize:".68rem", fontWeight:700, letterSpacing:".16em", textTransform:"uppercase", color:T.dim, marginBottom:20 }}>Trading Experience</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {EXPERIENCE_LEVELS.map(l => (
                <button key={l.id} type="button" onClick={() => setExperience(l.id)} style={{
                  padding:"16px 14px", textAlign:"left", borderRadius:12, cursor:"pointer",
                  background: experience===l.id ? "rgba(34,211,238,.1)" : "rgba(255,255,255,.025)",
                  border:`2px solid ${experience===l.id ? T.cyan : T.border}`,
                  transition:"all .15s",
                }}>
                  <div style={{ fontSize:"1.2rem", marginBottom:6 }}>{l.icon}</div>
                  <div style={{ fontWeight:700, color: experience===l.id ? T.cyan : T.ink, fontSize:".88rem" }}>{l.label}</div>
                  <div style={{ fontSize:".7rem", color:T.dim, marginTop:2 }}>{l.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Sectors of expertise */}
          <div style={{ background:T.s1, border:`1px solid ${T.border}`, borderRadius:16, padding:"24px", marginBottom:28 }}>
            <div style={{ fontSize:".68rem", fontWeight:700, letterSpacing:".16em", textTransform:"uppercase", color:T.dim, marginBottom:20 }}>Sectors of Expertise</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {SECTORS.map(s => (
                <button key={s.id} type="button" onClick={() => toggleSector(s.id)} style={{
                  display:"flex", alignItems:"center", gap:12, padding:"12px 16px",
                  borderRadius:10, cursor:"pointer",
                  background: sectors.includes(s.id) ? "rgba(34,211,238,.08)" : "rgba(255,255,255,.02)",
                  border:`1px solid ${sectors.includes(s.id) ? T.cyan : T.border}`,
                  transition:"all .15s",
                }}>
                  <span style={{ fontSize:"1.1rem" }}>{s.icon}</span>
                  <span style={{ fontWeight:600, color: sectors.includes(s.id) ? T.cyan : T.sub, fontSize:".88rem" }}>{s.label}</span>
                  {sectors.includes(s.id) && <span style={{ marginLeft:"auto", color:T.cyan, fontSize:".8rem", fontWeight:700 }}>✓</span>}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={saving} style={{
            width:"100%", padding:"15px", background:T.cyan, border:"none",
            borderRadius:12, color:"#04080F", fontFamily:"inherit",
            fontWeight:800, fontSize:"1rem", cursor:"pointer",
          }}>
            {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
