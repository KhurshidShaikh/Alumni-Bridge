import mongoose from "mongoose";

// Connection Request Schema
const connectionRequestSchema = mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending'
    },
    message: {
      type: String,
      maxLength: 300,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Connection Schema (for established connections)
const connectionSchema = mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    connectionType: {
      type: String,
      enum: ['alumni', 'colleague', 'mentor', 'mentee', 'friend', 'other'],
      default: 'alumni'
    },
    connectedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better performance
connectionRequestSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });
connectionRequestSchema.index({ toUser: 1, status: 1 });
connectionRequestSchema.index({ fromUser: 1, status: 1 });

connectionSchema.index({ user1: 1, user2: 1 }, { unique: true });
connectionSchema.index({ user1: 1 });
connectionSchema.index({ user2: 1 });

// Ensure no duplicate connections (user1-user2 or user2-user1)
connectionSchema.pre('save', function(next) {
  // Ensure user1 is always the "smaller" ObjectId to prevent duplicates
  if (this.user1.toString() > this.user2.toString()) {
    [this.user1, this.user2] = [this.user2, this.user1];
  }
  next();
});

export const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);
export const Connection = mongoose.model('Connection', connectionSchema);
