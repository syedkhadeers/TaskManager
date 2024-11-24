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