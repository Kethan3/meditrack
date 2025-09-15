
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import "../api/interceptor"; // Import to set up interceptors
import "../styles/auth.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(username, password);

    if (result.success) {
      const { role } = result.user;
      if (role === "PATIENT") navigate("/patient-dashboard");
      else if (role === "DOCTOR") navigate("/doctor-dashboard");
      else if (role === "ADMIN") navigate("/admin-dashboard");
    } else {
      let errorMessage = result.error;
      if (result.error.includes("not verified")) {
        errorMessage = "Your doctor account is pending admin approval.";
        setTimeout(() => {
          navigate("/doctor-waiting-approval");
        }, 2000);
      }
      setError(errorMessage);
      setPopupMessage(errorMessage);
      setShowPopup(true);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container login-page">
      <div className="auth-card login-card">
        <span className="close-button" onClick={() => navigate("/")}></span>
        <h2 className="auth-title">MediTrack Login</h2>
        <div className="login-form-container">
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="text"
              placeholder="Username"
              className="auth-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="auth-input password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="register-link">
            Don’t have an account?{" "}
            <span className="auth-link" onClick={() => navigate("/register")}>
              Register here
            </span>
          </p>
        </div>
      </div>
      {showPopup && (
        <div className="top-popup">
          <p>{popupMessage}</p>


          <button onClick={() => setShowPopup(false)}>×</button>
        </div>
      )}
    </div>
  );
}


export default LoginPage;
