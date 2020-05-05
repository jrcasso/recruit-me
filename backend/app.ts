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

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { apiRoute } from './routes/api.route.js';

const app = express();
const port = 3000;
const host = "0.0.0.0";

mongoose.connect('mongodb://mongo:27017/app', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  bufferCommands: false,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connection to `app` database successful.');
});

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api/v1', apiRoute)

app.listen( port, host, () => {
  console.log( `server started at http://${ host }:${ port }` );
});
