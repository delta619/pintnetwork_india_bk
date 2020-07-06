const constants = require('../constants')

const Donor = require("../models/donorModel");
const Patient = require("../models/patientModel");

const email = require('./email');
const sms = require('./smsService');

const AppError = require("./AppError");
const pdf = require('../utils/pdfModule/pdfGenerator')

const fs = require('fs')
const path = require('path')





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
    console.log(`City Check was false for ${currentDonor._id} & ${currentPatient._id}`);
    return false;
}

exports.isMatch = (d, p) => {

    if (bloodMatchCheck(d, p) && cityCheck(d, p)) {
        return true;
    } else {
        return false;
    }
}

exports.inform = async (currentDonor, currentPatient) => {

    let session_otp = 1000 + Math.round((Math.random() * 9000));

    currentDonor.otp = session_otp;
    currentPatient.otp = session_otp;

    // Preparing attachment for donor


    console.log(`step 1 creating donors pdf`);
    try {
        await pdf.renderDonorEmail(currentDonor)

    } catch (e) {
        throw e
    }


    Promise.all([

        email.sendEmailWithAttachments({
            email: currentDonor.email,
            subject: 'PintNetwork - Patient Found',
            message: `<br>
            <br>Dear ${currentDonor.name} ,<br>
            <br>Great news! We’ve found you a patient who needs plasma.<br>
            <br>Here is the patient OTP: ${session_otp}<br>
            <br>The patient will contact you within the next 24-48 hours. In case of any further delay, please
            <br>reach out to us so we can match you to another patient in need.<br>
            <br>We’ve attached below a copy of your medical history to ease the process of donation.<br>
            <br>Thank you for believing in us and for your relentless service to humanity.<br>
            <br>You are one step closer to saving a life ☺<br>
            <br>P.S : Do let us know if the match turned out to be successful and if we can assist you in any
            <br>further way<br>
            <br>Regards,
            <br>Team PINT`,
            attachments: [{
                filename: `${currentDonor.name} Donor Form.pdf`,
                path: `${constants.DONOR_FORM_ATTACHMENT_PATH}/${currentDonor._id}.pdf`
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
            message: `Dear ${currentPatient.name},<br>
            <br>Great news! We’ve found you a donor.<br>
            <br>Provided below are the contact details of your nearest donor:<br>
            <br>Name:${currentDonor.name}
            <br>Phone no.:${currentDonor.contact}
            <br>Email:${currentDonor.email}
            <br>Location:${currentDonor.location}
            <br>OTP:${session_otp}
            <br>Please contact the donor as early as possible. In case the donor does not respond within 24-48 hours, please reach out to us so we can match you to another donor.<br>
            <br>Thank you for believing in us and we hope our services could help you recover faster.<br>
            <br>P.S: Do let us know if the match turned out to be successful and if you’d be interested in donating as well post-recovery
            <br>Regards,
            <br>Team PINT
            `
        }).then(() => {
        })
            .catch(e => {
                console.log("Mail to Patient was unsuccessful ", e.message);
            })
        ,
        sms.sendMatchResponseDonor({

            to: currentDonor.contact,
            var1: currentDonor.name,
            var2: session_otp

        }).then(() => {

        }).catch(err => {
            console.log(err);
        })

        ,

        sms.sendMatchResponsePatient({
            to: currentPatient.contact,
            var1: currentPatient.name,
            var2: currentDonor.sex == "M" ? "his" : "her",
            var3: currentDonor.name,
            var4: currentDonor.contact,
            var5: currentDonor.email,
            var6: session_otp

        }).then(() => {



        }).catch(err => {
            console.log(err);

        })

    ])
        .then(() => {
            fs.unlink(`${constants.DONOR_FORM_ATTACHMENT_PATH}/${currentDonor._id}.pdf`, (err) => {
                if (err) {
                    throw err
                }
            })
        })

}