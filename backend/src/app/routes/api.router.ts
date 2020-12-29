import * as Express from 'express';
import { MotdRouter } from './motd.router';
import { UserRouter } from './user.router';
/**
 * MotdController
 *
 * @description :: Server-side logic for managing motds.
 */
export class ApiRouter {
  public router: any;

  constructor() {
    const motdRouter = new MotdRouter();
    const userRouter = new UserRouter();
    this.router = Express.Router();
    this.router.use('/motd', motdRouter.router);
    this.router.use('/user', userRouter.router);
  }
}
