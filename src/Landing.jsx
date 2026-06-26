import React, { useState } from "react";
import Auth from "./Auth.jsx";

const T = {
  bg: "#04080F", s1: "#080E1C", border: "rgba(90,130,200,0.1)",
  ink: "#EDF2FF", sub: "#8A9EC0", dim: "#445268", cyan: "#22D3EE",
};

const SECTORS = [
  { icon: "🧠", name: "AI & Machine Learning" },
  { icon: "⚛️", name: "Quantum Computing" },
  { icon: "🛡️", name: "Defence & Space" },
  { icon: "🧬", name: "Biotech & MedTech" },
  { icon: "🔬", name: "Semiconductors" },
];

export default function Landing() {
  const [showAuth, setShowAuth] = useState(false);

  if (showAuth) return <Auth onBack={() => setShowAuth(false)} />;

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>

      {/* Nav */}
      <nav style={{ padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: "1.2rem", color: T.ink }}>
          <span style={{ color: T.cyan }}>Connect</span>Quants
        </div>
        <button
          onClick={() => setShowAuth(true)}
          style={{ background: T.cyan, border: "none", borderRadius: 10, color: "#04080F", fontFamily: "inherit", fontWeight: 700, fontSize: ".88rem", padding: "10px 22px", cursor: "pointer" }}
        >
          Join free →
        </button>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "100px 32px 80px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,211,238,.08)", border: `1px solid rgba(34,211,238,.2)`, borderRadius: 999, padding: "5px 16px", marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.cyan, display: "inline-block", animation: "pulse 2s infinite" }} />
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: ".68rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: T.cyan }}>
            Free forever · No credit card
          </span>
        </div>

        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(2.8rem,6vw,4.5rem)", fontWeight: 900, letterSpacing: "-.04em", lineHeight: 1.05, marginBottom: 24 }}>
          Talk to a real investor,<br />
          <span style={{ color: T.cyan }}>right now.</span>
        </h1>

        <p style={{ fontSize: "1.1rem", color: T.sub, lineHeight: 1.75, maxWidth: "36rem", margin: "0 auto 40px" }}>
          Pick a sector. Get matched instantly with another investor who tracks the same stocks. Chat live, share ideas, compare signals. No public feed. No noise. Just a real conversation.
        </p>

        <button
          onClick={() => setShowAuth(true)}
          style={{ background: T.cyan, border: "none", borderRadius: 12, color: "#04080F", fontFamily: "inherit", fontWeight: 800, fontSize: "1.05rem", padding: "16px 40px", cursor: "pointer", boxShadow: "0 0 40px rgba(34,211,238,.25)" }}
        >
          Connect with an investor →
        </button>

        <div style={{ marginTop: 16, fontSize: ".82rem", color: T.dim }}>Free forever. No card required.</div>
      </section>

      {/* Sectors */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "0 32px 80px" }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: ".65rem", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: T.dim, textAlign: "center", marginBottom: 24 }}>
          Choose your sector
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          {SECTORS.map(s => (
            <div
              key={s.name}
              onClick={() => setShowAuth(true)}
              style={{ display: "flex", alignItems: "center", gap: 10, background: T.s1, border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 20px", cursor: "pointer", transition: "border-color .15s" }}
            >
              <span style={{ fontSize: "1.2rem" }}>{s.icon}</span>
              <span style={{ fontWeight: 600, color: T.sub, fontSize: ".88rem" }}>{s.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "0 32px 100px" }}>
        <div className="how-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {[
            { num: "01", title: "Pick a sector", desc: "AI, Quantum, Defence, Biotech, or Semiconductors. We find someone who invests in the same space." },
            { num: "02", title: "Get matched", desc: "We pair you instantly with another ConnectQuants member waiting in the same sector queue." },
            { num: "03", title: "Chat live", desc: "A private 1-on-1 conversation. Share ideas, discuss signals, compare positions. No public feed." },
          ].map(s => (
            <div key={s.num} style={{ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 14, padding: "24px 20px" }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "1.8rem", fontWeight: 700, color: "rgba(34,211,238,.15)", marginBottom: 12, lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontWeight: 700, fontSize: ".95rem", color: T.ink, marginBottom: 8 }}>{s.title}</div>
              <p style={{ fontSize: ".82rem", color: T.sub, lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: `1px solid ${T.border}`, padding: "64px 32px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 800, marginBottom: 16 }}>
          Ready to talk to someone who gets it?
        </h2>
        <p style={{ color: T.sub, marginBottom: 28 }}>Free forever. Join in 30 seconds.</p>
        <button
          onClick={() => setShowAuth(true)}
          style={{ background: T.cyan, border: "none", borderRadius: 12, color: "#04080F", fontFamily: "inherit", fontWeight: 800, fontSize: "1rem", padding: "14px 36px", cursor: "pointer" }}
        >
          Join ConnectQuants free →
        </button>
        <div style={{ marginTop: 40, fontSize: ".78rem", color: T.dim }}>
          Already have a QuantDiver account?{" "}
          <span onClick={() => setShowAuth(true)} style={{ color: T.cyan, cursor: "pointer" }}>Sign in with the same email →</span>
        </div>
      </section>

    </div>
  );
}
