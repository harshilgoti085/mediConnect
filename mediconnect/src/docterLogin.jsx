import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./homeNavbar";

function DoctorLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/doctor/login",
        {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      // ✅ SAVE TOKEN WITH CORRECT KEY
      localStorage.setItem("doctorToken", res.data.token);

      navigate("/doctor/approved");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="card shadow mx-auto" style={{ maxWidth: "400px" }}>
          <div className="card-body">
            <h3 className="text-center fw-bold mb-4">Doctor Login</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                className="form-control mb-3"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleChange}
              />

              <input
                type="password"
                name="password"
                className="form-control mb-3"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
              />

              <button className="btn btn-success w-100" type="submit">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default DoctorLogin;
