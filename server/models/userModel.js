import mongoose from "mongoose";

const userSchema=mongoose.Schema(
  {
    
    name: String,
    email: { type: String, unique: true,  },
    password: { type: String }, // Optional for OAuth
    GrNo:{
     type:String,
     minLength:11 
    },
    authProvider: { type: String, enum: ['email', 'google', 'linkedin'], default: 'email' },
    role: { type: String, enum: ['student', 'alumni', 'admin'], default: 'student' },
    isVerified: { type: Boolean, default: false }, // Email or admin-verified
    isProfileComplete: { type: Boolean, default: false },
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
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'connection' }], // accepted connections
    createdAt: Date,
    updatedAt: Date
   }
      
)
export const userModel=mongoose.model('user',userSchema)