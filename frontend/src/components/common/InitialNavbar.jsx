// src/components/common/InitialNavbar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaRocket } from "react-icons/fa"; // Import the logo icon
import ThemeToggle from "./ThemeToggle"; // Import the ThemeToggle

const InitialNavbar = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/"; // Check if the current path is the landing page

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 dark:bg-gray-800">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center text-2xl font-bold text-primary-dark">
          {isLandingPage ? (
            <>
              <FaRocket className="mr-2 text-secondary-dark" />
              TaskMaster
            </>
          ) : (
            <Link
              to="/"
              className="text-2xl font-bold text-primary-dark flex items-center"
            >
              <FaRocket className="mr-2 text-secondary-dark" /> TaskMaster
            </Link>
          )}
        </div>
        {isLandingPage ? (
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link
              to="/login"
              className="px-4 py-2 text-primary-dark border border-primary-dark rounded-md hover:bg-primary-light hover:text-white transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-secondary-light text-white rounded-md hover:bg-secondary-dark transition duration-300"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <ThemeToggle />
        )}
      </div>
    </nav>
  );
};

export default InitialNavbar;
