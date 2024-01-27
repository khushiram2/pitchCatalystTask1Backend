const mongoose = require("mongoose")


const subUserSchema=new mongoose.Schema({
adminId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:"Admin"},
name:{type:String,required:true},
email:{type:String,required:true},
link:{type:String},
image:{type:String},
contractId:{type:mongoose.Schema.Types.ObjectId,ref:"Contract"},
signed:{type:Boolean,default:false},
},{timestamps:true})

 const subUserModel=mongoose.model("SubUser",subUserSchema)

 module.exports={subUserModel}