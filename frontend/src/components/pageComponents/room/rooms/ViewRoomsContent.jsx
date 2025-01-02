import React, { useState, useContext } from "react";
import { ThemeContext } from "../../../../context/ThemeContext";
import {
  DollarSign,
  Users,
  Clock,
  Camera,
  Bed,
  FileText,
  Calendar,
  Package,
  CheckCircle,
  XCircle,
  BarChart2,
  Home,
  Eye,
  Edit2,
  Trash2,
  Hash,
  MapPin,
  Wind,
  Cigarette,
  Dog,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ColorStatCard from "../../../reusables/cards/ColorStatsCard";


const ViewRoomsContent = ({ room, onClose, onEdit, onDelete }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("details");

  // Stats for the room
  const stats = {
    roomNumber: room.roomNumber,
    floor: room.floor,
    status: room.status,
    bookingCount: 45, // Example data - replace with actual booking count
  };

  // Example booking history - replace with actual data
  const bookingHistory = [
    {
      id: 1,
      guestName: "John Doe",
      checkIn: "2024-02-15",
      checkOut: "2024-02-18",
      status: "Completed",
      timeSlot: "Day Use",
    },
    {
      id: 2,
      guestName: "Jane Smith",
      checkIn: "2024-02-20",
      checkOut: "2024-02-22",
      status: "Upcoming",
      timeSlot: "Night Stay",
    },
  ];

  const colorStatCards = [
    {
      title: "Room Number",
      value: stats.roomNumber,
      icon: <Hash className="h-6 w-6" />,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Floor",
      value: stats.floor,
      icon: <MapPin className="h-6 w-6" />,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Status",
      value: stats.status,
      icon: <Home className="h-6 w-6" />,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Total Bookings",
      value: stats.bookingCount,
      icon: <BarChart2 className="h-6 w-6" />,
      color: "from-orange-500 to-orange-600",
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      available: "bg-green-500",
      occupied: "bg-red-500",
      maintenance: "bg-yellow-500",
      reserved: "bg-blue-500",
    };
    return colors[status] || "bg-gray-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`min-h-screen ${isDarkMode ? "dark" : ""}`}
    >
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-white space-y-2">
                <h1 className="text-4xl font-bold">Room {room.roomNumber}</h1>
                <p className="text-blue-100 text-lg">{room.description}</p>
                <div className="flex gap-3">
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(
                      room.status
                    )}`}
                  >
                    {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                  </span>
                  <span className="px-4 py-1 bg-blue-500/20 text-blue-100 rounded-full text-sm font-medium">
                    Floor: {room.floor}
                  </span>
                  {room.isActive ? (
                    <span className="px-4 py-1 bg-green-500/20 text-green-100 rounded-full text-sm font-medium">
                      Active
                    </span>
                  ) : (
                    <span className="px-4 py-1 bg-red-500/20 text-red-100 rounded-full text-sm font-medium">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => onEdit(room)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(room)}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-white rounded-lg transition-all duration-200"
                >
                  <Trash2 className="h-5 w-5" />
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

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex">
              {["Details", "Bookings"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors
                    ${
                      activeTab === tab.toLowerCase()
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  {/* Room Type Info */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Bed className="w-5 h-5 mr-2 text-blue-500" />
                      Room Type Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-gray-600 dark:text-gray-300">
                          Type: {room.roomType.name}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          Base Price: ${room.roomType.basePrice}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-600 dark:text-gray-300">
                          Max Occupancy: {room.roomType.maxOccupancy}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          Size: {room.roomType.size} sqft
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Amenities Grid */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Wind className="w-5 h-5 mr-2 text-purple-500" />
                      Amenities & Features
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {room.amenities.map((amenity, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {amenity}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-4">
                      <div className="flex items-center space-x-2">
                        < Cigarette className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Smoking:{" "}
                          {room.smokingAllowed ? "Allowed" : "Not Allowed"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Dog className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Pets: {room.petsAllowed ? "Allowed" : "Not Allowed"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Images Grid */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Camera className="w-5 h-5 mr-2 text-blue-500" />
                      Room Images
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {room.images
                        .sort((a, b) => a.order - b.order)
                        .map((image, index) => (
                          <div
                            key={index}
                            className="group relative aspect-square rounded-xl overflow-hidden"
                          >
                            <img
                              src={image.url}
                              alt={`Room ${index + 1}`}
                              className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button className="p-2 bg-white rounded-full">
                                  <Eye className="h-5 w-5 text-gray-900" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "bookings" && (
                <motion.div
                  key="bookings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-x-auto"
                >
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        {[
                          "Guest",
                          "Check In",
                          "Check Out",
                          "Time Slot",
                          "Status",
                        ].map((header) => (
                          <th
                            key={header}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                      {bookingHistory.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {booking.guestName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {booking.checkIn}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {booking.checkOut}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {booking.timeSlot}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                booking.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Metadata */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                Created: {new Date(room.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                Last Updated: {new Date(room.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Max Occupancy: {room.roomType.maxOccupancy} guests</span>
            </div>
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              <span>Total Images: {room.images.length}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ViewRoomsContent;

