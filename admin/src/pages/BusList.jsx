import React, { useEffect, useState } from "react";
import axios from "axios";

function BusList() {
  const [buses, setBuses] = useState([]); // ✅ initialized as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/buses");
        setBuses(res.data || []);
      } catch (err) {
        setError("Failed to load buses");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Buses</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && buses.length === 0 && (
        <p>No buses found.</p>
      )}

      <div className="space-y-4">
        {Array.isArray(buses) && buses.map((bus, index) => (
          <div key={index} className="border p-4 rounded shadow">
            <h3 className="font-semibold text-lg">{bus.busName} ({bus.busNumber})</h3>
            <ul className="mt-2 pl-4 list-disc">
              {bus.stoppages && bus.stoppages.map((stop, idx) => (
                <li key={idx}>
                  <strong>{stop.name}</strong> - 🡒 {stop.goingTime}, 🡐 {stop.returnTime}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BusList;
