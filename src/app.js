'use strict'

//Requires
const appConfig = require('./config');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

//Execute requires
const app = express();

//Settings
const API_URL = appConfig.api + appConfig.version;
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(morgan('dev'));
app.use(express.json());

//Routes
app.use(API_URL + '/users', require('./routes/users'));
app.use(API_URL + '/shops', require('./routes/shops'));

//Static files
app.use(express.static(__dirname + '/public'));

//Run DB host and App
mongoose.connect('mongodb://localhost:27017/amolca-store', (err, res) => {  
    if(err) {
        return console.log('DB connection error.');
    }
    console.log('Mongo DB is connected');

    app.listen(app.get('port'), () => {
        console.log('Server on port:', app.get('port'));
    });
})