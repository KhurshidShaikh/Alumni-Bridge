import jwt from 'jsonwebtoken'
export const AuthAdmin=(req,res,Next)=>{
    const {token}=req.headers
    try{
        if(!token){
            res.json({success:false,msg:"NOT AUTHORIZE LOGIN AGAIN"})
        }
        else{
            const token_decode=jwt.verify(token,process.env.JWT_SECRATE)
            console.log(token_decode)
            if(token_decode.role !=='admin')return   res.json({success:false,msg:"THIS IS ONLY ACCESS BY admin"})
            console.log(token_decode)
            req.adminId=token_decode
            Next()
        }

    }
    catch(e){
        console.log(e.message)
    }
}