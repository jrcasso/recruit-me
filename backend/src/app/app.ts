// Copyright 2020 Justin Casso
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as Express from 'express';
import * as Cors from 'cors';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import { ApiRouter } from './routes/api.router';

class App {
  public app: Express.Application;
  public apiRouter: ApiRouter;

  constructor() {
    this.connect().then(() => {
      this.app = Express(); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
      this.apiRouter = new ApiRouter();
      this.configure_middleware();
      this.run();
    }).catch((err) => console.error(err));
  }

  private async connect(host= 'mongo', port= 27017, database= 'app'): Promise<void> {
    const endpoint = `mongodb://${host}:${port}/${database}`;
    console.log(`Connecting to ${endpoint}`);
    await mongoose.connect(`mongodb://${host}:${port}/${database}`, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      bufferCommands: false,
    });
    console.log(`Connected to ${endpoint}`);
  }

  private configure_middleware(): void {
    this.app.use(Cors()); // eslint-disable-line @typescript-eslint/no-unsafe-call
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json());
    this.app.use('/api/v1', this.apiRouter.router);
  }

  private run(host= '0.0.0.0', port= 3000): void {
    this.app.listen( port, host, () => {
      console.log( `server started at http://${ host }:${ port }` );
    });
  }
}

// tslint:disable-next-line:no-unused-expression
new App();
