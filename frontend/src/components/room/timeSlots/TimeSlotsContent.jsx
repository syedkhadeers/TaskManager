// import React, { useMemo, useState, useEffect, useRef } from "react";
// import {
//   SearchIcon,
//   DownloadIcon,
//   LayoutGridIcon,
//   MoreVerticalIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   FileTextIcon,
//   PlusIcon,
//   Clock,
//   RefreshCcw,
//   EyeIcon,
//   PencilIcon,
//   TrashIcon,
// } from "lucide-react";
// import {
//   useReactTable,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   flexRender,
// } from "@tanstack/react-table";
// import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
// import { jsPDF } from "jspdf";
// import "jspdf-autotable";
// import AddTimeSlotsContent from "./AddTimeSlotsContent";
// import { Menu, Transition } from "@headlessui/react";
// import { motion } from "framer-motion";
// import {
//   getAllTimeSlots,
//   deleteTimeSlot,
// } from "../../../services/rooms/timeSlotServices";
// import EditTimeSlotsContent from "./EditTimeSlotsContent";
// import ViewTimeSlotsContent from "./ViewTimeSlotsContent";
// import DeleteModal from "../../common/modal/DeleteModal";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// const TimeSlotsContent = () => {
//   const [data, setData] = useState([]);
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
//   const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false);
//   const [showAddTimeSlotModal, setShowAddTimeSlotModal] = useState(false);
//   const [showEditTimeSlotModal, setShowEditTimeSlotModal] = useState(false);
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const dropdownRef = useRef(null);

//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [timeSlotIdToDelete, setTimeSlotIdToDelete] = useState(null);
//   const [showViewTimeSlotModal, setShowViewTimeSlotModal] = useState(false);
//   const [selectedViewTimeSlot, setSelectedViewTimeSlot] = useState(null);

//   const navigate = useNavigate();

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
//     }
//   };

//   const handleRefresh = async () => {
//     setIsRefreshing(true);
//     await fetchData();
//     setIsRefreshing(false);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setExportDropdownOpen(false);
//         setColumnsDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "name",
//         header: "Name",
//       },
//       {
//         accessorKey: "checkInTime",
//         header: "Check-in Time",
//       },
//       {
//         accessorKey: "checkOutTime",
//         header: "Check-out Time",
//       },
//       {
//         accessorKey: "sameDay",
//         header: "Same Day",
//       },
//       {
//         accessorKey: "priceMultiplier",
//         header: "Price Multiplier",
//       },
//       {
//         accessorKey: "isActive",
//         header: "Status",
//         cell: ({ getValue }) => (
//           <span
//             className={`px-3 py-1 text-xs font-medium rounded-full ${
//               getValue()
//                 ? "bg-green-100 text-green-800"
//                 : "bg-red-100 text-red-800"
//             }`}
//           >
//             {getValue() ? "Active" : "Inactive"}
//           </span>
//         ),
//       },
//       {
//         accessorKey: "createdAt",
//         header: "Created On",
//         cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
//       },
//     ],
//     []
//   );

//   const table = useReactTable({
//     data,
//     columns,
//     state: { globalFilter, columnVisibility },
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     onGlobalFilterChange: setGlobalFilter,
//     onColumnVisibilityChange: setColumnVisibility,
//     enableGlobalFilter: true,
//     enableSorting: true,
//   });

//   const exportToCSV = () => {
//     try {
//       const visibleColumns = columns.filter(
//         (col) =>
//           col.accessorKey !== "photo" &&
//           table.getState().columnVisibility[col.accessorKey] !== false
//       );

//       const csvData = table.getFilteredRowModel().rows.map((row) => {
//         const rowData = {};
//         visibleColumns.forEach((col) => {
//           let value = row.getValue(col.accessorKey);
//           if (col.accessorKey === "isVerified") {
//             value = value ? "Verified" : "Not Verified";
//           } else if (col.accessorKey === "createdAt") {
//             value = new Date(value).toLocaleDateString();
//           }
//           rowData[col.header] = value;
//         });
//         return rowData;
//       });

