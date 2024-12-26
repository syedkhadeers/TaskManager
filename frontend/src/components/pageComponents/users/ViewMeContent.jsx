// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { ArrowLeftIcon, Search, Eye, Edit2 } from "lucide-react";
// import Avatar from "react-avatar";
// import EditUsersContent from "./EditUsersContent";
// import { toast } from "react-toastify";
// import { getCurrentUser } from "../../../services/auth/authServices";

// const ViewMeContent = () => {
//   const [activeTab, setActiveTab] = useState("bookings");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const navigate = useNavigate();

//   const [stats, setStats] = useState({
//     totalBookings: 0,
//     totalRevenue: 0,
//     totalRooms: 0,
//     totalGuests: 0,
//   });

//   const fetchUser = async () => {
//     try {
//       const userData = await getCurrentUser();
//       setUser(userData);
//       // Mock statistics - replace with actual API calls
//       setStats({
//         totalBookings: 25,
//         totalRevenue: 5000,
//         totalRooms: 10,
//         totalGuests: 45,
//       });
//     } catch (error) {
//       console.error("Error fetching user:", error);
//       toast.error("Failed to fetch user data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   const handleEdit = () => {
//     setShowEditModal(true);
//   };

//   // Use the same bookings and logs data from ViewUserContent
//   const bookings = [
//     {
//       id: 1,
//       roomNumber: "101",
//       checkIn: "2024-02-15",
//       checkOut: "2024-02-20",
//       status: "Confirmed",
//       amount: 500,
//     },
//     {
//       id: 2,
//       roomNumber: "205",
//       checkIn: "2024-03-01",
//       checkOut: "2024-03-05",
//       status: "Pending",
//       amount: 750,
//     },
//   ];

//   const logs = [
//     {
//       id: 1,
//       action: "Profile Updated",
//       details: "Changed profile picture and contact information",
//       timestamp: "2024-01-15 10:30 AM",
//       type: "update",
//     },
//     {
//       id: 2,
//       action: "Room Booked",
//       details: "Booked Room 101 for 5 nights",
//       timestamp: "2024-01-14 03:45 PM",
//       type: "booking",
//     },
//     {
//       id: 3,
//       action: "Payment Processed",
//       details: "Processed payment of $500",
//       timestamp: "2024-01-13 11:20 AM",
//       type: "payment",
//     },
//     {
//       id: 4,
//       action: "Check-in Completed",
//       details: "Checked in to Room 101",
//       timestamp: "2024-01-12 02:15 PM",
//       type: "check-in",
//     },
//   ];

//   const SearchBar = () => (
//     <div className="mb-4 relative max-w-md">
//       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//       <input
//         type="text"
//         placeholder="Search..."
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
//       />
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <button
//         onClick={() => navigate(-1)}
//         className="group mb-4 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
//       >
//         <ArrowLeftIcon className="mr-2 h-4 w-4" />
//         <span className="text-sm font-medium">Back</span>
//       </button>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <StatCard
//           title="Total Bookings"
//           value={stats.totalBookings}
//           color="bg-blue-500"
//         />
//         <StatCard
//           title="Total Revenue"
//           value={`$${stats.totalRevenue}`}
//           color="bg-green-500"
//         />
//         <StatCard
//           title="Total Rooms"
//           value={stats.totalRooms}
//           color="bg-purple-500"
//         />
//         <StatCard
//           title="Total Guests"
//           value={stats.totalGuests}
//           color="bg-orange-500"
//         />
//       </div>

//       <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
//         {/* Profile Header */}
//         <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
//           <div className="relative flex flex-col md:flex-row items-center gap-6">
//             <Avatar
//               name={userMe.name}
//               src={userMe.photo?.url}
//               size="120"
//               round
//               className="border-4 border-white/30"
//             />
//             <div className="text-center md:text-left text-white">
//               <h1 className="text-2xl font-bold mb-1">{userMe.name}</h1>
//               <p className="text-blue-100">{userMe.email}</p>
//               <div className="flex gap-2 mt-2">
//                 <span className="px-3 py-1 rounded-full text-xs bg-white/20">
//                   {userMe.role}
//                 </span>
//                 <span className="px-3 py-1 rounded-full text-xs bg-white/20">
//                   {userMe.isVerified ? "✓ Verified" : "Pending Verification"}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Edit Button */}
//           <div className="absolute top-4 right-4">
//             <button
//               onClick={handleEdit}
//               className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2"
//             >
//               <Edit2 size={16} />
//               Edit
//             </button>
//           </div>
//         </div>

