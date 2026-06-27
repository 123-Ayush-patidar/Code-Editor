import React, { useState } from "react";

const languageInfo = {
  Java: {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    ext: "java",
    monaco: "java",
    version: "Java 21",
  },
  Python: {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    ext: "py",
    monaco: "python",
    version: "Python 3.12",
  },
  JavaScript: {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    ext: "js",
    monaco: "javascript",
    version: "Node 20",
  },
  "C++": {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    ext: "cpp",
    monaco: "cpp",
    version: "C++17",
  },
  React: {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    ext: "jsx",
    monaco: "javascript",
    version: "React 18",
  },
};

const menuConfig = {
  File: [
    { label: "New file", shortcut: "⌘N", icon: "📄" },
    { label: "Open folder", shortcut: "⌘O", icon: "📂" },
    { type: "sep" },
    { label: "Save", shortcut: "⌘S", icon: "💾" },
    { label: "Save all", shortcut: "⌘⇧S", icon: "💾" },
    { type: "sep" },
    { label: "Share workspace", icon: "🔗" },
    { label: "Export project", icon: "📤" },
    { type: "sep" },
    { label: "Close editor", shortcut: "⌘W", icon: "✕" },
  ],
  Edit: [
    { label: "Undo", shortcut: "⌘Z", icon: "↩" },
    { label: "Redo", shortcut: "⌘⇧Z", icon: "↪" },
    { type: "sep" },
    { label: "Cut", shortcut: "⌘X", icon: "✂" },
    { label: "Copy", shortcut: "⌘C", icon: "📋" },
    { label: "Paste", shortcut: "⌘V", icon: "📌" },
    { type: "sep" },
    { label: "Find", shortcut: "⌘F", icon: "🔍" },
    { label: "Replace", shortcut: "⌘H", icon: "🔄" },
    { type: "sep" },
    { label: "Format document", shortcut: "⌘⇧F", icon: "⬡" },
  ],
  Selection: [
    { label: "Select all", shortcut: "⌘A" },
    { label: "Select line", shortcut: "⌘L" },
    { type: "sep" },
    { label: "Add cursor above", shortcut: "⌥⌘↑" },
    { label: "Add cursor below", shortcut: "⌥⌘↓" },
    { label: "Select all occurrences", shortcut: "⌘⇧L" },
    { type: "sep" },
    { label: "Expand selection", shortcut: "⌃⇧→" },
    { label: "Shrink selection", shortcut: "⌃⇧←" },
  ],
  View: [
    { label: "Explorer", shortcut: "⌘⇧E" },
    { label: "Search", shortcut: "⌘⇧F" },
    { label: "Source control", shortcut: "⌃⇧G" },
    { type: "sep" },
    { label: "Terminal", shortcut: "⌘`" },
    { label: "Output panel" },
    { label: "Minimap" },
    { type: "sep" },
    { label: "Zoom in", shortcut: "⌘+" },
    { label: "Zoom out", shortcut: "⌘-" },
  ],
  Go: [
    { label: "Go to file", shortcut: "⌘P" },
    { label: "Go to line", shortcut: "⌃G" },
    { label: "Go to symbol", shortcut: "⌘⇧O" },
    { type: "sep" },
    { label: "Go to definition", shortcut: "F12" },
    { label: "Go to references", shortcut: "⇧F12" },
    { label: "Peek definition", shortcut: "⌥F12" },
    { type: "sep" },
    { label: "Navigate back", shortcut: "⌃-" },
    { label: "Navigate forward", shortcut: "⌃⇧-" },
  ],
  Run: [
    { label: "Run", shortcut: "F5" },
    { label: "Debug", shortcut: "⌘⇧D" },
    { label: "Run without debug", shortcut: "⌃F5" },
    { type: "sep" },
    { label: "Pause" },
    { label: "Stop", shortcut: "⇧F5" },
    { type: "sep" },
    { label: "Step into", shortcut: "F11" },
    { label: "Step over", shortcut: "F10" },
    { label: "Step out", shortcut: "⇧F11" },
    { type: "sep" },
    { label: "Manage configurations" },
  ],
  Terminal: [
    { label: "New terminal", shortcut: "⌘⇧`" },
    { label: "Split terminal" },
    { type: "sep" },
    { label: "Clear terminal", shortcut: "⌘K" },
    { label: "Kill terminal" },
    { type: "sep" },
    { label: "Configure shell" },
  ],
  Help: [
    { label: "Documentation" },
    { label: "Keyboard shortcuts" },
    { label: "Command palette", shortcut: "⌘⇧P" },
    { type: "sep" },
    { label: "AI assistant ✨" },
    { label: "Community forum" },
    { label: "Report an issue" },
    { type: "sep" },
    { label: "About CodeHive" },
  ],
};

