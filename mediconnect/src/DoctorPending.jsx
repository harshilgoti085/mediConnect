import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./doctorNavbar1";
import { useNavigate } from "react-router-dom";

const DoctorPending = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const styles = {
    pageWrapper: { 
      display: "flex", 
      minHeight: "100vh", 
      backgroundColor: "#f8f9fa",
      paddingTop: "70px" 
    },
    navContainer: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000 
    },
    leftSide: {
      width: "30%",
      height: "calc(100vh - 70px)",
      position: "fixed",
      left: 0,
      top: "70px",
      backgroundImage: "url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      zIndex: 10
    },
    overlay: {
      height: "100%",
      width: "100%",
      background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      padding: "40px",
      color: "white"
    },
    rightSide: {
      width: "70%",
      marginLeft: "30%", 
      padding: "40px 60px"
    },
    horizontalCard: {
      backgroundColor: "white",
      borderRadius: "16px",
      border: "none",
      boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
      marginBottom: "20px"
    }
  };

  const fetchAppointments = async () => {
    const token = localStorage.getItem("doctorToken");
    if (!token) return navigate("/doctor-login");
    try {
      const res = await axios.get("http://localhost:5000/appointment/my-appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data.filter((app) => app.status === "pending"));
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleAction = async (id, action) => {
    const token = localStorage.getItem("doctorToken");
    try {
      await axios.post(`http://localhost:5000/appointment/${action}`, { appointmentId: id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAppointments();
    } catch { 
      alert("Action failed"); 
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center mt-5">
      <div className="spinner-border text-primary"></div>
    </div>
  );

  return (
    <div>
      <div style={styles.navContainer}>
        <Navbar />
      </div>

      <div style={styles.pageWrapper}>
        <div style={styles.leftSide}>
          <div style={styles.overlay}>
            <span className="badge bg-info text-dark align-self-start mb-3 fw-bold">HEALTH INSIGHT</span>
            <h2 className="fw-bold mb-3">Prioritize Your Patients</h2>
            <p className="opacity-75 lead">
              "A patient is the most important visitor on our premises."
            </p>
            <div className="mt-4 pt-4 border-top border-light border-opacity-25">
               <small className="d-block text-uppercase opacity-50 mb-2">Daily Tip</small>
               <p className="small">Provide a personalized consultation experience.</p>
            </div>
          </div>
        </div>

        <div style={styles.rightSide}>
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h1 className="fw-bold text-dark h3">Pending Requests</h1>
              <p className="text-muted mb-0">Review your incoming patient queue</p>
            </div>
            <div className="text-end">
               <div className="h2 fw-bold text-primary mb-0">{appointments.length}</div>
               <small className="text-muted fw-bold">WAITING</small>
            </div>
          </div>

          {appointments.length > 0 ? (
            appointments.map((app) => (
              <div key={app._id} className="card p-3" style={styles.horizontalCard}>
                <div className="row align-items-center">
                  <div className="col-md-5">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: "50px", height: "50px"}}>
                        <i className="bi bi-person-heart fs-4"></i>
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold">{app.patientId?.name || "Unknown Patient"}</h6>
                        {/* UPDATED: Dynamically showing the reason from the database */}
                        <small className="text-primary fw-semibold">
                          {app.reason ? app.reason : "General Checkup"}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="d-flex flex-column">
                      <span className="fw-medium text-secondary small mb-1">
                        <i className="bi bi-calendar-event me-2"></i>{app.date ? new Date(app.date).toLocaleDateString() : "No Date"}
                      </span>
                      <span className="fw-medium text-secondary small">
                        <i className="bi bi-clock me-2"></i>{app.timeSlot}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-4 text-end">
                    <button onClick={() => handleAction(app._id, "approve")} className="btn btn-primary px-4 me-2 shadow-sm" style={{borderRadius: "10px"}}>Approve</button>
                    <button onClick={() => handleAction(app._id, "reject")} className="btn btn-outline-danger px-4" style={{borderRadius: "10px"}}>Reject</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5 bg-white rounded-4 shadow-sm">
              <h5 className="text-muted">No new requests today.</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorPending;