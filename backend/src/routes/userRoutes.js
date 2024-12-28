import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { uploadUserPhoto } from "../middleware/uploadMiddleware.js";
import {
  addUser,  updateUserById,  deleteUserById,  getUserById,  getAllUsers,  getUserByRole,  getMe,  updateMe
} from "../controllers/user/userController.js";

const router = express.Router();

// Protected Routes - Basic User Access
router.get("/me", protect, getMe);
router.patch("/me", protect, uploadUserPhoto.single("photo"), updateMe);

// Protected Routes - Admin Access
router.post("/users", protect, authorize("admin,manager,creator"), uploadUserPhoto.single("photo"), addUser);
router.get("/users", protect, authorize("admin,manager,creator"), getAllUsers);
router.get("/users/role/:role", protect, authorize("admin,manager,creator"), getUserByRole);
router.get("/users/:id", protect, authorize("admin,manager,creator"), getUserById);
router.patch("/users/:id", protect, authorize("admin,manager,creator"), uploadUserPhoto.single("photo"), updateUserById);
router.delete("/users/:id", protect, authorize("admin,manager,creator"), deleteUserById);

export default router;
