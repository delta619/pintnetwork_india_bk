const Patient = require("../models/patientModel");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const email = require('./../utils/email');
const sms = require('../utils/smsService');

const e = require("express");


exports.getPatientStats = catchAsync(async (req, res, next) => {

  const patients = await Patient.find({});

  res.status(200).json({
    status: "Success",
    length: patients.length
  })

})

exports.getMatches = catchAsync(async (req, res, next) => {

  const patients = await Patient.find({})

  let matches = 0;

  for (let i = 0; i < patients.length; i++) {
    if (patients[i]["matchedEarlier"] == true) {
      matches = matches + 1;
    }
  }

  res.status(200).json({
    status: "Success",
    // matches:matches
    matches:10
  })

})


exports.addPatient = catchAsync(async (req, res, next) => {


  

  let patient = JSON.parse(JSON.stringify(req.body));



  patient.healthy = (
    (patient.labDiagnosed == 1)
    &&
    (patient.doctorPrescription == 1)
  )

    await Patient.create(patient)



  if (!patient.healthy) {

    await sms.unhealthy_patient_greeting(patient)

    await email.sendEmailPlain({
      email: patient.email,
      subject: 'Welcome to PintNetwork',
      message: `
      Dear ${patient.name},<br>
      <br>Thank you for registering with pintnetwork.com.<br>
      <br>Unfortunately you did not meet the criteria for a plasma therapy recipient.<br>
      <br>Thank you for your time and effort, we’d love to know if we can assist you in any further way.<br>
      <br>Regards,
      <br>Team PINT`
    })

  }
  else {

    await sms.sendWelcomeMessage(patient)

    await email.sendEmailPlain({
      email: patient.email,
      subject: 'Welcome to PintNetwork',
      message: `
      <br>Dear ${patient.name},<br>
      <br>Thank you for registering with pintnetwork.com.<br>
      <br>We are trying our best to find you with a donor within the next 24-48 hours.<br>
      <br>Once we have made a successful match, you will receive a text message and email with the donor’s details and OTP.<br>
      <br>We thank you for your time.<br>
      <br>Regards,
      <br>Team PINT
      `,
    })
  }

  return res.status(200).json({
    status: 200,
    message:"success"
  });

});


















// exports.aliasTopTours =async(req , res, next)=>{
//     req.query.sort = '-ratingsAverage';
//     req.query.limit = 3;
//     req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
//     next();
// }

// exports.getAllTours =  factory.getAll(Tour);

// exports.createTour = factory.createOne(Tour);

// // exports.getTour = catchAsync (async (req , res)=>{


// //         const tour = await Tour.findById(req.params.id)
// //         .populate({
// //             path:'reviews',
// //         })

// //         res.status(200).json({
// //             status:"success",
// //             data:tour
// //         })



// // })

// exports.getTour = factory.getOne(Tour, {path: 'reviews'})

// // exports.updateTour = catchAsync(async (req , res)=>{


// //         const tour = await Tour.findByIdAndUpdate(req.params.id , req.body , {
// //             new:true,
// //             runValidators:true
// //         });

// //         res.status(200).json({
// //             status:"success",
// //             data:{
// //                 tour
// //             }
// //         })
// // })

// exports.updateTour = factory.updateOne(Tour)



// // exports.deleteTour = catchAsync(async (req , res)=>{

// //         await Tour.findByIdAndDelete(req.params.id);

// //         if(!tour){
// //             next(new AppError('No tour found with that id',404))
// //         }

// //         res.status(204).json({
// //             status:"success",
// //             data:null,
// //         })
// // })

// exports.deleteTour = factory.deleteOne(Tour);

// exports.getTourStats = catchAsync ( async (req , res)=>{


//         const stats = await Tour.aggregate([
//             {
//                 $match:{ratingsAverage:{$gte:4.5}}
//             },
//             {
//                 $group:{
//                     _id:{ $toUpper:'$difficulty'},
//                     numTours:    {$sum:1},
//                     numRatings:  {$sum: '$ratingsQuantity'},
//                     avgRating:   {$avg: '$ratingsAverage'},
//                     avgPrice:    {$avg: '$price'},
//                     minPrice:    {$min: '$price'},
//                     maxPrice:    {$max: '$price'}
//                 }
//             },
//             {
//                 $sort: { avgPrice : 1}
//             }
//         ])

//         res.status(200).json({
//             status: 'success',
//             data: {
//                 stats
//             }
//         })



// })

// exports.getMonthlyPlan = catchAsync (async(req , res)=>{


//         const year = req.params.year * 1;

//         const plan = await Tour.aggregate([
//             {
//                 $unwind:'$startDates'
//             },
//             {
//                 $match:{
//                     startDates:{
//                         $gte: new Date(`${year}-01-01`),
//                         $lte: new Date(`${year}-12-31`)
//                     }
//                 }   
//             },
//             {
//                 $group:{
//                     _id:{$month:'$startDates'},
//                     numTourStarts:{$sum:1},
//                     tours:{$push:'$name'}
//                 }
//             },
//             {
//                 $addFields:{month:'$_id'}
//             },
//             {
//                 $project:{_id:0}
//             },
//             {
//                 $sort:{numTourStarts:-1}
//             },
//             {
//                 $limit:3
//             },
//             // {
//             //     $project:{

//             //     }
//             // }
//         ])

//         res.status(200).json({
//             status:'success',
//             data:{

//                 plan
//             }
//         })

// })

// exports.getToursWithin = catchAsync(async(req , res , next)=>{
//     const {distance, latlng, unit} = req.params;

//     const [lat, lng] = latlng.split(',');

//     if(!lat || !lng){
//         return next(new AppError("Latitude or Longitude is missing",400));
//     }

//     const radius = unit === 'mi' ? distance/3963.2 : distance/6378.1;

//     const tours = await Tour.find({startLocation:{
//         $geoWithin:{
//             $centerSphere: [[lng,lat],radius]
//         }
//     }}
//     )

//     res.status(200).json({
//         status: "Success",
//         result: tours.length,
//         data:{
//             data:tours
//         }
//     })

// })

// exports.getDistances = catchAsync(async(req, res , next)=>{

//     const { latlng, unit} = req.params;

//     const [lat, lng] = latlng.split(',');

//     if(!lat || !lng){
//         return next(new AppError("Latitude or Longitude is missing",400));
//     }

//     const multiplier = unit === 'mi' ? 0.0006: 0.001;

//     const distances = await Tour.aggregate([
//         {
//             $geoNear: {
//                 near: {
//                     type: 'Point',
//                     coordinates: [lng*1, lat*1]
//                 },
//                 distanceField: 'distance',
//                 distanceMultiplier: multiplier
//             }
//         },
//         {
//             $project: {
//                 name: 1,
//                 distance:1
//             }
//         }
//     ])

//     res.status(200).json({
//         status: "Success",
//         result: distances.length,
//         data:{
//             data:distances
//         }
//     })


// })