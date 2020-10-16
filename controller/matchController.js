const sms = require('../utils/smsService');
const emailController = require('./emailController');
const Donor = require('../models/donorModel');
const Patient = require('../models/patientModel');
const pdf = require('../utils/pdfModule/pdfGenerator');
const fs = require('fs');
const constants = require('../constants');

exports.match = async (donor, patient) => {
  // let otp = 1000 + Math.floor(Math.random() * 1000);

  try {
    await Donor.findById(donor._id, (err, doc) => {
      if (doc) {
        doc.matchedEarlier = true;
        let list = doc.matchedTo;
        list.push(patient._id);
        doc.matchedTo = list;

        console.log(doc.matchedTo);
        doc.save((err) => {
          if (err) console.log('Update was not saved', err);
        });
      }
      if (err) {
        throw err;
      }
    });

    await Patient.findById(patient._id, (err, doc) => {
      if (doc) {
        doc.matchedEarlier = true;
        let list = doc.matchedTo;
        list.push(donor._id);
        doc.matchedTo = list;

        console.log(doc.matchedTo);
        doc.save((err) => {
          if (err) console.log('Update was not saved', err);
        });
      }
      if (err) {
        throw err;
      }
    });

    //SOME text messages BELOW

    if (donor.contact) {
      await sms.sendMatchResponseDonor({
        // to: donor.contact,

        to: donor.contact,
        var1: donor.name,
        var2: '',
      });
    }

    if (patient.contact) {
      await sms.sendMatchResponsePatient({
        to: patient.contact,
        var1: patient.name,
        var2: donor.sex == 'M' ? 'his' : 'her',
        var3: `${donor.name}, ${donor.contact}, ${donor.email}`,
        var4: '',
      });
    }

    //    if Donor doesnt have an email

    if (!donor.email) {
      donor.email = 'Not available';
      await emailController.sendMatchMailPatient(donor, patient);
    } else if (!patient.email) {
      //    Patient doesnt have a mail
      await emailController.sendMatchMailDonor(donor, patient);
    } else {
      //    if all have emails
      await emailController.sendMatchMailDonor(donor, patient);
      await emailController.sendMatchMailPatient(donor, patient);
    }
  } catch (error) {
    await emailController.sendErrorMail(error);
  }
};
