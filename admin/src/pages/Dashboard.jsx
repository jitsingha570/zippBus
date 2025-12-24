import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchBus from "../components/SearchBus";
const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
  const [stats, setStats] = useState({
    totalBuses: 0,
    totalRoutes: 0,
    totalUsers: 0,
    pendingRequests: 0,
    approvedBuses: 0,
    rejectedRequests: 0
  });
  const [recentBuses, setRecentBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'search'
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all buses
      const busesRes = await axios.get(`${API_URL}/api/buses`);
      const buses = busesRes.data;
      
      // Calculate routes
      const routesSet = new Set();
      buses.forEach(bus => {
        if (bus.stoppages && bus.stoppages.length > 0) {
          const route = bus.stoppages.map(stop => stop.name.toLowerCase()).join(" > ");
          routesSet.add(route);
        }
      });

      // Fetch platform stats
      let platformStats = { totalUsers: 0, totalBuses: 0, totalRoutes: 0 };
      try {
        const statsRes = await axios.get(`${API_URL}/api/stats`);
        platformStats = statsRes.data;
      } catch (err) {
        console.log("Platform stats not available");
      }

      // Fetch pending bus requests (if user is admin)
      let pendingCount = 0;
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const requestsRes = await axios.get(`${API_URL}/api/buses/requests`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          pendingCount = requestsRes.data.filter(req => req.status === 'pending').length;
        }
      } catch (err) {
        console.log("Bus requests not available");
      }

      setStats({
        totalBuses: buses.length,
        totalRoutes: routesSet.size,
        totalUsers: platformStats.totalUsers || 0,
        pendingRequests: pendingCount,
        approvedBuses: buses.filter(bus => bus.status === 'approved').length,
        rejectedRequests: 0
      });

      // Get recent buses (last 5)
      setRecentBuses(buses.slice(-5).reverse());

    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
          <span className="text-lg text-gray-700">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-5 animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Monitor your bus management platform at a glance
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-lg p-2 flex space-x-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-purple-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'search'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-purple-50'
              }`}
            >
              Search Buses
            </button>
          </div>
        </div>

        {activeTab === 'overview' ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <ClickableStatCard
                title="Total Buses"
                value={stats.totalBuses}
                icon="🚌"
                color="from-blue-500 to-blue-600"
                description="Buses in the system"
                onClick={() => navigate('/buses')}
              />
              <ClickableStatCard
                title="Unique Routes"
                value={stats.totalRoutes}
                icon="🗺️"
                color="from-green-500 to-green-600"
                description="Active routes available"
                onClick={() => navigate('/routes')}
              />
              <ClickableStatCard
                title="Total Users"
                value={stats.totalUsers}
                icon="👥"
                color="from-purple-500 to-purple-600"
                description="Registered platform users"
                onClick={() => navigate('/users')}
              />
              <ClickableStatCard
                title="Pending Requests"
                value={stats.pendingRequests}
                icon="⏳"
                color="from-yellow-500 to-yellow-600"
                description="Awaiting approval"
                onClick={() => navigate('/request')}
              />
              <ClickableStatCard
                title="Approved Buses"
                value={stats.approvedBuses}
                icon="✅"
                color="from-emerald-500 to-emerald-600"
                description="Active and verified"
                onClick={() => navigate('/buses?status=approved')}
              />
              <StatCard
                title="Platform Health"
                value="Excellent"
                icon="💚"
                color="from-teal-500 to-teal-600"
                description="System status"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Quick Actions Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <QuickActionButton
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>}
                    label="Add New Bus"
                    onClick={() => navigate('/addnew')}
                    color="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  />
                  <QuickActionButton
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>}
                    label="View All Buses"
                    onClick={() => navigate('/buses')}
                    color="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  />
                  <QuickActionButton
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>}
                    label="My Account"
                    onClick={() => navigate('/account')}
                    color="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                  />
                </div>
              </div>

              {/* System Info Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Platform Info
                </h3>
                <div className="space-y-4">
                  <InfoItem label="Platform Status" value="Active" valueColor="text-green-600" />
                  <InfoItem label="Last Update" value={new Date().toLocaleDateString()} />
                  <InfoItem label="API Version" value="v1.0" />
                  <InfoItem label="Database" value="Connected" valueColor="text-green-600" />
                </div>
              </div>
            </div>

            {/* Recent Buses */}
            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
                <h3 className="text-2xl font-bold flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Recently Added Buses
                </h3>
                <p className="text-purple-200 mt-1">Latest buses added to the platform</p>
              </div>
              <div className="p-6">
                {recentBuses.length > 0 ? (
                  <div className="space-y-4">
                    {recentBuses.map((bus, index) => (
                      <RecentBusCard key={bus._id || index} bus={bus} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No buses available yet</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          // Search Tab
          <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8">
            <SearchBus />
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Components
const StatCard = ({ title, value, icon, color, description }) => (
  <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6 hover:shadow-2xl transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-14 h-14 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
        {icon}
      </div>
      <div className="text-right">
        <div className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
          {value}
        </div>
      </div>
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);

const ClickableStatCard = ({ title, value, icon, color, description, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group relative overflow-hidden"
  >
    {/* Hover overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-purple-600/0 group-hover:from-purple-500/5 group-hover:to-purple-600/5 transition-all duration-300"></div>
    
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
            {value}
          </div>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-purple-700 transition-colors duration-300">{title}</h3>
      <p className="text-sm text-gray-500 mb-3">{description}</p>
      
      {/* Click indicator */}
      <div className="flex items-center text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-xs font-medium mr-1">View details</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </div>
);

const QuickActionButton = ({ icon, label, onClick, color }) => (
  <button
    onClick={onClick}
    className={`w-full ${color} text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const InfoItem = ({ label, value, valueColor = "text-gray-800" }) => (
  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
    <span className="text-gray-600 font-medium">{label}</span>
    <span className={`font-semibold ${valueColor}`}>{value}</span>
  </div>
);

const RecentBusCard = ({ bus }) => (
  <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200 border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-bold text-gray-800">{bus.busName}</h4>
        <p className="text-sm text-purple-600 font-medium">{bus.busNumber}</p>
        <p className="text-xs text-gray-500 mt-1">
          {bus.busType || 'Standard'} • {bus.capacity || 'N/A'} seats
        </p>
      </div>
      <div className="text-right">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
          bus.status === 'approved' 
            ? 'bg-green-100 text-green-800' 
            : bus.status === 'pending'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {bus.status || 'Active'}
        </span>
        <p className="text-xs text-gray-500 mt-1">
          {bus.stoppages?.length || 0} stops
        </p>
      </div>
    </div>
  </div>
);

export default Dashboard;