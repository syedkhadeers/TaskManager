import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createExtraService, deleteExtraService, getExtraService, getExtraServices, updateExtraService } from "../controllers/room/ExtraServiceController.js";
import { createTimeSlot, deleteTimeSlot, getTimeSlot, getTimeSlots, updateTimeSlot } from "../controllers/room/TimeSlotController.js";
import { createRoomType, deleteRoomType, getRoomType, getRoomTypes, updateRoomType } from "../controllers/room/RoomTypeController.js";
import { uploadRoomImages } from "../middleware/uploadMiddleware.js";
import { createRoom, deleteRoom, getRoom, getRooms, updateRoom } from "../controllers/room/RoomController.js";

const router = express.Router();

router.post("/create", protect, createExtraService);
router.get("/", protect, getExtraServices);
router.get("/:id", protect, getExtraService);
router.patch("/:id", protect, updateExtraService);
router.delete("/:id", protect, deleteExtraService);

router.post("/create", protect, createTimeSlot);
router.get("/", protect, getTimeSlots);
router.get("/:id", protect, getTimeSlot);
router.patch("/:id", protect, updateTimeSlot);
router.delete("/:id", protect, deleteTimeSlot);

router.post("/create", protect, createRoomType);
router.get("/", protect, getRoomTypes);
router.get("/:id", protect, getRoomType);
router.patch("/:id", protect, updateRoomType);
router.delete("/:id", protect, deleteRoomType);

router.post("/create", protect, uploadRoomImages.array("images", 10), createRoom);
router.get("/", protect, getRooms);
router.get("/:id", protect, getRoom);
router.patch("/:id", protect, uploadRoomImages.array("images", 10), updateRoom);
router.delete("/:id", protect, deleteRoom);



export default router;
