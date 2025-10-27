import React from 'react';

function PopularBuses() {
  const buses = [
    {
      name: "Volvo",
      description: "Luxury Bus",
      features: ["Reclining Seats", "AC", "Entertainment", "WiFi"],
      price: "₹1,500",
      rating: 4.8,
      icon: "🚌",
      color: "from-purple-500 to-purple-600",
      popular: true
    },
    {
      name: "Sleeper",
      description: "Comfortable Sleeper Bus",
      features: ["Bed Layout", "Privacy Curtains", "AC", "Reading Light"],
      price: "₹1,200",
      rating: 4.6,
      icon: "🛏️",
      color: "from-purple-600 to-purple-700",
      popular: false
    },
    {
      name: "AC Seater",
      description: "Air Conditioned Seater Bus",
      features: ["Comfortable Seats", "AC", "Charging Points", "Snacks"],
      price: "₹800",
      rating: 4.4,
      icon: "❄️",
      color: "from-purple-700 to-purple-800",
      popular: true
    },
    {
      name: "Non-AC",
      description: "Budget Friendly Non-AC Bus",
      features: ["Basic Seating", "Budget Friendly", "Regular Service", "Safe Travel"],
      price: "₹400",
      rating: 4.0,
      icon: "🚐",
      color: "from-purple-400 to-purple-500",
      popular: false
    }
  ];

  return (
    <section className="w-full px-6 py-16 bg-gradient-to-br from-purple-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-16 left-20 w-32 h-32 bg-purple-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-16 right-20 w-40 h-40 bg-purple-300 rounded-full opacity-15 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-6 h-6 bg-purple-400 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-purple-500 rounded-full opacity-40 animate-bounce delay-500"></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-32 right-16 w-16 h-16 border-2 border-purple-300 rounded-lg rotate-45 opacity-20 animate-spin-slow"></div>
        <div className="absolute bottom-32 left-12 w-12 h-12 border border-purple-400 rotate-12 opacity-30"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
              Premium Fleet
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience comfort and luxury with our diverse range of modern buses designed for every budget
          </p>
        </div>

        {/* Buses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {buses.map((bus, index) => (
            <BusCard key={index} {...bus} />
          ))}
        </div>

        {/* Additional Features Section */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
              Why Choose Our Buses?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <FeatureCard 
                icon="🛡️"
                title="Safe Travel"
                description="GPS tracking & insurance"
              />
              <FeatureCard 
                icon="⭐"
                title="Top Rated"
                description="Highly rated by passengers"
              />
              <FeatureCard 
                icon="💰"
                title="Best Prices"
                description="Competitive & transparent pricing"
              />
              <FeatureCard 
                icon="📞"
                title="24/7 Support"
                description="Round the clock assistance"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </section>
  );
}

function BusCard({ name, description, features, price, rating, icon, color, popular }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative">
      {/* Popular Badge */}
      {popular && (
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Popular
          </span>
        </div>
      )}

      {/* Card Header */}
      <div className={`bg-gradient-to-r ${color} text-white p-6 relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                             radial-gradient(circle at 80% 50%, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <h2 className="text-2xl font-bold mb-2">{name}</h2>
          <p className="text-purple-100">{description}</p>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Rating and Price */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400">⭐</span>
            <span className="font-semibold text-gray-700">{rating}</span>
            <span className="text-gray-500 text-sm">/5.0</span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Starting from</p>
            <p className={`text-2xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
              {price}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Key Features
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></div>
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button className={`flex-1 bg-gradient-to-r ${color} text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
            Book Now
          </button>
          <button className="px-6 py-3 border-2 border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-300 font-semibold">
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="text-center p-4 group">
      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
        <span className="text-2xl">{icon}</span>
      </div>
      <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

export default PopularBuses;