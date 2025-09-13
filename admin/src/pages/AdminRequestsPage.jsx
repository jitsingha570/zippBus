import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

// Get admin token correctly from localStorage
const adminToken = localStorage.getItem("adminToken");

// Axios config with Authorization header
const config = {
  headers: {
    Authorization: `Bearer ${adminToken}`,
  },
};

  // Fetch all pending requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      if (!adminToken) {
        setError("No authentication token found. Please login again.");
        navigate("/login");
        return;
      }

      const res = await axios.get(
        "http://localhost:5000/api/buses/requests",
        config
      );
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Authentication failed. Please login again.");
        localStorage.removeItem("adminToken");
        navigate("/login");
      } else {
        setError("⚠️ Failed to load requests. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line
  }, []);

  // Approve request
  const handleApprove = async (id) => {
    try {
      setActionLoading(id);

      if (!adminToken) {
        alert("No authentication token found. Please login again.");
        navigate("/login");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/buses/approve/${id}`,
        {},
        config
      );

      await fetchRequests(); // refresh list
    } catch (err) {
      console.error("Error approving request:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Authentication failed. Please login again.");
        localStorage.removeItem("adminToken");
        navigate("/login");
      } else {
        alert("❌ Failed to approve request");
      }
    } finally {
      setActionLoading(null);
    }
  };

  // Reject request
  const handleReject = async (id) => {
    try {
      setActionLoading(id);

      if (!adminToken) {
        alert("No authentication token found. Please login again.");
        navigate("/login");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/buses/reject/${id}`,
        {},
        config
      );

      await fetchRequests();
    } catch (err) {
      console.error("Error rejecting request:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Authentication failed. Please login again.");
        localStorage.removeItem("adminToken");
        navigate("/login");
      } else {
        alert("❌ Failed to reject request");
      }
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">⏳ Loading requests...</p>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pending Bus Requests</h1>
        <button
          onClick={fetchRequests}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          🔄 Refresh
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {requests.length === 0 ? (
        <p className="text-gray-600">✅ No pending requests</p>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="border p-4 rounded-lg shadow-md flex justify-between items-center bg-white"
            >
              <div>
                <h2 className="text-xl font-semibold">{req.busName}</h2>
                <p className="text-gray-700">Bus Number: {req.busNumber}</p>
                <p className="text-sm text-gray-600">
                  Route:{" "}
                  {req.stoppages?.length > 0
                    ? req.stoppages
                        .map(
                          (s) =>
                            `${s.name} (Go: ${s.goingTime || "N/A"}, Return: ${
                              s.returnTime || "N/A"
                            })`
                        )
                        .join(" → ")
                    : "No stoppages provided"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(req._id)}
                  disabled={actionLoading === req._id}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {actionLoading === req._id ? "Approving..." : "Approve"}
                </button>
                <button
                  onClick={() => handleReject(req._id)}
                  disabled={actionLoading === req._id}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                >
                  {actionLoading === req._id ? "Rejecting..." : "Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRequestsPage;
