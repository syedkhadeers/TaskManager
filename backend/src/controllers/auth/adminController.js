import asyncHandler from "express-async-handler";
import User from "../../models/auth/UserModel.js";
import {
  deleteImage,
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
