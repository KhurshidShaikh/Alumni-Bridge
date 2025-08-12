import mongoose from "mongoose";

const EventSchema=mongoose.Schema(
    {
        
        title: String,
        description: String,
        date: Date,
        location: String,
        imageUrl: String,
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        
        visibility: { type: String, enum: ['public', 'private'], default: 'public' },
        createdAt: Date
       }
)
export const EventModel=mongoose.model('Event',EventSchema)