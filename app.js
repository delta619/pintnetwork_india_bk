const express = require("express");


const tourRoutes = require("./routes/tourRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

const globalErrorController = require("./controller/errorController");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const helmet = require('helmet');
const hpp = require("hpp");

// GLOBAL

app.use(morgan("dev"));


app.use(helmet());


const limiter = rateLimit({
    max:100,
    windowMs: 60*60*1000,   // MAX 100 requests in 1 hr
    message: "Too many requests from your ip, Please try again in ana hour"
})


app.use('/api',limiter)


// BODY PARSER
app.use(express.json({limit: '10kb'}));

// prevent NOSQL injection
app.use(mongoSanitize());

// prevent xss

app.use(xss());

// prevent parameter pollution

app.use(hpp({
    whitelist:['duration','ratingsQuantity','ratingsAverage','maxGroupSize','difficulty','price']
}));

app.use(express.urlencoded({extended:true}))



app.use('/api/tours',tourRoutes)
app.use('/api/users',userRoutes);
app.use('/api/reviews',reviewRoutes);



app.all('*',(req , res , next)=>{
    // res.status(404).json({
    //     status:"failed",
    //     message:`Couldnt find ${req.originalUrl} `
    // })

    const err = new Error(`Couldnt find ${req.originalUrl}`)
    err.statusCode = 404;
    next(err);
})



app.use(globalErrorController)


exports.Server = app;

