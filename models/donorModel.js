const mongoose = require("mongoose");


const donorSchema = new mongoose.Schema({
    name:{
        type:String,
        // unique:true,
        trim:true,
    },
    contact:{
        type:String,
        trim:true,
    },
    email:{
        type:String,
        trim:true,
    },
    age:{
        type:Number,
        trim:true
    },
    gender:{
        type:String,
        trim:true
    },
    location:{
        type:String,

    },
    blood:{
        type:String,

    },
    diabities:{
        type:Boolean,

    },
    alcoholic:{
        type:Boolean
    },
    livesDisease:{
        type:Boolean
    },
    kidneyDisease:{
        type:Boolean
    },
    lungDisease:{
        type:Boolean
    },
    highBloodPressure:{
        type:Boolean
    },
    aadhaarAvailable:{
        type:Boolean
    },
    dateOfRecovery:{
        type:Date
    },
    dischargeReportAvailable:{
        type:Boolean
    },
    lastCovidNegTwoWeeks:{
        type:Boolean
    }

    
    

   
});


const Donor = mongoose.model('donor',donorSchema);

module.exports = Donor;