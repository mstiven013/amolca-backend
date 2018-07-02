'use strict'

//Requires
const config = require('./config');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

//Execute requires
const app = express();

//Settings
const API_URL = config.api + config.version;
app.set('port', process.env.PORT || 3000);

//Middlewares
const auth = require('./components/auth/authMiddleware');
app.use(morgan('dev'));
app.use(express.json());

// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Pass to next layer of middleware
    next();
});

//Routes
app.use(API_URL + '/users', auth.isAuth, require('./components/users/usersRoutes'));
app.use(API_URL + '/shops', require('./components/shops/shopsRoutes'));

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