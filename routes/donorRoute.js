const router = require('express').Router();
const donorController = require('../controller/donorController')





router
.route('/')
.post(donorController.addDonor)

module.exports = router;