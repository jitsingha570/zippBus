import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateBusPage = () => {
  const { busNumber } = useParams();
  const navigate = useNavigate();

  const [bus, setBus] = useState(null);
  const [form, setForm] = useState({
    busName: "",
    busType: "",
    capacity: "",
    fare: "",
    amenities: [],
    stoppages: [],
    insertStoppage: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch bus details
  useEffect(() => {
    const fetchBus = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/buses/${busNumber}`);
        setBus(res.data.bus);
        setForm({
          busName: res.data.bus.busName,
          busType: res.data.bus.busType,
          capacity: res.data.bus.capacity,
          fare: res.data.bus.fare,
          amenities: res.data.bus.amenities,
          stoppages: res.data.bus.stoppages,
          insertStoppage: null
        });
        setLoading(false);
      } catch (err) {
        setError("Bus not found");
        setLoading(false);
      }
    };
    fetchBus();
  }, [busNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleStoppagesChange = (e, index) => {
    const newStoppages = [...form.stoppages];
    newStoppages[index] = e.target.value;
    setForm({ ...form, stoppages: newStoppages });
  };

  const handleInsertStoppage = () => {
    if (!form.insertStoppage?.name || !form.insertStoppage?.order) return;
    const newStoppages = [...form.stoppages];
    const order = parseInt(form.insertStoppage.order);
    newStoppages.splice(order - 1, 0, form.insertStoppage.name);
    setForm({ ...form, stoppages: newStoppages, insertStoppage: null });
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...form };
      await axios.put(`${import.meta.env.VITE_API_URL}/buses/update/${busNumber}`, payload);
      alert("Bus updated successfully");
      navigate("/search-bus");
    } catch (err) {
      alert(err.response?.data?.error || "Update failed");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update Bus Details</h1>

      <div className="flex flex-col gap-3">
        <input name="busName" value={form.busName} onChange={handleChange} placeholder="Bus Name" className="border p-2 rounded" />
        <input name="busType" value={form.busType} onChange={handleChange} placeholder="Bus Type" className="border p-2 rounded" />
        <input name="capacity" type="number" value={form.capacity} onChange={handleChange} placeholder="Capacity" className="border p-2 rounded" />
        <input name="fare" type="number" value={form.fare} onChange={handleChange} placeholder="Fare" className="border p-2 rounded" />
        <input name="amenities" value={form.amenities.join(", ")} onChange={(e) => setForm({ ...form, amenities: e.target.value.split(",").map(a => a.trim()) })} placeholder="Amenities (comma separated)" className="border p-2 rounded" />
        
        <h2 className="font-semibold">Stoppages</h2>
        {form.stoppages.map((stop, index) => (
          <input key={index} value={stop} onChange={(e) => handleStoppagesChange(e, index)} className="border p-2 rounded" />
        ))}

        <div className="flex gap-2 mt-2">
          <input type="text" placeholder="New Stop Name" value={form.insertStoppage?.name || ""} onChange={(e) => setForm({ ...form, insertStoppage: { ...form.insertStoppage, name: e.target.value } })} className="border p-2 rounded flex-1" />
          <input type="number" placeholder="Order" value={form.insertStoppage?.order || ""} onChange={(e) => setForm({ ...form, insertStoppage: { ...form.insertStoppage, order: e.target.value } })} className="border p-2 rounded w-20" />
          <button onClick={handleInsertStoppage} className="bg-blue-500 text-white px-3 rounded hover:bg-blue-600">Insert</button>
        </div>

        <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4">Update Bus</button>
      </div>
    </div>
  );
};

export default UpdateBusPage;
