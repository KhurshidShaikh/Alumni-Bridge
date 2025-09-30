import mongoose from "mongoose";

const SystemSettingsSchema = mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true
        },
        value: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            enum: ['general', 'email', 'security', 'ui', 'features'],
            default: 'general'
        },
        dataType: {
            type: String,
            enum: ['string', 'number', 'boolean', 'object', 'array'],
            required: true
        },
        isEditable: {
            type: Boolean,
            default: true
        },
        lastModifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        validationRules: {
            type: mongoose.Schema.Types.Mixed
        }
    },
    {
        timestamps: true
    }
)

// Index for efficient querying
SystemSettingsSchema.index({ category: 1, key: 1 });
// Note: key field already has unique: true which creates an index automatically

export const SystemSettings = mongoose.model('SystemSettings', SystemSettingsSchema);
