
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import doctorService from "../api/doctors";
import "../styles/auth.css";

function DoctorWaitingApproval() {
  const navigate = useNavigate();

  // New state for additional doctor details
  const [qualifications, setQualifications] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [consultationFees, setConsultationFees] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      let photoData = profilePhoto;
      if (selectedFile) {
        photoData = await convertFileToBase64(selectedFile);
      }

      await doctorService.updateDoctorDetails(userId, {
        qualifications,
        yearsOfExperience: parseInt(yearsOfExperience, 10),
        profilePhoto: photoData,
        consultationFees: parseFloat(consultationFees),
        clinicAddress,
      });

      setToast({ show: true, message: "Details updated successfully. Please wait for admin approval.", type: "success" });
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    } catch (err) {
      setError("An error occurred while updating details");
    }

    setLoading(false);
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <span className="close-button" onClick={() => navigate("/")}></span>
        <h2 className="auth-title">Complete Your Profile for Admin Approval</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Qualifications"
            className="auth-input"
            value={qualifications}
            onChange={(e) => setQualifications(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Years of Experience"
            className="auth-input"
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(e.target.value)}
            required
            min="0"
          />
          {/* Replace URL input with file upload */}
          <label>Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            className="auth-input"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedFile(e.target.files[0]);
              }
            }}
            required
          />
          <input
            type="number"
            placeholder="Consultation Fees"
            className="auth-input"
            value={consultationFees}
            onChange={(e) => setConsultationFees(e.target.value)}
            required
            min="0"
            step="0.01"
          />
          <input
            type="text"
            placeholder="Clinic/Hospital Address"
            className="auth-input"
            value={clinicAddress}
            onChange={(e) => setClinicAddress(e.target.value)}
            required
          />
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Saving..." : "Save Details"}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
      {toast.show && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default DoctorWaitingApproval;

