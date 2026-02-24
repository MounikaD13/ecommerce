require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDB=require("./config/db")
const cookieParser = require("cookie-parser")
const app = express()
const sellerRoutes=require("./routes/sellerRoutes")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser())
app.use(cookieParser())
connectDB()
//routes should be last
app.use("/api/seller",sellerRoutes)
PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})