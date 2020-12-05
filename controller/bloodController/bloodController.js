const catchAsync = require('../../utils/catchAsync');
const BloodDonor = require('../../models/blood/bloodDonorModel');
const BloodPatient = require('../../models/blood/bloodPatientModel');

const email = require('./../../utils/email');
const sms = require('../../utils/smsService');

exports.addBloodDonor = catchAsync(async (req, res, next) => {
  let donor = await BloodDonor.create(req.body);
  if (donor.email) {
    email
      .sendEmailPlain({
        email: donor.email,
        subject: 'Welcome to PintNetwork',
        message: `Dear ${donor.name}, Thank you for registering on pintnetwork.com .We’re trying our best to find you a hospital or patient in need as soon as possible.`,
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return res.status(200).json({
    status: 'success',
    data: donor,
  });
});

exports.addBloodPatient = catchAsync(async (req, res, next) => {
  console.log(req.body);
  let patient = await BloodPatient.create(req.body);

  if (patient.email) {
    email
      .sendEmailPlain({
        email: patient.email,
        subject: 'Welcome to PintNetwork',
        message: `Dear ${patient.name}, Thank you for registering on pintnetwork.com . We’re trying our best to find you a donor as soon as possible.`,
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return res.status(200).json({
    status: 'success',
    data: patient,
  });
});
