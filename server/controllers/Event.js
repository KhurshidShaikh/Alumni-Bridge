import { EventModel } from "../models/Event.js";
import {v2 as cloudinary} from 'cloudinary'
import { userModel } from "../models/userModel.js";

export const createEvent=async(req,res)=>{
    try{
        const {title,des,date,location,visibility}=req.body
        const imageUrl= req.body.imageUrl || (req.file ? req.file.path : null);

        const event=await EventModel.create({
        title,
        description: des,
        date,
        location,
        imageUrl:(await cloudinary.uploader.upload(imageUrl)).secure_url,
        createdBy: req.adminId.id,
        
        visibility
    
        })

        console.log(event)
        return res.json({success:true,event})
    }
    catch(e){
        console.log(e.message)
        res.json({success:false,error:e.message})
    }
}


export const getEvent=async(req,res)=>{
    try{
        const Events=await EventModel.find({
            visibility:"public"
        })
        console.log(Events)
        res.json({success:true,Events})
    }
    catch(e){
        console.log(e.message)
        res.json({success:false,error:e.message})
    }
}