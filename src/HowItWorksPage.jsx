import React from "react";

const T = { bg:"#04080F", s1:"#080E1C", border:"rgba(90,130,200,0.1)", ink:"#EDF2FF", sub:"#8A9EC0", dim:"#445268", cyan:"#22D3EE" };

const STEPS = [
  {
    num:"01", icon:"🎯", color:"#22D3EE",
    title:"Pick your sector",
    desc:"Choose the technology sector you invest in — AI, Quantum Computing, Defence & Space, Biotech, or Semiconductors. You'll be matched with someone who tracks the same stocks.",
  },
  {
    num:"02", icon:"⚡", color:"#a78bfa",
    title:"Select your trading style",
    desc:"Are you a Day Trader (minutes to hours), Swing Trader (days to weeks), or Long Term investor (months to years)? We match you with someone who invests the same way you do — no more talking past each other.",
  },
  {
    num:"03", icon:"🤝", color:"#10B981",
    title:"Get matched instantly",
    desc:"We scan the queue and pair you with another ConnectQuants member who shares your sector and trading style. If no one is waiting, you join the queue — when someone arrives, you're connected automatically.",
  },
  {
    num:"04", icon:"💬", color:"#F59E0B",
    title:"Chat live, 1-on-1",
    desc:"A private real-time conversation — just you and one other investor. Share ideas, discuss signals, compare positions. No public feed, no noise, no algorithms deciding what you see.",
  },
  {
    num:"05", icon:"🔄", color:"#00dc82",
    title:"Connect again anytime",
    desc:"When the session ends, you can immediately start a new one. Each conversation is fresh — a new match, a new perspective. Build your network one conversation at a time.",
  },
];

const FAQS = [
  { q:"Is ConnectQuants free?", a:"Yes — completely free, forever. No credit card, no subscription, no hidden fees." },
  { q:"Who will I be matched with?", a:"Another ConnectQuants member in the same sector and with the same trading style as you. We never match a day trader with a long-term investor." },
  { q:"Are conversations private?", a:"Yes. Every conversation is 1-on-1 and private. Only you and your matched investor can see the messages." },
  { q:"What if no one is available?", a:"You join the queue. As soon as another investor arrives looking for the same match, you're connected automatically — usually within a few minutes." },
  { q:"Is this investment advice?", a:"No. ConnectQuants is a platform for investors to connect and share ideas. Nothing here constitutes financial advice. Always do your own research before making any investment decision." },
  { q:"How is this different from a forum?", a:"A forum is public, noisy, and full of people with different goals. ConnectQuants gives you one focused conversation with someone who invests exactly the same way you do." },
];

export default function HowItWorksPage({ onBack }) {
  return (
    <div style={{ minHeight:"100vh", background:T.bg }}>
      <header style={{ padding:"16px 24px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:T.sub, cursor:"pointer", fontSize:".88rem", fontFamily:"inherit" }}>← Back</button>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:"1rem", color:T.ink }}>
          <span style={{ color:T.cyan }}>Connect</span>Quants
        </div>
        <div style={{ width:60 }} />
      </header>

      <div style={{ maxWidth:620, margin:"0 auto", padding:"48px 24px 80px" }}>

        {/* Hero */}
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <div style={{ fontSize:".68rem", fontWeight:700, letterSpacing:".18em", textTransform:"uppercase", color:T.cyan, marginBottom:14 }}>
            How ConnectQuants works
          </div>
          <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:900, fontSize:"clamp(2rem,5vw,3rem)", letterSpacing:"-.03em", margin:"0 0 16px" }}>
            Five steps to a real conversation.
          </h1>
          <p style={{ color:T.sub, fontSize:".95rem", lineHeight:1.75, maxWidth:"38rem", margin:"0 auto" }}>
            ConnectQuants pairs you with another investor who shares your sector and trading style. No public feed. No noise. Just a direct conversation with someone who speaks your language.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display:"flex", flexDirection:"column", gap:0, marginBottom:56 }}>
          {STEPS.map((s, i) => (
            <div key={s.num} style={{ display:"flex", gap:20, position:"relative", paddingBottom: i < STEPS.length-1 ? 32 : 0 }}>
              {i < STEPS.length-1 && (
                <div style={{ position:"absolute", left:27, top:56, width:2, height:"calc(100% - 0px)", background:`linear-gradient(180deg, ${s.color}40, transparent)` }} />
              )}
              <div style={{ flexShrink:0, width:56, height:56, borderRadius:16, background:s.color+"15", border:`1px solid ${s.color}40`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2, position:"relative", zIndex:1 }}>
                <span style={{ fontSize:"1.2rem" }}>{s.icon}</span>
                <span style={{ fontFamily:"'Space Mono',monospace", fontSize:".55rem", fontWeight:700, color:s.color, letterSpacing:".06em" }}>{s.num}</span>
              </div>
              <div style={{ paddingTop:6, flex:1 }}>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:"1rem", color:T.ink, marginBottom:6 }}>{s.title}</div>
                <p style={{ fontSize:".85rem", color:T.sub, lineHeight:1.7, margin:0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* What makes it different */}
        <div style={{ background:T.s1, border:`1px solid ${T.border}`, borderRadius:16, padding:"28px", marginBottom:40 }}>
          <div style={{ fontSize:".68rem", fontWeight:700, letterSpacing:".18em", textTransform:"uppercase", color:T.dim, marginBottom:20 }}>
            What makes it different
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {[
              { icon:"🎯", title:"Same sector, same style", desc:"Matched by both sector AND trading style — day traders with day traders, long-term with long-term." },
              { icon:"🔒", title:"Completely private", desc:"1-on-1 only. No one else sees your conversation. No public posts." },
              { icon:"⚡", title:"Instant matching", desc:"If someone is waiting, you're connected in seconds. No scheduling, no profiles to browse." },
              { icon:"🆓", title:"Free forever", desc:"No subscription, no credit card, no premium tier. ConnectQuants is free and stays free." },
            ].map(item => (
              <div key={item.title} style={{ padding:"16px" }}>
                <div style={{ fontSize:"1.2rem", marginBottom:8 }}>{item.icon}</div>
                <div style={{ fontWeight:700, color:T.ink, fontSize:".88rem", marginBottom:4 }}>{item.title}</div>
                <p style={{ fontSize:".78rem", color:T.sub, lineHeight:1.6, margin:0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom:40 }}>
          <div style={{ fontSize:".68rem", fontWeight:700, letterSpacing:".18em", textTransform:"uppercase", color:T.dim, marginBottom:20 }}>
            Frequently asked questions
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
            {FAQS.map((f, i) => (
              <div key={f.q} style={{ padding:"18px 0", borderBottom: i < FAQS.length-1 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ fontWeight:700, color:T.ink, fontSize:".92rem", marginBottom:6 }}>{f.q}</div>
                <p style={{ fontSize:".85rem", color:T.sub, lineHeight:1.65, margin:0 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p style={{ fontSize:".72rem", color:T.dim, lineHeight:1.7, textAlign:"center" }}>
          ConnectQuants is a communication platform for investors. Nothing shared on this platform constitutes financial advice or a recommendation to buy or sell any security. Always conduct your own research before making any investment decision.
        </p>
      </div>
    </div>
  );
}
