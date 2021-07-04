import { Router } from 'express';
import { AuthRouter } from './auth.router';
import { MotdRouter } from './motd.router';
import { UserRouter } from './user.router';
/**
 * MotdController
 *
 * @description :: Server-side logic for managing motds.
 */
export class ApiRouter {
  public router: Router;

  constructor() {
    const authRouter = new AuthRouter();
    const motdRouter = new MotdRouter();
    const userRouter = new UserRouter();
    this.router = Router();
    this.router.use('/auth', authRouter.router);
    this.router.use('/motd', motdRouter.router);
    this.router.use('/user', userRouter.router);
  }
}
