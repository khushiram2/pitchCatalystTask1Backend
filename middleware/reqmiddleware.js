const { verify } = require("jsonwebtoken")



module.exports = {
    verifyAdminToken: async (req, res, next) => {
        try {
            
            const Btoken = req.headers.authorization
            const token=Btoken.slice(Btoken.indexOf(" ")+1,Btoken.length)
            const valid = await verify(token, process.env.SECRET_key)
            if (!valid) return res.send({ status: false, message: "invalid req" })
            req.adminId = valid.id
            next()

        } catch (error) {
            console.log(error)
            res.send({status:false,message:"internal server error"})
        }

    }
}