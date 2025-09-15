

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function DoctorDashboard() {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <button className="dashboard-button" onClick={() => navigate("/")}>Go to Home</button>
        <button className="dashboard-button" onClick={() => setShowLogoutConfirm(true)}>Logout</button>
      </div>
      <h2 className="dashboard-title">Doctor Dashboard</h2>

      {/* Profile Card */}
      <div className="dashboard-card">
        <h3>Profile</h3>
        <p>View your personal profile details.</p>
        <button className="dashboard-button" onClick={() => navigate("/doctor-profile")}>View Profile</button>
      </div>

      {/* Appointment History Card */}
      <div className="dashboard-card">
        <h3>Appointment History</h3>
        <p>View your past appointments.</p>
        <button className="dashboard-button" onClick={() => navigate("/doctor-appointment-history")}>View History</button>
      </div>

      {showLogoutConfirm && (
        <div className="logout-confirm-overlay">
          <div className="logout-confirm-dialog">
            <h3>Confirm Logout</h3>
            <div  className="logout-confirm-buttons" style={{ display: "flex", justifyContent: "space-around", marginTop: "10px" }}>
              <button className="auth-button" onClick={handleLogout}>Yes</button>
              <button className="auth-button" onClick={() => setShowLogoutConfirm(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;


