import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/navbar.jsx";
import Dashboard from "./pages/Dashboard";
import BusList from "./pages/BusList";
import RouteList from "./pages/RouteList";
import AddNewBus from "./pages/addnew.jsx";
import AdminRequestsPage from "./pages/AdminRequestsPage.jsx";
import AdminRegister from "./pages/AdminRegister.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminVerifyOtp from "./pages/AdminVerifyOtp.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");

  // Listen for login changes from any component
  useEffect(() => {
    const checkToken = () => {
      setToken(localStorage.getItem("adminToken"));
    };

    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  return (
    <Router>
      {/* Show Navbar only when logged in */}
    

      <Routes>
        {/* Redirect "/" to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<AdminLogin setToken={setToken} />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/verify-otp" element={<AdminVerifyOtp />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute token={token}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/buses"
          element={
            <ProtectedRoute token={token}>
              <BusList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/routes"
          element={
            <ProtectedRoute token={token}>
              <RouteList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/addnew"
          element={
            <ProtectedRoute token={token}>
              <AddNewBus />
            </ProtectedRoute>
          }
        />

        <Route
          path="/request"
          element={
            <ProtectedRoute token={token}>
              <AdminRequestsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
