import express from 'express'
import { createEvent, getEvent } from '../controllers/Event.js'
import { AuthAdmin } from '../middlewere/AdminAuth.js'
import { upload } from '../middlewere/multer.js'
import { AuthUser } from '../middlewere/userAuth.js'

export const eventRoute=express.Router()

eventRoute.post('/create',AuthAdmin,upload.single('imageUrl'),createEvent)
eventRoute.get('/get',AuthUser,getEvent)

