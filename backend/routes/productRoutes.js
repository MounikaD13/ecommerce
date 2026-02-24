const express=require("express")
const router=express.Router()
const {authorizeRole,protect}=require("../middleware/authMiddleware")
router.post("/add",protect,authorizeRole("seller"),async(req,res)=>{
    res.json({message:"added succesfully"})
})