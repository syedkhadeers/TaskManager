import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    address: {
      street: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      postalCode: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
    },
    customerType: {
      type: String,
      enum: ["Regular", "VIP", "Corporate"],
      default: "Regular",
    },
    customerContacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CustomerContact",
      },
    ],
    logo: {
      type: String,
      default: "https://placehold.co/180x50",
    },
    additionalInfo: {
      type: String,
      trim: true,
    },
    isVerified: {
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
    minimize: true,
  }
);



const CustomerModel = mongoose.model("Customer", CustomerSchema);
export default CustomerModel;
