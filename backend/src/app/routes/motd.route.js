const express = require('express');
const router = express.Router();
const motdController = require('../controllers/motd.controller.ts');
const { check, body, checkSchema } = require('express-validator');

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
router.post('/', [
    check('message', 'Message cannot be empty').not().isEmpty(),
    check('message', 'Message cannot exceed 80 characters').isLength({ max: 80 }),
  ],
  motdController.create
);

/*
 * PUT
 */
router.put('/:id', [
    check('message', 'Message cannot exceed 80 characters').isLength({ max: 80 }),
  ],
  motdController.update
);

/*
 * DELETE
 */
router.delete('/:id', motdController.remove);

module.exports = router;
