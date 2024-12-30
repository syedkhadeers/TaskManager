// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   EyeIcon,
//   Edit2Icon,
//   Trash2Icon,
//   MoreVerticalIcon,
//   Package,
//   CheckCircle,
//   XCircle,
//   DollarSign,
// } from "lucide-react";
// import { Menu } from "@headlessui/react";
// import Avatar from "react-avatar";
// import { toast } from "react-toastify";
// import DataTableOne from "../../../reusables/table/DataTableOne";
// import {
//   getAllExtraServices,
//   deleteExtraService,
// } from "../../../../services/rooms/extraServiceServices";
// import AddExtraServicesContent from "./AddExtraServicesContent";
// import EditExtraServicesContent from "./EditExtraServicesContent";
// import ViewExtraServicesContent from "./ViewExtraServicesContent";
// import DeleteModal from "../../../reusables/modal/DeleteModal";

// const ExtraServicesContent = () => {
//   const [data, setData] = useState([]);
//   const [showAddServiceModal, setShowAddServiceModal] = useState(false);
//   const [showEditServiceModal, setShowEditServiceModal] = useState(false);
//   const [selectedService, setSelectedService] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [serviceIdToDelete, setServiceIdToDelete] = useState(null);
//   const [showViewServiceModal, setShowViewServiceModal] = useState(false);
//   const [selectedViewService, setSelectedViewService] = useState(null);

//   const fetchData = async () => {
//     try {
//       const response = await getAllExtraServices();
//       if (Array.isArray(response)) {
//         setData(response);
//       } else if (response && Array.isArray(response.extraServices)) {
//         setData(response.extraServices);
//       } else if (response && Array.isArray(response.data)) {
//         setData(response.data);
//       } else {
//         console.error("Unexpected response structure:", response);
//         setData([]);
//       }
//     } catch (error) {
//       console.error("Error fetching extra services:", error);
//       setData([]);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const columns = [
//     {
//       accessorKey: "image",
//       header: "Image",
//       type: "image",
//       cell: ({ row }) => (
//         <Avatar
//           name={row.original.serviceName}
//           src={row.original.image}
//           size="40"
//           round
//         />
//       ),
//     },
//     {
//       accessorKey: "serviceName",
//       header: "Service Name",
//     },
//     {
//       accessorKey: "description",
//       header: "Description",
//     },
//     {
//       accessorKey: "price",
//       header: "Price",
//       cell: ({ getValue }) => `$${getValue().toFixed(2)}`,
//     },
//     {
//       accessorKey: "serviceType",
//       header: "Service Type",
//     },
//     {
//       accessorKey: "availability",
//       header: "Availability",
//       cell: ({ getValue }) => (
//         <span
//           className={`px-3 py-1 text-xs font-medium rounded-full ${
//             getValue()
//               ? "bg-green-100 text-green-800"
//               : "bg-red-100 text-red-800"
//           }`}
//         >
//           {getValue() ? "Available" : "Unavailable"}
//         </span>
//       ),
//     },
//   ];

//   const handleRefresh = () => {
//     fetchData();
//   };

//   const confirmDelete = async () => {
//     if (serviceIdToDelete) {
//       try {
//         await deleteExtraService(serviceIdToDelete);
//         toast.success("Extra service deleted successfully");
//         await fetchData();
//         setServiceIdToDelete(null);
//       } catch (error) {
//         console.error("Error deleting extra service:", error);
//         toast.error("Failed to delete extra service");
//       }
//     }
//   };

//   const renderRowActions = (service) => (
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
//                         setSelectedViewService(service);
//                         setShowViewServiceModal(true);
//                       }}
//                       className={`${
//                         active
//                           ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300"
//                           : "text-gray-700 dark:text-gray-300"
//                       } flex items-center w-full px-4 py-2 text-sm font-medium transition-colors duration-150`}
//                     >
//                       <EyeIcon className="mr-3 h-4 w-4" />
//                       View Service
//                     </button>
//                   )}
//                 </Menu.Item>

