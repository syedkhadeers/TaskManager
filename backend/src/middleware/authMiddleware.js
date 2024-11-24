import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/auth/UserModel.js";

export const protect = asyncHandler(async (req, res, next) => {
  try {

    // check if user is logged in
    const token = req.cookies.token;

    if (!token) {
      // 401 Unauthorized
      res.status(401).json({ message: "Token not received at protect, please login!" });
    }

    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // get user details from the token ----> exclude password
    const user = await User.findById(decoded.id).select("-password");

    // check if user exists
    if (!user) {
      res.status(404).json({ message: "User not found at protect!" });
    }

    // set user details in the request object
    req.user = user;

    next();
  } catch (error) {
    // 401 Unauthorized
    res.status(401).json({ message: "Token failed at protect, token failed!" });
  }
});


export const adminMiddleware = asyncHandler(async (req, res, next) => {

  if (req.user && req.user.role === "admin") {
    next();

    return;
  }

  res.status(403).json({ message: "Unauthorized access at adminMiddleware!" });
});


export const creatorMiddleware = asyncHandler(async (req, res, next) => {

  if ((req.user && req.user.role === "creator") || (req.user && req.user.role === "admin")) {
    next();

    return;
  }

  res.status(403).json({ message: "Unauthorized access at creatorMiddleware!" });
});



export const verifiedMiddleware = asyncHandler(async (req, res, next) => {

  if (req.user && req.user.isVerified) {
    next();

    return;
  }

  res.status(403).json({ message: "Please Verify Your Email at verifiedMiddleware!" });
});