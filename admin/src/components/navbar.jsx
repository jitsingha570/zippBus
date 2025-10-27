import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <div className="space-x-6">
        <Link to="/" className="hover:text-gray-200">Dashboard</Link>
        <Link to="/buses" className="hover:text-gray-200">All Buses</Link>
        <Link to="/routes" className="hover:text-gray-200">All Routes</Link>
        <Link to="/addnew" className="hover:text-gray-200">Add New </Link>
        <Link to="/request" className="hover:text-gray-200">request </Link>
        <Link to="/register" className="hover:text-gray-200">Registration </Link>
        <Link to="/login" className="hover:text-gray-200">Login </Link>
      </div>
    </nav>
  );
}

export default Navbar;
