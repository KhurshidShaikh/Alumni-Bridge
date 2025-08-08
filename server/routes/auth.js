import express, { Router } from 'express'
import { Adminlogin, getProfile, inviteCodeLogin, inviteCodeRegister, login, Register, verifyUser } from '../controllers/Authentication.js'
import { AuthAdmin } from '../middlewere/AdminAuth.js'
import { AuthUser } from '../middlewere/userAuth.js'

export const Auth=express.Router()

Auth.post('/register',Register)
Auth.post('/login',login)
Auth.post('/sendInvite',inviteCodeRegister)
Auth.post('/inviteCodeLogin',inviteCodeLogin)
Auth.post('/adminLogin',Adminlogin)
Auth.post('/verifyUser/:id',AuthAdmin,verifyUser)
Auth.get('/getProfile/:id',AuthUser,getProfile)
