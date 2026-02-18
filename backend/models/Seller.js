const mongoose=require("mongoose")
const SellerSchema=mongoose.Schema({
    name:String,
    email:{
        type:String,
        unique:true,
        require:true
    },
    password:String,
    otp:String,
    otpExpiry:Date,
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        default:"seller"
    }
})
module.export=mongoose.model("Seller",SellerSchema)