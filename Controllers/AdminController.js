const { AdminModel } = require("../models/adminModel")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs")
const { subUserModel } = require("../models/subuserModel");
const { genNewLink } = require("../utilities/utils");
const { contractModel } = require("../models/contractModel");

module.exports = {


    RegisterController: async (req, res) => {
        try {
            //userData should contain name email password
            const userData = req.body
            const admin = await AdminModel.create(userData)
            if (!admin) return res.send({ status: false, message: "sorry couldn't create new user" })
            const token = await jwt.sign({ id: admin._id }, process.env.SECRET_KEY, { expiresIn: "1d" })
            res.send({ status: true, message: "user created sucessfully", token: token, user: admin })
        } catch (error) {
            console.log(error)
            res.send({ status: false, message: "internal server error" })
        }
    },


    LoginController: async (req, res) => {
        try {
            const { email, password } = req.body;
            const admin = await AdminModel.findOne({ email: email })
            if (!admin) return res.send({ status: false, message: "invalid credentials" })
            const match = await bcrypt.compare(password, admin.password)
            if (!match) return res.send({ status: false, message: "invalid credentails" })
            const token = await jwt.sign({ id: admin._id }, process.env.SECRET_KEY, { expiresIn: "1d" })
            res.send({ status: true, message: "user logged in sucessfully", token: token, user: admin })
        } catch (error) {
            console.log(error)
            res.send({ status: false, message: "internal server error" })
        }


    },

    AddNewSubUser: async (req, res) => {
        try {
            const userData = req.body;
            const user = await subUserModel.create({ ...userData, adminId: req.adminId })
            if (!user) return res.send({ status: false, message: "couldn't register user" })
            const link = await genNewLink(user._id)
            await contractModel.updateOne(
                { adminId: userData.adminId, _id: userData.contractId },
                { $push: { subUsers: user._id } }
            );
            const linkSaved = await subUserModel.findOneAndUpdate({ _id: user._id }, { $set: { link: link } }, { new: true })
            res.send({ status: true, message: "user added sucessfully", user: { ...linkSaved } })
        } catch (error) {
            console.log(error)
            res.send({ status: false, message: "internal server error" })
        }
    },
    changeSignedStatus: async (req, res) => {
        try {
            //adminId userId
            const { userId, contractId } = req.body
            const user = await subUserModel.findOneAndUpdate(
                { _id: userId, adminId: req.adminId, contractId: contractId },
                { $set: { signed: false } },
                { new: true }
            );
            if (!user) return res.send({ status: false, message: "couldnt change the permission" })
            res.send({ status: true, message: "permision changed sucessfully", user: user })
        } catch (error) {
            console.log(error)
            res.send({ status: false, message: "internal server error" })
        }
    },

    newcontract: async (req, res) => {
        try {
            const contractData = req.body
            const contract = await contractModel.create({ ...contractData, adminId: req.adminId })
            if (!contract) return res.send({ status: false, message: "couldn't save the contract" })
            res.send({ status: true, message: "contract saved sucessfully", data: contract })
        } catch (error) {
            console.log(error)
            res.send({ status: false, message: "internal server error" })
        }
    },

    getAllContracts: async (req, res) => {
        try {
            const contracts = await contractModel.find({ adminId: req.adminId })
            if (!contracts) return res.send({ status: false, message: "failed to get all contracts" })
            res.send({ status: true, data: contracts })
        } catch (error) {
            console.log(error)
            res.send({ status: false, message: "internal server error" })
        }
    },



    getSingleContractdetails: async (req, res) => {
        try {
            const { contractId } = req.params
            const contract = await contractModel.findOne({ _id: contractId }).populate("subUsers")
            if (!contract) return res.send({ status: false, message: "couldn't get contract" })
            res.send({ status: true, data: contract })
        } catch (error) {
            console.log(error)
            res.send({ status: false, message: "internal server error" })
        }
    },

    getAdminDetails: async (req, res) => {
        try {
            const admin = await AdminModel.findOne({ _id: req.adminId })
            res.send({ status: true, user: admin })
        } catch (error) {
            console.log(error)
            res.send({ status: false, message: "internal server error" })
        }
    },
    requestNewLink: async (req, res) => {
        try {
            const { userID } = req.params;
            const newLink = await genNewLink(userID)
            const newLinkSaved = await subUserModel.findOneAndUpdate({ _id: userID }, { $set: { link: newLink } }, { new: true })
            res.send({ status: true, user: { ...newLinkSaved } })
        } catch (error) {
            console.log(error)
            res.send({ status: false, message: "internal server error" })
        }
    },
    getAllAvialableContracts:async(req,res)=>{
        fs.readdir("./public",(err,files)=>{
            if (err) throw new Error("some error occured"+ err)
            res.send({ status: true, data: files })    
        })
    }





}