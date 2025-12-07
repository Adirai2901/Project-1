import { useState, useEffect } from "react";
import TablePage from "./TablePage";

export default function Dashboard() {
  const [databases, setDatabases] = useState([]);
  const [selectedDb, setSelectedDb] = useState(null);
  const [newDb, setNewDb] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Load all DBs of current user
  const loadDatabases = async () => {
    try {
      const res = await fetch("http://localhost:8080/db/list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      setDatabases(json); // backend returns a plain list
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
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="mt-6 p-4 bg-white shadow rounded w-96">
        <h2 className="text-lg font-semibold">Create New Database</h2>

        <input
          type="text"
          className="w-full p-2 border rounded mt-2"
          placeholder="database name"
          value={newDb}
          onChange={(e) => setNewDb(e.target.value)}
        />

        <button
          onClick={createDatabase}
          disabled={loading}
          className="mt-3 bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Creating..." : "Create Database"}
        </button>
      </div>

      <h2 className="text-xl font-semibold mt-6">Your Databases</h2>

      <div className="mt-3 flex gap-3 flex-wrap">
        {databases.map((db) => (
          <button
            key={db.id}
            onClick={() => setSelectedDb(db.databaseName)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {db.databaseName}
          </button>
        ))}

        {databases.length === 0 && (
          <p className="text-gray-600 mt-3">No databases created yet.</p>
        )}
      </div>
    </div>
  );
}
