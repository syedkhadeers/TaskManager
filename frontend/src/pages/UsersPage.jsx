import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import UsersContent from "../components/users/UsersContent";
import Layout from "../components/layout/Layout";

const UsersPage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <Layout>
      <UsersContent />
    </Layout>
  );
};

export default UsersPage;
