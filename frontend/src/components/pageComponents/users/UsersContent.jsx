import React, { useState, useEffect, useMemo } from "react";
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
  Clock,
} from "lucide-react";
import { Menu } from "@headlessui/react";
import Avatar from "react-avatar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import DataTableOne from "../../reusables/table/DataTableOne";
import Modal from "../../reusables/modal/Modal";
import StatsCard from "../../reusables/cards/StatsCard";
import { getAllUsers, deleteUser } from "../../../services/user/userServices";
import ViewUserContent from "./ViewUserContent";
import EditUsersContent from "./EditUsersContent";
import AddUsersContent from "./AddUsersContent";
import ChangeUserPasswordModal from "../../reusables/modal/ChangeUserPasswordModal";
import DeleteModal from "../../reusables/modal/DeleteModal";

const UsersContent = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const [state, setState] = useState({
    data: [],
    loading: true,
    selectedUser: null,
    stats: {
      total: 0,
      verified: 0,
      unverified: 0,
      newUsers: 0,
    },
    modals: {
      add: false,
      edit: false,
      view: false,
      delete: false,
      changePassword: false,
    },
  });

  // Update the columns definition with more attractive styling
  const columns = useMemo(
    () => [
      {
        accessorKey: "photo",
        header: "Photo",
        cell: ({ row }) => (
          <div className="flex -space-x-2 hover:space-x-1 transition-all duration-200">
            <Avatar
              name={row.original.fullName}
              src={row.original.photo?.url}
              size="45"
              round
              className="border-2 border-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-transform duration-200"
            />
          </div>
        ),
      },
      {
        accessorKey: "fullName",
        header: "User Details",
        cell: ({ row }) => (
          <div className="flex flex-col space-y-1 py-2">
            <span className="text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {row.original.fullName}
            </span>
            <span className="text-sm text-gray-500">{row.original.email}</span>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: "Role & Permissions",
        cell: ({ row }) => (
          <div className="flex flex-col space-y-1">
            <span className="px-3 py-1 text-sm font-bold bg-blue-100 text-blue-700 rounded-full w-fit">
              {row.original.role}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Account Status",
        cell: ({ row }) => (
          <div className="flex flex-col space-y-2">
            <div
              className={`
            group relative px-3 py-1.5 rounded-md border transition-all duration-300
            ${
              row.original.isVerified
                ? "border-emerald-500 bg-emerald-50 hover:bg-emerald-100"
                : "border-rose-300 bg-rose-50 hover:bg-rose-100"
            }
          `}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-3 rounded-full ${
                    row.original.isVerified ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
                <span
                  className={`font-medium text-xs tracking-wide ${
                    row.original.isVerified
                      ? "text-emerald-700"
                      : "text-rose-700"
                  }`}
                >
                  {row.original.isVerified ? "Verified" : "Unverified"}
                </span>
              </div>
            </div>
            <div className="flex items-center px-3 py-1.5 bg-gray-50 rounded-lg">
              <Clock className="h-4 w-4 text-gray-600 mr-1.5" />
              <span className="text-xs text-gray-600">
                Joined: {new Date(row.original.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ),
      },
    ],
    []
  );

  const fetchUsers = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await getAllUsers();
      if (response?.users) {
        const stats = {
          total: response.users.length,
          verified: response.users.filter((u) => u.isVerified).length,
          unverified: response.users.filter((u) => !u.isVerified).length,
          newUsers: response.users.filter((u) => {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return new Date(u.createdAt) > thirtyDaysAgo;
          }).length,
        };
        setState((prev) => ({
          ...prev,
          data: response.users,
          stats,
          loading: false,
        }));
      }
    } catch (error) {
      toast.error("Failed to fetch users");
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(state.selectedUser._id);
      toast.success("User deleted successfully");
      fetchUsers();
      setState((prev) => ({
        ...prev,
        modals: { ...prev.modals, delete: false },
        selectedUser: null,
      }));
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const renderRowActions = (user, rowIndex, totalRows) => (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
        <MoreVerticalIcon className="h-5 w-5 dark:text-gray-200" />
      </Menu.Button>
      <Menu.Items
        className={`absolute ${
          totalRows - rowIndex <= 3 ? "bottom-full mb-2" : "top-full mt-2"
        } right-0 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50`}
      >
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${
                active ? "bg-gray-100 dark:bg-gray-700" : ""
              } flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  selectedUser: user,
                  modals: {
                    ...prev.modals,
                    view: user._id === authUser._id ? "viewMe" : "view",
                  },
                }))
              }
            >
              <EyeIcon className="mr-3 h-5 w-5" />
              {user._id === authUser._id ? "View My Details" : "View Details"}
            </button>
          )}
        </Menu.Item>
        {user._id !== authUser._id && (
          <>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-100 dark:bg-gray-700" : ""
                  } flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      selectedUser: user,
                      modals: { ...prev.modals, changePassword: true },
                    }))
                  }
                >
                  <PencilIcon className="mr-3 h-5 w-5" />
                  Change Password
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-100 dark:bg-gray-700" : ""
                  } flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400`}
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      selectedUser: user,
                      modals: { ...prev.modals, delete: true },
                    }))
                  }
                >
                  <TrashIcon className="mr-3 h-5 w-5" />
                  Delete User
                </button>
              )}
            </Menu.Item>
          </>
        )}
      </Menu.Items>
    </Menu>
  );
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Users"
          value={state.stats.total}
          icon={<Users className="h-10 w-10 text-blue-500" />}
          className="bg-gradient-to-br from-blue-50 to-blue-100"
        />
        <StatsCard
          title="Verified Users"
          value={state.stats.verified}
          icon={<UserCheck className="h-10 w-10 text-emerald-500" />}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100"
        />
        <StatsCard
          title="Unverified Users"
          value={state.stats.unverified}
          icon={<UserX className="h-10 w-10 text-rose-500" />}
          className="bg-gradient-to-br from-rose-50 to-rose-100"
        />
        <StatsCard
          title="New Users (30 days)"
          value={state.stats.newUsers}
          icon={<UserPlus className="h-10 w-10 text-purple-500" />}
          className="bg-gradient-to-br from-purple-50 to-purple-100"
        />
      </div>
      <DataTableOne
        data={state.data}
        columns={columns}
        loading={state.loading}
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
      {/* Modals */}
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
      ;
    </motion.div>
  );
};

export default UsersContent;
