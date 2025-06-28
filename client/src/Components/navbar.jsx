import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaPlus, FaQuestionCircle, FaUser } from 'react-icons/fa';

function Navbar() {
  return (
    <nav className="w-full bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold">ZippBus</div>

        <div className="flex gap-6">
          <NavButton to="/" icon={<FaHome />} label="Home" />
          <NavButton to="/addnew" icon={<FaPlus />} label="Add New Bus" />
          <NavButton to="/help" icon={<FaQuestionCircle />} label="Help" />
          <NavButton to="/account" icon={<FaUser />} label="Account" />
        </div>
      </div>
    </nav>
  );
}

function NavButton({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 text-white hover:text-yellow-300 transition"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

export default Navbar;
