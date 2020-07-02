const Donor = require("../models/donorModel");
const Patient = require("../models/patientModel");
const sendEmail = require('./../utils/email');
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");


exports.match =  async (donor)=>{

    if(!donor){
        console.log("No donor received");
    return;
    }

    const patients = await Patient.find({
        connected:0,
        blood:donor.blood
    });
    
    if(patients.length === 0){
        return ;
    }


    patients.sort((a, b) => (new Date(a.registeredAt).getTime() > new Date(b.registeredAt).getTime() ) ? 1 : -1)

    

    const [currentPatient,currentDonor] = await Promise.all([
        await Patient.findByIdAndUpdate(patients[0]._id,{connected:1 , connectedAt:Date.now()}),
        await Donor.findByIdAndUpdate(donor._id,{connected:1 , connectedAt:Date.now()})
    ])

    console.log(currentPatient.email ,currentDonor.email );
    

    await Promise.all([await sendEmail({
      email: currentPatient.email,
      subject: 'PINTNETWORK Donor Found',
      message: `Hi ${currentPatient.name}, We have got a donor for you.\n\nName: ${currentDonor.name}\nContact: ${currentDonor.contact}\nEmail: ${currentDonor.email}\nLocation: ${currentDonor.city},${currentDonor.location}`
    }),

    await sendEmail({
        email: currentDonor.email,
        subject: 'PINTNETWORK Patient Found',
        message: `Hi ${currentDonor.name}, We have got a Person who needs the Plasma.\n\nName: ${currentPatient.name}\nContact: ${currentPatient.contact}\nEmail: ${currentPatient.email}\Patient is at: ${currentPatient.hospital}, ${currentPatient.city}`
      })])

      console.log("Transfer done");
      

   
   
        






    
}