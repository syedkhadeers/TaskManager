import express from "express";

import {
  adminMiddleware,
  creatorMiddleware,
  protect,
} from "../middleware/authMiddleware.js";

import {uploadUserPhoto} from "../middleware/uploadMiddleware.js";
import { changePassword, forgotPassword, loginUser, logoutUser, registerUser, resetPassword, userLoginStatus, verifyEmail, verifyUser } from "../controllers/auth/authController.js";
import { addUser, getUser, updateUser } from "../controllers/auth/userController.js";
import { deleteUser, getAllUsers, updateOtherUser } from "../controllers/auth/adminController.js";

const router = express.Router();

router.post("/register", uploadUserPhoto.single("photo"), registerUser);
router.post("/add-user", uploadUserPhoto.single("photo"), addUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);
router.get("/user", protect, getUser);
router.patch("/user", protect, uploadUserPhoto.single("photo"), updateUser);
router.patch("/update-user/:id", protect, uploadUserPhoto.single("photo"), updateOtherUser);

// Admin routes
router.delete("/admin/users/:id", protect, adminMiddleware, deleteUser);
router.get("/users", protect, creatorMiddleware, getAllUsers);

router.get("/login-status", userLoginStatus);

// Corrected line
router.post("/verify-email", protect, verifyEmail);

router.post("/verify-user/:verificationToken", verifyUser);

router.post("/forgot-password",  forgotPassword);

router.post("/reset-password/:resetPasswordToken",  resetPassword);

router.patch("/change-password", protect, changePassword);

export default router;