//         {/* Rest of the component remains the same as ViewUserContent */}
//         {/* Tabs */}
//         <div className="border-b">
//           <div className="flex">
//             {["Bookings", "Logs"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab.toLowerCase())}
//                 className={`px-4 py-3 text-sm font-medium border-b-2 ${
//                   activeTab === tab.toLowerCase()
//                     ? "border-blue-500 text-blue-600"
//                     : "border-transparent text-gray-500"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Tab Content */}
//         <div className="p-4">
//           <SearchBar />

//           {activeTab === "bookings" && (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-gray-50">
//                     <th className="px-4 py-3 text-left">Room</th>
//                     <th className="px-4 py-3 text-left">Check In</th>
//                     <th className="px-4 py-3 text-left">Check Out</th>
//                     <th className="px-4 py-3 text-left">Status</th>
//                     <th className="px-4 py-3 text-left">Amount</th>
//                     <th className="px-4 py-3 text-left">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bookings
//                     .filter(
//                       (booking) =>
//                         booking.roomNumber
//                           .toLowerCase()
//                           .includes(searchQuery.toLowerCase()) ||
//                         booking.status
//                           .toLowerCase()
//                           .includes(searchQuery.toLowerCase())
//                     )
//                     .map((booking) => (
//                       <tr key={booking.id} className="border-t">
//                         <td className="px-4 py-3">{booking.roomNumber}</td>
//                         <td className="px-4 py-3">{booking.checkIn}</td>
//                         <td className="px-4 py-3">{booking.checkOut}</td>
//                         <td className="px-4 py-3">
//                           <span
//                             className={`px-2 py-1 rounded-full text-xs ${
//                               booking.status === "Confirmed"
//                                 ? "bg-green-100 text-green-800"
//                                 : "bg-yellow-100 text-yellow-800"
//                             }`}
//                           >
//                             {booking.status}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3">${booking.amount}</td>
//                         <td className="px-4 py-3">
//                           <button className="text-blue-600 hover:text-blue-800">
//                             <Eye size={18} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {activeTab === "logs" && (
//             <div className="space-y-4">
//               {logs
//                 .filter(
//                   (log) =>
//                     log.action
//                       .toLowerCase()
//                       .includes(searchQuery.toLowerCase()) ||
//                     log.details
//                       .toLowerCase()
//                       .includes(searchQuery.toLowerCase())
//                 )
//                 .map((log) => (
//                   <div
//                     key={log.id}
//                     className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
//                   >
//                     <div>
//                       <h4 className="font-medium text-gray-900">
//                         {log.action}
//                       </h4>
//                       <p className="text-sm text-gray-600">{log.details}</p>
//                       <span className="text-xs text-gray-500">
//                         {log.timestamp}
//                       </span>
//                     </div>
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-medium ${
//                         {
//                           update: "bg-blue-100 text-blue-800",
//                           booking: "bg-green-100 text-green-800",
//                           payment: "bg-purple-100 text-purple-800",
//                           "check-in": "bg-yellow-100 text-yellow-800",
//                         }[log.type]
//                       }`}
//                     >
//                       {log.type}
//                     </span>
//                   </div>
//                 ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
//           <div className="bg-white h-full w-full max-w-md overflow-y-auto">
//             <EditUsersContent
//               user={user}
//               onClose={() => setShowEditModal(false)}
//               onUserUpdated={() => {
//                 setShowEditModal(false);
//                 fetchUser();
//               }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const StatCard = ({ title, value, color }) => (
//   <div className={`${color} rounded-lg p-4 text-white`}>
//     <h3 className="text-sm font-medium opacity-80">{title}</h3>
//     <p className="text-2xl font-bold mt-1">{value}</p>
//   </div>
// );

// export default ViewMeContent;

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  BarChart2,
  Users,
  DollarSign,
  Home,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  User,
  ArrowLeftIcon,
  PencilIcon,
  KeyIcon,
} from "lucide-react";
import Avatar from "react-avatar";
import { motion } from "framer-motion";
import { ThemeContext } from "../../../context/ThemeContext";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-toastify";

