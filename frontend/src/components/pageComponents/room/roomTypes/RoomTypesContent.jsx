// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   EyeIcon,
//   Edit2Icon,
//   Trash2Icon,
//   MoreVerticalIcon,
//   Bed,
//   DollarSign,
//   Users,
// } from "lucide-react";
// import { Menu } from "@headlessui/react";
// import Avatar from "react-avatar";
// import { toast } from "react-toastify";
// import DataTableOne from "../../../reusables/table/DataTableOne";
// import {
//   getAllRoomTypes,
//   deleteRoomType,
// } from "../../../../services/rooms/roomTypeServices";
// import AddRoomTypesContent from "./AddRoomTypesContent";
// import EditRoomTypesContent from "./EditRoomTypesContent";
// import ViewRoomTypesContent from "./ViewRoomTypesContent";
// import DeleteModal from "../../../reusables/modal/DeleteModal";

// const RoomTypesContent = () => {
//   const [data, setData] = useState([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedRoomType, setSelectedRoomType] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [roomTypeIdToDelete, setRoomTypeIdToDelete] = useState(null);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedViewRoomType, setSelectedViewRoomType] = useState(null);

//   const fetchData = async () => {
//     try {
//       const response = await getAllRoomTypes();
//       setData(response);
//     } catch (error) {
//       console.error("Error fetching room types:", error);
//       setData([]);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const columns = [
//     {
//       accessorKey: "images",
//       header: "Images",
//       type: "image",
//       cell: ({ row }) => (
//         <div className="flex -space-x-2 overflow-hidden">
//           {row.original.images.slice(0, 3).map((image, index) => (
//             <Avatar
//               key={index}
//               name={row.original.name}
//               src={image}
//               size="40"
//               round
//               className="border-2 border-white"
//             />
//           ))}
//           {row.original.images.length > 3 && (
//             <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 border-2 border-white text-xs font-medium text-gray-800">
//               +{row.original.images.length - 3}
//             </div>
//           )}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "name",
//       header: "Room Type",
//     },
//     {
//       accessorKey: "basePrice",
//       header: "Base Price",
//       cell: ({ getValue }) => `$${getValue().toFixed(2)}`,
//     },
//     {
//       accessorKey: "maxOccupancy",
//       header: "Max Occupancy",
//     },
//     {
//       accessorKey: "extraServices",
//       header: "Extra Services",
//       cell: ({ row }) => (
//         <div className="flex flex-wrap gap-1">
//           {row.original.extraServices.map((service) => (
//             <span
//               key={service._id}
//               className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
//             >
//               {service.serviceName}
//             </span>
//           ))}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "timeSlotPricing",
//       header: "Time Slots",
//       cell: ({ row }) => (
//         <div className="flex flex-wrap gap-1">
//           {row.original.timeSlotPricing.map((slot) => (
//             <span
//               key={slot.timeSlot._id}
//               className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
//             >
//               {slot.timeSlot.name}
//             </span>
//           ))}
//         </div>
//       ),
//     },
//   ];

//   const handleRefresh = () => {
//     fetchData();
//   };

//   const confirmDelete = async () => {
//     if (roomTypeIdToDelete) {
//       try {
//         await deleteRoomType(roomTypeIdToDelete);
//         toast.success("Room type deleted successfully");
//         await fetchData();
//         setRoomTypeIdToDelete(null);
//       } catch (error) {
//         console.error("Error deleting room type:", error);
//         toast.error("Failed to delete room type");
//       }
//     }
//   };

//   const renderRowActions = (roomType) => (
//     <Menu as="div" className="relative inline-block text-left">
//       {({ open }) => (
//         <>
//           <Menu.Button className="inline-flex items-center justify-center w-8 h-8 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
//             <MoreVerticalIcon size={18} />
//           </Menu.Button>

