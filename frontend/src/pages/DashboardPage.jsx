import React from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";
import DashboardContent from "../components/dashboard/DashboardContent";
import Footer from "../components/dashboard/Footer";

const DashboardPage = () => {
  return (
    <div className="bg-gray-900 min-h-screen flex">
      <div className="bg-gray-800  min-h-screen p-6 ">
      <Sidebar />
      </div>
      <div className="bg-gray-800 flex-1 flex flex-col min-h-screen p-6 space-y-5">
        <Navbar />
        <DashboardContent />
        <Footer />
      </div>
    </div>
  );
};

export default DashboardPage;
