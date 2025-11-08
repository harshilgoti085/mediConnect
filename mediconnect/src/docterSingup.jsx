import React, { useState } from "react";
import axios from "axios";

function DoctorRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    experience: "",
    hospitalName: "",
    contactNumber: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/Doctor/register", formData);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow mx-auto" style={{ maxWidth: "500px" }}>
        <div className="card-body">
          <h3 className="text-center text-primary mb-4 fw-bold">
            Doctor Registration
          </h3>

          {message && <div className="alert alert-info">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                required
                onChange={handleChange}
              />
            </div>

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

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                required
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Specialization</label>
              <input
                type="text"
                className="form-control"
                name="specialization"
                required
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Experience (years)</label>
              <input
                type="number"
                className="form-control"
                name="experience"
                required
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Hospital Name</label>
              <input
                type="text"
                className="form-control"
                name="hospitalName"
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Contact Number</label>
              <input
                type="text"
                className="form-control"
                name="contactNumber"
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>
          </form>

          <p className="mt-3 text-center">
            Already have an account?{" "}
            <a href="/doctor/login" className="text-decoration-none">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default DoctorRegister;
