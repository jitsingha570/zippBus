import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BusCard from "./busCard";

const API_URL = import.meta.env.VITE_API_URL;

const BusesPage = () => {
  const [searchParams] = useSearchParams();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  useEffect(() => {
    if (!from || !to) {
      setError("Missing route parameters");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setBuses([]);

    fetch(`${API_URL}/api/buses/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch buses');
        return res.json();
      })
      .then(data => {
        console.log('Fetched buses:', data);
        
        // Handle both response formats: {buses: []} or direct array
        const busesArray = data.buses || data || [];
        
        // Transform to match BusCard expected structure
        const transformedBuses = busesArray.map(bus => ({
          ...bus,
          route: {
            from: from,
            to: to,
            stoppages: bus.route?.stoppages || bus.stoppages || []
          }
        }));
        
        setBuses(transformedBuses);
        
        if (transformedBuses.length === 0) {
          setError('No buses found for this route');
        }
      })
      .catch(err => {
        console.error('Error fetching buses:', err);
        setError('Unable to load buses. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, [from, to]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          🚌 Available Buses
        </h1>
        <p className="text-center text-gray-600 mb-8">
          From <span className="font-semibold text-purple-700 capitalize">{from}</span> to <span className="font-semibold text-purple-700 capitalize">{to}</span>
        </p>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!loading && !error && buses.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 text-lg">No buses available for this route</p>
          </div>
        )}

        <div className="space-y-6">
          {buses.map((bus, index) => (
            <BusCard key={bus._id || index} bus={bus} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusesPage;