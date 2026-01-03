import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

const Navbar = () => {
  const navigate = useNavigate(); // Initialize navigation

  const handleLogout = () => {
    // 1. Remove all data from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("patientId");
    localStorage.removeItem("doctorToken");
    
    // Optional: localStorage.clear(); // This removes everything at once

    // 2. Redirect to Home Page
    navigate("/");
  };

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          {/* Left side - Logo */}
          <Link className="navbar-brand fw-bold fs-4" to="/">
            🩺 MediConnect
          </Link>

          {/* Toggle for mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Right side - Links */}
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav align-items-center">
              <li className="nav-item mx-2">
                <Link className="nav-link text-white" to="/doctor/pending">pending appointment</Link>
              </li>
              <li className="nav-item mx-2">
                <Link className="nav-link text-white" to="/doctor/approved">profile</Link>
              </li>
              <li className="nav-item mx-2">
                <Link className="nav-link text-white" to="/DoctorVideoCall">VideoCall</Link>
              </li>
              <li className="nav-item mx-2">
                <Link className="nav-link text-white" to="/doctor/appointment/:appointmentId/upload">prescription</Link>
              </li>
              
              {/* Logout Button */}
              <li className="nav-item mx-2">
                <button 
                  className="btn btn-outline-light btn-sm rounded-pill px-3" 
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;