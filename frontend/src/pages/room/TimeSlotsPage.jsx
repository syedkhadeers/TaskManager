import React, { useContext } from "react";
import Layout from "../../components/layout/Layout";
import { ThemeContext } from "../../context/ThemeContext";
import TimeSlotsContent from "../../components/room/timeSlots/TimeSlotsContent";

const TimeSlotsPage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <Layout>
      <TimeSlotsContent />
    </Layout>
  );
};

export default TimeSlotsPage;
