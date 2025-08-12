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


    const rowData=fs.readFileSync('user.json')
    const userData=JSON.parse(rowData)
    

//JWT TOKEN
const createToken=(id,role)=>{
    return jwt.sign({id,role},process.env.JWT_SECRATE)
}
//Register
export const Register=async(req,res)=>{
   try{
        const{name,email,password,role,GrNo}=req.body
        console.log(email)

        if(email &&password && role && GrNo && name){
            const userExist=await userModel.findOne({email:email})
            if(userExist)return res.json({success:false,error:'user is already Exist'});
            const salt=await bcrypt.genSalt(10)
            const hash=await bcrypt.hash(password,salt)
            const user=await userModel.create({
                name,
                email,
                password:hash,
                role,
                GrNo
            })
            console.log(user)
            const token =createToken(user._id,user.role)
            console.log(token)
            res.json({success:true,token})





        }
        else{
            return res.json({success:false,error:"please enter the all yours details"})
        }
   }
   catch(e){
    res.json({success:false,error:e.message})
   }


}

//Login

export const login =async(req,res)=>{
    try{
        const{email,password}=req.body
        const user=await userModel.findOne({email}) 
        if(!user)return res.json({success:false,error:'user not found'});
        const isMatch=bcrypt.compare(password,user.password)
        if(isMatch){
            const token=createToken(user._id,user.role)
            console.log(token)
            res.json({success:true,token})
        }
    }
    catch(e){
        res.json({success:false,error:e.message})
    }
}


//adminLogin
export const Adminlogin =async(req,res)=>{
    try{
        const{email,password}=req.body
        if(email ===process.env.ADMIN_EMAIL && password ===process.env.ADMIN_PASSWORD){
            const user=await userModel.findOne({email:email})
            const token=createToken(user._id,user.role)
            console.log(token)
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
        console.log(email)
        console.log(code)
        const user=userData.filter(b=>b.email === email &&  b.code=== code)
        console.log(user.length)

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
        console.log(e.message)
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