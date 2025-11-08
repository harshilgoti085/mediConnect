import React from "react";

const Home = () => {
  return (
    <>
      {/* ===== Navbar ===== */}
      

      {/* ===== Carousel ===== */}
      <div id="homeCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="https://img.freepik.com/free-photo/happy-medical-team-discussing-hospital-hallway_23-2149271186.jpg"
              className="d-block w-100"
              alt="Doctors"
              style={{ height: "600px", objectFit: "cover" }}
            />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded-3 p-3">
              <h3>Welcome to MediConnect</h3>
              <p>Connecting Patients and Doctors Seamlessly</p>
            </div>
          </div>

          <div className="carousel-item">
            <img
              src="https://img.freepik.com/free-photo/medical-banner-with-stethoscope_23-2149611199.jpg"
              className="d-block w-100"
              alt="Healthcare"
              style={{ height: "600px", objectFit: "cover" }}
            />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded-3 p-3">
              <h3>Quality Healthcare Services</h3>
              <p>Get access to trusted and verified medical professionals.</p>
            </div>
          </div>

          <div className="carousel-item">
            <img
              src="https://img.freepik.com/free-photo/healthcare-workers-collaboration-concept_53876-63153.jpg"
              className="d-block w-100"
              alt="Teamwork"
              style={{ height: "600px", objectFit: "cover" }}
            />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded-3 p-3">
              <h3>We Care About Your Health</h3>
              <p>Your wellness is our top priority.</p>
            </div>
          </div>
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      {/* ===== About Section ===== */}
      <section id="about" className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="fw-bold mb-4">About MediConnect</h2>
          <p className="lead">
            MediConnect is a modern platform designed to bridge the gap between
            patients and healthcare professionals. Our goal is to provide a
            seamless digital experience for booking appointments, managing
            medical records, and ensuring high-quality healthcare services.
          </p>
        </div>
      </section>

      {/* ===== Map Section ===== */}
      <section className="py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-4">Find Us</h2>
          <div className="ratio ratio-16x9">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.249068735743!2d-122.42177808467707!3d37.77492927975868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808dca30c3d7%3A0xcde8b73c1cbded2b!2sSan%20Francisco!5e0!3m2!1sen!2sus!4v1709504200000"
              allowFullScreen=""
              loading="lazy"
              title="MediConnect Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-primary text-white text-center py-4">
        <div className="container">
          <h5 className="fw-bold">MediConnect</h5>
          <p>Your trusted healthcare partner</p>
          <div className="d-flex justify-content-center mb-3">
            <a href="#" className="text-white mx-3 text-decoration-none">Home</a>
            <a href="#about" className="text-white mx-3 text-decoration-none">About</a>
            <a href="#contact" className="text-white mx-3 text-decoration-none">Contact</a>
          </div>
          <p className="mb-0">© 2025 MediConnect | All Rights Reserved</p>
        </div>
      </footer>
    </>
  );
};

export default Home;
