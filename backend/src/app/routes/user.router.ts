import { Types } from 'mongoose';
import { UserController } from '../controllers/user.controller';
import { User } from '../models/user.model';
import * as Express from 'express';
const { body, param } = require('express-validator');


export class UserRouter {
  public router: any;
  public userModel: any;
  public userController: any;

  constructor() {
    this.router = Express.Router();
    this.userController = new UserController();
    this.router.get('/', this.userController.list);
    this.router.get('/:id', [
      param('id')
        .exists({checkFalsy: true}).withMessage('ID parameter cannot be empty.').bail()
        .custom(id => Types.ObjectId.isValid(id)).withMessage('ID parameter must be valid.')
    ],
    this.userController.show
    );
    this.router.post('/', [
      body('email')
        .exists({checkFalsy: true}).withMessage('Email cannot be empty.').bail()
        .isEmail().withMessage('Email provided must be valid.').bail()
        .custom(email => User.findOne({ email }).then(user => {
          if (user) {return Promise.reject('E-mail already in use.'); }
        })),
      body('password')
        .exists({checkFalsy: true}).withMessage('Password cannot be empty.').bail()
        .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)
        .withMessage('Password provided must meet complexity requirements.'),
      body('firstname', 'First name provided must be valid.').matches(/^[a-zA-Z]+$/),
      body('lastname', 'Last name provided must be valid.').matches(/^[a-zA-Z]+$/)
    ],
    this.userController.create
    );
    this.router.put('/:id', [
      param('id')
        .exists({checkFalsy: true}).withMessage('ID parameter cannot be empty.').bail()
        .custom(id => Types.ObjectId.isValid(id)).withMessage('ID parameter must be valid.')
    ],
    this.userController.update
    );
    this.router.delete('/:id', [
      param('id')
        .exists({checkFalsy: true}).withMessage('ID parameter cannot be empty.').bail()
        .custom(id => Types.ObjectId.isValid(id)).withMessage('ID parameter must be valid.')
    ],
    this.userController.remove
    );
  }
}
