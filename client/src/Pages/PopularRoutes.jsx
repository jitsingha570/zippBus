import React, { useState } from 'react';
import { Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

function PopularRoutes() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [busResults, setBusResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const routes = [
    { 
      from: "Durgapur", 
      to: "Kolkata", 
      time: "10:00 AM - 8:00 PM", 
      duration: "4h", 
      price: "₹ -",
      distance: "171 km"
    },
    { 
      from: "Bankura", 
      to: "Kolkata", 
      time: "9:00 AM - 7:00 PM", 
      duration: "6h", 
      price: "₹ -",
      distance: "212 km"
    },
    { 
      from: "Kolkata", 
      to: "Purulia", 
      time: "6:00 AM - 4:00 PM", 
      duration: "7h", 
      price: "₹ -",
      distance: "291 km"
    },
    { 
      from: "Durgapur", 
      to: "Khatra", 
      time: "7:00 AM - 6:00 PM", 
      duration: "2.5h", 
      price: "₹ -",
      distance: "80 km"
    }
  ];

  const handleViewDetails = async (route) => {
    setSelectedRoute(route);
    setIsLoading(true);
    setError(null);
    setBusResults([]);
    
    try {
      const res = await fetch(
        `${API_URL}/api/buses/search?from=${route.from.toLowerCase()}&to=${route.to.toLowerCase()}`
      );
      
      if (!res.ok) {
        throw new Error('Failed to fetch buses');
      }
      
      const data = await res.json();
      console.log("Search result:", data);
      setBusResults(data.buses || data || []);
      
    } catch (error) {
      console.error("Error fetching buses:", error);
      setError("Unable to fetch bus details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedRoute(null);
    setBusResults([]);
    setError(null);
  };

  return (
    <section className="w-full px-6 py-16 bg-gradient-to-br from-white via-purple-50 to-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-40 h-40 bg-purple-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-purple-300 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute top-1/3 left-1/2 w-6 h-6 bg-purple-400 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-1/3 right-1/3 w-4 h-4 bg-purple-500 rounded-full opacity-40 animate-bounce"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Show bus results if a route is selected */}
        {selectedRoute ? (
          <BusResultsSection 
            route={selectedRoute}
            buses={busResults}
            isLoading={isLoading}
            error={error}
            onBack={handleBack}
          />
        ) : (
          <>
            {/* Section Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                  Popular Routes
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover the most traveled destinations with premium comfort and unbeatable prices
              </p>
            </div>

            {/* Routes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {routes.map((route, index) => (
                <RouteCard 
                  key={index} 
                  {...route} 
                  onViewDetails={() => handleViewDetails(route)}
                />
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center mt-16">
              <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Can't find your route?
                </h3>
                <p className="text-gray-600 mb-6">
                  We're constantly expanding our network. Search for more destinations or contact us for custom routes.
                </p>
                <Link to="/routes">
                <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Explore All Routes
                </button>
                 </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function RouteCard({ from, to, time, duration, price, distance, onViewDetails }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-sm opacity-90">FROM</p>
              <p className="text-xl font-bold">{from}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="flex-1 h-0.5 bg-white/50 w-8"></div>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              <div className="flex-1 h-0.5 bg-white/50 w-8"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            
            <div className="text-center">
              <p className="text-sm opacity-90">TO</p>
              <p className="text-xl font-bold">{to}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Time Information */}
        <div className="mb-6">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-700 font-medium">{time}</span>
          </div>
          <p className="text-center text-sm text-gray-500">
            Travel Duration: <span className="font-medium text-purple-600">{duration}</span>
          </p>
        </div>

        {/* Route Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <svg className="w-5 h-5 text-purple-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <p className="text-sm text-gray-600">Distance</p>
            <p className="font-bold text-purple-700">{distance}</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <svg className="w-5 h-5 text-purple-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <p className="text-sm text-gray-600">Starting from</p>
            <p className="font-bold text-purple-700">{price}</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onViewDetails}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center"
        >
          View Details
        </button>

        {/* Popular Badge */}
        <div className="mt-4 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 border border-purple-200">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Popular Route
          </span>
        </div>
      </div>
    </div>
  );
}

function BusResultsSection({ route, buses, isLoading, error, onBack }) {
  return (
    <div className="animate-fadeIn">
      {/* Back Button and Route Info */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-purple-600 hover:text-purple-700 font-semibold mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Routes
        </button>

        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">FROM</p>
                <p className="text-2xl font-bold text-purple-700">{route.from}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-500">TO</p>
                <p className="text-2xl font-bold text-purple-700">{route.to}</p>
              </div>
            </div>

            <div className="flex gap-4 text-sm">
              <div className="text-center px-4 py-2 bg-purple-50 rounded-lg">
                <p className="text-gray-600">Distance</p>
                <p className="font-bold text-purple-700">{route.distance}</p>
              </div>
              <div className="text-center px-4 py-2 bg-purple-50 rounded-lg">
                <p className="text-gray-600">Duration</p>
                <p className="font-bold text-purple-700">{route.duration}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-16">
          <svg className="animate-spin h-12 w-12 text-purple-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl text-gray-600 font-semibold">Searching for buses...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we find the best options for you</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600 font-semibold text-lg mb-2">Oops! Something went wrong</p>
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Bus Results */}
      {!isLoading && !error && buses.length > 0 && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Available Buses <span className="text-purple-600">({buses.length})</span>
            </h2>
            <p className="text-gray-600">Choose from our comfortable and affordable options</p>
          </div>

          <div className="space-y-4">
            {buses.map((bus, index) => (
              <BusCard key={index} bus={bus} />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!isLoading && !error && buses.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-purple-100">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No buses found</h3>
          <p className="text-gray-600">There are currently no buses available for this route.</p>
          <p className="text-gray-500 text-sm mt-2">Please try again later or contact us for assistance.</p>
        </div>
      )}
    </div>
  );
}

function BusCard({ bus }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-purple-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Bus Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {bus.busName || bus.name || 'Bus Service'}
                </h3>
                <p className="text-sm text-gray-500">
                  {bus.busType || bus.type || 'AC Seater'} • {bus.totalSeats || bus.seats || 40} Seats
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold text-gray-700">{bus.rating || '4.5'}</span>
              </div>
            </div>

            {/* Timings */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-700">{bus.departureTime || '10:00 AM'}</p>
                <p className="text-xs text-gray-500">{bus.from || 'Departure'}</p>
              </div>
              <div className="flex-1 flex items-center">
                <div className="flex-1 h-0.5 bg-gray-300"></div>
                <div className="px-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div className="flex-1 h-0.5 bg-gray-300"></div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-700">{bus.arrivalTime || '6:00 PM'}</p>
                <p className="text-xs text-gray-500">{bus.to || 'Arrival'}</p>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-2">
              {(bus.amenities || ['WiFi', 'Charging Point', 'Water Bottle']).slice(0, 4).map((amenity, idx) => (
                <span key={idx} className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-200">
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Price and Book */}
          <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:border-l md:border-gray-200 md:pl-6">
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-500 mb-1">Starting from</p>
              <p className="text-3xl font-bold text-purple-700">
                
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {bus.availableSeats || bus.available || 15} seats left
              </p>
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-md whitespace-nowrap">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopularRoutes;