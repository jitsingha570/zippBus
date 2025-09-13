import React, { useEffect, useState } from "react";
import axios from "axios";

function RouteList() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/routes")
      .then(res => {
        const uniqueRoutes = new Set();
        res.data.forEach(bus => {
          const route = bus.stoppages.map(stop => stop.name).join(" > ");
          uniqueRoutes.add(route);
        });
        setRoutes([...uniqueRoutes]);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Routes</h2>
      <ul className="space-y-2">
        {routes.map((route, i) => (
          <li key={i} className="bg-white p-3 rounded shadow">
            {route}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RouteList;

