import mongoose from "mongoose";

const inviteCodeSchema=mongoose.Schema(
    {
        _id: ObjectId,
        email: String, // Email this code was issued to
        code: String, // Random code
        expiresAt: Date,
        used: { type: Boolean, default: false },
        createdAt: Date
       }
)
export const inviteCode=mongoose.model('inviteCode',inviteCodeSchema)
