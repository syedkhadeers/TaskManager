import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { uploadUserPhoto } from "../middleware/uploadMiddleware.js";
import {
  addUser,  updateUserById,  deleteUserById,  getUserById,  getAllUsers,  getUserByRole,  getMe,  updateMe
} from "../controllers/user/userController.js";

const router = express.Router();

// Protected Routes - Basic User Access
router.get("/user/me", getMe);
router.patch("/user/me", uploadUserPhoto.single("photo"), updateMe);

// Protected Routes - Admin Access
router.post("/users", uploadUserPhoto.single("photo"), addUser);
router.get("/users", getAllUsers);
router.get("/users/role/:role", getUserByRole);
router.get("/users/:id", getUserById);
router.patch("/users/:id", uploadUserPhoto.single("photo"), updateUserById);
router.delete("/users/:id", deleteUserById);

export default router;
