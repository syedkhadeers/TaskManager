import React from "react";
import { FaUsers, FaUserFriends, FaBuilding, FaWarehouse } from "react-icons/fa";

const DashboardContent = () => {
  const cardData = [
    { title: "Customers", icon: <FaUsers />, color: "bg-blue-500" },
    { title: "Suppliers", icon: <FaUserFriends />, color: "bg-green-500" },
    { title: "Rooms", icon: <FaBuilding />, color: "bg-red-500" },
    { title: "Inventory", icon: <FaWarehouse />, color: "bg-yellow-500" },
    { title: "Sales", icon: <FaUsers />, color: "bg-purple-500" },
    { title: "Reports", icon: <FaUserFriends />, color: "bg-pink-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cardData.map((card, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg shadow-md ${card.color} text-white transition-colors duration-300 flex items-center`}
        >
          <div className="mr-4 text-2xl">{card.icon}</div>
          <div>
            <h2 className="text-lg font-semibold">{card.title}</h2>
            <p className="text-sm">Some content goes here.</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardContent;