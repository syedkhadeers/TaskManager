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
        url: {
          type: String,
          default:
            "https://drive.google.com/file/d/1s9LUGejbrY3HwuDqxQbdhv0ri1kdZu5l/view?usp=sharing",
        },
        publicId: {
          type: String,
          default: "",
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    description: {
      type: String,
    },
    amenities: [
      {
        type: String, // multiple with comma separated
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

// compound indexes
roomSchema.index({ floor: 1, roomNumber: 1 }); // For searching rooms by floor and room number
roomSchema.index({ status: 1, roomType: 1 }); // For filtering available rooms by type
roomSchema.index({ isActive: 1, status: 1 }); // For querying active rooms with specific status
roomSchema.index({ smokingAllowed: 1, petsAllowed: 1, status: 1 }); // For filtering rooms by preferences

const RoomModel = mongoose.model("Room", roomSchema);
export default RoomModel;
