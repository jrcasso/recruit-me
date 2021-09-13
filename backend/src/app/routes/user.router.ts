import { Types } from 'mongoose';
import { UserController } from '../controllers/user.controller';
import { User } from '../models/user.model';
import { Router } from 'express';
import { body, param } from 'express-validator';


export class UserRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.router.get('/', (req, res) => UserController.list(req, res));
    this.router.get('/:id', [
      param('id')
        .exists({checkFalsy: true}).withMessage('ID parameter cannot be empty.').bail()
        .custom(id => Types.ObjectId.isValid(id)).withMessage('ID parameter must be valid.')
    ],
    (req, res) => UserController.show(req, res)
    );
    this.router.post('/', [
      body('email')
        .exists({checkFalsy: true}).withMessage('Email cannot be empty.').bail()
        .isEmail().withMessage('Email provided must be valid.').bail()
        .custom((email: string) => User.findOne({ email }).then(user => {
          if (user) {return Promise.reject('E-mail already in use.'); }
        })),
      body('password')
        .exists({checkFalsy: true}).withMessage('Password cannot be empty.').bail()
        .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)
        .withMessage('Password provided must meet complexity requirements.'),
      body('firstname', 'First name provided must be valid.').matches(/^[a-zA-Z]+$/),
      body('lastname', 'Last name provided must be valid.').matches(/^[a-zA-Z]+$/)
    ],
    (req, res) => UserController.create(req, res)
    );
    this.router.put('/:id', [
      param('id')
        .exists({checkFalsy: true}).withMessage('ID parameter cannot be empty.').bail()
        .custom(id => Types.ObjectId.isValid(id)).withMessage('ID parameter must be valid.')
    ],
    (req, res) => UserController.update(req, res)
    );
    this.router.delete('/:id', [
      param('id')
        .exists({checkFalsy: true}).withMessage('ID parameter cannot be empty.').bail()
        .custom(id => Types.ObjectId.isValid(id)).withMessage('ID parameter must be valid.')
    ],
    (req, res) => UserController.remove(req, res)
    );
  }
}
