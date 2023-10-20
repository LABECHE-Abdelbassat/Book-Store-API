const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")

const verifyToken =async (req,res,next)=>{
    const token = req.headers.token;

    if(!token){
        return res.status(400).json("please provide the user token")
    }

    try {
        const decoded = await jwt.verify(token , process.env.SECRET_KEY);

            req.user = decoded;
            next();

    } catch (error) {
        res.status(400).json(error);
    }
}

const verifyTokenAndAuthorization = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.id == req.params.id || req.user.isAdmin){
            next();
        }else {
            return res.status(403).json({message : "you are not allowed"})
        }
    })
}

const verifyTokenAndAdmin = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next();
        }else {
            return res.status(403).json({message : "you are not allowed , just admin allowd"})
        }
    })
}

module.exports = {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndAuthorization
}