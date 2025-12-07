import { useState } from "react";

export default function Register({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const registerUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          fullName,
          password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Account created! Please login.");
        onSwitch("login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch {
      alert("Backend unreachable. Start Spring Boot.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0e1525] flex justify-center items-center px-4">
      <form
        onSubmit={registerUser}
        className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-8 text-white"
      >
        <h2 className="text-3xl font-semibold text-center mb-6">
          Create an Account
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-4 p-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative mb-4">
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none pr-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-3 text-white/70 text-xl"
          >
            {show ? "🙈" : "👁️"}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold shadow-lg transition-all"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-center mt-4 text-white/70">
          Already have an account?{" "}
          <span
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={() => onSwitch("login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
