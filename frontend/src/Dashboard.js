export default function Dashboard({ onLogout }) {

  const logout = () => {
    localStorage.removeItem("token");  // remove JWT
    onLogout();                         // go back to login page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="mb-4">You are logged in successfully.</p>

      <button
        onClick={logout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
