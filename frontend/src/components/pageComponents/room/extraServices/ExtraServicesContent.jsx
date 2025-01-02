import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  CheckCircle,
  XCircle,
  DollarSign,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MoreVerticalIcon,
} from "lucide-react";
import { Menu } from "@headlessui/react";
import { toast } from "react-toastify";
import { useAuth } from "../../../../hooks/useAuth";
import DataTableOne from "../../../reusables/table/DataTableOne";
import Modal from "../../../reusables/modal/Modal";
import StatsCard from "../../../reusables/cards/StatsCard";
import {
  getAllExtraServices,
  deleteExtraService,
  toggleExtraService,
} from "../../../../services/rooms/extraServiceServices";
import AddExtraServicesContent from "./AddExtraServicesContent";
import EditExtraServicesContent from "./EditExtraServicesContent";
import ViewExtraServicesContent from "./ViewExtraServicesContent";
import DeleteModal from "../../../reusables/modal/DeleteModal";
import ToggleModal from "../../../reusables/modal/toggleModal";

const ExtraServicesContent = () => {
  const { user: authUser } = useAuth();

  const [state, setState] = useState({
    data: [],
    loading: true,
    selectedService: null,
    stats: {
      total: 0,
      active: 0,
      inactive: 0,
      avgPrice: 0,
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
        header: "Service Name",
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
        accessorKey: "basePrice",
        header: "Pricing",
        cell: ({ row }) => (
          <div className="flex flex-col space-y-1">
            <span className="text-lg font-bold text-gray-800">
              ${row.original.basePrice.toFixed(2)}
            </span>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full">
                Service Type: {row.original.serviceType || "Standard"}
              </span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "serviceType",
        header: "Additional Info",
        cell: ({ row }) => (
          <div className="flex flex-col space-y-1">
            <div className="flex items-center px-3 py-1.5 bg-blue-50 rounded-lg">
              <Package className="h-4 w-4 text-blue-600 mr-1.5" />
              <span className="text-xs font-medium text-blue-700">
                {row.original.additionalInfo || "No additional info"}
              </span>
            </div>
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
                  selectedService: row.original,
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
                  className={`
            w-1.5 h-3 rounded-full
            ${isActive ? "bg-emerald-500" : "bg-rose-500"}
          `}
                />
                <span
                  className={`
            font-medium text-xs tracking-wide
            ${isActive ? "text-emerald-700" : "text-rose-700"}
          `}
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

  const fetchServices = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await getAllExtraServices();
      if (response?.extraServices) {
        const stats = {
          total: response.extraServices.length,
          active: response.extraServices.filter((s) => s.isActive).length,
          inactive: response.extraServices.filter((s) => !s.isActive).length,
          avgPrice:
            response.extraServices.length > 0
              ? response.extraServices.reduce(
                  (sum, service) => sum + service.basePrice,
                  0
                ) / response.extraServices.length
              : 0,
        };
        setState((prev) => ({
          ...prev,
          data: response.extraServices,
          stats,
          loading: false,
        }));
      }
    } catch (error) {
      toast.error("Failed to fetch services");
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteExtraService(state.selectedService._id);
      toast.success("Service deleted successfully");
      fetchServices();
      setState((prev) => ({
        ...prev,
        modals: { ...prev.modals, delete: false },
        selectedService: null,
      }));
    } catch (error) {
      toast.error(error.message || "Failed to delete service");
    }
  };

  const handleToggleStatus = async (service) => {
    try {
      await toggleExtraService(service._id);
      toast.success(
        `Service ${service.isActive ? "deactivated" : "activated"} successfully`
      );
      fetchServices();
    } catch (error) {
      toast.error(error.message || "Failed to toggle service status");
    }
  };

  const renderRowActions = (service, rowIndex, totalRows) => (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={() =>
          setState((prev) => ({
            ...prev,
            selectedService: service,
            modals: { ...prev.modals, view: true },
          }))
        }
        className="group relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        <EyeIcon className="h-5 w-5 text-gray-600 dark:text-gray-200 group-hover:text-gray-700 dark:group-hover:text-white transition-colors" />
        <span className="absolute -bottom-8 right-0 min-w-max px-2 py-1 text-xs font-medium text-white bg-gray-900/80 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
          View Details
        </span>
      </button>

      <button
        onClick={() =>
          setState((prev) => ({
            ...prev,
            selectedService: service,
            modals: { ...prev.modals, edit: true },
          }))
        }
        className="group relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        <PencilIcon className="h-5 w-5 text-gray-600 dark:text-gray-200 group-hover:text-gray-700 dark:group-hover:text-white transition-colors" />
        <span className="absolute -bottom-8 right-0 min-w-max px-2 py-1 text-xs font-medium text-white bg-gray-900/80 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Edit Service
        </span>
      </button>

      <button
        onClick={() =>
          setState((prev) => ({
            ...prev,
            selectedService: service,
            modals: { ...prev.modals, delete: true },
          }))
        }
        className="group relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        <TrashIcon className="h-5 w-5 text-red-500 group-hover:text-red-600 transition-colors" />
        <span className="absolute -bottom-8 right-0 min-w-max px-2 py-1 text-xs font-medium text-white bg-gray-900/80 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Delete Service
        </span>
      </button>
    </div>
  );

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Services"
          value={state.stats.total}
          icon={<Package className="h-10 w-10" />}
        />
        <StatsCard
          title="Active Services"
          value={state.stats.active}
          icon={<CheckCircle className="h-10 w-10 text-green-500" />}
        />
        <StatsCard
          title="Inactive Services"
          value={state.stats.inactive}
          icon={<XCircle className="h-10 w-10 text-red-500" />}
        />
        <StatsCard
          title="Average Price"
          value={`$${state.stats.avgPrice.toFixed(2)}`}
          icon={<DollarSign className="h-10 w-10 text-purple-500" />}
        />
      </div>

      <DataTableOne
        data={state.data}
        columns={columns}
        loading={state.loading}
        onRefresh={fetchServices}
        renderRowActions={renderRowActions}
        onTitle="Extra Services Records"
        addNewText="Add Service"
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
            title="Add New Service"
            size="lg"
          >
            <AddExtraServicesContent
              onClose={() =>
                setState((prev) => ({
                  ...prev,
                  modals: { ...prev.modals, add: false },
                }))
              }
              onServiceAdded={fetchServices}
            />
          </Modal>
        )}

        {state.modals.edit && state.selectedService && (
          <Modal
            isOpen={state.modals.edit}
            onClose={() =>
              setState((prev) => ({
                ...prev,
                modals: { ...prev.modals, edit: false },
                selectedService: null,
              }))
            }
            title="Edit Service"
            size="lg"
          >
            <EditExtraServicesContent
              service={state.selectedService}
              onClose={() =>
                setState((prev) => ({
                  ...prev,
                  modals: { ...prev.modals, edit: false },
                  selectedService: null,
                }))
              }
              onServiceUpdated={fetchServices}
            />
          </Modal>
        )}

        {state.modals.view && state.selectedService && (
          <Modal
            isOpen={state.modals.view}
            onClose={() =>
              setState((prev) => ({
                ...prev,
                modals: { ...prev.modals, view: false },
                selectedService: null,
              }))
            }
            title="Service Details"
            size="lg"
          >
            <ViewExtraServicesContent
              service={state.selectedService}
              onClose={() =>
                setState((prev) => ({
                  ...prev,
                  modals: { ...prev.modals, view: false },
                  selectedService: null,
                }))
              }
              onEdit={
                authUser?.role !== "viewer"
                  ? (service) =>
                      setState((prev) => ({
                        ...prev,
                        modals: { ...prev.modals, view: false, edit: true },
                        selectedService: service,
                      }))
                  : undefined
              }
              onDelete={
                authUser?.role !== "viewer"
                  ? (service) =>
                      setState((prev) => ({
                        ...prev,
                        modals: { ...prev.modals, view: false, delete: true },
                        selectedService: service,
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
                selectedService: null,
              }))
            }
            onConfirm={handleDelete}
          />
        )}

        {state.modals.toggle && (
          <ToggleModal
            isActive={state.selectedService?.isActive}
            onCancel={() =>
              setState((prev) => ({
                ...prev,
                modals: { ...prev.modals, toggle: false },
                selectedService: null,
              }))
            }
            onConfirm={() => {
              handleToggleStatus(state.selectedService);
              setState((prev) => ({
                ...prev,
                modals: { ...prev.modals, toggle: false },
                selectedService: null,
              }));
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ExtraServicesContent;
