const mongoose = require("mongoose");
const Joi = require("joi");

const AuthorSchema = new mongoose.Schema({
    firstName: {
        type:String,
        trim: true,
        minlenght : 3,
        maxlenght: 200 , 
        require:true
    },
    lastName: {
        type:String,
        trim: true,
        minlenght : 3,
        maxlenght: 200 , 
        require:true
    },
    nationality: {
        type:String,
        trim: true,
        minlenght : 3,
        maxlenght: 200 , 
        require:true
    }
    
},{
    timestamps:true
});

const Author = mongoose.model("Author",AuthorSchema);


function validatePostAutor(obj) {
    const schema = Joi.object({
        firstName : Joi.string().trim().min(1).max(30).required(),
        lastName : Joi.string().trim().min(3).max(30).required(),
        nationality : Joi.string().trim().min(3).max(30).required()
    })

    return schema.validate(obj)
}
function validatePutAutor(obj) {
    const schema = Joi.object({
        firstName : Joi.string().trim().min(3).max(30),
        lastName : Joi.string().trim().min(3).max(30),
        nationality : Joi.string().trim().min(3).max(30)
    })

    return schema.validate(obj)
}


module.exports = {Author , validatePostAutor , validatePutAutor}