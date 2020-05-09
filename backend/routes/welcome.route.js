const express = require('express');
const router = express.Router();
const welcomeController = require('../controllers/welcome.controller.js');
const { check, body, checkSchema } = require('express-validator');

/*
 * GET
 */
router.get('/', welcomeController.list);

/*
 * GET
 */
router.get('/:id', welcomeController.show);

/*
 * POST
 */
router.post('/', checkSchema({
    topics: {
      custom: {
        options: (topics, { req, location, path }) => {
          validity = true
          topics.forEach(topic => {
            validity &= !!topic.title && !!topic.body && (topic.body.length > 20) && topic.title.length > 3
          });
          return validity;
        }
      },
      errorMessage: 'At least one topic must be provided.',
    }
  }),
  welcomeController.create
);

/*
 *
 */
router.put('/:id', [
    check('message', 'Message cannot exceed 80 characters').isLength({ max: 80 }),
  ],
  welcomeController.update
);

/*
 * DELETE
 */
router.delete('/:id', welcomeController.remove);

module.exports = router;
