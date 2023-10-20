const { User, validateRegisterUser, validateLoginUser, validateUpdateUser } = require("../models/User")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

// const getAllUser =async (req,res)=>{
//     const users = await User.find();
// }

const registerUser =async (req,res) => {
    const {error} = validateRegisterUser(req.body);

    if (error) {
        return res.status(400).json(error)
    }


    const userExist = await User.findOne({email:req.body.email});
    if(userExist){
        return res.status(400).json("this user is already exist");
    }
    const salt =await bcrypt.genSalt(10);
    req.body.password =await bcrypt.hash(req.body.password , salt);

    const newUser = new User({
        username:req.body.username,
        email:req.body.email,
        password : req.body.password,
        isAdmin : req.body.isAdmin
    });

    const result = await newUser.save();

    const token = jwt.sign({id: result._id , isAdmin:result.isAdmin} , process.env.SECRET_KEY);

    const {password , ...other} = result._doc;
    res.status(200).json({...other , token:token});
}

const loginUser = async (req , res)=> {
    const {error} = validateLoginUser(req.body);

    if(error){
        return res.status(500).json(error);
    }

    const user = await User.findOne({email:req.body.email});

    if (!user){
        return res.status(500).json({message : " this user not registered"});
    }

    const match = await bcrypt.compare(req.body.password , user.password);

    if(!match){
        return res.status(500).json({message : "wrong password or email"});
    }
    const token = jwt.sign({id: user._id , isAdmin:user.isAdmin} , process.env.SECRET_KEY);
    

    const {password , ...other} = user._doc;
    res.status(201).json({...other , token:token});
}


const updateUser = async (req , res)=>{
    
    

    const {error} = validateUpdateUser(req.body);

    if (error) {
        return res.status(400).json(error)
    }

    if(req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password , salt);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id ,{
        $set:{
            email:req.body.email,
            username:req.body.username,
            password:req.body.password,
        }
    },{new : true});
    console.log(updatedUser)
    res.status(201).json(updatedUser);

}

const getAllUser =  async (req,res)=>{
    const allUsers = await User.find().select("-password");

    res.status(200).json(allUsers);
}

const getUser = async (req,res)=>{
    const user = await User.findById(req.params.id);

    if(!user) {
        res.status(400).json({message : "this user not found"})
    }

    const theUser = await User.findById(req.params.id);

    res.status(200).json(theUser);
}

const deleteUser = async (req,res)=>{
    const user = await User.findById(req.params.id);

    if(!user) {
        res.status(400).json({message : "this user not found"})
    }

    const deletedOne = await User.findByIdAndDelete(req.params.id);

    res.status(200).json(deletedOne);
}

module.exports = {
    registerUser,
    loginUser,
    updateUser,
    getAllUser,
    getUser,
    deleteUser
}