import asyncHandler from "express-async-handler";
import User from "../../models/users/UserModel.js";
import {
  uploadImage,
  updateImage,
  deleteImage,
} from "../../services/imageUpload.js";
import bcrypt from "bcryptjs";

export const addUser = asyncHandler(async (req, res) => {
  console.log("Received file in backend:", req.file);

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
    role,
  } = req.body;

  if (!firstName || !email || !password) {
    return res.status(400).json({ message: "Required fields missing" });
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
    console.log("Processing image upload");
    const uploadResult = await uploadImage(req.file, "user_photos");
    console.log("Image upload result:", uploadResult);
    photoData = {
      url: uploadResult.url,
      publicId: uploadResult.publicId,
    };
  }

  const fullName = `${firstName} ${lastName}`.trim();
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    title: title || "Mr.",
    firstName,
    lastName,
    fullName,
    email,
    userName: userName || email.split("@")[0],
    password: hashedPassword,
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
    role: role || "user",
  });

  res.status(201).json({
    message: "User created successfully",
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      photo: user.photo.url,
    },
  });
});

export const updateUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  delete updateData.password;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (req.file) {
    const uploadResult = await updateImage(
      req.file,
      user.photo.publicId,
      "user_photos"
    );
    updateData.photo = {
      url: uploadResult.url,
      publicId: uploadResult.publicId,
    };
  }

  if (updateData.firstName || updateData.lastName) {
    updateData.fullName = `${updateData.firstName || user.firstName} ${
      updateData.lastName || user.lastName
    }`.trim();
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  ).select("-password");

  res.status(200).json({
    message: "User updated successfully",
    user: updatedUser,
  });
});

export const deleteUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.photo.publicId) {
    await deleteImage(user.photo.publicId);
  }

  await User.findByIdAndDelete(id);
  res.status(200).json({ message: "User deleted successfully" });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json({
    count: users.length,
    users,
  });
});

export const getUserByRole = asyncHandler(async (req, res) => {
  const { role } = req.params;
  const users = await User.find({ role }).select("-password");

  res.status(200).json({
    count: users.length,
    users,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});

export const updateMe = asyncHandler(async (req, res) => {
  const updateData = { ...req.body };
  delete updateData.password;
  delete updateData.role;

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (req.file) {
    const uploadResult = await updateImage(
      req.file,
      user.photo.publicId,
      "user_photos"
    );
    updateData.photo = {
      url: uploadResult.url,
      publicId: uploadResult.publicId,
    };
  }

  if (updateData.firstName || updateData.lastName) {
    updateData.fullName = `${updateData.firstName || user.firstName} ${
      updateData.lastName || user.lastName
    }`.trim();
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateData },
    { new: true }
  ).select("-password");

  res.status(200).json({
    message: "Profile updated successfully",
    user: updatedUser,
  });
});


export default {
  addUser,
  updateUserById,
  deleteUserById,
  getUserById,
  getAllUsers,
  getUserByRole,
  getMe,
  updateMe
}