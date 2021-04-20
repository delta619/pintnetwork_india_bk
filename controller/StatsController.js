const {PintDataClass} = require('../utils/PintDataClass')

exports.get_status = (req , res )=>{
    
    res.status(200).json({
        "patients": PintDataClass.get_Patient_count,
        "donors":PintDataClass.get_Donor_count,
        "matches":PintDataClass.get_matches
    })
}