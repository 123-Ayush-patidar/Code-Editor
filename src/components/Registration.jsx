import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLoginMutation, useRegisterMutation } from "../redux/Authapi/AuthApi";
import { GoogleLogin } from "@react-oauth/google";

// ─── Simulated OTP send (replace with your real SMS API) ─────────────────────
const sendOtp = async (phone) => {
  console.log(`[DEV] OTP sent to ${phone}: 123456`);
  return true;
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
    <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8H6.1C9.4 35.6 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.4 5.6l6.2 5.2C36.9 38.2 44 33 44 24c0-1.3-.1-2.6-.4-3.9z"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

// ─── Base input style ─────────────────────────────────────────────────────────
const baseInputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "999px",
  border: "1.5px solid rgba(0,224,255,0.25)",
  background: "rgba(0,20,40,0.7)",
  color: "#e0f7ff",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
  fontFamily: "inherit",
};

// ─── Input — defined at module level (NEVER inside another component) ─────────
const Input = ({ style = {}, onBlur, onFocus, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      style={{
        ...baseInputStyle,
        ...(focused ? { borderColor: "rgba(0,224,255,0.7)", boxShadow: "0 0 0 3px rgba(0,224,255,0.1)" } : {}),
        ...style,
      }}
      onFocus={(e) => {
        setFocused(true);
        if (onFocus) onFocus(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        if (onBlur) onBlur(e);
      }}
    />
  );
};

// ─── Role dropdown — defined at module level ───────────────────────────────────
const ROLES = [
  { value: "member", label: "Member", desc: "Standard collaborator access" },
  { value: "admin",  label: "Admin",  desc: "Full workspace control"       },
];

const RoleDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const selected = ROLES.find((r) => r.value === value) || ROLES[0];
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        style={{
          ...baseInputStyle,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8, color: "#e0f7ff" }}>
          <ShieldIcon /> {selected.label}
        </span>
        <span style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", color: "rgba(0,224,255,0.6)" }}>
          <ChevronDown />
        </span>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
          background: "#021a2e", border: "1.5px solid rgba(0,224,255,0.3)",
          borderRadius: 14, zIndex: 50, overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}>
          {ROLES.map((r) => (
            <div
              key={r.value}
              onMouseDown={() => { onChange(r.value); setOpen(false); }}
              style={{
                padding: "11px 16px", cursor: "pointer",
                background: r.value === value ? "rgba(0,224,255,0.08)" : "transparent",
                borderBottom: "1px solid rgba(0,224,255,0.08)",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,224,255,0.12)"}
              onMouseLeave={e => e.currentTarget.style.background = r.value === value ? "rgba(0,224,255,0.08)" : "transparent"}
            >
              <div style={{ fontWeight: 600, fontSize: 13, color: "#e0f7ff" }}>{r.label}</div>
              <div style={{ fontSize: 11, color: "rgba(0,224,255,0.5)", marginTop: 2 }}>{r.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── OTP digit boxes — defined at module level ────────────────────────────────
const OtpInput = ({ otp, setOtp }) => {
  const refs = Array.from({ length: 6 }, () => useRef());
  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 5) refs[i + 1].current?.focus();
  };
  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs[i - 1].current?.focus();
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...otp];
    text.split("").forEach((ch, idx) => { next[idx] = ch; });
    setOtp(next);
    refs[Math.min(text.length, 5)].current?.focus();
  };
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      {refs.map((ref, i) => (
        <input
          key={i} ref={ref} maxLength={1} value={otp[i]}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          style={{
            width: 42, height: 48, borderRadius: 10, textAlign: "center",
            fontSize: 20, fontWeight: 700,
            border: "1.5px solid rgba(0,224,255,0.3)",
            background: "rgba(0,20,40,0.8)", color: "#00e0ff", outline: "none",
            boxShadow: otp[i] ? "0 0 8px rgba(0,224,255,0.25)" : "none",
          }}
        />
      ))}
    </div>
  );
};

// ─── Method tab bar — defined at module level ─────────────────────────────────
const METHOD_TABS = [
  { key: "email",  label: "Email"  },
  { key: "google", label: "Google" },
  { key: "phone",  label: "Phone"  },
];

