import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./doctorNavbar1"; 

function PreUpload() {
  const [appointments, setAppointments] = useState([]);
  const [files, setFiles] = useState({});
  const [messages, setMessages] = useState({});
  
  const token = localStorage.getItem("doctorToken");

  useEffect(() => {
    if (token) fetchAppointments();
  }, [token]);

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
      await axios.post(
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
      <div style={{ position: "sticky", top: 0, zIndex: 1100 }}>
        <Navbar />
      </div>

      <div className="container-fluid p-0">
        <div className="row g-0">
          
          {/* LEFT SIDE: Fixed Banner */}
          <div className="col-md-4 d-none d-md-block" style={{ 
            height: "calc(100vh - 70px)", 
            position: "sticky", 
            top: "70px",
            zIndex: 10,
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=1200&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}>
            <div className="h-100 d-flex flex-column justify-content-end p-5 text-white">
              <h1 className="fw-bold display-5 mb-3">Clinical Documentation.</h1>
              <p className="opacity-75 lead">Upload prescriptions and manage patient medical records securely.</p>
            </div>
          </div>

          {/* RIGHT SIDE: Appointment List */}
          <div className="col-md-8 p-4 p-lg-5">
            <h2 className="fw-bold mb-4">Patient Records</h2>
            
            <div className="d-flex flex-column gap-4">
              {appointments.length === 0 ? (
                <div className="bg-white p-5 rounded-4 text-center shadow-sm">
                  <p className="text-muted fs-5">No appointments found.</p>
                </div>
              ) : (
                appointments.map((appointment) => (
                  <div key={appointment._id} className="card border-0 shadow-sm rounded-4 overflow-hidden position-relative">
                    
                    <div className="row g-0 align-items-center">
                      <div className="col-sm-3 bg-light d-flex align-items-center justify-content-center py-4">
                        <i className="bi bi-person-circle text-primary" style={{ fontSize: "3rem" }}></i>
                      </div>

                      <div className="col-sm-9 p-4">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h4 className="fw-bold mb-1">{appointment.patientId?.name}</h4>
                            <p className="text-muted small mb-0">{appointment.date} | {appointment.timeSlot}</p>
                          </div>
                          {/* Payment button removed from here */}
                        </div>

                        <hr className="my-3 opacity-10" />

                        {/* UPLOAD SECTION */}
                        <div className="d-flex flex-column flex-md-row gap-3 mt-3">
                          <div className="flex-grow-1">
                            <label className="small text-muted mb-1">Select Prescription File</label>
                            <input 
                              type="file" 
                              className="form-control form-control-sm rounded-pill" 
                              onChange={(e) => handleFileChange(e, appointment._id)} 
                            />
                          </div>
                          <div className="align-self-end">
                            <button 
                              className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" 
                              onClick={() => handleUpload(appointment._id)}
                            >
                              <i className="bi bi-cloud-arrow-up me-2"></i>Upload
                            </button>
                          </div>
                        </div>
                        
                        {messages[appointment._id] && (
                          <div className={`mt-2 small fw-bold ${messages[appointment._id].includes("success") ? "text-success" : "text-danger"}`}>
                            {messages[appointment._id]}
                          </div>
                        )}

                        {appointment.prescriptionImage && (
                          <div className="mt-2 text-success small">
                            <i className="bi bi-file-check me-1"></i> File currently on record: {appointment.prescriptionImage}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreUpload;