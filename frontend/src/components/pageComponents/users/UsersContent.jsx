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

  const columns = useMemo(
    () => [
      {
        accessorKey: "photo",
        header: "Photo",
        cell: ({ row }) => (
          <Avatar
            name={row.original.fullName}
            src={row.original.photo?.url}
            size={40}
            round
          />
        ),
        export: "no",
      },
      {
        accessorKey: "fullName",
        header: "Full Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "role",
        header: "Role",
      },
      {
        accessorKey: "isVerified",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              row.original.isVerified
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.original.isVerified ? "Verified" : "Unverified"}
          </span>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={state.stats.total}
          icon={<Users className="h-10 w-10" />}
        />
        <StatsCard
          title="Verified Users"
          value={state.stats.verified}
          icon={<UserCheck className="h-10 w-10 text-green-500" />}
        />
        <StatsCard
          title="Unverified Users"
          value={state.stats.unverified}
          icon={<UserX className="h-10 w-10 text-red-500" />}
        />
        <StatsCard
          title="New Users (30 days)"
          value={state.stats.newUsers}
          icon={<UserPlus className="h-10 w-10 text-purple-500" />}
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
