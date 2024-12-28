import asyncHandler from "express-async-handler";
import User from "../../models/users/UserModel.js";
import generateToken, {
  generateRefreshToken,
} from "../../services/generateToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Token from "../../models/auth/Token.js";
import crypto from "node:crypto";
import hashToken, { verifyHash } from "../../services/hashToken.js";
import sendEmail from "../../services/sendEmail.js";
import {
  uploadImage
} from "../../services/imageUpload.js";

export const registerUser = asyncHandler(async (req, res) => {
  const {
    title,
    firstName,
    lastName,
    email,
    password,
    userName,
    gender,
    dateOfBirth,
    department,
    branch,
    address,
    city,
    pinCode,
    state,
    country,
    mobile,
    alternateMobile,
    bio,
  } = req.body;

  if (!firstName || !email || !password) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  const userExists = await User.findOne({
    $or: [{ email }, { userName }],
  });

  if (userExists) {
    return res.status(400).json({
      message:
        userExists.email === email
          ? "Email already registered"
          : "Username taken",
    });
  }

  let photoData = {
    url: "https://res.cloudinary.com/khadeer/image/upload/v1735132491/customer_ggliyp.jpg",
    publicId: "",
  };

  if (req.file) {
    const uploadResult = await uploadImage(req.file, "user_photos");
    photoData = {
      url: uploadResult.url,
      publicId: uploadResult.publicId,
    };
  }

  const fullName = `${firstName} ${lastName}`.trim();

  const user = await User.create({
    title: title || "Mr.",
    firstName,
    lastName,
    fullName,
    email,
    userName: userName || email.split("@")[0],
    password,
    photo: photoData,
    gender,
    dateOfBirth,
    department,
    branch,
    address,
    city,
    pinCode,
    state,
    country,
    mobile,
    alternateMobile,
    bio: bio || "I am a new user",
  });

  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Set cookies
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: "none",
    secure: true,
  });

  res.cookie("refreshToken", refreshToken, {
    path: "/",
    httpOnly: true,
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, fullName, email, role, photo, isVerified } = user;
    res.status(201).json({
      _id,
      fullName,
      email,
      role,
      photo: photo.url,
      isVerified,
      token,
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const user = await User.findOne({ email })
    .select("+password")
    .lean()
    .exec();

  if (!user) {
    return res.status(404).json({ message: "Account not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "none",
    secure: true,
  });

  res.cookie("refreshToken", refreshToken, {
    path: "/",
    httpOnly: true,
    maxAge: 90 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    secure: true,
  });

  const { password: _, ...userWithoutPassword } = user;
  
  res.status(200).json({
    ...userWithoutPassword,
    token
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });

  res.cookie("refreshToken", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({ message: "Logout successful" });
});

export const userLoginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ isLoggedIn: false });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ isLoggedIn: true, user: verified });
  } catch (error) {
    return res.status(401).json({ isLoggedIn: false });
  }
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.isVerified) {
    return res.status(400).json({ message: "Email already verified" });
  }

  await Token.deleteMany({ userId: user._id, type: "emailVerification" });

  const verificationToken = crypto.randomBytes(64).toString("hex");
  const { hash, salt } = hashToken(verificationToken);

  await Token.create({
    userId: user._id,
    type: "emailVerification",
    token: hash,
    salt,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000
  });

  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  await sendEmail({
    subject: "Email Verification",
    to: user.email,
    template: "emailVerification",
    data: {
      name: user.fullName,
      url: verificationUrl
    }
  });

  res.status(200).json({ message: "Verification email sent" });
});

export const verifyUser = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const storedToken = await Token.findOne({ 
    type: "emailVerification",
    expiresAt: { $gt: Date.now() }
  });

  if (!storedToken) {
    return res.status(400).json({ message: "Invalid or expired verification link" });
  }

  const isValid = verifyHash(token, storedToken.salt, storedToken.token);

  if (!isValid) {
    return res.status(400).json({ message: "Invalid verification token" });
  }

  await User.findByIdAndUpdate(storedToken.userId, { isVerified: true });
  await Token.deleteMany({ userId: storedToken.userId, type: "emailVerification" });

  res.status(200).json({ message: "Email verified successfully" });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(404)
      .json({ message: "No account found with this email" });
  }

  await Token.deleteMany({ userId: user._id, type: "passwordReset" });

  const resetToken = crypto.randomBytes(64).toString("hex");
  const { hash, salt } = hashToken(resetToken);

  await Token.create({
    userId: user._id,
    type: "passwordReset",
    token: hash,
    salt,
    expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
  });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  await sendEmail({
    subject: "Password Reset Request",
    to: user.email,
    template: "forgotPassword",
    data: {
      name: user.fullName,
      url: resetUrl,
    },
  });

  res
    .status(200)
    .json({ message: "Password reset instructions sent to email" });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  const storedToken = await Token.findOne({
    type: "passwordReset",
    expiresAt: { $gt: Date.now() },
  });

  if (!storedToken) {
    return res.status(400).json({ message: "Invalid or expired reset link" });
  }

  const isValid = verifyHash(token, storedToken.salt, storedToken.token);

  if (!isValid) {
    return res.status(400).json({ message: "Invalid reset token" });
  }

  const user = await User.findById(storedToken.userId);
  user.password = password;
  await user.save();

  await Token.deleteMany({ userId: user._id, type: "passwordReset" });

  res.status(200).json({ message: "Password reset successful" });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "New password must be at least 6 characters" });
  }

  const user = await User.findById(userId).select("+password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  user.password = newPassword;
  await user.save();

  // Optionally force re-login by clearing tokens
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({ message: "Password updated successfully" });
});

export default {
  registerUser,
  loginUser,
  logoutUser,
  userLoginStatus,
  verifyEmail,
  verifyUser,
  forgotPassword,
  resetPassword,
  changePassword,
};