//       const headers = visibleColumns.map((col) => col.header);
//       const csvRows = [
//         headers.join(","),
//         ...csvData.map((row) =>
//           headers
//             .map((header) => {
//               const value = row[header];
//               return typeof value === "string" && value.includes(",")
//                 ? `"${value}"`
//                 : value;
//             })
//             .join(",")
//         ),
//       ];

//       const csvString = csvRows.join("\n");
//       const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = "users_export.csv";
//       link.style.display = "none";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       setExportDropdownOpen(false);
//     } catch (error) {
//       console.error("CSV Export Error:", error);
//       alert("Failed to export CSV. Please try again.");
//     }
//   };

//   const exportToPDF = () => {
//     try {
//       const doc = new jsPDF("landscape");
//       const visibleColumns = columns.filter(
//         (col) =>
//           col.accessorKey !== "photo" &&
//           table.getState().columnVisibility[col.accessorKey] !== false
//       );

//       const tableData = table.getFilteredRowModel().rows.map((row) =>
//         visibleColumns.map((col) => {
//           let value = row.getValue(col.accessorKey);
//           if (col.accessorKey === "isVerified") {
//             return value ? "Verified" : "Not Verified";
//           } else if (col.accessorKey === "createdAt") {
//             return new Date(value).toLocaleDateString();
//           }
//           return value?.toString() || "";
//         })
//       );

//       const headers = visibleColumns.map((col) => col.header);

//       doc.text("Time Slots Report", 14, 15);
//       doc.autoTable({
//         head: [headers],
//         body: tableData,
//         startY: 25,
//         theme: "grid",
//         styles: {
//           fontSize: 8,
//           cellPadding: 2,
//         },
//         headStyles: {
//           fillColor: [71, 85, 105],
//           textColor: 255,
//           fontSize: 8,
//           fontStyle: "bold",
//         },
//         alternateRowStyles: {
//           fillColor: [245, 245, 245],
//         },
//         margin: { top: 20 },
//       });

//       doc.save("users_export.pdf");
//       setExportDropdownOpen(false);
//     } catch (error) {
//       console.error("PDF Export Error:", error);
//       alert("Failed to export PDF. Please try again.");
//     }
//   };

//   const handleEditTimeSlot = (timeSlot) => {
//     setSelectedTimeSlot(timeSlot);
//     setShowEditTimeSlotModal(true);
//   };

//   const handleDeleteTimeSlot = (timeSlot) => {
//     setTimeSlotIdToDelete(timeSlot._id);
//     setShowDeleteModal(true);
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const cardVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//       },
//     },
//   };

//   const cardData = [
//     {
//       title: "Total Time Slots",
//       value: data.length,
//       icon: <Clock className="w-6 h-6" />,
//       bgcolor: "bg-blue-500 dark:bg-blue-600",
//       trend: "+12.5%",
//     },
//     {
//       title: "Active Time Slots",
//       value: data.filter((timeSlot) => timeSlot.isActive).length,
//       icon: <Clock className="w-6 h-6 p-4" />,
//       bgcolor: "bg-green-500 dark:bg-green-600",
//       trend: "+5.2%",
//     },
//   ];

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="container mx-auto px-6 py-8 dark:bg-gray-900"
//     >
//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
//         {cardData.map((card, index) => (
//           <motion.div
//             key={index}
//             initial={{ y: 20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: index * 0.1 }}
//             className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   {card.title}
//                 </p>
//                 <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
//                   {card.value}
//                 </h3>
//                 <span className="text-sm text-green-500 dark:text-green-400">
//                   {card.trend}
//                 </span>
//               </div>
//               <div
//                 className={`${card.bgcolor} bg-opacity-10 dark:bg-opacity-20 p-3 rounded-lg`}
//               >
//                 {React.cloneElement(card.icon, {
//                   className: `h-6 w-6 text-gray-900 dark:text-white`,
//                 })}
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Main Content Card */}
//       <motion.div
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
//       >
//         {/* Header */}
//         <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <h2 className="text-2xl font-semibold text-gray-300 dark:text-white">
//               Time Slot Management
//             </h2>
//             <div className="flex flex-wrap items-center gap-3">
//               <button
//                 onClick={() => setShowAddTimeSlotModal(true)}
//                 className="bg-white/20 dark:bg-gray-700 hover:bg-white/30 dark:hover:bg-gray-600 px-4 py-2  text-gray-300 dark:text-gray-300 rounded-lg focus:outline-none transition-colors flex items-center gap-2"
//               >
//                 <PlusIcon size={20} />
//                 Add Time Slot
//               </button>

