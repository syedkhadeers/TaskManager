import mongoose from "mongoose";

const extraServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    basePrice: {
      type: Number,
      required: [true, "Base Price is required"],
    },
    specialPrice: {
      type: Number,
      default: 0,
    },
    offerPrice: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String, // just a string.
    },
    serviceType: {
      type: String,
      trim: true,
    },
    additionalInfo: {
      type: String,
      trim: true,
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
extraServiceSchema.index({ serviceType: 1, availability: 1 });
extraServiceSchema.index({ name: 1, serviceType: 1 });

const ExtraServiceModel = mongoose.model("ExtraService", extraServiceSchema);

export default ExtraServiceModel;
