

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import patientsAPI from "../api/patients";
import "../styles/dashboard.css";

function HealthRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const patientId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchRecords = async () => {
      if (!patientId) {
        setError("Patient ID not found");
        setLoading(false);
        return;
      }
      try {
        const response = await patientsAPI.getPatientAppointments(patientId);
        // Filter or map to symptoms and specialist
        const healthRecords = response.data.map(appt => ({
          symptoms: appt.symptoms,
          specialist: appt.doctorName,
          date: appt.dateTime ? new Date(appt.dateTime).toLocaleDateString() : "N/A"
        }));
        setRecords(healthRecords);
      } catch (err) {
        setError("Failed to fetch health records");
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [patientId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Health Records</h2>
      {records.length === 0 ? (
        <p>No health records available.</p>
      ) : (
        <div className="dashboard-card">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Symptoms/Disease</th>
                <th>Specialist</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={index}>
                  <td>{record.symptoms || "N/A"}</td>
                  <td>{record.specialist || "N/A"}</td>
                  <td>{record.date}</td>
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

export default HealthRecords;