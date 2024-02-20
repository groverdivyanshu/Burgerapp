import mongoose, { Mongoose } from "mongoose";
import jwt from "jsonwebtoken"
import  bcrypt from "bcrypt"

const schema=new mongoose.Schema({

name:String,
role:{
    type:String,
    enum:["admin","user"],
    default:"user"

},
email:{
    type:String,
    required:true
},
createdAt:{
    type:Date,
    default:Date.now
},
password:{
    type:String,
    required:true
}

});


schema.pre("save", async function (next) {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  
    next();
  });
 
  schema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id,name:this.name }, process.env.JWT_SECRET);
  };
  schema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };


export const User=mongoose.model("User",schema)