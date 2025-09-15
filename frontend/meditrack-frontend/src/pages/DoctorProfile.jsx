
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import doctorService from "../api/doctors";
import "../styles/dashboard.css";


function DoctorProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const doctorId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!doctorId) {
        setError("Doctor ID not found");
        setLoading(false);
        return;
      }
      try {

        const response = await doctorService.getDoctorProfile(doctorId);
       
        setProfile(response.data);
        
      } catch(err) {
        console.log("Error fetching doctor profile");
        setError("Failed to fetch doctor profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [doctorId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Doctor Profile</h2>
      {profile ? (
        <div className="dashboard-card">
          <p><strong>Username:</strong> {profile.user?.username.charAt(0).toUpperCase() + profile.user?.username.slice(1)}</p>
          <p><strong>Email:</strong> {profile.user?.email}</p>
          <p><strong>Phone:</strong> {profile.user?.phone}</p>
          <p><strong>Date of Birth:</strong> {profile.user?.dateOfBirth}</p>
          <p><strong>Specialization:</strong> {profile.specialization}</p>
          <p><strong>Verified:</strong> {profile.user?.verified ? "Yes" : "No"}</p>
        </div>
      ) : (
        <p>No profile data available.</p>
      )}
      <button className="dashboard-button" onClick={() => navigate("/doctor-dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default DoctorProfile;
