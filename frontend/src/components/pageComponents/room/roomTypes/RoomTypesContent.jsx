import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  EyeIcon,
  Edit2Icon,
  Trash2Icon,
  MoreVerticalIcon,
  Bed,
  DollarSign,
  Users,
  AlertCircle,
  Clock,
  Package,
} from "lucide-react";
import { Menu } from "@headlessui/react";
import Avatar from "react-avatar";
import { toast } from "react-toastify";
import DataTableOne from "../../../reusables/table/DataTableOne";
import Modal from "../../../reusables/modal/Modal";
import StatsCard from "../../../reusables/cards/StatsCard";
import {
  getAllRoomTypes,
  deleteRoomType,
  toggleRoomType,
  updateRoomType,
  addTimeSlotToRoomType,
  removeTimeSlotFromRoomType,
  addExtraServiceToRoomType,
  removeExtraServiceFromRoomType,
  validateRoomTypeData,
} from "../../../../services/rooms/roomTypeServices";
import AddRoomTypesContent from "./AddRoomTypesContent";
import EditRoomTypesContent from "./EditRoomTypesContent";
import ViewRoomTypesContent from "./ViewRoomTypesContent";
import DeleteModal from "../../../reusables/modal/DeleteModal";
import LoadingSpinner from "../../../common/LoadingSpinner";
import "../../../../styles/common.css";
import ToggleModal from "../../../reusables/modal/toggleModal";

