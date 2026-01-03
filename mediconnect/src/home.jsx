import React from "react";
import Navbar from "./homeNavbar";
const Home = () => {
  return (
    <>
      <Navbar />

      {/* ===== Hero Carousel ===== */}
      <div id="homeCarousel" className="carousel slide shadow-lg" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="0" className="active"></button>
          <button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="1"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop"
              className="d-block w-100"
              alt="Medical Team"
              style={{ height: "700px", objectFit: "cover", filter: "brightness(0.6)" }}
            />
            <div className="carousel-caption d-none d-md-block text-start mb-5 pb-5">
              <h1 className="display-3 fw-bold animate__animated animate__fadeInUp">Your Health, <span className="text-primary">Our Priority</span></h1>
              <p className="fs-4 opacity-75 animate__animated animate__fadeInUp animate__delay-1s">Connecting Patients and Doctors Seamlessly with MediConnect.</p>
              <button className="btn btn-primary btn-lg mt-3 px-5 rounded-pill shadow">Book Appointment</button>
            </div>
          </div>

          <div className="carousel-item">
            <img
              src="https://images.unsplash.com/photo-1504813184591-01572f98c85f?q=80&w=2071&auto=format&fit=crop"
              className="d-block w-100"
              alt="Healthcare Innovation"
              style={{ height: "700px", objectFit: "cover", filter: "brightness(0.6)" }}
            />
            <div className="carousel-caption d-none d-md-block mb-5 pb-5">
              <h1 className="display-3 fw-bold">Quality Healthcare Services</h1>
              <p className="fs-4 opacity-75">Access to 500+ verified medical professionals across the country.</p>
              <button className="btn btn-outline-light btn-lg mt-3 px-5 rounded-pill">Learn More</button>
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

      {/* ===== Statistics Section ===== */}
      <section className="bg-primary py-5 text-white shadow-sm">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-md-3">
              <h2 className="fw-bold display-5">10k+</h2>
              <p className="text-uppercase small tracking-wider">Happy Patients</p>
            </div>
            <div className="col-md-3">
              <h2 className="fw-bold display-5">500+</h2>
              <p className="text-uppercase small tracking-wider">Expert Doctors</p>
            </div>
            <div className="col-md-3">
              <h2 className="fw-bold display-5">20+</h2>
              <p className="text-uppercase small tracking-wider">Specialities</p>
            </div>
            <div className="col-md-3">
              <h2 className="fw-bold display-5">24/7</h2>
              <p className="text-uppercase small tracking-wider">Care Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Services Section ===== */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h6 className="text-primary text-uppercase fw-bold tracking-widest">What We Do</h6>
            <h2 className="fw-bold display-6 text-dark">Our Top Healthcare Services</h2>
            <div className="mx-auto bg-primary mt-2" style={{width: "60px", height: "3px"}}></div>
          </div>
          <div className="row g-4">
            {[
              { title: "Instant Consultation", icon: "bi-lightning-charge", desc: "Connect with doctors within minutes for urgent health concerns." },
              { title: "Lab Bookings", icon: "bi-microscope", desc: "Schedule blood tests and diagnostics from the comfort of your home." },
              { title: "Medicine Delivery", icon: "bi-capsule", desc: "Order prescribed medicines and get them delivered to your doorstep." },
              { title: "Health Records", icon: "bi-file-earmark-medical", desc: "Manage your digital prescriptions and reports securely in one place." }
            ].map((service, index) => (
              <div className="col-md-3" key={index}>
                <div className="card h-100 border-0 shadow-sm p-4 text-center service-card transition">
                  <div className="mb-3 text-primary fs-1">
                    <i className={`bi ${service.icon}`}></i>
                  </div>
                  <h5 className="fw-bold">{service.title}</h5>
                  <p className="text-muted small mb-0">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== About Section ===== */}
      <section id="about" className="py-5 bg-light p-0 overflow-hidden border-top">
        <div className="container-fluid p-0">
          <div className="row g-0 align-items-center">
            
            {/* Left Side: 50% Image */}
            <div className="col-md-6 order-2 order-md-1">
              <div 
                style={{
                  backgroundImage: `url("https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2070&auto=format&fit=crop")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '600px',
                  width: '100%'
                }}
                className="shadow-lg"
                role="img"
                aria-label="HD Medical Lab"
              />
            </div>

            {/* Right Side: Content */}
            <div className="col-md-6 p-5 order-1 order-md-2">
              <div className="px-lg-5">
                <h6 className="text-primary fw-bold text-uppercase">About Us</h6>
                <h2 className="fw-bold mb-4 display-6">Bridging the Gap Between Care and Technology</h2>
                <p className="lead text-muted mb-4">
                  MediConnect is a modern platform designed to simplify your healthcare journey. 
                  Whether you're looking for a specialist or managing family health records, we provide the tools to do it efficiently.
                </p>
                <div className="row g-3 mb-4">
                    <div className="col-sm-6 d-flex align-items-center">
                        <i className="bi bi-check-circle-fill text-primary me-2"></i> Verified Specialists
                    </div>
                    <div className="col-sm-6 d-flex align-items-center">
                        <i className="bi bi-check-circle-fill text-primary me-2"></i> No Waiting Queues
                    </div>
                    <div className="col-sm-6 d-flex align-items-center">
                        <i className="bi bi-check-circle-fill text-primary me-2"></i> 256-bit Encryption
                    </div>
                    <div className="col-sm-6 d-flex align-items-center">
                        <i className="bi bi-check-circle-fill text-primary me-2"></i> Easy Record Access
                    </div>
                </div>
                <button className="btn btn-primary btn-lg px-4 mt-2 rounded-pill shadow-sm">Explore Our Mission</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Map Section ===== */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Our Headquarters</h2>
            <p className="text-muted">Visit us at our central office in the heart of the city.</p>
          </div>
          <div className="ratio ratio-21x9 rounded-5 overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509374!2d-122.4194155!3d37.7749295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sTwitter%20HQ!5e0!3m2!1sen!2sus!4v1625000000000!5m2!1sen!2sus"
              allowFullScreen=""
              loading="lazy"
              title="MediConnect Location"
              style={{border: 0}}
            ></iframe>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-dark text-white pt-5 pb-3">
        <div className="container text-md-start text-center">
          <div className="row g-4">
            <div className="col-md-4 mb-4">
              <h4 className="fw-bold text-primary mb-3">MediConnect</h4>
              <p className="text-secondary pe-lg-5">Providing quality healthcare access to everyone, everywhere. Your trust is our commitment to a healthier tomorrow.</p>
              <div className="d-flex gap-3 fs-5 mt-3 justify-content-md-start justify-content-center">
                <i className="bi bi-facebook transition text-secondary hover-primary"></i>
                <i className="bi bi-twitter transition text-secondary hover-primary"></i>
                <i className="bi bi-instagram transition text-secondary hover-primary"></i>
                <i className="bi bi-linkedin transition text-secondary hover-primary"></i>
              </div>
            </div>
            <div className="col-md-2 mb-4">
              <h6 className="fw-bold mb-4 text-uppercase tracking-widest">Quick Links</h6>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-secondary text-decoration-none hover-white">Home</a></li>
                <li className="mb-2"><a href="#about" className="text-secondary text-decoration-none hover-white">About Us</a></li>
                <li className="mb-2"><a href="#" className="text-secondary text-decoration-none hover-white">Doctors List</a></li>
                <li className="mb-2"><a href="#" className="text-secondary text-decoration-none hover-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="col-md-3 mb-4">
              <h6 className="fw-bold mb-4 text-uppercase tracking-widest">Contact info</h6>
              <p className="text-secondary mb-2 small"><i className="bi bi-envelope-fill text-primary me-2"></i> contact@mediconnect.com</p>
              <p className="text-secondary mb-2 small"><i className="bi bi-telephone-fill text-primary me-2"></i> +1 (234) 567 890</p>
              <p className="text-secondary mb-2 small"><i className="bi bi-geo-alt-fill text-primary me-2"></i> 123 Health Ave, Medical District</p>
            </div>
            <div className="col-md-3 mb-4">
              <h6 className="fw-bold mb-4 text-uppercase tracking-widest">Newsletter</h6>
              <p className="small text-secondary mb-3">Subscribe to get latest health tips.</p>
              <div className="input-group">
                <input type="email" className="form-control bg-transparent border-secondary text-white" placeholder="Email" />
                <button className="btn btn-primary">Join</button>
              </div>
            </div>
          </div>
          <hr className="bg-secondary opacity-25" />
          <p className="text-center text-secondary mb-0 small">© 2025 MediConnect | Designed with ❤️ for a healthier future.</p>
        </div>
      </footer>

      {/* Global Style for Hover Effects */}
      <style>{`
        .transition { transition: all 0.3s ease; }
        .service-card:hover { transform: translateY(-10px); background: #f8f9ff; }
        .hover-primary:hover { color: #0d6efd !important; cursor: pointer; }
        .hover-white:hover { color: white !important; }
        .tracking-wider { letter-spacing: 1px; }
        .tracking-widest { letter-spacing: 2px; }
      `}</style>
    </>
  );
};

export default Home;