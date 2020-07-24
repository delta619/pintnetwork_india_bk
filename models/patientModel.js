const mongoose = require("mongoose");


const patientSchema = new mongoose.Schema({
   
    name:{
        type:String,
        trim:true
    },
    age:{
        type:Number,
        trim:true
    },
    sex:{
        type:String,
    },
    contact:{
        type:String,
        unique:true
    },
    email:{
        type:String,
        unique:true
    },
    blood:{
        type:String,
    },
    city:{
        type: String,
    },
    hospital:{
        type:String,
        default: "Not mentioned"
    },
    doctorPrescription:{
        type:Number,
    },
    labDiagnosed:{
        type:Number
    },
    registeredAt: {
        type: Date, 
        default: Date.now()
    },
    healthy:{
        type:Boolean,
        default: true
    },
    matchedEarlier:{
        type:Boolean,
        default:false
    },
    matchedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Donor'
    }
});


const Patient = mongoose.model('Patient',patientSchema);

module.exports = Patient;