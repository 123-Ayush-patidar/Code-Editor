import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCode, FaRocket, FaLink, FaUsers, FaPlay } from "react-icons/fa";
import { useCreateSessionMutation } from "../redux/SessionApi";

const LANGUAGE_OPTIONS = [
  { value: "Java", label: "Java 17" },
  { value: "Python", label: "Python 3.12" },
  { value: "JavaScript", label: "JavaScript" },
  { value: "C++", label: "C++" },
  { value: "React", label: "React" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [language, setLanguage] = useState("Java");
  const [sessionToken, setSessionToken] = useState("");
  const [joinName, setJoinName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState("");

  const [createSession, { isLoading: creating }] = useCreateSessionMutation();

  const handleCreateSession = async () => {
    if (!name.trim()) {
      setError("Please enter your name to create a session.");
      return;
    }

    try {
      setError("");
      const response = await createSession({
        hostName: name,
        programmingLanguage: language,
        publicRoom: isPublic,
      }).unwrap();

      setSessionToken(response.sessionToken || "");
      navigate(`/editor/${language}`);
    } catch (err) {
      setError("Unable to create session. Please try again.");
      console.error(err);
    }
  };

  const handleJoinSession = () => {
    if (!sessionToken.trim() || !joinName.trim()) {
      setError("Please enter a session link/token and your name.");
      return;
    }

    setError("");
    navigate(`/editor/${language}`);
  };

  return (
    <div style={pageStyle}>
      <div style={backgroundBlur1} />
      <div style={backgroundBlur2} />
      <div style={backgroundBlur3} />

      <nav style={navStyle}>
        <div style={navInnerStyle}>
          <div style={brandStyle}>
            <div style={brandIconStyle}>
              <FaCode style={{ color: "#22d3ee", fontSize: 20 }} />
            </div>
            <h1 style={brandTitleStyle}>
              CollabCode <span style={{ color: "#60a5fa" }}>IDE</span>
            </h1>
          </div>
          <button style={navButtonStyle}>Dashboard</button>
        </div>
      </nav>

      <main style={mainStyle}>
        <div style={heroStyle}>
          <div style={heroIconStyle}>
            <FaUsers style={{ color: "#38bdf8", fontSize: 28 }} />
          </div>
          <h1 style={heroTitleStyle}>CollabCode</h1>
          <p style={heroTextStyle}>Real-time collaborative coding — write, run, and debug together.</p>
        </div>

        <div style={gridStyle}>
          <section style={panelStyle}>
            <div style={panelHeaderStyle}>
              <div style={panelBadgeStyle}>
                <FaRocket style={{ color: "#60a5fa", fontSize: 18 }} />
              </div>
              <div>
                <h2 style={panelTitleStyle}>Create Session</h2>
                <p style={panelSubtitleStyle}>Launch a fresh session and invite collaborators instantly.</p>
              </div>
            </div>

            {error && <div style={errorStyle}>{error}</div>}

            <div style={formGridStyle}>
              <label style={labelStyle}>
                Your Name
                <input
                  style={inputStyle}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  placeholder="Type your name..."
                />
              </label>

              <label style={labelStyle}>
                Language
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={selectStyle}
                >
                  {LANGUAGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div style={toggleRowStyle}>
                <div>
                  <p style={toggleTitleStyle}>Public room</p>
                  <p style={toggleSubtitleStyle}>Anyone with the link can join.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPublic((prev) => !prev)}
                  style={{
                    ...toggleButtonStyle,
                    background: isPublic ? "#22c55e" : "#475569",
                  }}
                >
                  <span style={{ ...toggleCircleStyle, left: isPublic ? 28 : 4 }} />
                </button>
              </div>

              <button
                type="button"
                style={{
                  ...primaryButtonStyle,
                  opacity: creating ? 0.7 : 1,
                  cursor: creating ? "not-allowed" : "pointer",
                }}
                onClick={handleCreateSession}
                disabled={creating}
              >
                <FaRocket />
                {creating ? "Creating..." : "Create Session"}
              </button>
            </div>
          </section>

          <section style={{ ...panelStyle, border: "1px solid rgba(52,211,153,0.18)" }}>
            <div style={panelHeaderStyle}>
              <div style={{ ...panelBadgeStyle, background: "rgba(52,211,153,0.12)" }}>
                <FaLink style={{ color: "#34d399", fontSize: 18 }} />
              </div>
              <div>
                <h2 style={panelTitleStyle}>Join Session</h2>
                <p style={panelSubtitleStyle}>Paste a session link or token to connect instantly.</p>
              </div>
            </div>

            <div style={formGridStyle}>
              <label style={labelStyle}>
                Session Link or Token
                <input
                  style={inputStyle}
                  value={sessionToken}
                  onChange={(e) => {
                    setSessionToken(e.target.value);
                    setError("");
                  }}
                  placeholder="Paste link or session token..."
                />
              </label>

              <label style={labelStyle}>
                Your Name
                <input
                  style={inputStyle}
                  value={joinName}
                  onChange={(e) => {
                    setJoinName(e.target.value);
                    setError("");
                  }}
                  placeholder="Type your name..."
                />
              </label>

              <button style={{ ...primaryButtonStyle, background: "linear-gradient(135deg, #059669 0%, #10b981 100%)" }} onClick={handleJoinSession}>
                <FaPlay />
                Join Session
              </button>

              <div style={infoBoxStyle}>
                <strong>How it works:</strong>
                <p style={{ margin: "8px 0 0", color: "#94a3b8", lineHeight: 1.7 }}>
                  The session host creates a room and shares the link. Others can join with a name and begin coding together.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#020817",
  color: "#e2e8f0",
  fontFamily: "'Inter', sans-serif",
  overflowX: "hidden",
  position: "relative",
};

const backgroundBlur1 = {
  position: "fixed",
  top: 80,
  left: 40,
  width: 360,
  height: 360,
  background: "#1d4ed8",
  opacity: 0.15,
  filter: "blur(140px)",
  borderRadius: "50%",
  pointerEvents: "none",
};

const backgroundBlur2 = {
  position: "fixed",
  bottom: 40,
  right: 40,
  width: 360,
  height: 360,
  background: "#7c3aed",
  opacity: 0.15,
  filter: "blur(140px)",
  borderRadius: "50%",
  pointerEvents: "none",
};

const backgroundBlur3 = {
  position: "fixed",
  top: "40%",
  left: "50%",
  width: 280,
  height: 280,
  background: "#0e7490",
  opacity: 0.08,
  filter: "blur(120px)",
  borderRadius: "50%",
  transform: "translateX(-50%)",
  pointerEvents: "none",
};

const navStyle = {
  borderBottom: "1px solid rgba(30,58,138,0.6)",
  background: "rgba(7,20,38,0.85)",
  backdropFilter: "blur(16px)",
  position: "sticky",
  top: 0,
  zIndex: 50,
};

const navInnerStyle = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "14px 28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const brandStyle = {
  display: "flex",
  alignItems: "center",
  gap: 14,
};

const brandIconStyle = {
  width: 48,
  height: 48,
  borderRadius: 14,
  border: "1.5px solid rgba(6,182,212,0.5)",
  background: "rgba(6,182,212,0.08)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 0 18px rgba(6,182,212,0.15)",
};

const brandTitleStyle = {
  fontSize: 26,
  fontWeight: 800,
  margin: 0,
  letterSpacing: "-0.02em",
  lineHeight: 1,
};

const navButtonStyle = {
  border: "1.5px solid rgba(6,182,212,0.45)",
  background: "rgba(6,182,212,0.07)",
  color: "#e2e8f0",
  padding: "8px 20px",
  borderRadius: 12,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 7,
  transition: "background 0.2s",
};

const mainStyle = {
  position: "relative",
  zIndex: 10,
  padding: "52px 20px 80px",
};

const heroStyle = {
  textAlign: "center",
  marginBottom: 40,
};

const heroIconStyle = {
  width: 84,
  height: 84,
  margin: "0 auto 18px",
  borderRadius: 26,
  background: "linear-gradient(135deg, rgba(37,99,235,0.16), rgba(56,189,248,0.12))",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 0 40px rgba(14,165,233,0.15)",
};

const heroTitleStyle = {
  fontSize: 42,
  fontWeight: 900,
  margin: 0,
  letterSpacing: "-0.04em",
};

const heroTextStyle = {
  fontSize: 16,
  color: "#94a3b8",
  marginTop: 12,
  maxWidth: 680,
  marginLeft: "auto",
  marginRight: "auto",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 24,
};

const panelStyle = {
  background: "rgba(15,23,42,0.95)",
  border: "1px solid rgba(59,130,246,0.18)",
  borderRadius: 28,
  padding: 32,
  boxShadow: "0 20px 60px rgba(0,0,0,0.22)",
};

const panelHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 24,
};

const panelBadgeStyle = {
  width: 44,
  height: 44,
  borderRadius: 14,
  background: "rgba(59,130,246,0.12)",
  display: "grid",
  placeItems: "center",
};

const panelTitleStyle = {
  fontSize: 24,
  fontWeight: 800,
  margin: 0,
};

const panelSubtitleStyle = {
  fontSize: 14,
  color: "#64748b",
  margin: 0,
};

const errorStyle = {
  marginBottom: 20,
  padding: "14px 16px",
  borderRadius: 16,
  background: "rgba(248,113,113,0.12)",
  border: "1px solid rgba(248,113,113,0.2)",
  color: "#fca5a5",
};

const formGridStyle = {
  display: "grid",
  gap: 18,
};

const labelStyle = {
  display: "grid",
  gap: 10,
  color: "#cbd5e1",
  fontSize: 14,
  fontWeight: 600,
};

const inputStyle = {
  width: "100%",
  background: "#0f172a",
  border: "1px solid rgba(148,163,184,0.16)",
  borderRadius: 16,
  padding: "14px 16px",
  color: "#e2e8f0",
  outline: "none",
  fontSize: 15,
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const selectStyle = {
  width: "100%",
  background: "#0f172a",
  border: "1px solid rgba(148,163,184,0.16)",
  borderRadius: 16,
  padding: "14px 16px",
  color: "#e2e8f0",
  outline: "none",
  fontSize: 15,
  cursor: "pointer",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const toggleRowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 18px",
  borderRadius: 18,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(148,163,184,0.12)",
};

const toggleTitleStyle = {
  margin: 0,
  fontSize: 15,
  fontWeight: 600,
};

const toggleSubtitleStyle = {
  margin: 0,
  fontSize: 13,
  color: "#94a3b8",
};

const toggleButtonStyle = {
  width: 52,
  height: 28,
  borderRadius: 999,
  border: "none",
  position: "relative",
  cursor: "pointer",
};

const toggleCircleStyle = {
  position: "absolute",
  top: 4,
  width: 22,
  height: 22,
  borderRadius: "50%",
  background: "#fff",
  transition: "left 0.2s",
};

const primaryButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  width: "100%",
  border: "none",
  borderRadius: 16,
  padding: "14px 0",
  background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 55%, #0891b2 100%)",
  color: "#fff",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 20px 40px rgba(15,23,42,0.25)",
  transition: "transform 0.2s, filter 0.2s",
};

const infoBoxStyle = {
  padding: "18px 20px",
  borderRadius: 18,
  background: "rgba(15,23,42,0.6)",
  border: "1px solid rgba(148,163,184,0.12)",
};
