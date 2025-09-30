import express from 'express'
import { AuthUser } from '../middlewere/userAuth.js'
import { AuthAdmin } from '../middlewere/AdminAuth.js'
import { upload, uploadProfileImage, uploadPostImages, uploadGenericImage } from '../controllers/ImageUpload.js'

export const imageUploadRoute = express.Router()

// Upload profile image
imageUploadRoute.post('/profile', AuthUser, upload.single('profileImage'), uploadProfileImage)

// Upload post images (multiple images)
imageUploadRoute.post('/post-images', AuthUser, upload.array('images', 5), uploadPostImages)

// Upload generic image (for admin use - events, etc.)
imageUploadRoute.post('/image', AuthAdmin, upload.single('image'), uploadGenericImage)
