const mongoose = require('mongoose');

const blooddonorSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  age: {
    type: Number,
    trim: true,
  },
  sex: {
    type: String,
    trim: true,
  },
  contact: {
    type: String,
  },
  email: {
    type: String,
  },
  weight: {
    type: Number,
  },
  blood: {
    type: String,
  },
  city: {
    type: String,
  },
  location: {
    type: String,
    default: 'Location not provided',
  },
  tattoo: {
    type: Number,
  },
  diabities: {
    type: Number,
  },
  heard_from: {
    type: String,
    default: 'Other',
  },
  registeredAt: {
    type: Date,
  },
});

const BloodDonor = mongoose.model('BloodDonor', blooddonorSchema);

module.exports = BloodDonor;
