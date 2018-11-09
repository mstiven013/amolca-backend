'use strict'

const mongoose = require('mongoose');
const Order = require('./OrdersModel');
const email = require('../emails/emailsOrders');

//"Related Products" Populate var
const populateProducts = { 
    path: 'products.this', 
    select: '-_id -registerDate -__v -relateProducts -specialty -publicationYear -userId -attributes -variations -volume -inventory.individualSale -inventory.allowReservations -isbn -metaTitle -metaDescription -metaTags -author -relatedProducts -version -visibility -countries -description -index -interest -state -kind -keyPoints -numberPages -slug -image'
};

//"User" Populate var
const populateUserId = { 
    path: 'userId', 
    select: '-__v -signupDate -products -posts -role'
};

//"Cart" Populate var
const populateCart = {
    path: 'cart',
    select: '-__v',
    populate: [ populateProducts ]
}

async function getAllOrders(req, res) {
    //Controller function to get ALL orders if not exists a query
    Order.find()
        .populate(populateProducts)
        .populate(populateUserId)
        .populate(populateCart)
        .exec((err, orders) => {
            //If an error has ocurred in server
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

            //If not exists orders
            if(!orders || orders.length < 1) return res.status(404).send({ status: 404, message: 'Not exists orders in db' })

            return res.status(200).send(orders);
        })
}

async function getOrdersById(req, res) {
    let orderId = req.params.id;

    Order.findById(orderId)
        .populate(populateProducts)
        .populate(populateUserId)
        .populate(populateCart)
        .exec((err, order) => {
            //If order not exists
            if(!order) return res.status(404).send({status: 404, message: 'This resource not exists'});

            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            return res.status(200).send(order);

        });
}

async function createOrders(req, res) {

    //If not exists required fields
    if(!req.body.userId || !req.body.cart || !req.body.shipping || !req.body.billing ) return res.status(400).send({status: 400, message: 'Bad request'})

    let order = new Order(req.body);

    //Save order
    order.save((err, orderStored) => {
        //If order already exists
        if(err && err.code == 11000) return res.status(409).send({status: 409, message: `This resource alredy exists: ${err}`});

        //If an error has ocurred
        if(err && err.code != 11000) return res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${err}`});

        //Populate and return order stored
        Order.populate(orderStored, [populateProducts, populateUserId, populateCart], (err, orderStored) => {
            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${err}`});

            email.createOrder(orderStored)
                .then((resp) => {
                    return res.status(201).send(orderStored);
                })
                .catch((e) => {
                    return res.status(500).send({status: 500, message: `This resource is saved but an error has ocurred sending the order email: ${err}`});
                })
        })
    });
}

async function updateOrders(req, res) {
    let orderId = req.params.id;
    let update = req.body;

    Order.findByIdAndUpdate(orderId, update, {new: true} , (err, order) => {
        //If order not exists
        if(!order) return res.status(404).send({status: 404, message: 'This resource not exists'})

        //If order exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        //Populate and return order stored
        Order.populate(order, [populateProducts, populateUserId, populateCart], (err, order) => {
            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${err}`});

            return res.status(200).send(order);
        })

    });
}

async function deleteOrders(req, res) {
    Order.findById(req.params.id, (err, order) => {
        //If order not exists
        if(!order) return res.status(404).send({status: 404, message: 'This resource not exists'})

        //If order exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        //Remove order
        order.remove((err) => {
            if(err) if(err) return res.status(500).send({status: 500, message: 'An error has ocurred removing this resource'});

            res.status(200).send({status: 200, message: 'Resource successfully removed'});
        });
    });    
}


module.exports = {
    getAllOrders,
    getOrdersById,
    createOrders,
    updateOrders,
    deleteOrders
}