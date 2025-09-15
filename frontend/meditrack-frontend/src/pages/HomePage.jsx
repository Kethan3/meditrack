

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import "../styles/home.css";
import "../styles/dashboard.css";

function HomePage() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setTimeout(() => setAnimate(true), 100);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Trigger animation on click
      setAnimate(false);
      setTimeout(() => setAnimate(true), 50);
    }
  };

  const goToDashboard = () => {
    if (user.role === "PATIENT") navigate("/patient-dashboard");
    else if (user.role === "DOCTOR") navigate("/doctor-dashboard");
    else if (user.role === "ADMIN") navigate("/admin-dashboard");
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };


  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-brand" onClick={() => scrollToSection('hero')}>
          <h2>MediTrack</h2>
        </div>
        <ul className="navbar-nav">
          <li><a onClick={() => scrollToSection('hero')}>Home</a></li>
          <li><a onClick={() => scrollToSection('features')}>Features</a></li>
          {isLoggedIn && (
            <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
          )}
        </ul>
      </nav>

    {showLogoutConfirm && (
      <div className="logout-confirm-overlay">
        <div className="logout-confirm-dialog">
          <h3>Confirm Logout</h3>
          <div className="logout-confirm-buttons">
            <button className="confirm-btn" onClick={confirmLogout}>Yes</button>
            <button className="cancel-btn" onClick={cancelLogout}>No</button>
          </div>
        </div>
      </div>
    )}



      <header id="hero" className={`hero-section ${animate ? 'animate' : ''}`}>
        <div className="hero-content">
          <h1 className="hero-title">Welcome to MediTrack</h1>
          <p className="hero-subtitle">
            Your trusted healthcare management platform for easy appointments and better care.
          </p>
          <div className="hero-buttons">
            {!isLoggedIn ? (
              <>
                <button className="btn-primary" onClick={() => navigate("/login")}>
                  Login
                </button>
                <button className="btn-secondary" onClick={() => navigate("/register")}>
                  Register
                </button>
              </>
            ) : (
              <button className="btn-primary" onClick={goToDashboard}>
                Go to Dashboard
              </button>
            )}
          </div>
        </div>
        <div className="hero-image">
          <img src="https://thumbs.dreamstime.com/b/hand-clicks-book-appointment-laptop-screen-showing-doctor-s-profile-generated-use-ai-online-booking-system-400142337.jpg" alt="MediTrack" />
        </div>
      </header>

      <section id="features" className={`help-section ${animate ? 'animate' : ''}`}>
        <div className="help-wrapper">
          <div className="help-content">
            <h2>How Does MediTrack Help You?</h2>
            <p>
              MediTrack makes healthcare simple and accessible with focus on appointments and medical history.
            </p>
            <div className="help-cards">
              <div className="help-card">
                <div className="card-inner">
                  <div className="card-front">
                    <h3>Easy Appointment Booking</h3>
                  </div>
                  <div className="card-back">
                    <p>Book appointments with doctors by specialization. Simple and quick process.</p>
                  </div>
                </div>
              </div>
              <div className="help-card">
                <div className="card-inner">
                  <div className="card-front">
                    <h3>Medical History Access</h3>
                  </div>
                  <div className="card-back">
                    <p>View and manage your medical history securely in one place.</p>
                  </div>
                </div>
              </div>
              <div className="help-card">
                <div className="card-inner">
                  <div className="card-front">
                    <h3>User Friendly Interface</h3>
                  </div>
                  <div className="card-back">
                    <p>Intuitive design with easy navigation, clear instructions, and responsive layout.</p>
                  </div>
                </div>
              </div>
             
            </div>
          </div>
        </div>
      </section>
        <footer className={`footer ${animate ? 'animate' : ''}`}>
          <div className="footer-team-title">MediTrack Team</div>
          <div className="footer-team-members">
            <div className="team-member-container">
              <div className="team-member">Kethan Gowda N</div>
              <div className="hover-card">
                <div>
                 <p>Associate Software Engineer</p>
                  <p>Empower Global</p>
                </div>
              </div>
            </div>
            <div className="team-member-container">
              <div className="team-member">Sneha K S</div>
              <div className="hover-card">
                <div>
                  <p >Associate Software Engineer</p>
                  <p >Empower Global</p>
                </div>
              </div>
            </div>
            <div className="team-member-container">
              <div className="team-member">Omkar Rampure</div>
              <div className="hover-card">
                <div>
                  <p>Associate Software Engineer</p>
                  <p>Empower Global</p>
                </div>
              </div>
            </div>
            <div className="team-member-container">
              <div className="team-member">Shilpa K V</div>
              <div className="hover-card">
                <div>
                  <p>Associate Software Engineer</p>
                  <p>Empower Global</p>
                </div>
              </div>
            </div>
            <div className="team-member-container">
              <div className="team-member">Shivlinga Halimani</div>
              <div className="hover-card">
                <div>
                  <p>Associate Software Engineer</p>
                  <p>Empower Global</p>
                </div>
              </div>
            </div>
          </div>
        </footer>
    </div>
  );
}

export default HomePage;

