const router = require('express').Router();
const donorController = require('../controller/donorController')





router
.route('/')
.post(donorController.addDonor)

router
.route('/stat')
.get(donorController.getDonorStats)

module.exports = router;