import React, { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient.js";

const T = { bg:"#04080F", s1:"#080E1C", s2:"#0C1628", border:"rgba(90,130,200,0.1)", ink:"#EDF2FF", sub:"#8A9EC0", dim:"#445268", cyan:"#22D3EE" };

const TOPICS = [
  { id:"ai",             label:"AI & Machine Learning", icon:"🧠", color:"#22D3EE" },
  { id:"quantum",        label:"Quantum Computing",     icon:"⚛️", color:"#8B5CF6" },
  { id:"defence",        label:"Defence & Space",       icon:"🛡️", color:"#F59E0B" },
  { id:"biotech",        label:"Biotech & MedTech",     icon:"🧬", color:"#10B981" },
  { id:"semiconductors", label:"Semiconductors",        icon:"🔬", color:"#F97316" },
];

function avatarColor(name) {
  const COLORS = ["#00b4ff","#8B5CF6","#10B981","#F59E0B","#ff3c50","#22D3EE"];
  let h = 0; for (let i=0;i<(name||"").length;i++) h=(h*31+name.charCodeAt(i))&0xffff;
  return COLORS[h % COLORS.length];
}

export default function Connect({ session, onLogout }) {
  const [profile,      setProfile]      = useState(null);
  const [state,        setState]         = useState("idle"); // idle|queued|matched|ended
  const [topic,        setTopic]         = useState(null);
  const [queueId,      setQueueId]       = useState(null);
  const [matchSession, setMatchSession]  = useState(null);
  const [messages,     setMessages]      = useState([]);
  const [input,        setInput]         = useState("");
  const [online,       setOnline]        = useState([]);
  const bottomRef = useRef(null);
  const subRef    = useRef(null);

  useEffect(() => {
    supabase.from("profiles").select("*").eq("id",session.user.id).single()
      .then(({ data }) => setProfile(data));
  }, [session]);

  // Presence — who's online
  useEffect(() => {
    if (!session || !profile) return;
    const ch = supabase.channel("qc-global", { config:{ presence:{ key: session.user.id }}});
    ch.on("presence",{ event:"sync" },() => {
      const others = Object.values(ch.presenceState()).flat().filter(u=>u.username!==profile.username);
      setOnline(others);
    }).subscribe(async s => {
      if (s==="SUBSCRIBED") await ch.track({ username: profile.username, avatar_color: profile.avatar_color, id: session.user.id });
    });
    return () => supabase.removeChannel(ch);
  },[session, profile]);

  // Realtime: watch queue for match
  useEffect(() => {
    if (state!=="queued"||!queueId) return;
    const ch = supabase.channel(`qc-queue-${queueId}`)
      .on("postgres_changes",{ event:"UPDATE", schema:"public", table:"match_queue", filter:`id=eq.${queueId}` }, payload => {
        if (payload.new?.status==="matched"&&payload.new?.session_id) fetchSession(payload.new.session_id);
      }).subscribe();
    subRef.current = ch;
    return () => supabase.removeChannel(ch);
  },[state, queueId]);

  // Realtime: new messages
  useEffect(() => {
    if (state!=="matched"||!matchSession) return;
    const ch = supabase.channel(`qc-msgs-${matchSession.id}`)
      .on("postgres_changes",{ event:"INSERT", schema:"public", table:"match_messages", filter:`session_id=eq.${matchSession.id}` }, p => {
        setMessages(prev => prev.some(x=>x.id===p.new.id)?prev:[...prev,p.new]);
      })
      .on("postgres_changes",{ event:"UPDATE", schema:"public", table:"match_sessions", filter:`id=eq.${matchSession.id}` }, p => {
        if (p.new?.status==="ended") setState("ended");
      }).subscribe();
    subRef.current = ch;
    return () => supabase.removeChannel(ch);
  },[state, matchSession]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); },[messages]);

  async function fetchSession(sessionId) {
    const { data } = await supabase.from("match_sessions").select("*").eq("id",sessionId)
      .or(`user1_id.eq.${session.user.id},user2_id.eq.${session.user.id}`).maybeSingle();
    if (data) { setMatchSession(data); setState("matched"); loadMessages(data.id); }
  }

  async function loadMessages(sessionId) {
    const { data } = await supabase.from("match_messages").select("*")
      .eq("session_id",sessionId).order("created_at",{ ascending:true }).limit(200);
    setMessages(data||[]);
  }

  async function joinQueue() {
    if (!topic||!profile) return;
    await supabase.from("match_queue").delete().eq("user_id",session.user.id).in("status",["waiting","cancelled"]);
    const cutoff = new Date(Date.now()-10*60*1000).toISOString();
    await supabase.from("match_queue").delete().lt("joined_at",cutoff).eq("status","waiting");

    const { data: waiting } = await supabase.from("match_queue").select("*")
      .eq("topic",topic).eq("status","waiting").neq("user_id",session.user.id)
      .order("joined_at",{ ascending:true }).limit(1).maybeSingle();

    if (waiting) {
      const { data: sess } = await supabase.from("match_sessions").insert({
        user1_id:waiting.user_id, user1_name:waiting.username,
        user2_id:session.user.id, user2_name:profile.username, topic,
      }).select().single();
      if (sess) {
        await supabase.from("match_queue").update({ status:"matched", session_id:sess.id }).eq("id",waiting.id);
        const { data: myEntry } = await supabase.from("match_queue").insert({ user_id:session.user.id, username:profile.username, topic, status:"matched", session_id:sess.id }).select().single();
        setQueueId(myEntry?.id); setMatchSession(sess); setState("matched"); loadMessages(sess.id); return;
      }
    }
    const { data: entry } = await supabase.from("match_queue").insert({ user_id:session.user.id, username:profile.username, topic }).select().single();
    setQueueId(entry?.id); setState("queued");
  }

  async function sendMessage() {
    if (!input.trim()||!matchSession) return;
    const text = input.trim(); setInput("");
    const opt = { id:`opt-${Date.now()}`, user_id:session.user.id, username:profile.username, content:text, session_id:matchSession.id, created_at:new Date().toISOString() };
    setMessages(prev=>[...prev,opt]);
    const { data } = await supabase.from("match_messages").insert({ session_id:matchSession.id, user_id:session.user.id, username:profile.username, content:text }).select().single();
    if (data) setMessages(prev=>prev.map(m=>m.id===opt.id?data:m));
  }

  async function endSession() {
    if (matchSession) await supabase.from("match_sessions").update({ status:"ended" }).eq("id",matchSession.id);
    if (queueId) await supabase.from("match_queue").update({ status:"cancelled" }).eq("id",queueId).eq("user_id",session.user.id);
    setMatchSession(null); setQueueId(null); setMessages([]); setTopic(null); setState("idle");
  }

  const topicInfo = TOPICS.find(t=>t.id===topic)||TOPICS[0];
  const partnerName = matchSession ? (matchSession.user1_id===session.user.id ? matchSession.user2_name : matchSession.user1_name) : "";

  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", flexDirection:"column" }}>

      {/* Header */}
      <header style={{ padding:"16px 24px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:"1.1rem", color:T.ink }}>
          <span style={{ color:T.cyan }}>Connect</span>Quants
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#00dc82", display:"inline-block" }} />
            <span style={{ fontSize:".72rem", color:"#4a6a88" }}>{online.length} online</span>
          </div>
          <span style={{ fontSize:".78rem", color:T.dim }}>Hi, {profile?.username || "..."}</span>
          <button onClick={onLogout} style={{ background:"none", border:`1px solid ${T.border}`, borderRadius:8, color:T.dim, cursor:"pointer", fontSize:".72rem", padding:"5px 12px", fontFamily:"inherit" }}>
            Sign out
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent: state==="idle"||state==="queued" ? "center" : "flex-start", padding:"32px 24px", maxWidth:640, margin:"0 auto", width:"100%" }}>

        {/* IDLE — topic picker */}
        {state==="idle" && (
          <div className="fade-in" style={{ width:"100%", textAlign:"center" }}>
            <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:"clamp(1.8rem,4vw,2.4rem)", marginBottom:12 }}>
              Talk to a real investor, right now.
            </h2>
            <p style={{ color:T.sub, lineHeight:1.7, marginBottom:40, maxWidth:"34rem", margin:"0 auto 40px" }}>
              Select a sector and we'll match you instantly with another investor who tracks the same stocks.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
              {TOPICS.map(t => (
                <button key={t.id} onClick={() => setTopic(t.id)} style={{
                  display:"flex", alignItems:"center", gap:14, padding:"16px 20px",
                  background: topic===t.id ? `${t.color}15` : T.s1,
                  border:`2px solid ${topic===t.id ? t.color : T.border}`,
                  borderRadius:14, cursor:"pointer", transition:"all .15s", textAlign:"left",
                }}>
                  <span style={{ fontSize:"1.4rem" }}>{t.icon}</span>
                  <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, fontSize:"1rem", color: topic===t.id ? t.color : T.sub }}>
                    {t.label}
                  </span>
                  {topic===t.id && <span style={{ marginLeft:"auto", fontSize:".7rem", fontWeight:700, color:t.color }}>Selected ✓</span>}
                </button>
              ))}
            </div>
            <button onClick={joinQueue} disabled={!topic} style={{
              width:"100%", padding:"16px", background: topic ? T.cyan : "rgba(255,255,255,.05)",
              border:"none", borderRadius:12, color: topic ? "#04080F" : T.dim,
              fontFamily:"inherit", fontWeight:800, fontSize:"1rem", cursor: topic ? "pointer" : "not-allowed",
              transition:"all .2s",
            }}>
              {topic ? `Find ${topicInfo.icon} Investor →` : "Select a sector first"}
            </button>
            <p style={{ fontSize:".72rem", color:T.dim, marginTop:14 }}>
              Connections are voluntary and anonymous. Never share personal financial details.
            </p>
          </div>
        )}

        {/* QUEUED */}
        {state==="queued" && (
          <div className="fade-in" style={{ textAlign:"center" }}>
            <div style={{ fontSize:"2.5rem", marginBottom:20 }}>{topicInfo.icon}</div>
            <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:"1.6rem", marginBottom:12 }}>
              Finding your match…
            </h2>
            <p style={{ color:T.sub, marginBottom:32 }}>
              Looking for another <b style={{color:topicInfo.color}}>{topicInfo.label}</b> investor. Sit tight.
            </p>
            <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:32 }}>
              {[0,1,2].map(i => <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:topicInfo.color, opacity:.8, animation:`pulse 1.2s ${i*.3}s infinite` }} />)}
            </div>
            <button onClick={endSession} style={{ background:"none", border:`1px solid ${T.border}`, borderRadius:10, color:T.dim, fontFamily:"inherit", cursor:"pointer", padding:"10px 20px", fontSize:".82rem" }}>
              Cancel
            </button>
          </div>
        )}

        {/* MATCHED — chat */}
        {state==="matched" && matchSession && (
          <div className="fade-in" style={{ width:"100%", display:"flex", flexDirection:"column", height:"calc(100vh - 90px)" }}>
            {/* Chat header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderBottom:`1px solid ${T.border}`, marginBottom:8, flexShrink:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:34, height:34, borderRadius:"50%", background:avatarColor(partnerName), display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, color:"#fff", fontSize:".85rem" }}>
                  {(partnerName||"?")[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight:700, color:T.ink, fontSize:".92rem" }}>{partnerName}</div>
                  <div style={{ fontSize:".65rem", color:topicInfo.color, fontWeight:700 }}>{topicInfo.icon} {topicInfo.label}</div>
                </div>
              </div>
              <button onClick={endSession} style={{ background:"rgba(255,60,80,.08)", border:"1px solid rgba(255,60,80,.2)", borderRadius:8, color:"#ff3c50", fontFamily:"inherit", cursor:"pointer", padding:"6px 14px", fontSize:".75rem", fontWeight:700 }}>
                End
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:12, padding:"8px 0" }}>
              {messages.length===0 && (
                <p style={{ color:T.dim, fontSize:".82rem", textAlign:"center", marginTop:32 }}>
                  Say hello to {partnerName} 👋
                </p>
              )}
              {messages.map(m => {
                const isMe = m.user_id===session.user.id;
                return (
                  <div key={m.id} style={{ display:"flex", gap:8, alignItems:"flex-end", flexDirection: isMe ? "row-reverse" : "row" }}>
                    {!isMe && (
                      <div style={{ width:28, height:28, borderRadius:"50%", background:avatarColor(m.username), display:"flex", alignItems:"center", justifyContent:"center", fontSize:".65rem", fontWeight:700, color:"#fff", flexShrink:0 }}>
                        {(m.username||"?")[0].toUpperCase()}
                      </div>
                    )}
                    <div style={{
                      maxWidth:"72%", padding:"10px 14px", borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: isMe ? T.cyan : T.s2,
                      color: isMe ? "#04080F" : T.ink,
                      fontSize:".88rem", lineHeight:1.55,
                    }}>
                      {m.content}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ display:"flex", gap:10, paddingTop:12, borderTop:`1px solid ${T.border}`, flexShrink:0 }}>
              <input
                value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); sendMessage(); }}}
                placeholder={`Message ${partnerName}…`}
                style={{ flex:1, background:T.s1, border:`1px solid ${T.border}`, borderRadius:10, color:T.ink, padding:"12px 14px", fontSize:".88rem", outline:"none" }}
              />
              <button onClick={sendMessage} style={{ background:T.cyan, border:"none", borderRadius:10, color:"#04080F", fontWeight:700, padding:"0 18px", cursor:"pointer", fontSize:"1rem" }}>→</button>
            </div>
          </div>
        )}

        {/* ENDED */}
        {state==="ended" && (
          <div className="fade-in" style={{ textAlign:"center" }}>
            <div style={{ fontSize:"2rem", marginBottom:16 }}>👋</div>
            <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:"1.6rem", marginBottom:12 }}>Session ended</h2>
            <p style={{ color:T.sub, marginBottom:32 }}>The conversation has ended. Want to connect with someone else?</p>
            <button onClick={() => setState("idle")} style={{ background:T.cyan, border:"none", borderRadius:12, color:"#04080F", fontFamily:"inherit", fontWeight:800, fontSize:"1rem", padding:"14px 32px", cursor:"pointer" }}>
              Connect again →
            </button>
            <div style={{ marginTop:20, fontSize:".8rem", color:T.dim }}>
              Want the scores behind the stocks you discussed?{" "}
              <a href="https://quantdiver.com" target="_blank" rel="noopener noreferrer" style={{ color:T.cyan }}>
                Try QuantDiver free →
              </a>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
