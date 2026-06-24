import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaRocket,
  FaPlay,
  FaLink,
} from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();

  const [sessionName, setSessionName] = useState("");
  const [sessionLink, setSessionLink] = useState("");
  const [language, setLanguage] = useState("Java");

  const [sessions, setSessions] = useState([]);

  const handleCreateSession = () => {
    if (!sessionName || !sessionLink) {
      alert("Please fill all fields");
      return;
    }

    const newSession = {
      id: Date.now(),
      sessionName,
      sessionLink,
      language,
    };

    setSessions([...sessions, newSession]);

    setSessionName("");
    setSessionLink("");
    setLanguage("Java");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">

      {/* Navbar */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <div className="flex items-center gap-3">
            <FaRocket className="text-cyan-400 text-3xl" />

            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Code Collaboration IDE
            </h1>
          </div>

          <button className="bg-cyan-500 hover:bg-cyan-400 px-5 py-2 rounded-lg font-semibold transition">
            Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex justify-center py-12 px-4">

        <div className="w-full max-w-4xl">

          {/* Create Session Card */}
          <div className="bg-slate-900/90 border border-slate-700 rounded-3xl p-8 shadow-2xl">

            <h2 className="text-3xl font-bold mb-8 text-center">
              Create New Session
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              {/* Session Name */}
              <div>
                <label className="block mb-2 text-slate-400">
                  Session Name
                </label>

                <input
                  type="text"
                  placeholder="Java Interview Round"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  className="
                    w-full
                    bg-slate-800
                    border
                    border-slate-700
                    px-4
                    py-3
                    rounded-xl
                    outline-none
                    focus:border-cyan-400
                  "
                />
              </div>

              {/* Language */}
              <div>
                <label className="block mb-2 text-slate-400">
                  Programming Language
                </label>

                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="
                    w-full
                    bg-slate-800
                    border
                    border-slate-700
                    px-4
                    py-3
                    rounded-xl
                    outline-none
                    focus:border-cyan-400
                  "
                >
                  <option>Java</option>
                  <option>Python</option>
                  <option>JavaScript</option>
                  <option>C++</option>
                  <option>React</option>
                </select>
              </div>

              {/* Session Link */}
              <div className="md:col-span-2">
                <label className="block mb-2 text-slate-400">
                  Session Link
                </label>

                <input
                  type="text"
                  placeholder="https://meet.google.com/..."
                  value={sessionLink}
                  onChange={(e) => setSessionLink(e.target.value)}
                  className="
                    w-full
                    bg-slate-800
                    border
                    border-slate-700
                    px-4
                    py-3
                    rounded-xl
                    outline-none
                    focus:border-cyan-400
                  "
                />
              </div>
            </div>

            <button
              onClick={handleCreateSession}
              className="
                mt-8
                w-full
                bg-cyan-500
                hover:bg-cyan-400
                py-3
                rounded-xl
                font-bold
                text-lg
                transition
              "
            >
              Create Session
            </button>
          </div>

          {/* Active Sessions */}
          <div className="mt-12">

            <h2 className="text-3xl font-bold mb-6 text-center">
              Active Sessions
            </h2>

            {sessions.length === 0 ? (
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-12 text-center">
                <p className="text-slate-500 text-lg">
                  No sessions available
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">

                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="
                      bg-slate-900
                      border
                      border-slate-700
                      rounded-2xl
                      p-6
                      hover:border-cyan-400
                      hover:-translate-y-1
                      transition-all
                    "
                  >
                    <div className="flex justify-between items-center mb-4">

                      <h3 className="text-xl font-bold">
                        {session.sessionName}
                      </h3>

                      <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm">
                        {session.language}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 mb-6">
                      <FaLink />
                      <span className="truncate">
                        {session.sessionLink}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/editor/${session.language}`)
                      }
                      className="
                        w-full
                        bg-green-600
                        hover:bg-green-500
                        py-3
                        rounded-xl
                        font-semibold
                        flex
                        items-center
                        justify-center
                        gap-2
                      "
                    >
                      <FaPlay />
                      Join Session
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;