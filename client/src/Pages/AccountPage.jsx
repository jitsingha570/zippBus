import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingTrips: 0,
    totalSpent: 0,
    favoriteRoutes: []
  });
  const [myBuses, setMyBuses] = useState([]);
  const [showProfile, setShowProfile] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [contributionTab, setContributionTab] = useState('buses'); // 'buses' or 'reports'
  const [reportForm, setReportForm] = useState({
    busNumber: '',
    issueType: '',
    description: '',
    priority: 'medium'
  });
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const userRes = await axios.get(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);
        
        // Set edit form with current user data
        setEditForm({
          name: userRes.data.user.name || '',
          phone: userRes.data.user.phone || '',
          address: userRes.data.user.address || ''
        });

        // Fetch user statistics
        try {
          const statsRes = await axios.get(`${API_URL}/api/users/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setStats(statsRes.data);
        } catch (err) {
          console.log("Stats not available");
        }

        // Fetch my buses
        try {
          const busesRes = await axios.get(`${API_URL}/api/buses/my-buses`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMyBuses(busesRes.data);
        } catch (err) {
          console.log("My buses not available");
        }

      } catch (err) {
        console.error("Error fetching profile", err);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleAddBus = () => {
    navigate("/addnew");
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URL}/api/users/profile`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Update user state with new data
      setUser(prev => ({
        ...prev,
        user: { ...prev.user, ...editForm }
      }));
      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleReportChange = (e) => {
    setReportForm({
      ...reportForm,
      [e.target.name]: e.target.value
    });
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportForm.busNumber || !reportForm.issueType || !reportForm.description) {
      return;
    }

    setReportSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/api/reports/submit`, reportForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Reset form
      setReportForm({
        busNumber: '',
        issueType: '',
        description: '',
        priority: 'medium'
      });
      
      // Could show success message here
    } catch (err) {
      console.error("Error submitting report:", err);
    } finally {
      setReportSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
          <span className="text-lg text-gray-700">Loading your account...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-5 animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
              My Account
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Welcome back, {user.user.name}!
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-lg p-2 flex space-x-2">
            <button
              onClick={() => setShowProfile(true)}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                showProfile
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-purple-50'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setShowProfile(false)}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                !showProfile
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-purple-50'
              }`}
            >
              Contributions
            </button>
          </div>
        </div>

        {showProfile ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-8">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold">
                        {user.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1">{user.user.name}</h2>
                      <p className="text-purple-200">{user.user.email}</p>
                      <div className="flex items-center mt-2">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-green-200">Verified Account</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Content */}
                <div className="p-8">
                  {!editMode ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InfoField 
                            label="Full Name" 
                            value={user.user.name} 
                            icon="👤"
                          />
                          <InfoField 
                            label="Email Address" 
                            value={user.user.email} 
                            icon="📧"
                          />
                          <InfoField 
                            label="Phone Number" 
                            value={user.user.phone || "Not provided"} 
                            icon="📱"
                          />
                          <InfoField 
                            label="Address" 
                            value={user.user.address || "Not provided"} 
                            icon="📍"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => setEditMode(true)}
                          className="px-6 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200 font-medium flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit Profile</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleEditProfile} className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Profile</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={editForm.name}
                            onChange={handleEditChange}
                            className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            value={editForm.phone}
                            onChange={handleEditChange}
                            className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500"
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <textarea
                          name="address"
                          value={editForm.address}
                          onChange={handleEditChange}
                          rows="3"
                          className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500"
                          placeholder="Enter your address"
                        />
                      </div>

                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditMode(false)}
                          className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Stats and Actions Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <StatItem 
                    label="Total Bookings" 
                    value={stats.totalBookings} 
                    icon="🎫"
                    color="text-blue-600"
                  />
                  <StatItem 
                    label="Upcoming Trips" 
                    value={stats.upcomingTrips} 
                    icon="🚌"
                    color="text-green-600"
                  />
                  <StatItem 
                    label="Total Spent" 
                    value={`₹${stats.totalSpent}`} 
                    icon="💰"
                    color="text-purple-600"
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleAddBus}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add New Bus</span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/search')}
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Search Buses</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Contributions Tab
          <div className="max-w-6xl mx-auto">
            {/* Contributions Sub-Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-xl shadow-lg p-2 flex space-x-2">
                <button
                  onClick={() => setContributionTab('buses')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    contributionTab === 'buses'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-purple-50'
                  }`}
                >
                  My Buses
                </button>
                <button
                  onClick={() => setContributionTab('reports')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    contributionTab === 'reports'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-purple-50'
                  }`}
                >
                  Report Issues
                </button>
              </div>
            </div>

            {contributionTab === 'buses' ? (
              // My Buses Section
              <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">My Buses</h2>
                      <p className="text-purple-200 mt-1">Manage your bus listings and track approval status</p>
                    </div>
                    <button
                      onClick={handleAddBus}
                      className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Add New Bus</span>
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {myBuses.length > 0 ? (
                    <div className="space-y-6">
                      {myBuses.map((bus, index) => (
                        <BusCard key={bus._id || index} bus={bus} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No buses added yet</h3>
                      <p className="text-gray-500 mb-6">Start contributing to our platform by adding your first bus!</p>
                      <button
                        onClick={handleAddBus}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium"
                      >
                        Add Your First Bus
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Report Issues Section
              <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
                  <h2 className="text-2xl font-bold">Report Issues</h2>
                  <p className="text-red-200 mt-1">Help us maintain quality by reporting problematic buses or incorrect information</p>
                </div>
                
                <div className="p-6">
                  <form onSubmit={handleReportSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Bus Number *
                        </label>
                        <input
                          type="text"
                          name="busNumber"
                          value={reportForm.busNumber}
                          onChange={handleReportChange}
                          placeholder="e.g., KA-01-AB-1234"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Issue Type *
                        </label>
                        <select
                          name="issueType"
                          value={reportForm.issueType}
                          onChange={handleReportChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300"
                          required
                        >
                          <option value="">Select issue type</option>
                          <option value="wrong-info">Wrong Information</option>
                          <option value="fake-bus">Fake Bus Listing</option>
                          <option value="poor-service">Poor Service Quality</option>
                          <option value="safety-concern">Safety Concerns</option>
                          <option value="overcharging">Overcharging</option>
                          <option value="route-deviation">Route Deviation</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Priority Level
                        </label>
                        <select
                          name="priority"
                          value={reportForm.priority}
                          onChange={handleReportChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={reportForm.description}
                        onChange={handleReportChange}
                        rows="4"
                        placeholder="Please provide detailed information about the issue..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300"
                        required
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={reportSubmitting}
                        className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {reportSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span>Submit Report</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Report Guidelines */}
                  <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Reporting Guidelines
                    </h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Provide accurate bus number and specific details</li>
                      <li>• Include evidence or supporting information when possible</li>
                      <li>• Use appropriate priority levels for better response</li>
                      <li>• False reports may result in account suspension</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const InfoField = ({ label, value, icon }) => (
  <div className="bg-purple-50 rounded-lg p-4">
    <div className="flex items-center space-x-2 mb-1">
      <span className="text-lg">{icon}</span>
      <label className="text-sm font-medium text-gray-600">{label}</label>
    </div>
    <p className="text-gray-800 font-medium">{value}</p>
  </div>
);

const StatItem = ({ label, value, icon, color }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center space-x-3">
      <span className="text-xl">{icon}</span>
      <span className="text-gray-700 font-medium">{label}</span>
    </div>
    <span className={`font-bold ${color}`}>{value}</span>
  </div>
);

const BusCard = ({ bus }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'rejected':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-200 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-xl font-bold text-gray-800">{bus.busName}</h4>
          <p className="text-purple-600 font-medium">{bus.busNumber}</p>
          <p className="text-sm text-gray-600 mt-1">{bus.busType} • {bus.capacity} seats</p>
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(bus.status || 'pending')}`}>
            {getStatusIcon(bus.status || 'pending')}
            <span className="ml-1 capitalize">{bus.status || 'pending'}</span>
          </span>
          <p className="text-sm text-gray-500 mt-1">
            Added {bus.createdAt ? new Date(bus.createdAt).toLocaleDateString() : 'Recently'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <span className="text-sm font-medium text-gray-600">Route:</span>
          <p className="text-gray-800">
            {bus.stoppages?.[0]?.name || 'N/A'} → {bus.stoppages?.[bus.stoppages?.length - 1]?.name || 'N/A'}
          </p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-600">Base Fare:</span>
          <p className="text-gray-800 font-semibold">₹{bus.fare || 0}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-600">Total Stops:</span>
          <p className="text-gray-800">{bus.stoppages?.length || 0} stops</p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-600">Amenities:</span>
          <p className="text-gray-800">{bus.amenities?.length || 0} features</p>
        </div>
      </div>

      {bus.amenities && bus.amenities.length > 0 && (
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-600 block mb-2">Available Amenities:</span>
          <div className="flex flex-wrap gap-2">
            {bus.amenities.map((amenity, index) => (
              <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}

      {bus.status === 'rejected' && bus.rejectionReason && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <span className="text-sm font-medium text-red-800 block mb-1">Rejection Reason:</span>
          <p className="text-sm text-red-700">{bus.rejectionReason}</p>
        </div>
      )}

      <div className="flex justify-end space-x-3 mt-4">
        <button className="px-4 py-2 text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors duration-200">
          View Details
        </button>
        {bus.status === 'rejected' && (
          <button className="px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 text-sm font-medium rounded-lg transition-colors duration-200">
            Edit & Resubmit
          </button>
        )}
      </div>
    </div>
  );
};

export default AccountPage;