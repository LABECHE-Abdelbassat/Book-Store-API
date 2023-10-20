const {User} = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

const getForgetPasswordView = (req , res) => {
    res.render("forget-password");
}

const sendForgetPasswordLink = async (req,res)=>{
    const user = await User.findOne({email:req.body.email});
    if(!user) {
        res.status(404).json({message : "user not found for this email"})
    }

    const secret = process.env.SECRET_KEY + user.password;
    const token = jwt.sign({email:user.email , password:user.password}, secret , {expiresIn:"10m"});


    const link = `http://localhost:5000/password/reset-password/${user._id}/${token}`;

/*
    const transporter = nodemailer.createTransport({
    host: "gmail",
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: "REPLACE-WITH-YOUR-ALIAS@YOURDOMAIN.COM",
        pass: "REPLACE-WITH-YOUR-GENERATED-PASSWORD",
    },
    });

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
    }

    main().catch(console.error);
 */
    res.json({message : "go to your mail and you found the link of update password" ,resetPasswordLink : link});
}

const getRecetPasswordView = async (req,res)=>{
    const user = await User.findById(req.params.id);
    if(!user) {
        res.status(404).json({message : "user not found for this email"})
    }
    const secret = process.env.SECRET_KEY + user.password;
    try {
        jwt.verify(req.params.token , secret);
        res.render("reset-password" , {email:user.email})
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
    
}

const resetThePassword = async (req , res)=> {
    const user = await User.findById(req.params.id);
    if(!user) {
        res.status(404).json({message : "user not found for this email"})
    }

    const secret = process.env.SECRET_KEY + user.password;

    try {
        jwt.verify(req.params.token , secret);

        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password , salt);
    
        
        user.password = req.body.password;
    
        const result = await user.save();
    
        res.render("success-password")
    
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }


}

module.exports = {
    getForgetPasswordView,
    sendForgetPasswordLink,
    getRecetPasswordView,
    resetThePassword
}