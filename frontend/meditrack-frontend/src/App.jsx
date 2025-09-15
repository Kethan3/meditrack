
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomePage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PatientDashboard from "./pages/PatientDashboard";
import PatientProfile from "./pages/PatientProfile";
import AppointmentHistory from "./pages/AppointmentHistory";
import HealthRecords from "./pages/HealthRecords";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorProfile from "./pages/DoctorProfile";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorWaitingApproval from "./pages/DoctorWaitingApproval";
import "./styles/global.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/patient-profile" element={<PatientProfile />} />
        <Route path="/appointment-history" element={<AppointmentHistory />} />
        <Route path="/health-records" element={<HealthRecords />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor-profile" element={<DoctorProfile />} />
        <Route path="/doctor-appointments" element={<DoctorAppointments />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/doctor-waiting-approval" element={<DoctorWaitingApproval />} />
      </Routes>
    </Router>
  );
}

export default App;


