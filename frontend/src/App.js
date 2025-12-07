import { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";

export default function App() {
  const [page, setPage] = useState("login");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setPage("dashboard");
  }, []);

  const onLogin = () => setPage("dashboard");
  const onLogout = () => setPage("login");

  return (
    <>
      {page === "login" && <Login onLogin={onLogin} onSwitch={() => setPage("register")} />}

      {page === "register" && (
        <Register onSwitch={() => setPage("login")} />
      )}

      {page === "dashboard" && (
        <Dashboard onLogout={onLogout} />
      )}
    </>
  );
}
