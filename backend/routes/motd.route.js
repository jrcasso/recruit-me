var express = require('express');
var router = express.Router();
var motdController = require('../controllers/motd.controller.js');

/*
 * GET
 */
router.get('/', motdController.list);

/*
 * GET
 */
router.get('/:id', motdController.show);

/*
 * POST
 */
router.post('/', motdController.create);

/*
 * PUT
 */
router.put('/:id', motdController.update);

/*
 * DELETE
 */
router.delete('/:id', motdController.remove);

module.exports = router;
