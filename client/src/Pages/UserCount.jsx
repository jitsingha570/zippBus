import React, { useState, useEffect } from 'react';

function UserCount() {
  const [animatedValues, setAnimatedValues] = useState({
    users: 0,
    buses: 0,
    routes: 0
  });

  const finalValues = {
    users: 1000,
    buses: 250,
    routes: 150
  };

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60; // 60 steps for smooth animation
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutProgress = 1 - Math.pow(1 - progress, 3); // Ease out animation

      setAnimatedValues({
        users: Math.floor(finalValues.users * easeOutProgress),
        buses: Math.floor(finalValues.buses * easeOutProgress),
        routes: Math.floor(finalValues.routes * easeOutProgress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedValues(finalValues);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full px-6 py-16 bg-gradient-to-br from-purple-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-300 rounded-full opacity-15 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-purple-400 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-purple-500 rounded-full opacity-40 animate-bounce delay-500"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
              Our Network
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connecting people across the country with reliable bus services
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard 
            label="Total Users" 
            value={animatedValues.users}
            icon="👥"
            color="from-purple-500 to-purple-600"
            bgColor="bg-purple-50"
            description="Happy travelers"
          />
          <StatCard 
            label="Total Buses" 
            value={animatedValues.buses}
            icon="🚌"
            color="from-purple-600 to-purple-700"
            bgColor="bg-purple-50"
            description="Modern fleet"
          />
          <StatCard 
            label="Total Routes" 
            value={animatedValues.routes}
            icon="🗺️"
            color="from-purple-700 to-purple-800"
            bgColor="bg-purple-50"
            description="Destinations covered"
          />
        </div>

        {/* Additional Info */}
        
      </div>
    </section>
  );
}

function StatCard({ label, value, icon, color, bgColor, description, loading }) {
  return (
    <div className={`${bgColor} p-8 rounded-2xl shadow-lg border border-purple-100 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl group relative overflow-hidden`}>
      {/* Background Gradient Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        
        {/* Value */}
        <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent mb-2`}>
          {loading ? '...' : value.toLocaleString()}
        </div>
        
        {/* Label */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {label}
        </h2>
        
        {/* Description */}
        <p className="text-sm text-gray-600">
          {description}
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-8 h-8 border border-purple-200 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
      <div className="absolute bottom-4 left-4 w-6 h-6 bg-purple-200 rounded-full opacity-10 group-hover:opacity-30 transition-opacity duration-300"></div>
    </div>
  );
}

function LoadingStatCard() {
  return (
    <div className="bg-purple-50 p-8 rounded-2xl shadow-lg border border-purple-100 text-center animate-pulse">
      {/* Icon placeholder */}
      <div className="w-16 h-16 bg-purple-200 rounded-full mx-auto mb-4"></div>
      
      {/* Value placeholder */}
      <div className="h-12 bg-purple-200 rounded-lg mb-4 mx-auto max-w-24"></div>
      
      {/* Label placeholder */}
      <div className="h-6 bg-purple-200 rounded mb-2 mx-auto max-w-32"></div>
      
      {/* Description placeholder */}
      <div className="h-4 bg-purple-200 rounded mx-auto max-w-28"></div>
    </div>
  );
}

export default UserCount;