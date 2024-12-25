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
    description: {
      type: String,
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

// compound indexes
roomSchema.index({ floor: 1, roomNumber: 1 }); // For searching rooms by floor and room number
roomSchema.index({ status: 1, roomType: 1 }); // For filtering available rooms by type
roomSchema.index({ isActive: 1, status: 1 }); // For querying active rooms with specific status
roomSchema.index({ smokingAllowed: 1, petsAllowed: 1, status: 1 }); // For filtering rooms by preferences

const RoomModel = mongoose.model("Room", roomSchema);
export default RoomModel;
