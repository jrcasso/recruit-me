import { IAuth, Auth } from '../models/auth.model';
import { IUser, User } from '../models/user.model';
import { Error } from 'mongoose';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { compare } from 'bcrypt';
import { SignJWT } from 'jose/jwt/sign';
import { readFileSync } from 'fs';
import { createPrivateKey } from 'crypto';


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
    // Expiry in is hours
    const TOKEN_EXPIRY = 4

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    User.findOne({email: req.body.email}, ['active', 'password', 'verified'], null, (err: Error, user: IUser) => {
      if (err) {
        return res.status(500).json({
          message: 'Error while authenticating',
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
        // After this block, less generic response messages are allowed
        if (!result) {
          // Generic error message to avoid password enumeration
          // In this case, the passwords did not match
          return res.status(401).json({
            message: 'Invalid credentials'
          });
        }
        if (!user.verified) {
          return res.status(401).json({
            message: 'User has not been verified'
          });
        }
        if (!user.active) {
          return res.status(401).json({
            message: 'User is inactive'
          });
        }
        // EC PEM keys can be generated as such:
        // openssl ecparam -name prime256v1 -genkey -noout -out private.pem
        // openssl ec -in private.pem -pubout -out public.pem
        const jwt = await new SignJWT(
          {
            'urn:justinshipscode:claim': true
          })
          .setProtectedHeader({ alg: 'ES256' })
          .setIssuedAt()
          .setIssuer('urn:justinshipscode:mean-demo')
          .setAudience('urn:justinshipscode:users')
          .setExpirationTime(`${TOKEN_EXPIRY}h`)
          .sign(createPrivateKey(readFileSync(`${process.env.CONFIG_PATH}/private.pem`).toString()))

        let created = new Date()
        let expiry = new Date()
        expiry.setHours(expiry.getHours() + TOKEN_EXPIRY)

        const token = new Auth({
          user_id: user._id,
          token: jwt,
          created: created,
          expiry: expiry
        });

        token.save((e: Error, u: IAuth) => {
          if (e) {
            return res.status(500).json({
              message: 'Error while creating authorization',
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
          message: 'Error while removing authorization',
          error: err
        });
      }
      return res.status(204).json();
    }).catch((err) => console.error(err));
  }
}
