const router = require('express').Router();
const donorController = require('../controller/donorController')





router
.route('/')
.get(donorController.getAllDonors)
.post(donorController.addDonor)
.delete(donorController.deleteAllDonors)

module.exports = router;