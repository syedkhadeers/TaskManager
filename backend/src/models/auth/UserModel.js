import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      enum: ["Mr.", "Mrs.", "Miss.", "Ms.", "Dr.", "Prof."],
      default: "Mr.",
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    fullName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    userName: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      minLength: 6,
    },
    photo: {
      url: {
        type: String,
        default: "https://res.cloudinary.com/khadeer/image/upload/v1735132491/customer_ggliyp.jpg",
      },
      publicId: {
        type: String,
        default: "",
      },
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    dateOfBirth: {
      type: Date,
    },
    department: {
      type: String,
    },
    branch: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    pinCode: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
      default: "India",
    },
    mobile: {
      type: String,
    },
    bio: {
      type: String,
      default: "I am a new user",
    },
    role: {
      type: String,
      enum: ["user", "admin", "creator", "superadmin", "manager"],
      default: "user",
    },
    alternateMobile: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    minimize: true,
  }
);


// Add compound indexes
UserSchema.index({ email: 1, userName: 1 });
UserSchema.index({ firstName: 1, lastName: 1 });
UserSchema.index({ role: 1, isVerified: 1 });

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
