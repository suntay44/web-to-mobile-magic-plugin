import { Route, Routes } from "react-router-dom";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://example.supabase.co", "anon-key");

function Home() {
  window.localStorage.setItem("lastRoute", "/");
  return <a href="/dashboard">Dashboard</a>;
}

function Dashboard() {
  document.cookie = "view=dashboard";
  axios.get("/api/dashboard");
  void supabase.auth.getSession();
  return <a href="/settings">Settings</a>;
}

function Settings() {
  return <span>{window.matchMedia("(max-width: 600px)").matches ? "Mobile" : "Desktop"}</span>;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}
