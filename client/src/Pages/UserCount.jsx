import React from 'react';

function UserCount() {
  return (
    <section className="w-full px-6 py-10 bg-gray-100">
      <h1 className="text-2xl font-semibold text-center mb-6">User Count</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard label="Total Users" value="1000" />
        <StatCard label="Active Users" value="500" />
      </div>
    </section>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-md shadow-md text-center">
      <h2 className="text-xl font-semibold">{label}</h2>
      <p className="text-gray-600">{value}</p>
    </div>
  );
}

export default UserCount;
