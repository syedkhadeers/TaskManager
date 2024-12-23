import express from "express";
import { protect } from "../middleware/authMiddleware.js";
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
} from "../controllers/room/TimeSlotController.js";
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
} from "../controllers/room/RoomTypeController.js";
import { 
  uploadRoomImages, 
  uploadServicePhoto 
} from "../middleware/uploadMiddleware.js";
import { 
  createRoom, 
  deleteRoom, 
  getRoom, 
  getRooms, 
  updateRoom 
} from "../controllers/room/RoomController.js";

const router = express.Router();

// Extra Service Routes
router.post("/extraservice/create", protect, uploadServicePhoto.single("image"), createExtraService);
router.patch("/extraservice/:id", protect, uploadServicePhoto.single("image"), updateExtraService);
router.delete("/extraservice/:id", protect, deleteExtraService);
router.get("/extraservices", protect, getExtraServices);
router.get("/extraservice/:id", protect, getExtraService);

// Time Slot Routes
router.post("/timeslot/create", protect, createTimeSlot);
router.get("/timeslots", protect, getTimeSlots);
router.get("/timeslot/:id", protect, getTimeSlot);
router.patch("/timeslot/:id", protect, updateTimeSlot);
router.delete("/timeslot/:id", protect, deleteTimeSlot);

// Room Type Routes
router.post("/roomtype/create", protect, uploadRoomImages.array("images", 10), createRoomType);
router.get("/roomtypes", protect, getRoomTypes);
router.get("/roomtype/:id", protect, getRoomType);
router.patch("/roomtype/:id", protect, uploadRoomImages.array("images", 10), updateRoomType);
router.delete("/roomtype/:id", protect, deleteRoomType);

// Room Type Extra Service Management Routes
router.post("/roomtype/:id/extraservice", protect, addExtraService);
router.delete("/roomtype/:id/extraservice/:extraServiceId", protect, removeExtraService);

// Room Type Time Slot Management Routes
router.post("/roomtype/:id/timeslot", protect, addTimeSlot);
router.delete("/roomtype/:id/timeslot/:timeSlotId", protect, removeTimeSlot);

// Room Routes
router.post("/room/create", protect, uploadRoomImages.array("images", 10), createRoom);
router.get("/rooms", protect, getRooms);
router.get("/room/:id", protect, getRoom);
router.patch("/room/:id", protect, uploadRoomImages.array("images", 10), updateRoom);
router.delete("/room/:id", protect, deleteRoom);

export default router;