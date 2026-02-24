const express = require("express")
const router = express.Router()
const transporter = require("../utils/sendEmail")
const sellerSchema = require("../models/Seller.js")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens.js")

router.post("/send-otp", async (req, res) => {
    const { email } = req.body
    try {
        let seller = await sellerSchema.findOne({ email })
        let otp = Math.floor(Math.random() * 90000 + 10000).toString()
        if (!seller) {
            seller = new sellerSchema({ email })
        }
        seller.otp = otp
        seller.otpExpiry = Date.now() + 5 * 60 * 1000
        await seller.save()
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "OTP for email verification",
            html: `the otp is ${otp}`
        })
        return res.status(200).json({ "message": "otp send" })
    }
    catch (err) {
        console.log("error in sending otp", err)
        res.status(500).json({ "message": "failed to send otp" })
    }
})
router.post("/verify-otp", async (req, res) => {
    let { email, otp } = req.body
    try {
        const seller = await sellerSchema.findOne({ email })
        if (!seller) {
            return res.status(400).json({ "message": "email is not found" })
        }
        if (seller.otp != otp || seller.otpExpiry < Date.now()) {
            res.status(400).json({ message: "invalid or expire otp" })
        }
        seller.isEmailVerified = true
        seller.otp = null
        seller.otpExpiry = null
        await seller.save()
        res.status(200).json({ message: "Email verified" })
    }
    catch (err) {
        console.log("Error in verify-otp:", err)
        res.status(500).json({ "message": "Verification failed. Please try again." })
    }

})
router.post("/register", async (req, res) => {
    const { email, password, name } = req.body
    try {
        const seller = await sellerSchema.findOne({ email })
        if (!seller || !seller.isEmailVerified) {
            return res.status(400).json({ message: "email is not verified" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        seller.name = name
        seller.password = hashedPassword
        await seller.save()
        return res.status(200).json({ message: "registration successful" })
    }
    catch (err) {
        console.log("error in register", err)
        return res.status(500).json({ "message": "registration failed" })
    }
})
router.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const seller = await sellerSchema.findOne({ email })
        if (!seller) {
            return res.status(404).json({ message: "user not found" })
        }
        const isMatch = await bcrypt.compare(password, seller.password)
        if (!isMatch) {
            return res.status(401).json({ message: "invalid password" })
        }
        //token
        const accessToken = generateAccessToken()
        const refreshToken = generateRefreshToken()
        seller.refreshToken = refreshToken
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            path: "/",
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            "message": "Login successful",
            accessToken,
            seller: { id: seller._id, name: seller.name, email: seller.email }
        })
    }
    catch (err) {
        console.log("error in login", err)
        return res.status(500).json({ "message": "login failed" })
    }
})
router.post("/refresh-token", async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        return res.status(400).json({ message: "invalid cookie or refresh token" })
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH)
        const seller = await sellerSchema.findById(decoded.id)
        if (!seller || seller.refreshToken !== refreshToken)
            return res.status(400).json({ message: "invalid token" })
        const newAccessToken = generateAccessToken()
        return res.json({
            accessToken: newAccessToken
        })
    }
    catch (err) {
        console.log(err)
    }
})
router.post("/logout",async(req,res)=>{
    const refreshToken=req.cookies.refreshToken
    // const seller=await sellerSchema.findOne(refreshToken)
    // if(seller){
    //     seller.refreshToken=null
    //     await seller.save()
    // }
    const decoded=jwt.verify(refreshToken,process.env.JWT_REFRESH)
    const seller=await sellerSchema.findById(decoded.id)
    if(seller){
        seller.refreshToken=null
        await seller.save()
    }

    res.clearCookie(refreshToken)
     res.status(200).json({ "message": 'logged out successfully' })
})
module.exports = router