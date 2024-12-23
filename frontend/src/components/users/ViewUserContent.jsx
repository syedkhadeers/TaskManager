// import React, { useState, useEffect, useContext } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ThemeContext } from "../../context/ThemeContext";
// import {
//   ArrowLeftIcon,
//   Search,
//   Eye,
//   Edit2,
//   Trash2,
//   BarChart2,
//   Users,
//   DollarSign,
//   Home,
// } from "lucide-react";
// import Avatar from "react-avatar";
// import { motion } from "framer-motion";
// import { getOtherUser, deleteUser } from "../../services/userServices";
// import EditUsersContent from "./EditUsersContent";
// import DeleteModal from "../common/modal/DeleteModal";
// import { toast } from "react-toastify";

// const ViewUserContent = () => {
//   const { isDarkMode } = useContext(ThemeContext);
//   const [activeTab, setActiveTab] = useState("bookings");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [stats] = useState({
//     totalBookings: 25,
//     totalRevenue: 5000,
//     totalRooms: 10,
//     totalGuests: 45,
//   });

//   const fetchUser = async () => {
//     try {
//       const userData = await getOtherUser(id);
//       setUser(userData);
//     } catch (error) {
//       toast.error("Failed to fetch user data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, [id]);

//   const handleDelete = async () => {
//     try {
//       await deleteUser(id);
//       toast.success("User deleted successfully");
//       navigate("/users");
//     } catch (error) {
//       toast.error("Failed to delete user");
//     }
//   };

//   const statCards = [
//     {
//       title: "Total Bookings",
//       value: stats.totalBookings,
//       icon: <BarChart2 className="h-6 w-6" />,
//       color: "from-blue-500 to-blue-600",
//     },
//     {
//       title: "Total Revenue",
//       value: `$${stats.totalRevenue}`,
//       icon: <DollarSign className="h-6 w-6" />,
//       color: "from-green-500 to-green-600",
//     },
//     {
//       title: "Total Rooms",
//       value: stats.totalRooms,
//       icon: <Home className="h-6 w-6" />,
//       color: "from-purple-500 to-purple-600",
//     },
//     {
//       title: "Total Guests",
//       value: stats.totalGuests,
//       icon: <Users className="h-6 w-6" />,
//       color: "from-orange-500 to-orange-600",
//     },
//   ];

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
//   ];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`container mx-auto p-4 space-y-6 ${isDarkMode ? "dark" : ""}`}
//     >
//       <button
//         onClick={() => navigate("/users")}
//         className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors
//           dark:text-gray-200 dark:hover:bg-gray-300
//           text-gray-700 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:text-gray-700"
//       >
//         <ArrowLeftIcon className="mr-2 h-4 w-4" />
//         Back to Users
//       </button>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         {statCards.map((stat, index) => (
//           <StatCard key={index} {...stat} isDarkMode={isDarkMode} />
//         ))}
//       </div>