//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search time slots..."
//                   value={globalFilter || ""}
//                   onChange={(e) => setGlobalFilter(e.target.value)}
//                   className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//                 <SearchIcon
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
//                   size={20}
//                 />
//               </div>

//               {/* Refresh Button */}
//               <button
//                 onClick={handleRefresh}
//                 disabled={isRefreshing}
//                 className="bg-white/20 dark:bg-gray-700 hover:bg-white/30 dark:hover:bg-gray-600 p-2 rounded-lg focus:outline-none"
//               >
//                 <RefreshCcw
//                   className={`text-gray-300 dark:text-gray-300 ${
//                     isRefreshing ? "animate-spin" : ""
//                   }`}
//                   size={20}
//                 />
//               </button>

//               {/* Export Dropdown */}
//               <Menu as="div" className="relative" ref={dropdownRef}>
//                 <Menu.Button className="bg-white/20 dark:bg-gray-700 hover:bg-white/30 dark:hover:bg-gray-600 p-2 rounded-lg focus:outline-none">
//                   <DownloadIcon
//                     className="text-gray-300 dark:text-gray-300"
//                     size={20}
//                   />
//                 </Menu.Button>

//                 <Transition
//                   enter="transition duration-100 ease-out"
//                   enterFrom="transform scale-95 opacity-0"
//                   enterTo="transform scale-100 opacity-100"
//                   leave="transition duration-75 ease-in"
//                   leaveFrom="transform scale-100 opacity-100"
//                   leaveTo="transform scale-95 opacity-0"
//                 >
//                   <Menu.Items className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700">
//                     <div className="py-1">
//                       <Menu.Item>
//                         {({ active }) => (
//                           <button
//                             onClick={exportToCSV}
//                             className={`${
//                               active
//                                 ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300"
//                                 : "text-gray-700 dark:text-gray-300"
//                             } flex items-center w-full px-4 py-2 text-sm font-medium transition-colors duration-150`}
//                           >
//                             <FileTextIcon className="mr-3 h-4 w-4" />
//                             Export to CSV
//                           </button>
//                         )}
//                       </Menu.Item>

//                       <Menu.Item>
//                         {({ active }) => (
//                           <button
//                             onClick={exportToPDF}
//                             className={`${
//                               active
//                                 ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300"
//                                 : "text-gray-700 dark:text-gray-300"
//                             } flex items-center w-full px-4 py-2 text-sm font-medium transition-colors duration-150`}
//                           >
//                             <FileTextIcon className="mr-3 h-4 w-4" />
//                             Export to PDF
//                           </button>
//                         )}
//                       </Menu.Item>
//                     </div>
//                   </Menu.Items>
//                 </Transition>
//               </Menu>

