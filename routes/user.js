const mongoose = require("mongoose");
const express = require("express");
const { registerUser, loginUser, updateUser, getAllUser, deleteUser, getUser } = require("../controllers/userController");
const expressAsyncHandler = require("express-async-handler");
const { User, validateRegisterUser, validateUpdateUser } = require("../models/User");
const bcrypt = require("bcrypt");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../middleware/verifyToken");

const userRoute = express.Router();

// userRoute.get("/",getAllUser);
userRoute.post("/register",expressAsyncHandler(registerUser));
userRoute.post("/login",expressAsyncHandler(loginUser));
userRoute.get("/",verifyTokenAndAdmin,expressAsyncHandler(getAllUser));

userRoute.route("/:id")
         .put(verifyTokenAndAuthorization,expressAsyncHandler(updateUser))
         .get(verifyTokenAndAuthorization,expressAsyncHandler(getUser))
         .delete(verifyTokenAndAuthorization,expressAsyncHandler(deleteUser));




userRoute.get("/",expressAsyncHandler(async (req , res)=>{
    const users = await User.find();
    res.status(201).json(users);

}));
module.exports = userRoute