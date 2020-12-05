const router = require('express').Router();
const donorController = require('../../controller/bloodController/bloodController');

router.route('/donor').post(donorController.addBloodDonor);

router.route('/patient').post(donorController.addBloodPatient);

module.exports = router;
