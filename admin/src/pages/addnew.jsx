import React, { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function AddNewBus() {
  const [busName, setBusName] = useState("");
  const [busNumber, setBusNumber] = useState("");

  const [busType, setBusType] = useState("Non-AC Seater");
  const [capacity, setCapacity] = useState(40);
  const [fare, setFare] = useState(100);
  const [amenities, setAmenities] = useState([]);

  const [stoppages, setStoppages] = useState([
    { name: "", goingTime: "", returnTime: "" },
    { name: "", goingTime: "", returnTime: "" },
    { name: "", goingTime: "", returnTime: "" }
  ]);

  const handleStoppageChange = (index, field, value) => {
    const updated = [...stoppages];
    updated[index][field] = value;
    setStoppages(updated);
  };

  const addStoppage = () => {
    if (stoppages.length < 10) {
      setStoppages([...stoppages, { name: "", goingTime: "", returnTime: "" }]);
    }
  };

  const removeStoppage = (index) => {
    if (stoppages.length > 3) {
      const updated = [...stoppages];
      updated.splice(index, 1);
      setStoppages(updated);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again");
      return;
    }

    const payload = {
      busName,
      busNumber,
      busType,
      capacity,
      fare,
      amenities,
      stoppages
    };

    try {
      await axios.post(
        `${API_URL}/api/buses/request`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      alert("Bus request sent for approval ✅");

      // Reset form
      setBusName("");
      setBusNumber("");
      setBusType("Non-AC Seater");
      setCapacity(40);
      setFare(100);
      setAmenities([]);
      setStoppages([
        { name: "", goingTime: "", returnTime: "" },
        { name: "", goingTime: "", returnTime: "" },
        { name: "", goingTime: "", returnTime: "" }
      ]);

    } catch (error) {
      console.error("Error adding bus:", error.response?.data || error.message);
      alert("Failed to submit bus request");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center text-blue-600">
          Add New Bus
        </h2>

        <input
          type="text"
          placeholder="Bus Name"
          value={busName}
          onChange={(e) => setBusName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Bus Number"
          value={busNumber}
          onChange={(e) => setBusNumber(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <select
          value={busType}
          onChange={(e) => setBusType(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option>AC Seater</option>
          <option>Non-AC Seater</option>
          <option>Sleeper AC</option>
          <option>Sleeper Non-AC</option>
          <option>Volvo</option>
          <option>Luxury</option>
        </select>

        <input
          type="number"
          value={capacity}
          min="20"
          max="60"
          onChange={(e) => setCapacity(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          value={fare}
          min="50"
          onChange={(e) => setFare(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <h3 className="font-semibold">Stoppages</h3>

        {stoppages.map((stop, index) => (
          <div key={index} className="grid grid-cols-3 gap-2">
            <input
              placeholder="Stop Name"
              value={stop.name}
              onChange={(e) =>
                handleStoppageChange(index, "name", e.target.value)
              }
              className="border p-2 rounded"
            />
            <input
              type="time"
              value={stop.goingTime}
              onChange={(e) =>
                handleStoppageChange(index, "goingTime", e.target.value)
              }
              className="border p-2 rounded"
            />
            <input
              type="time"
              value={stop.returnTime}
              onChange={(e) =>
                handleStoppageChange(index, "returnTime", e.target.value)
              }
              className="border p-2 rounded"
            />
            {stoppages.length > 3 && (
              <button
                type="button"
                onClick={() => removeStoppage(index)}
                className="text-red-600 text-sm"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addStoppage}
          className="text-blue-600 font-semibold"
        >
          + Add Stoppage
        </button>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Submit Bus Request
        </button>
      </form>
    </div>
  );
}

export default AddNewBus;
