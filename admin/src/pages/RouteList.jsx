import React, { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function RouteList() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        setError("");

        // ✅ Get admin token
        const token = localStorage.getItem("adminToken");
        if (!token) {
          setError("Admin not logged in");
          setLoading(false);
          return;
        }

        // ✅ Fetch buses (with token) to extract routes
        const res = await axios.get(`${API_URL}/api/buses/routes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const buses = Array.isArray(res.data.payload) ? res.data.payload : [];

        // ✅ Create unique routes
        const uniqueRoutes = new Set();
        buses.forEach((bus) => {
          if (bus.stoppages?.length > 0) {
            const route = bus.stoppages.map((stop) => stop.name).join(" > ");
            uniqueRoutes.add(route);
          }
        });

        setRoutes([...uniqueRoutes]);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.response?.data?.message || "Failed to load routes");
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-700 font-semibold">
        Loading routes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">{error}</div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600 font-medium">
        No routes found.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Routes</h2>
      <ul className="space-y-2">
        {routes.map((route, i) => (
          <li
            key={i}
            className="bg-white p-3 rounded shadow hover:shadow-md transition"
          >
            {route}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RouteList;
