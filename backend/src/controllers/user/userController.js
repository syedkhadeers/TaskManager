import asyncHandler from "express-async-handler";
import User from "../../models/auth/UserModel.js";
import bcrypt from "bcryptjs";
import {
  uploadImage,
  updateImage,
  deleteImage,
} from "../../helpers/imageUpload.js";

// Create new user with enhanced validation
export const addUser = asyncHandler(async (req, res) => {
  const {
    title,
    firstName,
    lastName,
    email,
    password,
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
    bio,
    role,
    alternateMobile,
    isVerified,
  } = req.body;

  // Enhanced validation
  const validationErrors = [];
  if (!firstName?.trim()) validationErrors.push("First name is required");
  if (!lastName?.trim()) validationErrors.push("Last name is required");
  if (!email?.trim()) validationErrors.push("Email is required");
  if (!password || password.length < 6)
    validationErrors.push("Password must be at least 6 characters");

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  // Check for existing user
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
    dateOfBirth,
    department,
    branch,
    address,
    city,
    pinCode,
    state,
    country: country || "India",
    mobile,
    bio: bio || "I am a new user",
    role: role || "user",
    alternateMobile,
    isVerified: isVerified || false,
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user,
  });
});

// Get current user profile
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    data: user,
  });
});

// Update current user profile
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const updates = { ...req.body };
  delete updates.password; // Prevent password update through this route

  // Handle photo update
  if (req.file) {
    const updateResult = await updateImage(
      req.file,
      user.photo.publicId,
      "user_photos"
    );
    updates.photo = {
      url: updateResult.url,
      publicId: updateResult.publicId,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true }
  ).select("-password");

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: updatedUser,
  });
});

// Get all users with filtering and pagination
export const getUsers = asyncHandler(async (req, res) => {
  const {
    role,
    isVerified,
    search,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const query = {};

  if (role) query.role = role;
  if (typeof isVerified !== "undefined")
    query.isVerified = isVerified === "true";

  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
  };

  const users = await User.find(query)
    .select("-password")
    .sort(options.sort)
    .skip((options.page - 1) * options.limit)
    .limit(options.limit);

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    data: {
      users,
      pagination: {
        currentPage: options.page,
        totalPages: Math.ceil(total / options.limit),
        totalItems: total,
        itemsPerPage: options.limit,
      },
    },
  });
});

// Get user by ID
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID format",
    });
  }

  const user = await User.findById(id).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: user,
  });
});

// Delete user by ID
export const deleteUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID format",
    });
  }

  // Prevent self-deletion
  if (id === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: "Cannot delete your own account through this route",
    });
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Delete user's photo if exists
  if (user.photo.publicId) {
    await deleteImage(user.photo.publicId);
  }

  await User.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: { id },
  });
});

// Update user by ID (admin route)
export const updateUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID format",
    });
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const {
    title,
    firstName,
    lastName,
    email,
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
    bio,
    role,
    alternateMobile,
    isVerified,
  } = req.body;

  // Check email uniqueness if being updated
  if (email && email !== user.email) {
    const existingUser = await User.findOne({
      email: email.trim(),
      _id: { $ne: id },
    });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already in use by another user",
      });
    }
  }

  // Handle photo update
  let photoUpdate = {};
  if (req.file) {
    const updateResult = await updateImage(
      req.file,
      user.photo.publicId,
      "user_photos"
    );
    photoUpdate.photo = {
      url: updateResult.url,
      publicId: updateResult.publicId,
    };
  }

  const updates = {
    ...(title && { title }),
    ...(firstName && { firstName: firstName.trim() }),
    ...(lastName && { lastName: lastName.trim() }),
    ...(email && { email: email.trim() }),
    ...(gender && { gender }),
    ...(dateOfBirth && { dateOfBirth }),
    ...(department && { department }),
    ...(branch && { branch }),
    ...(address && { address }),
    ...(city && { city }),
    ...(pinCode && { pinCode }),
    ...(state && { state }),
    ...(country && { country }),
    ...(mobile && { mobile }),
    ...(bio && { bio }),
    ...(role && { role }),
    ...(alternateMobile && { alternateMobile }),
    ...(typeof isVerified !== "undefined" && { isVerified }),
    ...photoUpdate,
  };

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  ).select("-password");

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: updatedUser,
  });
});
