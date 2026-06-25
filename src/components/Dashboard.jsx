import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCode, FaRocket, FaLink, FaUsers, FaPlay } from "react-icons/fa";
import { useCreateSessionMutation, useGetAllSessionsQuery, useLazyGetAllSessionsQuery } from "../redux/SessionApi";

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
  const [fetchSessions, { isLoading: loadingSessions }] = useLazyGetAllSessionsQuery();
  const { data: activeSessions = [], isLoading: activeLoading, isError: activeError } = useGetAllSessionsQuery();
  const activeSessionsToShow = (activeSessions || []).filter(
    (session) =>
      session.status === "ACTIVE" ||
      session.isActive ||
      session.active ||
      !session.status
  );
  const [joinLoading, setJoinLoading] = useState(false);

  const handleSelectSession = (token) => {
    setSessionToken(token);
    setError("");
  };

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

  const handleJoinSession = async () => {
    if (!sessionToken.trim() || !joinName.trim()) {
      setError("Please enter a session link/token and your name.");
      return;
    }

    setError("");
    setJoinLoading(true);
    setSessionsError(false);

    try {
      const sessionList = await fetchSessions().unwrap();
      setSessions(sessionList || []);

      const matchedSession = (sessionList || []).find(
        (session) => (session.sessionToken || "").trim() === sessionToken.trim()
      );

      if (!matchedSession) {
        setError("Session token not found. Please check your token.");
        return;
      }

      navigate(`/editor/${matchedSession.programmingLanguage || language}`);
    } catch (err) {
      console.error(err);
      setError("Unable to verify session token. Please try again.");
      setSessionsError(true);
    } finally {
      setJoinLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.setItem("isAuthenticated", "false");
    localStorage.removeItem("isAuthenticated");
    navigate("/", { replace: true });
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
              CodeHive <span style={{ color: "#60a5fa" }}>IDE</span>
            </h1>
          </div>
          <div style={navActionsStyle}>
            <button style={navButtonStyle}>Dashboard</button>
            <button style={{ ...navButtonStyle, marginLeft: 12, background: "rgba(248,113,113,0.16)", color: "#fecaca" }} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main style={mainStyle}>
        <div style={heroStyle}>
          <div style={heroIconStyle}>
            {/* <FaUsers style={{ color: "#38bdf8", fontSize: 28 }} /> */}
            <img
              src="/logo.png"
              alt="CodeHive Logo"
              style={{ width: 250, maxWidth: "100%", display: "block", margin: "0 auto " }}
            />
          </div>
          {/* <h1 style={heroTitleStyle}>CodeHive</h1> */}
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

        <section style={sessionListSectionStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={sessionSectionTitleStyle}>Active Sessions</h2>
            <p style={sessionSectionSubtitleStyle}>Fetch and display Sessions.</p>
          </div>

          {activeLoading ? (
            <div style={sessionStatusStyle}>Loading active sessions...</div>
          ) : activeError ? (
            <div style={{ ...sessionStatusStyle, color: "#fda4af" }}>
              Unable to load active sessions. Please refresh.
            </div>
          ) : activeSessionsToShow.length === 0 ? (
            <div style={sessionStatusStyle}>No active sessions found yet.</div>
          ) : (
            <div style={sessionCardsGridStyle}>
              {activeSessionsToShow.map((session) => (
                <div key={session.id} style={sessionCardStyle}>
                  <div style={sessionCardHeaderStyle}>
                    <span style={sessionLanguageBadgeStyle}>{session.programmingLanguage}</span>
                    <span style={sessionStatusBadgeStyle}>{session.status ?? "ACTIVE"}</span>
                  </div>
                  <h3 style={sessionCardTitleStyle}>{session.hostName}</h3>
                  <p style={sessionCardTextStyle}>{session.publicRoom ? "Public room" : "Private room"}</p>
                  <p style={sessionCardTextStyle}>Token: {session.sessionToken}</p>
                  <button style={sessionSelectButtonStyle} onClick={() => handleSelectSession(session.sessionToken)}>
                    Select Token
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
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
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "24px 0",
  position: "relative",
  zIndex: 2,
};

const navInnerStyle = {
  width: "100%",
  maxWidth: 1180,
  padding: "0 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const navActionsStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const brandStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const brandIconStyle = {
  width: 44,
  height: 44,
  display: "grid",
  placeItems: "center",
  background: "rgba(56,189,248,0.12)",
  borderRadius: 14,
};

const brandTitleStyle = {
  fontSize: 22,
  margin: 0,
};

const navButtonStyle = {
  padding: "12px 24px",
  background: "rgba(96,165,250,0.14)",
  border: "1px solid rgba(96,165,250,0.20)",
  borderRadius: 999,
  color: "#96cdfb",
  cursor: "pointer",

};

const mainStyle = {
  width: "100%",
  maxWidth: 1180,
  margin: "0 auto",
  padding: "0 24px 60px",
  zIndex: 2,
  position: "relative",
};

const heroStyle = {
  display: "grid",
  placeItems: "center",
  textAlign: "center",
  padding: "10px 0 40px",
};

const heroIconStyle = {
  width: 190,
  height: 190,
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  background: "rgba(56,189,248,0.15)",
  margin: "0 auto 10px",
};

const heroTitleStyle = {
  fontSize: 44,
  margin: 0,
  letterSpacing: "-0.04em",
  color: "#60a5fa" 
};

const heroTextStyle = {
  color: "#94a3b8",
  maxWidth: 720,
  margin: "16px auto 0",
  lineHeight: 1.75,
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 24,
  alignItems: "start",
};

const panelStyle = {
  background: "rgba(15,23,42,0.92)",
  borderRadius: 24,
  padding: 28,
  boxShadow: "0 20px 80px rgba(0,0,0,0.12)",
  border: "1px solid rgba(148,163,184,0.12)",
};

const panelHeaderStyle = {
  display: "flex",
  gap: 16,
  alignItems: "center",
  marginBottom: 24,
};

const panelBadgeStyle = {
  width: 44,
  height: 44,
  display: "grid",
  placeItems: "center",
  borderRadius: 14,
  background: "rgba(96,165,250,0.12)",
};

const panelTitleStyle = {
  fontSize: 20,
  margin: 0,
};

const panelSubtitleStyle = {
  color: "#94a3b8",
  margin: "6px 0 0",
  lineHeight: 1.6,
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
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 16,
  border: "1px solid rgba(148,163,184,0.18)",
  background: "rgba(15,23,42,0.9)",
  color: "#e2e8f0",
};

const selectStyle = {
  ...inputStyle,
  appearance: "none",
};

const toggleRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
};

const toggleTitleStyle = {
  margin: 0,
  fontWeight: 600,
};

const toggleSubtitleStyle = {
  margin: 0,
  color: "#94a3b8",
  fontSize: 13,
  lineHeight: 1.5,
};

const toggleButtonStyle = {
  width: 56,
  height: 32,
  borderRadius: 999,
  border: "none",
  position: "relative",
  padding: 4,
  display: "flex",
  alignItems: "center",
};

const toggleCircleStyle = {
  position: "absolute",
  width: 24,
  height: 24,
  borderRadius: "50%",
  background: "#fff",
  transition: "left 0.2s ease",
};

const primaryButtonStyle = {
  display: "inline-flex",
  gap: 10,
  alignItems: "center",
  justifyContent: "center",
  padding: "14px 20px",
  borderRadius: 16,
  border: "none",
  background: "linear-gradient(135deg, #2563eb 0%, #22d3ee 100%)",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const errorStyle = {
  background: "rgba(248,113,113,0.12)",
  color: "#fecaca",
  padding: "12px 16px",
  borderRadius: 16,
  marginBottom: 20,
};

const infoBoxStyle = {
  padding: "18px",
  borderRadius: 20,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(148,163,184,0.16)",
};

const sessionListSectionStyle = {
  marginTop: 36,
  padding: 28,
  background: "rgba(15,23,42,0.92)",
  borderRadius: 24,
  border: "1px solid rgba(148,163,184,0.12)",
  boxShadow: "0 20px 80px rgba(0,0,0,0.12)",
};

const sectionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  alignItems: "center",
  marginBottom: 18,
};

const sessionSectionTitleStyle = {
  fontSize: 20,
  margin: 0,
};

const sessionSectionSubtitleStyle = {
  color: "#94a3b8",
  margin: 0,
  lineHeight: 1.6,
};

const sessionStatusStyle = {
  color: "#cbd5e1",
  padding: "18px",
  borderRadius: 18,
  background: "rgba(255,255,255,0.03)",
};

const sessionCardsGridStyle = {
  display: "grid",
  gap: 16,
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
};

const sessionCardStyle = {
  padding: 20,
  borderRadius: 20,
  background: "rgba(30,41,59,0.95)",
  border: "1px solid rgba(148,163,184,0.12)",
};

const sessionCardHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  marginBottom: 12,
};

const sessionLanguageBadgeStyle = {
  padding: "6px 12px",
  borderRadius: 999,
  background: "rgba(59,130,246,0.15)",
  color: "#93c5fd",
  fontSize: 12,
  fontWeight: 700,
};

const sessionStatusBadgeStyle = {
  padding: "6px 12px",
  borderRadius: 999,
  background: "rgba(16,185,129,0.15)",
  color: "#6ee7b7",
  fontSize: 12,
  fontWeight: 700,
};

const sessionCardTitleStyle = {
  fontSize: 16,
  margin: "0 0 8px",
};

const sessionCardTextStyle = {
  color: "#cbd5e1",
  fontSize: 14,
  margin: "4px 0",
};

const sessionSelectButtonStyle = {
  marginTop: 16,
  width: "100%",
  padding: "12px 16px",
  borderRadius: 16,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
};

