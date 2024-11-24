import mongoose from "mongoose";

const CustomerContactSchema = new mongoose.Schema(
    {
        contactName: {
          type: String,
          trim: true,
        },
        contactEmail: {
          type: String,
          trim: true,
        },
        contactPhone: {
          type: String,
          trim: true,
        },
        ContactPosition: {
          type: String,
          trim: true,
        },
        contactPhoto: {
          type: String,
          default: "https://i.pravatar.cc/300",
        },
        ContactStatus: {
          type: String,
          enum: ["active", "suspended", "blocked", "deleted"],
          default: "active",
        },
      },
      {
        timestamps: true,
        minimize: true,
      }
    );

    const CustomerContactModel = mongoose.model("CustomerContact", CustomerContactSchema);
    export default CustomerContactModel;
