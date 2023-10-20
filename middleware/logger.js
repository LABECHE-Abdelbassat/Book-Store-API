const logger = (req ,res ,next )=>{
    console.log("hello from middleware");
    next()
}

module.exports = {
    logger
}