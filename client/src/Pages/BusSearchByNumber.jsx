import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BusSearchPage = () => {
  const [busNumber, setBusNumber] = useState("");
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState("");

  const handleSearch = async () => {
    if (!busNumber.trim()) {
      setError("Please enter a bus number");
      return;
    }

    setLoading(true);
    setError("");
    setBus(null);

    try {
      const normalizedBusNumber = busNumber.replace(/[\s-]/g, "");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/buses/${normalizedBusNumber}`
      );

      setBus(res.data.bus);
    } catch (err) {
      setError(err.response?.data?.error || "Bus not found");
      setBus(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!bus) return;

    setUpdateLoading(true);
    setUpdateSuccess("");
    setError("");

    try {
      // Normalize bus number for backend
      const normalizedBusNumber = bus.busNumber.replace(/[\s-]/g, "");

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/buses/${normalizedBusNumber}`,
        bus
      );

      setBus(res.data.bus);
      setUpdateSuccess("Bus details updated successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update bus");
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle changes in update form
  const handleChange = (field, value) => {
    setBus({ ...bus, [field]: value });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Search Bus by Number</h1>

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Enter Bus Number"
          value={busNumber}
          onChange={(e) => setBusNumber(e.target.value)}
          className="border p-2 flex-1 rounded-l"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {bus && (
        <div className="border p-4 rounded shadow mt-4">
          <h2 className="text-xl font-semibold mb-2">Update Bus Details</h2>

          <div className="mb-2">
            <label className="block font-semibold">Bus Name:</label>
            <input
              type="text"
              value={bus.busName}
              onChange={(e) => handleChange("busName", e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>

          <div className="mb-2">
            <label className="block font-semibold">Bus Type:</label>
            <input
              type="text"
              value={bus.busType}
              onChange={(e) => handleChange("busType", e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>

          <div className="mb-2">
            <label className="block font-semibold">Capacity:</label>
            <input
              type="number"
              value={bus.capacity}
              onChange={(e) => handleChange("capacity", e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>

          <div className="mb-2">
            <label className="block font-semibold">Fare:</label>
            <input
              type="number"
              value={bus.fare}
              onChange={(e) => handleChange("fare", e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>

          <div className="mb-2">
            <label className="block font-semibold">Amenities (comma separated):</label>
            <input
              type="text"
              value={bus.amenities.join(", ")}
              onChange={(e) =>
                handleChange(
                  "amenities",
                  e.target.value.split(",").map((a) => a.trim())
                )
              }
              className="border p-2 w-full rounded"
            />
          </div>

          <div className="mb-2">
            <label className="block font-semibold">Stoppages (comma separated):</label>
            <input
              type="text"
              value={bus.stoppages.join(", ")}
              onChange={(e) =>
                handleChange(
                  "stoppages",
                  e.target.value.split(",").map((s) => s.trim())
                )
              }
              className="border p-2 w-full rounded"
            />
          </div>

          <button
            onClick={handleUpdate}
            disabled={updateLoading}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            {updateLoading ? "Updating..." : "Update Bus"}
          </button>

          {updateSuccess && <p className="text-green-500 mt-2">{updateSuccess}</p>}
        </div>
      )}
    </div>
  );
};

export default BusSearchPage;
