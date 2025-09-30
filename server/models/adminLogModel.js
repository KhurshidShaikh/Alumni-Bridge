import mongoose from "mongoose";

const AdminLogSchema = mongoose.Schema(
    {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        action: {
            type: String,
            required: true,
            enum: [
                'user_verified', 'user_suspended', 'user_deleted',
                'announcement_created', 'announcement_updated', 'announcement_deleted',
                'event_created', 'event_updated', 'event_deleted',
                'job_approved', 'job_rejected', 'job_deleted',
                'post_moderated', 'post_deleted',
                'bulk_import', 'settings_updated',
                'login', 'logout'
            ]
        },
        targetType: {
            type: String,
            enum: ['user', 'announcement', 'event', 'job', 'post', 'system'],
            required: true
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false // Some actions like login don't have a target
        },
        details: {
            type: String,
            required: true
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },
        ipAddress: {
            type: String
        },
        userAgent: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

// Index for efficient querying
AdminLogSchema.index({ admin: 1, createdAt: -1 });
AdminLogSchema.index({ action: 1, createdAt: -1 });
AdminLogSchema.index({ targetType: 1, targetId: 1 });

export const AdminLog = mongoose.model('AdminLog', AdminLogSchema);
