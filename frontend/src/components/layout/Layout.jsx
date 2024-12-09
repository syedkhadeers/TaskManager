import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "primereact/resources/themes/saga-blue/theme.css"; // Choose a theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const Layout = ({ children }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode ? "dark" : ""
      } bg-background-light dark:bg-background-dark text-light dark:text-dark transition-all duration-300`}
    >
      {/* Navbar at the top */}
      <Navbar />

      {/* Main content area */}
      <div className="flex flex-1 mt-20">
        {/* Sidebar taking 20% of the width */}
        <div className="w-1/5 md:w-1/6 h-full">
          <Sidebar />
        </div>

        {/* Main content (children) taking the remaining 80% */}
        <main className="flex-grow p-6 lg:p-8">{children}</main>
      </div>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default Layout;
