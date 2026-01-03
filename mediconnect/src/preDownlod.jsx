import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./pesentNavbar"; 

const PatientDownload = () => {
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) fetchAppointments();
  }, [token]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/appointment/my-appointments-patient",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching:", err.message);
    }
  };

  const handleDownload = async (appointmentId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/appointment/download-prescription/${appointmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `prescription_${appointmentId}.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Download failed. Prescription might not be available.");
    }
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Sticky Navbar stays at the very top */}
      <div style={{ position: "sticky", top: 0, zIndex: 1100 }}>
        <Navbar />
      </div>

      <div className="container-fluid p-0">
        <div className="row g-0">
          
          {/* LEFT SIDE: 30% - Fixed HD Photo Section */}
          <div className="col-md-4 d-none d-md-block" style={{ 
            height: "calc(100vh - 70px)", 
            position: "sticky", 
            top: "70px",
            zIndex: 10,
            // Updated to a high-quality medical tech image
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex", // Ensures child content is visible
            flexDirection: "column"
          }}>
            <div className="h-100 d-flex flex-column justify-content-end p-5 text-white">
              <div className="bg-primary p-2 px-3 mb-3 text-uppercase fw-bold" style={{ width: "fit-content", fontSize: "0.75rem", borderRadius: "4px" }}>
                Records
              </div>
              <h1 className="fw-bold display-5 mb-3">Medical Documents.</h1>
              <p className="opacity-75 lead">Access and download your digital prescriptions and medical reports securely.</p>
            </div>
          </div>

          {/* RIGHT SIDE: 70% - Horizontal Document Cards */}
          <div className="col-md-8 p-4 p-lg-5" style={{ minHeight: "calc(100vh - 70px)" }}>
            <h2 className="fw-bold mb-4">My Prescriptions</h2>
            
            {appointments.length === 0 ? (
              <div className="bg-white p-5 rounded-4 text-center shadow-sm">
                <p className="text-muted fs-5">No prescriptions found in your account.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {appointments.map((apt) => (
                  <div key={apt._id} className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="row g-0 align-items-center">
                      
                      {/* Card Icon Area */}
                      <div className="col-sm-2 bg-light d-flex align-items-center justify-content-center py-4" style={{ minHeight: "150px" }}>
                        <i className="bi bi-file-earmark-pdf-fill text-primary" style={{ fontSize: "3rem" }}></i>
                      </div>

                      {/* Content Area */}
                      <div className="col-sm-10 p-4">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h5 className="fw-bold mb-1">Dr. {apt.doctorId?.name}</h5>
                            <p className="text-primary small mb-1 fw-semibold">{apt.doctorId?.specialization}</p>
                            <p className="text-muted mb-0 small">
                                <i className="bi bi-calendar3 me-2"></i>{apt.date}
                            </p>
                          </div>
                          <div className="text-end">
                            {apt.prescriptionImage ? (
                                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-2">
                                    Ready
                                </span>
                            ) : (
                                <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle rounded-pill px-3 py-2">
                                    Pending
                                </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-3">
                            {apt.prescriptionImage ? (
                              <button 
                                className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"
                                onClick={() => handleDownload(apt._id)}
                              >
                                <i className="bi bi-download me-2"></i> Download Prescription
                              </button>
                            ) : (
                              <button className="btn btn-light rounded-pill px-4 border text-muted disabled">
                                Not Uploaded Yet
                              </button>
                            )}
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

export default PatientDownload;