import React, { useState } from 'react';
import axios from 'axios';

function SearchBus() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    const fromQuery = from.trim().toLowerCase();
    const toQuery = to.trim().toLowerCase();

    if (!fromQuery || !toQuery) {
      alert("Please enter both 'From' and 'To' locations.");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/buses/search?from=${fromQuery}&to=${toQuery}`
      );
      setResults(res.data);
      setError('');
    } catch (err) {
      console.error("Error fetching buses:", err);
      setResults([]);
      setError('No buses found or something went wrong.');
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start py-10 bg-gray-100">
      {/* Search Box */}
      <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg w-[90%] max-w-md space-y-4">
        <input
          type="text"
          placeholder="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSearch}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
        >
          Find Bus
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-6 text-red-600 font-medium text-center">{error}</p>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-8 w-full max-w-2xl space-y-4">
          <h3 className="text-xl font-semibold text-center text-blue-700">Available Buses</h3>
          {results.map((bus, index) => (
            <div key={index} className="bg-white p-4 rounded-md shadow-md">
              <h4 className="text-lg font-bold text-gray-800">
                {bus.busName} ({bus.busNumber}) — 
                <span className="ml-2 text-sm font-medium text-gray-500 capitalize">
                  {bus.direction} direction
                </span>
              </h4>

              <div className="mt-2 text-gray-700 text-sm">
                <p>
                  <strong className="capitalize">{bus.from.name}</strong> at <span>{bus.from.time}</span> 🡒
                  <strong className="ml-2 capitalize">{bus.to.name}</strong> at <span>{bus.to.time}</span>
                </p>
              </div>

              <ul className="text-xs mt-2 space-y-1 text-gray-600">
                {bus.fullStoppages?.map((stop, i) => (
                  <li key={i}>
                    <span className="font-medium capitalize">{stop.name}</span> —
                    🡒 <span>{stop.goingTime}</span>, 🡐 <span>{stop.returnTime}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBus;
