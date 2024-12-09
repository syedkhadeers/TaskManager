import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import UsersContent from "../components/users/UsersContent";
import Footer from "../components/layout/Footer";
import "primereact/resources/themes/saga-blue/theme.css"; // Choose a theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const UsersPage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <div
      className={`
        flex flex-col min-h-screen
        ${isDarkMode ? "dark" : ""} 
        bg-background-light dark:bg-background-dark 
        text-text-light dark:text-text-dark
        transition-colors duration-300
      `}
    >
      <Sidebar />

      <div className="flex flex-col flex-1 md:ml-64 transition-all duration-300 ease-in-out">
        <Navbar />

        <main className="flex-grow p-4 md:p-6 lg:p-8 mt-20">
          <UsersContent />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default UsersPage;