const RoomTypesContent = () => {
  // Initial state with comprehensive structure
  const [state, setState] = useState({
    data: [],
    loading: true,
    error: null,
    selectedRoomType: null,
    stats: {
      totalRoomTypes: 0,
      activeRoomTypes: 0,
      totalTimeSlots: 0,
      totalExtraServices: 0,
      averagePrice: 0,
      averageOccupancy: 0,
      totalImages: 0,
    },
    modals: {
      add: false,
      edit: false,
      view: false,
      delete: false,
      timeSlot: false,
      extraService: false,
      imagePreview: false,
    },
    filters: {
      search: "",
      isActive: null,
      priceRange: { min: 0, max: Infinity },
      occupancy: "all",
      serviceType: "all",
    },
    pagination: {
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
    },
  });

  // Fetch data with comprehensive error handling
  const fetchData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await getAllRoomTypes({
        ...state.filters,
        page: state.pagination.currentPage,
        limit: state.pagination.pageSize,
      });

      // Calculate comprehensive stats
      const stats = {
        totalRoomTypes: response.length,
        activeRoomTypes: response.filter((r) => r.isActive).length,
        totalTimeSlots: response.reduce(
          (sum, r) => sum + (r.timeSlotPricing?.length || 0),
          0
        ),
        totalExtraServices: response.reduce(
          (sum, r) => sum + (r.extraServices?.length || 0),
          0
        ),
        averagePrice:
          response.reduce((sum, r) => sum + r.basePrice, 0) / response.length ||
          0,
        averageOccupancy:
          response.reduce((sum, r) => sum + r.maxOccupancy, 0) /
            response.length || 0,
        totalImages: response.reduce(
          (sum, r) => sum + (r.images?.length || 0),
          0
        ),
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
      toast.error(`Failed to fetch room types: ${error.message}`);
    }
  }, [state.filters, state.pagination.currentPage, state.pagination.pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Modal handling with validation
  const handleModalToggle = useCallback((modalType, value, roomType = null) => {
    setState((prev) => ({
      ...prev,
      modals: { ...prev.modals, [modalType]: value },
      selectedRoomType: roomType || (value ? prev.selectedRoomType : null),
    }));
  }, []);

  // Delete handling with confirmation and cleanup
  const handleDelete = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      await deleteRoomType(state.selectedRoomType._id);
      toast.success("Room type deleted successfully");
      await fetchData();
      handleModalToggle("delete", false);
    } catch (error) {
      toast.error(`Failed to delete room type: ${error.message}`);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // Status toggle with optimistic update
const handleToggleStatus = async () => {
  try {
    await toggleRoomType(state.selectedRoomType._id);
    await fetchData();
    setState((prev) => ({
      ...prev,
      modals: { ...prev.modals, toggle: false },
      selectedRoomType: null,
    }));
    toast.success(
      `Room type ${
        state.selectedRoomType.isActive ? "deactivated" : "activated"
      } successfully`
    );
  } catch (error) {
    toast.error(error.message || "Failed to toggle room type status");
  }
};



  // Time slot management with validation
  const handleTimeSlotManagement = async (action, roomTypeId, data) => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      if (action === "add") {
        await addTimeSlotToRoomType(roomTypeId, data);
      } else {
        await removeTimeSlotFromRoomType(roomTypeId, data.timeSlotId);
      }
      await fetchData();
      toast.success(
        `Time slot ${action === "add" ? "added" : "removed"} successfully`
      );
    } catch (error) {
      toast.error(`Failed to ${action} time slot: ${error.message}`);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // Extra service management with validation
  const handleExtraServiceManagement = async (action, roomTypeId, data) => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      if (action === "add") {
        await addExtraServiceToRoomType(roomTypeId, data);
      } else {
        await removeExtraServiceFromRoomType(roomTypeId, data.serviceId);
      }
      await fetchData();
      toast.success(
        `Extra service ${action === "add" ? "added" : "removed"} successfully`
      );
    } catch (error) {
      toast.error(`Failed to ${action} extra service: ${error.message}`);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // Table columns definition with comprehensive data display
const columns = useMemo(
  () => [
    {
      accessorKey: "images",
      header: "Images",
      cell: ({ row }) => (
        <div className="flex -space-x-3 hover:space-x-1 transition-all duration-200">
          {row.original.images?.slice(0, 3).map((image, index) => (
            <div
              key={index}
              className="relative transform hover:scale-110 transition-transform duration-200"
            >
              <Avatar
                name={row.original.name}
                src={image.url}
                size="45"
                round
                className="border-2 border-white shadow-lg hover:shadow-xl"
              />
            </div>
          ))}
          {(row.original.images?.length || 0) > 3 && (
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-white shadow-lg transform hover:scale-110 transition-transform duration-200">
              <span className="text-xs font-bold text-white">
                +{row.original.images.length - 3}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Room Type",
      cell: ({ row }) => (
        <div className="flex flex-col space-y-1 py-2">
          <span className="text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {row.original.name}
          </span>
          <span className="text-sm text-gray-500 line-clamp-2 hover:line-clamp-none transition-all duration-200">
            {row.original.description}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "pricing",
      header: "Pricing",
      cell: ({ row }) => (
        <div className="flex flex-col space-y-1">
          <span className="text-lg font-bold text-gray-800">
            ${row.original.basePrice.toFixed(2)}
          </span>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full">
              Offer Price : {row.original.offerPrice}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 text-xs font-bold bg-blue-100 text-blue-700 rounded-full">
              Special Price : {row.original.specialPrice}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "services",
      header: "Services",
      cell: ({ row }) => (
        <div className="ex flex-col space-y-1">
          <div className="flex items-center px-3 py-1.5 bg-blue-50 rounded-lg">
            <Clock className="h-4 w-4 text-blue-600 mr-1.5" />
            <span className="text-xs font-medium text-blue-700">
              Total Time Slots : {row.original.timeSlotPricing?.length || 0}
            </span>
          </div>
          <div className="flex items-center px-3 py-1.5 bg-blue-50 rounded-lg">
            <Package className="h-4 w-4 text-purple-600 mr-1.5" />
            <span className="text-xs font-medium text-purple-700">
              Total Extra Services : {row.original.extraServices?.length || 0}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "maxOccupancy",
      header: "Max Capacity",
      cell: ({ row }) => (
        <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg w-fit">
          <Users className="h-5 w-5 text-gray-600 mr-2" />
          <span className="text-sm font-semibold text-gray-700">
            {row.original.maxOccupancy} guests
          </span>
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        return (
          <button
            onClick={() => {
              setState((prev) => ({
                ...prev,
                selectedRoomType: row.original,
                modals: { ...prev.modals, toggle: true },
              }));
            }}
            className={`
          group relative
          px-3 py-1.5 rounded-md
          border transition-all duration-300
          ${
            isActive
              ? "border-emerald-500 bg-emerald-50 hover:bg-emerald-100"
              : "border-rose-300 bg-rose-50 hover:bg-rose-100"
          }
        `}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-1.5 h-3 rounded-full ${
                  isActive ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />
              <span
                className={`font-medium text-xs tracking-wide ${
                  isActive ? "text-emerald-700" : "text-rose-700"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <span className="absolute -bottom-8 right-0 min-w-max px-2 py-1 text-xs font-medium text-white bg-gray-900/80 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Click to {isActive ? "deactivate" : "activate"}
            </span>
          </button>
        );
      },
    },
  ],
  []
);


  const renderRowActions = useCallback(
    (roomType) => (
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="p-2 hover:bg-gray-100 rounded-full">
          <MoreVerticalIcon className="h-5 w-5" />
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => handleModalToggle("view", true, roomType)}
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
                onClick={() => handleModalToggle("edit", true, roomType)}
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
                onClick={() => handleModalToggle("delete", true, roomType)}
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
          title="Total Room Types"
          value={state.stats.totalRoomTypes}
          icon={<Bed className="h-10 w-10 text-blue-500" />}
        />
        <StatsCard
          title="Active Room Types"
          value={state.stats.activeRoomTypes}
          icon={<AlertCircle className="h-10 w-10 text-green-500" />}
        />
        <StatsCard
          title="Average Price"
          value={`$${state.stats.averagePrice.toFixed(2)}`}
          icon={<DollarSign className="h-10 w-10 text-yellow-500" />}
        />
        <StatsCard
          title="Average Occupancy"
          value={state.stats.averageOccupancy.toFixed(1)}
          icon={<Users className="h-10 w-10 text-purple-500" />}
        />
      </div>

      <DataTableOne
        data={state.data}
        columns={columns}
        loading={state.loading}
        onRefresh={fetchData}
        renderRowActions={renderRowActions}
        onAddNew={() => handleModalToggle("add", true)}
        addNewText="Add Room Type"
        onTitle="Room Types"
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
            title="Add New Room Type"
            size="xl"
          >
            <AddRoomTypesContent
              onClose={() => handleModalToggle("add", false)}
              onSuccess={() => {
                handleModalToggle("add", false);
                fetchData(); // This will refresh the table data
              }}
            />
          </Modal>
        )}

        {state.modals.edit && state.selectedRoomType && (
          <Modal
            isOpen={state.modals.edit}
            onClose={() => handleModalToggle("edit", false)}
            title="Edit Room Type"
            size="xl"
          >
            <EditRoomTypesContent
              roomType={state.selectedRoomType}
              onClose={() => handleModalToggle("edit", false)}
              onRoomTypeUpdated={() => {
                fetchData();
                handleModalToggle("edit", false);
              }}
            />
          </Modal>
        )}

        {state.modals.view && state.selectedRoomType && (
          <Modal
            isOpen={state.modals.view}
            onClose={() => handleModalToggle("view", false)}
            title="Room Type Details"
            size="xl"
          >
            <ViewRoomTypesContent
              roomType={state.selectedRoomType}
              onClose={() => handleModalToggle("view", false)}
              onEdit={(roomType) => {
                handleModalToggle("view", false);
                handleModalToggle("edit", true, roomType);
              }}
            />
          </Modal>
        )}
        {state.modals.delete && (
          <DeleteModal
            isOpen={state.modals.delete}
            onClose={() => handleModalToggle("delete", false)}
            onConfirm={handleDelete}
            title="Delete Room Type"
            message={`Are you sure you want to delete ${state.selectedRoomType?.name}? This action cannot be undone and will remove all associated time slots and extra services.`}
          />
        )}
        {state.modals.toggle && (
          <ToggleModal
            isActive={state.selectedRoomType?.isActive}
            onCancel={() =>
              setState((prev) => ({
                ...prev,
                modals: { ...prev.modals, toggle: false },
                selectedRoomType: null,
              }))
            }
            onConfirm={handleToggleStatus}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RoomTypesContent;
