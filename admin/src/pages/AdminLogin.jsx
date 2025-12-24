import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (message) setMessage("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setMessage("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/admins/login", {
        email: form.email,
        password: form.password,
      });

     const token = res.data?.token;

if (!token) {
  setMessage("Invalid response from server.");
  return;
}

// 🔐 Validate admin role from token
const decoded = JSON.parse(atob(token.split(".")[1]));

if (decoded.role !== "admin") {
  setMessage("Access denied: Not an admin account");
  return;
}

localStorage.setItem("adminToken", token);
localStorage.setItem("admin", JSON.stringify(res.data.admin));

navigate("/dashboard");
 
      if (res.data.admin) {
        localStorage.setItem("admin", JSON.stringify(res.data.admin));
      }

      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);

    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setMessage("Please fill in all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/admins/register", {
        name: form.name,
        email: form.email,
        password: form.password
      });

      setMessage("Registration successful! Please login.");
      setTimeout(() => {
        setIsLogin(true);
        setForm({ name: "", email: form.email, password: "", confirmPassword: "" });
        setMessage("");
      }, 2000);

    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center px-4 relative">

      {/* Form Container */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-100 p-8 md:p-10 relative z-10">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
            ZippBus
          </h1>
          <p className="text-gray-600 text-lg">
            {isLogin ? "Welcome back, Admin!" : "Create your admin account"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit} className="space-y-6">

          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-purple-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl"
                disabled={loading}
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-purple-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter admin email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-purple-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={isLogin ? "Enter your password" : "Create a password"}
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl"
                disabled={loading}
              />

              <button
                type="button"
                className="absolute right-4 top-3 text-purple-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-purple-700 mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl"
                disabled={loading}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700"
          >
            {loading ? (isLogin ? "Signing in..." : "Creating account...") : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <div className={`mt-6 p-4 rounded-lg text-center font-medium ${
            message.includes("successful")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        {/* Switch Mode */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              className="text-purple-600 ml-1 font-semibold"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
                setForm({ name: "", email: "", password: "", confirmPassword: "" });
              }}
            >
              {isLogin ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>

        {/* User Login Link */}
        {isLogin && (
          <div className="mt-4 text-center">
            <Link to="/login" className="text-sm text-purple-600 underline">
              Not an admin? User Login →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
