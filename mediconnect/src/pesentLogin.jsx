import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Navbar from "./homeNavbar";

const PatientLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure the endpoint matches your backend route exactly
      const res = await axios.post("http://localhost:5000/pesent/login", formData);
      
      setMessage("Login successful!");
      
      // Store the token and patientId for future requests
      localStorage.setItem("token", res.data.token);
      // It's a good idea to store the ID if you need it for booking
      localStorage.setItem("patientId", res.data.user?._id || res.data.patientId);

      // Navigate to the Home page after a short delay so the user sees the success message
      setTimeout(() => {
        navigate("/DoctorBooking"); 
      }, 1500);

    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5" style={{ maxWidth: "500px" }}>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <div className="card shadow-lg p-4">
          <h3 className="text-center mb-4 text-success fw-bold">🔑 Patient Login</h3>

          {message && (
            <div className={`alert ${message.includes("successful") ? "alert-success" : "alert-info"}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PatientLogin;