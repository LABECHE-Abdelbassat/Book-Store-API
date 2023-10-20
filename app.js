const express = require("express");
const booksPath = require("./routes/books");
const authorPath = require("./routes/author");
const uploadPath = require("./routes/upload");
const {logger} = require("./middleware/logger")
const path = require("path");


const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { notFoundError, handleError } = require("./middleware/errors");
const  userRoute  = require("./routes/user");
const passwordRoute = require("./routes/password");
dotenv.config();



//conntent to mongodb
mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log("connecting to mongodb ...");
        })
        .catch((error)=>{
            console.log("error connecting !" + error)
        })

//init app
const app = express();

app.use(express.static(path.join(__dirname , "images")));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(logger);

app.set("view engine" , "ejs");

app.use("/api/books" , booksPath);
app.use("/api/authors" , authorPath);
app.use("/api/users",userRoute);
app.use("/api/upload",uploadPath)
app.use("/password", passwordRoute);


app.use(notFoundError)


app.use(handleError)



// Running the server
app.listen(process.env.PORT , ()=>{
    console.log(`listen on port ${process.env.PORT} ...`)
})