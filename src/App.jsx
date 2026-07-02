import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient.js";
import Landing     from "./Landing.jsx";
import Auth        from "./Auth.jsx";
import Connect     from "./Connect.jsx";
import ProfilePage from "./ProfilePage.jsx";
import ContactPage from "./ContactPage.jsx";

export default function App() {
  const [session, setSession] = useState(undefined);
  const [page,    setPage]    = useState("connect"); // connect | profile | contact

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", color:"#3d5c78", fontFamily:"'Space Mono',monospace", fontSize:".8rem", letterSpacing:".1em" }}>
      LOADING…
    </div>
  );

  if (!session) return <Landing onGetStarted={() => {}} />;

  if (page === "profile") return <ProfilePage session={session} onBack={() => setPage("connect")} />;
  if (page === "contact") return <ContactPage session={session} onBack={() => setPage("connect")} />;

  return <Connect session={session} onLogout={() => supabase.auth.signOut()} onNavigate={setPage} />;
}
