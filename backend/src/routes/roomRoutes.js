import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createExtraService, deleteExtraService, getExtraService, getExtraServices, updateExtraService } from "../controllers/room/ExtraServiceController.js";
import { createTimeSlot, deleteTimeSlot, getTimeSlot, getTimeSlots, updateTimeSlot } from "../controllers/room/TimeSlotController.js";
import { createRoomType, deleteRoomType, getRoomType, getRoomTypes, updateRoomType } from "../controllers/room/RoomTypeController.js";
import { uploadRoomImages } from "../middleware/uploadMiddleware.js";
import { createRoom, deleteRoom, getRoom, getRooms, updateRoom } from "../controllers/room/RoomController.js";

const router = express.Router();

router.post("/extraservice/create", protect, createExtraService);
router.get("/extraservices", protect, getExtraServices);
router.get("/extraservice/:id", protect, getExtraService);
router.patch("/extraservice/:id", protect, updateExtraService);
router.delete("/extraservice/:id", protect, deleteExtraService);

router.post("/timeslot/create", protect, createTimeSlot);
router.get("/timeslots", protect, getTimeSlots);
router.get("/timeslot/:id", protect, getTimeSlot);
router.patch("/timeslot/:id", protect, updateTimeSlot);
router.delete("/timeslot/:id", protect, deleteTimeSlot);

router.post("/roomtype/create", protect, createRoomType);
router.get("/roomtypes", protect, getRoomTypes);
router.get("/roomtype/:id", protect, getRoomType);
router.patch("/roomtype/:id", protect, updateRoomType);
router.delete("/roomtype/:id", protect, deleteRoomType);

router.post("/room/create", protect, uploadRoomImages.array("images", 10), createRoom);
router.get("/rooms", protect, getRooms);
router.get("/room/:id", protect, getRoom);
router.patch("/room/:id", protect, uploadRoomImages.array("images", 10), updateRoom);
router.delete("/room/:id", protect, deleteRoom);



export default router;
