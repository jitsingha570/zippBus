import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const AdminBusUpdateRequests = () => {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const token = localStorage.getItem("adminToken"); // ⚠️ admin token

  // =========================
  // FETCH UPDATE REQUESTS
  // =========================
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/buses/updates?status=${status}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequests(res.data.requests);
    } catch (err) {
      console.error(err);
      alert("Failed to load update requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [status]);

  // =========================
  // APPROVE
  // =========================
  const approveRequest = async (id) => {
    if (!window.confirm("Approve this bus update?")) return;

    try {
      await axios.put(
        `${API_URL}/buses/updateApprove/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchRequests();
    } catch (err) {
      alert("Approval failed");
    }
  };

  // =========================
  // REJECT
  // =========================
  const rejectRequest = async () => {
    if (!rejectReason) {
      alert("Please provide a rejection reason");
      return;
    }

    try {
      await axios.put(
        `${API_URL}/buses/updateReject/${selectedId}`,
        { reason: rejectReason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRejectReason("");
      setSelectedId(null);
      fetchRequests();
    } catch (err) {
      alert("Rejection failed");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading requests...</p>;

  // =========================
  // UI
  // =========================
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Bus Update Requests (Admin)</h2>

      {/* STATUS FILTER */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border p-2 mb-4"
      >
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>

      {requests.length === 0 && (
        <p className="text-gray-600">No update requests found.</p>
      )}

      {requests.map((req) => (
        <div
          key={req._id}
          className="border rounded p-4 mb-4 bg-gray-50"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">
              {req.busName} ({req.busNumber})
            </h3>
            <span className="text-sm font-medium">
              Status:{" "}
              <span
                className={
                  req.status === "pending"
                    ? "text-yellow-600"
                    : req.status === "approved"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {req.status}
              </span>
            </span>
          </div>

          <p><b>Type:</b> {req.busType}</p>
          <p><b>Capacity:</b> {req.capacity}</p>
          <p><b>Fare:</b> ₹{req.fare}</p>

          <p className="mt-2">
            <b>Amenities:</b> {req.amenities.join(", ") || "None"}
          </p>

          {/* STOPPAGES */}
          <div className="mt-2">
            <b>Stoppages:</b>
            <ul className="list-disc ml-6">
              {req.stoppages.map((s, i) => (
                <li key={i}>
                  {s.name} — {s.goingTime} / {s.returnTime}
                </li>
              ))}
            </ul>
          </div>

          {/* REJECTION REASON */}
          {req.status === "rejected" && (
            <p className="text-red-600 mt-2">
              <b>Reason:</b> {req.rejectionReason}
            </p>
          )}

          {/* ACTION BUTTONS */}
          {req.status === "pending" && (
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => approveRequest(req._id)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => setSelectedId(req._id)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}

      {/* REJECT MODAL */}
      {selectedId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="font-bold mb-2">Reject Update Request</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="border w-full p-2"
              placeholder="Enter rejection reason"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setSelectedId(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={rejectRequest}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBusUpdateRequests;
