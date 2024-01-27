const { Router } = require("express");
const { RegisterController, LoginController, AddNewSubUser, changeSignedStatus, newcontract, getAllContracts, getSingleContractdetails, getAdminDetails, requestNewLink, getAllAvialableContracts } = require("../Controllers/AdminController");
const { verifyAdminToken } = require("../middleware/reqmiddleware");







const router = Router()

router.post("/register", RegisterController)
router.post("/login", LoginController)
router.post("/add-subuser", verifyAdminToken, AddNewSubUser)
router.post("/new-contract", verifyAdminToken, newcontract)
router.put("/change-signed-status", verifyAdminToken, changeSignedStatus)
router.get("/all-contracts", verifyAdminToken, getAllContracts)
router.get("/available-contracts", verifyAdminToken, getAllAvialableContracts)
router.get("/single-contract/:contractId", verifyAdminToken, getSingleContractdetails)
router.put("/gen-new-link/:userID",verifyAdminToken,requestNewLink)
router.get("/get-details", verifyAdminToken, getAdminDetails)






const AdminRouter = router

module.exports = { AdminRouter }