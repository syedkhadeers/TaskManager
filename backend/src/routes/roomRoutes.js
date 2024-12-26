import express from "express";
import { loggedInUsersOnly, managersOnly, adminsOnly } from "../middleware/authMiddleware.js";
import { 
  createExtraService, 
  deleteExtraService, 
  getExtraService, 
  getExtraServices, 
  updateExtraService 
} from "../controllers/room/extraServiceController.js";
import { 
  createTimeSlot, 
  deleteTimeSlot, 
  getTimeSlot, 
  getTimeSlots, 
  updateTimeSlot 
} from "../controllers/room/timeSlotController.js";
import { 
  createRoomType, 
  deleteRoomType, 
  getRoomType, 
  getRoomTypes, 
  updateRoomType,
  addExtraService,
  removeExtraService,
  addTimeSlot,
  removeTimeSlot 
} from "../controllers/room/roomTypeController.js";
import { 
  uploadRoomImages, 
  uploadRoomTypeImages 
} from "../middleware/uploadMiddleware.js";
import { 
  createRoom, 
  deleteRoom, 
  getRoom, 
  getRooms, 
  updateRoom 
} from "../controllers/room/roomController.js";

const router = express.Router();

// Extra Service Routes
router.post("/extraservice/create", adminsOnly, createExtraService);
router.get("/extraservices", loggedInUsersOnly, getExtraServices);
router.get("/extraservice/:id", loggedInUsersOnly, getExtraService);
router.patch("/extraservice/:id", managersOnly, updateExtraService);
router.delete("/extraservice/:id", adminsOnly, deleteExtraService);

// Time Slot Routes
router.post("/timeslot/create", adminsOnly, createTimeSlot);
router.get("/timeslots", loggedInUsersOnly, getTimeSlots);
router.get("/timeslot/:id", loggedInUsersOnly, getTimeSlot);
router.patch("/timeslot/:id", managersOnly, updateTimeSlot);
router.delete("/timeslot/:id", adminsOnly, deleteTimeSlot);

// Room Type Routes
router.post("/roomtype/create", adminsOnly, uploadRoomTypeImages.array("images", 10), createRoomType);
router.get("/roomtypes", loggedInUsersOnly, getRoomTypes);
router.get("/roomtype/:id", loggedInUsersOnly, getRoomType);
router.patch("/roomtype/:id", managersOnly, uploadRoomTypeImages.array("images", 10), updateRoomType);
router.delete("/roomtype/:id", adminsOnly, deleteRoomType);

// Room Type Service Management Routes
router.post("/roomtype/:id/extraservice", managersOnly, addExtraService);
router.delete("/roomtype/:id/extraservice/:extraServiceId", managersOnly, removeExtraService);
router.post("/roomtype/:id/timeslot", managersOnly, addTimeSlot);
router.delete("/roomtype/:id/timeslot/:timeSlotId", managersOnly, removeTimeSlot);

// Room Routes
router.post("/room/create", adminsOnly, uploadRoomImages.array("images", 10), createRoom);
router.get("/rooms", loggedInUsersOnly, getRooms);
router.get("/room/:id", loggedInUsersOnly, getRoom);
router.patch("/room/:id", managersOnly, uploadRoomImages.array("images", 10), updateRoom);
router.delete("/room/:id", adminsOnly, deleteRoom);

export default router;
