const express = require('express');
const dbConfig = require('./configs/db.config');
const serverConfig = require('./configs/server.config');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user.model');


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
    //add one admin user
    //init()
})

async function init(){

    //to drop the collection
    await User.collection.drop();

    //create returns promise, so async-await
    const adminUser = await User.create({
        name : "Durgesh",
        userId : "admin",
        password : bcrypt.hashSync('welcome1', 8),
        email : 'durgesh@gmail.com',
        userType : "ADMIN"
    })
    console.log('ADMIN:\n',adminUser);
}
/**
 * plugging the route
 * => we are providing the path to the route file to the server 
 */
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
/**
 * server started
 */
app.listen(serverConfig.PORT, () => {
    console.log('Server started on PORT : ',serverConfig.PORT);
})