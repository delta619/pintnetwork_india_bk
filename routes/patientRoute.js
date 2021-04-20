const router = require('express').Router();
const patientController = require('../controller/patientController')



router
.route('/')
.post(patientController.addPatient)

router
.route('/matches')
.get(patientController.getMatches)


module.exports = router;