const express = require('express');
const router = express.Router();
const motdRoute = require('./motd.route.js');
const { check } = require('express-validator');

router.use('/motd', motdRoute);

module.exports = router;