//       <div
//         className={`rounded-xl shadow-lg overflow-hidden 
//         ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
//       >
//         <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
//           {/* Profile section */}
//           <div className="relative flex flex-col md:flex-row items-center gap-6">
//             <Avatar
//               name={user?.name}
//               src={user?.photo?.url}
//               size="120"
//               round
//               className="border-4 border-white/30"
//             />
//             <div className="text-center md:text-left text-white">
//               <h1 className="text-2xl font-bold mb-1">{user?.name}</h1>
//               <p className="text-blue-100">{user?.email}</p>
//               <div className="flex gap-2 mt-2">
//                 <span className="px-3 py-1 rounded-full text-xs bg-white/20">
//                   {user?.role}
//                 </span>
//                 <span className="px-3 py-1 rounded-full text-xs bg-white/20">
//                   {user?.isVerified ? "✓ Verified" : "Pending Verification"}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Action buttons */}
//           <div className="absolute top-4 right-4 flex gap-2">
//             <button
//               onClick={() => setShowEditModal(true)}
//               className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
//             >
//               <Edit2 size={16} />
//               Edit
//             </button>
//             <button
//               onClick={() => setShowDeleteModal(true)}
//               className="bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
//             >
//               <Trash2 size={16} />
//               Delete
//             </button>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div
//           className={`border-b ${
//             isDarkMode ? "border-gray-700" : "border-gray-200"
//           }`}
//         >
//           <div className="flex">
//             {["Bookings", "Logs"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab.toLowerCase())}
//                 className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors
//                   ${
//                     activeTab === tab.toLowerCase()
//                       ? `border-blue-500 text-blue-600 dark:text-blue-400`
//                       : `border-transparent 
//                       ${
//                         isDarkMode
//                           ? "text-gray-400 hover:text-gray-300 hover:border-gray-600"
//                           : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                       }`
//                   }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Content area */}
//         <div className="p-6">
//           {/* Search bar */}
//           <div className="mb-6 relative max-w-md">
//             <Search
//               className={`absolute left-3 top-1/2 transform -translate-y-1/2 
//               ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
//             />
//             <input
//               type="text"
//               placeholder="Search..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className={`w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
//                 ${
//                   isDarkMode
//                     ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
//                     : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
//                 }`}
//             />
//           </div>

//           {/* Bookings table */}
//           {activeTab === "bookings" && (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
//                     {/* Table headers */}
//                     <th
//                       className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
//                       ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}
//                     >
//                       Room
//                     </th>
//                     <th
//                       className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
//                       ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}
//                     >
//                       Check In
//                     </th>
//                     <th
//                       className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
//                       ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}
//                     >
//                       Check Out
//                     </th>
//                     <th
//                       className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
//                       ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}
//                     >
//                       Status
//                     </th>
//                     <th
//                       className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
//                       ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}
//                     >
//                       Amount
//                     </th>
//                     <th
//                       className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
//                       ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}
//                     >
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody
//                   className={`divide-y ${
//                     isDarkMode ? "divide-gray-700" : "divide-gray-200"
//                   }`}
//                 >
//                   {bookings.map((booking) => (
//                     <tr
//                       key={booking.id}
//                       className={isDarkMode ? "bg-gray-800" : "bg-white"}
//                     >
//                       <td
//                         className={`px-6 py-4 whitespace-nowrap
//                         ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
//                       >
//                         {booking.roomNumber}
//                       </td>
//                       <td
//                         className={`px-6 py-4 whitespace-nowrap
//                         ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
//                       >
//                         {booking.checkIn}
//                       </td>
//                       <td
//                         className={`px-6 py-4 whitespace-nowrap
//                         ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
//                       >
//                         {booking.checkOut}
//                       </td>
//                       <td
//                         className={`px-6 py-4 whitespace-nowrap
//                         ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
//                       >
//                         <span
//                           className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                             booking.status === "Confirmed"
//                               ? "bg-green-100 text-green-800"
//                               : "bg-yellow-100 text-yellow-800"
//                           }`}
//                         >
//                           {booking.status}
//                         </span>
//                       </td>
//                       <td
//                         className={`px-6 py-4 whitespace-nowrap
//                         ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
//                       >
//                         ${booking.amount}
//                       </td>
//                       <td
//                         className={`px-6 py-4 whitespace-nowrap
//                         ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
//                       >
//                         <button className="text-blue-600 hover:text-blue-900">
//                           <Eye className="h-5 w-5" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* Logs section */}
//           {activeTab === "logs" && (
//             <div className="space-y-4">
//               {logs.map((log) => (
//                 <div
//                   key={log.id}
//                   className={`flex items-center justify-between p-4 rounded-lg transition-colors
//                     ${
//                       isDarkMode
//                         ? "bg-gray-700 hover:bg-gray-600"
//                         : "bg-gray-50 hover:bg-gray-100"
//                     }`}
//                 >
//                   <div>
//                     <h4 className={isDarkMode ? "text-white" : "text-gray-900"}>
//                       {log.action}
//                     </h4>
//                     <p
//                       className={isDarkMode ? "text-gray-300" : "text-gray-600"}
//                     >
//                       {log.details}
//                     </p>
//                     <span
//                       className={isDarkMode ? "text-gray-400" : "text-gray-500"}
//                     >
//                       {log.timestamp}
//                     </span>
//                   </div>
//                   {/* ... log badges ... */}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modals */}
//       {showEditModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
//           <div
//             className={`h-full w-full max-w-md overflow-y-auto
//             ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
//           >
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

