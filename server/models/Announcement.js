import mongoose from "mongoose";

const AnnouncementSchema=mongoose.Schema(
    {
        _id: ObjectId,
        author: { type: ObjectId, ref: 'User' },
        content: String,
        type: { type: String, enum: ['announcement', 'job', 'general'], default: 'general' },
        visibility: { type: String, enum: ['all', 'alumni', 'students'], default: 'all' },
        createdAt: Date
       }
)

export const Announcement=mongoose.model('Announcement',AnnouncementSchema)