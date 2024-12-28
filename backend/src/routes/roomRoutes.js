import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { uploadRoomTypeImages, uploadRoomImages } from "../middleware/uploadMiddleware.js";

import { addExtraService,  getExtraServiceById,  updateExtraServiceById,   deleteExtraServiceById,  getAllExtraServices,  toggleExtraService } from "../controllers/room/extraServiceController.js";
import { addTimeSlot,  getTimeSlotById,  updateTimeSlotById,  deleteTimeSlotById,   getAllTimeSlots,  toggleTimeSlot } from "../controllers/room/timeSlotController.js";
import { addRoomType,  updateRoomType,  getRoomType,  getAllRoomTypes,  deleteRoomType,  addTimeSlot as addRoomTypeTimeSlot,  removeTimeSlot,  addExtraService as addRoomTypeExtraService,  removeExtraService,  toggleRoomType } from "../controllers/room/roomTypeController.js";
import { addRoom,  updateRoom,  getRoom,  getAllRooms,  deleteRoom,  toggleRoom,  updateRoomStatus } from "../controllers/room/roomController.js";

const router = express.Router();

// Extra Service Routes
router.post("/rooms/extra-services", protect, authorize("admin,manager,creator"), addExtraService);
router.get("/rooms/extra-services", protect, getAllExtraServices);
router.get("/rooms/extra-services/:id", protect, getExtraServiceById);
router.patch("/rooms/extra-services/:id", protect, authorize("admin,manager,creator"), updateExtraServiceById);
router.delete("/rooms/extra-services/:id", protect, authorize("admin,manager,creator"), deleteExtraServiceById);
router.patch("/rooms/extra-services/:id/toggle", protect, authorize("admin,manager,creator"), toggleExtraService);

// Time Slot Routes
router.post("/rooms/time-slots", protect, authorize("admin,manager,creator"), addTimeSlot);
router.get("/rooms/time-slots", protect, getAllTimeSlots);
router.get("/rooms/time-slots/:id", protect, getTimeSlotById);
router.patch("/rooms/time-slots/:id", protect, authorize("admin,manager,creator"), updateTimeSlotById);
router.delete("/rooms/time-slots/:id", protect, authorize("admin,manager,creator"), deleteTimeSlotById);
router.patch("/rooms/time-slots/:id/toggle", protect, authorize("admin,manager,creator"), toggleTimeSlot);

// Room Type Routes
router.post("/rooms/room-types", protect, authorize("admin,manager,creator"), uploadRoomTypeImages.array("images", 10), addRoomType);
router.get("/rooms/room-types", protect, getAllRoomTypes);
router.get("/rooms/room-types/:id", protect, getRoomType);
router.patch("/rooms/room-types/:id", protect, authorize("admin,manager,creator"), uploadRoomTypeImages.array("images", 10), updateRoomType);
router.delete("/rooms/room-types/:id", protect, authorize("admin,manager,creator"), deleteRoomType);
router.patch("/rooms/room-types/:id/toggle", protect, authorize("admin,manager,creator"), toggleRoomType);

// Room Type Service Management
router.post("/rooms/room-types/:id/time-slots", protect, authorize("admin,manager,creator"), addRoomTypeTimeSlot);
router.delete("/rooms/room-types/:id/time-slots/:timeSlotId", protect, authorize("admin,manager,creator"), removeTimeSlot);
router.post("/rooms/room-types/:id/extra-services", protect, authorize("admin,manager,creator"), addRoomTypeExtraService);
router.delete("/rooms/room-types/:id/extra-services/:serviceId", protect, authorize("admin,manager,creator"), removeExtraService);

// Room Routes
router.post("/rooms", protect, authorize("admin,manager,creator"), uploadRoomImages.array("images", 10), addRoom);
router.get("/rooms", protect, getAllRooms);
router.get("/rooms/:id", protect, getRoom);
router.patch("/rooms/:id", protect, authorize("admin,manager,creator"), uploadRoomImages.array("images", 10), updateRoom);
router.delete("/rooms/:id", protect, authorize("admin,manager,creator"), deleteRoom);
router.patch("/rooms/:id/toggle", protect, authorize("admin,manager,creator"), toggleRoom);
router.patch("/rooms/:id/status", protect, authorize("admin,manager,creator"), updateRoomStatus);

export default router;
