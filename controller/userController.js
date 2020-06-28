const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const factory = require("./handlerFactory");

const filterObj = (obj , ...allowedFields)=>{
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)){
            newObj[el] = obj[el];
        }
    });
    return newObj;
}


exports.getMe = catchAsync(async(req , res, next)=>{
    req.params.id = req.user.id;
    next();
})

exports.deleteAllUsers = catchAsync( async(req , res , next)=>{

    const users = await User.deleteMany({});

    res.status(200).json({
        status:"Success",
        data:{
            users
        }
    })
});

// exports.updateMe = catchAsync(async(req , res , next)=>{

//     // Create error if user POSTs password data

//     // if(req.body.password || req.body.passwordConfirm){
//     //     return next(new AppError("This route is not for password updates, please use /updateMyPassword", 400))
//     // }
//     //UPDATE user document

//     // FILTERED OUT FILTER NAMES THAT ARE ALLOWED TO BE UPDATED
//     const filteredBody = filterObj(req.body , 'name', 'email');



//     const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
//         new:true,
//         runValidators:true
//     });
 
//     res.status(200).json({

//         status: "Success",
//         data:{
//             user: updatedUser
//         }

//     })

// })

// do not update password with this


exports.deleteMe = catchAsync(async(req , res , next)=>{

    const updatedUser = await User.findByIdAndUpdate(req.user.id , {active:false} ,{
        new:true,
        runValidators:true
    })

    res.status(204).json({
        status:"Success",
        data: null
    })

})


exports.updateMe = factory.updateOne(User);

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);