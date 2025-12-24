import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const admin = localStorage.getItem("admin");
    
    if (token) {
      setIsAuthenticated(true);
      if (admin) {
        try {
          const adminData = JSON.parse(admin);
          setAdminName(adminData.name || "Admin");
        } catch (err) {
          setAdminName("Admin");
        }
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    setIsAuthenticated(false);
    navigate("/admin-login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-purple-600 text-white shadow-xl relative z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-purple-700 rounded transform rotate-12"></div>
            </div>
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                ZippBus
              </div>
              <div className="text-xs text-purple-200">Admin Panel</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated ? (
            <div className="hidden lg:flex items-center space-x-1">
              <NavLink to="/dashboard" icon="📊" label="Dashboard" isActive={isActive('/dashboard')} />
              <NavLink to="/buses" icon="🚌" label="All Buses" isActive={isActive('/buses')} />
              <NavLink to="/routes" icon="🗺️" label="Routes" isActive={isActive('/routes')} />
              <NavLink to="/addnew" icon="➕" label="Add New" isActive={isActive('/addnew')} />
              <NavLink to="/request" icon="📋" label="Requests" isActive={isActive('/request')} />
              
              {/* Admin Profile Dropdown */}
              <div className="ml-4 flex items-center space-x-3">
                <div className="text-right hidden xl:block">
                  <div className="text-sm font-medium">{adminName}</div>
                  <div className="text-xs text-purple-200">Administrator</div>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">
                    {adminName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 flex items-center space-x-2"
                  title="Logout"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden xl:inline">Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex items-center space-x-2">
              <NavLink to="/admin-login" icon="🔐" label="Admin Login" isActive={isActive('/admin-login')} />
              <NavLink to="/login" icon="👤" label="User Login" isActive={isActive('/login')} />
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100 mt-4' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-2">
            {isAuthenticated ? (
              <>
                {/* Admin Info */}
                <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold">
                      {adminName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{adminName}</div>
                    <div className="text-xs text-purple-200">Administrator</div>
                  </div>
                </div>
                
                <MobileNavLink to="/dashboard" icon="📊" label="Dashboard" onClick={toggleMobileMenu} />
                <MobileNavLink to="/buses" icon="🚌" label="All Buses" onClick={toggleMobileMenu} />
                <MobileNavLink to="/routes" icon="🗺️" label="Routes" onClick={toggleMobileMenu} />
                <MobileNavLink to="/addnew" icon="➕" label="Add New" onClick={toggleMobileMenu} />
                <MobileNavLink to="/request" icon="📋" label="Requests" onClick={toggleMobileMenu} />
                
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-lg">🚪</span>
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <MobileNavLink to="/admin-login" icon="🔐" label="Admin Login" onClick={toggleMobileMenu} />
                <MobileNavLink to="/login" icon="👤" label="User Login" onClick={toggleMobileMenu} />
              </>
            )}
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

// Desktop Navigation Link Component
function NavLink({ to, icon, label, isActive }) {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 group relative overflow-hidden ${
        isActive 
          ? 'bg-white/20 text-white' 
          : 'text-white/90 hover:text-white hover:bg-white/10'
      }`}
    >
      {/* Background animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
      
      <div className="relative flex items-center space-x-2">
        <span className="text-base group-hover:scale-110 transition-transform duration-300">
          {icon}
        </span>
        <span className="font-medium hidden xl:inline group-hover:text-purple-100 transition-colors duration-300">
          {label}
        </span>
      </div>
    </Link>
  );
}

// Mobile Navigation Link Component
function MobileNavLink({ to, icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 w-full"
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}

export default Navbar;