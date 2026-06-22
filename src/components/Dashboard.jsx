import React from "react";
import { useNavigate } from "react-router-dom";

const languages = [
  {
    name: "Java",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  },
  {
    name: "Python",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "JavaScript",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  {
    name: "C++",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  },
  {
    name: "React",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "Java",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  },
  {
    name: "Python",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "JavaScript",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  {
    name: "C++",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  },
  {
    name: "React",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">

      {/* Header */}
      <div className="heading text-center pt-16 ">
        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          CodeEditor IDE
        </h1>

        <p className="text-gray-400 mt-4 text-lg">
          Select a language and start coding
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto px-10 py-16 m-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">

          {languages.map((lang) => (
            <div
              key={lang.name}
              onClick={() => navigate(`/editor/${lang.name}`)}
              className="
                group
                bg-slate-800/70
                backdrop-blur-md
                border border-slate-700
                rounded-2xl
                p-6
                cursor-pointer
                transition-all
                duration-500
                hover:-translate-y-3
                hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]
                hover:border-blue-400
              "
            >
              {/* Logo */}
              <div className="flex justify-center">
                <img
                  src={lang.logo}
                  alt={lang.name}
                  className="
                    w-24 h-24
                    transition-all
                    duration-500
                    group-hover:scale-50
                    group-hover:rotate-6
                  "
                />
              </div>

              {/* Name */}
              <h2
                className="
                  text-center
                  text-xl
                  font-bold
                  mt-6
                  transition-all
                  duration-300
                  group-hover:text-blue-400
                "
              >
                {lang.name}
              </h2>

              {/* Button */}
              <button
                className="
                  mt-5
                  w-full
                  bg-blue-600
                  py-2
                  rounded-lg
                  opacity-0
                  group-hover:opacity-100
                  transition-all
                  duration-300
                "
              >
                Open IDE
              </button>
            </div>
          ))}

        </div>
      </div>

      {/* Bottom Stats */}
      <div className="bottom-div flex justify-center gap-10 pt-12 text-gray-400">

        <div className="text-center">
          <h3 className="text-3xl font-bold text-blue-400">
            5+
          </h3>
          <p>Languages</p>
        </div>

        <div className="text-center">
          <h3 className="text-3xl font-bold text-green-400">
            Real-Time
          </h3>
          <p>Execution</p>
        </div>

        <div className="text-center">
          <h3 className="text-3xl font-bold text-purple-400">
            Cloud IDE
          </h3>
          <p>Environment</p>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;