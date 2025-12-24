import React, { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const AdminRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

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

      // ✅ Extract payload
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
    try {
      setActionLoading(id);
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `${API_URL}/api/buses/approve/${id}`,
        {}, // empty body
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests();
    }
      catch (err) {
      console.error("Approve error:", err);
      alert(err.response?.data?.message || "Failed to approve request");
    } finally {
      setActionLoading(null);
    }
  };

  // ================================
  // REJECT BUS REQUEST
  // ================================
  const handleReject = async (id) => {
    try {
      setActionLoading(id);
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `${API_URL}/api/buses/reject/${id}`,
        {}, // empty body
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests();
    } catch (err) {
      console.error("Reject error:", err);
      alert(err.response?.data?.message || "Failed to reject request");
    } finally {
      setActionLoading(null);
    }
  };

  // ================================
  // LOADING UI
  // ================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold">Loading requests...</p>
      </div>
    );
  }

  // ================================
  // MAIN UI
  // ================================
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Pending Bus Requests</h1>
          <button
            onClick={fetchRequests}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {requests.length === 0 ? (
          <div className="bg-white p-10 rounded shadow text-center">
            <h2 className="text-xl font-semibold">No pending requests 🎉</h2>
          </div>
        ) : (
          <div className="grid gap-6">
            {requests.map((req) => (
              <div key={req._id} className="bg-white p-6 rounded shadow">
                <div className="flex justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{req.busName}</h2>
                    <p className="text-gray-600">Bus No: {req.busNumber}</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                    Pending
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Stoppages</h3>
                  {req.stoppages?.length ? (
                    req.stoppages.map((s, i) => (
                      <p key={i} className="text-sm text-gray-700">
                        {i + 1}. {s.name} — Go: {s.goingTime}, Return: {s.returnTime}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No stoppages</p>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => handleReject(req._id)}
                    disabled={actionLoading === req._id}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    {actionLoading === req._id ? "Rejecting..." : "Reject"}
                  </button>

                  <button
                    onClick={() => handleApprove(req._id)}
                    disabled={actionLoading === req._id}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    {actionLoading === req._id ? "Approving..." : "Approve"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRequestsPage;
