const express = require("express");
const router = express.Router();
const matchController = require("../controller/matchController");

router
.route('/match')
.get(matchController.matchAllNow)

module.exports = router