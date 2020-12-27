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

import * as Cors from 'cors';
import * as bodyParser from 'body-parser';
import { ApiRouter }  from "./routes/api.router"
import express from "express";
import * as Mongoose from "mongoose";

class App {
  public express: express.Application;
  private port = 3000;
  private host = "0.0.0.0";

  constructor() {
    this.express = express();
    this.setupDb();
    this.configure_middleware();
    this.listen();
  }

  private configure_middleware(): void {
    this.express.use(Cors())
    this.express.use(bodyParser.urlencoded({extended: true}));
    this.express.use(bodyParser.json());
    this.express.use('/api/v1', route.router)
  }

  private listen(host = null, port = null): void {
    this.express.listen(
      port == null ? this.port : port,
      host == null ? this.host : host,
      () => {
        console.log( `server started at http://${ host }:${ port }` );
      }
    );
  }

  private setupDb(): void {
    Mongoose.connect('mongodb://mongo:27017/app', {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      bufferCommands: false,
    });
    var db = Mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB Connection error"));
    db.once('open', () => {
      console.log('Connection to `app` database successful.');
    });
  }
}
// const app = Express();

// const route = new ApiRouter()

// mongoose.connect('', {
//   useNewUrlParser: true,
//   useFindAndModify: false,
//   useUnifiedTopology: true,
//   bufferCommands: false,
// });

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', () => {
//   console.log('Connection to `app` database successful.');
// });


