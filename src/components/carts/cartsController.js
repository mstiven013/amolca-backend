'use strict'

const mongoose = require('mongoose');
const Book = require('../books/BooksModel');
const Cart = require('./cartsModel');

//"Related Products" Populate var
const populateProducts = { 
    path: 'products.this', 
    select: '-__v -relateProducts -specialty -publicationYear -userId -attributes -variations -volume -inventory.individualSale -inventory.allowReservations -isbn -metaTitle -metaDescription -metaTags -author -relatedProducts -version -visibility -countries -description -index'
};

//"User" Populate var
const populateUserId = { 
    path: 'userId', 
    select: '-__v -signupDate -products -posts -role'
};

//Controller function to get Carts
async function getAllCarts(req, res) {

    Cart.find()
        .populate(populateProducts)
        .populate(populateUserId)
        .exec((err, carts) => {
            //If an error has ocurred in server
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            //If not exists carts
            if(!carts) return res.status(404).send({status: 404, message: 'Not exists carts in db'})

            return res.status(200).send(carts)
        })
}

//Controller function to get One cart by Id
async function getCartsById(req, res) {
    let id = req.params.id;

    Cart.findById(id)
        .populate(populateProducts)
        .populate(populateUserId)
        .exec((err, cart) => {
            //If an error has ocurred in server
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            //If not exists carts
            if(!cart) return res.status(404).send({status: 404, message: 'This resource not exists'})

            return res.status(200).send(cart)
        })
}

//Controller function to create ONE Cart
async function createCart(req, res) {

    //Generate total with prices and quantities of products in cart
    let totals = 0;
    for(let i = 0; i < req.body.products.length; i++ ) {
        totals += req.body.products[i].price * req.body.products[i].quantity;
    }
    req.body.total = totals;

    //Save Cart in db
    let cart = new Cart(req.body);
    cart.save((err, cartStored) => {
        if(err && err.code == 11000) return res.status(409).send({status: 409, message: `This resource alredy exists: ${err}`});

        if(err && err.code != 11000) return res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${err}`});

        Cart.populate(cartStored, [populateProducts, populateUserId], (err, cartStored) =>{
            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${err}`});

            return res.status(201).send(cartStored);
        });
    });

}

//Controller function to Update ONE cart
async function updateCart(req, res) {
    let cartId = req.params.id;

    //Generate total with prices and quantities of products in cart
    let totals = 0;
    for(let i = 0; i < req.body.products.length; i++ ) {
        totals += req.body.products[i].price * req.body.products[i].quantity;
    }
    req.body.total = totals;

    let update = req.body;

    Cart.findOneAndUpdate(cartId, update, {new: true})
        .populate(populateProducts)
        .populate(populateUserId)
        .exec((err, cart) => {
            //If cart not exists
            if(!cart) return res.status(404).send({status: 404, message: 'This resource not exists'});

            //If cart exists but an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            return res.status(200).send(cart);
        });
}

//Controller function to delete one Cart
async function deleteCart(req, res) {
    Cart.findById(req.params.id, (err, cart) => {
        //If cart not exists
        if(!cart) return res.status(404).send({status: 404, message: 'This resource not exists'})

        //If cart exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        //Remove cart
        cart.remove((err) => {
            if(err) if(err) return res.status(500).send({status: 500, message: 'An error has ocurred removing this resource'});

            res.status(200).send({status: 200, message: 'Resource successfully removed'});
        });
    });    
}

module.exports = {
    getAllCarts,
    getCartsById,
    createCart,
    updateCart,
    deleteCart
}