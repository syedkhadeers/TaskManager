import mongoose from "mongoose";

const extraServiceSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    availability: {
      type: Boolean,
      default: true,
    },
    serviceType: {
      type: String,
      required: [true, "Service type is required"],
      trim: true,
    },
    additionalInfo: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);


const ExtraServiceModel = mongoose.model("ExtraService", extraServiceSchema);
export default ExtraServiceModel;