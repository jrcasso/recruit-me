const express = require( "express" );
const cors = require('cors')
const bodyParser = require('body-parser')

const mongoose = require( 'mongoose' );
const indexRoute = require('./routes/index.route.js');
const userRoute = require('./routes/user.route.js');
const motdRoute = require('./routes/motd.route.js');

var motdModel = require('./models/motd.model.js');

const app = express();
const port = 3000;
const ip = "0.0.0.0";

mongoose.connect('mongodb://mongo:27017/app', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  bufferCommands: false,
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connection to `app` database successful.');
});

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/motd', motdRoute)
app.use('/user', userRoute)
app.use('/', indexRoute)

app.listen( port, ip, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
