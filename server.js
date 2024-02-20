import app from "./app.js";
import Razorpay from "razorpay"
import dotenv from "dotenv";

import {connectDB} from "./config/database.js"

connectDB();
dotenv.config({
    path:"./config/config.env",
});

export const instance = new Razorpay({ key_id:process.env.RAZORPAY_API_KEY , key_secret: process.env.RAZORPAY_API_SECRET  });



app.get("/",(req,res,next)=>{

    res.send("<h1>Working</h1>")
})

app.listen(process.env.Port,()=>console.log(`server is working on  Port: ${process.env.PORT}`));
