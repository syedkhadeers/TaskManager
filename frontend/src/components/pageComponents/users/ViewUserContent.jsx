import React, { useState, useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import {
  Search,
  Eye,
  BarChart2,
  Users,
  DollarSign,
  Home,
  X,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  User,
  KeyIcon,
} from "lucide-react";
import Avatar from "react-avatar";
import { motion } from "framer-motion";
import { PencilIcon, TrashIcon } from "lucide-react";
import ColorStatCard from "../../reusables/cards/ColorStatsCard";
import ChangeUserPasswordModal from "../../reusables/modal/ChangeUserPasswordModal";

const ViewUserContent = ({ user, onClose, onEdit, onDelete, onRefresh }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("profile");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [stats] = useState({
    totalBookings: 25,
    totalRevenue: 5000,
    totalRooms: 10,
    totalGuests: 45,
  });

  const colorStatCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: <BarChart2 className="h-6 w-6" />,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue}`,
      icon: <DollarSign className="h-6 w-6" />,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Total Rooms",
      value: stats.totalRooms,
      icon: <Home className="h-6 w-6" />,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Total Guests",
      value: stats.totalGuests,
      icon: <Users className="h-6 w-6" />,
      color: "from-orange-500 to-orange-600",
    },
  ];

  const userDetails = {
    personal: [
      { label: "Title", value: user?.title, icon: User },
      { label: "First Name", value: user?.firstName, icon: User },
      { label: "Last Name", value: user?.lastName, icon: User },
      { label: "Gender", value: user?.gender, icon: User },
      {
        label: "Date of Birth",
        value: new Date(user?.dateOfBirth).toLocaleDateString(),
        icon: Calendar,
      },
      { label: "Username", value: user?.userName, icon: User },
    ],
    contact: [
      { label: "Email", value: user?.email, icon: Mail },
      { label: "Mobile", value: user?.mobile, icon: Phone },
      { label: "Alternate Mobile", value: user?.alternateMobile, icon: Phone },
    ],
    work: [
      { label: "Department", value: user?.department, icon: Briefcase },
      { label: "Branch", value: user?.branch, icon: Briefcase },
      { label: "Role", value: user?.role, icon: Briefcase },
    ],
    address: [
      { label: "Address", value: user?.address, icon: MapPin },
      { label: "City", value: user?.city, icon: MapPin },
      { label: "Pin Code", value: user?.pinCode, icon: MapPin },
      { label: "State", value: user?.state, icon: MapPin },
      { label: "Country", value: user?.country, icon: MapPin },
    ],
  };

  const bookings = [
    {
      id: 1,
      roomNumber: "101",
      checkIn: "2024-02-15",
      checkOut: "2024-02-20",
      status: "Confirmed",
      amount: 500,
    },
    {
      id: 2,
      roomNumber: "205",
      checkIn: "2024-03-01",
      checkOut: "2024-03-05",
      status: "Pending",
      amount: 750,
    },
  ];

  const logs = [
    {
      id: 1,
      action: "Profile Updated",
      details: "Changed profile picture and contact information",
      timestamp: "2024-01-15 10:30 AM",
      type: "update",
    },
    {
      id: 2,
      action: "Room Booked",
      details: "Booked Room 101 for 5 nights",
      timestamp: "2024-01-14 03:45 PM",
      type: "booking",
    },
  ];

  const renderDetailsSection = (title, details) => (
    <div
      className={`p-6 rounded-xl shadow-lg ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h3
        className={`text-lg font-semibold mb-4 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {details.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <item.icon
                className={`h-5 w-5 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              />
            </div>
            <div>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {item.label}
              </p>
              <p
                className={`font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {item.value || "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className={`container mx-auto p-4 space-y-6 ${isDarkMode ? "dark" : ""}`}
    >
      {/* Profile Header */}
      <div
        className={`rounded-xl shadow-lg overflow-hidden ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <Avatar
              name={`${user?.fullName}`}
              src={user?.photo?.url}
              size="120"
              className="rounded-xl border-4 border-white/20 backdrop-blur-sm shadow-xl hover:scale-105 transition-all duration-300"
            />
            <div className="text-center md:text-left text-white flex-grow">
              <h1 className="text-2xl font-bold mb-1">{user?.fullName}</h1>
              <p className="text-blue-100">{user?.email}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 rounded-full text-xs bg-white/20">
                  {user?.role}
                </span>
                <span className="px-3 py-1 rounded-full text-xs bg-white/20">
                  {user?.isVerified ? "✓ Verified" : "Pending Verification"}
                </span>
              </div>
              <p className="mt-2 text-sm text-blue-100">{user?.bio}</p>
            </div>

            {/* Add action buttons */}
            <div className="absolute top-0 right-0 flex items-center gap-3">
              <button
                onClick={() => onEdit(user)}
                className="group relative p-2.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 backdrop-blur-sm border border-blue-500/10 hover:border-blue-500/20 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <PencilIcon className="h-5 w-5 text-blue-500/90 group-hover:text-blue-500 transition-colors" />
                <span className="absolute -bottom-8 right-0 min-w-max px-2 py-1 text-xs font-medium text-white bg-gray-900/90 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Edit Profile
                </span>
              </button>

              <button
                onClick={() => setShowPasswordModal(true)}
                className="group relative p-2.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 backdrop-blur-sm border border-purple-500/10 hover:border-purple-500/20 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                <KeyIcon className="h-5 w-5 text-purple-500/90 group-hover:text-purple-500 transition-colors" />
                <span className="absolute -bottom-8 right-0 min-w-max px-2 py-1 text-xs font-medium text-white bg-gray-900/90 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Change Password
                </span>
              </button>

              <button
                onClick={() => onDelete(user)}
                className="group relative p-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 backdrop-blur-sm border border-rose-500/10 hover:border-rose-500/20 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              >
                <TrashIcon className="h-5 w-5 text-rose-500/90 group-hover:text-rose-500 transition-colors" />
                <span className="absolute -bottom-8 right-0 min-w-max px-2 py-1 text-xs font-medium text-white bg-gray-900/90 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Delete User
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {colorStatCards.map((stat, index) => (
          <ColorStatCard key={index} {...stat} isDarkMode={isDarkMode} />
        ))}
      </div>

      {/* Main Content */}
      <div
        className={`rounded-xl shadow-lg overflow-hidden ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Tabs */}
        <div
          className={`border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="grid grid-cols-3 w-full">
            {["Profile", "Bookings", "Logs"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`py-3 text-sm font-medium border-b-2 transition-colors w-full
          ${
            activeTab === tab.toLowerCase()
              ? `border-blue-500 text-blue-600 dark:text-blue-400`
              : `border-transparent 
            ${
              isDarkMode
                ? "text-gray-400 hover:text-gray-300 hover:border-gray-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`
          }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              {renderDetailsSection(
                "Personal Information",
                userDetails.personal
              )}
              {renderDetailsSection("Contact Information", userDetails.contact)}
              {renderDetailsSection("Work Information", userDetails.work)}
              {renderDetailsSection("Address Information", userDetails.address)}
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                      ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}
                    >
                      Room
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                      ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}
                    >
                      Check In
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                      ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}
                    >
                      Check Out
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                      ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}
                    >
                      Status
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                      ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}
                    >
                      Amount
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                      ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    isDarkMode ? "divide-gray-700" : "divide-gray-200"
                  }`}
                >
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className={isDarkMode ? "bg-gray-800" : "bg-white"}
                    >
                      <td
                        className={`px-6 py-4 whitespace-nowrap ${
                          isDarkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        {booking.roomNumber}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap ${
                          isDarkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        {booking.checkIn}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap ${
                          isDarkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        {booking.checkOut}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap ${
                          isDarkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === "Confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap ${
                          isDarkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        ${booking.amount}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap ${
                          isDarkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "logs" && (
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors
                    ${
                      isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                >
                  <div>
                    <h4 className={isDarkMode ? "text-white" : "text-gray-900"}>
                      {log.action}
                    </h4>
                    <p
                      className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                    >
                      {log.details}
                    </p>
                    <span
                      className={isDarkMode ? "text-gray-400" : "text-gray-500"}
                    >
                      {log.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showPasswordModal && (
        <ChangeUserPasswordModal
          userId={user._id}
          onClose={() => {
            setShowPasswordModal(false);
            if (onRefresh) {
              onRefresh();
            }
          }}
        />
      )}
    </div>
  );
};


export default ViewUserContent;
