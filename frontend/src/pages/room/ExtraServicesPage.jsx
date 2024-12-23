import React, { useContext } from "react";
import Layout from "../../components/layout/Layout";
import { ThemeContext } from "../../context/ThemeContext";
import ExtraServicesContent from "../../components/room/extraServices/ExtraServicesContent";

const ExtraServicesPage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <Layout>
      <ExtraServicesContent />
    </Layout>
  );
};

export default ExtraServicesPage;
