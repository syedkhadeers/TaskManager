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
} from "lucide-react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Avatar from "react-avatar";
import Papa from "papaparse";
import AddUsersContent from "./AddUsersContent";
import EditUserModal from "../common/modal/EditUserModal";
import { Menu, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { getAllUsers } from "../../services/userServices"; // Import getAllUsers

const UsersContent = () => {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllUsers();
        if (Array.isArray(response)) {
          setData(response);
        } else {
          console.error("Expected an array but got:", response);
          setData([]); // Handle the error as needed
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
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
    // Ensure Papa is available and data exists
    if (!Papa || typeof Papa.unparse !== "function" || data.length === 0) {
      alert("Unable to export CSV. No data or export library missing.");
      return;
    }

    try {
      // Prepare data for CSV export
      const csvData = data.map((row) => ({
        Name: row.name || "N/A",
        Email: row.email || "N/A",
        Role: row.role || "N/A",
        Status: row.isVerified ? "Verified" : "Not Verified",
        Mobile: row.mobile || "N/A",
        CreatedOn: row.createdAt
          ? new Date(row.createdAt).toLocaleDateString()
          : "N/A",
      }));

      // Use Papa.unparse to convert data to CSV string
      const csv = Papa.unparse(csvData);

      // Create a Blob with the CSV data
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

      // Create a link element, use it to download the blob, then remove it
      const link = document.createElement("a");

      // Supports most modern browsers
      if (navigator.msSaveBlob) {
        // For IE 10+
        navigator.msSaveBlob(blob, "users.csv");
      } else {
        link.href = URL.createObjectURL(blob);
        link.download = "users.csv";
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Clean up
      URL.revokeObjectURL(link.href);

      // Close export dropdown
      setExportDropdownOpen(false);
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      alert("Failed to export CSV. Please try again.");
    }
  };

  const exportToPDF = () => {
    // Ensure jsPDF and autoTable are available
    if (!jsPDF || !autoTable || data.length === 0) {
      alert("Unable to export PDF. No data or export library missing.");
      return;
    }

    try {
      const doc = new jsPDF("landscape");

      // Prepare data for PDF export
      const tableData = data.map((row) => [
        row.name || "N/A",
        row.email || "N/A",
        row.role || "N/A",
        row.isVerified ? "Verified" : "Not Verified",
        row.mobile || "N/A",
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A",
      ]);

      // Add title to PDF
      doc.text("User Management Report", 14, 15);

      // Create table with autoTable plugin
      autoTable(doc, {
        head: [["Name", "Email", "Role", "Status", "Mobile", "Created On"]],
        body: tableData,
        startY: 25,
        theme: "striped",
        styles: {
          fontSize: 9,
          cellPadding: 3,
          overflow: "linebreak",
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 40 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 30 },
          5: { cellWidth: 25 },
        },
      });

      // Save the PDF
      doc.save("users.pdf");

      // Close export dropdown
      setExportDropdownOpen(false);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      alert("Failed to export PDF. Please try again.");
    }
  };
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditUserModal(true);
  };

  const handleDeleteUser = (userId) => {
    // Implement delete user logic here
    console.log(`Deleting user with ID: ${userId}`);
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

              {/* Actions Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-lg focus:outline-none"
                >
                  <DownloadIcon className="text-white" size={20} />
                </button>
                {exportDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-10 overflow-hidden">
                    <button
                      onClick={exportToCSV}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
                    >
                      <FileTextIcon className="mr-3 text-blue-500" size={18} />
                      Export to CSV
                    </button>
                    <button
                      onClick={exportToPDF}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
                    >
                      <FileTextIcon className="mr-3 text-green-500" size={18} />
                      Export to PDF
                    </button>
                  </div>
                )}
              </div>

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
                                  onClick={() =>
                                    handleDeleteUser(row.original.id)
                                  }
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
            <AddUsersContent onClose={() => setShowAddUserModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersContent;
