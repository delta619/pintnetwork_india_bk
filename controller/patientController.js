const Patient = require('../models/patientModel');
const Donor = require('../models/donorModel');

const catchAsync = require('../utils/catchAsync');
const email = require('./../utils/email');
const sms = require('../utils/smsService');

const e = require('express');

exports.getPatientStats = catchAsync(async (req, res, next) => {
  const patients = await Patient.find({});

  res.status(200).json({
    status: 'Success',
    length: patients.length,
  });
});

exports.getMatches = catchAsync(async (req, res, next) => {
  const donors = await Donor.find({});

  let matches = 0;

  for (let i = 0; i < donors.length; i++) {
    if (donors[i]['matchedEarlier'] == true) {
      matches = matches + 1;
    }
  }

  res.status(200).json({
    status: 'Success',
    matches,
  });
});

exports.addPatient = catchAsync(async (req, res, next) => {
  let patient = JSON.parse(JSON.stringify(req.body));

  patient.healthy =
    patient.labDiagnosed == 1 && patient.doctorPrescription == 1;

  await Patient.create(patient);

  if (patient.contact) {
    await sms.sendWelcomeMessage(patient);
  }

  if (patient.email) {
    await email.sendEmailPlain({
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
    });
  }

  return res.status(200).json({
    status: 200,
    message: 'success',
  });
});