//               {/* Columns Dropdown */}
//               <div className="relative" ref={dropdownRef}>
//                 <button
//                   onClick={() => setColumnsDropdownOpen(!columnsDropdownOpen)}
//                   className="bg-white/20 dark:bg-gray-700 hover:bg-white/30 dark:hover:bg-gray-600 p-2 rounded-lg focus:outline-none"
//                 >
//                   <LayoutGridIcon
//                     className="text-gray-300 dark:text-gray-300"
//                     size={20}
//                   />
//                 </button>
//                 {columnsDropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden">
//                     {table.getAllLeafColumns().map((column) => (
//                       <label
//                         key={column.id}
//                         className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={column.getIsVisible()}
//                           onChange={column.getToggleVisibilityHandler()}
//                           className="mr-3 rounded text-blue-500 dark:bg-gray-600 focus:ring-blue-400"
//                         />
//                         <span className="text-sm text-gray-700 dark:text-gray-300">
//                           {column.id}
//                         </span>
//                       </label>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 dark:bg-gray-700">
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <tr key={headerGroup.id}>
//                   {headerGroup.headers.map((header) => (
//                     <th
//                       key={header.id}
//                       className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
//                     >
//                       {header.isPlaceholder ? null : (
//                         <div
//                           className={`flex items-center ${
//                             header.column.getCanSort()
//                               ? "cursor-pointer select-none"
//                               : ""
//                           }`}
//                           onClick={header.column.getToggleSortingHandler()}
//                         >
//                           {flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                           {{
//                             asc: <FaSortUp className="ml-2" />,
//                             desc: <FaSortDown className="ml-2" />,
//                           }[header.column.getIsSorted()] ??
//                             (header.column.getCanSort() ? (
//                               <FaSort className="ml-2" />
//                             ) : null)}
//                         </div>
//                       )}
//                     </th>
//                   ))}
//                   <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               ))}
//             </thead>
//             <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//               {table.getRowModel().rows.map((row) => (
//                 <tr
//                   key={row.id}
//                   className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <td
//                       key={cell.id}
//                       className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
//                     >
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </td>
//                   ))}

//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <Menu as="div" className="relative inline-block text-left">
//                       {({ open }) => (
//                         <>
//                           <Menu.Button className="inline-flex items-center justify-center w-8 h-8 text-gray-400 dark:text-gray-500 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 focus:outline-none">
//                             <MoreVerticalIcon size={18} />
//                           </Menu.Button>

//                           {open && (
//                             <Menu.Items
//                               static
//                               className="absolute right-0 w-48 mt-2 origin-top-right bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700 border border-gray-100 dark:border-gray-700"
//                             >
//                               <div className="py-1">
//                                 <Menu.Item>
//                                   {({ active }) => (
//                                     <button
//                                       onClick={() => {
//                                         setSelectedViewTimeSlot(row.original);
//                                         setShowViewTimeSlotModal(true);
//                                       }}
//                                       className={`${
//                                         active
//                                           ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300"
//                                           : "text-gray-700 dark:text-gray-300"
//                                       } flex items-center w-full px-4 py-2 text-sm font-medium transition-colors duration-150`}
//                                     >
//                                       <EyeIcon className="mr-3 h-4 w-4" />
//                                       View Time Slot
//                                     </button>
//                                   )}
//                                 </Menu.Item>

//                                 <Menu.Item>
//                                   {({ active }) => (
//                                     <button
//                                       onClick={() =>
//                                         handleEditTimeSlot(row.original)
//                                       }
//                                       className={`${
//                                         active
//                                           ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300"
//                                           : "text-gray-700 dark:text-gray-300"
//                                       } flex items-center w-full px-4 py-2 text-sm font-medium transition-colors duration-150`}
//                                     >
//                                       <PencilIcon className="mr-3 h-4 w-4" />
//                                       Edit Time Slot
//                                     </button>
//                                   )}
//                                 </Menu.Item>

