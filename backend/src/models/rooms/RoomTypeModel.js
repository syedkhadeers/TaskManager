import mongoose from "mongoose";

const roomTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    specialPrice: {
      type: Number,
    },
    offerPrice: {
      type: Number,
    },
    maxOccupancy: {
      type: Number,
      min: [1, "Minimum occupancy is 1"],
    },
    timeSlotPricing: [
      {
        timeSlot: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "TimeSlot",
        },
        price: Number,
      },
    ],
    extraServices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExtraService",
      },
    ],
    images: [
      {
        type: String, 
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


const RoomTypeModel = mongoose.model("RoomType", roomTypeSchema);
export default RoomTypeModel;