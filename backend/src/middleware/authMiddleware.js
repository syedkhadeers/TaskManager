import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/auth/UserModel.js";

// Protect middleware to check if the user is logged in
export const protect = asyncHandler(async (req, res, next) => {
  try {
    // Check if user is logged in
    const token = req.cookies.token;

    if (!token) {
      // 401 Unauthorized
      return res
        .status(401)
        .json({ message: "Token not received at protect, please login!" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user details from the token ----> exclude password
    const user = await User.findById(decoded.id).select("-password");

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User  not found at protect!" });
    }

    // Set user details in the request object
    req.user = user;

    next();
  } catch (error) {
    // 401 Unauthorized
    return res
      .status(401)
      .json({ message: "Token failed at protect, token failed!" });
  }
});

// Admin middleware to check if the user is an admin
export const adminMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res
    .status(403)
    .json({ message: "Unauthorized access at adminMiddleware!" });
});

// Creator middleware to check if the user is a creator or admin
export const creatorMiddleware = asyncHandler(async (req, res, next) => {
  if (
    (req.user && req.user.role === "creator") ||
    (req.user && req.user.role === "admin")
  ) {
    return next();
  }

  return res
    .status(403)
    .json({ message: "Unauthorized access at creatorMiddleware!" });
});

// Verified middleware to check if the user is verified
export const verifiedMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isVerified) {
    return next();
  }

  return res
    .status(403)
    .json({ message: "Please Verify Your Email at verifiedMiddleware!" });
});
