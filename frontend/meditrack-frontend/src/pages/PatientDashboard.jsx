
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import doctorsAPI from "../api/doctors";
import patientsAPI from "../api/patients";
import appointmentsAPI from "../api/appointments";
import { logout } from "../api/auth";

import "../styles/dashboard.css";

function PatientDashboard() {
  const [activeView, setActiveView] = useState("viewAppointments"); // "bookAppointment" or "viewAppointments"
  const [specialization, setSpecialization] = useState("");
  const [specializations, setSpecializations] = useState([]);
  const [symptoms, setSymptoms] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [patientName, setPatientName] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

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

  // Get patientId from localStorage (assuming stored during login)
  const patientId = localStorage.getItem("userId");

  // Fetch patient profile to get patient name
  useEffect(() => {
    const fetchPatientName = async () => {
      if (!patientId) return;
      try {
        const response = await patientsAPI.getPatientProfile(patientId);
        if (response && response.data && response.data.user && response.data.user.username) {
          const username = response.data.user.username;
          setPatientName(username.charAt(0).toUpperCase() + username.slice(1));
        }
      } catch (err) {
        setError("Failed to fetch patient profile");
      }
    };
    fetchPatientName();
  }, [patientId]);
  
  // Fetch specializations for booking
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await doctorsAPI.getSpecializations();
        if (response && response.data) {
          setSpecializations(response.data);
        }
      } catch (err) {
        setError("Failed to fetch specializations");
      }
    };
    fetchSpecializations();
  }, []);
  
  // Fetch appointments for logged-in patient
  const fetchAppointments = async () => {
    if (!patientId) return;
    setLoading(true);
    try {
      const response = await patientsAPI.getAppointments(patientId);
      setAppointments(response.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      // Error fetching appointments, but not displaying to user
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch doctors by specialization from backend
  const searchDoctors = async () => {
    if (specialization.trim() === "") {
      setDoctors([]);
      setSearchMessage("Please enter a specialization to search.");
      return;
    }
    setLoading(true);
    setSearchMessage("");
    try {
      const response = await doctorsAPI.getDoctorsBySpecialization(specialization);
      const data = response.data;
      setDoctors(data);
      if (data.length === 0) {
        setSearchMessage("No doctors found for this specialization.");
      }
    } catch (err) {
      setError("Failed to fetch doctors");
      setSearchMessage("");
    } finally {
      setLoading(false);
    }
  };
  
  // Request appointment
    const requestAppointment = async () => {
    if (!selectedDoctor || !date || !time || !specialization) {
      setError("Please fill all fields");
      return;
    }
    setError(""); // Clear previous errors
    setLoading(true);
    try {
      // Convert time from "10:00 AM" format to 24-hour "HH:mm:ss"
      const time24 = (() => {
        const [timePart, modifier] = time.split(' ');
        let [hours, minutes] = timePart.split(':');
        if (modifier === 'PM' && hours !== '12') {
          hours = String(parseInt(hours, 10) + 12);
        }
        if (modifier === 'AM' && hours === '12') {
          hours = '00';
        }
        return `${hours.padStart(2, '0')}:${minutes}:00`;
      })();
      const dateTime = `${date}T${time24}`;
      await appointmentsAPI.requestAppointment(parseInt(patientId), specialization, symptoms, dateTime);
      console.log("Appointment requested successfully");
      setConfirmationMessage("Message sent to doctor for confirmation");
      fetchAppointments(); // Refresh appointments
      setSelectedDoctor(null);
      setDate("");
      setTime("");
      setSpecialization("");
      setSymptoms("");
      // Do not switch view as per user request
      // setActiveView("viewAppointments");
    } catch (err) {
      console.error("Error requesting appointment:", err);
      setError("Failed to request appointment");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAppointments();
  }, [patientId]);
  
  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-brand" onClick={() => navigate("/")}>
          <h2>MediTrack</h2>
        </div>
        <ul className="navbar-nav">
          <li><a onClick={() => navigate("/")}>Home</a></li>
          <li><a onClick={() => navigate("/patient-profile")}>Profile</a></li>
          <li><a onClick={() => navigate("/appointment-history")}>Appointment History</a></li>
          <li><a onClick={() => navigate("/health-records")}>Health Records</a></li>
          <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
        </ul>
      </nav>
      <h2 className="dashboard-title">Hi, {patientName}!</h2>
  
      {error && <p className="error-message">{error}</p>}
      {loading && <p>Loading...</p>}
  

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





      {/* Buttons to toggle views */}
      <div className="dashboard-card">
        <button
          className={`dashboard-button ${activeView === "bookAppointment" ? "active" : ""}`}
          onClick={() => setActiveView("bookAppointment")}
        >
          Book Appointment
        </button>
        <button
          className={`dashboard-button ${activeView === "viewAppointments" ? "active" : ""}`}
          onClick={() => setActiveView("viewAppointments")}
        >
          View My Appointments
        </button>
      </div>
  
      {/* Booking Flow */}
      {activeView === "bookAppointment" && (
        <>
          {/* Specialization Selection */}
          <div className="dashboard-card">
            <h3>Select Specialization</h3>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="dashboard-input"
            >
              <option value="">-- Select Specialization --</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
  
          {/* Symptom Entry */}
          <div className="dashboard-card">
            <h3>Describe your symptoms (optional)</h3>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="dashboard-input"
              placeholder="Describe your symptoms"
              rows={3}
            />
          </div>
  
          {/* Show Doctors */}
          <div className="dashboard-card">
            <button onClick={searchDoctors} className="dashboard-button">
              Search Doctors
            </button>
            {searchMessage && <p className="info-message">{searchMessage}</p>}
            {doctors.length > 0 && (
              <div className="doctor-list">
                <h4>Available Doctors:</h4>
                <div className="doctor-cards-container">
                  {doctors.map((doc) => (
                    <div key={doc.id} className="doctor-card">
                      <img
                        src={doc.profilePhoto || "/default-doctor.png"}
                        alt="Doctor Profile"
                        className="doctor-profile-photo"
                      />
                      <div className="doctor-details">
                        <p><span className="label">Name:</span> <span className="value">Dr. {(doc.name || doc.user?.username).charAt(0).toUpperCase() + (doc.name || doc.user?.username).slice(1)}</span></p>
                        <p><span className="label">Specialization:</span> <span className="value">{doc.specialization}</span></p>
                        <p><span className="label">Experience:</span> <span className="value">{doc.yearsOfExperience} years</span></p>
                        <p><span className="label">Consultation Fee:</span> <span className="value">₹{doc.consultationFees}</span></p>
                        <p><span className="label">Address:</span> <span className="value">{doc.clinicAddress}</span></p>
                      </div>
                      <button
                        className="dashboard-small-btn book-btn"
                        onClick={() => setSelectedDoctor(doc)}
                      >
                        Book
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
  
          {/* Pick Date & Slot Modal */}
          {selectedDoctor && (
            <div className="dashboard-card">
              <h3>Book Appointment with Dr. {selectedDoctor.name.charAt(0).toUpperCase() + selectedDoctor.name.slice(1)}</h3>
              <h4>Date</h4>
              <input
                type="date"
                className="dashboard-input"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
              />
              <h4>Time</h4>
              <div className="time-buttons-container">
                {Array.from({ length: 9 }, (_, i) => {
                  const hour = 9 + i;
                  let hourString = hour < 10 ? `0${hour}:00` : `${hour}:00`;
                  let ampm = "AM";
                  if (hour >= 12) {
                    ampm = "PM";
                    if (hour > 12) {
                      hourString = (hour - 12) < 10 ? `0${hour - 12}:00` : `${hour - 12}:00`;
                    }
                  }
                  hourString += " " + ampm;
                  return (
                    <button
                      key={hourString}
                      className={`time-button ${time === hourString ? "selected" : ""}`}
                      onClick={() => setTime(hourString)}
                    >
                      {hourString}
                    </button>
                  );
                })}
              </div>
              <button onClick={requestAppointment} className="dashboard-button" disabled={loading || !time || !date}>
                Confirm Booking
              </button>
              <button
                className="dashboard-small-btn"
                onClick={() => setSelectedDoctor(null)}
              >
                Cancel
              </button>
            </div>
          )}
        </>
      )}
  
      {/* Appointment History */}
      {activeView === "viewAppointments" && (
        <div className="dashboard-card">
          <h3>Your Appointments</h3>
          {appointments.length === 0 ? (
            <p>No appointments found.</p>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.id}>
                    <td>{appt.doctor ? "Dr. " + appt.doctor.name.charAt(0).toUpperCase() + appt.doctor.name.slice(1) : "N/A"}</td>
                    <td>{appt.dateTime ? new Date(appt.dateTime).toLocaleDateString() : "N/A"}</td>
                    <td>{appt.dateTime ? new Date(appt.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "N/A"}</td>
                    <td>{appt.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
  
    </div>
  );
}

export default PatientDashboard;
