const express = require('express');
const router = express.Router();
const introController = require('../controllers/intro.controller.js');
const { check, body, checkSchema } = require('express-validator');

/*
 * GET
 */
router.get('/', introController.list);

/*
 * GET
 */
router.get('/:id', introController.show);

/*
 * POST
 */
router.post('/', [
    check('message', 'Message cannot be empty').not().isEmpty(),
    check('message', 'Message cannot exceed 80 characters').isLength({ max: 80 }),
  ],
  introController.create
);

/*
 * PUT
 */
router.put('/:id', [
    check('message', 'Message cannot exceed 80 characters').isLength({ max: 80 }),
  ],
  introController.update
);

/*
 * DELETE
 */
router.delete('/:id', introController.remove);

module.exports = router;
