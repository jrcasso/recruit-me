const express = require('express');
const router = express.Router();
const motdRoute = require('./motd.route.js');
const welcomeRoute = require('./welcome.route.js');
const { check } = require('express-validator');

router.use('/motd', motdRoute);
router.use('/welcome', welcomeRoute);

module.exports = router;
