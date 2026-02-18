const express=require("express")
const router=express.Router()
const transporter=require("../utils/sendEmail")
const sellerSchema=require("../models/Seller")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")

router.post("/send-otp",async(req,res)=>{
    const {email,password}=req.body
    try{
        let seller=await sellerSchema.findOne({email})
        let otp=Math.floor(Math.random()*90000+10000).toString
        if(!seller){
            seller=new sellerSchema({email})
        }
        seller.otp=otp
        seller.otpExpiry=new Date.now()+5*60*1000
        await seller.save()
        await transporter.sendEmail({
            from:process.env.EMAIL_USER,
            to:email,
            subject:"OTP for email verification",
            html:`the otp is ${otp}`
        })
        return res.status(200).json({"message":"otp send"})
    }
    catch(err){
        console.log("error in sending otp",err)
        res.status(500).json({"message":"failed to send otp"})
    }
})
router.post("/verify-otp",async(req,res)=>{
    let {email,otp}=req.body
    try{
        const seller=await sellerSchema.findOne({email})
        if(!seller){
            return res.status(400).json({"message":"email is not found"})
        }
        if(seller.otp!==otp||seller.otpExpiry<Date.now()){
            res.status(400).json({message:"invalid or expire otp"})
        }
        seller.isEmailVerified=true
        seller.otp=null
        seller.otpExpiry=null
        await seller.save()
        res.status(200).json({message:"Email verified"})
    }
    catch (err) {
        console.log("Error in verify-otp:", err)
        res.status(500).json({ "message": "Verification failed. Please try again." })
    }

})
router.post("/register",async(req,res)=>{
    const {email,password,name}=req.body
    try{
        const seller=await sellerSchema.findOne({email})
        if(!seller.isEmailVerified){
            return res.status(400).json({message:"rmail is not verified"})
        }
        const hashedPassword=await bcrypt.hash(password,10)
        seller.name=name
        seller.password=hashedPassword
        await seller.save()
        return res.status(200).json({message:"registration successful"})
    }
    catch(err){
        console.log("error in register",err)
        return res.status(500).json({"message":"registration failed"})
    }
})
module.exports=router