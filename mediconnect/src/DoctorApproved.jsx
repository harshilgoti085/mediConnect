import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./doctorNavbar1";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("approved");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  const styles = {
    container: { backgroundColor: "#f0f2f5", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
    sidebar: {
      background: "white",
      borderRadius: "20px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
      overflow: "hidden",
      height: "fit-content",
      position: "sticky",
      top: "20px"
    },
    mainContent: {
      backgroundColor: "white",
      borderRadius: "20px",
      padding: "30px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
    },
    profileImg: {
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "4px solid #667eea",
      marginBottom: "15px"
    },
    toggleBtn: (active) => ({
      padding: "10px 25px",
      borderRadius: "12px",
      fontWeight: "600",
      transition: "0.3s",
      border: "none",
      backgroundColor: active ? "#667eea" : "#f8f9fa",
      color: active ? "white" : "#6c757d",
    })
  };

  const fetchData = async () => {
    const token = localStorage.getItem("doctorToken");
    if (!token) return navigate("/doctor-login");
    try {
      const [profRes, appRes] = await Promise.all([
        axios.get("http://localhost:5000/doctor/profile", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:5000/appointment/my-appointments", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setDoctor(profRes.data);
      setEditData(profRes.data); // Initialize edit form with current data
      setAppointments(appRes.data.filter(a => a.status !== "pending"));
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("doctorToken");
    try {
      const res = await axios.put("http://localhost:5000/doctor/update-profile", editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
      setDoctor(res.data.doctor);
      setShowEditModal(false);
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  const filteredAppointments = appointments.filter(a => a.status === view);

  return (
    <div style={styles.container}>
      <Navbar />
      <div className="container py-5">
        <div className="row g-4">
          
          {/* LEFT SIDE: PROFILE */}
          <div className="col-lg-4">
            <div style={styles.sidebar} className="p-4 text-center">
              <img 
                src="https://img.freepik.com/free-photo/doctor-offering-medical-teleconsultation_23-2149329007.jpg" 
                alt="Doctor" 
                style={styles.profileImg} 
              />
              <h3 className="fw-bold text-dark">Dr. {doctor?.name}</h3>
              <p className="text-primary fw-medium mb-1">{doctor?.specialization}</p>
              <p className="text-muted small mb-4">{doctor?.experience}+ Years Experience</p>
              
              <button 
                className="btn btn-outline-primary btn-sm rounded-pill px-4 mb-3"
                onClick={() => setShowEditModal(true)}
              >
                Edit Profile
              </button>

              <hr />
              
              <div className="text-start mt-4">
                <div className="mb-3">
                  <small className="text-muted d-block">Hospital/Clinic</small>
                  <span className="fw-bold">{doctor?.hospitalName || "City General Hospital"}</span>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Consultation Fee</small>
                  {/* FIX: Ensure field name matches your backend (hourlyRate) */}
                  <span className="fw-bold text-success">₹{doctor?.hourlyRate || 0} / session</span>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Email Address</small>
                  <span className="fw-bold" style={{fontSize: '0.9rem'}}>{doctor?.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: APPOINTMENTS */}
          <div className="col-lg-8">
            <div style={styles.mainContent}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">Appointments Log</h4>
                <div className="bg-light p-1 rounded-3">
                  <button 
                    style={styles.toggleBtn(view === "approved")} 
                    onClick={() => setView("approved")}
                    className="me-2"
                  >
                    Approved
                  </button>
                  <button 
                    style={styles.toggleBtn(view === "rejected")} 
                    onClick={() => setView("rejected")}
                  >
                    Rejected
                  </button>
                </div>
              </div>

              <div className="mt-4">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map(app => (
                    <div key={app._id} className="d-flex align-items-center p-3 mb-3 border rounded-4 shadow-sm bg-white">
                      <div className="bg-light rounded-circle p-3 me-3">
                        <i className={`bi ${view === 'approved' ? 'bi-calendar-check text-success' : 'bi-calendar-x text-danger'}`}></i>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-0 fw-bold">{app.patientId?.name}</h6>
                        <small className="text-muted">{app.timeSlot} | {app.reason}</small>
                      </div>
                      <div>
                        <span className={`badge rounded-pill ${view === 'approved' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                          {view === 'approved' ? 'Confirmed' : 'Declined'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5">
                    <p className="text-muted">No {view} appointments found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <div className="modal d-block" style={{background: "rgba(0,0,0,0.5)"}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Update Profile</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleUpdateProfile}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="small fw-bold">Full Name</label>
                    <input type="text" className="form-control" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="small fw-bold">Specialization</label>
                    <input type="text" className="form-control" value={editData.specialization} onChange={(e) => setEditData({...editData, specialization: e.target.value})} />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="small fw-bold">Experience (Years)</label>
                      <input type="number" className="form-control" value={editData.experience} onChange={(e) => setEditData({...editData, experience: e.target.value})} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="small fw-bold">Hourly Rate (₹)</label>
                      <input type="number" className="form-control" value={editData.hourlyRate} onChange={(e) => setEditData({...editData, hourlyRate: e.target.value})} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="small fw-bold">Hospital/Clinic Name</label>
                    <input type="text" className="form-control" value={editData.hospitalName} onChange={(e) => setEditData({...editData, hospitalName: e.target.value})} />
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;