//       {showDeleteModal && (
//         <DeleteModal
//           onCancel={() => setShowDeleteModal(false)}
//           onConfirm={handleDelete}
//           isDarkMode={isDarkMode}
//         />
//       )}
//     </div>
//   );
// };

// const StatCard = ({ title, value, icon, color, isDarkMode }) => (
//   <motion.div
//     initial={{ y: 20, opacity: 0 }}
//     animate={{ y: 0, opacity: 1 }}
//     className={`bg-gradient-to-br ${color} rounded-xl p-6 text-white
//       ${isDarkMode ? "shadow-lg shadow-gray-900/50" : "shadow-md"}`}
//   >
//     <div className="flex justify-between items-center">
//       <div>
//         <p className="text-sm opacity-80">{title}</p>
//         <h3 className="text-2xl font-bold mt-1">{value}</h3>
//       </div>
//       <div className="bg-white/20 p-3 rounded-lg">{icon}</div>
//     </div>
//   </motion.div>
// );

// export default ViewUserContent;

import React, { useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import {
  ArrowLeftIcon,
  Search,
  Eye,
  Edit2,
  Trash2,
  BarChart2,
  Users,
  DollarSign,
  Home,
  X,
} from "lucide-react";
import Avatar from "react-avatar";
import { motion } from "framer-motion";
import EditUsersContent from "./EditUsersContent";
import DeleteModal from "../common/modal/DeleteModal";
import { toast } from "react-toastify";
import { deleteUser } from "../../services/userServices";

const ViewUserContent = ({ user, onClose }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("bookings");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [stats] = useState({
    totalBookings: 25,
    totalRevenue: 5000,
    totalRooms: 10,
    totalGuests: 45,
  });

  const handleDelete = async () => {
    try {
      await deleteUser(user._id);
      toast.success("User deleted successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const statCards = [
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

  return (
    <div
      className={`container mx-auto p-4 space-y-6 ${isDarkMode ? "dark" : ""}`}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          View User
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} isDarkMode={isDarkMode} />
        ))}
      </div>

      <div
        className={`rounded-xl shadow-lg overflow-hidden ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <Avatar
              name={user?.name}
              src={user?.photo?.url}
              size="120"
              round
              className="border-4 border-white/30"
            />
            <div className="text-center md:text-left text-white">
              <h1 className="text-2xl font-bold mb-1">{user?.name}</h1>
              <p className="text-blue-100">{user?.email}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 rounded-full text-xs bg-white/20">
                  {user?.role}
                </span>
                <span className="px-3 py-1 rounded-full text-xs bg-white/20">
                  {user?.isVerified ? "✓ Verified" : "Pending Verification"}
                </span>
              </div>
            </div>
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Edit2 size={16} />
              Edit
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>

        <div
          className={`border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex">
            {["Bookings", "Logs"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors
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
          <div className="mb-6 relative max-w-md">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 
              ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                }`}
            />
          </div>

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

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
          <div
            className={`h-full w-full max-w-md overflow-y-auto ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <EditUsersContent
              user={user}
              onClose={() => setShowEditModal(false)}
              onUserUpdated={() => {
                setShowEditModal(false);
                // Implement a way to refresh user data here
              }}
            />
          </div>
        </div>
      )}

      {showDeleteModal && (
        <DeleteModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          isDarkMode={isDarkMode}
        />
      )}
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

export default ViewUserContent;

