import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Supplier name is required"],
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
    supplierType: {
      type: String,
      enum: ["Manufacturer", "Distributor", "Wholesaler", "Retailer"],
      default: "Wholesaler",
    },
    supplierContacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SupplierContact",
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

const SupplierModel = mongoose.model("Supplier", SupplierSchema);
export default SupplierModel;
