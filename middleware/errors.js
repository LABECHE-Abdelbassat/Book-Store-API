notFoundError = (req , res , next)=>{
    const error = new Error(`not fjjjound - ${req.originalUrl}`);
    res.status(400);
    next(error)
};

handleError = (err, req , res , next)=>{
    const statusCode = req.statusCode=== 500 ? 200 : res.statusCode;
    res.status(statusCode).json({message : err.message});
}

module.exports = {
    notFoundError,
    handleError
}