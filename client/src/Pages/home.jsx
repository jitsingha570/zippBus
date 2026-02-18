import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBus from './SearchBus';
import SearchBusByName from './SearchBusByName';
import PopularRoutes from './PopularRoutes';
import PopularBuses from './PopularBuses';
import { useNavigate } from 'react-router-dom';
import imag1 from '../assets/images/img1.jpg';
import imag2 from '../assets/images/img2.jpg';
import imag3 from '../assets/images/img3.jpg';
import imag4 from '../assets/images/img4.jpg';
import imag5 from '../assets/images/img5.jpg';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [counts, setCounts] = useState({
    users: 0,
    buses: 0,
    searches: 0
  });
  const [countsLoading, setCountsLoading] = useState(true);

  // Slider images - using actual images from assets folder
  const sliderImages = [
    imag1,
    imag2,
    imag3,
    imag4,
    imag5
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-advance slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [sliderImages.length]);

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

  const navigate = useNavigate();
  const goToAllBuses = () => {
    navigate("/allbuses");
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 ">
      
      {/* Hero Section with Slider Background */}
      <div className="relative w-full min-h-screen flex flex-col justify-center items-center px-4 overflow-hidden pt-20">
        {/* Slider Background Container */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Slider Images */}
          {sliderImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-8000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Background Image */}
              <img 
                src={image}
                alt={`Slide ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Blur and Overlay Effect */}
              <div className="absolute inset-0 backdrop-blur-xs bg-white/20" />
              
              {/* Additional gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-purple-900/30" />
            </div>
          ))}

          {/* Additional Decorative Elements */}
          <div className="absolute inset-0 opacity-80">
            {/* Large Purple Circles */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-80 animate-pulse"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full opacity-80 animate-pulse delay-1000"></div>
            
            {/* Small Floating Elements */}
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white rounded-full opacity-80 animate-float"></div>
            <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-white rounded-full opacity-80 animate-float-delay-1"></div>
            <div className="absolute bottom-1/3 left-1/5 w-2 h-2 bg-white rounded-full opacity-80 animate-float-delay-2"></div>
            <div className="absolute bottom-1/4 right-1/4 w-5 h-5 bg-white rounded-full opacity-85 animate-float-delay-3"></div>
            
            {/* Geometric Shapes */}
            <div className="absolute top-20 right-20 w-16 h-16 border-2 border-white/40 rounded-lg rotate-45 opacity-80 animate-spin-slow"></div>
            <div className="absolute bottom-32 left-16 w-12 h-12 border border-white/50 rotate-12 opacity-80"></div>
          </div>
        </div>

        {/* Slider Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide 
                  ? 'w-8 h-3 bg-white shadow-lg' 
                  : 'w-3 h-3 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className={`text-center z-10 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`}>
          {/* Hero Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight drop-shadow-lg">
            <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
              ZipX
            </span>
            <br />
            <span className="text-white drop-shadow-2xl">
              Bus
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white font-light max-w-3xl mx-auto mb-12 leading-relaxed drop-shadow-lg">
            Experience seamless bus searching with our modern platform. 
            <br className="hidden md:block" />
            Fast, reliable, and designed for your comfort.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <span className="px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-purple-700 font-medium border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white">
              ✨ Instant Searching
            </span>
            <span className="px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg text-purple-800 font-medium hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/90">
              🚌 Premium Buses
            </span>
            <span className="px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-purple-700 font-medium border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white">
              💜 Best Prices
            </span>
          </div>
        </div>

        {/* Search Container */}
        <div className={`w-full max-w-6xl z-10 transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`}>
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 p-8 md:p-12 hover:shadow-purple-200/50 transition-all duration-500">
            <SearchBus />
          </div>
        </div>
       
        {/* Search bus by name or number */}
        <div className={`w-full max-w-6xl z-10 mt-6 transform transition-all duration-1000 delay-400 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`}>
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 p-8 md:p-12 hover:shadow-purple-200/50 transition-all duration-500">
            <SearchBusByName />
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
              Explore now and experience the future of bus travel
            </p>
            <button 
              onClick={goToAllBuses}
              className="px-12 py-4 bg-white text-purple-600 font-bold text-lg rounded-full hover:bg-purple-50 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Explore Buses Now
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
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delay-1 {
          animation: float 3s ease-in-out infinite;
          animation-delay: 0.5s;
        }
        
        .animate-float-delay-2 {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .animate-float-delay-3 {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}

export default Home;