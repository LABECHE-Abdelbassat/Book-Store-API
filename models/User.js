const mongoose = require("mongoose");
const Joi = require("joi");

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        minlength:5,
        maxlength:200,
        trim:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
        minlength:3,
        maxlength:200,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        trim:true,
    },
    isAdmin:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true
});

const User = mongoose.model("User",UserSchema);

function validateRegisterUser (obj) {
    const schema = Joi.object({
        email : Joi.string().trim().min(5).max(200).required().email(),
        username :Joi.string().trim().min(3).max(200).required(),
        password : Joi.string().trim().min(6).required(),
    })

    return schema.validate(obj);
}

function validateLoginUser (obj) {
    const schema = Joi.object({
        email : Joi.string().trim().min(5).max(200).required().email(),
        password : Joi.string().trim().min(6).required(),
    })

    return schema.validate(obj);
}
function validateUpdateUser (obj) {
    const schema = Joi.object({
        email : Joi.string().trim().min(5).max(200).email(),
        username :Joi.string().trim().min(3).max(200),
        password : Joi.string().trim().min(6)
    })

    return schema.validate(obj);
}
module.exports = {
    User,
    validateLoginUser,
    validateRegisterUser,
    validateUpdateUser
}