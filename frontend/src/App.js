import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [screen, setScreen] = useState("login");

  const token = localStorage.getItem("token");

  if (token && screen !== "dashboard") {
    setScreen("dashboard");
  }

  if (screen === "login")
    return <Login onLogin={() => setScreen("dashboard")} onSwitch={() => setScreen("register")} />;

  if (screen === "register")
    return <Register onSwitch={() => setScreen("login")} />;

  return <Dashboard onLogout={() => setScreen("login")} />;
}
