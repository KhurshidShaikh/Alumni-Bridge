import mongoose from "mongoose";

const AnnouncementSchema = mongoose.Schema(
    {
        title: { 
            type: String, 
            required: true,
            trim: true,
            maxLength: 200
        },
        content: { 
            type: String, 
            required: true,
            trim: true
        },
        author: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'user',
            required: true
        },
        type: { 
            type: String, 
            enum: ['announcement', 'event', 'general', 'urgent'], 
            default: 'general' 
        },
        visibility: { 
            type: String, 
            enum: ['all', 'alumni', 'students'], 
            default: 'all' 
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium'
        },
        isActive: {
            type: Boolean,
            default: true
        },
        imageUrl: {
            type: String
        },
        expiresAt: {
            type: Date
        },
        readBy: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
            readAt: { type: Date, default: Date.now }
        }]
    },
    {
        timestamps: true
    }
)

export const Announcement = mongoose.model('Announcement', AnnouncementSchema)