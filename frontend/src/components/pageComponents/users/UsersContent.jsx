// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   EyeIcon,
//   PencilIcon,
//   TrashIcon,
//   Users,
//   UserCheck,
//   UserX,
//   UserPlus,
//   MoreVerticalIcon,
// } from "lucide-react";
// import { Menu } from "@headlessui/react";
// import Avatar from "react-avatar";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../../hooks/useAuth";

// // Component imports
// import DataTableOne from "../../reusables/table/DataTableOne";
// import Modal from "../../reusables/modal/Modal";
// import StatsCard from "../../reusables/cards/StatsCard";
// import EditUsersContent from "./EditUsersContent";
// import AddUsersContent from "./AddUsersContent";
// import ViewUserContent from "./ViewUserContent";
// import DeleteModal from "../../reusables/modal/DeleteModal";
// import ChangeUserPasswordModal from "../../reusables/modal/ChangeUserPasswordModal";

// // Service imports
// import { getAllUsers, deleteUser } from "../../../services/user/userServices";
// import { getCurrentUser } from "../../../services/auth/authServices";

// const UsersContent = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [currentUser, setCurrentUser] = useState(null);

//     useEffect(() => {
//       if (!user) {
//         navigate("/login");
//       }
//     }, [user, navigate]);

//   const [state, setState] = useState({
//     data: [],
//     loading: false,
//     pagination: {
//       pageSize: 10,
//       currentPage: 1,
//       totalPages: 0,
//       totalRecords: 0,
//     },
//     modals: {
//       add: false,
//       edit: false,
//       view: false,
//       delete: false,
//       changePassword: false,
//     },
//     selectedUser: null,
//   });

// const fetchUsers = useCallback(async () => {
//   setState((prev) => ({ ...prev, loading: true }));
//   try {
//     const token = localStorage.getItem("token"); // Get token from storage
//     console.log("Token:", token);
//     const response = await getAllUsers({
//       page: state.pagination.currentPage,
//       limit: state.pagination.pageSize,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     setState((prev) => ({
//       ...prev,
//       loading: false,
//       data: response.users,
//       pagination: {
//         ...prev.pagination,
//         totalPages: response.totalPages,
//         totalRecords: response.total,
//       },
//     }));
//   } catch (error) {
//     if (error.response?.status === 401) {
//       // Handle unauthorized access
//       navigate("/login"); // Redirect to login page
//     }
//     setState((prev) => ({ ...prev, loading: false }));
//     toast.error("Failed to fetch users");
//   }
// }, [state.pagination.currentPage, state.pagination.pageSize, navigate]);

//   useEffect(() => {
//     fetchUsers();
//   }, [fetchUsers]);

//   useEffect(() => {
//     const loadCurrentUser = async () => {
//       try {
//         const response = await getCurrentUser();
//         setCurrentUser(response.data);
//       } catch (error) {
//         toast.error("Failed to load user data");
//       }
//     };
//     loadCurrentUser();
//   }, []);

//   const displayUser = currentUser || user;

//   console.log("Current User:", currentUser);
//   console.log("User:", user);
//   console.log("Display User:", displayUser);

//   const stats = useMemo(
//     () => ({
//       total: state.data.length,
//       verified: state.data.filter((user) => user.isVerified).length,
//       unverified: state.data.filter((user) => !user.isVerified).length,
//       newUsers: state.data.filter((user) => {
//         const thirtyDaysAgo = new Date();
//         thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
//         return new Date(user.createdAt) > thirtyDaysAgo;
//       }).length,
//     }),
//     [state.data]
//   );

//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "photo.url",
//         header: "Photo",
//         cell: ({ row }) => (
//           <Avatar
//             name={`${row.original.firstName} ${row.original.lastName}`}
//             src={row.original.photo?.url}
//             size="40"
//             round
//           />
//         ),
//       },
//       {
//         accessorKey: "fullName",
//         header: "Name",
//       },
//       {
//         accessorKey: "email",
//         header: "Email",
//       },
//       {
//         accessorKey: "department",
//         header: "Department",
//       },
//       {
//         accessorKey: "role",
//         header: "Role",
//         cell: ({ getValue }) => (
//           <span className="px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
//             {getValue()}
//           </span>
//         ),
//       },
//       {
//         accessorKey: "isVerified",
//         header: "Status",
//         cell: ({ getValue }) => (
//           <span
//             className={`px-3 py-1 text-xs font-medium rounded-full ${
//               getValue()
//                 ? "bg-green-100 text-green-800"
//                 : "bg-red-100 text-red-800"
//             }`}
//           >
//             {getValue() ? "Verified" : "Not Verified"}
//           </span>
//         ),
//       },
//     ],
//     []
//   );

