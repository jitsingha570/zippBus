import React, { useEffect, useState } from "react";
import axios from "axios";

function BusList() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        setError("");

        // ✅ Get admin token from localStorage
        const token = localStorage.getItem("adminToken");
        if (!token) {
          setError("Admin not logged in");
          return;
        }

        // ✅ Fetch buses with token in headers
        const res = await axios.get("http://localhost:5000/api/buses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ Extract payload safely
        setBuses(Array.isArray(res.data.payload) ? res.data.payload : []);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.response?.data?.message || "Failed to load buses");
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-700 font-semibold">
        Loading buses...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 font-semibold">{error}</div>
    );
  }

  if (buses.length === 0) {
    return (
      <div className="p-4 text-center text-gray-600 font-medium">
        No buses found.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Buses</h2>
      <div className="space-y-4">
        {buses.map((bus) => (
          <div key={bus._id} className="border p-4 rounded shadow hover:shadow-md transition">
            <h3 className="font-semibold text-lg mb-2">
              {bus.busName} ({bus.busNumber})
            </h3>

            {bus.stoppages?.length > 0 ? (
              <ul className="pl-4 list-disc space-y-1">
                {bus.stoppages.map((stop, idx) => (
                  <li key={idx}>
                    <span className="font-semibold">{stop.name}</span> — 
                    🡒 {stop.goingTime || "N/A"}, 🡐 {stop.returnTime || "N/A"}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No stoppages available.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BusList;
