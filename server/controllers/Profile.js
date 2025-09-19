import { userModel } from "../models/userModel.js"

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

        if (!profile.graduationYear) {
            errors.push("Graduation year is required")
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

        if (user.role === 'student') {
            if (!profile.batch) {
                errors.push("Batch is required for students")
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
                        ...profile,
                        // Convert string numbers to actual numbers
                        batch: profile.batch ? Number(profile.batch) : user.profile?.batch,
                        graduationYear: profile.graduationYear ? Number(profile.graduationYear) : user.profile?.graduationYear
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
export const getProfile = async (req, res) => {
    try {
        const userId = req.userId
        
        const user = await userModel.findById(userId).select('-password')
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            user: user
        })

    } catch (error) {
        console.error('Get profile error:', error.message)
        res.status(500).json({
            success: false,
            error: "Internal server error. Please try again later."
        })
    }
}
