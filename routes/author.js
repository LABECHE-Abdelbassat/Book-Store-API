const express = require("express");
const router = express.Router();
const {Author , validatePostAutor , validatePutAutor} = require("../models/Author");
const asyncHandler = require("express-async-handler");

router.get("/" ,async (req , res)=> {
    try {
        const {pageNumber}= req.query;
        const authorPerPage = 2;

        // const authorsList = await Author.find().sort({firstName : -1}).select("firstName lastName -_id");
        const authorsList = await Author.find().skip(authorPerPage * (pageNumber - 1)).limit(authorPerPage);
        res.status(200).json(authorsList)
    } catch (error) {
        res.status(500).json({message:"something went wrong"})
    }
    
})

router.get("/:id" ,asyncHandler(async (req , res)=> {

    const author = await Author.findById(req.params.id);

    if(author){
        res.status(200).json(author);
    }else{
        res.status(404).json({message : "this author does not exist"});
    }


}))


/**
 * @desc post an object of author
 * @method post
 * @router /api/authors
 * @access public
 */
router.post("/", async (req, res)=> {



    const {error} = validatePostAutor(req.body);

    if(error){
        return res.status(400).json(error);
    }

    try {
        const author = new Author({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            nationality : req.body.nationality
        })
    
    
        const result = await author.save();
    
        res.status(200).json(result);

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"something went wrong"});
    }

})

router.put("/:id" ,async (req , res)=> {
    const {error} = validatePutAutor(req.body);

    if(error){
        return res.status(400).json(error);
    }

    try {
        const author =await Author.findByIdAndUpdate(req.params.id , {
            $set:{
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                nationality:req.body.nationality
            }
        },{new : true});
    
        
        res.status(200).json(author);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"something went wrong"});
    }
})

router.delete("/:id" ,async (req , res)=> {
    try {
        await Author.findByIdAndDelete(req.params.id)

        res.status(200).json({message :"author has been deleted successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"something went wrong"});
    }


})



module.exports = router;