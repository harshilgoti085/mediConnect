import React, { useState } from "react";
import axios from "axios";

function DoctorLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/Doctor/login", formData);
      localStorage.setItem("token", res.data.token);
      setMessage("Login successful!");
      setTimeout(() => {
        window.location.href = "/doctor/dashboard";
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow mx-auto" style={{ maxWidth: "400px" }}>
        <div className="card-body">
          <h3 className="text-center text-success mb-4 fw-bold">Doctor Login</h3>

          {message && <div className="alert alert-info">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                required
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                required
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-success w-100">
              Login
            </button>
          </form>

          <p className="mt-3 text-center">
            Don’t have an account?{" "}
            <a href="/doctor/register" className="text-decoration-none">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default DoctorLogin;
