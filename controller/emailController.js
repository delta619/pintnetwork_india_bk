const email = require('../utils/email');
const constants = require('../constants');

exports.sendMatchMailDonor = async (currentDonor, currentPatient) => {
  try {
    let fname = currentPatient.name.split(' ')[0];
    let lname = currentPatient.name.split(' ')[1];

    await email.sendEmailPlain({
      email: currentDonor.email,
      subject: 'PintNetwork - Patient Found',
      message: `<br>Dear ${currentDonor.name},<br>
        <br>Great news! We’ve found you a patient who needs plasma.<br>
        <br>The Patient's name is <b>${fname}${
        lname ? ' ' + lname[0] : ''
      }</b>.<br>
        <br>The patient will contact you within the next 24-48 hours. In case of any further delay, please
        <br>reach out to us so we can match you to another patient in need.<br>
        <br>Thank you for believing in us and for your relentless service to humanity.<br>
        <br>You are one step closer to saving a life ☺<br>
        <br>P.S : Do let us know if the match turned out to be successful and if we can assist you in any
        <br>further way<br>
        <br>Regards,
        <br>Team PINT`,
    });
  } catch (e) {
    throw e;
  }
};

exports.sendMatchMailPatient = async (currentDonor, currentPatient) => {
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
        <br>Please contact the donor as early as possible. In case the donor does not respond within 24-48 hours, please reach out to us so we can match you to another donor.<br>
        <br>Thank you for believing in us and we hope our services could help you recover faster.<br>
        <br>P.S: Do let us know if the match turned out to be successful and if you’d be interested in donating as well post-recovery
        <br>Regards,
        <br>Team PINT
        `,
    });
  } catch (error) {
    throw e;
  }
};
