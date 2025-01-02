import mongoose from "mongoose";

const roomTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    basePrice: {
      type: Number,
      default: 0,
    },
    specialPrice: {
      type: Number,
      default: 0,
    },
    offerPrice: {
      type: Number,
      default: 0,
    },
    maxOccupancy: {
      type: Number,
      min: [1, "Minimum occupancy is 1"],
      default: 1,
    },
    timeSlotPricing: [
      {
        timeSlot: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "TimeSlot",
        },
        price: {
          type: Number,
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    extraServices: [
      {
        extraServices: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ExtraService",
        },
        price: {
          type: Number,
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


// Compound indexes
roomTypeSchema.index({ name: 'text', description: 'text' }); // Text index for search functionality
roomTypeSchema.index({ name: 1, isActive: 1 }); // Compound index for queries combining name and status
roomTypeSchema.index({ basePrice: 1, specialPrice: 1, offerPrice: 1 }); // Index for price-based queries

const RoomTypeModel = mongoose.model("RoomType", roomTypeSchema);
export default RoomTypeModel;
