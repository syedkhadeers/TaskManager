import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle,
  XCircle,
  Percent,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../../../hooks/useAuth";
import DataTableOne from "../../../reusables/table/DataTableOne";
import Modal from "../../../reusables/modal/Modal";
import StatsCard from "../../../reusables/cards/StatsCard";
import {
  getAllTimeSlots,
  deleteTimeSlot,
  toggleTimeSlot,
} from "../../../../services/rooms/timeSlotServices";
import AddTimeSlotsContent from "./AddTimeSlotsContent";
import EditTimeSlotsContent from "./EditTimeSlotsContent";
import ViewTimeSlotsContent from "./ViewTimeSlotsContent";
import DeleteModal from "../../../reusables/modal/DeleteModal";
import ToggleModal from "../../../reusables/modal/toggleModal";

const TimeSlotsContent = () => {
  const { user: authUser } = useAuth();

  const [state, setState] = useState({
    data: [],
    loading: true,
    selectedTimeSlot: null,
    stats: {
      total: 0,
      active: 0,
      inactive: 0,
      avgMultiplier: 0,
    },
    modals: {
      add: false,
      edit: false,
      view: false,
      delete: false,
      toggle: false,
    },
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Time Slot Name",
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
        header: "Checkout Day",
        cell: ({ row }) => (
          <span className="capitalize">
            {row.original.sameDay === "SameDay" ? "Same Day" : "Next Day"}
          </span>
        ),
      },
      {
        accessorKey: "priceMultiplier",
        header: "Price Multiplier",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.priceMultiplier}x</span>
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
                console.log(
                  "1. Status button clicked for timeSlot:",
                  row.original
                );
                setState((prev) => ({
                  ...prev,
                  selectedTimeSlot: row.original,
                  modals: { ...prev.modals, toggle: true },
                }));
              }}
              className={`
                group relative px-3 py-1.5 rounded-md border transition-all duration-300
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

  const fetchTimeSlots = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await getAllTimeSlots();
      console.log("2. Response from getAllTimeSlots:", response);
      if (response?.timeSlots) {
        const stats = {
          total: response.timeSlots.length,
          active: response.timeSlots.filter((slot) => slot.isActive).length,
          inactive: response.timeSlots.filter((slot) => !slot.isActive).length,
          avgMultiplier:
            response.timeSlots.length > 0
              ? (
                  response.timeSlots.reduce(
                    (sum, slot) => sum + slot.priceMultiplier,
                    0
                  ) / response.timeSlots.length
                ).toFixed(2)
              : 0,
        };
        setState((prev) => ({
          ...prev,
          data: response.timeSlots,
          stats,
          loading: false,
        }));
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch time slots");
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTimeSlot(state.selectedTimeSlot.id);
      toast.success("Time slot deleted successfully");
      fetchTimeSlots();
      setState((prev) => ({
        ...prev,
        modals: { ...prev.modals, delete: false },
        selectedTimeSlot: null,
      }));
    } catch (error) {
      toast.error(error.message || "Failed to delete time slot");
    }
  };

  // In the handleToggleStatus function
  const handleToggleStatus = async () => {
    try {
      console.log(
        "2. Starting toggle operation for timeSlot:",
        state.selectedTimeSlot
      );
      console.log(
        "3. Calling toggleTimeSlot with ID:",
        state.selectedTimeSlot.id
      );

      await toggleTimeSlot(state.selectedTimeSlot.id);
      console.log("4. Toggle API call successful");

      await fetchTimeSlots();
      console.log("5. Time slots refreshed after toggle");

      setState((prev) => {
        console.log("6. Updating component state after toggle");
        return {
          ...prev,
          modals: { ...prev.modals, toggle: false },
          selectedTimeSlot: null,
        };
      });

      toast.success(
        `Time slot ${
          state.selectedTimeSlot.isActive ? "deactivated" : "activated"
        } successfully`
      );
      console.log("7. Toggle operation completed successfully");
    } catch (error) {
      console.error("Toggle operation failed:", error);
      toast.error(error.message || "Failed to toggle time slot status");
    }
  };

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const renderRowActions = (timeSlot) => (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={() =>
          setState((prev) => ({
            ...prev,
            selectedTimeSlot: timeSlot,
            modals: { ...prev.modals, view: true },
          }))
        }
        className="group relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        <EyeIcon className="h-5 w-5 text-gray-600 dark:text-gray-200 group-hover:text-gray-700 dark:group-hover:text-white transition-colors" />
        <span className="absolute -bottom-8 right-0 min-w-max px-2 py-1 text-xs font-medium text-white bg-gray-900/80 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          View Details
        </span>
      </button>

      {authUser?.role !== "viewer" && (
        <>
          <button
            onClick={() =>
              setState((prev) => ({
                ...prev,
                selectedTimeSlot: timeSlot,
                modals: { ...prev.modals, edit: true },
              }))
            }
            className="group relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <PencilIcon className="h-5 w-5 text-gray-600 dark:text-gray-200 group-hover:text-gray-700 dark:group-hover:text-white transition-colors" />
            <span className="absolute -bottom-8 right-0 min-w-max px-2 py-1 text-xs font-medium text-white bg-gray-900/80 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Edit Time Slot
            </span>
          </button>

          <button
            onClick={() =>
              setState((prev) => ({
                ...prev,
                selectedTimeSlot: timeSlot,
                modals: { ...prev.modals, delete: true },
              }))
            }
            className="group relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <TrashIcon className="h-5 w-5 text-red-500 group-hover:text-red-600 transition-colors" />
            <span className="absolute -bottom-8 right-0 min-w-max px-2 py-1 text-xs font-medium text-white bg-gray-900/80 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Delete Time Slot
            </span>
          </button>
        </>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Time Slots"
          value={state.stats.total}
          icon={<Clock className="h-10 w-10" />}
        />
        <StatsCard
          title="Active Time Slots"
          value={state.stats.active}
          icon={<CheckCircle className="h-10 w-10 text-green-500" />}
        />
        <StatsCard
          title="Inactive Time Slots"
          value={state.stats.inactive}
          icon={<XCircle className="h-10 w-10 text-red-500" />}
        />
        <StatsCard
          title="Average Multiplier"
          value={`${state.stats.avgMultiplier}x`}
          icon={<Percent className="h-10 w-10 text-purple-500" />}
        />
      </div>

      <DataTableOne
        data={state.data}
        columns={columns}
        loading={state.loading}
        onRefresh={fetchTimeSlots}
        renderRowActions={renderRowActions}
        onTitle="Time Slots Management"
        addNewText="Add Time Slot"
        onAddNew={
          authUser?.role !== "viewer"
            ? () =>
                setState((prev) => ({
                  ...prev,
                  modals: { ...prev.modals, add: true },
                }))
            : undefined
        }
      />

      <AnimatePresence>
        {state.modals.add && (
          <Modal
            isOpen={state.modals.add}
            onClose={() =>
              setState((prev) => ({
                ...prev,
                modals: { ...prev.modals, add: false },
              }))
            }
            size="lg"
            title="Add New Time Slot"
          >
            <AddTimeSlotsContent
              onClose={() =>
                setState((prev) => ({
                  ...prev,
                  modals: { ...prev.modals, add: false },
                }))
              }
              onTimeSlotAdded={fetchTimeSlots}
            />
          </Modal>
        )}

        {state.modals.edit && state.selectedTimeSlot && (
          <Modal
            isOpen={state.modals.edit}
            onClose={() =>
              setState((prev) => ({
                ...prev,
                modals: { ...prev.modals, edit: false },
                selectedTimeSlot: null,
              }))
            }
            size="lg"
            title="Edit Time Slot"
          >
            <EditTimeSlotsContent
              timeSlot={state.selectedTimeSlot}
              onClose={() =>
                setState((prev) => ({
                  ...prev,
                  modals: { ...prev.modals, edit: false },
                  selectedTimeSlot: null,
                }))
              }
              onTimeSlotUpdated={fetchTimeSlots}
            />
          </Modal>
        )}

        {state.modals.view && state.selectedTimeSlot && (
          <Modal
            isOpen={state.modals.view}
            onClose={() =>
              setState((prev) => ({
                ...prev,
                modals: { ...prev.modals, view: false },
                selectedTimeSlot: null,
              }))
            }
            size="lg"
            title="Time Slot Details"
          >
            <ViewTimeSlotsContent
              timeSlot={state.selectedTimeSlot}
              onClose={() =>
                setState((prev) => ({
                  ...prev,
                  modals: { ...prev.modals, view: false },
                  selectedTimeSlot: null,
                }))
              }
              onEdit={
                authUser?.role !== "viewer"
                  ? () =>
                      setState((prev) => ({
                        ...prev,
                        modals: { ...prev.modals, view: false, edit: true },
                      }))
                  : undefined
              }
              onDelete={
                authUser?.role !== "viewer"
                  ? () =>
                      setState((prev) => ({
                        ...prev,
                        modals: { ...prev.modals, view: false, delete: true },
                      }))
                  : undefined
              }
              onToggleStatus={
                authUser?.role !== "viewer" ? handleToggleStatus : undefined
              }
            />
          </Modal>
        )}

        {state.modals.delete && (
          <DeleteModal
            onCancel={() =>
              setState((prev) => ({
                ...prev,
                modals: { ...prev.modals, delete: false },
                selectedTimeSlot: null,
              }))
            }
            onConfirm={handleDelete}
          />
        )}

        {state.modals.toggle && (
          <ToggleModal
            isActive={state.selectedTimeSlot?.isActive}
            onCancel={() =>
              setState((prev) => ({
                ...prev,
                modals: { ...prev.modals, toggle: false },
                selectedTimeSlot: null,
              }))
            }
            onConfirm={handleToggleStatus}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TimeSlotsContent;
