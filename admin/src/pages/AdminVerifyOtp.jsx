import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const AdminVerifyOtp = () => {
  const location = useLocation();
  const email = location.state?.email; // email passed from registration page

  const [form, setForm] = useState({
    userOtp: "",
    ownerOtp: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_URL}/api/admins/register/verify`,
        { email, ...form }
      );

      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div>
      <h2>Verify Admin Registration OTP</h2>

      <p>Email: <strong>{email}</strong></p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="userOtp"
          placeholder="User OTP"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="ownerOtp"
          placeholder="Owner OTP"
          onChange={handleChange}
          required
        />

        <button type="submit">Verify</button>
      </form>

      <p>{message}</p>
    </div>
  );
};

export default AdminVerifyOtp;
