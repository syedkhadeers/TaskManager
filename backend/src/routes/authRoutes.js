import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { uploadUserPhoto } from "../middleware/uploadMiddleware.js";
import {
  registerUser,  loginUser,  logoutUser,  userLoginStatus,  verifyEmail,  verifyUser,  forgotPassword,  resetPassword,  changePassword,
} from "../controllers/auth/authController.js";

const router = express.Router();

// Public Routes
router.post("/register", uploadUserPhoto.single("photo"), registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/verify/:token", verifyUser);
router.post("/verify-email", verifyEmail);

// Protected Routes
router.get("/status", protect, userLoginStatus);
router.post("/logout", protect, logoutUser);
router.patch("/change-password", protect, changePassword);

export default router;
