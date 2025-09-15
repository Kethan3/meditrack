
import React, { useEffect, useState } from "react";
import appointmentsAPI from "../api/appointments";
import "../styles/dashboard.css";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const doctorId = localStorage.getItem("userId");

  const fetchAppointments = async () => {
    if (!doctorId) return;
    setLoading(true);
    setError("");
    try {
      const response = await appointmentsAPI.getDoctorAppointments(doctorId);
      if (response && response.data) {
        setAppointments(response.data);
      }
    } catch (err) {
      setError("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const approveAppointment = async (appointmentId) => {
    if (!doctorId) return;
    try {
      await appointmentsAPI.acceptAppointment(appointmentId, doctorId);
      alert("Appointment approved!");
      fetchAppointments();
    } catch (err) {
      alert("Failed to approve appointment");
    }
  };

  const rejectAppointment = async (appointmentId) => {
    if (!doctorId) return;
    try {
      await appointmentsAPI.rejectAppointment(appointmentId, doctorId);
      alert("Appointment rejected!");
      fetchAppointments();
    } catch (err) {
      alert("Failed to reject appointment");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">My Appointments</h2>
      {error && <p className="error-message">{error}</p>}
      {loading && <p>Loading...</p>}

      {/* Appointments */}
      <div className="dashboard-card">
        <h3>Appointments</h3>
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id}>
                  <td>{appt.patient ? appt.patient.name.charAt(0).toUpperCase() + appt.patient.name.slice(1) : "N/A"}</td>
                  <td>{appt.dateTime ? new Date(appt.dateTime).toLocaleDateString() : "N/A"}</td>
                  <td>{appt.dateTime ? new Date(appt.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "N/A"}</td>
                  <td>{appt.status}</td>
                  <td>
                    {appt.status === "PENDING" && (
                      <>
                        <button
                          className="dashboard-small-btn"
                          onClick={() => approveAppointment(appt.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="dashboard-reject-btn"
                          onClick={() => rejectAppointment(appt.id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default DoctorAppointments;

