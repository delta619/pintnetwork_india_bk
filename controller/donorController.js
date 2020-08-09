const constants = require('../constants');

const Donor = require('../models/donorModel');
const Hit = require('../models/hitModel');

const catchAsync = require('../utils/catchAsync');
const email = require('./../utils/email');

const config = require('../config/config');

const sms = require('../utils/smsService');
const AppError = require('../utils/AppError');

exports.addDonor = catchAsync(async (req, res, next) => {
  let donor = JSON.parse(JSON.stringify(req.body));

  donor.healthy =
    donor.hiv != 1 &&
    donor.mosquito != 1 &&
    donor.days14over == 1 &&
    donor.pregnant == 0 &&
    donor.age >= 18 &&
    donor.age <= 65;

  await Donor.create(donor);

  if (!donor.healthy) {
    await sms.unhealthy_donor_greeting(donor);

    await email.sendEmailPlain({
      email: donor.email,
      subject: 'Welcome to PintNetwork',
      message: `
      Dear ${donor.name},<br>
      <br>Thank you for registering with pintnetwork.com.<br>
      <br>Unfortunately you did not meet the criteria for plasma donation.<br>
      <br>Thank you for your time and effort, we’d love to know if we can assist you in any further way.<br>
      <br>Regards,
      <br>Team PINT`,
    });
  } else {
    await sms.sendWelcomeMessage(donor);

    await email.sendEmailPlain({
      email: donor.email,
      subject: 'Welcome to PintNetwork',
      message: `
      <br>Dear ${donor.name},<br>
      <br>Thank you for registering with pintnetwork.com.<br>
      <br>We are trying our best to find you a patient in need of plasma within the next 24-48 hours.<br>
      <br>Once we have made a successful match, you will receive a text message and email with the patient’s OTP.<br>
      <br>We thank you for your time.<br>
      <br>Regards,
      <br>Team PINT`,
    });
  }

  return res.json({
    status: 200,
    message: 'success',
  });
});

exports.getAllDonors = catchAsync(async (req, res, next) => {
  if (req.body.token == config.token_backend) {
    const donors = await Donor.find({});

    return res.status(200).json({
      status: 'Success',
      results: donors.length,

      data: donors,
    });
  } else {
    next(new AppError('hi', 500));
  }
});

exports.getDonorStats = catchAsync(async (req, res, next) => {
  const donors = await Donor.find({});

  res.json({
    status: 200,
    length: donors.length,
  });
});
