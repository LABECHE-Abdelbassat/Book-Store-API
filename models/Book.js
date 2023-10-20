const mongoose = require("mongoose");
const Joi = require("joi");

const BookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        minlength:3,
        maxlength:200,
        trim:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Author"
    },
    description:{
        type:String,
        required:true,
        minlength:3,
        trim:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    cover:{
        type:String,
        required:true,
        enum:["soft cover","hard cover"],
    }

},{
    timestamps:true
});

const Book = mongoose.model("Book",BookSchema);

function validateCreateBooks (obj) {
    const schema = Joi.object({
        title : Joi.string().trim().min(3).max(200).required(),
        author : Joi.string().required(),
        description : Joi.string().trim().min(3).required(),
        price : Joi.number().min(0).required(),
        cover : Joi.string().valid("soft cover" , "hard cover").required()
    })

    return schema.validate(obj);
}

function validateUpdateBooks (obj) {
    const schema = Joi.object({
        title : Joi.string().trim().min(3).max(200),
        author : Joi.string(),
        description : Joi.string().trim().min(3),
        price : Joi.number().min(0),
        cover : Joi.string().valid("soft cover" , "hard cover")
    })

    return schema.validate(obj);
}

module.exports = {
    Book,
    validateCreateBooks,
    validateUpdateBooks
}