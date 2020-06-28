const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('./../utils/email');
const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user , statusCode , res)=>{
    const token = signToken(user._id);

    const cookieOptions = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN *24*60*60*1000),
      httpOnly:true
    };

    if(process.env.NODE_ENV === 'production') cookieOptions.secure= true;
    res.cookie('jwt',token, cookieOptions)
      user.password = undefined;
    res.status(statusCode).json({
        status:"Success",
        token,
        data: {
            user
        }
    });
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    changedPasswordAt: req.body.changedPasswordAt,
    role: req.body.role,
  });


   createAndSendToken(newUser, 201, res);
     
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  
  if (!email || !password) {
    return next(new AppError('Email or password Missing', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Email or Password is incorrect', 401));
  }

   createAndSendToken(user, 200, res);

});

exports.protect = catchAsync(async (req, res, next) => {
  let token = undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Please log in again...', 401));
  }

  // Verification Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //Check if user still exists
  console.log(decoded);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does not exists', 401)
    );
  }

  // Check if password was changed after token was generated

  if (await currentUser.changedPasswordAfter(decoded.iat)) {
    console.log('req.user is ',currentUser.changedPasswordAfter(decoded.iat));

    return next(new AppError('User has changed the password after jwt was generated', 401));
  }

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`You do not have permission to perform this action`, 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // GET USER FROM POSTED EMAIL
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError(`User with that email was not found`, 404));
  }

  //GENERATE RANDOM RESET TOKEN

  const resetToken = await user.createPasswordResetToken();

  await user.save({ validateBeforeSave: true });

  // SEND THE EMAIL TO USER

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/users/resetPassword/${resetToken}`;

  const message = `Click on the below link to reset your password.\n${resetURL}\nPlease ignore this message if you didnt request for an password reset`;

  try{
      await sendEmail({
          email: user.email,
          subject: 'Your password reset token | valid for 10 minutes',
          message
      });
    
      res.status(200).json({
          status:'Success',
          message:`Token sent to email`
      })

  }catch(err){

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    console.log(err);
    
    return next(new AppError(`There was an error sending the email, Please try again later`, 500))
  }

});


exports.resetPassword = catchAsync( async(req, res, next) => {
    
    
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        
    const user = await User.findOne({
        passwordResetToken:hashedToken,
        passwordResetExpires:{$gt : Date.now()}
    });
        

    if(!user){
        return next(new AppError('Token is invalid or expired', 404));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    console.log({user});
    
    await user.save();
    
    createAndSendToken(user, 200, res);

})


exports.updatePassword = catchAsync(async(req , res , next)=>{


// 1 GET USER FROM COLLECTION

console.log(req.body);

    const user = await User.findById(req.user.id).select('+password');

// 2 CHECK IF POSTED CURRENT PASSWORD IS CORRECT

    if(!(await user.correctPassword(req.body.passwordCurrent , user.password))){

        return next(new AppError(`Your current password is wrong`, 401));
    }
    
// 3 If so , UPDATE THE PASSWORD

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();

// 4 Log the user in , send the JWT token

    createAndSendToken(user, 200, res);


})