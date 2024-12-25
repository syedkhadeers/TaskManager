import asyncHandler from "express-async-handler";
import User from "../../models/auth/UserModel.js";
import generateToken from "../../helpers/generateToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Token from "../../models/auth/Token.js";
import crypto from "node:crypto";
import hashToken from "../../helpers/hashToken.js";
import sendEmail from "../../helpers/sendEmail.js";
import { uploadImage, updateImage } from "../../helpers/imageUpload.js";



// Register new user
export const registerUser = asyncHandler(async (req, res) => {
  const {
    title,
    firstName,
    lastName,
    email,
    password,
    gender,
    mobile,
    department,
    role,
  } = req.body;

  // Enhanced validation
  const validationErrors = [];
  if (!firstName?.trim()) validationErrors.push("First name is required");
  if (!lastName?.trim()) validationErrors.push("Last name is required");
  if (!email?.trim()) validationErrors.push("Email is required");
  if (!password) validationErrors.push("Password is required");
  if (password?.length < 6)
    validationErrors.push("Password must be at least 6 characters");

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  // Check existing user
  const userExists = await User.findOne({ email: email.trim() });
  if (userExists) {
    return res.status(409).json({
      success: false,
      message: "User with this email already exists",
    });
  }

  // Handle photo upload
  let photo = {
    url: "https://drive.google.com/file/d/1s9LUGejbrY3HwuDqxQbdhv0ri1kdZu5l/view?usp=sharing",
    publicId: "",
  };

  if (req.file) {
    const uploadResult = await uploadImage(req.file, "user_photos");
    photo = { url: uploadResult.url, publicId: uploadResult.publicId };
  }

  const user = await User.create({
    title: title || "Mr.",
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    password,
    photo,
    gender,
    mobile,
    department,
    role: role || "user",
  });

  const token = generateToken(user._id);

  // Set HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: "none",
    secure: true,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      photo: user.photo.url,
      isVerified: user.isVerified,
      token,
    },
  });
});

// Login user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  const validationErrors = [];
  if (!email?.trim()) validationErrors.push("Email is required");
  if (!password) validationErrors.push("Password is required");

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  // Find user
  const user = await User.findOne({ email: email.trim() });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found. Please register",
    });
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const token = generateToken(user._id);

  // Set HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      photo: user.photo.url,
      isVerified: user.isVerified,
      token,
    },
  });
});

// Logout user
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

// Get login status
export const userLoginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
      isLoggedIn: false,
    });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified) {
      return res.status(200).json({
        success: true,
        message: "User is logged in",
        isLoggedIn: true,
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is invalid or expired",
      isLoggedIn: false,
    });
  }
});

// Email Verification
export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (user.isVerified) {
    return res.status(400).json({
      success: false,
      message: "Email is already verified",
    });
  }

  // Delete existing token if exists
  await Token.deleteOne({ userId: user._id });

  // Generate new verification token
  const verificationToken = crypto.randomBytes(64).toString("hex") + user._id;
  const hashedToken = await hashToken(verificationToken);

  // Save token
  await Token.create({
    userId: user._id,
    verificationToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });

  const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  // Email configuration
  const emailConfig = {
    subject: "Email Verification - AuthKit",
    send_to: user.email,
    sent_from: process.env.EMAIL_USER,
    reply_to: process.env.EMAIL_REPLY_USER,
    template: "emailVerification",
    name: `${user.firstName} ${user.lastName}`,
    url: verificationLink,
  };

  try {
    await sendEmail(
      emailConfig.subject,
      emailConfig.send_to,
      emailConfig.sent_from,
      emailConfig.reply_to,
      emailConfig.template,
      emailConfig.name,
      emailConfig.url
    );

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send verification email",
      error: error.message,
    });
  }
});

// Verify User Email
export const verifyUser = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;

  if (!verificationToken) {
    return res.status(400).json({
      success: false,
      message: "Invalid verification token",
    });
  }

  const hashedToken = await hashToken(verificationToken);
  const userToken = await Token.findOne({
    verificationToken: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired verification token",
    });
  }

  const user = await User.findById(userToken.userId);
  if (user.isVerified) {
    return res.status(400).json({
      success: false,
      message: "Email is already verified",
    });
  }

  user.isVerified = true;
  await user.save();
  await Token.deleteOne({ _id: userToken._id });

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
  });
});

// Forgot Password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  const user = await User.findOne({ email: email.trim() });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Delete existing token if exists
  await Token.deleteOne({ userId: user._id });

  // Generate reset token
  const resetToken = crypto.randomBytes(64).toString("hex") + user._id;
  const hashedToken = await hashToken(resetToken);

  // Save token
  await Token.create({
    userId: user._id,
    passwordResetToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
  });

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // Email configuration
  const emailConfig = {
    subject: "Password Reset - AuthKit",
    send_to: user.email,
    sent_from: process.env.EMAIL_USER,
    reply_to: process.env.EMAIL_REPLY_USER,
    template: "forgotPassword",
    name: `${user.firstName} ${user.lastName}`,
    url: resetLink,
  };

  try {
    await sendEmail(
      emailConfig.subject,
      emailConfig.send_to,
      emailConfig.sent_from,
      emailConfig.reply_to,
      emailConfig.template,
      emailConfig.name,
      emailConfig.url
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send password reset email",
      error: error.message,
    });
  }
});

// Reset Password
export const resetPassword = asyncHandler(async (req, res) => {
  const { resetPasswordToken } = req.params;
  const { password } = req.body;

  const validationErrors = [];
  if (!password) validationErrors.push("Password is required");
  if (password?.length < 6) validationErrors.push("Password must be at least 6 characters");

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  const hashedToken = await hashToken(resetPasswordToken);
  const userToken = await Token.findOne({
    passwordResetToken: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired reset token",
    });
  }

  const user = await User.findById(userToken.userId);
  user.password = password;
  await user.save();
  await Token.deleteOne({ _id: userToken._id });

  res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
});

// Change Password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const validationErrors = [];
  if (!currentPassword) validationErrors.push("Current password is required");
  if (!newPassword) validationErrors.push("New password is required");
  if (newPassword?.length < 6) validationErrors.push("New password must be at least 6 characters");

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({
      success: false,
      message: "Current password is incorrect",
    });
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});
