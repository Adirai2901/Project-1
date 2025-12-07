import { useState, useEffect } from "react";
import TablePage from "./TablePage";

export default function Dashboard() {
  const [databases, setDatabases] = useState([]);
  const [selectedDb, setSelectedDb] = useState(null);
  const [newDb, setNewDb] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const loadDatabases = async () => {
    try {
      const res = await fetch("http://localhost:8080/db/list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      setDatabases(json);
    } catch (err) {
      alert("Error loading databases");
    }
  };

  useEffect(() => {
    loadDatabases();
  }, []);

  const createDatabase = async () => {
    if (!newDb.trim()) {
      alert("Enter a database name");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/db/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dbName: newDb }),
      });

      const json = await res.json();
      alert(json.status);

      setNewDb("");
      loadDatabases();
    } catch {
      alert("Error creating database");
    }

    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  if (selectedDb) {
    return <TablePage database={selectedDb} onBack={() => setSelectedDb(null)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 px-4">

      {/* Glass Container */}
      <div className="w-full max-w-4xl p-8 rounded-2xl shadow-xl bg-white/10 backdrop-blur-xl border border-white/20">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white drop-shadow">Dashboard</h1>

          <button
            onClick={logout}
            className="bg-red-600/80 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow border border-white/20"
          >
            Logout
          </button>
        </div>

        {/* Create DB Section */}
        <div className="mt-8 p-6 bg-white/10 rounded-xl shadow border border-white/20 backdrop-blur-lg">
          <h2 className="text-xl font-semibold text-white">Create New Database</h2>

          <input
            type="text"
            className="w-full p-3 mt-3 rounded-xl bg-white/20 text-white border border-white/30 placeholder-gray-200 focus:outline-none"
            placeholder="Enter database name"
            value={newDb}
            onChange={(e) => setNewDb(e.target.value)}
          />

          <button
            onClick={createDatabase}
            disabled={loading}
            className="w-full mt-4 py-2 rounded-xl bg-green-600/80 hover:bg-green-700 text-white border border-white/20"
          >
            {loading ? "Creating..." : "Create Database"}
          </button>
        </div>

        {/* DB List */}
        <h2 className="text-2xl text-white font-semibold mt-10">Your Databases</h2>

        <div className="mt-4 flex flex-wrap gap-4">
          {databases.length > 0 ? (
            databases.map((db) => {
              const name = db.databaseName ?? db;
              return (
                <button
                  key={name}
                  onClick={() => setSelectedDb(name)}
                  className="px-5 py-2 bg-blue-600/80 text-white rounded-xl shadow border border-white/20 hover:bg-blue-700"
                >
                  {name}
                </button>
              );
            })
          ) : (
            <p className="text-gray-200">No databases created yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
