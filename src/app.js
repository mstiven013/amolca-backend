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

//Middlewares
const auth = require('./components/auth/authMiddleware');
app.use(morgan('dev'));
//app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Origin, X-Auth-Token');

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
app.use(API_URL + '/posts', require('./components/posts/postsRoutes'));
app.use(API_URL + '/comments', require('./components/comments/commentsRoutes'));
app.use(API_URL + '/sliders', require('./components/sliders/slidersRoutes'));
app.use(API_URL + '/banners', require('./components/banners/bannersRoutes'));
app.use(API_URL + '/forms', require('./components/forms/formsRoutes'));

//Uploads routes
app.use(API_URL + '/uploads', require('./components/uploads/uploadsRoutes'));

//Static files
app.use(express.static(__dirname + '/public'));

mongoose.connect( config.db, config.dbOptions, (err, client) => {  
    if(err) {
        return console.log('DB connection error.');
    }
    console.log('Mongo DB is connected');

    app.listen(config.port, () => {
        console.log('Server on port:', config.port);
    });
})
