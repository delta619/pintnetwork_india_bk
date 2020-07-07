const catchAsync = require('../utils/catchAsync'); 
const config = require('../config/config');
const Donor = require("../models/donorModel");
const Patient = require("../models/patientModel");
const matchController = require('./matchController');

exports.checkAdminLogin =catchAsync( async (req, res, next) => {

    const validKey = (req.body.token == config.token_backend);


    if (validKey) {
        return res.json({
            status:200
        })
    } else {
        throw new Error("Not authorised")
    }
})

exports.getDonors =catchAsync( async (req , res)=>{

        const donors = await Donor.find({});
        return res.json({
            status:200,
            data:donors
        })
    
    
})

exports.getPatients = catchAsync( async (req , res)=>{

        const patients = await Patient.find({});
        
        return res.json({
            status:200,
            data:patients
        })

    
})

exports.triggerMatch = async(req , res)=>{

    try {
        await matchController.match(req.body.data["donor"],req.body.data["patient"])

        res.status(200).json({
            status:200
        })

    } catch (e) {
        throw e
    }


}



// exports.matchAllNow = async (req, res, next) => {

//     initiateMatch()
//         .then((data) => {
//             res.status(200).json({
//                 status: "Success",
//                 data
//             })
//         })
//         .catch(e => {
//             res.status(500).json({
//                 status: "Failed",
//                 message: e
//             })
//         })
// }
