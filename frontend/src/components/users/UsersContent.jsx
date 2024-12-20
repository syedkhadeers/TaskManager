// UsersContent.jsx

import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  SearchIcon,
  DownloadIcon,
  LayoutGridIcon,
  MoreVerticalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FileTextIcon,
  PlusIcon,
  UsersIcon,
  UserCheckIcon,
  ShieldIcon,
  PencilIcon,
  RefreshCcw,
} from "lucide-react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Avatar from "react-avatar";
import AddUsersContent from "./AddUsersContent";
import { Menu, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { getAllUsers, deleteUser  } from "../../services/userServices";
import EditUsersContent from "./EditUsersContent";
import DeleteModal from "../common/modal/DeleteModal";
import { toast } from "react-toastify";

const UsersContent = () => {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser , setSelectedUser ] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dropdownRef = useRef(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null); // Store the user ID to delete

const confirmDelete = async () => {
  if (userIdToDelete) {
    try {
      await deleteUser(userIdToDelete);
      toast.success("User deleted successfully");
      await fetchData();
      setUserIdToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  }
};



  const fetchData = async () => {
    try {
      const response = await getAllUsers();
      if (Array.isArray(response)) {
        setData(response);
      } else {
        console.error("Expected an array but got:", response);
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setExportDropdownOpen(false);
        setColumnsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "photo",
        header: "Photo",
        cell: ({ row }) => (
          <Avatar
            name={row.original.name}
            src={row.original.photo?.url}
            size="40"
            round
          />
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "mobile",
        header: "Mobile",
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ getValue }) => (
          <span className="px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
            {getValue()}
          </span>
        ),
      },
      {
        accessorKey: "isVerified",
        header: "Status",
        cell: ({ getValue }) => (
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              getValue()
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {getValue() ? "Verified" : "Not Verified"}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created On",
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, columnVisibility },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    enableGlobalFilter: true,
    enableSorting: true,
  });

const exportToCSV = () => {
  try {
    const visibleColumns = columns.filter(
      (col) =>
        col.accessorKey !== "photo" &&
        table.getState().columnVisibility[col.accessorKey] !== false
    );

    const csvData = table.getFilteredRowModel().rows.map((row) => {
      const rowData = {};
      visibleColumns.forEach((col) => {
        let value = row.getValue(col.accessorKey);
        if (col.accessorKey === "isVerified") {
          value = value ? "Verified" : "Not Verified";
        } else if (col.accessorKey === "createdAt") {
          value = new Date(value).toLocaleDateString();
        }
        rowData[col.header] = value;
      });
      return rowData;
    });

    const headers = visibleColumns.map((col) => col.header);
    const csvRows = [
      headers.join(","),
      ...csvData.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            return typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : value;
          })
          .join(",")
      ),
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "users_export.csv";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportDropdownOpen(false);
  } catch (error) {
    console.error("CSV Export Error:", error);
    alert("Failed to export CSV. Please try again.");
  }
};


const exportToPDF = () => {
  try {
    const doc = new jsPDF("landscape");
    const visibleColumns = columns.filter(
      (col) =>
        col.accessorKey !== "photo" &&
        table.getState().columnVisibility[col.accessorKey] !== false
    );

    const tableData = table.getFilteredRowModel().rows.map((row) =>
      visibleColumns.map((col) => {
        let value = row.getValue(col.accessorKey);
        if (col.accessorKey === "isVerified") {
          return value ? "Verified" : "Not Verified";
        } else if (col.accessorKey === "createdAt") {
          return new Date(value).toLocaleDateString();
        }
        return value?.toString() || "";
      })
    );

    const headers = visibleColumns.map((col) => col.header);

    doc.text("Users Report", 14, 15);
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 25,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [71, 85, 105],
        textColor: 255,
        fontSize: 8,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 20 },
    });

    doc.save("users_export.pdf");
    setExportDropdownOpen(false);
  } catch (error) {
    console.error("PDF Export Error:", error);
    alert("Failed to export PDF. Please try again.");
  }
};


const handleEditUser = (user) => {
  setSelectedUser(user);
  setShowEditUserModal(true);
};