//   const handleDelete = async () => {
//     if (!state.selectedUser?._id) return;

//     try {
//       await deleteUser(state.selectedUser._id);
//       toast.success("User deleted successfully");
//       setState((prev) => ({
//         ...prev,
//         modals: { ...prev.modals, delete: false },
//         selectedUser: null,
//       }));
//       fetchUsers();
//     } catch (error) {
//       toast.error("Failed to delete user");
//     }
//   };

//   const renderRowActions = useCallback(
//     (user, rowIndex, totalRows) => {
//       if (!displayUser?._id || !user?._id) return null;

//       const isCurrentUser = displayUser._id === user._id;
//       if (isCurrentUser) {
//         return (
//           <Menu as="div" className="relative inline-block text-left">
//             <Menu.Button className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-500">
//               <MoreVerticalIcon size={16} />
//             </Menu.Button>
//             <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
//               <Menu.Item>
//                 {({ active }) => (
//                   <button
//                     onClick={() => navigate("/me")}
//                     className={`${
//                       active ? "bg-gray-100" : ""
//                     } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
//                   >
//                     <EyeIcon className="mr-3 h-4 w-4" />
//                     My Profile
//                   </button>
//                 )}
//               </Menu.Item>
//             </Menu.Items>
//           </Menu>
//         );
//       }

//       return (
//         <Menu as="div" className="relative inline-block text-left">
//           <Menu.Button className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-500">
//             <MoreVerticalIcon size={16} />
//           </Menu.Button>

//           <Menu.Items
//             className={`absolute ${
//               rowIndex >= totalRows - 2
//                 ? "bottom-full right-0 mb-2" // Position above for last two rows
//                 : "top-full right-0 mt-2" // Default positioning
//             } w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
//           >
//             <div className="py-1">
//               <Menu.Item>
//                 {({ active }) => (
//                   <button
//                     onClick={() => handleAction("view")}
//                     className={`${
//                       active ? "bg-gray-100 dark:bg-gray-700" : ""
//                     } flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
//                   >
//                     <EyeIcon className="mr-3 h-4 w-4" />
//                     View
//                   </button>
//                 )}
//               </Menu.Item>

//               <Menu.Item>
//                 {({ active }) => (
//                   <button
//                     onClick={() => handleAction("edit")}
//                     className={`${
//                       active ? "bg-gray-100 dark:bg-gray-700" : ""
//                     } flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
//                   >
//                     <PencilIcon className="mr-3 h-4 w-4" />
//                     Edit
//                   </button>
//                 )}
//               </Menu.Item>

//               <Menu.Item>
//                 {({ active }) => (
//                   <button
//                     onClick={() => handleAction("delete")}
//                     className={`${
//                       active ? "bg-gray-100 dark:bg-gray-700" : ""
//                     } flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
//                   >
//                     <TrashIcon className="mr-3 h-4 w-4" />
//                     Delete
//                   </button>
//                 )}
//               </Menu.Item>
//             </div>
//           </Menu.Items>
//         </Menu>
//       );
//     },
//     [displayUser, navigate]
//   );

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="space-y-8"
//     >
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatsCard
//           title="Total Users"
//           value={stats.total}
//           icon={<Users className="h-10 w-10" />}
//         />
//         <StatsCard
//           title="Verified Users"
//           value={stats.verified}
//           icon={<UserCheck className="h-10 w-10 text-green-500" />}
//         />
//         <StatsCard
//           title="Unverified Users"
//           value={stats.unverified}
//           icon={<UserX className="h-10 w-10 text-red-500" />}
//         />
//         <StatsCard
//           title="New Users (30 days)"
//           value={stats.newUsers}
//           icon={<UserPlus className="h-10 w-10 text-purple-500" />}
//         />
//       </div>

