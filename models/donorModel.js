const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
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
    trim: true
  },
  location: {
    type: String,
    trim: true,
    default: 'Location not provided',
  },
  pregnant: {
    type: Number,
  },
  tattoo: {
    type: Number,
    required: false
  },
  bp: {
    type: Number,
    required: false
  },
  diabities: {
    type: Number,
    required: false
  },
  onMedication: {
    type: Number,
    required: false
  },
  anemia: {
    type: Number,
    required: false
  },
  hiv: {
    type: Number,
    required: false
  },
  mosquito: {
    type: Number,
    required: false
  },
  cancer: {
    type: Number,
    required: false
  },
  flu: {
    type: Number,
    required: false
  },
  labTestConfirm: {
    type: Number,
    required: false
  },
  days14over: {
    type: Number,
    required: false
  },
  last_symptom_discharge_date: {
    type: Date,
    required: false
  },
  hadFollowUp: {
    type: Number,
    required: false
  },
  dischargeReport: {
    type: Number,
    required: false
  },
  aadhaar: {
    type: Number,
    required: false
  },
  matchedEarlier: {
    type: Boolean,
    default: false,
  },
  matchedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient'
    },
  ],
  healthy: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    default: 'Other',
  },
  heard_from: {
    type: String,
    default: 'Other',
  },
  registeredAt: {
    type: Date,
    required:false
  },
  warrior_key:{
    type: String,
    required: false
  }
});

const Donor = mongoose.model('Donor', donorSchema);

module.exports = Donor;
