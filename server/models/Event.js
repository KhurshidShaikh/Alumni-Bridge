import mongoose from "mongoose";

const EventSchema=mongoose.Schema(
    {
        
        title: String,
        description: String,
        date: Date,
        location: String,
        imageUrl: String,
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        
        visibility: { type: String, enum: ['public', 'private'], default: 'public' },
        registrations: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
            name: String,
            email: String,
            registeredAt: { type: Date, default: Date.now }
        }],
        createdAt: { type: Date, default: Date.now }
       }
)
export const EventModel=mongoose.model('Event',EventSchema)