const MethodTabs = ({ active, onChange }) => (
  <div style={{
    display: "flex", background: "rgba(0,20,40,0.6)",
    borderRadius: "999px", padding: 4, gap: 4,
    border: "1px solid rgba(0,224,255,0.15)",
  }}>
    {METHOD_TABS.map(({ key, label }) => (
      <button
        key={key} type="button" onClick={() => onChange(key)}
        style={{
          flex: 1, padding: "8px 0", borderRadius: "999px", border: "none",
          cursor: "pointer", fontSize: 12, fontWeight: 600,
          background: active === key ? "linear-gradient(90deg,#00b4d8,#0077b6)" : "transparent",
          color: active === key ? "#fff" : "rgba(0,224,255,0.5)",
          transition: "background 0.2s, color 0.2s",
          fontFamily: "inherit",
        }}
      >
        {label}
      </button>
    ))}
  </div>
);

// ─── Countdown hook ───────────────────────────────────────────────────────────
const useCountdown = () => {
  const [count, setCount] = useState(0);
  const timerRef = useRef(null);
  const start = (n) => {
    setCount(n);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCount((c) => { if (c <= 1) { clearInterval(timerRef.current); return 0; } return c - 1; });
    }, 1000);
  };
  useEffect(() => () => clearInterval(timerRef.current), []);
  return [count, start];
};

// ─── Shared button styles ─────────────────────────────────────────────────────
const btnPrimary = {
  width: "100%", padding: "13px", borderRadius: "999px", border: "none",
  background: "linear-gradient(90deg, #00b4d8, #0077b6)",
  color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer",
  boxShadow: "0 0 16px rgba(0,180,216,0.45)",
  transition: "opacity 0.2s",
  fontFamily: "inherit",
};
const btnOutline = {
  width: "100%", padding: "11px", borderRadius: "999px",
  border: "1.5px solid rgba(0,224,255,0.4)", background: "transparent",
  color: "#00e0ff", fontWeight: 600, fontSize: 14, cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  transition: "background 0.2s",
  fontFamily: "inherit",
};
const Divider = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "2px 0" }}>
    <div style={{ flex: 1, height: 1, background: "rgba(0,224,255,0.12)" }} />
    <span style={{ fontSize: 11, color: "rgba(0,224,255,0.4)", letterSpacing: "0.06em" }}>OR</span>
    <div style={{ flex: 1, height: 1, background: "rgba(0,224,255,0.12)" }} />
  </div>
);
const SwitchLink = ({ text, linkText, onClick }) => (
  <p style={{ textAlign: "center", fontSize: 13, margin: 0 }}>
    {text}{" "}
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        color: "#00e0ff",
        cursor: "pointer",
        fontWeight: 600,
        fontFamily: "inherit",
        padding: 0,
      }}
    >
      {linkText}
    </button>
  </p>
);

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export default function AuthPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);

  const [register, { isLoading }]             = useRegisterMutation();
  const [login,    { isLoading: loginLoading }] = useLoginMutation();

  // ── Login state ────────────────────────────────────────────────────────────
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginTouched, setLoginTouched] = useState({ email: false, password: false });

  // ── Register state (stable — never re-created inside a render) ────────────
  const [regMethod,    setRegMethod]    = useState("email");
  const [username,     setUsername]     = useState("");
  const [regEmail,     setRegEmail]     = useState("");
  const [regPassword,  setRegPassword]  = useState("");
  const [registerTouched, setRegisterTouched] = useState({
    username: false,
    email: false,
    password: false,
    phone: false,
    otp: false,
  });
  const [role,         setRole]         = useState("member");
  const [phone,        setPhone]        = useState("");
  const [otp,          setOtp]          = useState(["","","","","",""]);
  const [otpSent,      setOtpSent]      = useState(false);
  const [otpVerified,  setOtpVerified]  = useState(false);
  const [sendingOtp,   setSendingOtp]   = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [countdown,    startCountdown]  = useCountdown();

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!loginData.email.trim() || !loginData.password.trim()) {
      toast.error("Please enter both email and password.", { position: "top-center" });
      return;
    }

    try {
      const token = localStorage.getItem("registerToken");
      const response = await login({ userData: loginData, token }).unwrap();

      if (!response?.token) {
        throw new Error("Invalid login response");
      }

      const userData = {
        id:       response.user?.id || response.userId || "",
        username: response.user?.username || response.username || loginData.email?.split("@")[0] || "",
        email:    response.user?.email || response.email || loginData.email || "",
        token:    response.token || "",
      };
      localStorage.setItem("token", response.token);
      localStorage.setItem("user",  JSON.stringify(userData));
      localStorage.setItem("userId",   userData.id);
      localStorage.setItem("username", userData.username);
      localStorage.setItem("email",    userData.email);
      localStorage.setItem("isAuthenticated", "true");
      toast.success("Login successful! Redirecting...", { position: "top-center", autoClose: 3000 });
      setTimeout(() => navigate("/dashboard", { replace: true }), 800);
    } catch {
      toast.error("Login failed. Please check your credentials.", { position: "top-center" });
    }
  };

  const saveUser = (response, extra = {}) => {
    const userData = {
      id: response.userId || response.id || "",
      username, email: regEmail, role, token: response.token || "", ...extra,
    };
    localStorage.setItem("registerToken", response.token);
    localStorage.setItem("user",     JSON.stringify(userData));
    localStorage.setItem("username", username);
    localStorage.setItem("email",    regEmail);
    localStorage.setItem("userId",   userData.id);
  };

  const resetRegisterForm = () => {
    setUsername(""); setRegEmail(""); setRegPassword(""); setRole("member");
    setPhone(""); setOtp(["","","","","",""]); setOtpSent(false); setOtpVerified(false);
    setRegMethod("email");
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setRegisterTouched((prev) => ({ ...prev, username: true, email: true, password: true }));
    if (registerErrors.username || registerErrors.email || registerErrors.password) {
      return;
    }
    try {
      const response = await register({ username, email: regEmail, password: regPassword, role }).unwrap();
      saveUser(response);
      toast.success("Registration successful! Please log in.", { position: "top-center", autoClose: 4000 });
      resetRegisterForm();
      setIsRegister(false);
    } catch {
      toast.error("Registration failed. Please try again.", { position: "top-center" });
    }
  };