//           {open && (
//             <Menu.Items
//               static
//               className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
//             >
//               <div className="py-1">
//                 <Menu.Item>
//                   {({ active }) => (
//                     <button
//                       onClick={() => {
//                         setSelectedViewRoomType(roomType);
//                         setShowViewModal(true);
//                       }}
//                       className={`${
//                         active ? "bg-gray-100 text-gray-900" : "text-gray-700"
//                       } flex items-center w-full px-4 py-2 text-sm`}
//                     >
//                       <EyeIcon className="mr-3 h-5 w-5" />
//                       View Details
//                     </button>
//                   )}
//                 </Menu.Item>
//                 <Menu.Item>
//                   {({ active }) => (
//                     <button
//                       onClick={() => {
//                         setSelectedRoomType(roomType);
//                         setShowEditModal(true);
//                       }}
//                       className={`${
//                         active ? "bg-gray-100 text-gray-900" : "text-gray-700"
//                       } flex items-center w-full px-4 py-2 text-sm`}
//                     >
//                       <Edit2Icon className="mr-3 h-5 w-5" />
//                       Edit
//                     </button>
//                   )}
//                 </Menu.Item>
//                 <Menu.Item>
//                   {({ active }) => (
//                     <button
//                       onClick={() => {
//                         setRoomTypeIdToDelete(roomType._id);
//                         setShowDeleteModal(true);
//                       }}
//                       className={`${
//                         active ? "bg-gray-100 text-gray-900" : "text-gray-700"
//                       } flex items-center w-full px-4 py-2 text-sm`}
//                     >
//                       <Trash2Icon className="mr-3 h-5 w-5" />
//                       Delete
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
//       className="container mx-auto px-6 py-8"
//     >
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                 Total Room Types
//               </p>
//               <p className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
//                 {data.length}
//               </p>
//             </div>
//             <Bed className="h-10 w-10 text-blue-500" />
//           </div>
//         </div>
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                 Average Base Price
//               </p>
//               <p className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
//                 $
//                 {(
//                   data.reduce((sum, room) => sum + room.basePrice, 0) /
//                   data.length
//                 ).toFixed(2)}
//               </p>
//             </div>
//             <DollarSign className="h-10 w-10 text-green-500" />
//           </div>
//         </div>
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                 Average Max Occupancy
//               </p>
//               <p className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
//                 {(
//                   data.reduce((sum, room) => sum + room.maxOccupancy, 0) /
//                   data.length
//                 ).toFixed(1)}
//               </p>
//             </div>
//             <Users className="h-10 w-10 text-purple-500" />
//           </div>
//         </div>
//       </div>
//       <DataTableOne
//         data={data}
//         columns={columns}
//         onRefresh={handleRefresh}
//         onAddNew={() => setShowAddModal(true)}
//         addNewText="Add Room Type"
//         onTitle="Room Types"
//         renderRowActions={renderRowActions}
//       />

//       {showAddModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
//           <div className="bg-white dark:bg-gray-800 h-full w-full max-w-md overflow-y-auto">
//             <AddRoomTypesContent
//               onClose={() => setShowAddModal(false)}
//               onRoomTypeAdded={handleRefresh}
//             />
//           </div>
//         </div>
//       )}

//       {showEditModal && selectedRoomType && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
//           <div className="bg-white dark:bg-gray-800 h-full w-full max-w-md overflow-y-auto">
//             <EditRoomTypesContent
//               roomType={selectedRoomType}
//               onClose={() => {
//                 setShowEditModal(false);
//                 setSelectedRoomType(null);
//               }}
//               onRoomTypeUpdated={handleRefresh}
//             />
//           </div>
//         </div>
//       )}

//       {showViewModal && selectedViewRoomType && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
//           <div className="bg-white dark:bg-gray-800 h-full w-full max-w-md overflow-y-auto">
//             <ViewRoomTypesContent
//               roomType={selectedViewRoomType}
//               onClose={() => {
//                 setShowViewModal(false);
//                 setSelectedViewRoomType(null);
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

// export default RoomTypesContent;
import React from 'react'

const RoomTypesContent = () => {
  return (
    <div>RoomTypesContent</div>
  )
}

export default RoomTypesContent