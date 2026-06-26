import React, { useState } from "react";
import { supabase } from "./supabaseClient.js";

const T = { bg:"#04080F", s1:"#080E1C", border:"rgba(90,130,200,0.1)", ink:"#EDF2FF", sub:"#8A9EC0", dim:"#445268", cyan:"#22D3EE" };

export default function Auth({ onBack }) {
  const [mode,     setMode]     = useState("signup"); // signup | signin
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [done,     setDone]     = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "signup") {
      const { data, error: err } = await supabase.auth.signUp({ email, password });
      if (err) { setError(err.message); setLoading(false); return; }
      // Create profile
      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          username: username || email.split("@")[0],
          avatar_color: ["#00b4ff","#8B5CF6","#10B981","#F59E0B","#ff3c50"][Math.floor(Math.random()*5)],
        });
      }
      setDone(true);
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) { setError(err.message); }
    }
    setLoading(false);
  }

  if (done) return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:32 }}>
      <div style={{ textAlign:"center", maxWidth:400 }}>
        <div style={{ fontSize:"2rem", marginBottom:16 }}>✅</div>
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, marginBottom:12 }}>Check your email</h2>
        <p style={{ color:T.sub, lineHeight:1.7 }}>We sent a confirmation link to <b style={{color:T.ink}}>{email}</b>. Click it to activate your account, then come back to connect.</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:32 }}>
      <div style={{ width:"100%", maxWidth:420 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:T.dim, cursor:"pointer", fontSize:".85rem", marginBottom:32, fontFamily:"inherit" }}>← Back</button>

        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:"1.6rem", marginBottom:8 }}>
          {mode === "signup" ? "Join ConnectQuants" : "Welcome back"}
        </div>
        <p style={{ color:T.sub, fontSize:".88rem", marginBottom:32 }}>
          {mode === "signup" ? "Free forever. Connect with real investors." : "Sign in to connect with investors."}
        </p>

        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {mode === "signup" && (
            <div>
              <label style={{ fontSize:".75rem", color:T.dim, letterSpacing:".08em", textTransform:"uppercase", display:"block", marginBottom:6 }}>Username</label>
              <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="How you'll appear to other investors"
                style={{ width:"100%", background:T.s1, border:`1px solid ${T.border}`, borderRadius:10, color:T.ink, padding:"12px 14px", fontSize:".92rem", outline:"none" }} />
            </div>
          )}
          <div>
            <label style={{ fontSize:".75rem", color:T.dim, letterSpacing:".08em", textTransform:"uppercase", display:"block", marginBottom:6 }}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="your@email.com"
              style={{ width:"100%", background:T.s1, border:`1px solid ${T.border}`, borderRadius:10, color:T.ink, padding:"12px 14px", fontSize:".92rem", outline:"none" }} />
          </div>
          <div>
            <label style={{ fontSize:".75rem", color:T.dim, letterSpacing:".08em", textTransform:"uppercase", display:"block", marginBottom:6 }}>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Min. 8 characters"
              style={{ width:"100%", background:T.s1, border:`1px solid ${T.border}`, borderRadius:10, color:T.ink, padding:"12px 14px", fontSize:".92rem", outline:"none" }} />
          </div>

          {error && <div style={{ background:"rgba(255,60,80,.08)", border:"1px solid rgba(255,60,80,.2)", borderRadius:8, padding:"10px 14px", color:"#ff3c50", fontSize:".82rem" }}>{error}</div>}

          <button type="submit" disabled={loading} style={{ background:T.cyan, border:"none", borderRadius:10, color:"#04080F", fontFamily:"inherit", fontWeight:800, fontSize:"1rem", padding:"14px", cursor:"pointer", marginTop:4 }}>
            {loading ? "…" : mode === "signup" ? "Create free account →" : "Sign in →"}
          </button>
        </form>

        <div style={{ textAlign:"center", marginTop:24, fontSize:".82rem", color:T.dim }}>
          {mode === "signup" ? "Already have an account? " : "No account? "}
          <span onClick={() => setMode(mode === "signup" ? "signin" : "signup")} style={{ color:T.cyan, cursor:"pointer" }}>
            {mode === "signup" ? "Sign in" : "Join free"}
          </span>
        </div>

        <div style={{ textAlign:"center", marginTop:16, fontSize:".75rem", color:T.dim }}>
          Have a QuantDiver account? Use the same email and password.
        </div>
      </div>
    </div>
  );
}
