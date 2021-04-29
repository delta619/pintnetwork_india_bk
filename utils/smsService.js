const axios = require('axios');
const { sendErrorMail } = require('../controller/emailController');

exports.sendWelcomeMessage = async (person) => {
  try {
    await axios({
      method: 'post',
      url: `http://2factor.in/API/V1/${process.env.SMS_API_KEY}/ADDON_SERVICES/SEND/TSMS`,
      data: {
        From: 'PINTNW',
        To: process.env.DEFAULT_SMS_CONTACT || person.contact,
        TemplateName: 'greeting_v2',
        VAR1: person.name,
      },
    });
  } catch (error) {
    await sendErrorMail(error);
    throw error;
  }
};

// exports.unhealthy_donor_greeting = async (donor) => {
//   await axios({
//     method: 'post',
//     url: `http://2factor.in/API/V1/${process.env.SMS_API_KEY}/ADDON_SERVICES/SEND/TSMS`,
//     data: {
//       From: 'PINTNW',
//       To: process.env.DEFAULT_SMS_CONTACT || donor.contact,
//       TemplateName: 'unhealthy_donor_greeting',
//       VAR1: donor.name,
//     },
//   }).then(
//     (res) => {
//       return true;
//     },
//     (err) => {
//       throw Error(err);
//     }
//   );
// };

// exports.unhealthy_patient_greeting = async (patient) => {
//   await axios({
//     method: 'post',
//     url: `http://2factor.in/API/V1/${process.env.SMS_API_KEY}/ADDON_SERVICES/SEND/TSMS`,
//     data: {
//       From: 'PINTNW',
//       To: process.env.DEFAULT_SMS_CONTACT || patient.contact,
//       TemplateName: 'unhealthy_patient_greeting',
//       VAR1: patient.name,
//     },
//   }).then(
//     (res) => {
//       return true;
//     },
//     (err) => {
//       throw Error(err);
//     }
//   );
// };

exports.sendMatchResponseDonor = async (data) => {
  try {
    axios({
      method: 'post',
      url: `http://2factor.in/API/V1/${process.env.SMS_API_KEY}/ADDON_SERVICES/SEND/TSMS`,
      data: {
        From: 'PINTNW',
        To: process.env.DEFAULT_SMS_CONTACT || data.to,
        TemplateName: 'v3_donor_matched',
        VAR1: data.var1, // Name of the Donor
        VAR2: data.var2, // Blank
      },
    });
  } catch (err) {
    await sendErrorMail(error);

    throw err;
  }
};

exports.sendMatchResponsePatient = async (data) => {
  axios({
    method: 'post',
    url: `http://2factor.in/API/V1/${process.env.SMS_API_KEY}/ADDON_SERVICES/SEND/TSMS`,
    data: {
      From: 'PINTNW',
      To: process.env.DEFAULT_SMS_CONTACT || data.to,
      TemplateName: 'v3_patient_matched',
      VAR1: data.var1, //Name of the Patient
      VAR2: data.var2, //his/her
      VAR3: data.var3, // Details
      VAR4: data.var4, // blank
    }
  }).then(res=>{
    console.log(res.data);
  }).catch(err=>{
    console.log(err);
  });


};
