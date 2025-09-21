import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 100
    },
    email: { 
      type: String, 
      unique: true, 
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: { 
      type: String, 
      required: true,
      minLength: 6
    },
    GrNo: {
      type: String,
      required: true,
      trim: true,
    },
    authProvider: { 
      type: String, 
      enum: ['email', 'google', 'linkedin'], 
      default: 'email' 
    },
    role: { 
      type: String, 
      enum: ['student', 'alumni', 'admin'], 
      required: true
    },
    isVerified: { 
      type: Boolean, 
      default: false 
    }, // Admin-verified for students/alumni
    isProfileComplete: { 
      type: Boolean, 
      default: false 
    },
    batch: { type: Number, min: 1900, max: 2050 },
    profile: {
      bio: { type: String },
      phone: { type: String },
      linkedin: { type: String },
      github: { type: String },
      website: { type: String },
      location: { type: String },
      branch: { type: String },
      currentCompany: { type: String },
      currentPosition: { type: String },
      profileUrl: { type: String },
      avatarUrl: String,
      resumeUrl: String,
    },
    connections: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'connection' 
    }], // accepted connections
  },
  {
    timestamps: true // This automatically adds createdAt and updatedAt
  }
)
export const userModel=mongoose.model('user',userSchema)