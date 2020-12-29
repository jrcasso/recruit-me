import { IMotd, Motd } from '../models/motd.model';
import { Types } from 'mongoose';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

/**
 * MotdController
 *
 * @description :: Server-side logic for managing motds.
 */
export class MotdController {
  constructor() { }

  public list(req: Request, res: Response): any {
    Motd.find((err: Error, motds: IMotd[]) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting motd.',
          error: err
        });
      }
      return res.json(motds);
    }).catch((err) => console.error(err));
  }

  public show(req: Request, res: Response): any {
    const id = req.params.id;
    if (Types.ObjectId.isValid(id)) {
      Motd.findOne({_id: id}, (err: Error, motd: IMotd) => {
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
      }).catch((err) => console.error(err));
    } else {
      return res.status(400).json({
        message: 'Bad Request: malformed ObjectId'
      });
    }
  }

  public create(req: Request, res: Response): any {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const motd = new Motd({
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

  public update(req: Request, res: Response): any {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const id = req.params.id;
    if (Types.ObjectId.isValid(id)) {
      Motd.findOne({_id: id}, (err: Error, motd: IMotd) => {
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

  public remove(req: Request, res: Response): any {
    const id = req.params.id;
    if (Types.ObjectId.isValid(id)) {
      Motd.findByIdAndRemove(id, (err: Error, motd: IMotd) => {
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
