import React from "react";
import { motion } from "framer-motion";

const ColorStatCard = ({ title, value, icon, color, isDarkMode }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className={`bg-gradient-to-br ${color} rounded-xl p-6 text-white
      ${isDarkMode ? "shadow-lg shadow-gray-900/50" : "shadow-md"}`}
  >
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm opacity-80">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className="bg-white/20 p-3 rounded-lg">{icon}</div>
    </div>
  </motion.div>
);

export default ColorStatCard;