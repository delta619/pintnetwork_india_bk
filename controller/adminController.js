const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');
const Donor = require('../models/donorModel');
const Patient = require('../models/patientModel');
const matchController = require('./matchController');
const excel = require('exceljs');
const constants = require('../constants');

exports.checkAdminLogin = catchAsync(async (req, res, next) => {
  const validKey = req.body.token == config.token_backend;

  if (validKey) {
    return res.json({
      status: 200,
    });
  } else {
    throw new Error('Not authorised');
  }
});

exports.getDonors = catchAsync(async (req, res) => {
  let pack = { ...req.body };

  let donors = [];
  let filter = {};

  let query;

  // city filter
  if (pack['cityFilter']['city']) {
    filter['city'] = pack['cityFilter']['city'];
  }

  // blood group filter
  if (pack['bloodGroupFilter']) {
    filter['blood'] = pack['bloodGroupFilter'];
  }
  if(pack["useWarrior"] == false){
    filter['heard_from']= {$ne:'warriors'}
  }
  if(pack['removeDonor28daysfilter'] != true){
    filter['last_symptom_discharge_date'] = {$lt: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000 )}
  }

  // recent filter
  // if (pack['recentFilter']) {
  //   let least_date = new Date() - 100 * 60 * 60 * 1000;
  //   filter['registeredAt'] = { $gt: least_date };
  // }

  query = Donor.find(filter).populate('matchedTo', 'name');

  donors = await query;

  return res.json({
    status: 200,
    results: donors.length,
    data: donors,
  });
});

exports.getPatients = catchAsync(async (req, res) => {
  let pack = { ...req.body };

  let patients = [];
  let filter = {};
  let query;

  // city filter
  if (pack['cityFilter']['city']) {
    filter['city'] = pack['cityFilter']['city'];
  }

  // recent filter
  if (pack['recentFilter']) {
    let least_date = new Date() - 48 * 60 * 60 * 1000;
    filter['registeredAt'] = { $gt: least_date };
  }

  // blood Group Filter

  if (pack['bloodGroupFilter']) {
    filter['blood'] = pack['bloodGroupFilter'];
  }

  query = Patient.find(filter).populate('matchedTo', 'name');

  patients = await query;

  return res.json({
    status: 200,
    results: patients.length,
    data: patients,
  });
});

exports.triggerMatch = async (req, res) => {
  try {
    await matchController.match(
      req.body.data['donor'],
      req.body.data['patient']
    );

    res.status(200).json({
      status: 200,

    });
  } catch (e) {
    throw e;
  }
};

exports.getCities = async (req, res) => {
  
  let filter = {}
  if(req.body.filter.useWarrior != true){
    filter["heard_from"] = {$ne:'warriors'}
  }

  
  const donor_cities = await Donor.distinct('city',filter);

  const patient_cities = await Patient.distinct('city');

  let cities = [... new Set(donor_cities.concat(patient_cities))];


  cities = cities.filter((item, i, ar) => ar.indexOf(item) === i);
  res.json({
    status: 'success',
    data: {
      cities,
    },
  });
};

exports.excelTrigger = async (req, res) => {
  try {
    const donors = await Donor.find({});
    const patients = await Patient.find({});

    let workbook = new excel.Workbook();

    let donorSheet = workbook.addWorksheet('Donors');
    let patientSheet = workbook.addWorksheet('Patients');

    donorSheet.columns = [
      { header: 'Id', key: '_id' },
      { header: 'Name', key: 'name' },
      { header: 'Age', key: 'age' },
      { header: 'Sex', key: 'sex' },
      { header: 'Contact', key: 'contact' },
      { header: 'Email', key: 'email' },
      { header: 'Weight', key: 'weight' },
      { header: 'Blood', key: 'blood' },
      { header: 'City', key: 'city' },
      { header: 'Location', key: 'location' },
      { header: 'Pregnant', key: 'pregnant' },
      { header: 'Tattoo', key: 'tattoo' },
      { header: 'Diabities', key: 'diabities' },
      { header: 'On Medication', key: 'onMedication' },
      { header: 'Anemia', key: 'anemia' },
      { header: 'HIV', key: 'hiv' },
      { header: 'Maleria and TB', key: 'mosquito' },
      { header: 'Cancer', key: 'cancer' },
      { header: 'FLU', key: 'flu' },
      { header: 'Lab Test Confirm', key: 'labTestConfirm' },
      { header: '14 days over', key: 'days14over' },
      { header: 'Last Symptom Date', key: 'last_symptom_discharge_date' },
      { header: 'Follow up test', key: 'hadFollowUp' },
      { header: 'Discharge Report', key: 'dischargeReport' },
      { header: 'Aadhaar', key: 'aadhaar' },
      { header: 'Matched Earlier', key: 'matchedEarlier' },
      { header: 'Matched To', key: 'matchedTo' },
      { header: 'Healthy', key: 'healthy' },
    ];

    patientSheet.columns = [
      { header: 'Id', key: '_id' },
      { header: 'Name', key: 'name' },
      { header: 'Age', key: 'age' },
      { header: 'Sex', key: 'sex' },
      { header: 'Contact', key: 'contact' },
      { header: 'Email', key: 'email' },
      { header: 'Blood', key: 'blood' },
      { header: 'City', key: 'city' },
      { header: 'Hospital', key: 'hospital' },
      { header: 'Doctor"s Prescription', key: 'doctorPrescription' },
      { header: 'Lab Diagnosed', key: 'labDiagnosed' },
      { header: 'Registered At', key: 'registeredAt' },
      { header: 'Healthy', key: 'healthy' },
      { header: 'Matched Earlier', key: 'matchedEarlier' },
      { header: 'Matched To', key: 'matchedTo' },
    ];

    donorSheet.addRows(donors);
    patientSheet.addRows(patients);

    await workbook.xlsx.writeFile(
      `${constants.EXCEL_FILE_ADMIN_PATH}/excel.xlsx`
    );

    const options = {
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true,
      },
    };

    res.sendFile(
      `${constants.EXCEL_FILE_ADMIN_PATH}/excel.xlsx`,
      options,
      (err) => {
        if (err) {
          throw err;
        } else {
          console.log('Xlsx file downloaded');
        }
      }
    );
  } catch (e) {
    throw e;
  }
};

exports.changeStatusDonor = async (req, res) => {
  try {
    let donor = { ...req.body.donor };
    let new_status = req.body.new_status;

    await Donor.findByIdAndUpdate(donor._id, { status: new_status });
  } catch (error) {
    throw error;
  }

  res.json({
    status: 'success',
    data: {
      message: 'Done',
    },
  });
};
exports.changeStatusPatient = async (req, res) => {
  try {
    let patient = { ...req.body.patient };
    let new_status = req.body.new_status;
    await Patient.findByIdAndUpdate(patient._id, { status: new_status });
  } catch (error) {
    throw error;
  }

  res.json({
    status: 'success',
    data: {
      message: 'Done',
    },
  });
};
