import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
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
                <Link className="nav-link" to="/admin-doctor">doctor</Link>
              </li>
              <li className="nav-item mx-2">
                <Link className="nav-link" to="/admin-patient">Patient</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Bootstrap JS */}
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
      ></script>
    </>
  );
};

export default Navbar;
