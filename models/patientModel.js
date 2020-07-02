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
    },
    email:{
        type:String,
    },
    blood:{
        type:String,
    },
    city:{
        type: String,
    },
    hospital:{
        type:String,
    },
    doctorPrescription:{
        type:Number,
    },
    connected:{
        type:Number,
        default:0
    },
    registeredAt: {
        type: Date, 
        default: Date.now()
    },
    connectedTo: mongoose.Schema.Types.ObjectId  
});


const Patient = mongoose.model('patient',patientSchema);

module.exports = Patient;