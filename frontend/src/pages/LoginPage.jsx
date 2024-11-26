// src/pages/LoginPage.js
import React from "react";
import Login from "../components/auth/Login";
import { Link } from "react-router-dom";
import { FaRocket } from "react-icons/fa"; // Import the logo icon
import ThemeToggle from "../components/common/ThemeToggle"; // Import the ThemeToggle
import InitialNavbar from "../components/common/InitialNavbar";

const LoginPage = () => {
  return (
    <div className="w-full min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
      {/* Navbar */}
      <InitialNavbar />
      <div className="flex flex-col items-center">
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;
