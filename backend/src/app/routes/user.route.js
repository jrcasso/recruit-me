const express = require('express');
const router = express.Router();
const mongoose = require( 'mongoose' );
const userController = require('../controllers/user.controller.js');
const userModel = require('../models/user.model.js');
const { body, param } = require('express-validator');

/*
 * GET
 */
router.get('/', userController.list);

/*
 * GET
 */
router.get('/:id', [
    param('id')
      .exists({checkFalsy: true}).withMessage('ID parameter cannot be empty.').bail()
      .custom(id => mongoose.Types.ObjectId.isValid(id)).withMessage('ID parameter must be valid.')
  ],
  userController.show
);

/*
 * POST
 *
 * Note:
 * Validators here simply append validation metadata to the request for downstream
 * processing in the controller; failures must still be handled in the controller.
 */
router.post('/', [
    body('email')
      .exists({checkFalsy: true}).withMessage('Email cannot be empty.').bail()
      .isEmail().withMessage('Email provided must be valid.').bail()
      .custom(email => userModel.findByEmail(email).then(user => {
        if (user) return Promise.reject('E-mail already in use.');
      })),
    body('password')
      .exists({checkFalsy: true}).withMessage('Password cannot be empty.').bail()
      .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)
        .withMessage('Password provided must meet complexity requirements.'),
    body('firstname', 'First name provided must be valid.').matches(/^[a-zA-Z]+$/),
    body('lastname', 'Last name provided must be valid.').matches(/^[a-zA-Z]+$/)
  ],
  userController.create
);

/*
 *
 */
router.put('/:id', [
    param('id')
      .exists({checkFalsy: true}).withMessage('ID parameter cannot be empty.').bail()
      .custom(id => mongoose.Types.ObjectId.isValid(id)).withMessage('ID parameter must be valid.')
  ],
  userController.update
);

/*
 * DELETE
 */
router.delete('/:id', [
    param('id')
      .exists({checkFalsy: true}).withMessage('ID parameter cannot be empty.').bail()
      .custom(id => mongoose.Types.ObjectId.isValid(id)).withMessage('ID parameter must be valid.')
  ],
  userController.remove
);

module.exports = router;
