const express = require('express');
const router = express.Router();

const motdRoute = require('./motd.route.js');
const userRoute = require('./user.route.js');

router.use('/motd', motdRoute);
router.use('/user', userRoute);

module.exports = router;
