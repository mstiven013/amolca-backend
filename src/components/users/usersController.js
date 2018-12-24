'use strict'

const mongoose = require('mongoose');
const User = require('./UsersModel');
const TokenService = require('../auth/tokenService');
const Book = require('../books/BooksModel');
const Order = require('../orders/OrdersModel');
const Post = require('../posts/PostsModel');
const Cart = require('../carts/cartsModel');
//const TokenService = require('../auth/tokenService');

//Controller to get ALL users
async function getAllUsers(req, res) {
    //Controller function to get ALL users if not exists a query
    User.find().exec((err, users) => {
        //If an error has ocurred in server
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})
        
        return res.status(200).send(users);
    })
}

//Controller to get ONE user
async function getOneUser(req, res) {
    let userId = req.params.id;

    User.findById(userId, (err, user) => {
        //If user not exists
        if(!user) return res.status(404).send({status: 404, message: 'This resource not exists'});

        //If user exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: 'An error has ocurred in server'});

        //Send OK status and user
        res.status(200).send(user)
    });
}

//Controller function to get ONE Book by USER ID
async function getBooksByUser(req, res) {
    let id = req.params.id;

    Book.findOne({"userId" : id})
        .populate({ path: 'relatedProducts', select: '-__v -relatedProducts -specialty -publicationYear -userId -attributes -variations -volume -inventory.individualSale -inventory.allowReservations -inventory.isbn'})
        .populate({ path: 'userId', select: '-__v -signupDate -products -posts -role '})
        .populate({ path: 'author', select: '-__v -registerDate -specialty '})
        .exec((err, books) => {
            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            //If books not exists
            if(!books) return res.status(404).send({status: 404, message: 'Not exists books registered by this user'});

            return res.status(200).send(books);
        });
}

//Controller function to get ONE Book by USER ID
async function getOrdersByUser(req, res) {
    let id = req.params.id;

    Order.findOne({"userId" : id})
        .populate({ 
            path: 'cart.products.id', 
            select: '-__v -relatedProducts -specialty -publicationYear -userId -attributes -variations -volume -inventory.individualSale -inventory.allowReservations -inventory.isbn'
        })
        .populate({
            path: 'userId', 
            select: '-__v -signupDate -products -posts -role'
        })
        .exec((err, orders) => {
            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            //If orders not exists
            if(!orders) return res.status(404).send({status: 404, message: 'Not exists orders registered by this user'});

            return res.status(200).send(orders);
        });
}

//Controller function to get posts by User Id
async function getPostsByUser(req, res) {
    let id = req.params.id;

    Post.findOne({"userId" : id})
        .populate({
            path: 'userId', 
            select: '-__v -signupDate -products -posts -role'
        })
        .exec((err, posts) => {
            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            //If posts not exists
            if(!posts) return res.status(404).send({status: 404, message: 'Not exists posts registered by this user'});

            return res.status(200).send(posts);
        });
}

//Controller function to get carts by User Id
async function getCartsByUser(req, res) {
    let id = req.params.id;

    Cart.find({"userId": id})
        .populate({
            path: 'products.this', 
            select: '-__v -relateProducts -specialty -publicationYear -userId -attributes -variations -volume -inventory.individualSale -inventory.allowReservations -isbn -metaTitle -metaDescription -metaTags -author -relatedProducts -version -visibility -countries -description -index'
        })
        .populate({
            path: 'userId', 
            select: '-__v -signupDate -products -posts -role'
        })
        .exec((err, cart) => {
            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            //If cart not exists
            if(!cart) return res.status(404).send({status: 404, message: 'Not exists posts registered by this user'});
            
            return res.status(200).send(cart)
        })
}

//Controller to delete one user
async function deleteUser(req, res) {    
    let userId = req.params.id;

    User.findById(userId, (err, user) => {

        //If user not exists
        if(!user) return res.status(404).send({status: 404, message: 'This resource not exists'})

        //If user exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        //Remove user
        user.remove((err) => {
            if(err) if(err) return res.status(500).send({status: 500, message: 'An error has ocurred removing this resource'});

            res.status(200).send({status: 200, message: 'Resource successfully removed'});
        });
    });
}

//Controller to update an user
async function updateUser(req, res) {
    let userId = req.params.id;
    let update = req.body;

    User.findByIdAndUpdate(userId, update, {new: true} , (err, user) => {
        //If user not exists
        if(!user) return res.status(404).send({status: 404, message: 'This resource not exists'})

        //If user exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        res.status(200).send({user: user, access_token: TokenService.createToken(user)})
    });
}

module.exports = {
    getAllUsers,
    getOneUser,
    getPostsByUser,
    getBooksByUser,
    getOrdersByUser,
    getCartsByUser,
    deleteUser,
    updateUser
}