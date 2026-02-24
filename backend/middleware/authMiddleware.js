const jwt = require("jsonwebtoken")
const Seller = require("../models/Seller")
const protect = async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, JWT_SECRET)
            req.user = await Seller.findById(decoded.id).select("-password -refreshToken")
            next()
        }
        catch (err) {
            return res.status(401).json({ message: `access denied ${err}` })
        }
        if (!token) {
            return res.status(401).json({ message: "no token in the request" })
        }
    }
}
const authorizeRole=(...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message:"access denied for this operation"})
        }
    }
}
module.exports={authorizeRole,protect}