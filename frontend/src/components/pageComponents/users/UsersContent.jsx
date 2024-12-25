import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  Users,
  UserCheck,
  UserX,
  UserPlus,
  MoreVerticalIcon,
} from "lucide-react";
import { Menu } from "@headlessui/react";
import Avatar from "react-avatar";
import { toast } from "react-toastify";
import DataTableOne from "../../reusables/table/DataTableOne";
import { getAllUsers, deleteUser } from "../../../services/user/userServices";
import AddUsersContent from "./AddUsersContent";
import EditUsersContent from "./EditUsersContent";
import ViewUserContent from "./ViewUserContent";
import DeleteModal from "../../reusables/modal/DeleteModal";

const UsersContent = () => {
  const [data, setData] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [selectedViewUser, setSelectedViewUser] = useState(null);

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

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      accessorKey: "photo",
      header: "Photo",
      type: "image",
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
  ];

  const handleRefresh = () => {
    fetchData();
  };

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

  const renderRowActions = (user) => (
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
                        setSelectedViewUser(user);
                        setShowViewUserModal(true);
                      }}
                      className={`${
                        active
                          ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-300"
                      } flex items-center w-full px-4 py-2 text-sm font-medium transition-colors duration-150`}
                    >
                      <EyeIcon className="mr-3 h-4 w-4" />
                      View User
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowEditUserModal(true);
                      }}
                      className={`${
                        active
                          ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-300"
                      } flex items-center w-full px-4 py-2 text-sm font-medium transition-colors duration-150`}
                    >
                      <PencilIcon className="mr-3 h-4 w-4" />
                      Edit User
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        setUserIdToDelete(user._id);
                        setShowDeleteModal(true);
                      }}
                      className={`${
                        active
                          ? "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/50 dark:to-red-800/50 text-red-700 dark:text-red-300"
                          : "text-gray-700 dark:text-gray-300"
                      } flex items-center w-full px-4 py-2 text-sm font-medium transition-colors duration-150`}
                    >
                      <TrashIcon className="mr-3 h-4 w-4" />
                      Delete User
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
                Total Users
              </p>
              <p className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
                {data.length}
              </p>
            </div>
            <Users className="h-10 w-10 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Verified Users
              </p>
              <p className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
                {data.filter((user) => user.isVerified).length}
              </p>
            </div>
            <UserCheck className="h-10 w-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Unverified Users
              </p>
              <p className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
                {data.filter((user) => !user.isVerified).length}
              </p>
            </div>
            <UserX className="h-10 w-10 text-red-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                New Users (Last 30 days)
              </p>
              <p className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
                {
                  data.filter((user) => {
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return new Date(user.createdAt) > thirtyDaysAgo;
                  }).length
                }
              </p>
            </div>
            <UserPlus className="h-10 w-10 text-purple-500" />
          </div>
        </div>
      </div>
      <DataTableOne
        data={data}
        columns={columns}
        onRefresh={handleRefresh}
        onAddNew={() => setShowAddUserModal(true)}
        addNewText="Add User"
        onTitle="Users' Records"
        renderRowActions={renderRowActions}
      />

      {/* Modals */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
          <div className="bg-white dark:bg-gray-800 h-full w-full max-w-md overflow-y-auto">
            <AddUsersContent
              onClose={() => setShowAddUserModal(false)}
              onUserAdded={handleRefresh}
            />
          </div>
        </div>
      )}

      {showEditUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
          <div className="bg-white dark:bg-gray-800 h-full w-full max-w-md overflow-y-auto">
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

      {showViewUserModal && selectedViewUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
          <div className="bg-white dark:bg-gray-800 h-full w-full md:w-2/3 lg:w-3/4 overflow-y-auto">
            <ViewUserContent
              user={selectedViewUser}
              onClose={() => {
                setShowViewUserModal(false);
                setSelectedViewUser(null);
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

export default UsersContent;

