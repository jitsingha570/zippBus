import React, { useState } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

function AddNewBus() {
  const [busName, setBusName] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [stoppages, setStoppages] = useState([
    { name: '', goingTime: '', returnTime: '' },
    { name: '', goingTime: '', returnTime: '' },
    { name: '', goingTime: '', returnTime: '' },
  ]);

  const handleStoppageChange = (index, field, value) => {
    const newStoppages = [...stoppages];
    if (field === 'name') {
      newStoppages[index][field] = value.toLowerCase(); // 🔽 force lowercase for consistency
    } else {
      newStoppages[index][field] = value;
    }
    setStoppages(newStoppages);
  };

  const addStoppage = () => {
    if (stoppages.length < 10) {
      setStoppages([...stoppages, { name: '', goingTime: '', returnTime: '' }]);
    } else {
      alert("You can add a maximum of 10 stoppages.");
    }
  };

  const removeStoppage = (index) => {
    if (stoppages.length > 3) {
      const newStoppages = [...stoppages];
      newStoppages.splice(index, 1);
      setStoppages(newStoppages);
    } else {
      alert("Minimum 3 stoppages are required.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      busName,
      busNumber,
      stoppages,
    };

    try {
      const res = await axios.post(`${API_URL}/api/buses/add`, payload);
      alert("Bus added successfully!");

      // Reset form
      setBusName('');
      setBusNumber('');
      setStoppages([
        { name: '', goingTime: '', returnTime: '' },
        { name: '', goingTime: '', returnTime: '' },
        { name: '', goingTime: '', returnTime: '' },
      ]);
    } catch (error) {
      console.error("Error adding bus:", error);
      alert("Failed to add bus. Check console for details.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl space-y-4">
        <h2 className="text-2xl font-semibold text-center text-blue-600">Add New Bus</h2>

        <div>
          <label className="block font-medium">Bus Name</label>
          <input
            type="text"
            value={busName}
            onChange={(e) => setBusName(e.target.value)}
            className="w-full border p-2 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Bus Number</label>
          <input
            type="text"
            value={busNumber}
            onChange={(e) => setBusNumber(e.target.value)}
            className="w-full border p-2 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Stoppages</label>
          {stoppages.map((stop, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-end">
              <div className="col-span-4">
                <input
                  type="text"
                  placeholder="Stop Name"
                  value={stop.name}
                  onChange={(e) => handleStoppageChange(index, 'name', e.target.value)}
                  className="w-full border p-2 rounded-md"
                  required
                />
              </div>
              <div className="col-span-3">
                <label className="text-sm">Going Time</label>
                <input
                  type="time"
                  value={stop.goingTime}
                  onChange={(e) => handleStoppageChange(index, 'goingTime', e.target.value)}
                  className="w-full border p-2 rounded-md"
                  required
                />
              </div>
              <div className="col-span-3">
                <label className="text-sm">Return Time</label>
                <input
                  type="time"
                  value={stop.returnTime}
                  onChange={(e) => handleStoppageChange(index, 'returnTime', e.target.value)}
                  className="w-full border p-2 rounded-md"
                  required
                />
              </div>
              <div className="col-span-2 text-right">
                {stoppages.length > 3 && (
                  <button
                    type="button"
                    onClick={() => removeStoppage(index)}
                    className="text-red-600 font-bold text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addStoppage}
            className="mt-2 text-blue-600 font-semibold hover:underline"
          >
            + Add More Stoppage
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Bus
        </button>
      </form>
    </div>
  );
}

export default AddNewBus;
