'use strict'

//Requires
const config = require('./config');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 

//Execute requires
const app = express();

//Settings
const API_URL = config.api + config.version;
app.set('port', process.env.PORT || 3000);

//Middlewares
const auth = require('./components/auth/authMiddleware');
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

    // Pass to next layer of middleware
    next();
});

//Routes
app.use(API_URL, require('./components/auth/authRoutes'));
app.use(API_URL + '/books', require('./components/books/booksRoutes'));
app.use(API_URL + '/specialties', require('./components/specialties/specialtiesRoutes'));
app.use(API_URL + '/coupons', require('./components/coupons/couponsRoutes'));
app.use(API_URL + '/users', require('./components/users/usersRoutes'));
app.use(API_URL + '/carts', require('./components/carts/cartsRoutes'));
app.use(API_URL + '/orders', require('./components/orders/ordersRoutes'));
app.use(API_URL + '/shops', require('./components/shops/shopsRoutes'));
app.use(API_URL + '/authors', require('./components/authors/authorsRoutes'));

//Static files
app.use(express.static(__dirname + '/public'));

//Run DB host and App
const dbPass = encodeURIComponent('AmolcaColombia%2018');
//const mdbUri = 'mongodb://localhost:27017/amolca-store';
const mdbUri = `mongodb+srv://amolca:${dbPass}@amolcaweb2018-pxfid.mongodb.net/test`;

mongoose.connect( mdbUri, { auth: { user: 'amolca', password: 'AmolcaColombia%2018' }}, (err, client) => {  
    if(err) {
        return console.log('DB connection error.');
    }
    console.log('Mongo DB is connected');

    app.listen(app.get('port'), () => {
        console.log('Server on port:', app.get('port'));
    });
})