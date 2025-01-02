import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  EyeIcon,
  Edit2Icon,
  Trash2Icon,
  MoreVerticalIcon,
  DoorClosed,
  Building,
  Users,
  BedDouble,
  Clock,
  CheckSquare,
  CheckCircle,
  PenTool,
  Calendar,
  XCircle,
} from "lucide-react";
import { Menu } from "@headlessui/react";
import Avatar from "react-avatar";
import { toast } from "react-toastify";

import DataTableOne from "../../../reusables/table/DataTableOne";
import Modal from "../../../reusables/modal/Modal";
import StatsCard from "../../../reusables/cards/StatsCard";
import {
  getAllRooms,
  deleteRoom,
  toggleRoom,
  updateRoomStatus,
  validateRoomData,
} from "../../../../services/rooms/roomsServices";
import AddRoomsContent from "./AddRoomsContent";
import EditRoomsContent from "./EditRoomsContent";
import ViewRoomsContent from "./ViewRoomsContent";
import DeleteModal from "../../../reusables/modal/DeleteModal";
import LoadingSpinner from "../../../common/LoadingSpinner";
import ToggleModal from "../../../reusables/modal/toggleModal";
import "../../../../styles/common.css";

const RoomsContent = () => {
  const [state, setState] = useState({
    data: [],
    loading: true,
    error: null,
    selectedRoom: null,
    editingStatus: null,
    stats: {
      totalRooms: 0,
      availableRooms: 0,
      occupiedRooms: 0,
      maintenanceRooms: 0,
    },
    modals: {
      add: false,
      edit: false,
      view: false,
      delete: false,
      toggle: false,
    },
    filters: {
      search: "",
      status: "all",
      floor: "all",
      roomType: "all",
    },
    pagination: {
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
    },
  });

  const fetchData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await getAllRooms(state.filters);

      const stats = {
        totalRooms: response.length,
        availableRooms: response.filter((r) => r.status === "available").length,
        occupiedRooms: response.filter((r) => r.status === "occupied").length,
        maintenanceRooms: response.filter((r) => r.status === "maintenance")
          .length,
      };

      setState((prev) => ({
        ...prev,
        data: response,
        stats,
        loading: false,
        pagination: {
          ...prev.pagination,
          totalItems: response.length,
        },
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error.message,
        loading: false,
      }));
      toast.error(`Failed to fetch rooms: ${error.message}`);
    }
  }, [state.filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleModalToggle = useCallback((modalType, value, room = null) => {
    setState((prev) => ({
      ...prev,
      modals: { ...prev.modals, [modalType]: value },
      selectedRoom: room || (value ? prev.selectedRoom : null),
    }));
  }, []);

  const handleDelete = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      await deleteRoom(state.selectedRoom._id);
      toast.success("Room deleted successfully");
      await fetchData();
      handleModalToggle("delete", false);
    } catch (error) {
      toast.error(`Failed to delete room: ${error.message}`);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleToggleStatus = async () => {
    try {
      await toggleRoom(state.selectedRoom._id);
      await fetchData();
      setState((prev) => ({
        ...prev,
        modals: { ...prev.modals, toggle: false },
        selectedRoom: null,
      }));
      toast.success(
        `Room ${
          state.selectedRoom.isActive ? "deactivated" : "activated"
        } successfully`
      );
    } catch (error) {
      toast.error(error.message || "Failed to toggle room status");
    }
  };

  const handleStatusUpdate = async (roomId, newStatus) => {
    try {
      await updateRoomStatus(roomId, newStatus);
      setState((prev) => ({ ...prev, editingStatus: null }));
      await fetchData();
      toast.success("Room status updated successfully");
    } catch (error) {
      toast.error(`Failed to update status: ${error.message}`);
    }
  };

const columns = useMemo(
  () => [
    {
      accessorKey: "images",
      header: "Images",
      cell: ({ row }) => (
        <div className="flex -space-x-4 hover:space-x-2 transition-all duration-300">
          {row.original.images?.slice(0, 3).map((image, index) => (
            <div
              key={index}
              className="relative transform hover:scale-125 hover:z-10 transition-all duration-300"
            >
              <Avatar
                name={row.original.roomNumber}
                src={image.url}
                size="50"
                round
                className="border-3 border-white dark:border-gray-800 shadow-lg hover:shadow-2xl ring-2 ring-offset-2 ring-blue-500/30"
              />
            </div>
          ))}
          {(row.original.images?.length || 0) > 3 && (
            <div className="flex items-center justify-center w-[50px] h-[50px] rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 border-3 border-white dark:border-gray-800 shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300">
              <span className="text-sm font-bold text-white">
                +{row.original.images.length - 3}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "roomNumber",
      header: "Room Number",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3 px-4 py-2 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
          <DoorClosed className="h-6 w-6 text-blue-500 dark:text-blue-400" />
          <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {row.original.roomNumber}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "floor",
      header: "Floor",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3 px-4 py-2 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
          <Building className="h-6 w-6 text-purple-500 dark:text-purple-400" />
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {row.original.floor}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "roomType",
      header: "Room Type",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3 px-4 py-2 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
          <BedDouble className="h-6 w-6 text-pink-500 dark:text-pink-400" />
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {row.original.roomType?.name || "N/A"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const statusConfig = {
          available: {
            color: "emerald",
            icon: <CheckCircle className="h-4 w-4" />,
          },
          occupied: {
            color: "blue",
            icon: <Users className="h-4 w-4" />,
          },
          maintenance: {
            color: "amber",
            icon: <PenTool className="h-4 w-4" />,
          },
          reserved: {
            color: "purple",
            icon: <Calendar className="h-4 w-4" />,
          },
        };

        const config = statusConfig[row.original.status] || {
          color: "gray",
          icon: null,
        };

        return state.editingStatus === row.original._id ? (
          <select
            value={row.original.status}
            onChange={(e) =>
              handleStatusUpdate(row.original._id, e.target.value)
            }
            className={`px-4 py-2 rounded-xl border-2 border-${config.color}-500 bg-${config.color}-50 text-${config.color}-700 focus:ring-2 focus:ring-${config.color}-500/50 outline-none`}
            autoFocus
            onBlur={() =>
              setState((prev) => ({ ...prev, editingStatus: null }))
            }
          >
            {Object.keys(statusConfig).map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        ) : (
          <button
            onClick={() =>
              setState((prev) => ({
                ...prev,
                editingStatus: row.original._id,
              }))
            }
            className={`group relative px-4 py-2 rounded-xl border-2 border-${config.color}-500 bg-gradient-to-br from-${config.color}-50 to-${config.color}-100 hover:from-${config.color}-100 hover:to-${config.color}-200 transition-all duration-300`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full bg-${config.color}-500/20`}
              >
                {config.icon}
              </div>
              <span className={`font-medium text-sm text-${config.color}-700`}>
                {row.original.status.charAt(0).toUpperCase() +
                  row.original.status.slice(1)}
              </span>
              <Edit2Icon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </div>
          </button>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Active",
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        return (
          <button
            onClick={() => {
              setState((prev) => ({
                ...prev,
                selectedRoom: row.original,
                modals: { ...prev.modals, toggle: true },
              }));
            }}
            className={`group relative px-4 py-2 rounded-xl border-2 transition-all duration-300
              ${
                isActive
                  ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200"
                  : "border-rose-500 bg-gradient-to-br from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-200"
              }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full ${
                  isActive ? "bg-emerald-500/20" : "bg-rose-500/20"
                }`}
              >
                {isActive ? (
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-rose-600" />
                )}
              </div>
              <span
                className={`font-medium text-sm ${
                  isActive ? "text-emerald-700" : "text-rose-700"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </button>
        );
      },
    },
  ],
  [state.editingStatus]
);


  const renderRowActions = useCallback(
    (room) => (
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="p-2 hover:bg-gray-100 rounded-full">
          <MoreVerticalIcon className="h-5 w-5" />
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => handleModalToggle("view", true, room)}
                className={`${
                  active ? "bg-gray-100" : ""
                } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
              >
                <EyeIcon className="mr-3 h-5 w-5" />
                View Details
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => handleModalToggle("edit", true, room)}
                className={`${
                  active ? "bg-gray-100" : ""
                } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
              >
                <Edit2Icon className="mr-3 h-5 w-5" />
                Edit
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => handleModalToggle("delete", true, room)}
                className={`${
                  active ? "bg-gray-100" : ""
                } flex w-full items-center px-4 py-2 text-sm text-red-600`}
              >
                <Trash2Icon className="mr-3 h-5 w-5" />
                Delete
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    ),
    []
  );

  if (state.loading) return <LoadingSpinner />;
  if (state.error)
    return <div className="text-red-500">Error: {state.error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-6 py-8"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Rooms"
          value={state.stats.totalRooms}
          icon={<DoorClosed className="h-10 w-10 text-blue-500" />}
        />
        <StatsCard
          title="Available Rooms"
          value={state.stats.availableRooms}
          icon={<CheckSquare className="h-10 w-10 text-emerald-500" />}
        />
        <StatsCard
          title="Occupied Rooms"
          value={state.stats.occupiedRooms}
          icon={<Users className="h-10 w-10 text-blue-500" />}
        />
        <StatsCard
          title="Under Maintenance"
          value={state.stats.maintenanceRooms}
          icon={<Clock className="h-10 w-10 text-yellow-500" />}
        />
      </div>

      <DataTableOne
        data={state.data}
        columns={columns}
        loading={state.loading}
        onRefresh={fetchData}
        renderRowActions={renderRowActions}
        onAddNew={() => handleModalToggle("add", true)}
        addNewText="Add Room"
        onTitle="Rooms"
        pagination={state.pagination}
        onPaginationChange={(newPagination) =>
          setState((prev) => ({ ...prev, pagination: newPagination }))
        }
      />

      <AnimatePresence>
        {state.modals.add && (
          <Modal
            isOpen={state.modals.add}
            onClose={() => handleModalToggle("add", false)}
            title="Add New Room"
            size="xl"
          >
            <AddRoomsContent
              onClose={() => handleModalToggle("add", false)}
              onSuccess={() => {
                handleModalToggle("add", false);
                fetchData();
              }}
            />
          </Modal>
        )}

        {state.modals.edit && state.selectedRoom && (
          <Modal
            isOpen={state.modals.edit}
            onClose={() => handleModalToggle("edit", false)}
            title="Edit Room"
            size="xl"
          >
            <EditRoomsContent
              roomId={state.selectedRoom._id} // Change this line
              onClose={() => handleModalToggle("edit", false)}
              onSuccess={() => {
                fetchData();
                handleModalToggle("edit", false);
              }}
            />
          </Modal>
        )}

        {state.modals.view && state.selectedRoom && (
          <Modal
            isOpen={state.modals.view}
            onClose={() => handleModalToggle("view", false)}
            title="Room Details"
            size="xl"
          >
            <ViewRoomsContent
              room={state.selectedRoom}
              onClose={() => handleModalToggle("view", false)}
              onEdit={(room) => {
                handleModalToggle("view", false);
                handleModalToggle("edit", true, room);
              }}
            />
          </Modal>
        )}

        {state.modals.delete && (
          <DeleteModal
            isOpen={state.modals.delete}
            onClose={() => handleModalToggle("delete", false)}
            onConfirm={handleDelete}
            title="Delete Room"
            message={`Are you sure you want to delete Room ${state.selectedRoom?.roomNumber}? This action cannot be undone.`}
          />
        )}

        {state.modals.toggle && (
          <ToggleModal
            isActive={state.selectedRoom?.isActive}
            onCancel={() =>
              setState((prev) => ({
                ...prev,
                modals: { ...prev.modals, toggle: false },
                selectedRoom: null,
              }))
            }
            onConfirm={handleToggleStatus}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RoomsContent;

