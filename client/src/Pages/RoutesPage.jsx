import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/bus-routes/unique-routes`)
      .then(res => res.json())
      .then(data => setRoutes(data.routes || []))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        🚌 Available Routes
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {routes.map((route, index) => (
          <div
            key={index}
            className="rounded-2xl shadow-lg border border-purple-100 p-5 rounded-xl shadow "
          >
            <h2 className="text-2xl font-bold text-black">
              {route.from} ➝ {route.to}
            </h2>

            <button
              onClick={() =>
                navigate(`/buses?from=${route.from}&to=${route.to}`)
              }
              className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-700"
            >
              View Buses
            </button>
          </div>



    

        ))}
      </div>
    </div>
  );
};

export default RoutesPage;
