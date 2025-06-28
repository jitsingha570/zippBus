import React from 'react';

function PopularBuses() {
  return (
    <section className="w-full px-6 py-10 bg-white">
      <h1 className="text-2xl font-semibold text-center mb-6">Popular Buses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BusCard name="Volvo" description="Luxury Bus" />
        <BusCard name="Sleeper" description="Comfortable Sleeper Bus" />
        <BusCard name="AC Seater" description="Air Conditioned Seater Bus" />
        <BusCard name="Non-AC" description="Budget Friendly Non-AC Bus" />
      </div>
    </section>
  );
}

function BusCard({ name, description }) {
  return (
    <div className="bg-white p-4 rounded-md shadow-md text-center">
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default PopularBuses;
