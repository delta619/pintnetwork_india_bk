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
      
        await Patient.findByIdAndUpdate(patients[0]._id,
            {
                connected:1 , 
                connectedAt:Date.now(),
                connectedTo:donor._id
            }),
        await Donor.findByIdAndUpdate(donor._id,
            {
                connected:1 , 
                connectedAt:Date.now(),
                connectedTo: patients[0]._id
            })
    ])


    
    await Promise.all([
        
        await sendEmail({
            email: currentDonor.email,
            subject: 'PintNetwork - Patient Found',
            message: `\n\n
            Dear Mr./Ms. ${currentDonor.name},\n
            Great news! We’ve found you a patient who needs plasma.\n
            Provided below are the contact details of the patient in need:\n
            Name: ${currentPatient.name}\n
            Phone no.: ${currentPatient.contact}\n
            Email: ${currentPatient.email?currentPatient.email:"Email not provided"}\n
            Hospital: ${currentPatient.hospital}\n
            We’ve attached below a copy of your medical history to ease the process of donation.\n
            Thank you for believing in us and for your relentless service to humanity.\n
            You are one step closer to saving a life.\n
            P.S : Do let us know if the match turned out to be successful and if we can assist you in any further way.\n\n Pintnetwork.com ©
        `
    }),

    await sendEmail({
        email: currentPatient.email,
        subject: 'PintNetwork - Donor Found',
        message: `Dear Mr./Ms. ${currentPatient.name},\n
        Great news! We’ve found you a donor.\n
        Provided below are the contact details of your nearest donor:\n
        Name:  ${currentDonor.name}\n
        Phone no.:  ${currentDonor.contact}\n
        Email:  ${currentDonor.email}\n
        Location:  ${currentDonor.city} ${currentDonor.location}\n
        Thank you for believing in us and we hope our services could help you recover faster.\n
        P.S: Do let us know if the match turned out to be successful and if you’d be interested in donating as well post-recovery.\n\n Pintnetwork.com ©`
      })])

      

   
   
        






    
}