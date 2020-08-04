const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const authenticator = require('../authenticator/checkAdmin');

router.route('/checkAdminLogin').post(adminController.checkAdminLogin);

router
  .route('/getDonors')
  .post(authenticator.checkAdmin, adminController.getDonors);

router
  .route('/getPatients')
  .post(authenticator.checkAdmin, adminController.getPatients);

router
  .route('/triggerMatch')
  .post(authenticator.checkAdmin, adminController.triggerMatch);

router
  .route('/getCities')
  .post(authenticator.checkAdmin, adminController.getCities);

router
  .route('/excel')
  .post(authenticator.checkAdmin, adminController.excelTrigger);

router
  .route('/changeStatusDonor')
  .post(authenticator.checkAdmin, adminController.changeStatusDonor);

router
  .route('/changeStatusPatient')
  .post(authenticator.checkAdmin, adminController.changeStatusPatient);

module.exports = router;
