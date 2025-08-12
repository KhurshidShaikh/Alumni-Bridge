import { error, profile } from "console";
import { userModel } from "../models/userModel.js";
import {v2 as cloudinary} from 'cloudinary'


// set the profile 
export const setProfile=async(req,res)=>{
    try{
        const {
            
            bio,
            phone,
            linkedin,
            github,
            website,
            resumeUrl,
            location,
            currentCompany,
            currentPosition,
            branch,
            batch,
            graduationYear
          } = req.body;
      
         
          const {avatarUrl}=req.file || req.body 
          console.log(avatarUrl)
          
          const profile =await userModel.findOneAndUpdate({_id:req.userId.id},
            {
                $set:{
                    profile: {
                        avatarUrl: (await cloudinary.uploader.upload(avatarUrl)).secure_url,
                        bio: bio,
                        phone: phone,
                        linkedin: linkedin,
                        github: github,
                        website: website,
                        resumeUrl: resumeUrl,
                        location: location,
                       
                        currentCompany: currentCompany,
                        currentPosition: currentPosition,
                        branch: branch,
                        batch: batch,
                        graduationYear: graduationYear,
                        },
                        isProfileComplete:true
                },
               
            },
            {new:true}
          )
          console.log(profile)
          return res.json({success:true ,profile:profile.profile})
    }
    catch(e){
        console.log(e)
        return res.json({success:false
                        ,error:e.message})
    }
}

//update the profile 
export const updateProfile = async (req, res) => {
  try {
    const {
      bio,
      phone,
      linkedin,
      github,
      website,
      resumeUrl,
      location,
      currentCompany,
      currentPosition,
      branch,
      batch,
      graduationYear
    } = req.body;

    const avatarUrl = req.body.avatarUrl || (req.file ? req.file.path : null);

    const user = await userModel.findOne({ _id: req.userId.id });
    const updatedFields = [];

    if (avatarUrl) {
      user.profile.avatarUrl = (await cloudinary.uploader.upload(avatarUrl)).secure_url;
      updatedFields.push("avatarUrl");
    }

    if (bio) {
      user.profile.bio = bio;
      updatedFields.push("bio");
    }

    if (phone) {
      user.profile.phone = phone;
      updatedFields.push("phone");
    }

    if (linkedin) {
      user.profile.linkedin = linkedin;
      updatedFields.push("linkedin");
    }

    if (github) {
      user.profile.github = github;
      updatedFields.push("github");
    }

    if (website) {
      user.profile.website = website;
      updatedFields.push("website");
    }

    if (resumeUrl) {
      user.profile.resumeUrl = resumeUrl;
      updatedFields.push("resumeUrl");
    }

    if (location) {
      user.profile.location = location;
      updatedFields.push("location");
    }

    if (currentCompany) {
      user.profile.currentCompany = currentCompany;
      updatedFields.push("currentCompany");
    }

    if (currentPosition) {
      user.profile.currentPosition = currentPosition;
      updatedFields.push("currentPosition");
    }

    if (branch) {
      user.profile.branch = branch;
      updatedFields.push("branch");
    }

    if (batch) {
      user.profile.batch = batch;
      updatedFields.push("batch");
    }

    if (graduationYear) {
      user.profile.graduationYear = graduationYear;
      updatedFields.push("graduationYear");
    }

    if (updatedFields.length === 0) {
      return res.json({ success: false, msg: "No valid fields provided to update" });
    }

    await user.save();

    return res.json({
      success: true,
      msg: `your profile is updated success`
    });

  } catch (e) {
    console.log(e.message);
    res.json({ success: false, error: e.message });
  }
};


//search profile by name 
export const searchProfile=async(req,res)=>{
  try{
    const{name}=req.query
    console.log(name)
    const user=await userModel.find({name:name})
    res.json({success:true,user})

  }
  catch(e){
    console.log(e.message)
    return res.json({success:false,error:e.message})
  }
}


//filter
export const filterSearch=async(req,res)=>{
  try{
    
    const { location, currentPosition, branch, batch } = req.query;
    console.log(branch)
    const filterAlumni=[]

    if(location){
      filterAlumni.push(userModel.find({
        "profile.location":{$regex: location, $options: "i"},
        role:"alumni"
      }))
    }
    if(currentPosition){
      filterAlumni.push(userModel.find({
        "profile.currentPosition":{$regex: currentPosition, $options: "i"},
        role:"alumni"
      }))
    }
    if(branch){
     filterAlumni.push(await userModel.find({
      "profile.branch": {$regex: branch, $options: "i"} ,
      role:"alumni"
     }))
     
     
    }

    if(batch){
      filterAlumni.push(await userModel.find({
        "profile.batch":batch,
        role:"alumni"
      }))
    }

    res.json({success:true,filterAlumni})
  }
  catch(e){
    console.log(e.message)
    res.json(e.message)
  }
}
