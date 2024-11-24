import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    verificationToken: {
        type: String,
        default: "",
    },
    passwordResetToken: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});

export default mongoose.model("Token", TokenSchema);