//       {/* Data Table */}
//       <DataTableOne
//         data={state.data}
//         columns={columns}
//         loading={state.loading}
//         pagination={state.pagination}
//         onPaginationChange={(newPagination) =>
//           setState((prev) => ({ ...prev, pagination: newPagination }))
//         }
//         onRefresh={fetchUsers}
//         renderRowActions={renderRowActions}
//         onTitle="Users' Records"
//         addNewText="Add User"
//         onAddNew={() =>
//           setState((prev) => ({
//             ...prev,
//             modals: { ...prev.modals, add: true },
//           }))
//         }
//       />

//       {/* Modals */}
//       <AnimatePresence>
//         {/* Add User Modal */}
//         {state.modals.add && (
//           <Modal
//             isOpen={state.modals.add}
//             onClose={() =>
//               setState((prev) => ({
//                 ...prev,
//                 modals: { ...prev.modals, add: false },
//               }))
//             }
//             title="Add New User"
//             size="lg"
//           >
//             <AddUsersContent
//               onClose={() =>
//                 setState((prev) => ({
//                   ...prev,
//                   modals: { ...prev.modals, add: false },
//                 }))
//               }
//               onUserAdded={fetchUsers}
//             />
//           </Modal>
//         )}

//         {/* Edit User Modal */}
//         {state.modals.edit && state.selectedUser && (
//           <Modal
//             isOpen={state.modals.edit}
//             onClose={() =>
//               setState((prev) => ({
//                 ...prev,
//                 modals: { ...prev.modals, edit: false },
//                 selectedUser: null,
//               }))
//             }
//             title="Edit User"
//             size="lg"
//           >
//             <EditUsersContent
//               user={state.selectedUser}
//               onClose={() =>
//                 setState((prev) => ({
//                   ...prev,
//                   modals: { ...prev.modals, edit: false },
//                   selectedUser: null,
//                 }))
//               }
//               onUserUpdated={fetchUsers}
//             />
//           </Modal>
//         )}

//         {/* View User Modal */}
//         {state.modals.view && state.selectedUser && (
//           <Modal
//             isOpen={state.modals.view}
//             onClose={() =>
//               setState((prev) => ({
//                 ...prev,
//                 modals: { ...prev.modals, view: false },
//                 selectedUser: null,
//               }))
//             }
//             title="User Details"
//             size="xl"
//           >
//             <ViewUserContent
//               user={state.selectedUser}
//               onClose={() =>
//                 setState((prev) => ({
//                   ...prev,
//                   modals: { ...prev.modals, view: false },
//                   selectedUser: null,
//                 }))
//               }
//               onEdit={(user) => {
//                 setState((prev) => ({
//                   ...prev,
//                   modals: { ...prev.modals, view: false, edit: true },
//                   selectedUser: user,
//                 }));
//               }}
//               onDelete={(user) => {
//                 setState((prev) => ({
//                   ...prev,
//                   modals: { ...prev.modals, view: false, delete: true },
//                   selectedUser: user,
//                 }));
//               }}
//               onRefresh={fetchUsers}
//             />
//           </Modal>
//         )}

//         {/* Delete Confirmation Modal */}
//         {state.modals.delete && (
//           <DeleteModal
//             onCancel={() =>
//               setState((prev) => ({
//                 ...prev,
//                 modals: { ...prev.modals, delete: false },
//                 selectedUser: null,
//               }))
//             }
//             onConfirm={handleDelete}
//           />
//         )}

//         {/* Change Password Modal */}
//         {state.modals.changePassword && (
//           <ChangeUserPasswordModal
//             onClose={() =>
//               setState((prev) => ({
//                 ...prev,
//                 modals: { ...prev.modals, changePassword: false },
//                 selectedUser: null,
//               }))
//             }
//             userId={state.selectedUser?._id}
//           />
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// export default UsersContent;
import React from "react";

const UsersContent = () => {
  return <div>UsersContent</div>;
};

export default UsersContent;
