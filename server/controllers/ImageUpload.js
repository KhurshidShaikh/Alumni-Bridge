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
