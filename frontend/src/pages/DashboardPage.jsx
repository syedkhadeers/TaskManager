import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Layout from "../components/layout/Layout";
import DashboardContent from "../components/dashboard/DashboardContent";

const DashboardPage = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <DashboardContent />
    </Layout>
  );
};

export default DashboardPage;
