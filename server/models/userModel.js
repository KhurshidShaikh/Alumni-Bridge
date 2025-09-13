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
    profile: {
      avatarUrl: String,
      bio: String,
      phone: String,
      linkedin: String,
      github: String,
      website: String,
      resumeUrl: String,
      location: String,
      currentCompany: String,
      currentPosition: String,
      branch: String,
      batch: Number,
      graduationYear: Number,
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