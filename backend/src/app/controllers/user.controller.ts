import { User } from '../models/user.model';
const mongoose = require( 'mongoose' );
const { validationResult } = require('express-validator');

import * as Bcrypt from 'bcrypt';

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
export class UserController {
  constructor() {}

  public static list(req, res): void {
    User.find((err, users) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting users.',
          error: err
        });
      }
      return res.json(users);
    }).catch((err) => console.error(err));
  }

  public static show(req, res): void {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    User.findOne({_id: req.params.id}, (err, user) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting user.',
          error: err
        });
      }
      if (!user) {
        return res.status(404).json({
          message: 'No such user'
        });
      }
      return res.json(user);
    }).catch((err) => console.error(err));
  }

  public static create(req, res): void {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    Bcrypt.genSalt(10, (err, salt) => {
      Bcrypt.hash(req.body.password, salt, (er, hash) => {
        if (er) {
          return res.status(500).json({
            message: 'Error when creating user',
            error: er
          });
        }

        // Store hash in your password DB.
        const new_user = new User({
          firstname : req.body.firstname,
          lastname : req.body.lastname,
          email : req.body.email,
          created : req.body.created,
          password : hash,
          active : true,
          verified : false
        });
        new_user.save((e, u) => {
          if (e) {
            return res.status(500).json({
              message: 'Error when creating user',
              error: e
            });
          }
          u.password = null;
          return res.status(201).json(u);
        });
      });
    });
  }

  public static update(req, res): void {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    User.findOne({_id: req.params.id}, (err, user) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when updating user',
          error: err
        });
      }
      if (!user) {
        return res.status(404).json({
          message: 'No such user'
        });
      }

      user.firstname = req.body.firstname ? req.body.firstname : user.firstname;
      user.lastname = req.body.lastname ? req.body.lastname : user.lastname;
      user.email = req.body.email ? req.body.email : user.email;
      user.created = req.body.created ? req.body.created : user.created;
      user.password = req.body.password ? req.body.password : user.password;
      user.active = req.body.active ? req.body.active : user.active;
      user.verified = req.body.verified ? req.body.verified : user.verified;
      user.save((e, u) => {
        if (e) {
          return res.status(500).json({
            message: 'Error when updating user.',
            error: e
          });
        }
        if (u.password != null) {
          u.password = null;
        }
        return res.json(u);
      });
    }).catch((err) => console.error(err));
  }

  public static remove(req, res): void {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    User.findByIdAndRemove(req.params.id, (err, user) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when removing user.',
          error: err
        });
      }
      return res.status(204).json();
    }).catch((err) => console.error(err));
  }
}
