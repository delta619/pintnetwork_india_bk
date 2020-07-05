const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController")
router
.route('/match')
.get(adminController.matchAllNow)


router.
route('/checkAdminLogin')
.post(adminController.checkAdminLogin)

module.exports = router