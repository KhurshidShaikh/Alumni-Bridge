import { userModel } from "../models/userModel.js"
import {v2 as cloudinary} from 'cloudinary'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { config } from "dotenv"
import fs from 'fs'
import crypto from 'crypto'
import { trans } from "../config/email.js"

//accessing user data 
config()

// Safely load user data
let userData = [];
try {
    if (fs.existsSync('user.json')) {
        const rowData = fs.readFileSync('user.json');
        userData = JSON.parse(rowData);
    }
} catch (error) {
    console.warn('Warning: Could not load user.json file:', error.message);
    userData = [];
}
    

//JWT TOKEN
const createToken=(id,role)=>{
    return jwt.sign({id,role},process.env.JWT_SECRET)
}

//Register
export const Register = async (req, res) => {
    try {
        const { name, email, password, role, GrNo } = req.body;
        
        // Input validation
        if (!name || !email || !password || !role || !GrNo) {
            return res.status(400).json({
                success: false,
                error: "All fields are required: name, email, password, role, and GR Number"
            });
        }

        // Validate name length
        if (name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                error: "Name must be at least 2 characters long"
            });
        }

        // Validate email format
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: "Please enter a valid email address"
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: "Password must be at least 6 characters long"
            });
        }

        // Validate role
        if (!['student', 'alumni'].includes(role)) {
            return res.status(400).json({
                success: false,
                error: "Role must be either 'student' or 'alumni'"
            });
        }

        // Validate GR Number
        if (GrNo.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: "GR Number is required"
            });
        }

        // Check if user already exists
        const userExist = await userModel.findOne({ email: email.toLowerCase() });
        if (userExist) {
            return res.status(409).json({
                success: false,
                error: 'User with this email already exists'
            });
        }

        // Check if GR Number already exists
        const grExists = await userModel.findOne({ GrNo: GrNo.trim() });
        if (grExists) {
            return res.status(409).json({
                success: false,
                error: 'User with this GR Number already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user with isVerified: false by default
        const user = await userModel.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role,
            GrNo: GrNo.trim(),
            isVerified: false, // Explicitly set to false for admin verification
            isProfileComplete: false
        });


        // Don't create token immediately - user needs admin verification first
        res.status(201).json({
            success: true,
            message: `Registration successful! Your account has been created and is pending admin verification. You will be able to login once an admin approves your account.`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }
        });

    } catch (e) {
        console.error('Registration error:', e.message);
        
        // Handle mongoose validation errors
        if (e.name === 'ValidationError') {
            const errors = Object.values(e.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: errors.join(', ')
            });
        }

        // Handle duplicate key errors
        if (e.code === 11000) {
            const field = Object.keys(e.keyValue)[0];
            return res.status(409).json({
                success: false,
                error: `${field} already exists`
            });
        }

        res.status(500).json({
            success: false,
            error: "Internal server error. Please try again later."
        });
    }
}

//Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Email and password are required"
            });
        }

        // Find user by email
        const user = await userModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Compare password FIRST before checking verification status
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Only check verification status AFTER credentials are validated
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                error: 'Your account is pending admin verification. Please wait for approval before logging in.'
            });
        }

        // Create token and send response
        const token = createToken(user._id, user.role);
        
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                isProfileComplete: user.isProfileComplete
            }
        });

    } catch (e) {
        console.error('Login error:', e.message);
        res.status(500).json({
            success: false,
            error: "Internal server error. Please try again later."
        });
    }
}


//adminLogin
export const Adminlogin =async(req,res)=>{
    try{
        const{email,password}=req.body
        if(email ===process.env.ADMIN_EMAIL && password ===process.env.ADMIN_PASSWORD){
            const user=await userModel.findOne({email:email})
            const token=createToken(user._id,user.role)
            res.json({success:true,token})
        }
        else{
            res.json({success:false,error:"wrong credential"})
        }
        
       
    }
    catch(e){
        res.json({success:false,error:e.message})
    }
}


//sending invite code 
export const inviteCodeRegister=async(req,res)=>{
    try{
       
        
        
        for(const user of userData){
        const code = [...crypto.randomBytes(8)].map(b => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[b % 62]).join('');
        user.code=code
        const mailOptions =({
            from: '"Alumni Portal" <your-email@gmail.com>',
            to: user.email,
            subject: 'Your Invite Code to Join the Alumni Portal',
            html: `
              <p>Hi ${user.name || 'there'},</p>
              <p>You're invited to join our Alumni Portal.</p>
              <p><strong>use this email for login :</strong> ${user.email}</p>
              <p><strong>Invite Code:</strong> ${code}</p>
              <p>– Alumni Team</p>
            `
          });
           
          
          await trans.sendMail(mailOptions)
        }
          
           fs.writeFileSync('user.json',JSON.stringify(userData,null,2))
          return res.json({success:true ,msg:'mail send successfully '})
        
    }
    catch(e){
        return res.json({success:true, error:e.message })
    }
}


//login through invidte code 
export const inviteCodeLogin=async(req,res)=>{
    try{
        const {email,code}=req.body 
        const user=userData.filter(b=>b.email === email &&  b.code=== code)

        if(user.length<=0)return res.json({success:false,error:'please use your correct email or invite code '})
        const salt=await bcrypt.genSalt(10)
        for(const u of user){
            const user=await userModel.create(
                {
                    
                    name: u.name,
                    email: email,
                    password:await bcrypt.hash(code,salt), // Optional for OAuth
                    GrNo:u.GrNo,
                  
                    role:'alumni',
                    isVerified: true,
                    isProfileComplete: true,
                    profile: {
                    avatarUrl:u.profile.avatarUrl,
                    bio: u.profile.bio,
                    phone: u.profile.phone,
                    linkedin: u.profile.linkedin,
                    github: u.profile.github,
                    website: u.profile.website,
                    resumeUrl: u.profile.resumeUrl,
                    location: u.profile.location,
                   
                    currentCompany: u.profile.currentCompany,
                    currentPosition: u.profile.currentPosition,
                    branch: u.profile.branch,
                    batch: u.profile.batch,
                    graduationYear: u.profile.graduationYear,
                    }
                    
                   }
            )
            const token=createToken(user._id,user.role)
            res.json({success:true,token})
        }
        
    }
    catch(e){
        res.json({success:false,error:e.message })
    }
}



export const verifyUser=async(req,res)=>{
    try{
      
        if(req.adminId.role !=='admin')return('ONLY ADMIN CAN PERFORM THIS OPERATION')
        const id=req.params.id
        const user=await userModel.findOneAndUpdate({_id:id},{$set:{isVerified:true}},{new:true})
        return res.json({success:true ,msg:"user verified successfully"})
    }
    catch(e){
        res.json({success:false,error:e.message})
    }
}


//get loggedIn user profile 

export const getProfile=async(req,res)=>{
    try{
        
        const user=await userModel.findOne({_id:req.userId.id})
        res.json({success:true,profile:user.profile})
    }
    catch(e){
        res.json({success:false,error:e.message})
    }
}