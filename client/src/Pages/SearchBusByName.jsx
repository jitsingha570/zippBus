import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SearchBusByName() {
  const [query, setQuery] = useState("");
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter bus name or number");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setBuses([]);

      const res = await axios.get(
        `${API_URL}/api/buses/search-by-name-or-number?q=${query}`
      );

      if (res.data.success) {
        setBuses(res.data.buses);
        if (res.data.buses.length === 0) {
          setError("No buses found");
        }
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-3">
        Search Bus by Name or Number
      </h2>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter bus name or number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={handleSearch}
          className="bg-purple-600 text-white px-4 rounded"
        >
          Search
        </button>
      </div>

      {loading && <p className="mt-3 text-gray-500">Searching...</p>}
      {error && <p className="mt-3 text-red-500">{error}</p>}

      <div className="mt-4 space-y-3">
        {buses.map((bus) => (
          <div
            key={bus._id}
            className="border rounded p-3 shadow-sm"
          >
            <h3 className="font-semibold text-lg">
              {bus.busName}
            </h3>
            <p className="text-sm text-gray-600">
              Bus No: {bus.busNumber}
            </p>
            <p className="text-sm text-gray-600">
              Type: {bus.busType || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              Capacity: {bus.capacity || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}