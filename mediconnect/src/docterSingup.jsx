import React, { useState } from "react";
import axios from "axios";
import Navbar from "./homeNavbar";

function DoctorRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    experience: "",
    hospitalName: "",
    contactNumber: "",
    profileImage: "",
    hourlyRate: "", // ✅ Consultation Fee
    availableDays: [], // ✅ Selected Working Days
  });

  const [message, setMessage] = useState("");

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle selecting/deselecting working days
  const handleDayChange = (day) => {
    let updatedDays = [...formData.availableDays];
    if (updatedDays.includes(day)) {
      updatedDays = updatedDays.filter((d) => d !== day);
    } else {
      updatedDays.push(day);
    }
    setFormData({ ...formData, availableDays: updatedDays });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/doctor/register",
        formData
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="card shadow-lg border-0 mx-auto rounded-4" style={{ maxWidth: "600px" }}>
          <div className="card-body p-5">
            <h3 className="text-center text-primary mb-4 fw-bold">
              Doctor Registration
            </h3>

            {message && (
              <div className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"} rounded-pill text-center small`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="small fw-bold text-muted">Full Name</label>
                  <input className="form-control" name="name" placeholder="Dr. John Doe" required onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="small fw-bold text-muted">Email Address</label>
                  <input className="form-control" name="email" type="email" placeholder="john@example.com" required onChange={handleChange} />
                </div>
              </div>

              <div className="mb-3">
                <label className="small fw-bold text-muted">Password</label>
                <input className="form-control" name="password" type="password" placeholder="Min. 8 characters" required onChange={handleChange} />
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="small fw-bold text-muted">Specialization</label>
                  <input className="form-control" name="specialization" placeholder="e.g. Cardiologist" required onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="small fw-bold text-muted">Experience (Years)</label>
                  <input className="form-control" name="experience" type="number" placeholder="5" required onChange={handleChange} />
                </div>
              </div>

              <div className="mb-3">
                <label className="small fw-bold text-primary">Consultation Fee (₹)</label>
                <input className="form-control border-primary" name="hourlyRate" type="number" placeholder="Enter fee per session" required onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label className="small fw-bold text-muted">Hospital Name</label>
                <input className="form-control" name="hospitalName" placeholder="City General Hospital" onChange={handleChange} />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="small fw-bold text-muted">Contact Number</label>
                  <input className="form-control" name="contactNumber" placeholder="+91 0000000000" onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="small fw-bold text-muted">Profile Image URL</label>
                  <input className="form-control" name="profileImage" placeholder="https://image-link.com" onChange={handleChange} />
                </div>
              </div>

              {/* WORKING DAYS UI */}
              <div className="mb-4">
                <label className="small fw-bold text-muted d-block mb-2 text-uppercase">Working Days</label>
                <div className="d-flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      type="button"
                      className={`btn btn-sm rounded-pill px-3 transition ${formData.availableDays.includes(day) ? 'btn-primary shadow-sm' : 'btn-outline-secondary opacity-75'}`}
                      onClick={() => handleDayChange(day)}
                    >
                      {day.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <button className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow">
                REGISTER AS DOCTOR
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .transition { transition: all 0.2s ease-in-out; }
        .form-control:focus { border-color: #0d6efd; box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15); }
      `}</style>
    </>
  );
}

export default DoctorRegister;