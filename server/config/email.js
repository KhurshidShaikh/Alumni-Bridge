import nodemailer from 'nodemailer'
import { config } from 'dotenv';
config()
export const trans= nodemailer.createTransport({      
    service:"gmail",
    auth: {
      user: process.env.EMAIL, 
      pass: process.env.PASSWORD
    }
  });