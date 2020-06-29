const mongoose = require("mongoose");


const patientSchema = new mongoose.Schema({
   
    name:{
        type:String,
        trim:true
    },
    contact:{
        type:String,
        trim:true
    },
    email:{
        type:String,
    },
    age:{
        type:Number,
    },
    gender:{
        type:String,
    },
    location:{
        type:String,
    },
    hospital:{
        type: String,
    },
    blood:{
        type:String,
    },
    caseSheetPresent:{
        type:Boolean,
    }

});


const Patient = mongoose.model('patient',patientSchema);

module.exports = Patient;