const handleDeleteUser = (user) => {
  // MongoDB IDs are typically stored in the _id field
  setUserIdToDelete(user._id);
  setShowDeleteModal(true);
};

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const cardData = [
    {
      title: "Total Users",
      value: data.length,
      icon: <UsersIcon className="w-6 h-6" />,
      color: "from-teal-400 to-teal-600", // Teal gradient
      description: "Total number of registered users",
    },
    {
      title: "Verified Users",
      value: data.filter((user) => user.isVerified).length,
      icon: <UserCheckIcon className="w-6 h-6" />,
      color: "from-amber-400 to-amber-600", // Amber gradient
      description: "Number of verified users",
    },
    {
      title: "Admin Users",
      value: data.filter((user) => user.role === "admin").length,
      icon: <ShieldIcon className="w-6 h-6" />,
      color: "from-indigo-500 to-indigo-700", // Indigo gradient
      description: "Number of admin users",
    },
    {
      title: "Creators",
      value: data.filter((user) => user.role === "creator").length,
      icon: <PencilIcon className="w-6 h-6" />, // Changed icon to PencilIcon for creators
      color: "from-pink-500 to-pink-700", // Pink gradient
      description: "Number of creators",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* Stats section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8"
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

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <h2 className="text-2xl font-bold text-white">User Management</h2>
            <div className="flex flex-wrap justify-center md:justify-end space-x-3 space-y-2 md:space-y-0">
              {/* Add New User button */}
              <button
                onClick={() => setShowAddUserModal(true)}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center"
              >
                <PlusIcon className="mr-2" size={20} />
                Add New User
              </button>

              {/* Search */}
              <div className="relative flex-grow max-w-md">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={globalFilter || ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <SearchIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70"
                  size={20}
                />
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg focus:outline-none"
              >
                <RefreshCcw
                  className={`text-white ${isRefreshing ? "animate-spin" : ""}`}
                  size={20}
                />
              </button>

              {/* Actions Dropdown */}
              <Menu as="div" className="relative" ref={dropdownRef}>
                <Menu.Button className="bg-white/20 hover:bg-white/30 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors">
                  <DownloadIcon className="text-white" size={20} />
                </Menu.Button>

                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-in"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-10 overflow-hidden ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={exportToCSV}
                          className={`flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none ${
                            active ? "bg-gray-50" : ""
                          }`}
                        >
                          <FileTextIcon
                            className="mr-3 text-blue-500 group-hover:text-blue-600"
                            size={18}
                          />
                          <span className="group-hover:text-gray-900">
                            Export to CSV
                          </span>
                        </button>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={exportToPDF}
                          className={`flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none ${
                            active ? "bg-gray-50" : ""
                          }`}
                        >
                          <FileTextIcon
                            className="mr-3 text-green-500 group-hover:text-green-600"
                            size={18}
                          />
                          <span className="group-hover:text-gray-900">
                            Export to PDF
                          </span>
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>

              {/* Columns Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setColumnsDropdownOpen(!columnsDropdownOpen)}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-lg focus:outline-none"
                >
                  <LayoutGridIcon className="text-white" size={20} />
                </button>
                {columnsDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-10 overflow-hidden">
                    {table.getAllLeafColumns().map((column) => (
                      <label
                        key={column.id}
                        className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={column.getIsVisible()}
                          onChange={column.getToggleVisibilityHandler()}
                          className="mr-3 rounded text-blue-500 focus:ring-blue-400"
                        />
                        <span className="text-sm text-gray-700">
                          {column.id}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center ${
                            header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : ""
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <FaSortUp className="ml-2" />,
                            desc: <FaSortDown className="ml-2" />,
                          }[header.column.getIsSorted()] ??
                            (header.column.getCanSort() ? (
                              <FaSort className="ml-2" />
                            ) : null)}
                        </div>
                      )}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button className="text-gray-500 hover:text-blue-600 focus:outline-none">
                          <MoreVerticalIcon size={20} />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={React.Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="px-1 py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => handleEditUser(row.original)}
                                  className={`${
                                    active
                                      ? "bg-blue-500 text-white"
                                      : "text-gray-900"
                                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                >
                                  Edit User
                                </button>
                              )}
                            </Menu.Item>
                            
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => handleDeleteUser(row.original)}
                                  className={`${
                                    active
                                      ? "bg-red-500 text-white"
                                      : "text-gray-900"
                                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                >
                                  Delete User
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 space-y-4 md:space-y-0 px-8 pb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Show</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon size={20} />
            </button>
            <span className="text-sm text-gray-600">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
          <div className="bg-white h-full w-full max-w-md overflow-y-auto">
            <AddUsersContent
              onClose={() => setShowAddUserModal(false)}
              onUserAdded={handleRefresh} // Pass handleRefresh as a prop
            />
          </div>
        </div>
      )}

      {showEditUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
          <div className="bg-white h-full w-full max-w-md overflow-y-auto">
            <EditUsersContent
              user={selectedUser}
              onClose={() => {
                setShowEditUserModal(false);
                setSelectedUser(null);
              }}
              onUserUpdated={handleRefresh}
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
    </div>
  );
};

export default UsersContent;