//                                 <Menu.Item>
//                                   {({ active }) => (
//                                     <button
//                                       onClick={() =>
//                                         handleDeleteTimeSlot(row.original)
//                                       }
//                                       className={`${
//                                         active
//                                           ? "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/50 dark:to-red-800/50 text-red-700 dark:text-red-300"
//                                           : "text-gray-700 dark:text-gray-300"
//                                       } flex items-center w-full px-4 py-2 text-sm font-medium transition-colors duration-150`}
//                                     >
//                                       <TrashIcon className="mr-3 h-4 w-4" />
//                                       Delete Time Slot
//                                     </button>
//                                   )}
//                                 </Menu.Item>
//                               </div>
//                             </Menu.Items>
//                           )}
//                         </>
//                       )}
//                     </Menu>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex flex-col md:flex-row justify-between items-center mt-6 space-y-4 md:space-y-0 px-8 pb-6">
//           <div className="flex items-center space-x-2">
//             <span className="text-sm text-gray-600 dark:text-gray-400">
//               Show
//             </span>
//             <select
//               value={table.getState().pagination.pageSize}
//               onChange={(e) => {
//                 table.setPageSize(Number(e.target.value));
//               }}
//               className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             >
//               {[10, 20, 30, 40, 50].map((pageSize) => (
//                 <option key={pageSize} value={pageSize}>
//                   {pageSize}
//                 </option>
//               ))}
//             </select>
//             <span className="text-sm text-gray-600 dark:text-gray-400">
//               entries
//             </span>
//           </div>
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => table.previousPage()}
//               disabled={!table.getCanPreviousPage()}
//               className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <ChevronLeftIcon size={20} />
//             </button>
//             <span className="text-sm text-gray-600 dark:text-gray-400">
//               Page {table.getState().pagination.pageIndex + 1} of{" "}
//               {table.getPageCount()}
//             </span>
//             <button
//               onClick={() => table.nextPage()}
//               disabled={!table.getCanNextPage()}
//               className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <ChevronRightIcon size={20} />
//             </button>
//           </div>
//         </div>
//       </motion.div>

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

//       {/* View Modal */}
//       {showViewTimeSlotModal && selectedViewTimeSlot && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
//           <div className="bg-white dark:bg-gray-800 h-full w-full max-w-md overflow-y-auto">
//             {/* < className="bg-white dark:bg-gray-800 h-full w-full md:w-2/3 lg:w-3/4 overflow-y-auto"> */}
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


import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MoreVerticalIcon,
  Clock,
  CheckCircle,
  XCircle,
  Percent,
} from "lucide-react";
import { Menu } from "@headlessui/react";
import { toast } from "react-toastify";
import DataTableOne from "../../common/table/DataTableOne";
import {
  getAllTimeSlots,
  deleteTimeSlot,
} from "../../../services/rooms/timeSlotServices";
import AddTimeSlotsContent from "./AddTimeSlotsContent";
import EditTimeSlotsContent from "./EditTimeSlotsContent";
import ViewTimeSlotsContent from "./ViewTimeSlotsContent";
import DeleteModal from "../../common/modal/DeleteModal";