const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const response = await fetch(
      "http://localhost:8086/api/auth/google",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      }
    );

    const data = await response.json();

    console.log("Google Login:", data);

    if (!data.token) {
      toast.error(data.message || "Google Login Failed");
      return;
    }

    const userData = {
      id: data.id || "",
      username: data.name,
      email: data.email,
      token: data.token,
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.name);
    localStorage.setItem("email", data.email);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userId", userData.id);
    localStorage.setItem("isAuthenticated", "true");

    toast.success("Google Login Successful");

    navigate("/dashboard", { replace: true });

  } catch (err) {
    console.error(err);
    toast.error("Google Login Failed");
  }
};
  const handleSendOtp = async () => {
    if (!phone || phone.replace(/\D/g, "").length < 10) {
      toast.error("Enter a valid phone number.", { position: "top-center" }); return;
    }
    setSendingOtp(true);
    try {
      await sendOtp(phone);
      setOtpSent(true);
      setOtp(["","","","","",""]);
      startCountdown(60);
      toast.success("OTP sent! (Dev mode: use 123456)", { position: "top-center" });
    } catch {
      toast.error("Failed to send OTP.", { position: "top-center" });
    } finally { setSendingOtp(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const entered = otp.join("");
    if (entered.length < 6) { toast.error("Enter all 6 digits.", { position: "top-center" }); return; }
    setVerifyingOtp(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      if (entered === "123456") { // TODO: replace with server verify call
        setOtpVerified(true);
        toast.success("Phone verified! Complete your registration.", { position: "top-center" });
      } else {
        toast.error("Incorrect OTP. Please try again.", { position: "top-center" });
      }
    } finally { setVerifyingOtp(false); }
  };

  const validateEmail = (value) => {
    const normalized = value.trim();
    if (!normalized) return "Email is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(normalized) ? "" : "Enter a valid email.";
  };

  const validatePassword = (value) => {
    if (!value.trim()) return "Password is required.";
    return value.trim().length < 6 ? "Password must be at least 6 characters." : "";
  };

  const validatePhone = (value) => {
    const normalized = value.replace(/\D/g, "");
    if (!normalized) return "Phone number is required.";
    return normalized.length < 10 ? "Enter a valid phone number." : "";
  };

  const validateUsername = (value) => {
    if (!value.trim()) return "Username is required.";
    return value.trim().length < 3 ? "Username must be at least 3 characters." : "";
  };

  const loginErrors = {
    email: validateEmail(loginData.email),
    password: validatePassword(loginData.password),
  };

  const registerErrors = {
    username: validateUsername(username),
    email: validateEmail(regEmail),
    password: validatePassword(regPassword),
    phone: regMethod === "phone" ? validatePhone(phone) : "",
    otp: otpSent && !otpVerified ? (otp.join("").length < 6 ? "Enter the 6-digit OTP." : "") : "",
  };

  const handlePhoneRegister = async (e) => {
    e.preventDefault();
    setRegisterTouched((prev) => ({ ...prev, username: true, email: true, password: true, phone: true, otp: true }));
    if (registerErrors.username || registerErrors.email || registerErrors.password || registerErrors.phone || (otpSent && !otpVerified)) {
      return;
    }
    try {
      const response = await register({ username, email: regEmail, password: regPassword, role, phone }).unwrap();
      saveUser(response, { phone });
      toast.success("Registration successful! Please log in.", { position: "top-center", autoClose: 4000 });
      resetRegisterForm();
      setIsRegister(false);
    } catch {
      toast.error("Registration failed. Please try again.", { position: "top-center" });
    }
  };

  const switchMethod = (m) => {
    setRegMethod(m);
    setOtpSent(false); setOtpVerified(false); setOtp(["","","","","",""]);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="auth-page">
      <div className={`auth-container ${isRegister ? "active" : ""}`}>

        {/* ── LOGIN FORM ───────────────────────────────────────────────── */}
        <div className="form-box login-box">
          <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <h2 style={{ margin: 0, textAlign: "center" }}>Login</h2>

            <div style={{ position: 'relative' }}>
              <Input
                type="email" placeholder="Email" value={loginData.email}
                required
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                onBlur={() => setLoginTouched((prev) => ({ ...prev, email: true }))}
              />
              {loginTouched.email && loginErrors.email && (
                <span style={{ color: '#ff6b6b', fontSize: 12, marginTop: 6, display: 'block' }}>
                  {loginErrors.email}
                </span>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <Input
                type="password" placeholder="Password" value={loginData.password}
                required
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                onBlur={() => setLoginTouched((prev) => ({ ...prev, password: true }))}
              />
              {loginTouched.password && loginErrors.password && (
                <span style={{ color: '#ff6b6b', fontSize: 12, marginTop: 6, display: 'block' }}>
                  {loginErrors.password}
                </span>
              )}
            </div>
            <button type="submit" style={btnPrimary} disabled={loginLoading || !loginData.email.trim() || !loginData.password.trim()}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              {loginLoading ? "Logging in..." : "Login"}
            </button>

            <Divider />

            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                    toast.error("Google Login Failed");
                }}
            />

            <SwitchLink text="Don't have an account?" linkText="Register" onClick={() => setIsRegister(true)} />
          </form>
        </div>

        {/* ── REGISTER FORM ────────────────────────────────────────────── */}
        <div className="form-box register-box">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h2 style={{ margin: 0, textAlign: "center" }}>Register</h2>

            {/* Method tabs */}
            <MethodTabs active={regMethod} onChange={switchMethod} />

            {/* Common fields — always rendered, never remounted */}
            <div style={{ position: 'relative' }}>
              <Input
                type="text" placeholder="Username" value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => setRegisterTouched((prev) => ({ ...prev, username: true }))}
              />
              {registerTouched.username && registerErrors.username && (
                <span style={{ color: '#ff6b6b', fontSize: 12, marginTop: 6, display: 'block' }}>
                  {registerErrors.username}
                </span>
              )}
            </div>
            <RoleDropdown value={role} onChange={setRole} />

            {/* ── EMAIL ── */}
            {regMethod === "email" && (
              <form onSubmit={handleEmailRegister} style={{ display: "contents" }}>
                <div style={{ position: 'relative' }}>
                  <Input
                    type="email" placeholder="Email" value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    onBlur={() => setRegisterTouched((prev) => ({ ...prev, email: true }))}
                  />
                  {registerTouched.email && registerErrors.email && (
                    <span style={{ color: '#ff6b6b', fontSize: 12, marginTop: 6, display: 'block' }}>
                      {registerErrors.email}
                    </span>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <Input
                    type="password" placeholder="Password" value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    onBlur={() => setRegisterTouched((prev) => ({ ...prev, password: true }))}
                  />
                  {registerTouched.password && registerErrors.password && (
                    <span style={{ color: '#ff6b6b', fontSize: 12, marginTop: 6, display: 'block' }}>
                      {registerErrors.password}
                    </span>
                  )}
                </div>
                <button type="submit" style={btnPrimary} disabled={isLoading}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                  {isLoading ? "Registering..." : "Create Account"}
                </button>
              </form>
            )}

            {/* ── GOOGLE ── */}
            {regMethod === "google" && (
              <>
                <div style={{ position: 'relative' }}>
                  <Input
                    type="email" placeholder="Email (optional)" value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    onBlur={() => setRegisterTouched((prev) => ({ ...prev, email: true }))}
                  />
                  {registerTouched.email && registerErrors.email && (
                    <span style={{ color: '#ff6b6b', fontSize: 12, marginTop: 6, display: 'block' }}>
                      {registerErrors.email}
                    </span>
                  )}
                </div>
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                        toast.error("Google Login Failed");
                    }}
                />
                <p style={{ textAlign: "center", fontSize: 11, color: "rgba(0,224,255,0.4)", margin: 0 }}>
                  You'll be redirected to Google to complete sign-up
                </p>
              </>
            )}

            {/* ── PHONE ── */}
            {regMethod === "phone" && (
              <form onSubmit={otpVerified ? handlePhoneRegister : otpSent ? handleVerifyOtp : (e) => { e.preventDefault(); handleSendOtp(); }}
                style={{ display: "contents" }}>
                <div style={{ position: 'relative' }}>
                  <Input
                    type="email" placeholder="Email" value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    onBlur={() => setRegisterTouched((prev) => ({ ...prev, email: true }))}
                  />
                  {registerTouched.email && registerErrors.email && (
                    <span style={{ color: '#ff6b6b', fontSize: 12, marginTop: 6, display: 'block' }}>
                      {registerErrors.email}
                    </span>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <Input
                    type="password" placeholder="Password" value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    onBlur={() => setRegisterTouched((prev) => ({ ...prev, password: true }))}
                  />
                  {registerTouched.password && registerErrors.password && (
                    <span style={{ color: '#ff6b6b', fontSize: 12, marginTop: 6, display: 'block' }}>
                      {registerErrors.password}
                    </span>
                  )}
                </div>

                {/* Phone + Send OTP row */}
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Input
                      type="tel" placeholder="+91 Phone Number" value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ flex: 1 }}
                      disabled={otpVerified}
                      onBlur={() => setRegisterTouched((prev) => ({ ...prev, phone: true }))}
                    />
                    {registerTouched.phone && registerErrors.phone && (
                      <span style={{ color: '#ff6b6b', fontSize: 12, marginTop: 6, display: 'block' }}>
                        {registerErrors.phone}
                      </span>
                    )}
                  </div>
                  {!otpVerified && (
                    <button type="button" onClick={handleSendOtp}
                      disabled={sendingOtp || countdown > 0}
                      style={{
                        padding: "10px 14px", borderRadius: "999px",
                        border: "1.5px solid rgba(0,224,255,0.35)", background: "transparent",
                        color: countdown > 0 ? "rgba(0,224,255,0.35)" : "#00e0ff",
                        fontWeight: 600, fontSize: 12, whiteSpace: "nowrap",
                        cursor: countdown > 0 ? "not-allowed" : "pointer",
                        fontFamily: "inherit",
                      }}>
                      {sendingOtp ? "Sending..." : countdown > 0 ? `${countdown}s` : otpSent ? "Resend" : "Send OTP"}
                    </button>
                  )}
                </div>

                {/* OTP boxes */}
                {otpSent && !otpVerified && (
                  <>
                    <p style={{ margin: 0, fontSize: 12, color: "rgba(0,224,255,0.6)", textAlign: "center" }}>
                      Enter the 6-digit OTP sent to {phone}
                    </p>
                    <OtpInput otp={otp} setOtp={setOtp} />
                    {registerErrors.otp && (
                      <span style={{ color: '#ff6b6b', fontSize: 12, marginTop: 6, display: 'block', textAlign: 'center' }}>
                        {registerErrors.otp}
                      </span>
                    )}
                    <button type="submit" disabled={verifyingOtp}
                      style={{ ...btnPrimary, background: "linear-gradient(90deg,#7c3aed,#4f46e5)" }}>
                      {verifyingOtp ? "Verifying..." : "Verify OTP"}
                    </button>
                  </>
                )}

                {/* Verified badge */}
                {otpVerified && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#34d399", fontSize: 13, fontWeight: 600 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Phone verified
                  </div>
                )}

                {otpVerified && (
                  <button type="submit" style={btnPrimary} disabled={isLoading}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    {isLoading ? "Registering..." : "Create Account"}
                  </button>
                )}
              </form>
            )}

            <SwitchLink text="Already have an account?" linkText="Login" onClick={() => setIsRegister(false)} />
          </div>
        </div>

        {/* ── SLIDING PANEL ────────────────────────────────────────────── */}
        <div className="panel">
          <div className="panel-content panel-login">
            <img src="/logo.png" alt="CodeHive Logo" style={{ width: 300, maxWidth: "100%", display: "block", margin: "0 auto" }} />
            <h1>WELCOME BACK!</h1>
            <p>Login to continue your journey</p>
            <button type="button" className="outline-btn" onClick={() => setIsRegister(true)}>Register</button>
          </div>
          <div className="panel-content panel-register">
            <img src="/logo.png" alt="CodeHive Logo" style={{ width: 300, maxWidth: "100%", display: "block", margin: "0 auto" }} />
            <h1>JOIN US</h1>
            <p>Create your account today</p>
            <button type="button" className="outline-btn" onClick={() => setIsRegister(false)}>Login</button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}