const ViewMeContent = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userMe = user.data;

  const [stats] = useState({
    totalBookings: 25,
    totalRevenue: 5000,
    totalRooms: 10,
    totalGuests: 45,
  });

  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: <BarChart2 className="h-6 w-6" />,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Revenue",
      value: `${stats.totalRevenue}`,
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
      { label: "Title", value: userMe.title, icon: User },
      { label: "First Name", value: userMe.firstName, icon: User },
      { label: "Last Name", value: userMe.lastName, icon: User },
      { label: "Gender", value: userMe.gender, icon: User },
      {
        label: "Date of Birth",
        value: userMe.dateOfBirth
          ? new Date(user.dateOfBirth).toLocaleDateString()
          : "N/A",
        icon: Calendar,
      },
      { label: "Username", value: userMe.userName, icon: User },
    ],
    contact: [
      { label: "Email", value: userMe.email, icon: Mail },
      { label: "Mobile", value: userMe.mobile, icon: Phone },
      { label: "Alternate Mobile", value: userMe.alternateMobile, icon: Phone },
    ],
    work: [
      { label: "Department", value: userMe.department, icon: Briefcase },
      { label: "Branch", value: userMe.branch, icon: Briefcase },
      { label: "Role", value: userMe.role, icon: Briefcase },
    ],
    address: [
      { label: "Address", value: userMe.address, icon: MapPin },
      { label: "City", value: userMe.city, icon: MapPin },
      { label: "Pin Code", value: userMe.pinCode, icon: MapPin },
      { label: "State", value: userMe.state, icon: MapPin },
      { label: "Country", value: userMe.country, icon: MapPin },
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
      <button
        onClick={() => navigate(-1)}
        className="group mb-4 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Profile Header */}
      <div
        className={`rounded-xl shadow-lg overflow-hidden ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <Avatar
              name={`${userMe.fullName}`}
              src={userMe.photo?.url}
              size="120"
              className="rounded-xl border-4 border-white/20 backdrop-blur-sm shadow-xl hover:scale-105 transition-all duration-300"
            />
            <div className="text-center md:text-left text-white flex-grow">
              <h1 className="text-2xl font-bold mb-1">{userMe.fullName}</h1>
              <p className="text-blue-100">{userMe.email}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 rounded-full text-xs bg-white/20">
                  {userMe.role}
                </span>
                <span className="px-3 py-1 rounded-full text-xs bg-white/20">
                  {userMe.isVerified ? "✓ Verified" : "Pending Verification"}
                </span>
              </div>
              <p className="mt-2 text-sm text-blue-100">{userMe.bio}</p>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex items-center gap-3">
              <button className="group relative p-2.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/20">
                <PencilIcon className="h-5 w-5 text-white/90 group-hover:text-white transition-colors" />
                <span className="absolute -bottom-8 right-0 min-w-max px-2 py-1 text-xs font-medium text-white bg-gray-900/80 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Edit Profile
                </span>
              </button>

              <button className="group relative p-2.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/20">
                <KeyIcon className="h-5 w-5 text-white/90 group-hover:text-white transition-colors" />
                <span className="absolute -bottom-8 right-0 min-w-max px-2 py-1 text-xs font-medium text-white bg-gray-900/80 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Change Password
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} isDarkMode={isDarkMode} />
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
                    : `border-transparent ${
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
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
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
    </div>
  );
};

const StatCard = ({ title, value, icon, color, isDarkMode }) => (
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

export default ViewMeContent;
