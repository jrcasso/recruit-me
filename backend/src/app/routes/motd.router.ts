import { MotdController } from '../controllers/motd.controller';
import * as Express from 'express';
const { check } = require('express-validator');

export class MotdRouter {
  constructor() {
    this.motdController = new MotdController()
    this.router = Express.Router();
    this.router.get('/', this.motdController.list);
    this.router.get('/:id', this.motdController.show);
    this.router.post('/', [
        check('message', 'Message cannot be empty').not().isEmpty(),
        check('message', 'Message cannot exceed 80 characters').isLength({ max: 80 }),
      ],
      this.motdController.create
    );
    this.router.put('/:id', [
        check('message', 'Message cannot exceed 80 characters').isLength({ max: 80 }),
      ],
      this.motdController.update
    );
    this.router.delete('/:id', this.motdController.remove);
  }

  public router: any;
  public motdController: MotdController;
}
