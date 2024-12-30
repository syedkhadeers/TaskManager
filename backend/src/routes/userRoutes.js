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
router.post(
  "/users",
  authorize("admin,manager,creator"),
  uploadUserPhoto.single("photo"),
  addUser
);
router.get("/users", authorize("admin,manager,creator"), getAllUsers);
router.get(
  "/users/role/:role",
  authorize("admin,manager,creator"),
  getUserByRole
);
router.get("/users/:id", authorize("admin,manager,creator"), getUserById);
router.patch(
  "/users/:id",
  authorize("admin,manager,creator"),
  uploadUserPhoto.single("photo"),
  updateUserById
);
router.delete("/users/:id", authorize("admin,manager,creator"), deleteUserById);

export default router;
