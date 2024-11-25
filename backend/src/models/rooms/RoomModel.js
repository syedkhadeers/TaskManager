import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
    },
    roomType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance", "reserved"],
      default: "available",
    },
    floor: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String, // allowed 10 images
      },
    ],
    extraServices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExtraService",
      },
    ],
    description: {
      type: String,
    },
    allowedPeople: {
      type: Number,
    },
    amenities: [
      {
        type: String,
      },
    ],
    smokingAllowed: {
      type: Boolean,
      default: false,
    },
    petsAllowed: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


const RoomModel = mongoose.model("Room", roomSchema);
export default RoomModel;
