
import React from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/auth";
import "../api/interceptor"; // Import to set up interceptors
import "../styles/auth.css";

function RegisterPage() {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("PATIENT");
  const [specialization, setSpecialization] = React.useState("");
  const [specializationSearch, setSpecializationSearch] = React.useState("");
  const [showSpecializationDropdown, setShowSpecializationDropdown] = React.useState(false);
  const [phone, setPhone] = React.useState("");
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [toast, setToast] = React.useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  const specializations = [
    "Cardiology", "Dermatology", "Neurology", "Pediatrics", "Psychiatry",
    "Radiology", "Surgery", "Orthopedics", "Gynecology", "Ophthalmology",
    "ENT", "Dentistry", "Urology", "Nephrology", "Gastroenterology",
    "Endocrinology", "Oncology", "Hematology", "Rheumatology", "Pulmonology"
  ];

  const filteredSpecializations = specializations.filter(spec =>
    spec.toLowerCase().includes(specializationSearch.toLowerCase())
  );

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (dateOfBirth) {
      const age = calculateAge(dateOfBirth);
      if (age < 18) {
        setToast({ show: true, message: "You must be at least 18 years old to register.", type: "error" });
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
        setLoading(false);
        return;
      }
    }

    const result = await signup(username, email, password, role, phone, dateOfBirth, specialization);

if (result.success) {
      if (role === "DOCTOR") {
        localStorage.setItem('userId', result.user.id);
        setToast({ show: true, message: "Registration successful! Please complete your profile details.", type: "success" });
        setTimeout(() => {
          navigate("/doctor-waiting-approval");
        }, 3000);
      } else {
        setToast({ show: true, message: "Registration successful! Please login.", type: "success" });
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } else {
      setToast({ show: true, message: result.error, type: "error" });
      setTimeout(() => {
        setToast({ show: false, message: "", type: "" });
      }, 3000);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <span className="close-button" onClick={() => navigate("/")}></span>
        <h2 className="auth-title">MediTrack Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            className="auth-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="date"
            placeholder="Date of Birth"
            className="auth-input"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
          <select
            className="auth-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="PATIENT">Patient</option>
            <option value="DOCTOR">Doctor</option>
          </select>
          {role === "DOCTOR" && (
            <div className="searchable-dropdown" style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search and select specialization"
                className="auth-input"
                value={specializationSearch}
                onChange={(e) => {
                  setSpecializationSearch(e.target.value);
                  setShowSpecializationDropdown(true);
                }}
                onFocus={() => setShowSpecializationDropdown(true)}
                required
              />
              {showSpecializationDropdown && (
                <div
                  className="dropdown-list"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    maxHeight: "200px",
                    overflowY: "auto",
                    zIndex: 1000,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                  }}
                >
                  {filteredSpecializations.length > 0 ? (
                    filteredSpecializations.map((spec) => (
                      <div
                        key={spec}
                        className="dropdown-item"
                        style={{
                          padding: "10px",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee"
                        }}
                        onClick={() => {
                          setSpecialization(spec);
                          setSpecializationSearch(spec);
                          setShowSpecializationDropdown(false);
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"}
                        onMouseLeave={(e) => e.target.style.backgroundColor = "white"}
                      >
                        {spec}
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: "10px", color: "#999" }}>
                      No specializations found
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <span className="auth-link" onClick={() => navigate("/login")}>
            Login here
          </span>
        </p>
      </div>
      {toast.show && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default RegisterPage;

