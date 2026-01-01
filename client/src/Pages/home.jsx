import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBus from './SearchBus';
import PopularRoutes from './PopularRoutes';
import PopularBuses from './PopularBuses';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    users: 0,
    buses: 0,
    searches: 0
  });
  const [countsLoading, setCountsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Fetch counts from API
useEffect(() => {
  const fetchCounts = async () => {
    try {
      const [usersRes, busesRes, searchesRes] = await Promise.all([
        axios.get(`${API_URL}/api/counts/users`),
        axios.get(`${API_URL}/api/counts/buses`),
        axios.get(`${API_URL}/api/counts/search`)
      ]);

      setCounts({
        users: usersRes.data.totalUsers || 0,
        buses: busesRes.data.totalBuses || 0,
        searches: searchesRes.data.totalSearches || 0
      });

    } catch (error) {
      console.error('Error fetching counts:', error);
      setCounts({ users: 0, buses: 0, searches: 0 });
    } finally {
      setCountsLoading(false);
    }
  };

  fetchCounts();
}, []);


  // Animated counter component
  const AnimatedCounter = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (end === 0) return;
      
      let startTime = null;
      const startCount = 0;

      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        setCount(Math.floor(progress * end));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [end, duration]);

    return <span>{count.toLocaleString()}</span>;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      {/* Hero Section */}
      <div className="relative w-full min-h-screen flex flex-col justify-center items-center px-4 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large Purple Circles */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full opacity-15 animate-pulse delay-1000"></div>
          
          {/* Small Floating Elements */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-purple-400 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-500 rounded-full opacity-40 animate-bounce delay-500"></div>
          <div className="absolute bottom-1/3 left-1/5 w-2 h-2 bg-purple-600 rounded-full opacity-50 animate-bounce delay-1000"></div>
          <div className="absolute bottom-1/4 right-1/4 w-5 h-5 bg-purple-300 rounded-full opacity-25 animate-bounce delay-1500"></div>
          
          {/* Geometric Shapes */}
          <div className="absolute top-20 right-20 w-16 h-16 border-2 border-purple-300 rounded-lg rotate-45 opacity-30 animate-spin-slow"></div>
          <div className="absolute bottom-32 left-16 w-12 h-12 border border-purple-400 rotate-12 opacity-40"></div>
        </div>

        {/* Main Content */}
        <div className={`text-center z-10 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`}>
          {/* Hero Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 bg-clip-text text-transparent">
              Zipp
            </span>
            <br />
            <span className="text-gray-800">
              Bus
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 font-light max-w-3xl mx-auto mb-12 leading-relaxed">
            Experience seamless bus searching with our modern platform. 
            <br className="hidden md:block" />
            Fast, reliable, and designed for your comfort.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <span className="px-6 py-3 bg-white rounded-full shadow-lg text-purple-700 font-medium border border-purple-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              ✨ Instant Searching
            </span>
            <span className="px-6 py-3 bg-purple-100 rounded-full shadow-lg text-purple-800 font-medium hover:shadow-xl transition-all duration-300 hover:scale-105">
              🚌 Premium Buses
            </span>
            <span className="px-6 py-3 bg-white rounded-full shadow-lg text-purple-700 font-medium border border-purple-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              💜 Best Prices
            </span>
          </div>
        </div>

        {/* Search Container */}
        <div className={`w-full max-w-6xl z-10 transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`}>
          <div className="bg-white rounded-3xl shadow-2xl border border-purple-100 p-8 md:p-12 backdrop-blur-sm hover:shadow-purple-200/50 transition-all duration-500">
            <SearchBus />
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 120" className="w-full h-20 fill-current text-white">
            <path d="M0,64L48,74.7C96,85,192,107,288,101.3C384,96,480,64,576,58.7C672,53,768,75,864,85.3C960,96,1056,96,1152,85.3C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Content Sections */}
      <div className="relative bg-white">
        {/* Decorative Top Section */}
        <div className="w-full py-16 bg-gradient-to-r from-purple-600 to-purple-700 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                               radial-gradient(circle at 80% 50%, white 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Join millions of happy travelers who trust us for their journey
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16 bg-gradient-to-b from-purple-50 to-white">
          <div className="container mx-auto px-4">
            {countsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
               

                {/* Total Buses */}
                <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                    <AnimatedCounter end={counts.buses} />
                  </h3>
                  <p className="text-gray-600 font-medium">Buses Available</p>
                </div>

                {/* Total Searches */}
                <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                    <AnimatedCounter end={counts.searches} />
                  </h3>
                  <p className="text-gray-600 font-medium">Searches Performed</p>
                </div>
                 {/* Total Users */}
                <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                    <AnimatedCounter end={counts.users} />
                  </h3>
                  <p className="text-gray-600 font-medium">Contributors</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Popular Routes Section */}
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <PopularRoutes />
          </div>
        </div>

        {/* Popular Buses Section */}
        <div className="py-20 bg-gradient-to-br from-purple-50 via-white to-purple-50">
          <div className="container mx-auto px-4">
            <PopularBuses />
          </div>
        </div>

        {/* Footer CTA Section */}
        <div className="py-20 bg-gradient-to-r from-purple-600 to-purple-700 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 border border-white rounded-lg rotate-45"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-white rounded-full opacity-20"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready for Your Next Journey?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Book now and experience the future of bus travel
            </p>
            <button className="px-12 py-4 bg-white text-purple-600 font-bold text-lg rounded-full hover:bg-purple-50 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              Search Buses Now
            </button>
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
    </div>
  );
}

export default Home;