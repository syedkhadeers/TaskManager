import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Menu, Transition } from "@headlessui/react";
import Avatar from "react-avatar";
import { toast } from "react-toastify";
import DataTableOne from "../../reusables/table/DataTableOne";
import { getAllUsers, deleteUser  } from "../../../services/user/userServices";
import { getCurrentUser } from "../../../services/auth/authServices";
import Modal from "../../reusables/modal/Modal";
import StatsCard from "../../reusables/cards/StatsCard";
import EditUsersContent from "./EditUsersContent";
import AddUsersContent from "./AddUsersContent";
import ViewUserContent from "./ViewUserContent";
import DeleteModal from "../../reusables/modal/DeleteModal";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ChangeUserPasswordModal from "../../reusables/modal/ChangeUserPasswordModal";

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "creator", label: "Staff" },
  { value: "user", label: "User" },
  { value: "superadmin", label: "Super Admin" },
];

const UsersContent = () => {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();


  const [state, setState] = useState({
    data: [],
    loading: false,
    pagination: {
      pageSize: 0, // Set a default value
      currentPage: 1,
      totalPages: 0,
      totalRecords: 0,
    },
    modals: {
      add: false,
      edit: false,
      view: false,
      delete: false,
      changePassword: false,
    },
    selectedUser: null,
  });

const fetchUsers = useCallback(async () => {
  setState((prev) => ({ ...prev, loading: true }));
  try {
    const response = await getAllUsers({
      page: state.pagination.currentPage,
      limit: state.pagination.pageSize,
    });

    setState((prev) => ({
      ...prev,
      loading: false,
      data: response.users,
      pagination: {
        ...prev.pagination,
        totalPages: response.totalPages,
        totalRecords: response.total,
      },
    }));
  } catch (error) {
    console.error("Users fetch error:", error);
    setState((prev) => ({ ...prev, loading: false }));
    toast.error("Failed to fetch users");
  }
}, [state.pagination.currentPage, state.pagination.pageSize]);

  useEffect(() => {
    const currentPage = state.pagination.currentPage;
    const totalPages = Math.ceil(
      state.pagination.totalRecords / state.pagination.pageSize
    );

    // If current page is greater than total pages and not the first page
    if (currentPage > totalPages && currentPage > 1) {
      setState((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          currentPage: totalPages || 1,
        },
      }));
    } else {
      fetchUsers();
    }
  }, [state.pagination.currentPage, state.pagination.pageSize]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getCurrentUser();
        if (response?.data) {
          setCurrentUser(response.data);
        }
      } catch (error) {
        toast.error("Failed to load user data");
      }
    };

    fetchUserData();
  }, []);

  const displayUser = currentUser || user;

  const stats = useMemo(
    () => ({
      total: state.data.length,
      verified: state.data.filter((user) => user.isVerified).length,
      unverified: state.data.filter((user) => !user.isVerified).length,
      newUsers: state.data.filter((user) => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return new Date(user.createdAt) > thirtyDaysAgo;
      }).length,
    }),
    [state.data]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "photo.url",
        header: "Photo",
        type: "image",
        cell: ({ row }) => (
          <Avatar
            name={`${row.original.firstName} ${row.original.lastName}`}
            src={row.original.photo?.url}
            size="40"
            round
          />
        ),
      },
      {
        accessorKey: "fullName",
        header: "Name",
      },
      {
        accessorKey: "userName",
        header: "Username",
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
        accessorKey: "department",
        header: "Department",
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
    ],
    []
  );

  const handleDelete = async () => {

    if (!state.selectedUser?._id) {
      toast.error("Invalid user selected");
      return;
    }

    try {
      // Ensure clean ID string
      const userId = state.selectedUser._id.trim();
      await deleteUser(userId);

      toast.success("User deleted successfully");
      setState((prev) => ({
        ...prev,
        modals: { ...prev.modals, delete: false },
        selectedUser: null,
      }));
      fetchUsers();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete user");
    }
  };

  const renderRowActions = useCallback(
    (user, rowIndex, totalRows) => {
      // First check if currentUser exists and has data
      if (!displayUser?._id || !user?._id) {
        return null;
      }

       const isCurrentUser = displayUser._id === user._id;

      if (isCurrentUser) {
        return (
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-500">
              <MoreVerticalIcon size={16} />
            </Menu.Button>

            <Menu.Items
              className={`absolute ${
                rowIndex >= totalRows - 2
                  ? "bottom-full right-0 mb-2" // Position above for last two rows
                  : "top-full right-0 mt-2" // Default positioning
              } w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
            >
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => navigate("/me")}
                      className={`${
                        active ? "bg-gray-100 dark:bg-gray-700" : ""
                      } flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                    >
                      <EyeIcon className="mr-3 h-4 w-4" />
                      My Profile
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        );
      }
      const handleAction = (action) => {
        setState((prev) => ({
          ...prev,
          selectedUser: user,
          modals: { ...prev.modals, [action]: true },
        }));
      };

      return (
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-500">
            <MoreVerticalIcon size={16} />
          </Menu.Button>

          <Menu.Items
            className={`absolute ${
              rowIndex >= totalRows - 2
                ? "bottom-full right-0 mb-2" // Position above for last two rows
                : "top-full right-0 mt-2" // Default positioning
            } w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
          >
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handleAction("view")}
                    className={`${
                      active ? "bg-gray-100 dark:bg-gray-700" : ""
                    } flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                  >
                    <EyeIcon className="mr-3 h-4 w-4" />
                    View
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handleAction("edit")}
                    className={`${
                      active ? "bg-gray-100 dark:bg-gray-700" : ""
                    } flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                  >
                    <PencilIcon className="mr-3 h-4 w-4" />
                    Edit
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handleAction("delete")}
                    className={`${
                      active ? "bg-gray-100 dark:bg-gray-700" : ""
                    } flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                  >
                    <TrashIcon className="mr-3 h-4 w-4" />
                    Delete
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      );
    },
    [displayUser, navigate]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className=" "
    >
      <div className="space-y-8 w-full max-w-full overflow-hidden flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-grow">
          <StatsCard
            title="Total Users"
            value={stats.total}
            icon={<Users className="h-10 w-10" />}
          />
          <StatsCard
            title="Verified Users"
            value={stats.verified}
            icon={<UserCheck className="h-10 w-10 text-green-500" />}
          />
          <StatsCard
            title="Unverified Users"
            value={stats.unverified}
            icon={<UserX className="h-10 w-10 text-red-500" />}
          />
          <StatsCard
            title="New Users (30 days)"
            value={stats.newUsers}
            icon={<UserPlus className="h-10 w-10 text-purple-500" />}
          />
        </div>

        <div className="flex flex-col flex-grow">
          <DataTableOne
            data={state.data}
            columns={columns}
            loading={state.loading}
            pagination={state.pagination}
            onPaginationChange={(newPagination) =>
              setState((prev) => ({ ...prev, pagination: newPagination }))
            }
            onRefresh={fetchUsers}
            renderRowActions={renderRowActions}
            onTitle="Users' Records"
            addNewText="Add User"
            onAddNew={() =>
              setState((prev) => ({
                ...prev,
                modals: { ...prev.modals, add: true },
              }))
            }
          />
        </div>
      </div>

      <AnimatePresence>
        {/* Add User Modal */}
        {state.modals.add && (
          <Modal
            isOpen={state.modals.add}
            onClose={() =>
              setState((prev) => ({
                ...prev,
                modals: { ...prev.modals, add: false },
              }))
            }
            title="Add New User"
            size="lg"
          >
            <AddUsersContent
              onClose={() =>
                setState((prev) => ({
                  ...prev,
                  modals: { ...prev.modals, add: false },
                }))
              }
              onUserAdded={fetchUsers}
            />
          </Modal>
        )}

        {/* Edit User Modal */}
        {state.modals.edit && state.selectedUser && (
          <Modal
            isOpen={state.modals.edit}
            onClose={() =>
              setState((prev) => ({
                ...prev,
                modals: { ...prev.modals, edit: false },
                selectedUser: null,
              }))
            }
            title="Edit User"
            size="lg"
          >
            <EditUsersContent
              user={state.selectedUser}
              onClose={() =>
                setState((prev) => ({
                  ...prev,
                  modals: { ...prev.modals, edit: false },
                  selectedUser: null,
                }))
              }
              onUserUpdated={fetchUsers}
            />
          </Modal>
        )}

        {/* View User Modal */}
        {state.modals.view && state.selectedUser && (
          <Modal
            isOpen={state.modals.view}
            onClose={() =>
              setState((prev) => ({
                ...prev,
                modals: { ...prev.modals, view: false },
                selectedUser: null,
              }))
            }
            title="User Details"
            size="xl"
          >
            <ViewUserContent
              user={state.selectedUser}
              onClose={() =>
                setState((prev) => ({
                  ...prev,
                  modals: { ...prev.modals, view: false },
                  selectedUser: null,
                }))
              }
              onEdit={(user) => {
                setState((prev) => ({
                  ...prev,
                  modals: { ...prev.modals, view: false, edit: true },
                  selectedUser: user,
                }));
              }}
              onDelete={(user) => {
                setState((prev) => ({
                  ...prev,
                  modals: { ...prev.modals, view: false, delete: true },
                  selectedUser: user,
                }));
              }}
              onRefresh={fetchUsers}
            />
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {state.modals.delete && (
          <DeleteModal
            onCancel={() =>
              setState((prev) => ({
                ...prev,
                modals: { ...prev.modals, delete: false },
                selectedUser: null,
              }))
            }
            onConfirm={handleDelete}
          />
        )}

        {/* Change Password Modal */}
        {state.modals.changePassword && (
          <ChangeUserPasswordModal
            onClose={() =>
              setState((prev) => ({
                ...prev,
                modals: { ...prev.modals, changePassword: false },
                selectedUser: null,
              }))
            }
            userId={state.selectedUser?._id}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UsersContent;
