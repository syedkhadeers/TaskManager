import React, { useContext } from "react";
import Layout from "../../components/layout/Layout";
import { ThemeContext } from "../../context/ThemeContext";
import RoomsContent from "../../components/pageComponents/room/rooms/RoomsContent";
const RoomPage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <Layout>
      <RoomsContent />
    </Layout>
  );
};

export default RoomPage;
