import asyncHandler from "express-async-handler";
import User from "../../models/auth/UserModel.js";
import bcrypt from "bcryptjs";
import { uploadImage, updateImage } from "../../helpers/imageUpload.js";


export const addUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, mobile, country, bio, isVerified } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please enter all the required fields" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  let photo = {
    url: "https://avatars.githubusercontent.com/u/19819005?v=4",
    publicId: "",
  };

  if (req.file) {
    const uploadResult = await uploadImage(req.file, "user_photos");
    photo = { url: uploadResult.url, publicId: uploadResult.publicId };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role,
    bio: bio || "",
    mobile: mobile || "",
    country: country || "",
    isVerified: isVerified || false,
    photo,
  });

  if (user) {
    res.status(201).json({ message: "User created successfully", user });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

// get user
export const getUser = asyncHandler(async (req, res) => {
  // get user details from the token ----> exclude password
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    // 404 Not Found
    res.status(404).json({ message: "User not found" });
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, bio } = req.body;

    user.name = name || user.name;
    user.bio = bio || user.bio;

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

    const updated = await user.save();

    res.status(200).json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      photo: updated.photo.url,
      bio: updated.bio,
      isVerified: updated.isVerified,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});
