const catchAsync = require('../utils/catchAsync');
const initiateMatch = require('../MatchAlgorithm/main');

const key = "NEKAAN050720";


exports.checkAdminLogin = catchAsync(async (req, res, next) => {

    const validKey = req.body.value == key;

    return res.status(valid ? 200 : 500).json({
        valid: validKey ? 200 : 500
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
