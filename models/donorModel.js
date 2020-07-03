const mongoose = require("mongoose");
const { schema } = require("./patientModel");


const donorSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
    },
    age:{
        type:Number,
        trim:true,
    },
    sex:{
        type:String,
        trim:true,
    },
    contact:{
        type:String,
        trim:true
    },
    email:{
        type:String,

    },
    weight:{
        type:Number,

    },
    blood:{
        type:String,

    },
    city:{
        type:String
    },
    pregnant:{
        type:Number
    },
    tattoo:{
        type:Number
    },
    bp:{
        type:Number
    },
    anemia:{
        type:Number
    },
    hiv:{
        type:Number
    },
    mosquito:{
        type:Number
    },
    cancer:{
        type:Number
    },
    flu:{
        type:Number
    },
    labTestConfirm:{
        type:Number
    },
    days14over:{
        type:Number
    },
    last_symptom_discharge_date:{
        type:Date
    },
    dischargeReport:{
        type:Number
    },
    aadhaar:{
        type:Number
    },
    matchedEarlier:{
        type:Boolean,
        default:false
    },
    matchedTo:{
        type: mongoose.Schema.Types.ObjectId
    },
    healthy: {
        type:Boolean,
        default:true
    },
});



const Donor = mongoose.model('donor',donorSchema);

module.exports = Donor;