import { User } from "../models/User.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken"

export const isAuthenticated= (req,res,next)=>{
    try{

    const {token }=req.cookies;

    if(!token){
return next(new ErrorHandler("Not Logged In",401));
    }
    
  const decoded= jwt.verify(token,process.env.JWT_SECRET);

  req.user= User.findById(decoded._id);


   next();
}catch(err)
{
  
    res.status(500).json({
        succes:false,
        message:err.message
    })
}
}

export const authorizeAdmin=(req,res,next)=>{

   if(req.user.role!=="admin")
   {
    return next(new ErrorHandler("Only Admin Allowed",405));
   }

   next();
}

