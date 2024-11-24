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
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    maxOccupancy: {
      type: Number,
      required: true,
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