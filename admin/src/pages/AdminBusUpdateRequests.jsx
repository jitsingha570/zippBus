import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminBusEditRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Fetch all pending requests
  // =========================
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Please login as admin");
        navigate("/login");
        return;
      }

      const res = await axios.get(
        `${API_URL}/api/bus-edit/requests/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests(res.data.requests || []);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (err.response?.status === 403) {
        setError("Access denied. Admin login required.");
      } else {
        setError("Failed to load requests");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // =========================
  // Approve Request
  // =========================
  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/api/bus-edit/requests/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert("Failed to approve request");
    }
  };

  // =========================
  // Reject Request
  // =========================
  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/api/bus-edit/requests/${id}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert("Failed to reject request");
    }
  };

  // =========================
  // UI
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading requests...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Pending Bus Edit Requests
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {error}
          </div>
        )}

        {requests.length === 0 && !error && (
          <p className="text-gray-600">No pending requests</p>
        )}

        <div className="space-y-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-xl shadow border p-6"
            >
              <h2 className="text-lg font-semibold mb-1">
                {req.busId?.busName || "Unknown Bus"} (
                {req.busId?.busNumber})
              </h2>

              <p className="text-sm text-gray-500 mb-3">
                Requested by: {req.userId?.name || "Unknown"}
              </p>

              <div className="bg-gray-50 p-4 rounded mb-4">
                <h3 className="font-medium mb-2">Requested Changes</h3>

                {req.changes ? (
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(req.changes, null, 2)}
                  </pre>
                ) : (
                  <p className="text-gray-500">No change data</p>
                )}

                <p className="text-sm text-gray-600 mt-2">
                  Reason: {req.reason || "N/A"}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleApprove(req._id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleReject(req._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
