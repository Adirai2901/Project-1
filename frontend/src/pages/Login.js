import { useState } from "react";

export default function Login({ onLogin, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const loginUser = async (e) => {
    e?.preventDefault?.();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        if (typeof onLogin === "function") onLogin();
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      alert("Cannot reach backend. Make sure Spring Boot is running.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <form
        onSubmit={loginUser}
        className="bg-white p-6 rounded-lg shadow-lg w-80"
        autoComplete="off"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative mb-3">
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            className="w-full p-2 border rounded pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-2 top-2 text-gray-600"
          >
            {show ? "🙈" : "👁️"}
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          type="button"
          onClick={() => onSwitch && onSwitch("register")}
          className="mt-3 text-blue-600 underline w-full text-center"
        >
          New user? Register
        </button>
      </form>
    </div>
  );
}
