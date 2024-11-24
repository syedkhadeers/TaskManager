import express from "express";
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
  userLoginStatus,
  verifyEmail,
  verifyUser,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/auth/userController.js";
import {
  adminMiddleware,
  creatorMiddleware,
  protect,
} from "../middleware/authMiddleware.js";
import {
  deleteUser,
  getAllUsers,
} from "../controllers/auth/adminController.js";
import {uploadUserPhoto} from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", uploadUserPhoto.single("photo"), registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/user", protect, getUser);
router.patch("/user", protect, uploadUserPhoto.single("photo"), updateUser);

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
