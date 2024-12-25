import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/auth/UserModel.js";

// Authentication middleware
export const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed. Invalid or expired token",
      error: error.message,
    });
  }
});

// Admin role middleware
export const superadmin = asyncHandler(async (req, res, next) => {
  if (req.user?.role === "superadmin") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. Admin privileges required",
  });
});

// Admin role middleware
export const admin = asyncHandler(async (req, res, next) => {
  if (req.user?.role === "admin" || req.user?.role === "superadmin") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. Admin privileges required",
  });
});

// Manager role middleware
export const manager = asyncHandler(async (req, res, next) => {
  const allowedRoles = ["manager", "admin", "superadmin"];

  if (req.user && allowedRoles.includes(req.user.role)) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. Manager privileges required",
  });
});

// Creator role middleware
export const creator = asyncHandler(async (req, res, next) => {
  const allowedRoles = ["creator", "admin", "superadmin", "manager"];

  if (req.user && allowedRoles.includes(req.user.role)) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. Creator privileges required",
  });
});

// User role middleware
export const user = asyncHandler(async (req, res, next) => {
  const allowedRoles = ["user", "creator", "admin", "superadmin", "manager"];

  if (req.user && allowedRoles.includes(req.user.role)) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. User privileges required",
  });
});

// Email verification middleware
export const verified = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: "Email verification required. Please verify your email",
    });
  }

  next();
});

// Combined middleware for common checks
export const verifiedUser = [protect, verified];
export const verifiedCreator = [protect, verified, creator];
export const verifiedAdmin = [protect, verified, admin];
export const verifiedManager = [protect, verified, manager];


// // Usage Example :

// router.post("/admin-only", verifiedAdmin, adminController);
// router.post("/creator-content", verifiedCreator, creatorController);
// router.get("/user-profile", verifiedUser, userController);