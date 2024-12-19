import React from "react";
import {
  FaUsers,
  FaUserFriends,
  FaBuilding,
  FaWarehouse,
  FaChartLine,
  FaFileAlt,
  FaShoppingCart,
  FaMoneyBillWave,
  FaChartPie,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart, Bar } from "recharts";
import { useAuth } from "../../hooks/useAuth";

const DashboardContent = () => {

  const { user, handleLogout } = useAuth();
const cardData = [
  {
    title: "Customers",
    icon: <FaUsers />,
    color: "from-blue-500 to-blue-700",
    value: "1,234",
    description: "Total registered customers",
  },
  {
    title: "Suppliers",
    icon: <FaUserFriends />,
    color: "from-green-500 to-green-700",
    value: "87",
    description: "Active supplier partnerships",
  },
  {
    title: "Rooms",
    icon: <FaBuilding />,
    color: "from-red-500 to-red-700",
    value: "42",
    description: "Total rooms managed",
  },
  {
    title: "Inventory",
    icon: <FaWarehouse />,
    color: "from-yellow-500 to-yellow-700",
    value: "653",
    description: "Items in stock",
  },
  {
    title: "Sales",
    icon: <FaShoppingCart />,
    color: "from-purple-500 to-purple-700",
    value: "$45,678",
    description: "Total sales this month",
  },
  {
    title: "Revenue",
    icon: <FaMoneyBillWave />,
    color: "from-pink-500 to-pink-700",
    value: "$123,456",
    description: "Total revenue YTD",
  },
  {
    title: "Growth",
    icon: <FaChartLine />,
    color: "from-green-400 to-green-600",
    value: "24%",
    description: "Growth rate this year",
  },
  {
    title: "Expenses",
    icon: <FaFileAlt />,
    color: "from-gray-500 to-gray-700",
    value: "$67,890",
    description: "Total expenses this quarter",
  },
  {
    title: "Profit Margin",
    icon: <FaChartPie />,
    color: "from-indigo-500 to-indigo-700",
    value: "58%",
    description: "Current profit margin",
  },
];

const quickActions = [
  { icon: <FaChartLine />, title: "Analytics" },
  { icon: <FaFileAlt />, title: "Reports" },
  { icon: <FaChartPie />, title: "Insights" },
  { icon: <FaUsers />, title: "Manage Users" },
  { icon: <FaBuilding />, title: "Manage Rooms" },
  { icon: <FaWarehouse />, title: "Stock Overview" },
  { icon: <FaShoppingCart />, title: "New Orders" },
  { icon: <FaMoneyBillWave />, title: "Financial Reports" },
];

const newsFeed = [
  {
    title: "New Sales Report",
    description: "Check out the latest sales report for this quarter.",
    date: "2023-02-15",
  },
  {
    title: "New Supplier Partnership",
    description:
      "We're excited to announce a new partnership with XYZ Suppliers.",
    date: "2023-02-10",
  },
  {
    title: "System Update",
    description: "Our system will be undergoing maintenance on 2023-02-20.",
    date: "2023-02-05",
  },
];

const calendarEvents = [
  {
    title: "Team Meeting",
    date: "2023-02-20",
    time: "10:00 AM",
  },
  {
    title: "Client Meeting",
    date: "2023-02-22",
    time: "2:00 PM",
  },
  {
    title: "Sales Report Deadline",
    date: "2023-02-25",
    time: "5:00 PM",
  },
];

const contactInfo = [
  {
    title: "Email",
    value: "info@example.com",
    icon: <FaEnvelope />,
  },
  {
    title: "Phone",
    value: "+1 (555) 123-4567",
    icon: <FaPhone />,
  },
  {
    title: "Address",
    value: "123 Main St, Anytown, USA",
    icon: <FaMapMarkerAlt />,
  },
];


const lineChartData = [
  { name: "Jan", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Feb", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Mar", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Apr", uv: 2780, pv: 3908, amt: 2000 },
  { name: "May", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Jun", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Jul", uv: 3490, pv: 4300, amt: 2100 },
];

const barChartData = [
  { name: "Jan", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Feb", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Mar", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Apr", uv: 2780, pv: 3908, amt: 2000 },
  { name: "May", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Jun", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Jul", uv: 3490, pv: 4300, amt: 2100 },
];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Welcome Back, {user?.name || "User"}!
      </h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8"
      >
        {cardData.map((card, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className={`bg-gradient-to-br ${card.color} 
              rounded-lg shadow-md overflow-hidden 
              transform transition-all duration-300 
              hover:scale-105 hover:shadow-lg`}
          >
            <div className="p-4 text-white">
              <div className="flex justify-between items-center mb-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <span className="text-2xl">{card.icon}</span>
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-semibold">{card.title}</h3>
                  <p className="text-lg font-bold">{card.value}</p>
                </div>
              </div>
              <p className="text-xs opacity-75">{card.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
            Sales Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="pv"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
            Sales by Month
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pv" fill="#8884d8" />
              <Bar dataKey="uv" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions Section */}
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
        {quickActions.map((action, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="
              rounded-lg p-3 
              flex flex-col items-center 
              shadow-sm 
              hover:shadow-md 
              transition-all 
              bg-white dark:bg-gray-800
              text-gray-700 dark:text-gray-200"
          >
            <span className="text-xl mb-1 text-blue-500">{action.icon}</span>
            <span className="text-sm font-medium text-center">
              {action.title}
            </span>
          </motion.button>
        ))}
      </div>

      {/* News Feed and Calendar Events Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
            News Feed
          </h2>
          <div className="space-y-4">
            {newsFeed.map((news, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="
                  rounded-lg p-3 
                  shadow-sm 
                  hover:shadow-md 
                  transition-all 
                  bg-white dark:bg-gray-800
                  text-gray-700 dark:text-gray-200"
              >
                <h3 className="text-lg font-bold">{news.title}</h3>
                <p className="text-sm">{news.description}</p>
                <p className="text-xs opacity-75 mt-2">{news.date}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
            Calendar Events
          </h2>
          <div className="space-y-4">
            {calendarEvents.map((event, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="
                  rounded-lg p-3 
                  shadow-sm 
                  hover:shadow-md 
                  transition-all 
                  bg-white dark:bg-gray-800
                  text-gray-700 dark:text-gray-200"
              >
                <h3 className="text-lg font-bold">{event.title}</h3>
                <p className="text-sm">
                  {event.date} {event.time}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Info Section */}
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
        Contact Info
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {contactInfo.map((contact, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="
              rounded-lg p-3 
              shadow-sm 
              hover:shadow-md 
              transition-all 
              bg-white dark:bg-gray-800
              text-gray-700 dark:text-gray-200"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl text-blue-500">{contact.icon}</span>
              <div>
                <h3 className="text-lg font-bold">{contact.title}</h3>
                <p className="text-sm">{contact.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardContent;
