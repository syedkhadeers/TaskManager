import React, { useContext } from "react";
import Layout from "../../components/layout/Layout";
import { ThemeContext } from "../../context/ThemeContext";
import RoomTypesContent from "../../components/pageComponents/room/roomTypes/RoomTypesContent";

const RoomTypesPage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <Layout>
      <RoomTypesContent />
    </Layout>
  );
};

export default RoomTypesPage;