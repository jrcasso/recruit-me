import { Types } from 'mongoose';
import { AuthController } from '../controllers/auth.controller';
import { Auth } from '../models/auth.model';
import { User } from '../models/user.model';
import { Router } from 'express';
import { body, param } from 'express-validator';


export class AuthRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.router.post('/', [
        body('email')
          .exists({checkFalsy: true}).withMessage('Email cannot be empty').bail()
          .isEmail().withMessage('Email provided must be valid').bail()
          .custom(this.checkIfUserExists).bail(),
        body('password')
          .exists({checkFalsy: true}).withMessage('Invalid credentials').bail()
      ],
      (req, res) => AuthController.create(req, res)
    );
    this.router.delete('/:id', [
        param('id')
          .exists({checkFalsy: true}).withMessage('ID parameter cannot be empty').bail()
          .custom(id => Types.ObjectId.isValid(id)).withMessage('ID parameter must be valid')
      ],
      (req, res) => AuthController.remove(req, res)
    );
  }

  public async checkIfUserExists(email: string) {
    User.findOne({ email }).then(user => {
      if (!user) {
        return Promise.reject('Invalid credentials');
      }
    })
  }
}
