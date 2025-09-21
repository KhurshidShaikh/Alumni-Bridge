
import express from  'express'
import {ConnectCloudinary} from './config/cloudinary.js'
import { config } from 'dotenv'
import fs from 'fs'
import { createServer } from 'http'
const app=express()
const server = createServer(app)
import cors from 'cors'
import { ConnectDB } from './config/mongoDB.js'
import { Auth } from './routes/auth.js'
import { profileRoute } from './routes/profile.js'
import { eventRoute } from './routes/Event.js'
import { imageUploadRoute } from './routes/imageUpload.js'
import { connectionRoute } from './routes/connection.js'
import { messageRoute } from './routes/message.js'
import { setupSocket } from './config/socket.js'

config()
ConnectCloudinary()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Setup Socket.IO
setupSocket(server);

app.use('/api/auth/',Auth)
app.use('/api/profile',profileRoute)
app.use('/api/event',eventRoute)
app.use('/api/upload',imageUploadRoute)
app.use('/api/connections',connectionRoute)
app.use('/api/messages',messageRoute)
ConnectDB()
app.get('/',(req,res)=>{
    res.json('landing page is here ')
})

server.listen(3000,()=>{
    console.log('http://localhost:3000')
    console.log('Socket.IO server is running')
})
