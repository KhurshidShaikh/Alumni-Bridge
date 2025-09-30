import mongoose from "mongoose";

const BulkImportSchema = mongoose.Schema(
    {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        fileName: {
            type: String,
            required: true
        },
        fileSize: {
            type: Number,
            required: true
        },
        totalRecords: {
            type: Number,
            required: true
        },
        successfulImports: {
            type: Number,
            default: 0
        },
        failedImports: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ['pending', 'processing', 'completed', 'failed'],
            default: 'pending'
        },
        importType: {
            type: String,
            enum: ['users', 'alumni', 'students'],
            required: true
        },
        importErrors: [{
            row: Number,
            field: String,
            error: String,
            data: mongoose.Schema.Types.Mixed
        }],
        errors: [{
            row: Number,
            field: String,
            error: String,
            data: mongoose.Schema.Types.Mixed
        }],
        successfulRecords: [{
            row: Number,
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
            email: String,
            name: String
        }],
        processingStartedAt: {
            type: Date
        },
        processingCompletedAt: {
            type: Date
        },
        notes: {
            type: String
        }
    },
    {
        timestamps: true,
        suppressReservedKeysWarning: true
    }
)

// Index for efficient querying
BulkImportSchema.index({ admin: 1, createdAt: -1 });
BulkImportSchema.index({ status: 1, createdAt: -1 });
BulkImportSchema.index({ importType: 1, createdAt: -1 });

export const BulkImport = mongoose.model('BulkImport', BulkImportSchema);
