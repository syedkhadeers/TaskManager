// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 px-8  text-center transition-colors duration-300">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        © {currentYear} Your Company. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
