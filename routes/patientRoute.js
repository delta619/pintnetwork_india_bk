const router = require('express').Router();
const patientController = require('../controller/patientController')



router
.route('/')
.get(patientController.getAllPatients)
.post(patientController.addPatient)
.delete(patientController.deleteAllPatients)


router
.route('/stat')
.get(patientController.getPatientStats)

router
.route('/matches')
.get(patientController.getMatches)


module.exports = router;