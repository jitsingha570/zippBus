import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaQuestionCircle, FaUser, FaSignInAlt, FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="w-full  bg-gradient-to-r from-purple-600 via-purple-700 to-purple-600 text-white shadow-xl relative z-50">
      <div className="max-w-7xl  mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-purple-700 rounded transform rotate-12"></div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
              ZippBus
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <NavButton to="/" icon={<FaHome />} label="Home" />
            <NavButton to="/help" icon={<FaQuestionCircle />} label="Help" />
            <NavButton to="/login" icon={<FaSignInAlt />} label="Login" />
            <NavButton to="/account" icon={<FaUser />} label="Account" />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="w-5 h-5" />
            ) : (
              <FaBars className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-64 opacity-100 mt-4' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-2">
            <MobileNavButton to="/" icon={<FaHome />} label="Home" onClick={toggleMobileMenu} />
            <MobileNavButton to="/help" icon={<FaQuestionCircle />} label="Help" onClick={toggleMobileMenu} />
            <MobileNavButton to="/login" icon={<FaSignInAlt />} label="Login" onClick={toggleMobileMenu} />
            <MobileNavButton to="/account" icon={<FaUser />} label="Account" onClick={toggleMobileMenu} />
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full"></div>
        <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full"></div>
      </div>
    </nav>
  );
}

function NavButton({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 group relative overflow-hidden"
    >
      {/* Background animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
      
      <div className="relative flex items-center space-x-2">
        <div className="text-lg group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <span className="font-medium hidden sm:inline group-hover:text-purple-100 transition-colors duration-300">
          {label}
        </span>
      </div>
    </Link>
  );
}

function MobileNavButton({ to, icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 w-full"
    >
      <div className="text-lg">
        {icon}
      </div>
      <span className="font-medium">
        {label}
      </span>
    </Link>
  );
}

export default Navbar;