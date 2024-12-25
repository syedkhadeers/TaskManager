import express from "express";
import {
  protect,
  verifiedUser,
  verifiedAdmin,
  verifiedCreator,
  manager,
  admin,
  superadmin,
} from "../middleware/authMiddleware.js";
import { uploadUserPhoto } from "../middleware/uploadMiddleware.js";
import { addUser, deleteUserById, getUser, getUserById, getUsers, updateUser, updateUserById } from "../controllers/user/userController.js";

const router = express.Router();

// User management routes
router.post("/add-user", protect, manager, admin, superadmin, uploadUserPhoto.single("photo"), addUser);

// Personal user routes
router.get("/user", protect, getUser);

router.patch("/user", protect, uploadUserPhoto.single("photo"), updateUser );

// User interaction routes
router.get("/user/:id", verifiedUser, getUserById);

router.patch( "/update-user/:id", verifiedUser, uploadUserPhoto.single("photo"), updateUserById );

// Admin routes
router.delete("/admin/users/:id", verifiedAdmin, deleteUserById);

// Creator routes
router.get("/users", verifiedCreator, getUsers);

export default router;
