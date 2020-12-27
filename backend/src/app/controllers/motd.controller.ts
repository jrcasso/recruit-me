import { MotdModel } from '../models/motd.model';
import * as Mongoose from 'mongoose';
import * as ExpressValidator from 'express-validator';
/**
 * MotdController
 *
 * @description :: Server-side logic for managing motds.
 */
export class MotdController {
  constructor() {
    this.model = new MotdModel()
  }

  public model: any;

  public list(req, res): any {
    this.model.find((err, motds) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting motd.',
          error: err
        });
      }
      return res.json(motds);
    });
  }

  public show(req, res): any {
    const id = req.params.id;
    if (Mongoose.Types.ObjectId.isValid(id)) {
      this.model.findOne({_id: id}, (err, motd) => {
        if (err) {
          return res.status(500).json({
            message: 'Error when getting motd.',
            error: err
          });
        }
        if (!motd) {
          return res.status(404).json({
            message: 'No such motd'
          });
        }
        return res.json(motd);
      });
    } else {
      return res.status(400).json({
        message: 'Bad Request: malformed ObjectId'
      });
    }
  }

  public create(req, res): any {
    const errors = ExpressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const motd = new this.model.schema({
      message : req.body.message,
      foreground : req.body.foreground,
      background : req.body.background,
      timestamp : req.body.timestamp

    });

    motd.save((err, _motd) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when creating motd',
          error: err
        });
      }
      return res.status(201).json(motd);
    });
  }

  public update(req, res): any {
    const errors = ExpressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const id = req.params.id;
    if (Mongoose.Types.ObjectId.isValid(id)) {
      this.model.findOne({_id: id}, (err, motd) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Error when getting motd',
            error: err
          });
        }
        if (!motd) {
          return res.status(404).json({
            message: 'No such motd'
          });
        }

        motd.message = req.body.message ? req.body.message : motd.message;
        motd.foreground = req.body.foreground ? req.body.foreground : motd.foreground;
        motd.background = req.body.background ? req.body.background : motd.background;
        motd.timestamp = req.body.timestamp ? req.body.timestamp : motd.timestamp;

        motd.save((_err, _motd) => {
          if (_err) {
            return res.status(500).json({
              message: 'Error when updating motd.',
              error: _err
            });
          }

          return res.json(motd);
        });
      });
    } else {
      return res.status(400).json({
        message: 'Bad Request: malformed ObjectId'
      });
    }
  }

  public remove(req, res): any {
    const id = req.params.id;
    if (Mongoose.Types.ObjectId.isValid(id)) {
      this.model.findByIdAndRemove(id, (err, motd) => {
        if (err) {
          return res.status(500).json({
            message: 'Error when deleting the motd.',
            error: err
          });
        }
        return res.status(204).json();
      });
    } else {
      return res.status(400).json({
        message: 'Bad Request: malformed ObjectId'
      });
    }
  }
}
