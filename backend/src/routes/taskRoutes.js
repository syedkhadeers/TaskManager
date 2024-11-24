import express from "express";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} from "../controllers/task/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadTaskImages } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/task/create",
  protect,
  uploadTaskImages.array("images", 5),
  createTask
);
router.get("/tasks", protect, getTasks);
router.get("/task/:id", protect, getTask);
router.patch(
  "/task/:id",
  protect,
  uploadTaskImages.array("images", 5),
  updateTask
);
router.delete("/task/:id", protect, deleteTask);

export default router;
