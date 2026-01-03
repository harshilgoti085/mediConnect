import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Navbar from "./pesentNavbar";
import { useNavigate } from "react-router-dom";

const PesentSideVideoCall = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to continue");
      return;
    }

    let patientId;
    try {
      const decoded = jwtDecode(token);
      patientId = decoded.id; 
    } catch (err) {
      setError("Invalid token. Please login again.");
      return;
    }

    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/appointment/by-patient/${patientId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Only show approved appointments for video calls
        const approved = res.data.filter((apt) => apt.status === "approved");
        setAppointments(approved);
      } catch (err) {
        setError("Failed to fetch appointments");
      }
    };
    fetchAppointments();
  }, []);

  if (error) return <h4 className="p-4 text-danger">{error}</h4>;

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Sticky Navbar */}
      <div style={{ position: "sticky", top: 0, zIndex: 1050 }}>
        <Navbar />
      </div>
      
      <div className="container-fluid p-0">
        <div className="row g-0">
          
          {/* LEFT SIDE: 30% - Fixed Medical Tech Photo Section */}
          <div className="col-md-4 d-none d-md-block" style={{ 
            height: "calc(100vh - 70px)", 
            position: "sticky", 
            top: "70px",
            // Using a High-Quality Medical Tech HD Image
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1576091160550-2173dad99901?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}>
            <div className="h-100 d-flex flex-column justify-content-end p-5 text-white">
              <div className="bg-primary p-2 px-3 mb-3 text-uppercase fw-bold" style={{ width: "fit-content", fontSize: "0.75rem", borderRadius: "4px" }}>
                Health Insight
              </div>
              <h1 className="fw-bold display-5 mb-3" style={{ lineHeight: "1.2" }}>Your Wellness,<br/>Our Priority.</h1>
              <p className="opacity-75 lead" style={{ fontSize: "1rem" }}>
                "Healing is a matter of time, but it is sometimes also a matter of opportunity."
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: 70% - Horizontal Cards Section */}
          <div className="col-md-8 p-4 p-lg-5">
            <h2 className="fw-bold mb-4" style={{ color: "#333" }}>My Consultations</h2>
            
            {appointments.length === 0 ? (
              <div className="bg-white p-5 rounded-4 text-center shadow-sm">
                <i className="bi bi-calendar-x display-1 text-muted mb-3"></i>
                <p className="text-muted fs-5">No approved appointments found for video consultation.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                {appointments.map((apt) => (
                  <div key={apt._id} className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ transition: "all 0.3s ease" }}>
                    <div className="row g-0 align-items-center">
                      
                      {/* Doctor Avatar Section */}
                      <div className="col-sm-3 bg-light d-flex align-items-center justify-content-center py-4" style={{minHeight: "180px"}}>
                        <img 
                          src="https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg" 
                          alt="Doctor"
                          style={{ width: "120px", height: "120px", borderRadius: "20px", objectFit: "cover" }}
                        />
                      </div>

                      {/* Consultation Details Section */}
                      <div className="col-sm-9 p-4">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h4 className="fw-bold mb-1">Dr. {apt.doctorId?.name}</h4>
                            <p className="text-primary fw-bold mb-1">{apt.doctorId?.specialization || "General Medicine"}</p>
                            <p className="text-muted small mb-0">
                              <i className="bi bi-geo-alt-fill me-1 text-danger"></i> {apt.doctorId?.hospitalName || "MediConnect Hospital"}
                            </p>
                          </div>
                          <div className="text-end">
                            <span className="text-muted small d-block" style={{fontSize: "0.7rem"}}>FEE</span>
                            <h4 className="fw-bold text-primary">₹500</h4>
                          </div>
                        </div>

                        <div className="d-flex flex-wrap gap-2 my-3">
                           <span className="badge bg-light text-dark border border-secondary-subtle p-2 px-3 rounded-3">
                              <i className="bi bi-calendar3 me-2 text-primary"></i> {apt.date}
                            </span>
                            <span className="badge bg-light text-dark border border-secondary-subtle p-2 px-3 rounded-3">
                              <i className="bi bi-clock me-2 text-primary"></i> {apt.timeSlot}
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex gap-2">
                            <button className="btn btn-outline-secondary rounded-pill px-4 flex-grow-1 fw-semibold">View Profile</button>
                            <button 
                                className="btn btn-primary rounded-pill px-4 flex-grow-1 fw-bold shadow-sm" 
                                onClick={() => navigate(`/VideoCall?room=${apt._id}`)} // Use Appointment ID as unique room
                            >
                                <i className="bi bi-camera-video-fill me-2"></i> Join Call
                            </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default PesentSideVideoCall;