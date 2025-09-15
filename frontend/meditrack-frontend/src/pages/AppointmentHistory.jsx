import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import patientsAPI from "../api/patients";
import "../styles/dashboard.css";

function AppointmentHistory() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const patientId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!patientId) {
        setError("Patient ID not found");
        setLoading(false);
        return;
      }
      try {
        const response = await patientsAPI.getPatientAppointments(patientId);
        setAppointments(response.data);
      } catch (err) {
        setError("Failed to fetch appointment history");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [patientId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Appointment History</h2>
      {appointments.length === 0 ? (
        <p>No appointment history available.</p>
      ) : (
        <div className="dashboard-card">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Symptoms</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id}>
                  <td>{appt.doctorName ? "Dr. " + appt.doctorName.charAt(0).toUpperCase() + appt.doctorName.slice(1) : "N/A"}</td>
                  <td>{appt.dateTime ? new Date(appt.dateTime).toLocaleDateString() : "N/A"}</td>
                  <td>{appt.dateTime ? new Date(appt.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "N/A"}</td>
                  <td>{appt.status}</td>
                  <td>{appt.symptoms || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button className="dashboard-button" onClick={() => navigate("/patient-dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default AppointmentHistory;

