const Patient = require("../models/patientModel");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const email = require('./../utils/email');
const sms = require('../utils/smsService');

const initiateMatch = require('../MatchAlgorithm/main');

exports.getAllPatients = catchAsync(async (req, res, next) => {
  const patients = await Patient.find({});

  res.status(200).json({
    status: 'Success',
    results: patients.length,
    data: patients,
  });
});


exports.addPatient = catchAsync(async (req, res, next) => {
  const patient = await Patient.create(req.body);


  sms.sendWelcomeMessage({
    name: patient.name,
    contact: patient.contact
  })

  

  email.sendEmailPlain({
    email: patient.email,
    subject: 'Welcome to PintNetwork',
    message: `Hi ${patient.name}\nWelcome aboard to Pintnetwork.com community.`
  }).catch(err => {
    console.log("Error sending Welcome mail to Patient", err);

  });


  // Initiate Match


  initiateMatch();




  res.status(200).json({
    status: 'Success',
    results: patient.length,
    data: patient,
  });
});

exports.deleteAllPatients = catchAsync(async (req, res, next) => {
  const patients = await Patient.deleteMany({});

  res.status(200).json({
    status: 'Success',
    results: patients.length,
    data: patients,
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