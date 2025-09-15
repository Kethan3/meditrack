
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import patientsAPI from "../api/patients";
import "../styles/dashboard.css";

function PatientProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const patientId = localStorage.getItem("userId");
 

  useEffect(() => {
    const fetchProfile = async () => {
      if (!patientId) {
        setError("Patient ID not found");
        
        setLoading(false);
        return;
      }
      try {
        const response = await patientsAPI.getPatientProfile(patientId);
        console.log(response);
         console.log(patientId);
        setProfile(response.data);
        console.log(profile);
      } catch (err) {
        setError("Failed to fetch patient profile");
                

      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [patientId]);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
        <button className="dashboard-button" onClick={() => navigate("/patient-dashboard")}>Back to Dashboard</button>
        <button className="dashboard-button" onClick={handleLogout}>Logout</button>
      </div>
      <h2 className="dashboard-title">Patient Profile</h2>
      {profile ? (




<div className="dashboard-card">
          <p><strong>Username:</strong> {profile.user?.username.charAt(0).toUpperCase() + profile.user?.username.slice(1)}</p>
          <p><strong>Email:</strong> {profile.user?.email}</p>
          <p><strong>Phone:</strong> {profile.user?.phone}</p>
          <p><strong>Date of Birth:</strong> {profile.user?.dateOfBirth}</p>
          {/* Add more fields as needed */}
        </div>
      ) : (
        <p>No profile data available.</p>
      )}
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
    </div>
  );
}

export default PatientProfile;
