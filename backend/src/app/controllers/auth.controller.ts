import { IAuth, Auth } from '../models/auth.model';
import { IUser, User } from '../models/user.model';
import { Error } from 'mongoose';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { compare } from 'bcrypt';
import { SignJWT } from 'jose/jwt/sign';

export interface AuthRequest extends Request {
  email: string;
  password: string;
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
    User.findOne({email: req.body.email}, 'password', null, (err: Error, user: IUser) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when authorizing',
          error: err
        });
      }
      if (!user) {
        return res.status(404).json({
          // Generic error message to avoid user enumeration
          // In this case, a user was not found with that email
          message: 'Invalid credentials'
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      compare(req.body.password, user.password, async function(err, result) {
        if (!result) {
          // Generic error message to avoid password enumeration
          // In this case, the passwords did not match
          return res.status(401).json({
            message: 'Invalid credentials'
          });
        }

        // const jwt = await new SignJWT({ 'urn:example:claim': true })
        //   .setProtectedHeader({ alg: 'ES256' })
        //   .setIssuedAt()
        //   .setIssuer('urn:example:issuer')
        //   .setAudience('urn:example:audience')
        //   .setExpirationTime('2h')
        //   .sign(process.env.PRIVATE_KEY)

        // console.log(jwt)

        const token = new Auth({
          user_id: user._id,
          // token: jwt,
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
    Auth.findByIdAndRemove(req.params.id, null, (err: Error) => {
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
