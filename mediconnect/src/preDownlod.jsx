import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./pesentNavbar"; 

const PatientDownload = () => {
  const [appointments, setAppointments] = useState([]);
  const [showQRFor, setShowQRFor] = useState(null); // Track which card shows QR
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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

  const handleDone = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/appointment/mark-done/${id}`,
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setAppointments((prev) => 
          prev.map((apt) => apt._id === id ? { ...apt, status: "done" } : apt)
        );
        alert("Status updated! You can now pay.");
      }
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handleDownload = async (appointmentId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/appointment/download-prescription/${appointmentId}`,
        { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `prescription_${appointmentId}.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Download failed.");
    }
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 1100 }}>
        <Navbar />
      </div>

      <div className="container-fluid p-0">
        <div className="row g-0">
          
          {/* LEFT SIDE: Banner */}
          <div className="col-md-4 d-none d-md-block" style={{ 
            height: "calc(100vh - 70px)", 
            position: "sticky", 
            top: "70px",
            zIndex: 10,
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            flexDirection: "column"
          }}>
            <div className="h-100 d-flex flex-column justify-content-end p-5 text-white">
              <div className="bg-primary p-2 px-3 mb-3 text-uppercase fw-bold" style={{ width: "fit-content", fontSize: "0.75rem", borderRadius: "4px" }}>
                Records
              </div>
              <h1 className="fw-bold display-5 mb-3">Medical Documents.</h1>
              <p className="opacity-75 lead">Securely manage your prescriptions and billing steps here.</p>
            </div>
          </div>

          {/* RIGHT SIDE: List */}
          <div className="col-md-8 p-4 p-lg-5">
            <h2 className="fw-bold mb-4">My Prescriptions</h2>
            
            <div className="d-flex flex-column gap-3">
              {appointments.map((apt) => (
                <div key={apt._id} className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <div className="row g-0 align-items-center">
                    
                    <div className="col-sm-2 bg-light d-flex align-items-center justify-content-center py-4" style={{ minHeight: "150px" }}>
                      <i className={`bi ${apt.status === "done" ? "bi-check-circle-fill text-success" : "bi-file-earmark-pdf-fill text-primary"}`} style={{ fontSize: "3rem" }}></i>
                    </div>

                    <div className="col-sm-10 p-4">
                      {/* Show QR Code Area if Pay Now was clicked */}
                      {showQRFor === apt._id ? (
                        <div className="text-center animate__animated animate__fadeIn">
                          <h6 className="fw-bold mb-2">Scan to Pay Dr. {apt.doctorId?.name}</h6>
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=pay_appointment_${apt._id}`} 
                            alt="Payment QR" 
                            className="img-fluid border p-2 bg-white mb-3"
                            style={{ width: "150px" }}
                          />
                          <div>
                            <button className="btn btn-sm btn-link text-muted" onClick={() => setShowQRFor(null)}>
                              Cancel Payment
                            </button>
                            <button className="btn btn-sm btn-success ms-2 rounded-pill px-3 fw-bold" onClick={() => alert("Simulating Payment Success...")}>
                              I have Paid
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h5 className="fw-bold mb-1">Dr. {apt.doctorId?.name}</h5>
                              <p className="text-primary small mb-1 fw-semibold">{apt.doctorId?.specialization}</p>
                              <p className="text-muted mb-0 small"><i className="bi bi-calendar3 me-2"></i>{apt.date}</p>
                            </div>
                            <div className="text-end">
                              <span className={`badge rounded-pill px-3 py-2 border ${apt.status === "done" ? "bg-success-subtle text-success border-success-subtle" : "bg-warning-subtle text-warning border-warning-subtle"}`}>
                                {apt.status === "done" ? "Ready" : "Action Required"}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-4 d-flex gap-2">
                              {apt.prescriptionImage && (
                                <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" onClick={() => handleDownload(apt._id)}>
                                  <i className="bi bi-download me-2"></i> Download
                                </button>
                              )}

                              {apt.status === "done" ? (
                                <button 
                                  className="btn btn-success rounded-pill px-4 fw-bold shadow-sm"
                                  onClick={() => setShowQRFor(apt._id)}
                                >
                                  <i className="bi bi-qr-code me-2"></i> Pay Now
                                </button>
                              ) : (
                                <button 
                                  className="btn btn-outline-dark rounded-pill px-4 fw-bold"
                                  onClick={() => handleDone(apt._id)}
                                >
                                  Done
                                </button>
                              )}
                          </div>
                        </>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PatientDownload;