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

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please enter all the fields" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be up to 6 characters" });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  let photoUrl = "https://avatars.githubusercontent.com/u/19819005?v=4";
  let photoPublicId = "";

  if (req.file) {
    const uploadResult = await uploadImage(req.file, "user_photos");
    photoUrl = uploadResult.url;
    photoPublicId = uploadResult.publicId;
  }

  const user = await User.create({
    name,
    email,
    password,
    photo: {
      url: photoUrl,
      publicId: photoPublicId,
    },
  });
  

  const token = generateToken(user._id);

  res.cookie("token", token, {
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  if (user) {
    const { _id, name, email, role, photo, bio, isVerified } = user;

    res.status(201).json({
      _id,
      name,
      email,
      role,
      photo: photo.url,
      bio,
      isVerified,
      token,
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

// user login
export const loginUser = asyncHandler(async (req, res) => {
  // get email and password from req.body
  const { email, password } = req.body;

  // validation
  if (!email || !password) {
    // 400 Bad Request
    return res.status(400).json({ message: "All fields are required" });
  }

  // check if user exists
  const userExists = await User.findOne({ email });

  if (!userExists) {
    return res.status(404).json({ message: "User not found, sign up!" });
  }

  // check id the password match the hashed password in the database
  const isMatch = await bcrypt.compare(password, userExists.password);

  if (!isMatch) {
    // 400 Bad Request
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // generate token with user id
  const token = generateToken(userExists._id);

  if (userExists && isMatch) {
    const { _id, name, email, role, photo, bio, isVerified } = userExists;

    // set the token in the cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: "none", // cross-site access --> allow all third-party cookies
      secure: true,
    });

    // send back the user and token in the response to the client
    res.status(200).json({
      _id,
      name,
      email,
      role,
      photo,
      bio,
      isVerified,
      token,
    });
  } else {
    res.status(400).json({ message: "Invalid email or password" });
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token");

  res.status(200).json({ message: "User logged out" });
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

export const userLoginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({
      message: "Token not received at userLoginStatus, please login!",
    });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded) {
    res.status(200).json(true);
  } else {
    res.status(401).json(false);
  }
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404).json({ message: "User not found" });
  }

  if (user.isVerified) {
    res.status(400).json({ message: "User already verified" });
  }

  const token = await Token.findOne({ userId: user._id });

  if (token) {
    await token.deleteOne();
  }

  const verificationToken = crypto.randomBytes(64).toString("hex") + user._id;

  const hashedToken = await hashToken(verificationToken);

  await new Token({
    userId: user._id,
    verificationToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }).save();

  const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  //send email

  const subject = "Email Verification - AuthKit";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;
  const reply_to = process.env.EMAIL_REPLY_USER;
  const template = "emailVerification";
  const name = user.name;
  const url = verificationLink;

  try {
    await sendEmail(subject, send_to, sent_from, reply_to, template, name, url);
    res
      .status(200)
      .json({ message: "Email verification link sent to your email" });
  } catch (error) {
    console.log(`Error sending email: ${error}`);
    res
      .status(500)
      .json({ message: "Email verification link could not be sent" });
  }
});

export const verifyUser = asyncHandler(async (req, res) => {
  const { verificationToken } = req?.params;

  if (!verificationToken) {
    return res.status(400).json({ message: "Invalid verification token" });
  }
  // hash the verification token --> because it was hashed before saving
  const hashedToken = await hashToken(verificationToken);

  // find user with the verification token
  const userToken = await Token.findOne({
    verificationToken: hashedToken,
    // check if the token has not expired
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    return res
      .status(400)
      .json({ message: "Invalid or expired verification token" });
  }

  //find user with the user id in the token
  const user = await User.findById(userToken.userId);

  if (user.isVerified) {
    // 400 Bad Request
    return res.status(400).json({ message: "User is already verified" });
  }

  // update user to verified
  user.isVerified = true;
  await user.save();
  res.status(200).json({ message: "User verified" });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found in Database" });
  }

  let token = await Token.findOne({ userId: user._id });

  if (token) {
    await token.deleteOne();
  }

  const passwordResetToken = crypto.randomBytes(64).toString("hex") + user._id;

  const hashedToken = await hashToken(passwordResetToken);

  await new Token({
    userId: user._id,
    passwordResetToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 1 * 60 * 60 * 1000, // 24 hours
  }).save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${passwordResetToken}`;

  //send email

  const subject = "Password Reset - AuthKit";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;
  const reply_to = process.env.EMAIL_REPLY_USER;
  const template = "forgotPassword";
  const name = user.name;
  const url = resetLink;

  try {
    await sendEmail(subject, send_to, sent_from, reply_to, template, name, url);
    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.log(`Error sending email: ${error}`);
    res.status(500).json({ message: "Password reset link could not be sent" });
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { resetPasswordToken } = req?.params;

  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  //hash reset token
  const hashedToken = await hashToken(resetPasswordToken);

  //toxen exists
  const userToken = await Token.findOne({
    passwordResetToken: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    return res
      .status(400)
      .json({ message: "Invalid or expired password reset token" });
  }

  //find user with the user id in the token
  const user = await User.findById(userToken.userId);

  //update password
  user.password = password;
  await user.save();

  res.status(200).json({ message: "Password reset successfully" });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //find user by id
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  //check if the password match the hashed password in the database
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    // 400 Bad Request
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  if (isMatch) {
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } else {
    res.status(400).json({ message: "Password could not be changed" });
  }
});
