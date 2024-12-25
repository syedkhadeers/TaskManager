import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    checkInTime: {
      type: String,
      required: true,
    },
    checkOutTime: {
      type: String,
      required: true,
    },
    sameDay: {
      type: String,
      enum: ["Same Day", "Next Day"],
      default: "Same Day",
    },
    priceMultiplier: {
      type: Number,
      default: 1,
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

// Compound indexes for optimized queries
timeSlotSchema.index({ isActive: 1, sameDay: 1 });
timeSlotSchema.index({ checkInTime: 1, checkOutTime: 1 });
timeSlotSchema.index({ name: 1, isActive: 1 });

const TimeSlotModel = mongoose.model("TimeSlot", timeSlotSchema);

export default TimeSlotModel;
