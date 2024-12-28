import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/users/UserModel.js";

export const protect = asyncHandler(async (req, res, next) => {
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
});

// Role-based middleware
export const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient privileges",
      });
    }
    next();
  };
};

// Middleware combinations
export const loggedInUsersOnly = [protect];
export const managersOnly = [
  protect,
  verifyRole(["manager", "admin", "superadmin", "creator"]),
];
export const adminsOnly = [
  protect,
  verifyRole(["admin", "superadmin", "creator"]),
];
export const superAdminOnly = [protect, verifyRole(["superadmin", "creator"])];
export const creatorOnly = [protect, verifyRole(["creator"])];
