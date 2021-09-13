import { MotdController } from '../controllers/motd.controller';
import { Router } from 'express';
import { check } from 'express-validator';

export class MotdRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.router.get('/', (req, res) => MotdController.list(req, res));
    this.router.get('/:id', (req, res) => MotdController.show(req, res));
    this.router.post('/', [
      check('message', 'Message cannot be empty').not().isEmpty(),
      check('message', 'Message cannot exceed 80 characters').isLength({ max: 80 }),
    ],
    (req, res) => MotdController.create(req, res)
    );
    this.router.put('/:id', [
      check('message', 'Message cannot exceed 80 characters').isLength({ max: 80 }),
    ],
    (req, res) => MotdController.update(req, res)
    );
    this.router.delete('/:id', (req, res) => MotdController.remove(req, res));
  }

}
