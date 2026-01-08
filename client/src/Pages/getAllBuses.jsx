import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AllBuses() {
  const [buses, setBuses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const busesPerPage = 5;

  useEffect(() => {
    fetchAllBuses();
  }, []);

  const fetchAllBuses = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/buses`);
      const data = await response.json();

      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to load buses");
      }

      let busesData = data?.success ? data.data || [] : data || [];

      if (!Array.isArray(busesData)) {
        busesData = [];
      }

      busesData = busesData.sort((a, b) =>
        (a.busName || "").localeCompare(b.busName || "")
      );

      setBuses(busesData);

      if (busesData.length === 0) {
        setError("No buses available at the moment");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load buses");
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  const getDepartureTime = (stoppages, from) => {
    if (!stoppages || stoppages.length === 0) return null;

    const fromStop = stoppages.find(
      (stop) => stop.name?.toLowerCase() === from?.toLowerCase()
    );
    return fromStop?.goingTime || null;
  };

  const indexOfLastBus = currentPage * busesPerPage;
  const indexOfFirstBus = indexOfLastBus - busesPerPage;
  const currentBuses = buses.slice(indexOfFirstBus, indexOfLastBus);
  const totalPages = Math.ceil(buses.length / busesPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  const goToPrevious = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };
  
  const goToNext = () => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl shadow-xl p-8 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">All Available Buses</h1>
        <p className="text-purple-100">
          Browse our complete fleet of buses (alphabetically sorted)
        </p>
      </div>

      {/* Stats Bar */}
      {!loading && buses.length > 0 && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">
                Total Buses: <span className="font-bold text-purple-700 text-lg">{buses.length}</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                Showing <span className="font-bold text-purple-700">{indexOfFirstBus + 1}</span> - <span className="font-bold text-purple-700">{Math.min(indexOfLastBus, buses.length)}</span> of <span className="font-bold">{buses.length}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading buses...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
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

      {/* Buses Grid */}
      {!loading && currentBuses.length > 0 && (
        <div className="space-y-4">
          <div className="grid gap-4">
            {currentBuses.map((bus, index) => {
              const stoppages = bus.route?.stoppages || [];
              const routeFrom = bus.route?.from || "N/A";
              const routeTo = bus.route?.to || "N/A";
              const departureTime = getDepartureTime(stoppages, routeFrom);

              return (
                <div
                  key={bus._id || index}
                  className="bg-white rounded-xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
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
                            <div className="mt-2 flex items-center text-sm">
                              <span className="font-medium text-purple-700 capitalize">{routeFrom}</span>
                              <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                              <span className="font-medium text-purple-700 capitalize">{routeTo}</span>
                              <span className="ml-3 text-gray-500">({stoppages.length} stops)</span>
                            </div>
                            {departureTime && (
                              <div className="mt-1 text-sm font-semibold text-green-600">
                                🕒 Departs from {routeFrom}: {departureTime}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="flex flex-col md:items-end gap-2">
                        {bus.contactNumber1 && (
                          <a 
                            href={`tel:${bus.contactNumber1}`}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-300 border border-blue-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-sm font-semibold">{bus.contactNumber1}</span>
                          </a>
                        )}
                        {bus.contactNumber2 && (
                          <a 
                            href={`tel:${bus.contactNumber2}`}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all duration-300 border border-green-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-sm font-semibold">{bus.contactNumber2}</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Amenities */}
                    {bus.amenities && bus.amenities.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2">
                          {bus.amenities.slice(0, 6).map((amenity, i) => (
                            <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium border border-green-200">
                              ✓ {amenity}
                            </span>
                          ))}
                          {bus.amenities.length > 6 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                              +{bus.amenities.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Page Info */}
                <div className="text-sm text-gray-600">
                  Page <span className="font-bold text-purple-700">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={goToPrevious}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex space-x-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => goToPage(pageNumber)}
                            className={`w-10 h-10 rounded-lg font-semibold transition-all duration-300 ${
                              currentPage === pageNumber
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'bg-white text-purple-600 hover:bg-purple-50 border border-purple-200'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <span key={pageNumber} className="w-10 h-10 flex items-center justify-center text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={goToNext}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Go to Page Input */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Go to:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        goToPage(page);
                      }
                    }}
                    className="w-16 px-2 py-1 border-2 border-purple-200 rounded-lg text-center focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && buses.length === 0 && !error && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Buses Available</h3>
          <p className="text-gray-500">Check back later for available buses</p>
        </div>
      )}
    </div>
  );
}

export default AllBuses;