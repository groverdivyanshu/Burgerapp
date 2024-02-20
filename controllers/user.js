import { asyncError } from "../middlewares/errorMiddleware.js";
import { User } from "../models/User.js";
import {Order} from "../models/Order.js"
export const myProfile=(req,res,next)=>{

    res.status(200).json({
        success:true,
        user:req.user,
    })

}

export const register=async (req,res,next)=>{
    try{

    const{name,email,password}=req.body

    let user=await User.findOne({email});
    if(user)
    {
       return res.status(400).json({
            success:false,
            message:"User already exist"
        })
    }
     user=await User.create(req.body)

     const token=user.generateToken();

     const options={
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly:true
     }
res.status(200).cookie("token",token,options).json({
    user,
    token
})
    }catch(err)
    {
      res.status(500).json({
            success:false,
            message:err.message
 })    }
     


}

export const login=async (req,res,next)=>{
    try{
    
const {name,email,password}=req.body


const user=await User.findOne({email}).select("+password")

if(!user)
{
    return res.status(400).json({
        success:false,
        message:"User does not exist"
    })
}

const isMatch=await user.matchPassword(String(password));


if(!isMatch)
{
    return res.status(400).json({
    success:false,
    message:"Password does not match"
 })

}
const token=user.generateToken();

const options={
    expires:new Date(Date.now()+90 * 24 * 60 * 60 * 1000),
    httpOnly:true,
}

res.status(200).cookie("token",token,options).json({
    success:true,
    message:"Successful login"
})

    }catch(err)
    {
res.status(500).json({
    success:false,
    message:err.message
})
    }



}
export const logout=(req,res,next)=>{

//     req.session.destroy((err)=>{
// // if(err) return next(err);

// res.clearCookie("connect.sid",{
//     secure:process.env.NODE_ENV==="development"?false:true,
//     httpOnly:process.env.NODE_ENV==="development"?false:true,
//     sameSite:process.env.NODE_ENV==="development"?false:"none",
// });
// res.status(200).json({
//     message:"Logged Out",
// })
try{
res.status(200).
cookie("token",null,{expires:new Date(Date.now()),httpOnly:true}).json({
    success:true,
    message:"loggedout"
})
}catch(error)
{ 
    res.status(500).json({
        success:false,
        message:error.message,
    })

}
}

export const getAdminUsers=asyncError(async(req,res,next)=>{
const users=await User.find({});

res.status(200).json({
    success:true,
    users,
})

});

export const getAdminStats=asyncError(async(req,res,next)=>{
    const usersCount=await User.countDocuments();

    const orders=await Order.find({});

    const preparingOrders=orders.filter(i=>i.orderStatus==="Prepairing");
    
    const shippedOrders=orders.filter(i=>i.orderStatus==="Shipped");
    
    const deliveredOrders=orders.filter(i=>i.orderStatus==="Delivered");

    let totalIncome=0;
    
    orders.forEach(i=>totalIncome+=i.totalAmount);
    
    res.status(200).json({
        success:true,
        usersCount,
        ordersCount:{
            total:orders.length,
            preparing:preparingOrders.length,
            shipped:shippedOrders.length,
            delivered:deliveredOrders.length
        },
        totalIncome
    })
    
    });
    
