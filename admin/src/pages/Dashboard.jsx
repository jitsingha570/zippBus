import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBus from "../components/SearchBus";

function Dashboard() {
  const [busCount, setBusCount] = useState(0);
  const [routeCount, setRouteCount] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      try {
        const busesRes = await axios.get("http://localhost:5000/api/buses");
        setBusCount(busesRes.data.length);

        const routesSet = new Set();
        busesRes.data.forEach(bus => {
          const route = bus.stoppages.map(stop => stop.name.toLowerCase()).join(" > ");
          routesSet.add(route);
        });
        setRouteCount(routesSet.size);
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md p-4 rounded">
          <h3 className="text-lg font-medium">Total Buses</h3>
          <p className="text-3xl font-bold text-blue-600">{busCount}</p>
        </div>
        <div className="bg-white shadow-md p-4 rounded">
          <h3 className="text-lg font-medium">Unique Routes</h3>
          <p className="text-3xl font-bold text-green-600">{routeCount}</p>
        </div>
        <div className="bg-white shadow-md p-4 rounded">
          <h3 className="text-lg font-medium">Admin Info</h3>
          <p>Manage buses and routes easily</p>
        </div>
      </div>
      <SearchBus/>
    </div>
  );
}

export default Dashboard;