const defaultFiles = (ext) => [
  { name: `Main.${ext}`, color: "#58a6ff", active: true, unsaved: true },
  { name: `Program.${ext}`, color: "#3fb950", active: false, unsaved: false },
  { name: `Test.${ext}`, color: "#bc8cff", active: false, unsaved: false },
  { name: `Utils.${ext}`, color: "#e3b341", active: false, unsaved: false },
];

const defaultCode = (language) => `// Welcome to ${language} — CodeHive Workspace
// Start coding below...

public class Main {

    public static void main(String[] args) {
        System.out.println("Hello, CodeHive!");
    }

}`;

export default function Editor({ language = "Java", userName = "Test" }) {
  const current = languageInfo[language] || languageInfo["Java"];
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState(defaultFiles(current.ext));
  const [code, setCode] = useState(defaultCode(language));
  const [terminalOutput, setTerminalOutput] = useState([
    { type: "path", text: `~/workspace/${language}Project` },
    { type: "prompt", text: `javac src/Main.${current.ext}` },
    { type: "output", text: "Compiling..." },
    { type: "success", text: "✓ Build successful in 0.43s" },
  ]);
  const [showTerminal, setShowTerminal] = useState(true);
  const [activeTermTab, setActiveTermTab] = useState("Terminal");
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const initials = userName.split(" ").map((w) => w[0]).join("").toUpperCase();

  const handleMenuClick = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleMenuItemClick = (label) => {
    setActiveMenu(null);
    if (label === "Terminal") setShowTerminal((v) => !v);
    if (label === "Explorer") setSidebarVisible((v) => !v);
    if (label === "Run" || label === "Run without debug") {
      setTerminalOutput((prev) => [
        ...prev,
        { type: "path", text: `~/workspace/${language}Project` },
        { type: "prompt", text: `java Main` },
        { type: "success", text: "Hello, CodeHive!" },
      ]);
    }
  };

  const closeTab = (i, e) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const newTabs = tabs.filter((_, idx) => idx !== i);
    setTabs(newTabs);
    if (activeTab >= newTabs.length) setActiveTab(newTabs.length - 1);
    else if (activeTab > i) setActiveTab(activeTab - 1);
  };

  return (
    <div
      style={{
        background: "#0d1117",
        color: "#e6edf3",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        fontSize: 13,
        overflow: "hidden",
      }}
      onClick={() => setActiveMenu(null)}
    >
      {/* ── TITLE BAR ── */}
      <div
        style={{
          background: "#161b22",
          height: 32,
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          borderBottom: "1px solid #21262d",
          flexShrink: 0,
          gap: 8,
        }}
      >
        <div style={{ flex: 1, textAlign: "center", color: "#8b949e", fontSize: 12 }}>
          CodeHive — {userName}
        </div>
        <div
          style={{
            background: "#21262d",
            border: "1px solid #30363d",
            borderRadius: 4,
            padding: "2px 8px",
            fontSize: 11,
            color: "#58a6ff",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <img src={current.logo} alt="" style={{ width: 14, height: 14 }} />
          {current.version}
        </div>
      </div>

      {/* ── MENU BAR ── */}
      <div
        style={{
          background: "#161b22",
          height: 30,
          display: "flex",
          alignItems: "center",
          padding: "0 8px",
          borderBottom: "1px solid #21262d",
          flexShrink: 0,
          position: "relative",
          zIndex: 200,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {Object.keys(menuConfig).map((menu) => (
          <div key={menu} style={{ position: "relative" }}>
            <div
              onClick={() => handleMenuClick(menu)}
              style={{
                padding: "4px 10px",
                borderRadius: 4,
                cursor: "pointer",
                color: activeMenu === menu ? "#e6edf3" : "#c9d1d9",
                fontSize: 12.5,
                background: activeMenu === menu ? "#21262d" : "transparent",
                userSelect: "none",
              }}
              onMouseEnter={() => activeMenu && setActiveMenu(menu)}
            >
              {menu}
            </div>
            {activeMenu === menu && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  background: "#1c2128",
                  border: "1px solid #30363d",
                  borderRadius: 6,
                  minWidth: 210,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
                  padding: "4px 0",
                }}
              >
                {menuConfig[menu].map((item, i) =>
                  item.type === "sep" ? (
                    <div
                      key={i}
                      style={{ height: 1, background: "#21262d", margin: "4px 8px" }}
                    />
                  ) : (
                    <div
                      key={i}
                      onClick={() => handleMenuItemClick(item.label)}
                      style={{
                        padding: "6px 16px",
                        cursor: "pointer",
                        color: "#c9d1d9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        fontSize: 12.5,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#2d333b")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {item.icon && <span style={{ fontSize: 13, width: 16 }}>{item.icon}</span>}
                        {item.label}
                      </span>
                      {item.shortcut && (
                        <span style={{ color: "#6e7681", fontSize: 11.5 }}>{item.shortcut}</span>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Sync + User */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            style={{
              padding: "3px 10px",
              background: "transparent",
              border: "1px solid #30363d",
              borderRadius: 4,
              color: "#8b949e",
              fontSize: 11.5,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            ↑ Sync
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "#21262d",
              border: "1px solid #30363d",
              borderRadius: 20,
              padding: "3px 10px 3px 5px",
              cursor: "pointer",
              color: "#c9d1d9",
              fontSize: 12,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#58a6ff,#a5f3fc)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 600,
                color: "#0d1117",
              }}
            >
              {initials}
            </div>
            {userName}
          </div>
        </div>
      </div>

      {/* ── SECONDARY TOOLBAR ── */}
      <div
        style={{
          background: "#161b22",
          height: 34,
          display: "flex",
          alignItems: "center",
          padding: "0 10px",
          borderBottom: "1px solid #21262d",
          flexShrink: 0,
          gap: 2,
        }}
      >
        {[
          { icon: "📄", title: "New file" },
          { icon: "📂", title: "Open" },
          { icon: "💾", title: "Save" },
        ].map((b) => (
          <button key={b.title} title={b.title} style={toolBtnStyle}>
            {b.icon}
          </button>
        ))}
        <div style={toolSepStyle} />
        {[
          { icon: "↩", title: "Undo" },
          { icon: "↪", title: "Redo" },
        ].map((b) => (
          <button key={b.title} title={b.title} style={toolBtnStyle}>
            {b.icon}
          </button>
        ))}
        <div style={toolSepStyle} />
        {[
          { icon: "🔍", title: "Find" },
          { icon: "⬡", title: "Format" },
          { icon: "🔀", title: "Git" },
          { icon: "🐛", title: "Debug" },
        ].map((b) => (
          <button key={b.title} title={b.title} style={toolBtnStyle}>
            {b.icon}
          </button>
        ))}

        {/* Lang badge */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: "#0d419d22",
            border: "1px solid #1f6feb",
            borderRadius: 5,
            padding: "4px 10px",
            color: "#58a6ff",
            fontSize: 12,
            marginRight: 6,
          }}
        >
          <img src={current.logo} alt="" style={{ width: 13, height: 13 }} />
          {current.version}
        </div>

        {/* Save */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: "#21262d",
            border: "1px solid #30363d",
            borderRadius: 5,
            padding: "4px 10px",
            color: "#c9d1d9",
            fontSize: 12.5,
            cursor: "pointer",
            marginRight: 6,
          }}
        >
          💾 Save
        </button>

        {/* Run */}
        <button
          onClick={() => handleMenuItemClick("Run")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#238636",
            border: "none",
            borderRadius: 5,
            padding: "4px 14px",
            color: "#fff",
            fontSize: 12.5,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          ▶ Run
        </button>
      </div>

      {/* ── MAIN BODY ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ACTIVITY BAR */}
        <div
          style={{
            width: 44,
            background: "#161b22",
            borderRight: "1px solid #21262d",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "6px 0",
            gap: 2,
            flexShrink: 0,
          }}
        >
          {[
            { icon: "📁", title: "Explorer", active: sidebarVisible, onClick: () => setSidebarVisible((v) => !v) },
            { icon: "🔍", title: "Search" },
            { icon: "🌿", title: "Source control", badge: true },
            { icon: "🐛", title: "Debug" },
            { icon: "🔌", title: "Extensions" },
          ].map((b) => (
            <div
              key={b.title}
              title={b.title}
              onClick={b.onClick}
              style={{
                width: 36,
                height: 36,
                borderRadius: 6,
                cursor: "pointer",
                color: b.active ? "#e6edf3" : "#6e7681",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 17,
                background: b.active ? "#21262d" : "transparent",
                position: "relative",
              }}
            >
              {b.icon}
              {b.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    width: 8,
                    height: 8,
                    background: "#f85149",
                    borderRadius: "50%",
                    border: "1px solid #161b22",
                  }}
                />
              )}
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div
            title="Settings"
            style={{
              width: 36, height: 36, borderRadius: 6, cursor: "pointer",
              color: "#6e7681", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 17,
            }}
          >
            ⚙️
          </div>
        </div>

        {/* SIDEBAR */}
        {sidebarVisible && (
          <div
            style={{
              width: 220,
              background: "#161b22",
              borderRight: "1px solid #21262d",
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "8px 12px 6px",
                fontSize: 10.5,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#8b949e",
                borderBottom: "1px solid #21262d",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              Explorer
              <div style={{ display: "flex", gap: 4 }}>
                {["📄+", "📁+", "↻"].map((icon) => (
                  <span
                    key={icon}
                    style={{ fontSize: 12, color: "#6e7681", cursor: "pointer", padding: 2 }}
                  >
                    {icon}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "4px 0" }}>
              {/* Folder: src */}
              <div
                style={{
                  padding: "4px 10px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                  color: "#c9d1d9",
                  fontSize: 12.5,
                }}
              >
                ▾ 📁 src
              </div>
              {tabs.map((file, i) => (
                <div
                  key={file.name}
                  onClick={() => setActiveTab(i)}
                  style={{
                    padding: "4px 10px 4px 28px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    cursor: "pointer",
                    color: activeTab === i ? "#58a6ff" : "#8b949e",
                    fontSize: 12.5,
                    background: activeTab === i ? "#1f6feb22" : "transparent",
                    borderRadius: 4,
                    margin: "0 4px",
                  }}
                >
                  <span style={{ color: file.color }}>⬡</span>
                  {file.name}
                </div>
              ))}
              {/* Folder: resources */}
              <div
                style={{
                  padding: "4px 10px",
                  marginTop: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                  color: "#c9d1d9",
                  fontSize: 12.5,
                }}
              >
                ▾ 📁 resources
              </div>
              {["config.json", "pom.xml"].map((f) => (
                <div
                  key={f}
                  style={{
                    padding: "4px 10px 4px 28px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    cursor: "pointer",
                    color: "#8b949e",
                    fontSize: 12.5,
                    borderRadius: 4,
                    margin: "0 4px",
                  }}
                >
                  📄 {f}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CENTER PANEL */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* TABS */}
          <div
            style={{
              height: 36,
              background: "#0d1117",
              borderBottom: "1px solid #21262d",
              display: "flex",
              alignItems: "flex-end",
              overflowX: "auto",
              flexShrink: 0,
            }}
          >
            {tabs.map((tab, i) => (
              <div
                key={tab.name}
                onClick={() => setActiveTab(i)}
                style={{
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "0 14px",
                  cursor: "pointer",
                  color: activeTab === i ? "#e6edf3" : "#8b949e",
                  fontSize: 12.5,
                  borderRight: "1px solid #21262d",
                  borderTop: activeTab === i ? "1px solid #1f6feb" : "1px solid transparent",
                  background: activeTab === i ? "#161b22" : "transparent",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                <span style={{ color: tab.color, fontSize: 13 }}>⬡</span>
                {tab.name}
                {tab.unsaved && (
                  <div
                    style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: "#e3b341", flexShrink: 0,
                    }}
                  />
                )}
                <div
                  onClick={(e) => closeTab(i, e)}
                  style={{
                    width: 14, height: 14, borderRadius: 3,
                    display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 11,
                    color: "#6e7681", cursor: "pointer",
                  }}
                >
                  ×
                </div>
              </div>
            ))}
          </div>

          {/* EDITOR */}
          <div
            style={{
              flex: 1,
              background: "#0d1117",
              display: "flex",
              overflow: "hidden",
            }}
          >
            {/* Line numbers */}
            <div
              style={{
                width: 44,
                background: "#0d1117",
                padding: "14px 0",
                textAlign: "right",
                color: "#30363d",
                fontSize: 12,
                fontFamily: "Menlo, monospace",
                lineHeight: 1.6,
                flexShrink: 0,
                userSelect: "none",
              }}
            >
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} style={{ paddingRight: 10 }}>
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Monaco Editor area */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              style={{
                flex: 1,
                background: "#0d1117",
                color: "#e6edf3",
                border: "none",
                outline: "none",
                padding: "14px 16px",
                fontFamily: "Menlo, 'Courier New', monospace",
                fontSize: 13,
                lineHeight: 1.6,
                resize: "none",
                overflow: "auto",
              }}
            />

            {/* Minimap */}
            <div
              style={{
                width: 60,
                background: "#090d12",
                borderLeft: "1px solid #21262d",
                flexShrink: 0,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 10, left: 0, right: 0,
                  height: 80,
                  background: "#ffffff10",
                }}
              />
            </div>
          </div>

          {/* TERMINAL */}
          {showTerminal && (
            <div
              style={{
                height: 160,
                background: "#0a0e14",
                borderTop: "1px solid #21262d",
                display: "flex",
                flexDirection: "column",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 10px",
                  borderBottom: "1px solid #21262d",
                  gap: 6,
                  background: "#161b22",
                }}
              >
                {["Terminal", "Output", "Problems", "Debug console"].map((t) => (
                  <div
                    key={t}
                    onClick={() => setActiveTermTab(t)}
                    style={{
                      padding: "4px 12px",
                      borderRadius: "4px 4px 0 0",
                      cursor: "pointer",
                      fontSize: 12,
                      color: activeTermTab === t ? "#c9d1d9" : "#8b949e",
                      background: activeTermTab === t ? "#0a0e14" : "transparent",
                    }}
                  >
                    {t}
                  </div>
                ))}
                <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                  <button style={toolBtnStyle}>+</button>
                  <button style={toolBtnStyle} onClick={() => setShowTerminal(false)}>✕</button>
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "8px 14px",
                  fontFamily: "Menlo, monospace",
                  fontSize: 12,
                  lineHeight: 1.6,
                  overflowY: "auto",
                  color: "#c9d1d9",
                }}
              >
                {terminalOutput.map((line, i) => (
                  <div key={i}>
                    {line.type === "path" && (
                      <span>
                        <span style={{ color: "#58a6ff" }}>{line.text}</span>{" "}
                        <span style={{ color: "#3fb950" }}>❯</span>
                      </span>
                    )}
                    {line.type === "prompt" && (
                      <span style={{ color: "#c9d1d9" }}> {line.text}</span>
                    )}
                    {line.type === "output" && (
                      <div style={{ color: "#8b949e" }}>{line.text}</div>
                    )}
                    {line.type === "success" && (
                      <div style={{ color: "#3fb950" }}>{line.text}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* OUTPUT PANEL */}
        <div
          style={{
            width: 240,
            background: "#161b22",
            borderLeft: "1px solid #21262d",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              padding: "8px 12px",
              borderBottom: "1px solid #21262d",
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#3fb950",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            Output
            <span style={{ cursor: "pointer", color: "#6e7681" }}>↻</span>
          </div>
          <div
            style={{
              flex: 1,
              padding: "10px 12px",
              fontFamily: "Menlo, monospace",
              fontSize: 12,
              lineHeight: 1.6,
              overflowY: "auto",
            }}
          >
            {terminalOutput.map((line, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 4,
                  color:
                    line.type === "success"
                      ? "#3fb950"
                      : line.type === "path"
                      ? "#58a6ff"
                      : "#8b949e",
                  fontSize: line.type === "path" ? 11 : 12,
                }}
              >
                {line.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATUS BAR ── */}
      <div
        style={{
          height: 24,
          background: "#1f6feb",
          display: "flex",
          alignItems: "center",
          padding: "0 10px",
          flexShrink: 0,
          color: "#fff",
          fontSize: 11.5,
        }}
      >
        {[
          { label: "🌿 main" },
          { label: "✕ 0", color: "#ff7b72" },
          { label: "⚠ 2", color: "#e3b341" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              padding: "0 8px",
              cursor: "pointer",
              height: "100%",
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: item.color || "#fff",
              whiteSpace: "nowrap",
            }}
          >
            {item.label}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        {["Ln 9, Col 42", "UTF-8", "Spaces: 4", current.version].map((s) => (
          <div
            key={s}
            style={{
              padding: "0 8px",
              cursor: "pointer",
              height: "100%",
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap",
            }}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

// Shared micro styles
const toolBtnStyle = {
  width: 26,
  height: 26,
  borderRadius: 4,
  cursor: "pointer",
  color: "#8b949e",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 15,
  border: "none",
  background: "transparent",
};

const toolSepStyle = {
  width: 1,
  height: 16,
  background: "#30363d",
  margin: "0 4px",
};