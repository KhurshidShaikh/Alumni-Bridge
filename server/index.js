
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
import { jobRoute } from './routes/job.js'
import postRoutes from './routes/postRoutes.js'
import adminRoutes from './routes/admin.js'
import chatbotRoutes from './routes/chatbotRoutes.js'
import { setupSocket } from './config/socket.js'

// Import models to ensure they're registered with Mongoose
import './models/Event.js'
import './models/userModel.js'

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
app.use('/api/jobs',jobRoute)
app.use('/api/posts',postRoutes)
app.use('/api/admin',adminRoutes)
app.use('/api/chatbot',chatbotRoutes)
ConnectDB()
app.get('/',(req,res)=>{
    res.json('landing page is here ')
})

// Test endpoint to add a sample event
app.post('/api/test/add-event', async (req, res) => {
    try {
        const { EventModel } = await import('./models/Event.js');
        const { userModel } = await import('./models/userModel.js');

        // Create a test user if none exists
        let testUser = await userModel.findOne({ email: 'test@admin.com' });
        if (!testUser) {
            testUser = await userModel.create({
                name: 'Test Admin',
                email: 'test@admin.com',
                password: 'password123',
                role: 'admin',
                isVerified: true
            });
        }

        // Create a test event
        const testEvent = await EventModel.create({
            title: 'Test Alumni Meetup',
            description: 'A test event to verify the events system is working',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            location: 'Virtual Event',
            visibility: 'public',
            createdBy: testUser._id,
            imageUrl: ''
        });

        res.json({
            success: true,
            message: 'Test event created',
            event: testEvent
        });
    } catch (error) {
        console.error('Error creating test event:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

server.listen(3000,()=>{
    console.log('http://localhost:3000')
    console.log('Socket.IO server is running')
})
