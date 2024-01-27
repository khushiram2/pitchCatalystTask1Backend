const {getSubUserDetails, uploadSignature, sendPdfToBothParties} =require("../Controllers/subUSerController")
const { Router } = require("express")
const multer=require("multer")


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router=Router()

router.get("/detail/:token",getSubUserDetails)
router.post("/submit-sign/:token",upload.any(),uploadSignature)
router.get("/send-mail/:token",sendPdfToBothParties)

 const subuserRouter=router
 module.exports={subuserRouter}