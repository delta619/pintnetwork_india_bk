const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');
const Donor = require("../models/donorModel");
const Patient = require("../models/patientModel");
const matchController = require('./matchController');
const excel = require('exceljs');
const fs = require('fs');
const constants = require("../constants");

exports.checkAdminLogin = catchAsync(async (req, res, next) => {

    const validKey = (req.body.token == config.token_backend);


    if (validKey) {
        return res.json({
            status: 200
        })
    } else {
        throw new Error("Not authorised")
    }
})

exports.getDonors = catchAsync(async (req, res) => {

    const donors = await Donor.find({});
    return res.json({
        status: 200,
        data: donors
    })


})

exports.getPatients = catchAsync(async (req, res) => {

    const patients = await Patient.find({});

    return res.json({
        status: 200,
        data: patients
    })


})

exports.triggerMatch = async (req, res) => {

    try {
        await matchController.match(req.body.data["donor"], req.body.data["patient"])

        res.status(200).json({
            status: 200
        })

    } catch (e) {
        throw e
    }


}


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

        ]

        donorSheet.addRows(donors);
        patientSheet.addRows(patients);
        
        await workbook.xlsx.writeFile(`${constants.EXCEL_FILE_ADMIN_PATH}/excel.xlsx`)
        
        res.download(`${constants.EXCEL_FILE_ADMIN_PATH}/excel.xlsx`);
        
    } catch (e) {
        throw e;
    }
}