import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateBusPage = () => {
  const { busNumber } = useParams();
  const navigate = useNavigate();

  const [bus, setBus] = useState(null);
  const [form, setForm] = useState({
    busName: "",
    busNumber: "",
    contactNumber1: "",
    contactNumber2: "",
    busType: "",
    capacity: "",
    fare: "",
    amenities: [],
    route: {
      from: "",
      to: "",
      stoppages: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const busTypes = [
    'AC Seater',
    'Non-AC Seater',
    'Sleeper AC',
    'Sleeper Non-AC',
    'Volvo',
    'Luxury'
  ];

  const amenitiesList = [
    'WiFi',
    'Charging Points',
    'Entertainment',
    'Blankets',
    'Snacks',
    'Water Bottle',
    'GPS Tracking',
    'CCTV'
  ];

  // Fetch bus details
  useEffect(() => {
    const fetchBus = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/buses/${busNumber}`);
        const busData = res.data.bus;
        setBus(busData);
        setForm({
          busName: busData.busName || "",
          busNumber: busData.busNumber || "",
          contactNumber1: busData.contactNumber1 || "",
          contactNumber2: busData.contactNumber2 || "",
          busType: busData.busType || "",
          capacity: busData.capacity || "",
          fare: busData.fare || "",
          amenities: busData.amenities || [],
          route: {
            from: busData.route?.from || "",
            to: busData.route?.to || "",
            stoppages: busData.route?.stoppages || []
          }
        });
        setLoading(false);
      } catch (err) {
        setError("Bus not found or failed to load");
        setLoading(false);
      }
    };
    fetchBus();
  }, [busNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleRouteChange = (e) => {
    const { name, value } = e.target;
    setForm({ 
      ...form, 
      route: { ...form.route, [name]: value }
    });
  };

  const toggleAmenity = (amenity) => {
    const newAmenities = form.amenities.includes(amenity)
      ? form.amenities.filter(a => a !== amenity)
      : [...form.amenities, amenity];
    setForm({ ...form, amenities: newAmenities });
  };

  const handleStoppageChange = (index, field, value) => {
    const newStoppages = [...form.route.stoppages];
    newStoppages[index] = { ...newStoppages[index], [field]: value };
    setForm({ 
      ...form, 
      route: { ...form.route, stoppages: newStoppages }
    });
  };

  const addStoppage = () => {
    const newStoppage = {
      name: "",
      order: form.route.stoppages.length + 1,
      goingTime: "",
      returnTime: ""
    };
    setForm({
      ...form,
      route: {
        ...form.route,
        stoppages: [...form.route.stoppages, newStoppage]
      }
    });
  };

  const removeStoppage = (index) => {
    const newStoppages = form.route.stoppages.filter((_, i) => i !== index);
    // Reorder the remaining stoppages
    const reorderedStoppages = newStoppages.map((stop, i) => ({
      ...stop,
      order: i + 1
    }));
    setForm({
      ...form,
      route: {
        ...form.route,
        stoppages: reorderedStoppages
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.busName || !form.busNumber || !form.busType) {
      alert("Please fill in all required fields (Bus Name, Number, Type)");
      return;
    }

    if (form.route.stoppages.length < 3) {
      alert("Please add at least 3 stoppages");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/buses/update/${busNumber}`,
        form,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert("Bus updated successfully! ✓");
      navigate("/my-buses");
    } catch (err) {
      alert(err.response?.data?.error || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading bus details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Bus</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/my-buses")}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6 md:p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Update Bus Details
              </h1>
              <p className="text-gray-600">
                Edit information for bus {busNumber}
              </p>
            </div>
            <button
              onClick={() => navigate("/my-buses")}
              className="px-4 py-2 border-2 border-purple-200 text-purple-600 rounded-xl hover:bg-purple-50 transition-all duration-300 font-semibold flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bus Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="busName"
                  value={form.busName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  placeholder="Enter bus name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bus Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="busNumber"
                  value={form.busNumber}
                  onChange={handleChange}
                  required
                  disabled
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                  placeholder="Bus number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Number 1
                </label>
                <input
                  type="tel"
                  name="contactNumber1"
                  value={form.contactNumber1}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  placeholder="Primary contact"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Number 2
                </label>
                <input
                  type="tel"
                  name="contactNumber2"
                  value={form.contactNumber2}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  placeholder="Secondary contact"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bus Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="busType"
                  value={form.busType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                >
                  <option value="">Select bus type</option>
                  {busTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Capacity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  required
                  min="20"
                  max="60"
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  placeholder="Number of seats"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Base Fare (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="fare"
                  value={form.fare}
                  onChange={handleChange}
                  required
                  min="50"
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  placeholder="Fare amount"
                />
              </div>
            </div>
          </div>

          {/* Route Information */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Route Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  From <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="from"
                  value={form.route.from}
                  onChange={handleRouteChange}
                  required
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  placeholder="Starting point"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  To <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="to"
                  value={form.route.to}
                  onChange={handleRouteChange}
                  required
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  placeholder="Destination"
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Amenities
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {amenitiesList.map(amenity => (
                <label
                  key={amenity}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    form.amenities.includes(amenity)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.amenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Stoppages */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Stoppages ({form.route.stoppages.length})
              </h2>
              <button
                type="button"
                onClick={addStoppage}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Stop</span>
              </button>
            </div>

            <div className="space-y-4">
              {form.route.stoppages.map((stop, index) => (
                <div key={index} className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-700">Stop #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeStoppage(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-3">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Stop Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={stop.name}
                        onChange={(e) => handleStoppageChange(index, 'name', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                        placeholder="Enter stop name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Going Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={stop.goingTime}
                        onChange={(e) => handleStoppageChange(index, 'goingTime', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Return Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={stop.returnTime}
                        onChange={(e) => handleStoppageChange(index, 'returnTime', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {form.route.stoppages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <p>No stoppages added yet. Click "Add Stop" to begin.</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/my-buses")}
              className="flex-1 px-6 py-4 border-2 border-purple-200 text-purple-600 rounded-xl hover:bg-purple-50 transition-all duration-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Update Bus</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBusPage;