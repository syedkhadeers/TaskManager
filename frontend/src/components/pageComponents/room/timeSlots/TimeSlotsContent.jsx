// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   EyeIcon,
//   PencilIcon,
//   TrashIcon,
//   MoreVerticalIcon,
//   Clock,
//   CheckCircle,
//   XCircle,
//   Percent,
// } from "lucide-react";
// import { Menu } from "@headlessui/react";
// import { toast } from "react-toastify";
// import DataTableOne from "../../../reusables/table/DataTableOne";
// import {
//   getAllTimeSlots,
//   deleteTimeSlot,
// } from "../../../../services/rooms/timeSlotServices";
// import AddTimeSlotsContent from "./AddTimeSlotsContent";
// import EditTimeSlotsContent from "./EditTimeSlotsContent";
// import ViewTimeSlotsContent from "./ViewTimeSlotsContent";
// import DeleteModal from "../../../reusables/modal/DeleteModal";

// const TimeSlotsContent = () => {
//   const [data, setData] = useState([]);
//   const [showAddTimeSlotModal, setShowAddTimeSlotModal] = useState(false);
//   const [showEditTimeSlotModal, setShowEditTimeSlotModal] = useState(false);
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [timeSlotIdToDelete, setTimeSlotIdToDelete] = useState(null);
//   const [showViewTimeSlotModal, setShowViewTimeSlotModal] = useState(false);
//   const [selectedViewTimeSlot, setSelectedViewTimeSlot] = useState(null);

//   const fetchData = async () => {
//     try {
//       const response = await getAllTimeSlots();
//       if (Array.isArray(response.timeSlots)) {
//         setData(response.timeSlots);
//       } else {
//         console.error("Expected an array but got:", response);
//         setData([]);
//       }
//     } catch (error) {
//       console.error("Error fetching time slots:", error);
//       setData([]);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const columns = [
//     {
//       accessorKey: "name",
//       header: "Name",
//     },
//     {
//       accessorKey: "checkInTime",
//       header: "Check-in Time",
//     },
//     {
//       accessorKey: "checkOutTime",
//       header: "Check-out Time",
//     },
//     {
//       accessorKey: "sameDay",
//       header: "Same Day",
//       cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
//     },
//     {
//       accessorKey: "priceMultiplier",
//       header: "Price Multiplier",
//     },
//     {
//       accessorKey: "isActive",
//       header: "Status",
//       cell: ({ getValue }) => (
//         <span
//           className={`px-3 py-1 text-xs font-medium rounded-full ${
//             getValue()
//               ? "bg-green-100 text-green-800"
//               : "bg-red-100 text-red-800"
//           }`}
//         >
//           {getValue() ? "Active" : "Inactive"}
//         </span>
//       ),
//     },
//     {
//       accessorKey: "createdAt",
//       header: "Created On",
//       cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
//     },
//   ];

//   const handleRefresh = () => {
//     fetchData();
//   };

//   const confirmDelete = async () => {
//     if (timeSlotIdToDelete) {
//       try {
//         await deleteTimeSlot(timeSlotIdToDelete);
//         toast.success("Time slot deleted successfully");
//         await fetchData();
//         setTimeSlotIdToDelete(null);
//       } catch (error) {
//         console.error("Error deleting time slot:", error);
//         toast.error("Failed to delete time slot");
//       }
//     }
//   };

//   const renderRowActions = (timeSlot) => (
//     <Menu as="div" className="relative inline-block text-left">
//       {({ open }) => (
//         <>
//           <Menu.Button className="inline-flex items-center justify-center w-8 h-8 text-gray-400 dark:text-gray-500 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 focus:outline-none">
//             <MoreVerticalIcon size={18} />
//           </Menu.Button>

//           {open && (
//             <Menu.Items
//               static
//               className="absolute right-0 w-48 mt-2 origin-top-right bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700 border border-gray-100 dark:border-gray-700"
//             >
//               <div className="py-1">
//                 <Menu.Item>
//                   {({ active }) => (
//                     <button
//                       onClick={() => {
//                         setSelectedViewTimeSlot(timeSlot);
//                         setShowViewTimeSlotModal(true);
//                       }}
//                       className={`${
//                         active
//                           ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300"
//                           : "text-gray-700 dark:text-gray-300"
//                       } flex items-center w-full px-4 py-2 text-sm font-medium transition-colors duration-150`}
//                     >
//                       <EyeIcon className="mr-3 h-4 w-4" />
//                       View Time Slot
//                     </button>
//                   )}
//                 </Menu.Item>

//                 <Menu.Item>
//                   {({ active }) => (
//                     <button
//                       onClick={() => {
//                         setSelectedTimeSlot(timeSlot);
//                         setShowEditTimeSlotModal(true);
//                       }}
//                       className={`${
//                         active
//                           ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300"
//                           : "text-gray-700 dark:text-gray-300"
//                       } flex items-center w-full px-4 py-2 text-sm font-medium transition-colors duration-150`}
//                     >
//                       <PencilIcon className="mr-3 h-4 w-4" />
//                       Edit Time Slot
//                     </button>
//                   )}
//                 </Menu.Item>

//                 <Menu.Item>
//                   {({ active }) => (
//                     <button
//                       onClick={() => {
//                         setTimeSlotIdToDelete(timeSlot._id);
//                         setShowDeleteModal(true);
//                       }}
//                       className={`${
//                         active
//                           ? "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/50 dark:to-red-800/50 text-red-700 dark:text-red-300"
//                           : "text-gray-700 dark:text-gray-300"
//                       } flex items-center w-full px-4 py-2 text-sm font-medium transition-colors duration-150`}
//                     >
//                       <TrashIcon className="mr-3 h-4 w-4" />
//                       Delete Time Slot
//                     </button>
//                   )}
//                 </Menu.Item>
//               </div>
//             </Menu.Items>
//           )}
//         </>
//       )}
//     </Menu>
//   );

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="container mx-auto px-6 py-8 dark:bg-gray-900"
//     >
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                 Total Time Slots
//               </p>
//               <p className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
//                 {data.length}
//               </p>
//             </div>
//             <Clock className="h-10 w-10 text-blue-500" />
//           </div>
//         </div>
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                 Active Time Slots
//               </p>
//               <p className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
//                 {data.filter((slot) => slot.isActive).length}
//               </p>
//             </div>
//             <CheckCircle className="h-10 w-10 text-green-500" />
//           </div>
//         </div>
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                 Inactive Time Slots
//               </p>
//               <p className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
//                 {data.filter((slot) => !slot.isActive).length}
//               </p>
//             </div>
//             <XCircle className="h-10 w-10 text-red-500" />
//           </div>
//         </div>
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                 Avg Price Multiplier
//               </p>
//               <p className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
//                 {(
//                   data.reduce((sum, slot) => sum + slot.priceMultiplier, 0) /
//                   data.length
//                 ).toFixed(2)}
//                 x
//               </p>
//             </div>
//             <Percent className="h-10 w-10 text-purple-500" />
//           </div>
//         </div>
//       </div>
//       <DataTableOne
//         data={data}
//         columns={columns}
//         onRefresh={handleRefresh}
//         onAddNew={() => setShowAddTimeSlotModal(true)}
//         addNewText="Add Time Slot"
//         onTitle="Time Slots' Records"
//         renderRowActions={renderRowActions}
//       />

//       {/* Modals */}
//       {showAddTimeSlotModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
//           <div className="bg-white dark:bg-gray-800 h-full w-full max-w-md overflow-y-auto">
//             <AddTimeSlotsContent
//               onClose={() => setShowAddTimeSlotModal(false)}
//               onTimeSlotAdded={handleRefresh}
//             />
//           </div>
//         </div>
//       )}

//       {showEditTimeSlotModal && selectedTimeSlot && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
//           <div className="bg-white dark:bg-gray-800 h-full w-full max-w-md overflow-y-auto">
//             <EditTimeSlotsContent
//               timeSlot={selectedTimeSlot}
//               onClose={() => {
//                 setShowEditTimeSlotModal(false);
//                 setSelectedTimeSlot(null);
//               }}
//               onTimeSlotUpdated={handleRefresh}
//             />
//           </div>
//         </div>
//       )}

//       {showViewTimeSlotModal && selectedViewTimeSlot && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
//           <div className="bg-white dark:bg-gray-800 h-full w-full max-w-md overflow-y-auto">
//             <ViewTimeSlotsContent
//               timeSlot={selectedViewTimeSlot}
//               onClose={() => {
//                 setShowViewTimeSlotModal(false);
//                 setSelectedViewTimeSlot(null);
//               }}
//             />
//           </div>
//         </div>
//       )}

//       {showDeleteModal && (
//         <DeleteModal
//           onCancel={() => setShowDeleteModal(false)}
//           onConfirm={() => {
//             confirmDelete();
//             setShowDeleteModal(false);
//           }}
//         />
//       )}
//     </motion.div>
//   );
// };

// export default TimeSlotsContent;

import React from 'react'

const TimeSlotsContent = () => {
  return (
    <div>TimeSlotsContent</div>
  )
}

export default TimeSlotsContent