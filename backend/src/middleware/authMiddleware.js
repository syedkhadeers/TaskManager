import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/users/UserModel.js";

// Base protect middleware
export const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Please login to access this resource" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
});

// Role-based middleware generator
export const authorize = (...allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Please login first" });
    }

    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      message: `Role ${req.user.role} is not authorized to access this resource`,
    });
  });
};

// Verified user middleware
export const isVerified = asyncHandler(async (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({ message: "Please verify your email first" });
  }
  next();
});


// // usage example
// router.get("/users", protect, authorize("admin", "creator"), getAllUsers);
// router.post("/tasks", protect, authorize("manager", "admin"), isVerified, createTask);
// router.get("/reports", protect, authorize("manager", "admin", "creator"), getReports);
// router.patch("/settings", protect, authorize("admin"), updateSettings);
