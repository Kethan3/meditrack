import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import API from "../api/axiosConfig";
import adminService from "../api/admin";
import "../styles/dashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const formatTime12Hour = (time24) => {
    if (!time24) return "N/A";
    const [hour, minute] = time24.split(':');
    const hourInt = parseInt(hour);
    const ampm = hourInt >= 12 ? 'PM' : 'AM';
    const hour12 = hourInt % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Fetch all admin data
  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("token");

      const resPendingDocs = await adminService.getPendingDoctors();
      setPendingDoctors(resPendingDocs.data);

      const resAllDocs = await API.get("/admin/doctors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllDoctors(resAllDocs.data);

      const resPatients = await API.get("/admin/patients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(resPatients.data);

      const resAppointments = await API.get("/admin/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(resAppointments.data);
    } catch (err) {
      console.error("Error fetching admin data", err);
    }
  };

  // Approve doctor
  const approveDoctor = async (id) => {
    try {
      await adminService.verifyDoctor(id);
      alert("Doctor approved!");
      fetchAdminData();
    } catch (err) {
      console.error("Error approving doctor", err);
      alert("Failed to approve doctor.");
    }
  };

  // Reject doctor
  const rejectDoctor = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.post(
        `/admin/doctors/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Doctor rejected!");
      fetchAdminData();
    } catch (err) {
      console.error("Error rejecting doctor", err);
      alert("Failed to reject doctor.");
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <button className="dashboard-button" onClick={() => navigate("/")}>Home</button>
        <button className="dashboard-button" onClick={() => setShowLogoutConfirm(true)}>Logout</button>
      </div>
      <h2 className="dashboard-title">Admin Dashboard</h2>

      {/* About MediTrack and Admin Role */}
      <div className="dashboard-card">
        <h3>About MediTrack and Your Role</h3>
        <p>
          MediTrack is a comprehensive healthcare management platform that connects patients, doctors, and administrators. As an admin, you oversee the system, approve doctor registrations, manage users, and ensure smooth operations across the platform.
        </p>
      </div>

      {/* Pending Doctor Approvals */}
      <div className="dashboard-card">
        <h3>Pending Doctor Approvals</h3>
        {pendingDoctors.length === 0 ? (
          <p>No pending approvals.</p>
        ) : (
          <ul>
            {pendingDoctors.map((doc) => (
              <li key={doc.id}>
                Dr. {doc.name.charAt(0).toUpperCase() + doc.name.slice(1)} - {doc.specialization}
                <button
                  className="dashboard-small-btn"
                  onClick={() => approveDoctor(doc.id)}
                >
                  Approve
                </button>
                <button
                  className="dashboard-reject-btn"
                  onClick={() => rejectDoctor(doc.id)}
                >
                  Reject
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* All Doctors */}
      <div className="dashboard-card">
        <h3>All Doctors</h3>
        {allDoctors.length === 0 ? (
          <p>No doctors found.</p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialization</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {allDoctors.map((doc) => (
                <tr key={doc.id}>
                  <td>Dr. {doc.name.charAt(0).toUpperCase() + doc.name.slice(1)}</td>
                  <td>{doc.specialization}</td>
                  <td>{doc.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Patients */}
      <div className="dashboard-card">
        <h3>All Patients</h3>
        {patients.length === 0 ? (
          <p>No patients found.</p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id}>
                  <td>{p.name.charAt(0).toUpperCase() + p.name.slice(1)}</td>
                  <td>{p.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Appointments */}
      <div className="dashboard-card">
        <h3>All Appointments</h3>
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id}>
                  <td>{appt.patientName.charAt(0).toUpperCase() + appt.patientName.slice(1)}</td>
                  <td>Dr. {appt.doctorName.charAt(0).toUpperCase() + appt.doctorName.slice(1)}</td>
                  <td>{appt.date}</td>
                  <td>{formatTime12Hour(appt.time)}</td>
                  <td>{appt.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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

export default AdminDashboard;
