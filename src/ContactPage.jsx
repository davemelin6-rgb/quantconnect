import React, { useState } from "react";

const T = { bg:"#04080F", s1:"#080E1C", border:"rgba(90,130,200,0.1)", ink:"#EDF2FF", sub:"#8A9EC0", dim:"#445268", cyan:"#22D3EE" };

export default function ContactPage({ session, onBack }) {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState(session?.user?.email || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true); setError(null);
    try {
      const res = await fetch("https://www.quantdiver.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message: `[ConnectQuants] Subject: ${subject}\n\n${message}` }),
      });
      if (res.ok) { setSent(true); }
      else { setError("Something went wrong. Try emailing us directly."); }
    } catch {
      setError("Network error. Try emailing administrator@quantdiver.com");
    }
    setSending(false);
  }

  return (
    <div style={{ minHeight:"100vh", background:T.bg }}>
      <header style={{ padding:"16px 24px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:T.sub, cursor:"pointer", fontSize:".88rem", fontFamily:"inherit" }}>← Back</button>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:"1rem", color:T.ink }}>
          <span style={{ color:T.cyan }}>Connect</span>Quants
        </div>
        <div style={{ width:60 }} />
      </header>

      <div style={{ maxWidth:480, margin:"0 auto", padding:"48px 24px 80px" }}>
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:"1.8rem", marginBottom:8 }}>Contact Us</h2>
        <p style={{ color:T.sub, lineHeight:1.7, marginBottom:36 }}>
          Have a question or feedback? We read every message.
        </p>

        {sent ? (
          <div style={{ background:"rgba(0,220,130,.08)", border:"1px solid rgba(0,220,130,.2)", borderRadius:14, padding:"32px", textAlign:"center" }}>
            <div style={{ fontSize:"2rem", marginBottom:12 }}>✅</div>
            <div style={{ fontWeight:700, color:"#00dc82", fontSize:"1.1rem", marginBottom:8 }}>Message sent!</div>
            <p style={{ color:T.sub, fontSize:".88rem" }}>We'll get back to you at {email}.</p>
            <button onClick={onBack} style={{ marginTop:20, background:T.cyan, border:"none", borderRadius:10, color:"#04080F", fontFamily:"inherit", fontWeight:700, padding:"10px 24px", cursor:"pointer" }}>
              Back to ConnectQuants
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {[
              { label:"Your Name", value:name, set:setName, placeholder:"How should we address you?", type:"text", required:true },
              { label:"Email", value:email, set:setEmail, placeholder:"your@email.com", type:"email", required:true },
              { label:"Subject", value:subject, set:setSubject, placeholder:"What's it about?", type:"text", required:true },
            ].map(f => (
              <div key={f.label}>
                <label style={{ display:"block", fontSize:".72rem", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:T.dim, marginBottom:7 }}>{f.label}</label>
                <input type={f.type} value={f.value} onChange={e=>f.set(e.target.value)} placeholder={f.placeholder} required={f.required}
                  style={{ width:"100%", background:T.s1, border:`1px solid ${T.border}`, borderRadius:10, color:T.ink, padding:"12px 14px", fontSize:".92rem", outline:"none", fontFamily:"inherit" }} />
              </div>
            ))}
            <div>
              <label style={{ display:"block", fontSize:".72rem", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:T.dim, marginBottom:7 }}>Message</label>
              <textarea value={message} onChange={e=>setMessage(e.target.value)} required placeholder="Tell us what's on your mind..."
                style={{ width:"100%", background:T.s1, border:`1px solid ${T.border}`, borderRadius:10, color:T.ink, padding:"12px 14px", fontSize:".88rem", outline:"none", fontFamily:"inherit", minHeight:140, resize:"vertical" }} />
            </div>
            {error && <div style={{ background:"rgba(255,60,80,.08)", border:"1px solid rgba(255,60,80,.2)", borderRadius:8, padding:"10px 14px", color:"#ff3c50", fontSize:".82rem" }}>{error}</div>}
            <button type="submit" disabled={sending} style={{
              background:T.cyan, border:"none", borderRadius:12, color:"#04080F",
              fontFamily:"inherit", fontWeight:800, fontSize:"1rem", padding:"14px", cursor:"pointer",
            }}>
              {sending ? "Sending…" : "Send Message →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
