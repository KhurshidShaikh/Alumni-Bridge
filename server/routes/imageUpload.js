import express from 'express'
import { AuthUser } from '../middlewere/userAuth.js'
import { upload, uploadProfileImage } from '../controllers/ImageUpload.js'

export const imageUploadRoute = express.Router()

// Upload profile image
imageUploadRoute.post('/profile', AuthUser, upload.single('profileImage'), uploadProfileImage)
