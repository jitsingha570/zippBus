import React from 'react';

function PopularRoutes() {
  const routes = [
    { 
      from: "Delhi", 
      to: "Mumbai", 
      time: "10:00 AM - 8:00 PM", 
      duration: "10h", 
      price: "₹1,200",
      distance: "1,400 km"
    },
    { 
      from: "Bangalore", 
      to: "Chennai", 
      time: "9:00 AM - 7:00 PM", 
      duration: "10h", 
      price: "₹800",
      distance: "350 km"
    },
    { 
      from: "Kolkata", 
      to: "Patna", 
      time: "6:00 AM - 4:00 PM", 
      duration: "10h", 
      price: "₹600",
      distance: "600 km"
    },
    { 
      from: "Hyderabad", 
      to: "Vizag", 
      time: "7:00 AM - 6:00 PM", 
      duration: "11h", 
      price: "₹900",
      distance: "620 km"
    }
  ];

  return (
    <section className="w-full px-6 py-16 bg-gradient-to-br from-white via-purple-50 to-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-40 h-40 bg-purple-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-purple-300 rounded-full opacity-15 animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/2 w-6 h-6 bg-purple-400 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-1/3 right-1/3 w-4 h-4 bg-purple-500 rounded-full opacity-40 animate-bounce delay-700"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
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
            <RouteCard key={index} {...route} />
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
            <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Explore All Routes
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function RouteCard({ from, to, time, duration, price, distance }) {
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

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-md">
            Book Now
          </button>
          <button className="px-6 py-3 border-2 border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-300 font-semibold">
            View Details
          </button>
        </div>

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

export default PopularRoutes;