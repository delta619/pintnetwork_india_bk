const catchAsync = require('../utils/catchAsync');
const initiateMatch = require('../MatchAlgorithm/main');

const key = "NEKAAN050720";


exports.checkAdminLogin = catchAsync(async (req, res, next) => {

    const validKey = req.body.value == key;

    console.log("REQUEST GETTING IS ",req.body);
    console.log("Sending ",validKey);
    
    return res.json({
        status:validKey?200:401,
        valid: validKey ? 200 : 401
    })

})

exports.matchAllNow = async (req, res, next) => {

    initiateMatch()
        .then((data) => {
            res.status(200).json({
                status: "Success",
                data
            })

        })
        .catch(e => {
            res.status(500).json({
                status: "Failed",
                message: e
            })
        })
}
