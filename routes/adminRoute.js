const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController")
const authenticator = require("../authenticator/checkAdmin");

router.
route('/checkAdminLogin')
.post(adminController.checkAdminLogin)

router
.route('/getDonors')
.post(authenticator.checkAdmin , adminController.getDonors)

router
.route('/getPatients')
.post(authenticator.checkAdmin , adminController.getPatients)

router
.route('/triggerMatch')
.post(authenticator.checkAdmin , adminController.triggerMatch)




module.exports = router