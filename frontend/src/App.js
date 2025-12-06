import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [screen, setScreen] = useState("login");

  const loggedIn = localStorage.getItem("token") !== null;

  if (!loggedIn) {
    if (screen === "login") {
      return <Login onLogin={() => window.location.reload()} onSwitch={() => setScreen("register")} />;
    }
    return <Register onRegistered={() => setScreen("login")} />;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-gray-700">You are logged in successfully.</p>
    </div>
  );
}

export default App;
