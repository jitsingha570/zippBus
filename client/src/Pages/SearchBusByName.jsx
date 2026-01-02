import { useState } from "react";

const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000";

export default function SearchBusByName() {
  const [query, setQuery] = useState("");
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedBusId, setExpandedBusId] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter bus name or number");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setBuses([]);
      setHasSearched(true);
      
      const res = await fetch(
        `${API_URL}/api/buses/search-by-name-or-number?q=${query}`
      );
      const data = await res.json();
      
      if (data.success) {
        setBuses(data.buses);
        if (data.buses.length === 0) {
          setError("No buses found");
        }
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const toggleDetails = (busId) => {
    setExpandedBusId(expandedBusId === busId ? null : busId);
  };

  const clearSearch = () => {
    setQuery("");
    setBuses([]);
    setError("");
    setExpandedBusId(null);
    setHasSearched(false);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-700 mb-2">Search Bus</h1>
          <p className="text-gray-600">Find buses by name or registration number</p>
        </div>

        {/* Search Box */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Enter bus name or number (e.g., WB55B6704)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 text-gray-700 placeholder-gray-400"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="flex-1 md:flex-none bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
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
                    <span>Search</span>
                  </>
                )}
              </button>

              {(query || buses.length > 0) && (
                <button
                  onClick={clearSearch}
                  className="flex-1 md:flex-none px-6 py-3 border-2 border-purple-200 text-purple-600 rounded-xl hover:bg-purple-50 transition-all duration-300 font-semibold flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
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

        {/* Results Count */}
        {buses.length > 0 && (
          <div className="text-center">
            <p className="text-gray-600 font-medium">
              Found {buses.length} bus{buses.length > 1 ? 'es' : ''}
            </p>
          </div>
        )}

        {/* Bus Results */}
        <div className="grid gap-4">
          {buses.map((bus) => {
            const stoppages = bus.route?.stoppages || [];
            const routeFrom = bus.route?.from || 'N/A';
            const routeTo = bus.route?.to || 'N/A';
            const isExpanded = expandedBusId === bus._id;

            return (
              <div key={bus._id} className="bg-white rounded-xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Compact Bus Card */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Bus Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                          {bus.busName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-800 mb-1">
                            {bus.busName}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              {bus.busNumber}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span>{bus.busType || 'Standard'}</span>
                            <span className="text-gray-400">•</span>
                            <span>{bus.capacity || 'N/A'} seats</span>
                          </div>
                          {routeFrom !== 'N/A' && routeTo !== 'N/A' && (
                            <div className="mt-2 flex items-center text-sm">
                              <span className="font-medium text-purple-700 capitalize">{routeFrom}</span>
                              <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                              <span className="font-medium text-purple-700 capitalize">{routeTo}</span>
                              <span className="ml-3 text-gray-500">({stoppages.length} stops)</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => toggleDetails(bus._id)}
                      className="px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-300 font-semibold flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                    </button>
                  </div>

                  {/* Amenities Quick View */}
                  {bus.amenities && bus.amenities.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex flex-wrap gap-2">
                        {bus.amenities.slice(0, 5).map((amenity, i) => (
                          <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium border border-green-200">
                            ✓ {amenity}
                          </span>
                        ))}
                        {bus.amenities.length > 5 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                            +{bus.amenities.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    <div className="p-6">
                      {/* Route Display */}
                      {routeFrom !== 'N/A' && routeTo !== 'N/A' && (
                        <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                          <div className="flex items-center justify-center space-x-4">
                            <div className="text-center">
                              <div className="text-xs text-gray-500 uppercase mb-1">From</div>
                              <div className="text-lg font-bold text-purple-700 capitalize">{routeFrom}</div>
                            </div>
                            <div className="flex-shrink-0">
                              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500 uppercase mb-1">To</div>
                              <div className="text-lg font-bold text-purple-700 capitalize">{routeTo}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Contact Information */}
                      {(bus.contactNumber1 || bus.contactNumber2) && (
                        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Contact Information
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {bus.contactNumber1 && (
                              <a
                                href={`tel:${bus.contactNumber1}`}
                                className="flex items-center bg-white p-3 rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all duration-300 group"
                              >
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500">Primary Contact</div>
                                  <div className="text-sm font-semibold text-gray-800">{bus.contactNumber1}</div>
                                </div>
                              </a>
                            )}
                            {bus.contactNumber2 && (
                              <a
                                href={`tel:${bus.contactNumber2}`}
                                className="flex items-center bg-white p-3 rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all duration-300 group"
                              >
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500">Secondary Contact</div>
                                  <div className="text-sm font-semibold text-gray-800">{bus.contactNumber2}</div>
                                </div>
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Detailed Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                          <div className="text-xs text-gray-600 mb-1">Total Stops</div>
                          <div className="text-xl font-bold text-purple-700">{stoppages.length || 0}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                          <div className="text-xs text-gray-600 mb-1">Capacity</div>
                          <div className="text-xl font-bold text-purple-700">{bus.capacity || 'N/A'}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                          <div className="text-xs text-gray-600 mb-1">Bus Type</div>
                          <div className="text-sm font-bold text-purple-700">{bus.busType || 'Standard'}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                          <div className="text-xs text-gray-600 mb-1">Amenities</div>
                          <div className="text-xl font-bold text-purple-700">{bus.amenities?.length || 0}</div>
                        </div>
                      </div>

                      {/* All Amenities */}
                      {bus.amenities && bus.amenities.length > 0 && (
                        <div className="mb-6">
                          <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            All Amenities
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {bus.amenities.map((amenity, i) => (
                              <span key={i} className="px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-lg font-medium border border-green-200">
                                ✓ {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Stoppages */}
                      {stoppages.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            Complete Stoppage Schedule
                          </h5>
                          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Order</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Stop Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Going Time</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Return Time</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {stoppages.map((stop, i) => (
                                    <tr key={i} className="hover:bg-purple-50 transition-colors duration-150">
                                      <td className="px-4 py-3 text-sm font-medium text-gray-600">
                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold bg-purple-100 text-purple-700">
                                          {stop.order || i + 1}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 text-sm font-semibold text-gray-800 capitalize">{stop.name || 'N/A'}</td>
                                      <td className="px-4 py-3 text-sm text-gray-600">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 border-2 border-green-400">
                                          <svg className="w-3 h-3 mr-1.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                          </svg>
                                          <span className="font-bold text-green-700">{stop.goingTime || 'N/A'}</span>
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-600">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 border-2 border-orange-400">
                                          <svg className="w-3 h-3 mr-1.5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                                          </svg>
                                          <span className="font-bold text-orange-700">{stop.returnTime || 'N/A'}</span>
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State - Only show after search */}
        {!loading && buses.length === 0 && !error && hasSearched && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-purple-100">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Results Found</h3>
            <p className="text-gray-500">Try searching with a different bus name or number</p>
          </div>
        )}
      </div>
    </div>
  );
}