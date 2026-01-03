import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Navbar from "./doctorNavbar1";
import { useNavigate } from "react-router-dom";

const DoctorSideVideoCall = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // 🔐 READ DOCTOR TOKEN (FIXED)
    const token = localStorage.getItem("doctorToken");

    if (!token) {
      setError("Please login as a doctor to continue");
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      setError("Invalid session. Please login again.");
      return;
    }

    // 🛡️ ROLE CHECK
    if (decoded.role !== "doctor") {
      setError("Unauthorized access. Doctor login required.");
      return;
    }

    const doctorId = decoded.id;

    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/appointment/by-doctor/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // ✅ SHOW ONLY APPROVED APPOINTMENTS
        const approved = res.data.filter(
          (apt) => apt.status === "approved"
        );

        setAppointments(approved);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch appointments");
      }
    };

    fetchAppointments();
  }, []);

  if (error) {
    return <h4 className="p-4 text-danger">{error}</h4>;
  }

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* NAVBAR */}
      <div style={{ position: "sticky", top: 0, zIndex: 1050 }}>
        <Navbar />
      </div>

      <div className="container-fluid p-0">
        <div className="row g-0">

          {/* LEFT SIDE IMAGE */}
          <div
            className="col-md-4 d-none d-md-block"
            style={{
              height: "calc(100vh - 70px)",
              position: "sticky",
              top: "70px",
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1576091160550-2173dad99901?auto=format&fit=crop&w=1920&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="h-100 d-flex flex-column justify-content-end p-5 text-white">
              <div
                className="bg-primary p-2 px-3 mb-3 text-uppercase fw-bold"
                style={{ width: "fit-content", fontSize: "0.75rem" }}
              >
                Doctor Portal
              </div>
              <h1 className="fw-bold display-5 mb-3">
                Consultation
                <br />
                Dashboard
              </h1>
              <p className="opacity-75 lead">
                View your approved appointments and start secure video sessions.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE CONTENT */}
          <div className="col-md-8 p-4 p-lg-5">
            <h2 className="fw-bold mb-4">Upcoming Video Calls</h2>

            {appointments.length === 0 ? (
              <div className="bg-white p-5 rounded-4 text-center shadow-sm">
                <p className="text-muted fs-5">
                  No patient appointments ready for video call.
                </p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                {appointments.map((apt) => (
                  <div
                    key={apt._id}
                    className="card border-0 shadow-sm rounded-4 overflow-hidden"
                  >
                    <div className="row g-0 align-items-center">

                      {/* PATIENT IMAGE */}
                      <div className="col-sm-3 bg-light d-flex align-items-center justify-content-center py-4">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/3028/3028573.png"
                          alt="Patient"
                          style={{ width: "100px", opacity: "0.7" }}
                        />
                      </div>

                      <div className="col-sm-9 p-4">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h4 className="fw-bold mb-1">
                              Patient: {apt.patientId?.name}
                            </h4>
                            <p className="text-muted small mb-0">
                              {apt.patientId?.email}
                            </p>
                          </div>
                          <span className="badge bg-success rounded-pill px-3">
                            Approved
                          </span>
                        </div>

                        <div className="d-flex gap-2 my-3">
                          <span className="badge bg-light text-dark border px-3 py-2">
                            📅 {apt.date}
                          </span>
                          <span className="badge bg-light text-dark border px-3 py-2">
                            ⏰ {apt.timeSlot}
                          </span>
                        </div>

                        <div className="d-flex gap-2">
                          <button className="btn btn-outline-secondary rounded-pill flex-grow-1">
                            Patient History
                          </button>

                          <button
                            className="btn btn-primary rounded-pill flex-grow-1 fw-bold"
                            onClick={() =>
                              navigate(`/VideoCall?room=${apt._id}`)
                            }
                          >
                            📹 Start Video Call
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

export default DoctorSideVideoCall;
