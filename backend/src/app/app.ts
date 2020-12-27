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
import { ApiRouter }  from "./routes/api.router"

class App {
  app: any;
  api_router: any;
  constructor() {
//     this.setupDb();
//     this.configure_middleware();
//     this.listen();
    this.initialize_database_connection().then(() => {
      this.app = Express();
      this.api_router = new ApiRouter()
      this.configure_middleware();
      this.run();
    })
  }

  private async initialize_database_connection(host="mongo", port=27017, database="app"): Promise<void> {
    let endpoint = `mongodb://${host}:${port}/${database}`;
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
    this.app.use(Cors())
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json());
    this.app.use('/api/v1', this.api_router.router)
  }

  private run(host="0.0.0.0", port=3000): void {
    this.app.listen( port, host, () => {
      console.log( `server started at http://${ host }:${ port }` );
    });
  }
}

new App()
// class App {
//   public express: express.Application;
//   private port = 3000;
//   private host = "0.0.0.0";

//   constructor() {
//     this.express = express();
//     this.setupDb();
//     this.configure_middleware();
//     this.listen();
//   }

//   private configure_middleware(): void {
//     this.express.use(Cors())
//     this.express.use(bodyParser.urlencoded({extended: true}));
//     this.express.use(bodyParser.json());
//     this.express.use('/api/v1', route.router)
//   }

//   private listen(host = null, port = null): void {
//     this.express.listen(
//       port == null ? this.port : port,
//       host == null ? this.host : host,
//       () => {
//         console.log( `server started at http://${ host }:${ port }` );
//       }
//     );
//   }

//   private setupDb(): void {
//     Mongoose.connect('mongodb://mongo:27017/app', {
//       useNewUrlParser: true,
//       useFindAndModify: false,
//       useUnifiedTopology: true,
//       bufferCommands: false,
//     });
//     var db = Mongoose.connection;
//     db.on("error", console.error.bind(console, "MongoDB Connection error"));
//     db.once('open', () => {
//       console.log('Connection to `app` database successful.');
//     });
//   }
// }
