import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const BusesPage = () => {
  const [searchParams] = useSearchParams();
  const [buses, setBuses] = useState([]);

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  useEffect(() => {
    fetch(
      `${API_URL}/api/buses/search?from=${from}&to=${to}`
    )
      .then(res => res.json())
      .then(data => setBuses(data.buses || []))
      .catch(err => console.error(err));
  }, [from, to]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        🚌 Buses from {from} to {to}
      </h1>

      {buses.length === 0 && (
        <p className="text-center">No buses available</p>
      )}

      <div className="space-y-4 max-w-4xl mx-auto">
        {buses.map(bus => (
          <div
            key={bus._id}
            className="bg-white p-5 rounded-xl shadow"
          >
            <h2 className="text-xl font-semibold">
              {bus.busName}
            </h2>
            <p>Bus Number: {bus.busNumber}</p>
            <p>Type: {bus.busType}</p>
            <p className="font-bold">Fare: ₹{bus.fare}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusesPage;
