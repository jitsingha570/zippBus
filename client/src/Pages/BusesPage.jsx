import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const BusesPage = () => {
  const [searchParams] = useSearchParams();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBusId, setExpandedBusId] = useState(null);

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/buses/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch buses');
        return res.json();
      })
      .then(data => {
        console.log('Fetched buses:', data); // Debug log
        setBuses(data.buses || []);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching buses:', err);
        setError('Unable to load buses. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, [from, to]);

  const toggleStoppageDetails = (busId) => {
    setExpandedBusId(expandedBusId === busId ? null : busId);
  };

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
          {buses.map((bus, index) => {
            const isExpanded = expandedBusId === bus._id;
            const stoppages = Array.isArray(bus.stoppages) ? bus.stoppages : [];
            const routeFrom = from || 'N/A';
            const routeTo = to || 'N/A';
            
            console.log(`Bus ${bus.busName} stoppages:`, stoppages); // Debug log
            
            // Find departure and arrival info
            const departureInfo = stoppages.find(stop => 
              stop.name?.toLowerCase().trim() === routeFrom.toLowerCase().trim()
            );
            
            const arrivalInfo = stoppages.find(stop => 
              stop.name?.toLowerCase().trim() === routeTo.toLowerCase().trim()
            );

            return (
              <div key={bus._id || index} className="bg-white rounded-xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Compact Bus Card */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Bus Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                          {bus.busName?.charAt(0) || 'B'}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-800 mb-1">
                            {bus.busName || 'Unknown Bus'}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              {bus.busNumber || 'N/A'}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span>{bus.busType || 'Non-AC Seater'}</span>
                            <span className="text-gray-400">•</span>
                            <span>{bus.capacity || 40} seats</span>
                          </div>
                          <div className="mt-2 flex items-center text-sm flex-wrap gap-2">
                            <span className="font-medium text-purple-700 capitalize">{routeFrom}</span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            <span className="font-medium text-purple-700 capitalize">{routeTo}</span>
                            <span className="text-gray-500">({stoppages.length} stops)</span>
                          </div>
                          {/* Departure and Arrival Times */}
                          <div className="mt-2 flex flex-wrap gap-3">
                            {departureInfo && departureInfo.goingTime && (
                              <div className="text-sm font-semibold text-green-600 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Departs: {departureInfo.goingTime}
                              </div>
                            )}
                            {arrivalInfo && arrivalInfo.goingTime && (
                              <div className="text-sm font-semibold text-blue-600 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Arrives: {arrivalInfo.goingTime}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fare and Actions */}
                    <div className="flex flex-col md:items-end gap-3">
                      <div className="text-center md:text-right">
                        <div className="text-sm text-gray-600">Base Fare</div>
                        <div className="text-3xl font-bold text-purple-700">₹{/*bus.fare || 100*/}</div>
                      </div>
                      <button 
                        onClick={() => toggleStoppageDetails(bus._id)}
                        className="px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-300 font-semibold flex items-center justify-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Amenities Quick View */}
                  {bus.amenities && Array.isArray(bus.amenities) && bus.amenities.length > 0 && (
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

                  {/* Contact Info Preview */}
                  {(bus.contactNumber1 || bus.contactNumber2) && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex flex-wrap gap-3">
                        {bus.contactNumber1 && (
                          <a 
                            href={`tel:${bus.contactNumber1}`}
                            className="flex items-center gap-2 text-sm text-purple-700 hover:text-purple-900 font-medium"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {bus.contactNumber1}
                          </a>
                        )}
                        {bus.contactNumber2 && (
                          <a 
                            href={`tel:${bus.contactNumber2}`}
                            className="flex items-center gap-2 text-sm text-purple-700 hover:text-purple-900 font-medium"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {bus.contactNumber2}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    <div className="p-6">
                      {/* Full Route Display */}
                      <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                        <div className="flex items-center justify-center space-x-4">
                          <div className="text-center">
                            <div className="text-xs text-gray-500 uppercase mb-1">From</div>
                            <div className="text-lg font-bold text-purple-700 capitalize">{routeFrom}</div>
                            {departureInfo && departureInfo.goingTime && (
                              <div className="text-sm text-green-600 font-semibold mt-1">{departureInfo.goingTime}</div>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500 uppercase mb-1">To</div>
                            <div className="text-lg font-bold text-purple-700 capitalize">{routeTo}</div>
                            {arrivalInfo && arrivalInfo.goingTime && (
                              <div className="text-sm text-blue-600 font-semibold mt-1">{arrivalInfo.goingTime}</div>
                            )}
                          </div>
                        </div>
                      </div>

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
                          <div className="text-xs text-gray-600 mb-1">Base Fare</div>
                          <div className="text-xl font-bold text-purple-700">₹{/*{bus.fare || 100}*/}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                          <div className="text-xs text-gray-600 mb-1">Total Stops</div>
                          <div className="text-xl font-bold text-purple-700">{stoppages.length || 0}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                          <div className="text-xs text-gray-600 mb-1">Capacity</div>
                          <div className="text-xl font-bold text-purple-700">{bus.capacity || 40}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                          <div className="text-xs text-gray-600 mb-1">Bus Type</div>
                          <div className="text-sm font-bold text-purple-700">{bus.busType || 'Non-AC Seater'}</div>
                        </div>
                      </div>

                      {/* All Amenities */}
                      {bus.amenities && Array.isArray(bus.amenities) && bus.amenities.length > 0 && (
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

                      {/* Stoppages Table */}
                      {stoppages.length > 0 ? (
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            Complete Stoppage Schedule ({stoppages.length} stops)
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
                                  {stoppages
                                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                                    .map((stop, i) => (
                                    <tr key={i} className="hover:bg-purple-50 transition-colors duration-150">
                                      <td className="px-4 py-3 text-sm font-medium text-gray-600">
                                        <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-700 rounded-full font-bold">
                                          {stop.order || i + 1}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 text-sm font-semibold text-gray-800 capitalize">
                                        {stop.name || 'N/A'}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-600">
                                        <span className="inline-flex items-center bg-green-50 px-3 py-1 rounded-full">
                                          <svg className="w-3 h-3 mr-1.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                          </svg>
                                          <span className="font-medium text-green-700">{stop.goingTime || 'N/A'}</span>
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-600">
                                        <span className="inline-flex items-center bg-orange-50 px-3 py-1 rounded-full">
                                          <svg className="w-3 h-3 mr-1.5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                                          </svg>
                                          <span className="font-medium text-orange-700">{stop.returnTime || 'N/A'}</span>
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500 bg-white rounded-lg border border-gray-200">
                          <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="font-medium">No stoppage data available</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BusesPage;