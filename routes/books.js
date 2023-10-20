const express = require("express");
const {Book , validateCreateBooks,validateUpdateBooks} = require("../models/Book");



//init app
const route = express.Router();




route.get("/", async (req,res)=>{
    try {
        const {minPrice , maxPrice} = req.query;


        const result = (minPrice || maxPrice)
        ? await Book.find({price : {$lte:maxPrice , $gte:minPrice}}).populate("author",["_id","firstName","lastName"])
        : await Book.find().populate("author",["_id","firstName","lastName"]);

        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
})

route.get("/:id",async (req , res) => {
    try {
        const book = await Book.findById(req.params.id).populate("author",["_id","firstName","lastName"])
    if(book){
        res.status(200).json(book)
    }else {
        res.status(404).json({message:"object not found"})
    }
    } catch (error) {
        res.status(500).json(error)
    }
})

route.post("/" ,async (req,res)=>{
    
    const {error} = validateCreateBooks(req.body);

    if(error) {
        return res.status(400).json(error)
    }

    try {
        const newBook = new Book({
            title : req.body.title , 
            author : req.body.author,
            description : req.body.description,
            price : req.body.price,
            cover : req.body.cover
        });
    
        const result = await Book.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json(error)
    }
})

route.put("/:id" ,async (req , res)=>{
    const {error} = validateUpdateBooks(req.body);

    if(error){
        return res.status(400).json(error)
    }

    try {
        const book =await Book.findByIdAndUpdate(req.params.id , 
            {$set : {
                title : req.body.title , 
                author : req.body.author,
                description : req.body.description,
                price : req.body.price,
                cover : req.body.cover
            }},{new:true});
    
        if(book){
            res.status(200).json({message: "updated successfully"})
        }else {
            res.status(404).json({message : "book not found"})
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

route.delete("/:id" , async (req , res)=>{

    try {
        const book = await Book.findById(req.params.id);

        if(book){
            const result = await Book.findByIdAndDelete(req.params.id);
            res.status(200).json({result})
        }else {
            res.status(404).json({message : "book not found"})
        }
    } catch (error) {
        res.status(500).json(error)
    }


    
})



module.exports = route;