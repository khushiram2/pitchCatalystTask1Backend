const express = require("express");
const cors = require("cors")
const dotenv = require("dotenv");
const { AdminRouter } = require("./Routes/AdminRoutes");
const { subuserRouter } = require("./Routes/subUserRoutes");
const { connectDb } = require("./Database/connection");
const { default: puppeteer } = require("puppeteer");
const app = express();
dotenv.config()
app.use(cors())
app.use(express.json())
const port = 5000;
 connectDb()

app.use("/admin",AdminRouter)
app.use("/sub-user",subuserRouter)



app.listen(port, () => console.log(`App started on port ${port}`));
