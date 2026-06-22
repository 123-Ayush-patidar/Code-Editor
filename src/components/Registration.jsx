import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import "./AuthPage.css";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e) => {
  e.preventDefault();
  navigate("/dashboard");
};

  return (
    <div className="auth-page">
      <div className={`auth-container ${isRegister ? "active" : ""}`}>
        
        {/* LOGIN FORM */}
        <div className="form-box login-box">
          <form onSubmit={handleSubmit}>
            <h2>Login</h2>

            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />

            <button type="submit" className="submit-btn">
              Login
            </button>

            <p>
              Don't have an account?{" "}
              <span onClick={() => setIsRegister(true)}>
                Register
              </span>
            </p>
          </form>
        </div>

        {/* REGISTER FORM */}
        <div className="form-box register-box">
          <form>
            <h2>Register</h2>

            <input type="text" placeholder="Username" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />

            <button type="submit" className="submit-btn">
              Register
            </button>

            <p>
              Already have an account?{" "}
              <span onClick={() => setIsRegister(false)}>
                Login
              </span>
            </p>
          </form>
        </div>

        {/* SLIDING PANEL */}
        <div className="panel">
          <div className="panel-content panel-login">
            <h1>WELCOME BACK!</h1>
            <p>Login to continue your journey</p>

            <button
              className="outline-btn"
              onClick={() => setIsRegister(true)}
            >
              Register
            </button>
          </div>

          <div className="panel-content panel-register">
            <h1>JOIN US</h1>
            <p>Create your account today</p>

            <button
              className="outline-btn"
              onClick={() => setIsRegister(false)}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}