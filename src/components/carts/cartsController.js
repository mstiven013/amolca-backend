'use strict'

const mongoose = require('mongoose');
const Book = require('../books/BooksModel');
const Cart = require('./cartsModel');

//Controller function to get Carts
async function getCart(req, res) {

    if(req.query.searchby) {
        
        //Controller function to get cart by ID
        if(req.query.searchby == 'id') {
            Cart.findById(req.query.id, (err, cart) => {
                //If an error has ocurred in server
                if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

                //If not exists carts
                if(!cart) return res.status(404).send({status: 404, message: 'This resource not exists'})

                return res.status(200).send(cart);
            })
        }

        //Controller function to get cart by USER ID
        if(req.query.searchby == 'user') {
            Cart.find({"userId": req.query.id}, (err, carts) => {
                //If an error has ocurred in server
                if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

                //If not exists carts
                if(!carts || carts.length < 1) return res.status(404).send({status: 404, message: 'This user not have carts in db'})

                return res.status(200).send({"carts": carts, "count": carts.length});
            })
        }

    } else {

        Cart.find()
            .exec((err, carts) => {
                //If an error has ocurred in server
                if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

                //If not exists carts
                if(!carts || carts.length < 1) return res.status(404).send({status: 404, message: 'Not exists carts in db'})

                return res.status(200).send(carts)
            })
    }

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

        return res.status(201).send(cartStored);
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

    Cart.findByIdAndUpdate(cartId, update, {new: true} , (err, cart) => {
        //If cart not exists
        if(!cart) return res.status(404).send({status: 404, message: 'This resource not exists'});

        //If cart exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

        res.status(200).send(cart)
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
    getCart,
    createCart,
    updateCart,
    deleteCart
}