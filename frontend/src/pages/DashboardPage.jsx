import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import DashboardContent from "../components/dashboard/DashboardContent";
import Layout from "../components/layout/Layout.jsx";


const DashboardPage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  

  return (

    <Layout>
      <DashboardContent />
    </Layout>
  );
};

export default DashboardPage;
