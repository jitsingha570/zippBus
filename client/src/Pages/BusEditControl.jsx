import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function BusEditControl({ busId }) {
  const [bus, setBus] = useState(null);
  const [newStop, setNewStop] = useState({
    name: "",
    order: "",
    goingTime: "",
    returnTime: ""
  });
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  const fetchBus = async () => {
    try {
      const res = await fetch(`${API}/api/buses/${busId}`, { headers });
      const data = await res.json();
      setBus(data.bus);
    } catch (error) {
      console.error("Error fetching bus:", error);
      setMessage("Failed to load bus data");
    }
  };

  useEffect(() => {
    fetchBus();
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const addStoppage = async () => {
    try {
      await fetch(`${API}/api/buses/${busId}/stoppages`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          type: "ADD",
          data: newStop
        })
      });
      setNewStop({ name: "", order: "", goingTime: "", returnTime: "" });
      showMessage("Edit request submitted for new stoppage");
      fetchBus();
    } catch (error) {
      console.error("Error adding stoppage:", error);
      showMessage("Failed to submit edit request");
    }
  };

  const updateStoppage = async (sid, data) => {
    try {
      await fetch(`${API}/api/buses/${busId}/stoppages/${sid}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ data })
      });
      showMessage("Edit request submitted for update");
      fetchBus();
    } catch (error) {
      console.error("Error updating stoppage:", error);
      showMessage("Failed to submit edit request");
    }
  };

  const deleteStoppage = async (sid) => {
    if (!confirm("Submit delete request for this stoppage?")) return;
    try {
      await fetch(`${API}/api/buses/${busId}/stoppages/${sid}`, {
        method: "DELETE",
        headers
      });
      showMessage("Edit request submitted for deletion");
      fetchBus();
    } catch (error) {
      console.error("Error deleting stoppage:", error);
      showMessage("Failed to submit edit request");
    }
  };

  if (!bus) return <p className="text-center p-8">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        🚌 {bus.busName} ({bus.busNumber})
      </h2>

      {/* Message notification */}
      {message && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}

      {/* ADD */}
      <div className="bg-white p-4 rounded mb-6 shadow">
        <h3 className="font-semibold mb-2">Add Stoppage (Submit Edit Request)</h3>
        <div className="grid grid-cols-4 gap-2">
          {Object.keys(newStop).map(key => (
            <input
              key={key}
              placeholder={key}
              value={newStop[key]}
              onChange={e =>
                setNewStop({ ...newStop, [key]: e.target.value })
              }
              className="border p-2 rounded"
            />
          ))}
        </div>
        <button
          onClick={addStoppage}
          className="mt-3 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Submit Add Request
        </button>
      </div>

      {/* LIST */}
      <div className="bg-white rounded shadow overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <p className="text-sm text-gray-600">
            ℹ️ Changes create edit requests that require admin approval
          </p>
        </div>
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Order</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Going</th>
              <th className="p-3 text-left">Return</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {bus.stoppages.map((s, index) => (
              <tr key={s._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-3">{s.order}</td>
                <td className="p-3">
                  <input
                    value={s.name}
                    onChange={e =>
                      updateStoppage(s._id, { name: e.target.value })
                    }
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="p-3">
                  <input
                    value={s.goingTime}
                    onChange={e =>
                      updateStoppage(s._id, { goingTime: e.target.value })
                    }
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="p-3">
                  <input
                    value={s.returnTime}
                    onChange={e =>
                      updateStoppage(s._id, { returnTime: e.target.value })
                    }
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="p-3">
                  <button
                    onClick={() => deleteStoppage(s._id)}
                    className="text-red-600 hover:text-red-800 font-bold"
                    title="Submit delete request"
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}