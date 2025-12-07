import React, { useEffect, useState } from "react";

export default function TablePage({ database, onBack }) {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [columns, setColumns] = useState({});
  const [rows, setRows] = useState([]);
  const [insertData, setInsertData] = useState({});
  const [loading, setLoading] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const [newColumns, setNewColumns] = useState([{ name: "", type: "string" }]);

  const token = localStorage.getItem("token");

  // ----------- LOAD TABLES -----------
  const loadTables = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/table/list?db=${database}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await res.json().catch(() => null);
      if (json && json.data) setTables(json.data);
    } catch {}
  };

  useEffect(() => {
    loadTables();
  }, []);

  // ----------- LOAD ROWS -----------
  const loadRows = async (table) => {
    setSelectedTable(table);

    try {
      const res = await fetch(
        `http://localhost:8080/table/rows?db=${database}&table=${table}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await res.json().catch(() => null);

      if (json && json.data) {
        setRows(json.data);

        if (json.data.length > 0) {
          let obj = {};
          Object.keys(json.data[0]).forEach((c) => (obj[c] = ""));
          setColumns(obj);
          setInsertData(obj);
        } else {
          setColumns({});
          setInsertData({});
        }
      }
    } catch {}
  };

  // ----------- INSERT ROW -----------
  const insertRow = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8080/table/insert?db=${database}&table=${selectedTable}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(insertData),
        }
      );

      const json = await res.json().catch(() => null);

      if (json && json.success) {
        alert("Row added");
        loadRows(selectedTable);
      } else {
        alert(json?.message || "Insert failed");
      }
    } catch {
      alert("Backend error");
    }

    setLoading(false);
  };

  // ----------- DELETE ROW -----------
  const deleteRow = async (col, val) => {
    if (!window.confirm("Delete this row?")) return;

    try {
      const res = await fetch(
        `http://localhost:8080/table/deleteRow?db=${database}&table=${selectedTable}&col=${col}&val=${val}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const json = await res.json().catch(() => null);

      if (json && json.success) {
        loadRows(selectedTable);
      } else {
        alert(json?.message || "Delete failed");
      }
    } catch {
      alert("Error deleting row");
    }
  };

  // ----------- CREATE TABLE ----------
  const createTable = async () => {
    if (!newTableName.trim()) {
      alert("Enter table name");
      return;
    }

    let colObj = {};
    for (let c of newColumns) {
      if (!c.name.trim()) {
        alert("Column cannot be empty");
        return;
      }
      colObj[c.name] = c.type;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/table/create?db=${database}&table=${newTableName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(colObj),
        }
      );

      const json = await res.json().catch(() => null);

      if (json && json.success) {
        alert("Table created");
        setShowCreate(false);
        setNewTableName("");
        setNewColumns([{ name: "", type: "string" }]);
        loadTables();
      } else {
        alert(json?.message || "Failed");
      }
    } catch {
      alert("Server error");
    }
  };

  // -----------------------------------------------------
  //                      UI START
  // -----------------------------------------------------

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white">

      {/* LEFT SIDEBAR */}
      <div className="w-72 backdrop-blur-xl bg-white/10 border-r border-white/10 p-6 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Tables</h2>

        {/* CREATE TABLE BUTTON */}
        <button
          onClick={() => {
            setShowCreate(true);
            setNewTableName("");
            setNewColumns([{ name: "", type: "string" }]);
          }}
          className="w-full mb-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg"
        >
          + Create Table
        </button>

        {/* TABLE LIST */}
        <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
          {tables.map((t) => (
            <button
              key={t}
              onClick={() => loadRows(t)}
              className={`px-4 py-2 rounded-lg text-left transition ${
                selectedTable === t
                  ? "bg-blue-600 text-white"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {t}
            </button>
          ))}

          {tables.length === 0 && (
            <p className="text-gray-400 mt-3">No tables available.</p>
          )}
        </div>

        {/* BACK + LOGOUT */}
        <button
          onClick={onBack}
          className="mt-4 w-full py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
        >
          Back
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
          className="mt-3 w-full py-2 rounded-lg bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* RIGHT MAIN PANEL */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold">Database: {database}</h1>

        {!selectedTable && (
          <p className="mt-6 text-gray-300">Select a table from the left.</p>
        )}

        {/* INSERT ROW FORM */}
        {selectedTable && (
          <div className="mt-6 bg-white/10 backdrop-blur-lg p-6 rounded-lg border border-white/10">
            <h3 className="text-xl font-bold mb-3">
              Insert into {selectedTable}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {Object.keys(columns).map((c) => (
                <div key={c}>
                  <label className="font-semibold">{c}</label>
                  <input
                    value={insertData[c] || ""}
                    onChange={(e) =>
                      setInsertData({ ...insertData, [c]: e.target.value })
                    }
                    className="w-full p-2 mt-1 bg-white/20 rounded text-white"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={insertRow}
              disabled={loading}
              className="mt-4 bg-green-600 hover:bg-green-500 px-4 py-2 rounded"
            >
              {loading ? "Saving..." : "Insert Row"}
            </button>
          </div>
        )}

        {/* TABLE ROWS */}
        {rows.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border border-white/10">
              <thead>
                <tr className="bg-white/10">
                  {Object.keys(rows[0]).map((c) => (
                    <th key={c} className="p-3 border border-white/10">
                      {c}
                    </th>
                  ))}
                  <th className="p-3 border border-white/10">Actions</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    {Object.keys(r).map((c) => (
                      <td key={c} className="p-3 border border-white/10">
                        {r[c]}
                      </td>
                    ))}
                    <td className="p-3 border border-white/10 text-center">
                      <button
                        onClick={() => {
                          const first = Object.keys(r)[0];
                          deleteRow(first, r[first]);
                        }}
                        className="text-red-400 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedTable && rows.length === 0 && (
          <p className="mt-4 text-gray-400">No rows yet.</p>
        )}
      </div>


      {/* CREATE TABLE MODAL */}
      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="w-[420px] bg-[#1e1e1e] p-6 rounded-xl shadow-xl">

            <h2 className="text-xl font-semibold text-white mb-4">
              Create Table
            </h2>

            {/* TABLE NAME */}
            <input
              type="text"
              placeholder="Table name"
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              className="w-full p-3 rounded bg-[#3a3a3a] text-white outline-none border border-gray-600"
            />

            {/* COLUMNS SECTION */}
            <div className="mt-4 space-y-3">
              {newColumns.map((col, index) => (
                <div key={index} className="flex gap-3">

                  {/* Column Name */}
                  <input
                    type="text"
                    placeholder="column name"
                    value={col.name}
                    onChange={(e) => {
                      const updated = [...newColumns];
                      updated[index].name = e.target.value;
                      setNewColumns(updated);
                    }}
                    className="flex-1 p-3 rounded bg-[#3a3a3a] text-white outline-none border border-gray-600"
                  />

                  {/* Column Type Dropdown */}
                  <select
                    value={col.type}
                    onChange={(e) => {
                      const updated = [...newColumns];
                      updated[index].type = e.target.value;
                      setNewColumns(updated);
                    }}
                    className="p-3 rounded bg-[#3a3a3a] text-white border border-gray-600 outline-none"
                  >
                    <option value="string" className="bg-[#1e1e1e] text-white">string</option>
                    <option value="int" className="bg-[#1e1e1e] text-white">int</option>
                    <option value="long" className="bg-[#1e1e1e] text-white">long</option>
                    <option value="boolean" className="bg-[#1e1e1e] text-white">boolean</option>
                    <option value="text" className="bg-[#1e1e1e] text-white">text</option>
                    <option value="date" className="bg-[#1e1e1e] text-white">date</option>
                  </select>
                </div>
              ))}
            </div>

            {/* ADD COLUMN */}
            <button
              onClick={() =>
                setNewColumns([...newColumns, { name: "", type: "string" }])
              }
              className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              + Add Column
            </button>

            {/* ACTION BUTTONS */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={createTable}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
