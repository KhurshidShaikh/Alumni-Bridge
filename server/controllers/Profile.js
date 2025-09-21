import { userModel } from "../models/userModel.js"
import mongoose from "mongoose"

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId
        const { profile } = req.body

        // Input validation
        if (!profile) {
            return res.status(400).json({
                success: false,
                error: "Profile data is required"
            })
        }

        // Find user
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            })
        }

        // Validate required fields based on role
        const errors = []

        if (!profile.bio?.trim()) {
            errors.push("Bio is required")
        }

        if (!profile.phone?.trim()) {
            errors.push("Phone number is required")
        }

        if (!profile.location?.trim()) {
            errors.push("Location is required")
        }

        if (!profile.branch?.trim()) {
            errors.push("Branch is required")
        }


        // Role-specific validations
        if (user.role === 'alumni') {
            if (!profile.currentCompany?.trim()) {
                errors.push("Current company is required for alumni")
            }
            if (!profile.currentPosition?.trim()) {
                errors.push("Current position is required for alumni")
            }
        }

       

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                error: errors.join(", ")
            })
        }

        // Update user profile
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                $set: {
                    profile: {
                        ...user.profile,
                        ...profile
                    },
                    // Update grNo if provided
                    ...(profile.grNo !== undefined && { grNo: profile.grNo }),
                    isProfileComplete: true
                }
            },
            { new: true, runValidators: true }
        ).select('-password')

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        })

    } catch (error) {
        console.error('Profile update error:', error.message)
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message)
            return res.status(400).json({
                success: false,
                error: errors.join(', ')
            })
        }

        res.status(500).json({
            success: false,
            error: "Internal server error. Please try again later."
        })
    }
}

// Get user profile
// Get current user's profile (for /me endpoint)
export const getCurrentUserProfile = async (req, res) => {
    try {
        const userId = req.userId // From auth middleware
        
        const user = await userModel.findById(userId).select('-password')
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        console.error('Get current user profile error:', error.message)
        res.status(500).json({
            success: false,
            error: "Internal server error"
        })
    }
}

// Get user profile by ID
export const getProfile = async (req, res) => {
    try {
        const { userId } = req.params
        
        const user = await userModel.findById(userId).select('-password')
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        console.error('Get profile error:', error.message)
        res.status(500).json({
            success: false,
            error: "Internal server error"
        })
    }
}

// Get all alumni profiles for directory
export const getAllAlumni = async (req, res) => {
    try {
        const { batch, branch, search, limit = 50, page = 1 } = req.query
        
        // Build filter query
        let filter = { 
            role: 'alumni',
            isVerified: true // Only show verified alumni
        }
        
        // Add batch filter if provided
        if (batch && batch !== 'All') {
            filter.batch = parseInt(batch)
        }
        
        // Add branch filter if provided
        if (branch && branch !== 'All') {
            filter['profile.branch'] = branch
        }
        
        // Build search query
        let searchQuery = {}
        if (search) {
            searchQuery = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { 'profile.currentCompany': { $regex: search, $options: 'i' } },
                    { 'profile.currentPosition': { $regex: search, $options: 'i' } },
                    { 'profile.location': { $regex: search, $options: 'i' } }
                ]
            }
        }
        
        // Combine filters
        const finalQuery = { ...filter, ...searchQuery }
        
        // Calculate pagination
        const skip = (page - 1) * limit
        
        // Fetch alumni with pagination
        const alumni = await userModel
            .find(finalQuery)
            .select('-password -isVerified -createdAt -updatedAt')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ 'profile.currentCompany': 1, name: 1 })
        
        // Get total count for pagination
        const totalCount = await userModel.countDocuments(finalQuery)
        
        res.status(200).json({
            success: true,
            alumni,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                hasNextPage: page * limit < totalCount,
                hasPrevPage: page > 1
            }
        })

    } catch (error) {
        console.error('Get alumni error:', error.message)
        res.status(500).json({
            success: false,
            error: "Internal server error"
        })
    }
}

// Get single user profile by ID (alumni or student)
export const getAlumniProfile = async (req, res) => {
    try {
        const { alumniId } = req.params
        
        console.log('Fetching user profile for ID:', alumniId)
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(alumniId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid user ID format"
            })
        }
        
        // Find user (alumni or student)
        const user = await userModel
            .findOne({ 
                _id: alumniId,
                isVerified: true // Only show verified users
            })
            .select('-password')
        
        console.log('User found:', user ? 'Yes' : 'No')
        if (user) {
            console.log('User role:', user.role)
            console.log('User verified:', user.isVerified)
        }
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User profile not found or not verified"
            })
        }

        // Return the user profile (works for both alumni and students)
        res.status(200).json({
            success: true,
            alumni: user // Keep the same response structure for frontend compatibility
        })

    } catch (error) {
        console.error('Get user profile error:', error.message)
        res.status(500).json({
            success: false,
            error: "Internal server error"
        })
    }
}