//                 <Menu.Item>
//                   {({ active }) => (
//                     <button
//                       onClick={() => {
//                         setSelectedService(service);
//                         setShowEditServiceModal(true);
//                       }}
//                       className={`${
//                         active
//                           ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300"
//                           : "text-gray-700 dark:text-gray-300"
//                       } flex items-center w-full px-4 py-2 text-sm font-medium transition-colors duration-150`}
//                     >
//                       <Edit2Icon className="mr-3 h-4 w-4" />
//                       Edit Service
//                     </button>
//                   )}
//                 </Menu.Item>

//                 <Menu.Item>
//                   {({ active }) => (
//                     <button
//                       onClick={() => {
//                         setServiceIdToDelete(service._id);
//                         setShowDeleteModal(true);
//                       }}
//                       className={`${
//                         active
//                           ? "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/50 dark:to-red-800/50 text-red-700 dark:text-red-300"
//                           : "text-gray-700 dark:text-gray-300"
//                       } flex items-center w-full px-4 py-2 text-sm font-medium transition-colors duration-150`}
//                     >
//                       <Trash2Icon className="mr-3 h-4 w-4" />
//                       Delete Service
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
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                 Total Services
//               </p>
//               <p className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
//                 {data.length}
//               </p>
//             </div>
//             <Package className="h-10 w-10 text-blue-500" />
//           </div>
//         </div>
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                 Available Services
//               </p>
//               <p className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
//                 {data.filter((service) => service.availability).length}
//               </p>
//             </div>
//             <CheckCircle className="h-10 w-10 text-green-500" />
//           </div>
//         </div>
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                 Unavailable Services
//               </p>
//               <p className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
//                 {data.filter((service) => !service.availability).length}
//               </p>
//             </div>
//             <XCircle className="h-10 w-10 text-red-500" />
//           </div>
//         </div>
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                 Average Price
//               </p>
//               <p className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
//                 $
//                 {(
//                   data.reduce((sum, service) => sum + service.price, 0) /
//                   data.length
//                 ).toFixed(2)}
//               </p>
//             </div>
//             <DollarSign className="h-10 w-10 text-purple-500" />
//           </div>
//         </div>
//       </div>
//       <DataTableOne
//         data={data}
//         columns={columns}
//         onRefresh={handleRefresh}
//         onAddNew={() => setShowAddServiceModal(true)}
//         addNewText="Add Service"
//         onTitle="Extra Services' Records"
//         renderRowActions={renderRowActions}
//       />

//       {/* Modals */}
//       {showAddServiceModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
//           <div className="bg-white dark:bg-gray-800 h-full w-full max-w-md overflow-y-auto">
//             <AddExtraServicesContent
//               onClose={() => setShowAddServiceModal(false)}
//               onServiceAdded={handleRefresh}
//             />
//           </div>
//         </div>
//       )}

//       {showEditServiceModal && selectedService && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
//           <div className="bg-white dark:bg-gray-800 h-full w-full max-w-md overflow-y-auto">
//             <EditExtraServicesContent
//               service={selectedService}
//               onClose={() => {
//                 setShowEditServiceModal(false);
//                 setSelectedService(null);
//               }}
//               onServiceUpdated={handleRefresh}
//             />
//           </div>
//         </div>
//       )}

//       {showViewServiceModal && selectedViewService && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
//           <div className="bg-white dark:bg-gray-800 h-full w-full max-w-md overflow-y-auto">
//             <ViewExtraServicesContent
//               service={selectedViewService}
//               onClose={() => {
//                 setShowViewServiceModal(false);
//                 setSelectedViewService(null);
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

// export default ExtraServicesContent;

import React from 'react'

const ExtraServicesContent = () => {
  return (
    <div>ExtraServicesContent</div>
  )
}

export default ExtraServicesContent