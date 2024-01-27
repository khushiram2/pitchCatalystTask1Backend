const mongoose = require("mongoose")

const contractschema=new mongoose.Schema({
    adminId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:"Admin"},
    subUsers:[{type:mongoose.Schema.Types.ObjectId,ref:"SubUser"}],
    filename:{type:String,required:true},
    name:{type:String,required:true},
},{timestamps:true})


 const contractModel=mongoose.model("Contract",contractschema)

 
 module.exports={contractModel}