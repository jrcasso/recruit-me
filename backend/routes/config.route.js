const express = require('express');
const router = express.Router();
const introRoute = require('./intro.route.js');
const { check } = require('express-validator');

router.use('/intro', introRoute);

module.exports = router;
