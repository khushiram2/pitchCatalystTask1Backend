const { verify } = require("jsonwebtoken");
const { subUserModel } = require("../models/subuserModel");
const { default: axios } = require("axios");
const FormData = require("form-data");
const { createpdf } = require("../utilities/utils");
const { sendMail } = require("../nodeMailer/sendMail");
const fs = require("fs");
const path = require("path");



module.exports={
    uploadSignature:async(req,res)=>{
        const {token}=req.params
        try {
            const valid=await verify(token,process.env.SECRET_KEY)
            if(!valid)return res.send({status:false,message:"not valid"})
            if (!req.files || req.files.length === 0) {
                return res.status(400).send('No files were uploaded.');
            }
            const imageBuffer = req.files[0].buffer;
    
            const formData = new FormData();
            formData.append('size', 'auto');
            formData.append('image_file', imageBuffer, { filename: 'file.jpg' });
    
            const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
                headers: {
                    ...formData.getHeaders(),
                    'X-Api-Key': process.env.Apikey,
                },
                responseType: 'arraybuffer',
                encoding: null,
            });
    
            if (response.status !== 200) {
                console.error('Error:', response.status, response.statusText);
                res.status(response.status).send(response.statusText);
                return;
            }
            const base64Image = response.data.toString('base64');
           await subUserModel.findOneAndUpdate({_id:valid.id},{$set:{signed:true,image:base64Image}})
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Content-Disposition', 'inline; filename=no-bg.png');
            res.end(response.data);
        } catch (error) {
            console.log('Request failed:', error);
            res.status(500).send('Internal Server Error');
        }
    },


    getSubUserDetails:async (req,res)=>{
        try {
            const {token}=req.params
            if(!token)return res.send({status:false,message:"invalid req"}) 
            const valid=await verify(token,process.env.SECRET_KEY)
            if(!valid)return res.send({status:false,message:"invalid req"})
            const user=await subUserModel.findOne({_id:valid.id}).populate(["contractId","adminId"])
        if(!user)return res.send({status:false,message:"invalid req"})
        fs.readFile(path.join("./public",user.contractId.filename),"utf-8",(err,data)=>{
            if(err) throw new Error(err)    
            res.send({status:true,user,html:data})
            })
        } catch (error) {
            console.log('Request failed:', error);
            res.status(500).send('Internal Server Error');
        }
    },
    sendPdfToBothParties:async(req,res)=>{
        const {token}=req.params
        if(!token)return res.send({status:false,message:"invalid req"}) 
        const valid=await verify(token,process.env.SECRET_KEY)
        if(!valid)return res.send({status:false,message:"invalid req"})
        const user = await subUserModel.findOne({_id:valid.id}).populate("adminId")
        const pdfFile= await createpdf(user.link);
        await sendMail(user.adminId.email,pdfFile)
        await sendMail(user.email,pdfFile)
        res.send({status:true,message:"mail sent sucessfully"})
    }
}