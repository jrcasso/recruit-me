import * as Express from 'express';
// import { MotdRouter } from "./motd.router"
import { UserRouter } from "./user.router"
/**
 * MotdController
 *
 * @description :: Server-side logic for managing motds.
 */
export class ApiRouter {
  constructor() {
    // let motdRouter = new MotdRouter()
    let userRouter = new UserRouter()
    this.router = Express.Router();
    // this.router.use('/motd', motdRouter.router);
    this.router.use('/user', userRouter.router);
   }
   public router: any
}