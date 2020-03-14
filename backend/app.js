const express = require( "express" );
const cors = require('cors')

const mongoose = require( 'mongoose' );
const index = require('./routes/index.route.js');
const user = require('./routes/user.route.js');
const motd = require('./routes/motd.route.js');

var motdModel = require('./models/motd.model.js');

const app = express();
const port = 3000;
const ip = "0.0.0.0";

mongoose.connect('mongodb://mongo:27017/app', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connection to `app` database successful.');
});

app.use(cors())
app.use('/', index)
app.use('/user', user)
app.use('/motd', motd)

app.listen( port, ip, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
