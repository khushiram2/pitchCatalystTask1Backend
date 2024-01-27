const mongoose = require("mongoose")
const bcrypt=require("bcryptjs")
const AdminSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true}
})


AdminSchema.pre("save",async function(next){
    if(this.isModified("password")){
        try {
            this.password= await bcrypt.hash(this.password,10)
            next()
        } catch (error) {
            console.log(error)
        }
    }
    next()
})

const AdminModel=mongoose.model("Admin",AdminSchema)
module.exports = {AdminModel}