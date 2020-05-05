import express from 'express';
import router from express.Router();
import motdRoute from './motd.route.js';
import { check } from 'express-validator';

router.use('/motd', motdRoute);

module.exports = router;
