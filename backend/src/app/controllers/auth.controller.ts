import { IAuth, Auth } from '../models/auth.model';
import { IUser, User } from '../models/user.model';
import { Error } from 'mongoose';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { compare } from 'bcrypt';

export interface AuthRequest extends Request {
  params: {
    email: string;
    password: string;
  }
}
/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
export class AuthController {
  constructor() {}

  public static create(req: AuthRequest, res: Response): Response<any> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    User.findOne({email: req.params.email}, (err: Error, user: IUser) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when authorizing',
          error: err
        });
      }
      if (!user) {
        return res.status(404).json({
          message: 'No user with that email'
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      compare(user.password, user.password, function(err, result) {
        // Store hash in your password DB.
        if (!result) {
          return res.status(401)
        }
        const token = new Auth({
          user_id: user._id,
          token: 'foo',
          expiry: Date()
        });
        token.save((e: Error, u: IAuth) => {
          if (e) {
            return res.status(500).json({
              message: 'Error when creating auth',
              error: e
            });
          }
          return res.status(201).json(u);
        });
      });
      return res.status(401)
    }).catch((err) => console.error(err));
  }

  public static remove(req: Request, res: Response): Response<any> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    Auth.findByIdAndRemove(req.params.id, (err: Error) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when removing auth.',
          error: err
        });
      }
      return res.status(204).json();
    }).catch((err) => console.error(err));
  }
}