const TimeSlotsContent = () => {
  const [data, setData] = useState([]);
  const [showAddTimeSlotModal, setShowAddTimeSlotModal] = useState(false);
  const [showEditTimeSlotModal, setShowEditTimeSlotModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [timeSlotIdToDelete, setTimeSlotIdToDelete] = useState(null);
  const [showViewTimeSlotModal, setShowViewTimeSlotModal] = useState(false);
  const [selectedViewTimeSlot, setSelectedViewTimeSlot] = useState(null);

  const fetchData = async () => {
    try {
      const response = await getAllTimeSlots();
      if (Array.isArray(response.timeSlots)) {
        setData(response.timeSlots);
      } else {
        console.error("Expected an array but got:", response);
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "checkInTime",
      header: "Check-in Time",
    },
    {
      accessorKey: "checkOutTime",
      header: "Check-out Time",
    },
    {
      accessorKey: "sameDay",
      header: "Same Day",
      cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
    },
    {
      accessorKey: "priceMultiplier",
      header: "Price Multiplier",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ getValue }) => (
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            getValue()
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {getValue() ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created On",
      cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
    },
  ];

  const handleRefresh = () => {
    fetchData();
  };

  const confirmDelete = async () => {
    if (timeSlotIdToDelete) {
      try {
        await deleteTimeSlot(timeSlotIdToDelete);
        toast.success("Time slot deleted successfully");
        await fetchData();
        setTimeSlotIdToDelete(null);
      } catch (error) {
        console.error("Error deleting time slot:", error);
        toast.error("Failed to delete time slot");
      }
    }
  };

  const renderRowActions = (timeSlot) => (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <Menu.Button className="inline-flex items-center justify-center w-8 h-8 text-gray-400 dark:text-gray-500 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 focus:outline-none">
            <MoreVerticalIcon size={18} />
          </Menu.Button>

          {open && (
            <Menu.Items
              static
              className="absolute right-0 w-48 mt-2 origin-top-right bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700 border border-gray-100 dark:border-gray-700"
            >
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        setSelectedViewTimeSlot(timeSlot);
                        setShowViewTimeSlotModal(true);
                      }}
                      className={`${
                        active
                          ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-300"
                      } flex items-center w-full px-4 py-2 text-sm font-medium transition-colors duration-150`}
                    >
                      <EyeIcon className="mr-3 h-4 w-4" />
                      View Time Slot
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        setSelectedTimeSlot(timeSlot);
                        setShowEditTimeSlotModal(true);
                      }}
                      className={`${
                        active
                          ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-300"
                      } flex items-center w-full px-4 py-2 text-sm font-medium transition-colors duration-150`}
                    >
                      <PencilIcon className="mr-3 h-4 w-4" />
                      Edit Time Slot
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        setTimeSlotIdToDelete(timeSlot._id);
                        setShowDeleteModal(true);
                      }}
                      className={`${
                        active
                          ? "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/50 dark:to-red-800/50 text-red-700 dark:text-red-300"
                          : "text-gray-700 dark:text-gray-300"
                      } flex items-center w-full px-4 py-2 text-sm font-medium transition-colors duration-150`}
                    >
                      <TrashIcon className="mr-3 h-4 w-4" />
                      Delete Time Slot
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          )}
        </>
      )}
    </Menu>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-6 py-8 dark:bg-gray-900"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Time Slots
              </p>
              <p className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
                {data.length}
              </p>
            </div>
            <Clock className="h-10 w-10 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Time Slots
              </p>
              <p className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
                {data.filter((slot) => slot.isActive).length}
              </p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Inactive Time Slots
              </p>
              <p className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
                {data.filter((slot) => !slot.isActive).length}
              </p>
            </div>
            <XCircle className="h-10 w-10 text-red-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg Price Multiplier
              </p>
              <p className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
                {(
                  data.reduce((sum, slot) => sum + slot.priceMultiplier, 0) /
                  data.length
                ).toFixed(2)}
                x
              </p>
            </div>
            <Percent className="h-10 w-10 text-purple-500" />
          </div>
        </div>
      </div>
      <DataTableOne
        data={data}
        columns={columns}
        onRefresh={handleRefresh}
        onAddNew={() => setShowAddTimeSlotModal(true)}
        addNewText="Add Time Slot"
        onTitle="Time Slots' Records"
        renderRowActions={renderRowActions}
      />

      {/* Modals */}
      {showAddTimeSlotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
          <div className="bg-white dark:bg-gray-800 h-full w-full max-w-md overflow-y-auto">
            <AddTimeSlotsContent
              onClose={() => setShowAddTimeSlotModal(false)}
              onTimeSlotAdded={handleRefresh}
            />
          </div>
        </div>
      )}

      {showEditTimeSlotModal && selectedTimeSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
          <div className="bg-white dark:bg-gray-800 h-full w-full max-w-md overflow-y-auto">
            <EditTimeSlotsContent
              timeSlot={selectedTimeSlot}
              onClose={() => {
                setShowEditTimeSlotModal(false);
                setSelectedTimeSlot(null);
              }}
              onTimeSlotUpdated={handleRefresh}
            />
          </div>
        </div>
      )}

      {showViewTimeSlotModal && selectedViewTimeSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
          <div className="bg-white dark:bg-gray-800 h-full w-full max-w-md overflow-y-auto">
            <ViewTimeSlotsContent
              timeSlot={selectedViewTimeSlot}
              onClose={() => {
                setShowViewTimeSlotModal(false);
                setSelectedViewTimeSlot(null);
              }}
            />
          </div>
        </div>
      )}

      {showDeleteModal && (
        <DeleteModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => {
            confirmDelete();
            setShowDeleteModal(false);
          }}
        />
      )}
    </motion.div>
  );
};

export default TimeSlotsContent;
