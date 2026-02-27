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
//This ensures only logged-in users can access protected routes.This ensures only users with specific roles (like admin, seller, buyer) can access certain routes.
{/*} I implemented JWT-based authentication using a protect middleware and added role-based authorization 
// using a higher-order middleware to secure different routes based on user roles.*/}