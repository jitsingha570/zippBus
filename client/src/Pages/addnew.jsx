import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
function AddNewBus() {
  const [busName, setBusName] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [busType, setBusType] = useState('AC Seater');
  const [capacity, setCapacity] = useState('');
  const [fare, setFare] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [stoppages, setStoppages] = useState([
    { name: '', goingTime: '', returnTime: '' },
    { name: '', goingTime: '', returnTime: '' },
    { name: '', goingTime: '', returnTime: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const busTypes = ['AC Seater', 'Non-AC Seater', 'Sleeper AC', 'Sleeper Non-AC', 'Volvo', 'Luxury'];
  const availableAmenities = ['WiFi', 'Charging Points', 'Entertainment', 'Blankets', 'Snacks', 'Water Bottle', 'GPS Tracking', 'CCTV'];

  const handleStoppageChange = (index, field, value) => {
    const newStoppages = [...stoppages];
    if (field === 'name') {
      newStoppages[index][field] = value.toLowerCase();
    } else {
      newStoppages[index][field] = value;
    }
    setStoppages(newStoppages);
  };

  const addStoppage = () => {
    if (stoppages.length < 10) {
      setStoppages([...stoppages, { name: '', goingTime: '', returnTime: '' }]);
    } else {
      setMessage("You can add a maximum of 10 stoppages.");
    }
  };

  const removeStoppage = (index) => {
    if (stoppages.length > 3) {
      const newStoppages = [...stoppages];
      newStoppages.splice(index, 1);
      setStoppages(newStoppages);
    } else {
      setMessage("Minimum 3 stoppages are required.");
    }
  };

  const handleAmenityToggle = (amenity) => {
    setAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return busName && busNumber && busType && capacity;
      case 2:
        return stoppages.every(stop => stop.name && stop.goingTime && stop.returnTime);
      case 3:
        return fare;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setMessage('');
    } else {
      setMessage('Please fill in all required fields before proceeding.');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      setMessage('Please complete all required fields.');
      return;
    }

    setLoading(true);
    setMessage('');

    const payload = {
      busName,
      busNumber,
      busType,
      capacity: parseInt(capacity),
      fare: parseFloat(fare),
      amenities,
      stoppages,
    };

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setMessage("You must be logged in to add a bus.");
        setLoading(false);
        return;
      }

      const res = await axios.post(
        `${API_URL}/api/buses/request`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Bus added successfully! Redirecting...");
      
      // Reset form after successful submission
      setTimeout(() => {
        setBusName('');
        setBusNumber('');
        setBusType('AC Seater');
        setCapacity('');
        setFare('');
        setAmenities([]);
        setStoppages([
          { name: '', goingTime: '', returnTime: '' },
          { name: '', goingTime: '', returnTime: '' },
          { name: '', goingTime: '', returnTime: '' },
        ]);
        setCurrentStep(1);
        navigate('/account');
      }, 2000);

    } catch (error) {
      console.error("Error adding bus:", error);
      if (error.response?.status === 401) {
        setMessage("Session expired. Please login again.");
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage(error.response?.data?.message || "Failed to add bus. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Basic Bus Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-purple-700 mb-2">
            Bus Name *
          </label>
          <input
            type="text"
            value={busName}
            onChange={(e) => setBusName(e.target.value)}
            placeholder="e.g., Express Travel"
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-purple-700 mb-2">
            Bus Number *
          </label>
          <input
            type="text"
            value={busNumber}
            onChange={(e) => setBusNumber(e.target.value)}
            placeholder="e.g., KA-01-AB-1234"
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-purple-700 mb-2">
            Bus Type *
          </label>
          <select
            value={busType}
            onChange={(e) => setBusType(e.target.value)}
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
            required
          >
            {busTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-purple-700 mb-2">
            Seating Capacity *
          </label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="e.g., 45"
            min="20"
            max="60"
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">Route & Stoppages</h3>
        <span className="text-sm text-gray-500">{stoppages.length}/10 stops</span>
      </div>
      
      <div className="space-y-4">
        {stoppages.map((stop, index) => (
          <div key={index} className="bg-purple-50 p-4 rounded-xl border border-purple-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-purple-800">Stop {index + 1}</h4>
              {stoppages.length > 3 && (
                <button
                  type="button"
                  onClick={() => removeStoppage(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Stop Name *</label>
                <input
                  type="text"
                  placeholder="Enter stop name"
                  value={stop.name}
                  onChange={(e) => handleStoppageChange(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Going Time *</label>
                <input
                  type="time"
                  value={stop.goingTime}
                  onChange={(e) => handleStoppageChange(index, 'goingTime', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Return Time *</label>
                <input
                  type="time"
                  value={stop.returnTime}
                  onChange={(e) => handleStoppageChange(index, 'returnTime', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>
          </div>
        ))}
        
        {stoppages.length < 10 && (
          <button
            type="button"
            onClick={addStoppage}
            className="w-full py-3 border-2 border-dashed border-purple-300 text-purple-600 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Another Stop</span>
          </button>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Pricing & Amenities</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-purple-700 mb-2">
            Base Fare (₹) *
          </label>
          <input
            type="number"
            value={fare}
            onChange={(e) => setFare(e.target.value)}
            placeholder="e.g., 500"
            min="50"
            step="10"
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Starting fare for shortest route</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-purple-700 mb-3">
          Available Amenities
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {availableAmenities.map(amenity => (
            <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="w-4 h-4 text-purple-600 border-2 border-purple-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 py-8 px-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-5 animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/account')}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-4 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Account
          </button>
          
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
              Add New Bus
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Register your bus to start receiving bookings
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map(step => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  currentStep >= step
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                    currentStep > step ? 'bg-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 space-x-8">
            <span className={`text-sm ${currentStep >= 1 ? 'text-purple-600' : 'text-gray-500'}`}>
              Bus Details
            </span>
            <span className={`text-sm ${currentStep >= 2 ? 'text-purple-600' : 'text-gray-500'}`}>
              Route & Stops
            </span>
            <span className={`text-sm ${currentStep >= 3 ? 'text-purple-600' : 'text-gray-500'}`}>
              Pricing & Amenities
            </span>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-100 p-8 md:p-10">
          <form onSubmit={handleSubmit}>
            {/* Step Content */}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Message Display */}
            {message && (
              <div className={`mt-6 p-4 rounded-lg text-center font-medium ${
                message.includes('success') || message.includes('Redirecting')
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                <div className="flex items-center justify-center space-x-2">
                  {message.includes('success') ? (
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span>{message}</span>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border-2 border-purple-200 text-purple-600 rounded-xl hover:bg-purple-50 transition-all duration-200 font-medium flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Previous</span>
                </button>
              )}

              <div className="ml-auto">
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Adding Bus...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Add Bus</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddNewBus;