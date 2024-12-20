import asyncHandler from "express-async-handler";
import User from "../../models/auth/UserModel.js";
import {
  deleteImage,
  updateImage,
} from "../../helpers/imageUpload.js";

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Attempt to find the user
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }

    if (user && user.photo.publicId) {
      await deleteImage(user.photo.publicId);
      user.photo = {
        url: "https://avatars.githubusercontent.com/u/19819005?v=4",
        publicId: "",
      };
      await user.save();
    }

    // Now delete the user from the database
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User  deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});

  if (!users) {
    return res.status(400).json({ message: "No users found" });
  }

  res.status(200).json(users);
});

//update other user details if the login user is an admin
export const updateOtherUser = asyncHandler(async (req, res) => {
  // Check if the requesting user is an admin
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  // Retrieve the user ID from the request parameters
  const userId = req.params.id;

  // Find the user by ID
  const user = await User.findById(userId);

  if (user) {
    const { name, bio } = req.body;

    // Update the user's details
    user.name = name || user.name;
    user.bio = bio || user.bio;

    // If a new photo is uploaded, update the user's photo
    if (req.file) {
      const updateResult = await updateImage(
        req.file,
        user.photo.publicId,
        "user_photos"
      );
      user.photo = {
        url: updateResult.url,
        publicId: updateResult.publicId,
      };
    }

    // Save the updated user
    const updated = await user.save();

    // Respond with the updated user details
    res.status(200).json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      photo: updated.photo.url,
      bio: updated.bio,
      mobile: updated.mobile,
      isVerified: updated.isVerified,
    });
  } else {
    res.status(404).json({ message: "User  not found" });
  }
});
