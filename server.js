const express = require('express');
const dbConfig = require('./configs/db.config');
const serverConfig = require('./configs/server.config');
const mongoose = require('mongoose');
const app = express();

//For interconversion of JSON to JS and vice-versa
const bodyParser = require('body-parser');

//adding bodyparser external middleware for interconversion of JSON to JS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));



/**
 * connect to database
 */
mongoose.connect(dbConfig.DB_URL);
const db = mongoose.connection;

/**
 * in case any error ocurs with connecting to database
 */
db.on('error', () => {
    console.log('Error while connecting to DB');
})

/**
 * once database is connected
 */
db.once('open', () => {
    console.log('Connected to the database');
})

/**
 * plugging the route
 * => we are providing the path to the route file to the server 
 */
require('./routes/auth.routes')(app);

/**
 * server started
 */
app.listen(serverConfig.PORT, () => {
    console.log('Server started on PORT : ',serverConfig.PORT);
})