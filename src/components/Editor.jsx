import React from "react";
import { useParams } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";

import {
  FaFolder,
  FaFileCode,
  FaPlay,
  FaSave,
  FaCog,
  FaUserCircle,
} from "react-icons/fa";

const languageInfo = {
  Java: {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    ext: "java",
    monaco: "java",
  },
  Python: {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    ext: "py",
    monaco: "python",
  },
  JavaScript: {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    ext: "js",
    monaco: "javascript",
  },
  "C++": {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    ext: "cpp",
    monaco: "cpp",
  },
  React: {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    ext: "jsx",
    monaco: "javascript",
  },
};

const Editor = () => {
  const { language } = useParams();
  const current = languageInfo[language];

  return (
    <div className="h-screen bg-[#0B1120] text-white flex flex-col">

      {/* NAVBAR */}
      <div className="h-16 bg-[#111827]/80 backdrop-blur-md border-b border-slate-700 flex items-center justify-between px-6">

        <div className="flex items-center gap-4">
          <img
            src={current?.logo}
            alt=""
            className="w-10 h-10 hover:rotate-12 transition duration-300"
          />

          <div>
            <h2 className="font-bold text-lg">
              {language} Workspace
            </h2>

            <p className="text-xs text-slate-400">
              Online Code Editor
            </p>
          </div>
        </div>

        <div className="flex gap-3">

          <button className="Save flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600 transition">
            <FaSave />
            Save
          </button>

          <button className="Run flex items-center gap-2 bg-green-600 px-4 py-2 rounded-lg hover:bg-green-500 transition">
            <FaPlay />
            Run
          </button>

          <button className="Setting bg-slate-700 p-3 rounded-lg hover:bg-slate-600">
            <FaCog />
          </button>

          <button className="user bg-slate-700 p-3 rounded-full hover:bg-slate-600">
            <FaUserCircle />
          </button>

        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">

        {/* FILE EXPLORER */}
        <div className="w-64 bg-[#111827] border-r border-slate-700">

          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold">
              Explorer
            </h3>
          </div>

          <div className="p-3">

            <div className="flex items-center gap-2 text-yellow-400 mb-3">
              <FaFolder />
              <span>src</span>
            </div>

            <div className="pl-4">

              <div className="flex items-center gap-2 p-2 rounded hover:bg-slate-700 cursor-pointer">
                <FaFileCode className="text-blue-400" />
                Main.{current?.ext}
              </div>

              <div className="flex items-center gap-2 p-2 rounded hover:bg-slate-700 cursor-pointer">
                <FaFileCode className="text-green-400" />
                Program.{current?.ext}
              </div>

              <div className="flex items-center gap-2 p-2 rounded hover:bg-slate-700 cursor-pointer">
                <FaFileCode className="text-purple-400" />
                Test.{current?.ext}
              </div>

            </div>
          </div>
        </div>

        {/* CENTER SECTION */}
        <div className="flex-1 flex flex-col">

          {/* FILE TAB */}
          <div className="h-10 bg-[#111827] border-b border-slate-700 flex items-center px-4">
            <span className="text-sm text-slate-300">
              Main.{current?.ext}
            </span>
          </div>

          {/* MONACO EDITOR */}
          <div className="flex-1">
            <MonacoEditor
              height="100%"
              language={current?.monaco}
              theme="vs-dark"
              defaultValue={`// Welcome to ${language}\n\n`}
              options={{
                fontSize: 16,
                minimap: {
                  enabled: false,
                },
                scrollBeyondLastLine: false,
              }}
            />
          </div>

          {/* TERMINAL */}
          <div className="h-40 bg-black border-t border-slate-700 p-4">

            <h3 className="text-green-400 mb-2">
              Terminal
            </h3>

            <div className="font-mono text-sm text-slate-300">
              $
            </div>

          </div>

        </div>

        {/* OUTPUT PANEL */}
        <div className="w-80 bg-[#111827] border-l border-slate-700">

          <div className="p-4 border-b border-slate-700">
            <h3 className="text-green-400 font-bold">
              Output
            </h3>
          </div>

          <div className="p-4 font-mono text-green-300">
            Program output will appear here...
          </div>

        </div>

      </div>

    </div>
  );
};

export default Editor;