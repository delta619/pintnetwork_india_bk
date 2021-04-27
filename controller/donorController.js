const constants = require('../constants');
const {PintDataClass} = require('../utils/PintDataClass')

const Donor = require('../models/donorModel');
const Hit = require('../models/hitModel');

const catchAsync = require('../utils/catchAsync');
const email = require('./../utils/email');

const config = require('../config/config');

const sms = require('../utils/smsService');
const AppError = require('../utils/AppError');
const Patient = require('../models/patientModel');

exports.addDonor = catchAsync(async (req, res, next) => {
  let donor = JSON.parse(JSON.stringify(req.body));

  donor.healthy =
    donor.hiv != 1 &&
    donor.mosquito != 1 &&
    donor.days14over == 1 &&
    donor.pregnant == 0 &&
    donor.age >= 18 &&
    donor.age <= 65;

  let doc = await Donor.create(donor);
  if(doc){
    PintDataClass.incr_Donor_count()
  }

  // if (donor.contact) {
  //   await sms.sendWelcomeMessage(donor);
  // }

  if (donor.email) {
    email.sendEmailPlain({
      email: donor.email,
      subject: 'Welcome to PintNetwork',
      message: `
        <br>Dear ${donor.name},<br>
        <br>Thank you for registering with pintnetwork.com.<br>
        <br>We are trying our best to find you a patient in need of plasma within the next 24-48 hours.<br>
        <br>Once we have made a successful match, you will receive a text message and an email.<br>
        <br>We thank you for your time.<br>
        <br>Regards,
        <br>Team PINT`,
    }).then(res=>{
      console.log("Donor Mail ",donor.name," sent.");
    }).catch(err=>{
      console.log("Donor Mail ",donor.name," failed. ",err);
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
