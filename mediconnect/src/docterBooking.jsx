import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./pesentNavbar";

const DoctorBooking = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingData, setBookingData] = useState({ date: "", timeSlot: "", reason: "" });

  const DEFAULT_DOC_IMG = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=1000";

  useEffect(() => {
    axios.get("http://localhost:5000/doctor/all")
      .then(res => {
        setDoctors(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        setLoading(false);
      });
  }, []);

  // ✅ BOOKING VALIDATION
  const validateBooking = () => {
    const { date, timeSlot, reason } = bookingData;

    if (!date || !timeSlot || !reason) {
      return "Please select date, time slot, and provide a reason.";
    }

    if (reason.trim().length < 5) {
      return "Reason must be at least 5 characters long.";
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return "You cannot book an appointment for a past date.";
    }

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    if (selectedDate.getTime() === today.getTime()) {
      const slotStart = timeSlot.split(" - ")[0];
      const [time, modifier] = slotStart.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      const slotMinutes = hours * 60 + minutes;

      if (slotMinutes <= currentMinutes) {
        return "You cannot book a past time slot for today.";
      }
    }

    return null;
  };

  const handleBooking = async () => {
    const token = localStorage.getItem("token");
    if (!token) { 
      alert("Please login first!"); 
      return; 
    }

    const error = validateBooking();
    if (error) {
      alert(error);
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/appointment/request",
        { doctorId: selectedDoctor._id, ...bookingData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Appointment request sent successfully!");
      setShowModal(false);
      setBookingData({ date: "", timeSlot: "", reason: "" });
    } catch (err) {
      alert(err.response?.data?.error || "Booking failed");
    }
  };

  const styles = {
    navContainer: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 },
    pageWrapper: { display: "flex", minHeight: "100vh", backgroundColor: "#f4f7f6", paddingTop: "70px" },
    leftSide: {
      width: "30%",
      height: "calc(100vh - 70px)",
      position: "fixed",
      left: 0,
      top: "70px",
      backgroundImage: "url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      zIndex: 10
    },
    overlay: {
      height: "100%",
      width: "100%",
      background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      padding: "40px",
      color: "white"
    },
    rightSide: { width: "70%", marginLeft: "30%", padding: "40px 60px" },
    profileSidebar: {
      position: "fixed",
      top: 0,
      right: 0,
      width: "400px",
      height: "100vh",
      zIndex: 2000,
      backgroundColor: "white",
      boxShadow: "-5px 0 15px rgba(0,0,0,0.1)",
      padding: "30px",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column"
    }
  };

  if (loading) return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="spinner-border text-primary"></div>
    </div>
  );

  return (
    <>
      <div style={styles.navContainer}><Navbar /></div>

      <div style={styles.pageWrapper}>
        <div style={styles.leftSide} className="d-none d-lg-block">
          <div style={styles.overlay}>
            <span className="badge bg-primary px-3 py-2 align-self-start mb-3 fw-bold rounded-pill">HEALTH INSIGHT</span>
            <h1 className="fw-bold display-5 mb-3">Your Wellness,<br/>Our Priority.</h1>
            <p className="opacity-75 fs-5">"Healing is a matter of time, but it is sometimes also a matter of opportunity."</p>
          </div>
        </div>

        <div style={styles.rightSide}>
          <h3 className="fw-bold text-dark mb-4">Available Doctors</h3>

          <div className="d-flex flex-column gap-3">
            {doctors.map((doc) => (
              <div key={doc._id} className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="row g-0 align-items-center">
                  <div className="col-md-3">
                    <img src={doc.profileImage || DEFAULT_DOC_IMG} onError={(e) => { e.target.src = DEFAULT_DOC_IMG; }} alt={doc.name} className="w-100" style={{ objectFit: "cover", height: "180px" }} />
                  </div>
                  <div className="col-md-9 p-3">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h5 className="fw-bold mb-0">Dr. {doc.name}</h5>
                        <p className="text-primary fw-bold mb-1 small">{doc.specialization}</p>
                        <small className="text-muted">{doc.hospitalName}</small>
                      </div>
                      <div className="text-end">
                        <small className="fw-bold text-muted">FEE</small>
                        <h4 className="fw-bold text-primary mb-0">₹{doc.hourlyRate || 500}</h4>
                      </div>
                    </div>
                    <div className="d-flex gap-2 mt-3">
                      <button className="btn btn-sm btn-outline-dark flex-grow-1 rounded-pill fw-bold" onClick={() => { setSelectedDoctor(doc); setShowProfile(true); }}>View Profile</button>
                      <button className="btn btn-sm btn-primary flex-grow-1 rounded-pill fw-bold" onClick={() => { setSelectedDoctor(doc); setShowModal(true); }}>Book Now</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showModal && (
          <div className="modal d-block" style={{ background: "rgba(0,0,0,0.6)", zIndex: 3000 }}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "400px" }}>
              <div className="modal-content border-0 rounded-4 p-4 shadow-lg">
                <h5 className="fw-bold mb-4 text-center">Set Appointment</h5>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Select Date</label>
                  <input
                    type="date"
                    className="form-control rounded-pill"
                    min={new Date().toISOString().split("T")[0]}
                    onChange={e => setBookingData({ ...bookingData, date: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Available Time Slots</label>
                  <select className="form-select rounded-pill" onChange={e => setBookingData({ ...bookingData, timeSlot: e.target.value })}>
                    <option value="">Choose Time Slot</option>
                    <option>09:00 AM - 09:30 AM</option>
                    <option>10:00 AM - 10:30 AM</option>
                    <option>11:00 AM - 11:30 AM</option>
                    <option>04:00 PM - 04:30 PM</option>
                    <option>05:00 PM - 05:30 PM</option>
                    <option>06:00 PM - 06:30 PM</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">Reason for Appointment</label>
                  <textarea className="form-control rounded-4" rows="2" onChange={e => setBookingData({ ...bookingData, reason: e.target.value })}></textarea>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-light flex-grow-1 rounded-pill py-2 fw-bold" onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="btn btn-primary flex-grow-1 rounded-pill shadow py-2 fw-bold" onClick={handleBooking}>Confirm</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <style>{`.animate-slide { animation: slideIn 0.3s forwards; } @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
      </div>
    </>
  );
};

export default DoctorBooking;
