import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      enum: ["Mr.", "Mrs.", "Miss.", "Ms.", "Dr.", "Prof."],
      default: "Mr",
    },
    firstName: {
      type: String,
      required: [true, "Please add a name"],
    },
    lastName: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please add a valid email",
      ],
    },
    userName: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minLength: 6,
    },
    photo: {
      url: {
        type: String,
        default: "https://drive.google.com/file/d/1s9LUGejbrY3HwuDqxQbdhv0ri1kdZu5l/view?usp=sharing",
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

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;

  next();
});

// Update username from email 
UserSchema.pre("save", async function (next) {
  if (!this.isModified("userName") && !this.isModified("email")) {
    return next();
  }
  this.userName = this.email.split("@")[0];
  next();
});

// Add compound indexes
UserSchema.index({ email: 1, userName: 1 });
UserSchema.index({ firstName: 1, lastName: 1 });
UserSchema.index({ role: 1, isVerified: 1 });

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
