import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./doctorNavbar1"; 

function PreUpload() {
  const [appointments, setAppointments] = useState([]);
  const [files, setFiles] = useState({});
  const [messages, setMessages] = useState({});

  const token = localStorage.getItem("doctorToken");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/appointment/my-appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err.response?.data || err.message);
    }
  };

  const handleFileChange = (e, appointmentId) => {
    setFiles({ ...files, [appointmentId]: e.target.files[0] });
  };

  const handleUpload = async (appointmentId) => {
    if (!files[appointmentId]) {
      setMessages({ ...messages, [appointmentId]: "Please select a file first" });
      return;
    }

    const formData = new FormData();
    formData.append("prescription", files[appointmentId]);

    try {
      const res = await axios.post(
        `http://localhost:5000/appointment/upload-prescription/${appointmentId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages({ ...messages, [appointmentId]: "File uploaded successfully!" });
      fetchAppointments();
    } catch (err) {
      setMessages({
        ...messages,
        [appointmentId]: "Upload failed: " + (err.response?.data?.error || err.message),
      });
    }
  };

  return (
    <div style={{ backgroundColor: "#f4f7f6", minHeight: "100vh" }}>
      {/* 1. Sticky Navbar */}
      <div style={{ position: "sticky", top: 0, zIndex: 1100 }}>
        <Navbar />
      </div>

      <div className="container-fluid p-0">
        <div className="row g-0">
          
          {/* 2. LEFT SIDE: 30% Fixed Photo Section */}
          {/* Added 'display: block' and a more stable HD URL */}
          <div className="col-md-4 d-none d-md-block" style={{ 
            height: "calc(100vh - 70px)", 
            position: "sticky", 
            top: "70px",
            zIndex: 10,
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=1200&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}>
            <div className="h-100 d-flex flex-column justify-content-end p-5 text-white">
              <div className="bg-primary p-2 px-3 mb-3 text-uppercase fw-bold" style={{ width: "fit-content", fontSize: "0.75rem", borderRadius: "4px" }}>
                Doctor Portal
              </div>
              <h1 className="fw-bold display-5 mb-3">Clinical<br/>Documentation.</h1>
              <p className="opacity-75 lead">Securely upload patient prescriptions and medical reports to the digital vault.</p>
            </div>
          </div>

          {/* 3. RIGHT SIDE: 70% Horizontal Design Section */}
          <div className="col-md-8 p-4 p-lg-5">
            <h2 className="fw-bold mb-4" style={{ color: "#333" }}>Upload Documents</h2>
            
            {appointments.length === 0 ? (
              <div className="bg-white p-5 rounded-4 text-center shadow-sm">
                <p className="text-muted fs-5">No appointments found.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                {appointments.map((appointment) => (
                  <div key={appointment._id} className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="row g-0 align-items-center">
                      
                      <div className="col-sm-3 bg-light d-flex align-items-center justify-content-center py-4" style={{minHeight: "160px"}}>
                        <div className="text-center">
                            <i className="bi bi-file-earmark-medical-fill text-primary" style={{ fontSize: "3rem" }}></i>
                            <div className="text-muted small mt-2">ID: {appointment._id.slice(-6)}</div>
                        </div>
                      </div>

                      <div className="col-sm-9 p-4">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h4 className="fw-bold mb-1">Patient: {appointment.patientId?.name}</h4>
                            <p className="text-muted small mb-0">
                                <i className="bi bi-calendar3 me-2 text-primary"></i> 
                                {new Date(appointment.date).toLocaleDateString()} | {appointment.timeSlot}
                            </p>
                          </div>
                          <div className="text-end">
                            {appointment.prescriptionImage ? (
                                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3">
                                    <i className="bi bi-check2-all me-1"></i> Uploaded
                                </span>
                            ) : (
                                <span className="badge bg-warning-subtle text-warning border border-warning-subtle rounded-pill px-3">
                                    <i className="bi bi-clock-history me-1"></i> Pending
                                </span>
                            )}
                          </div>
                        </div>

                        <hr className="my-3" style={{opacity: "0.1"}} />

                        <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center">
                          <div className="flex-grow-1">
                            <input
                              type="file"
                              className="form-control form-control-sm rounded-pill"
                              onChange={(e) => handleFileChange(e, appointment._id)}
                            />
                          </div>
                          
                          <button
                            className="btn btn-primary rounded-pill px-4 fw-bold"
                            onClick={() => handleUpload(appointment._id)}
                          >
                            <i className="bi bi-cloud-arrow-up-fill me-2"></i> Upload
                          </button>
                        </div>

                        {messages[appointment._id] && (
                          <div className={`mt-3 small fw-bold ${messages[appointment._id].includes("successfully") ? "text-success" : "text-danger"}`}>
                            {messages[appointment._id]}
                          </div>
                        )}

                        {appointment.prescriptionImage && (
                          <div className="mt-2 text-success small">
                            <i className="bi bi-file-check me-1"></i> File: {appointment.prescriptionImage}
                          </div>
                        )}
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
}

export default PreUpload;