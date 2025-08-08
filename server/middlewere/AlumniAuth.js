import jwt from 'jsonwebtoken'
export const AuthAlumni=(req,res,Next)=>{
    const {token}=req.headers
    try{
        if(!token){
            res.json({success:false,msg:"NOT AUTHORIZE LOGIN AGAIN"})
        }
        else{
            const token_decode=jwt.verify(token,process.env.JWT_SECRATE)
            if(token_decode.role !=='alumni')return   res.json({success:false,msg:"THIS IS ONLY ACCESS BY ALUMNI"})
            console.log(token_decode)
            req.alumniId=token_decode
            Next()
        }

    }
    catch(e){
        console.log(e.message)
    }
}