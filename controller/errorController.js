const AppError = require('../utils/AppError');

const handleCastErrorDB = (err) =>{
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message , 400);
}

const handleJWTError= () => new AppError('Invaid Token!! Please log in again',401)
const handleTokenExpireError = () => new AppError("Token Expired!! Please log in again", 401);

const sendErrorDev = (err, res)=>{
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

const sendErrorProd = (err, res)=>{
    
    // Specific errors , can show err messages to clients
    if(err.isOperational){
        
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            // message:err.test
        })

    }else{
        // Unknown errors , that can't be shown to clients
        // console.error('Error 🚩', err)
        res.status(500).json({
            status: 'error', 
            message: "Something went wrong!!!"
        });
    }
}


module.exports = (err , req , res , next)=>{

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Error";
    
    if(process.env.NODE_ENV === 'development'){
        
        sendErrorDev(err, res);
       

    }else if (process.env.NODE_ENV === 'production'){
       
        let error = {...err}
        error.message = err.message  // Since Error.message is enumerable
       
   

              
    //    console.log("in sendingx ", error.message);


        if (error.name === 'JsonWebTokenError') {
            error = handleJWTError(error)     
        }
        else if(error.name === 'TokenExpiredError'){
            error = handleTokenExpireError(error)
        } 

        sendErrorProd(error, res);
    }

    
}