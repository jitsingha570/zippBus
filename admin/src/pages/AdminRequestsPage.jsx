import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const AdminRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [expandedRequestId, setExpandedRequestId] = useState(null);

  // ================================
  // FETCH ALL PENDING REQUESTS
  // ================================
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("Admin not logged in");

      const res = await axios.get(`${API_URL}/api/buses/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRequests(Array.isArray(res.data.payload) ? res.data.payload : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ================================
  // APPROVE BUS REQUEST
  // ================================
  const handleApprove = async (id) => {
    if (!confirm("Are you sure you want to approve this bus request?")) return;

    try {
      setActionLoading(id);

      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("Admin not logged in");

      const res = await axios.put(
        `${API_URL}/api/buses/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message || "Bus approved successfully ✓");
      fetchRequests();
    } catch (err) {
      console.error("Approve error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to approve request");
    } finally {
      setActionLoading(null);
    }
  };

  // ================================
  // REJECT BUS REQUEST
  // ================================
  const handleReject = async (id) => {
    try {
      const reason = prompt("Enter rejection reason:", "");
      if (reason === null) return;
      if (!reason.trim()) {
        alert("Please provide a rejection reason");
        return;
      }

      setActionLoading(id);

      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("Admin not logged in");

      const res = await axios.put(
        `${API_URL}/api/buses/reject/${id}`,
        { rejectionReason: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message || "Bus request rejected");
      fetchRequests();
    } catch (err) {
      console.error("Reject error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to reject request");
    } finally {
      setActionLoading(null);
    }
  };

  const toggleDetails = (id) => {
    setExpandedRequestId(expandedRequestId === id ? null : id);
  };

  // ================================
  // LOADING UI
  // ================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading requests...</p>
        </div>
      </div>
    );
  }

  // ================================
  // MAIN UI
  // ================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Pending Bus Requests
              </h1>
              <p className="text-gray-600">
                Review and manage bus registration requests
              </p>
            </div>
            <button
              onClick={fetchRequests}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-6 shadow-md">
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

        {/* Requests Count */}
        {requests.length > 0 && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-purple-100">
              <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="font-semibold text-gray-700">
                {requests.length} pending request{requests.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {/* No Requests */}
        {requests.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-12 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">All Caught Up! 🎉</h2>
            <p className="text-gray-600">No pending bus requests at the moment</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {requests.map((req) => {
              const isExpanded = expandedRequestId === req._id;
              const stoppages = req.stoppages || [];

              return (
                <div key={req._id} className="bg-white rounded-xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Compact Request Card */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Bus Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            {req.busName?.charAt(0) || 'B'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h2 className="text-lg font-bold text-gray-800">
                                {req.busName || 'N/A'}
                              </h2>
                              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                                Pending
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                {req.busNumber || 'N/A'}
                              </span>
                              {req.busType && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <span>{req.busType}</span>
                                </>
                              )}
                              {req.capacity && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <span>{req.capacity} seats</span>
                                </>
                              )}
                              {stoppages.length > 0 && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <span>{stoppages.length} stops</span>
                                </>
                              )}
                            </div>
                            {req.fare && (
                              <div className="mt-2">
                                <span className="text-sm text-gray-600">Base Fare: </span>
                                <span className="text-lg font-bold text-purple-700">₹{req.fare}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 md:items-end">
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleDetails(req._id)}
                            className="px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-300 font-semibold flex items-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{isExpanded ? 'Hide' : 'Details'}</span>
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReject(req._id)}
                            disabled={actionLoading === req._id}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                          >
                            {actionLoading === req._id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                <span>Rejecting...</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span>Reject</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleApprove(req._id)}
                            disabled={actionLoading === req._id}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                          >
                            {actionLoading === req._id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                <span>Approving...</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Approve</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      <div className="p-6">
                        {/* Route Info */}
                        {req.route && (
                          <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                            <div className="flex items-center justify-center space-x-4">
                              <div className="text-center">
                                <div className="text-xs text-gray-500 uppercase mb-1">From</div>
                                <div className="text-lg font-bold text-purple-700 capitalize">
                                  {req.route.from || 'N/A'}
                                </div>
                              </div>
                              <div className="flex-shrink-0">
                                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-500 uppercase mb-1">To</div>
                                <div className="text-lg font-bold text-purple-700 capitalize">
                                  {req.route.to || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Contact Information */}
                        {(req.contactNumber1 || req.contactNumber2) && (
                          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                              <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              Contact Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {req.contactNumber1 && (
                                <a 
                                  href={`tel:${req.contactNumber1}`}
                                  className="flex items-center bg-white p-3 rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all duration-300 group"
                                >
                                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-xs text-gray-500">Primary Contact</div>
                                    <div className="text-sm font-semibold text-gray-800">{req.contactNumber1}</div>
                                  </div>
                                </a>
                              )}
                              {req.contactNumber2 && (
                                <a 
                                  href={`tel:${req.contactNumber2}`}
                                  className="flex items-center bg-white p-3 rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all duration-300 group"
                                >
                                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-xs text-gray-500">Secondary Contact</div>
                                    <div className="text-sm font-semibold text-gray-800">{req.contactNumber2}</div>
                                  </div>
                                </a>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Amenities */}
                        {req.amenities && req.amenities.length > 0 && (
                          <div className="mb-6">
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                              <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Amenities
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {req.amenities.map((amenity, i) => (
                                <span key={i} className="px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-lg font-medium border border-green-200">
                                  ✓ {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Stoppages */}
                        {stoppages.length > 0 ? (
                          <div>
                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                              <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              Stoppage Schedule
                            </h3>
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                              <div className="overflow-x-auto">
                                <table className="w-full">
                                  <thead>
                                    <tr className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">#</th>
                                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Stop Name</th>
                                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Going Time</th>
                                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Return Time</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {stoppages.map((stop, i) => (
                                      <tr key={i} className="hover:bg-purple-50 transition-colors duration-150">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-600">
                                          <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-700 rounded-full font-bold">
                                            {i + 1}
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
                          <div className="text-center py-6 text-gray-500 bg-white rounded-lg">
                            <p>No stoppage data provided</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRequestsPage;