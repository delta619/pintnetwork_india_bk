const Donor = require('../models/donorModel');
const Patient = require('../models/patientModel');

class PintDataClass{
    static donors_count = 0
    static patients_count = 0
    static matches = 0

    constructor(){
        let donors = Donor.find().then(res=>{
            PintDataClass.donors_count = res.length
            console.log("Donors initial data is " + PintDataClass.donors_count);
        }).catch(err=>{
            console.log(err);
        })
        let patients = Patient.find().then(res=>{
            PintDataClass.patients_count = res.length
            console.log("Patients initial data is " + PintDataClass.patients_count);
        }).catch(err=>{
            console.log(err);
        })
        let matches = Patient.find({matchedEarlier:true}).then(res=>{
            PintDataClass.matches = res.length
        }).catch(err=>{
            console.log(err);
        })

    }

    static get get_Patient_count(){
        return PintDataClass.patients_count
    }
    static get get_Donor_count(){
        return PintDataClass.donors_count
    }
    static get get_matches(){
        return PintDataClass.matches
    }

    static incr_Patient_count(){
        PintDataClass.patients_count +=1
    }
    static incr_Donor_count(){
        PintDataClass.donors_count +=1
    }
    static incr_match_count(){
        PintDataClass.matches +=1
    }
    
}
exports.PintDataClass = PintDataClass