import { cloudinary } from '../config/cloudinary.js'
import multer from 'multer'

// Configure multer for memory storage
const storage = multer.memoryStorage()
export const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Only image files are allowed'), false)
        }
    }
})

// Upload image to Cloudinary
export const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No image file provided'
            })
        }

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'image',
                    folder: 'alumni_bridge/profiles',
                    transformation: [
                        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
                        { quality: 'auto', fetch_format: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(result)
                    }
                }
            ).end(req.file.buffer)
        })

        res.status(200).json({
            success: true,
            imageUrl: result.secure_url,
            publicId: result.public_id
        })

    } catch (error) {
        console.error('Image upload error:', error)
        
        if (error.message === 'Only image files are allowed') {
            return res.status(400).json({
                success: false,
                error: 'Only image files are allowed'
            })
        }

        if (error.http_code === 400) {
            return res.status(400).json({
                success: false,
                error: 'Invalid image file or file too large'
            })
        }

        res.status(500).json({
            success: false,
            error: 'Failed to upload image. Please try again.'
        })
    }
}

// Upload multiple images for posts
export const uploadPostImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No image files provided'
            })
        }

        // Upload all images to Cloudinary
        const uploadPromises = req.files.map(file => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'image',
                        folder: 'alumni_bridge/posts',
                        transformation: [
                            { width: 800, height: 600, crop: 'limit' },
                            { quality: 'auto', fetch_format: 'auto' }
                        ]
                    },
                    (error, result) => {
                        if (error) {
                            reject(error)
                        } else {
                            resolve({
                                url: result.secure_url,
                                publicId: result.public_id
                            })
                        }
                    }
                ).end(file.buffer)
            })
        })

        const uploadResults = await Promise.all(uploadPromises)

        res.status(200).json({
            success: true,
            images: uploadResults.map(result => result.url),
            publicIds: uploadResults.map(result => result.publicId)
        })

    } catch (error) {
        console.error('Post images upload error:', error)
        
        res.status(500).json({
            success: false,
            error: 'Failed to upload images. Please try again.'
        })
    }
}

// Upload generic image (for admin use - events, etc.)
export const uploadGenericImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No image file provided'
            })
        }

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'image',
                    folder: 'alumni_bridge/events',
                    transformation: [
                        { width: 1200, height: 800, crop: 'limit' },
                        { quality: 'auto', fetch_format: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(result)
                    }
                }
            ).end(req.file.buffer)
        })

        res.status(200).json({
            success: true,
            imageUrl: result.secure_url,
            publicId: result.public_id
        })

    } catch (error) {
        console.error('Generic image upload error:', error)
        
        if (error.message === 'Only image files are allowed') {
            return res.status(400).json({
                success: false,
                error: 'Only image files are allowed'
            })
        }

        if (error.http_code === 400) {
            return res.status(400).json({
                success: false,
                error: 'Invalid image file or file too large'
            })
        }

        res.status(500).json({
            success: false,
            error: 'Failed to upload image. Please try again.'
        })
    }
}
