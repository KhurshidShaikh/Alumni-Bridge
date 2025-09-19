import express from 'express'
import { AuthUser } from '../middlewere/userAuth.js'
import { upload } from '../middlewere/multer.js'
import { filterSearch, searchProfile, setProfile, updateProfile as manageUpdateProfile } from '../controllers/manageProfile.js'
import { updateProfile, getProfile } from '../controllers/Profile.js'
import { AuthAlumni } from '../middlewere/AlumniAuth.js'
export const profileRoute=express.Router()

//add profile data 
profileRoute.post('/create',AuthUser,upload.single('avatarUrl'),setProfile)
profileRoute.put('/update',AuthUser,updateProfile)
profileRoute.put('/updateWithImage',AuthUser,upload.single('avatarUrl'),manageUpdateProfile)
profileRoute.get('/me',AuthUser,getProfile)
profileRoute.get('/search',AuthUser,searchProfile)
profileRoute.get('/searchFilter',AuthUser,filterSearch)

