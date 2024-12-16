import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import Navbar from "./Navbar";
import "../../App.css";

const LayoutAuth = ({ children }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div
      className="flex flex-col h-screen bg-primary-50 p-10"
      style={{
        backgroundImage: 'url("/main_bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="flex justify-between justify-items-center p-4 w-full h-full"
        style={{
          background: isDarkMode
            ? "rgba(103, 94, 94, 0.46)"
            : "rgba(255, 255, 255, 0.36)",
          borderRadius: "16px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(9px)",
          WebkitBackdropFilter: "blur(9px)",
          border: isDarkMode
            ? "3px solid rgba(103, 94, 94, 1)"
            : "3px solid rgba(255, 255, 255, 1)",
        }}
      >
        <div className="w-full ml-5">
          <header className="w-12/12">
            <Navbar />
          </header>

          <main
            className={`w-12/12 w-12/12 relative overflow-y-auto rounded-lg p-6`}
            style={{
              width: "96%",
              height: "85%",
              overflow: "auto",
              borderRadius: "16px",
              scrollbarWidth: "thin",
              scrollbarColor: isDarkMode
                ? "bg-gradient-dark"
                : "bg-gradient-dark",
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default LayoutAuth;
