const express = require("express");
const router = express.Router({mergeParams:true});

const authController = require("../controller/authController");
const reviewController = require('../controller/reviewController')


router
.route('/')
.get(reviewController.getAllReviews)
.post(authController.protect, reviewController.setTourUserIds, reviewController.createReview)


router
.route('/:id')
.get(reviewController.getReview)
.patch(reviewController.updateReview)
.delete( reviewController.deleteReview)








module.exports = router;
