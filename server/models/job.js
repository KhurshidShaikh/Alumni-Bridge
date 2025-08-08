import { JsonWebTokenError } from "jsonwebtoken";
import mongoose from "mongoose";

export const jobSchema=mongoose.Schema(
    {
        _id: ObjectId,
        title: String,
        company: String,
        location: String,
        link: String,
        description: String,
        postedBy: { type: ObjectId, ref: 'User' },
        createdAt: Date
       }
)
export const job=mongoose.model('job',jobSchema)