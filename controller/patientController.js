const Patient = require('../models/patientModel');

const catchAsync = require('../utils/catchAsync');
const email = require('./../utils/email');
const sms = require('../utils/smsService');

const { PintDataClass } = require('../utils/PintDataClass');

exports.getPatientStats = catchAsync(async (req, res, next) => {
  const patients = await Patient.find({});

  res.status(200).json({
    status: 'Success',
    length: patients.length,
  });
});

exports.getMatches = catchAsync(async (req, res, next) => {
  const matches = await Patient.find({matchedEarlier:true});

  res.status(200).json({
    status: 'Success',
    matches:matches.length,
  });
});

exports.addPatient = catchAsync(async (req, res, next) => {
  console.log(req.body);
  let patient = { ...req.body };

  patient.healthy =
    patient.labDiagnosed == 1 && patient.doctorPrescription == 1;

  let doc = await Patient.create(patient)


  
  if (doc) {
    console.log(doc.registeredAt);
    PintDataClass.incr_Patient_count()
  }
  if (patient.contact) {
    await sms.sendWelcomeMessage(patient);
  }

  if (patient.email) {
     email.sendEmailPlain({
      email: patient.email,
      subject: 'Welcome to PintNetwork',
      message: `
        <br>Dear ${patient.name},<br>
        <br>Thank you for registering with pintnetwork.com.<br>
        <br>We are trying our best to find you with a donor within the next 24-48 hours.<br>
        <br>Once we have made a successful match, you will receive a text message and email with the donor’s details.<br>
        <br>We thank you for your time.<br>
        <br>Regards,
        <br>Team PINT
        `,
    }).then(res=>{
      console.log("Donor Mail sent ",patient.name);
    }).catch(err=>{
      console.log(err);
    });
  }

  return res.status(200).json({
    status: 200,
    message: 'success',
  });
});
