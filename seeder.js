const { books , authors} = require("./data");
const { Book } = require("./models/Book");
const { Author } = require ("./models/Author");
require("dotenv").config();
const mongoose = require("mongoose");

//conntent to mongodb
mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log("connecting to mongodb ...");
        })
        .catch((error)=>{
            console.log("error connecting !" + error)
        })


const importBooks = async ()=> {
    try {
        await Book.insertMany(books);
        console.log("books inserted successfully")
    } catch (error) {
        console.log(error)
        process.exit(1);
    }

}
const removeBooks = async ()=> {
    try {
        await Book.deleteMany();
        console.log("books deleted successfully")
    } catch (error) {
        console.log(error)
        process.exit(1);
    }

}

const importAuthors =async ()=> {
    try {
        await Author.insertMany(authors);
        console.log("authors inserted successfully")
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
const removeAuthors =async ()=> {
    try {
        await Author.deleteMany();
        console.log("authors deleted successfully")
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

if(process.argv[2] == "-import"){
    importBooks();
}
if(process.argv[2] == "-remove"){
    removeBooks();
}
if(process.argv[2] == "-importauthor"){
    importAuthors();
}
if(process.argv[2] == "-removeauthor"){
    removeAuthors();
}