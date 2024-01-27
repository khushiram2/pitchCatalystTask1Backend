const { default: mongoose } = require("mongoose")




module.exports={
    connectDb:async()=>{
        try {    
            await mongoose.connect(process.env.DB_URL)
            console.log("db connected via mongoose")
        } catch (error) {
            console.log(error)
        }
        
    }
}