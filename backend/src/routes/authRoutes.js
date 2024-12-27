
import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  userLoginStatus,
  verifyEmail,
  verifyUser,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/auth/authController.js";
import { loggedInUsersOnly } from "../middleware/authMiddleware.js";
import { uploadUserPhoto } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Authentication routes
router.post("/register", uploadUserPhoto.single("photo"), registerUser);
router.post("/login", loginUser);
router.get("/login-status", loggedInUsersOnly, userLoginStatus);
router.post("/logout", logoutUser);

// Email verification routes
router.post("/verify-email", loggedInUsersOnly, verifyEmail);
router.post("/verify-user/:verificationToken", verifyUser);

// Password management routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetPasswordToken", resetPassword);
router.patch("/change-password",  changePassword);

export default router;
