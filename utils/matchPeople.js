const Donor = require("../models/donorModel");
const Patient = require("../models/patientModel");

const email = require('./email');
const sms = require('./smsService');

const AppError = require("./AppError");
const pdf = require('../utils/pdfModule/pdfGenerator')
const constants = require('../constants')
const fs = require('fs')






let bloodMatchCheck = (currentDonor, currentPatient) => {
    if ((currentDonor.blood == "O+" || currentDonor.blood == "O-")
        &&
        (currentPatient.blood == "O+" || currentPatient.blood == "O-")
    ) {
        // console.log("Matched case", 1);
        return true;
    }

    if ((currentDonor.blood == "A+" || currentDonor.blood == "A-")
        &&
        (currentPatient.blood == "A+" || currentPatient.blood == "A-" || currentPatient.blood == "AB+" || currentPatient.blood == "AB-")
    ) {
        // console.log("Matched case", 2);
        return true;
    }

    if ((currentDonor.blood == "B+" || currentDonor.blood == "B-")
        &&
        (currentPatient.blood == "B+" || currentPatient.blood == "B-" || currentPatient.blood == "AB+" || currentPatient.blood == "AB-")
    ) {
        // console.log("Matched case", 3);
        return true;
    }

    if ((currentDonor.blood == "AB+" || currentDonor.blood == "AB-")
        &&
        (currentPatient.blood == "O+" || currentPatient.blood == "O-" || currentPatient.blood == "A+" || currentPatient.blood == "A-" || currentPatient.blood == "B+" || currentPatient.blood == "B-" || currentPatient.blood == "AB+" || currentPatient.blood == "AB-")
    ) {
        // console.log("Matched case", 4);
        return true;
    }
}

let cityCheck = (currentDonor, currentPatient) => {
    if (currentDonor.city == currentPatient.city) {
        return true;
    }
    console.log(`City Check was false for ${currentDonor.contact} & ${currentPatient.contact}`);
    return false;
}

exports.isMatch = (d, p) => {

    if (bloodMatchCheck(d, p) && cityCheck(d, p)) {
        return true;
    } else {
        return false;
    }
}

exports.match = async (currentDonor, currentPatient) => {

    let session_otp = 1000 + Math.round((Math.random()*9000));

    currentDonor.otp = session_otp;
    currentPatient.otp = session_otp;

    // Preparing attachment for donor

    try {
        await pdf.renderDonorEmail(currentDonor)

    } catch (e) {
        console.log(e);
    }

    Promise.all([

        email.sendEmailWithAttachments({
            email: currentDonor.email,
            subject: 'PintNetwork - Patient Found',
            message: `\n\n
                Dear Mr./Ms. ${currentDonor.name},\n
                Great news! We’ve found you a patient who needs plasma.\n
                Provided below are the contact details of the patient in need:\n
                Name: ${currentPatient.name}\n
                Phone no.: ${currentPatient.contact}\n
                Email: ${currentPatient.email ? currentPatient.email : "Email not provided"}\n
                Hospital: ${currentPatient.hospital}\n
                City: ${currentPatient.city}\n
                We’ve attached below a copy of your medical history to ease the process of donation.\n
                Thank you for believing in us and for your relentless service to humanity.\n
                You are one step closer to saving a life.\n
                P.S : Do let us know if the match turned out to be successful and if we can assist you in any further way.\n\n Pintnetwork.com ©`,
            attachments: [{
                filename: `${currentDonor.name} Donor Form.pdf`,
                path: `${constants.DONOR_FORM_ATTACHMENT_PATH}/${currentDonor.contact}.pdf`
            }],
        })
            .then(() => {
            })
            .catch(e => {
                console.log("Mail to Donor was unsuccessful ", e.message);
            })

        ,

        email.sendEmailPlain({
            email: currentPatient.email,
            subject: 'PintNetwork - Donor Found',
            message: `\n\n
                Dear Mr./Ms. ${currentPatient.name},\n
            Great news! We’ve found you a donor.\n
            Provided below are the contact details of your nearest donor:\n
            Name:  ${currentDonor.name}\n
            Phone no.:  ${currentDonor.contact}\n
            Email:  ${currentDonor.email}\n
            City:  ${currentDonor.city}\n
            Thank you for believing in us and we hope our services could help you recover faster.\n
            P.S: Do let us know if the match turned out to be successful and if you’d be interested in donating as well post-recovery.\n\n Pintnetwork.com ©`
        }).then(() => {
        })
        .catch(e => {
            console.log("Mail to Patient was unsuccessful ", e.message);
        })
        ,
        sms.sendMatchResponseDonor({
            
            to:currentDonor.contact,
            var1:currentDonor.name,
            var2:session_otp

        }).then(()=>{

        }).catch(err=>{
            console.log(err);
        })

        ,

        sms.sendMatchResponsePatient({
            to:currentPatient.contact,
            var1:currentPatient.name,
            var2:currentDonor.sex=="M"?"his":"her",
            var3:currentDonor.name,
            var4:currentDonor.contact,
            var5:currentDonor.email,
            var6:session_otp

        }).then(()=>{

        }).catch(err=>{
            console.log(err);
            
        })

    ])
    .then(() => {
        fs.unlink(`${constants.DONOR_FORM_ATTACHMENT_PATH}/${currentDonor.contact}.pdf`,(err)=>{
            if(err){
                console.log(`Could not delete donor email rendered pdf to save up space`,err);
            }
        })
    })
    .catch(e => {
        console.log("Mail to Patient was unsuccessful ", e);
    })
}