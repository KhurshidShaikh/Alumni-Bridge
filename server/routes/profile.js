import express from 'express'
import { AuthUser } from '../middlewere/userAuth.js'
import { upload } from '../middlewere/multer.js'
import { filterSearch, searchProfile, setProfile, updateProfile } from '../controllers/manageProfile.js'
import { AuthAlumni } from '../middlewere/AlumniAuth.js'
export const profileRoute=express.Router()

//add profile data 
profileRoute.post('/create',AuthUser,upload.single('avatarUrl'),setProfile)
profileRoute.put('/update',AuthUser,upload.single('avatarUrl'),updateProfile)
profileRoute.get('/search',AuthUser,searchProfile)
profileRoute.get('/searchFilter',AuthUser,filterSearch)

