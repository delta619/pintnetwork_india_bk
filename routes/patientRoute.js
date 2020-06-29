const router = require('express').Router();
const patientController = require('../controller/patientController')



router
.route('/')
.get(patientController.getAllPatients)
.post(patientController.addPatient)
.delete(patientController.deleteAllPatients)



module.exports = router;