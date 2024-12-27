import express from "express";
import { 
    loggedInUsersOnly, managersOnly, adminsOnly 
  } from "../middleware/authMiddleware.js";
import { 
    createExtraService, deleteExtraServiceById, getExtraServiceById, getExtraServices, updateExtraServiceById 
  } from "../controllers/room/extraServiceController.js";
import {   
    createTimeSlot, deleteTimeSlotById, getTimeSlotById, getTimeSlots, updateTimeSlotById 
  } from "../controllers/room/timeSlotController.js";
import { 
    createRoomType, deleteRoomTypeById, getRoomTypeById, getRoomTypes, updateRoomTypeById, manageTimeSlot, manageExtraService
  } from "../controllers/room/roomTypeController.js";
import { 
    uploadRoomImages, uploadRoomTypeImages 
  } from "../middleware/uploadMiddleware.js";
import { 
    createRoom, deleteRoomById, getRoomById, getRooms, updateRoomById 
  } from "../controllers/room/roomController.js";

const router = express.Router();

// Extra Service Routes
router.post("/extraservice/create", adminsOnly, createExtraService);
router.get("/extraservices", loggedInUsersOnly, getExtraServices);
router.get("/extraservice/:id", loggedInUsersOnly, getExtraServiceById);
router.patch("/extraservice/:id", managersOnly, updateExtraServiceById);
router.delete("/extraservice/:id", adminsOnly, deleteExtraServiceById);
router.patch("/extraservices/bulk", managersOnly, bulkUpdateExtraServices);

// Time Slot Routes
router.post("/timeslot/create", adminsOnly, createTimeSlot);
router.get("/timeslots", loggedInUsersOnly, getTimeSlots);
router.get("/timeslot/:id", loggedInUsersOnly, getTimeSlotById);
router.patch("/timeslot/:id", managersOnly, updateTimeSlotById);
router.delete("/timeslot/:id", adminsOnly, deleteTimeSlotById);

// Room Type Routes
router.post("/roomtype/create", adminsOnly, uploadRoomTypeImages.array("images", 10), createRoomType);
router.get("/roomtypes", loggedInUsersOnly, getRoomTypes);
router.get("/roomtype/:id", loggedInUsersOnly, getRoomTypeById);
router.patch("/roomtype/:id", managersOnly, uploadRoomTypeImages.array("images", 10), updateRoomTypeById);
router.delete("/roomtype/:id", adminsOnly, deleteRoomTypeById);

// Room Type Service Management Routes
router.patch("/roomtype/:id/timeslot/:timeSlotId", managersOnly, manageTimeSlot);
router.patch("/roomtype/:id/extraservice/:serviceId", managersOnly, manageExtraService);

// Room Routes
router.post("/room/create", adminsOnly, uploadRoomImages.array("images", 10), createRoom);
router.get("/rooms", loggedInUsersOnly, getRooms);
router.get("/room/:id", loggedInUsersOnly, getRoomById);
router.patch("/room/:id", managersOnly, uploadRoomImages.array("images", 10), updateRoomById);
router.delete("/room/:id", adminsOnly, deleteRoomById);

export default router;
