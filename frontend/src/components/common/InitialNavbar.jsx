import React from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const InitialNavbar = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-lg z-50 dark:bg-gray-800">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center text-2xl font-bold text-primary-dark">
          <Link to="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="AppsDo"
              className="h-8 mr-2"
            />
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {isLandingPage && (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-100 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default InitialNavbar;
