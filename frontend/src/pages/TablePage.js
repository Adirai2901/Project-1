import { useEffect, useState } from "react";

export default function TablePage({ database, onBack }) {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [columns, setColumns] = useState({});
  const [rows, setRows] = useState([]);
  const [insertData, setInsertData] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const loadTables = async () => {
    const res = await fetch(`http://localhost:8080/table/list?db=${database}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (json.success) setTables(json.data);
  };

  const loadRows = async (table) => {
    setSelectedTable(table);

    const res = await fetch(
      `http://localhost:8080/table/rows?db=${database}&table=${table}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const json = await res.json();
    const data = json.success ? json.data : [];

    setRows(data);

    // If table has rows → infer columns from first row
    if (data.length > 0) {
      const first = data[0];
      let obj = {};
      Object.keys(first).forEach((c) => (obj[c] = ""));
      setColumns(obj);
      setInsertData(obj);
      return;
    }

    // If no rows → fetch column names
    const colRes = await fetch(
      `http://localhost:8080/table/columns?db=${database}&table=${table}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const colJson = await colRes.json();

    if (colJson.success) {
      let obj = {};
      colJson.data.forEach((c) => (obj[c] = ""));
      setColumns(obj);
      setInsertData(obj);
    }
  };

  const insertRow = async () => {
    setLoading(true);

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

    const json = await res.json();

    if (json.success) {
      alert("Row added");
      loadRows(selectedTable);
    } else {
      alert(json.message || "Insert failed");
    }

    setLoading(false);
  };

  const deleteRow = async (col, val) => {
    if (!window.confirm("Delete this row?")) return;

    const res = await fetch(
      `http://localhost:8080/table/deleteRow?db=${database}&table=${selectedTable}&col=${col}&val=${val}`,
      { method: "POST", headers: { Authorization: `Bearer ${token}` } }
    );

    const json = await res.json();
    if (json.success) loadRows(selectedTable);
  };

  useEffect(() => {
    loadTables();
  }, []);

  return (
    <div className="p-6">
      <button
        className="bg-red-600 text-white px-4 py-2 rounded mr-3"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}
      >
        Logout
      </button>

      <button
        onClick={onBack}
        className="bg-gray-600 text-white px-4 py-2 rounded"
      >
        Back
      </button>

      <h1 className="text-2xl font-bold mt-4">Database: {database}</h1>

      <h2 className="text-xl mt-4 font-semibold">Tables</h2>

      <div className="mt-3 flex flex-wrap gap-4">
        {tables.map((t) => (
          <button
            key={t}
            onClick={() => loadRows(t)}
            className={`px-4 py-2 rounded border ${
              selectedTable === t ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {selectedTable && (
        <div className="mt-6 p-4 border rounded bg-white shadow">
          <h3 className="text-lg font-bold mb-2">
            Insert Row into {selectedTable}
          </h3>

          {Object.keys(columns).length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(columns).map((col) => (
                <div key={col}>
                  <label className="font-semibold">{col}</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={insertData[col] || ""}
                    onChange={(e) =>
                      setInsertData({ ...insertData, [col]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <p>No columns found</p>
          )}

          <button
            onClick={insertRow}
            disabled={loading}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {loading ? "Saving..." : "Insert Row"}
          </button>
        </div>
      )}

      {rows.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Rows</h3>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                {Object.keys(rows[0]).map((c) => (
                  <th key={c} className="border p-2">
                    {c}
                  </th>
                ))}
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {Object.keys(row).map((c) => (
                    <td key={c} className="border p-2">
                      {row[c]}
                    </td>
                  ))}
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => {
                        const firstCol = Object.keys(row)[0];
                        deleteRow(firstCol, row[firstCol]);
                      }}
                      className="text-red-600 font-bold hover:underline"
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
        <p className="mt-4 text-gray-600">No rows yet.</p>
      )}
    </div>
  );
}
