const sms = require('../utils/smsService');
const emailController = require('./emailController');
const Donor = require('../models/donorModel');
const Patient = require('../models/patientModel');
const pdf =require("../utils/pdfModule/pdfGenerator");
const fs = require('fs');
const constants = require('../constants');

exports.match = async (donor, patient) => {

    let otp = 1000 + Math.floor(Math.random() * 1000);



console.log("updating donor");


    await Donor.findOneAndUpdate(donor._id ,{
        matchedEarlier:true,
        matchedTo:patient._id
    })

console.log("updating patient");

    await Patient.findOneAndUpdate(patient._id ,{
        matchedEarlier:true,
        matchedTo:donor._id
    })


    

    //SOME VERIFICATION THEN BELOW

    await pdf.renderDonorEmail(donor);
        
        //    if Donor doesnt have an email
        
        if(!donor.email){
            donor.email = "Not available";
            await emailController.sendMatchMailPatient(donor, patient, otp);
        }else if(!patient.email){
        //    Patient doesnt have a mail
            await emailController.sendMatchMailDonor(donor, otp);
            fs.unlinkSync(`${constants.DONOR_FORM_ATTACHMENT_PATH}/${donor._id}.pdf`);


        }else{
        //    if all have emails
            await emailController.sendMatchMailDonor(donor, otp);
            await emailController.sendMatchMailPatient(donor, patient, otp);
            fs.unlinkSync(`${constants.DONOR_FORM_ATTACHMENT_PATH}/${donor._id}.pdf`);

        }
       

 


        await sms.sendMatchResponseDonor({

            // to: donor.contact,

            to: donor.contact,
            var1: donor.name,
            var2: otp

        })

        await sms.sendMatchResponsePatient({

            // to: patient.contact,
            to: patient.contact,
            var1: patient.name, 
            var2: donor.sex == "M" ? "his" : "her",
            var3: donor.name,
            var4: donor.contact,
            var5: donor.email,
            var6: otp

        })

}
