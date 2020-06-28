const express = require("express");
const router = express.Router();

const tourController = require("../controller/tourController");
const authController = require("../controller/authController");
const reviewRouter = require('../routes/reviewRoutes');
const { get } = require("mongoose");


router.use('/:tourId/reviews', reviewRouter);

router
.route('/top-3-cheap').get(tourController.aliasTopTours, tourController.getAllTours)

router
.route('/tours-within/:distance/center/:latlng/unit/:unit')
.get(tourController.getToursWithin)

router
.route('/distances/:latlng/unit/:unit')
.get(tourController.getDistances);

router
.route('/tour-stats')
.get(tourController.getTourStats)


router
.route('/monthly-plan/:year')
.get(tourController.getMonthlyPlan)


router
.route("/")
.get(authController.protect, tourController.getAllTours)
.post(tourController.createTour)


router
.route('/:id')
.get(authController.protect, authController.restrictTo('admin','lead-guide'), tourController.getTour)
.patch(tourController.updateTour)
.delete(tourController.deleteTour)





module.exports = router;