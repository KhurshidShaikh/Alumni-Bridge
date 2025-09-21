import mongoose from 'mongoose';

// Conversation Schema - Groups messages between two users
const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    lastMessageTime: {
        type: Date,
        default: Date.now
    },
    unreadCount: {
        type: Map,
        of: Number,
        default: new Map()
    }
}, {
    timestamps: true
});

// Index for efficient queries
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageTime: -1 });

// Ensure only two participants per conversation
conversationSchema.pre('save', function(next) {
    if (this.participants.length !== 2) {
        return next(new Error('Conversation must have exactly 2 participants'));
    }
    
    // Sort participants to ensure consistent ordering
    this.participants.sort();
    next();
});

// Message Schema - Individual messages within conversations
const messageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'file'],
        default: 'text'
    },
    readBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }],
    isEdited: {
        type: Boolean,
        default: false
    },
    editedAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

// Update conversation's lastMessage when a new message is created
messageSchema.post('save', async function() {
    try {
        await mongoose.model('Conversation').findByIdAndUpdate(
            this.conversation,
            {
                lastMessage: this._id,
                lastMessageTime: this.createdAt
            }
        );
    } catch (error) {
        console.error('Error updating conversation lastMessage:', error);
    }
});

// Virtual for checking if message is read by a specific user
messageSchema.methods.isReadBy = function(userId) {
    return this.readBy.some(read => read.user.toString() === userId.toString());
};

// Method to mark message as read by a user
messageSchema.methods.markAsRead = async function(userId) {
    if (!this.isReadBy(userId)) {
        this.readBy.push({
            user: userId,
            readAt: new Date()
        });
        await this.save();
    }
};

export const Conversation = mongoose.model('Conversation', conversationSchema);
export const Message = mongoose.model('Message', messageSchema);
