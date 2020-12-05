const mongoose = require('mongoose');

const bloodpatientSchema = new mongoose.Schema({
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
  blood: {
    type: String,
  },
  city: {
    type: String,
  },
  atHospital: {
    type: String,
  },
  heard_from: {
    type: String,
    default: 'Other',
  },
  registeredAt: {
    type: Date,
  },
});

const BloodPatient = mongoose.model('BloodPatient', bloodpatientSchema);

module.exports = BloodPatient;
