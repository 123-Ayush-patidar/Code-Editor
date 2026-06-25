import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLoginMutation, useRegisterMutation } from "../redux/Authapi/AuthApi";
// import "./AuthPage.css";

export default function AuthPage() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

const handleRegister = async (e) => {
  e.preventDefault();

  try {
    const response = await register(registerData).unwrap();

    console.log("Register Success:", response);
    toast.success("Registration successful! Please log in.", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    setRegisterData({
      username: "",
      email: "",
      password: "",
    });

    setIsRegister(false);
  } catch (error) {
    console.error("Register Error:", error);
    console.log("Error Data:", error?.data);
    console.log("Error Status:", error?.status);

    toast.error("Registration failed. Please try again.", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await login(loginData).unwrap();

    console.log("Login Success:", response);
    localStorage.setItem("isAuthenticated", "true");

    toast.success("Login successful! Redirecting...", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 800);
  } catch (error) {
    console.error("Login Error:", error);
    console.log("Error Data:", error?.data);
    console.log("Error Status:", error?.status);

    toast.error("Login failed. Please check your credentials.", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
};

  return (
    <div className="auth-page">
      <div className={`auth-container ${isRegister ? "active" : ""}`}>
        
        {/* LOGIN FORM */}
        <div className="form-box login-box">
          <form onSubmit={handleSubmit}>
            <h2>Login</h2>

           <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  email: e.target.value,
                })
              }
            />
            <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    password: e.target.value,
                  })
                }
              />

          <button
              type="submit"
              className="submit-btn"
              disabled={loginLoading}
            >
              {loginLoading ? "Logging in..." : "Login"}
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
          <form onSubmit={handleRegister}>
            <h2>Register</h2>

            <input
              type="text"
              placeholder="Username"
              value={registerData.username}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  username: e.target.value,
                })
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  email: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  password: e.target.value,
                })
              }
            />

            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
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
            <img
              src="/logo.png"
              alt="CodeHive Logo"
              style={{ width: 340, maxWidth: "100%", display: "block", margin: "0 auto " }}
            />
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
            <img
              src="/logo.png"
              alt="CodeHive Logo"
              style={{ width: 340, maxWidth: "100%", display: "block", margin: "0 auto" }}
            />
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
      <ToastContainer />
    </div>
  );
}