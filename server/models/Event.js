import mongoose from "mongoose";

const EventSchema=mongoose.Schema(
    {
        _id: ObjectId,
        title: String,
        description: String,
        date: Date,
        location: String,
        imageUrl: String,
        createdBy: { type: ObjectId, ref: 'User' },
        participants: [{ type: ObjectId, ref: 'User' }],
        visibility: { type: String, enum: ['public', 'private'], default: 'public' },
        createdAt: Date
       }
)
export const Event=mongoose.model('Event',EventSchema)