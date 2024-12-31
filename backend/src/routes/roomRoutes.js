import express from "express";
import {  authorize } from "../middleware/authMiddleware.js";
import { uploadRoomTypeImages, uploadRoomImages } from "../middleware/uploadMiddleware.js";

import { addExtraService,  getExtraServiceById,  updateExtraServiceById,   deleteExtraServiceById,  getAllExtraServices,  toggleExtraService } from "../controllers/room/extraServiceController.js";
import { addTimeSlot,  getTimeSlotById,  updateTimeSlotById,  deleteTimeSlotById,   getAllTimeSlots,  toggleTimeSlot } from "../controllers/room/timeSlotController.js";
import { addRoomType,  updateRoomType,  getRoomType,  getAllRoomTypes,  deleteRoomType,  addTimeSlot as addRoomTypeTimeSlot,  removeTimeSlot,  addExtraService as addRoomTypeExtraService,  removeExtraService,  toggleRoomType } from "../controllers/room/roomTypeController.js";
import { addRoom,  updateRoom,  getRoom,  getAllRooms,  deleteRoom,  toggleRoom,  updateRoomStatus } from "../controllers/room/roomController.js";

const router = express.Router();

// Extra Service Routes
router.post("/rooms/extra-services",   addExtraService);
router.get("/rooms/extra-services",  getAllExtraServices);
router.get("/rooms/extra-services/:id",  getExtraServiceById);
router.patch("/rooms/extra-services/:id",   updateExtraServiceById);
router.delete("/rooms/extra-services/:id",   deleteExtraServiceById);
router.patch("/rooms/extra-services/:id/toggle",   toggleExtraService);

// Time Slot Routes
router.post("/rooms/time-slots",   addTimeSlot);
router.get("/rooms/time-slots",  getAllTimeSlots);
router.get("/rooms/time-slots/:id",  getTimeSlotById);
router.patch("/rooms/time-slots/:id",   updateTimeSlotById);
router.delete("/rooms/time-slots/:id",   deleteTimeSlotById);
router.patch("/rooms/time-slots/:id/toggle",   toggleTimeSlot);

// Room Type Routes
router.post("/rooms/room-types",   uploadRoomTypeImages.array("images", 10), addRoomType);
router.get("/rooms/room-types",  getAllRoomTypes);
router.get("/rooms/room-types/:id",  getRoomType);
router.patch("/rooms/room-types/:id",   uploadRoomTypeImages.array("images", 10), updateRoomType);
router.delete("/rooms/room-types/:id",   deleteRoomType);
router.patch("/rooms/room-types/:id/toggle",   toggleRoomType);

// Room Type Service Management
router.post("/rooms/room-types/:id/time-slots",   addRoomTypeTimeSlot);
router.delete("/rooms/room-types/:id/time-slots/:timeSlotId",   removeTimeSlot);
router.post("/rooms/room-types/:id/extra-services",   addRoomTypeExtraService);
router.delete("/rooms/room-types/:id/extra-services/:serviceId",   removeExtraService);

// Room Routes
router.post("/rooms",   uploadRoomImages.array("images", 10), addRoom);
router.get("/rooms",  getAllRooms);
router.get("/rooms/:id",  getRoom);
router.patch("/rooms/:id",   uploadRoomImages.array("images", 10), updateRoom);
router.delete("/rooms/:id",   deleteRoom);
router.patch("/rooms/:id/toggle",   toggleRoom);
router.patch("/rooms/:id/status",   updateRoomStatus);

export default router;
