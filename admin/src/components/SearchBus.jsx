import React, { useState } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
function SearchBus() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const fromQuery = from.trim().toLowerCase();
    const toQuery = to.trim().toLowerCase();

    if (!fromQuery || !toQuery) {
      setError("Please enter both 'From' and 'To' locations.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.get(
        `${API_URL}/api/buses/search?from=${fromQuery}&to=${toQuery}`
      );
      setResults(res.data);
      setError('');
    } catch (err) {
      console.error("Error fetching buses:", err);
      setResults([]);
      setError('No buses found or something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwapLocations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const clearSearch = () => {
    setFrom('');
    setTo('');
    setResults([]);
    setError('');
  };

  return (
    <div className="w-full space-y-6">
      {/* Search Box */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6">
        <div className="space-y-4">
          {/* From Input */}
          <div className="relative">
            <label className="block text-sm font-semibold text-purple-700 mb-2">
              From
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter departure city"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 text-gray-700 placeholder-gray-400"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwapLocations}
              className="p-3 bg-purple-100 hover:bg-purple-200 rounded-full transition-all duration-300 hover:scale-110 group"
              title="Swap locations"
            >
              <svg className="w-5 h-5 text-purple-600 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* To Input */}
          <div className="relative">
            <label className="block text-sm font-semibold text-purple-700 mb-2">
              To
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter destination city"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 text-gray-700 placeholder-gray-400"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Find Bus</span>
                </>
              )}
            </button>

            <button
              onClick={clearSearch}
              className="px-6 py-3 border-2 border-purple-200 text-purple-600 rounded-xl hover:bg-purple-50 transition-all duration-300 font-semibold flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-2">
              Available Buses
            </h3>
            <p className="text-gray-600">
              Found {results.length} bus{results.length > 1 ? 'es' : ''} for your journey
            </p>
          </div>

          <div className="space-y-4">
            {results.map((bus, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                {/* Bus Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h4 className="text-xl font-bold mb-1">
                        {bus.busName}
                      </h4>
                      <p className="text-purple-200 text-sm">
                        Bus No: {bus.busNumber} • <span className="capitalize">{bus.direction}</span> direction
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Available
                      </span>
                    </div>
                  </div>
                </div>

                {/* Route Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6 p-4 bg-purple-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 font-medium">From</p>
                      <p className="text-lg font-bold text-gray-800 capitalize">{bus.from.name}</p>
                      <p className="text-sm text-purple-600 font-medium">{bus.from.time}</p>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center mx-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                        <div className="flex-1 h-0.5 bg-purple-200"></div>
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                        <div className="flex-1 h-0.5 bg-purple-200"></div>
                        <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-500 font-medium">To</p>
                      <p className="text-lg font-bold text-gray-800 capitalize">{bus.to.name}</p>
                      <p className="text-sm text-purple-600 font-medium">{bus.to.time}</p>
                    </div>
                  </div>

                  {/* Stoppages */}
                  {bus.fullStoppages && bus.fullStoppages.length > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        All Stops
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {bus.fullStoppages.map((stop, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-800 capitalize text-sm">{stop.name}</span>
                            <div className="flex items-center space-x-3 text-xs text-gray-600">
                              <span className="flex items-center">
                                <span className="text-green-600">🡒</span>
                                <span className="ml-1">{stop.goingTime}</span>
                              </span>
                              <span className="flex items-center">
                                <span className="text-orange-600">🡐</span>
                                <span className="ml-1">{stop.returnTime}</span>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Book Button */}
                  <div className="mt-6 text-center">
                    <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg">
                      Book This Bus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBus;