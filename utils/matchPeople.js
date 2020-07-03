const Donor = require("../models/donorModel");
const Patient = require("../models/patientModel");
const sendEmail = require('./email');
const catchAsync = require("./catchAsync");
const AppError = require("./AppError");


exports.isMatch = (currentDonor,currentPatient)=>{

    if( (currentDonor.blood == "O+" || currentDonor.blood == "O-")
        && 
        (currentPatient.blood == "O+" || currentPatient.blood == "O-")
    ){
        console.log("Matched case",1);
        
        return true;
    }

    if( (currentDonor.blood == "A+" || currentDonor.blood == "A-")
        && 
        (currentPatient.blood == "A+" || currentPatient.blood == "A-" || currentPatient.blood == "AB+" || currentPatient.blood == "A-")
    ){
        console.log("Matched case",2);

        return true;
    }

    if( (currentDonor.blood == "B+" || currentDonor.blood == "B-")
        && 
        (currentPatient.blood == "B+" || currentPatient.blood == "B-" || currentPatient.blood == "AB+" || currentPatient.blood == "A-")
    ){
        console.log("Matched case",3);

        return true;
    }

    if( (currentDonor.blood == "AB+" || currentDonor.blood == "AB-")
        && 
        (currentPatient.blood == "O+" || currentPatient.blood == "O-" || currentPatient.blood == "A+" || currentPatient.blood == "A-" || currentPatient.blood == "B+" || currentPatient.blood == "B-" || currentPatient.blood == "AB+" || currentPatient.blood == "AB-")
    ){
        console.log("Matched case",4);
        return true;
    }


    console.log("Matched",0);

    return false;
    

}

exports.match =  async (currentDonor , currentPatient)=>{

    console.log("Sending mails");

    try{
        await Promise.all([
            
                sendEmail({
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
        }).catch(e=>{
            console.log("Mail to Patient was unsuccessful ",e.message);
            
        }),

        sendEmail({
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
        .catch(e=>{
            console.log("Mail to Donor was unsuccessful ",e.message);
            
        })

    }catch(err){
        console.log("Error in Match email send block");
    }

        // console.log("$ matched email sent $");

}