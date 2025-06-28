import React from 'react';

function PopularRoutes() {
  return (
    <section className="w-full px-6 py-10 bg-gray-100">
      <h1 className="text-2xl font-semibold text-center mb-6">Popular Routes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RouteCard from="Delhi" to="Mumbai" time="10:00 AM - 8:00 PM" />
        <RouteCard from="Bangalore" to="Chennai" time="9:00 AM - 7:00 PM" />
        <RouteCard from="Kolkata" to="Patna" time="6:00 AM - 4:00 PM" />
        <RouteCard from="Hyderabad" to="Vizag" time="7:00 AM - 6:00 PM" />
      </div>
    </section>
  );
}

function RouteCard({ from, to, time }) {
  return (
    <div className="bg-white p-4 rounded-md shadow-md text-center">
      <h2 className="text-xl font-semibold">{from} to {to}</h2>
      <p className="text-gray-600">{time}</p>
    </div>
  );
}

export default PopularRoutes;
