const email = require("../utils/email");
const constants = require('../constants')




exports.sendMatchMailDonor = async(currentDonor, session_otp) => {
    try {
       await email.sendEmailWithAttachments({
            email: currentDonor.email,
            subject: 'PintNetwork - Patient Found',
            message: `<br>Dear ${currentDonor.name} ,<br>
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
        
    } catch (e) {
        throw e;
    }
    
}

exports.sendMatchMailPatient = async(currentDonor,currentPatient, session_otp) => {
   try {
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
    })
    
   } catch (error) {
       throw e
   }
    
}