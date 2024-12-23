import React, { useContext } from "react";
import UsersContent from "../../components/users/UsersContent";
import Layout from "../../components/layout/Layout";
import { ThemeContext } from "../../context/ThemeContext";

const UsersPage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <Layout>
      <UsersContent />
    </Layout>
  );
};

export default UsersPage;
