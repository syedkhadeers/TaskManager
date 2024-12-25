import express from "express";
import { admin, manager, protect, superadmin } from "../middleware/authMiddleware.js";
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
router.post("/extraservice/create", protect, manager, admin, superadmin, createExtraService);
router.patch("/extraservice/:id", protect, manager, admin, superadmin, updateExtraService);
router.delete("/extraservice/:id", protect, manager, admin, superadmin, deleteExtraService);
router.get("/extraservices", protect, manager, admin, superadmin, getExtraServices);
router.get("/extraservice/:id", protect, manager, admin, superadmin, getExtraService);

// Time Slot Routes
router.post("/timeslot/create", protect, manager, admin, superadmin, createTimeSlot);
router.get("/timeslots", protect, manager, admin, superadmin, getTimeSlots);
router.get("/timeslot/:id", protect, manager, admin, superadmin, getTimeSlot);
router.patch("/timeslot/:id", protect, manager, admin, superadmin, updateTimeSlot);
router.delete("/timeslot/:id", protect, manager, admin, superadmin, deleteTimeSlot);

// Room Type Routes
router.post("/roomtype/create", protect, manager, admin, superadmin, uploadRoomTypeImages.array("images", 10), createRoomType);
router.get("/roomtypes", protect, manager, admin, superadmin, getRoomTypes);
router.get("/roomtype/:id", protect, manager, admin, superadmin, getRoomType);
router.patch("/roomtype/:id", protect, manager, admin, superadmin, uploadRoomTypeImages.array("images", 10), updateRoomType);
router.delete("/roomtype/:id", protect, manager, admin, superadmin, deleteRoomType);

// Room Type Extra Service Management Routes
router.post("/roomtype/:id/extraservice", protect, manager, admin, superadmin, addExtraService);
router.delete("/roomtype/:id/extraservice/:extraServiceId", protect, manager, admin, superadmin, removeExtraService);

// Room Type Time Slot Management Routes
router.post("/roomtype/:id/timeslot", protect, manager, admin, superadmin, addTimeSlot);
router.delete("/roomtype/:id/timeslot/:timeSlotId", protect, manager, admin, superadmin, removeTimeSlot);

// Room Routes
router.post("/room/create", protect, manager, admin, superadmin, uploadRoomImages.array("images", 10), createRoom);
router.get("/rooms", protect, manager, admin, superadmin, getRooms);
router.get("/room/:id", protect, manager, admin, superadmin, getRoom);
router.patch("/room/:id", protect, manager, admin, superadmin, uploadRoomImages.array("images", 10), updateRoom);
router.delete("/room/:id", protect, manager, admin, superadmin, deleteRoom);

export default router;