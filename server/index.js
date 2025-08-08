
import express from  'express'
import {ConnectCloudinary} from './config/cloudinary.js'
import { config } from 'dotenv'
import fs from 'fs'
const app=express()
import cors from 'cors'
import { ConnectDB } from './config/mongoDB.js'
import { Auth } from './routes/auth.js'

config()
ConnectCloudinary()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())


app.use('/api/auth/',Auth)

ConnectDB()
console.log(process.env.MONGO_URL)
app.get('/',(req,res)=>{
    res.json('landing page is here ')
})

app.listen(3000,()=>{
    console.log('http://localhost:3000')
})
