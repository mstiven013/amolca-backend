'use strict'

const express = require('express');
const router = express.Router();

const Shop = require('../components/shops/ShopsModel');

//Get all shops
router.get('/', async (req, res) => {
    if(req.headers["content-type"] && req.headers["content-type"] !== 'application/json'){
        return res.status(500).send({
            status: 500,
            message: 'Server not supported the Content-Type header sended in this request'
        })
    }

    const shops = await Shop.find();
    res.send(shops);
});

//Get one shop
router.get('/:id', async (req, res) => {
    if(req.headers["content-type"] && req.headers["content-type"] !== 'application/json'){
        return res.status(500).send({
            status: 500,
            message: 'Server not supported the Content-Type header sended in this request'
        })
    }

    Shop.findById(req.params.id, (err, shop) => {
        if(!shop) return res.status(404).send({status: 404, message: 'This resource not exists'})
        if(err) return res.status(500).send({status: 500, message: 'An error has ocurred in server'})

        res.status(200).send(shop)
    });
});

//Set shop
router.post('/', (req, res) => {
    if(req.headers["content-type"] !== 'application/json') return res.status(500).send({status: 500, message: 'Server not supported the Content-Type header sended in this request'})

    if(!req.body.name || !req.body.contactName || !req.body.username || !req.body.email || !req.body.country || !req.body.address) return res.status(400).send({status: 400, message: 'Bad request'})

    let shop = new Shop(req.body);

    shop.save((err, shopStored) => {
        if(err) return console.log(err)

        res.status(201).send(shopStored);
    });
});

//Update shop
router.put('/:id', (req, res) => {
    if(req.headers["content-type"] !== 'application/json') return res.status(500).send({status: 500, message: 'Server not supported the Content-Type header sended in this request'})

    let shopId = req.params.id;
    let update = req.body;

    Shop.findByIdAndUpdate(shopId, update, {new: true} , (err, shop) => {
        //If user not exists
        if(!shop) return res.status(404).send({status: 404, message: 'This resource not exists'})

        //If user exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        res.status(200).send(shop)
    });
});

//Delete one shop
router.delete('/:id', async (req, res) => {
    if(req.headers["content-type"] !== 'application/json') return res.status(500).send({status: 500, message: 'Server not supported the Content-Type header sended in this request'})

    Shop.findById(req.params.id, (err, shop) => {
        //If shop not exists
        if(!shop) return res.status(404).send({status: 404, message: 'This resource not exists'})

        //If shop exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        //Remove shop
        shop.remove((err) => {
            if(err) if(err) return res.status(500).send({status: 500, message: 'An error has ocurred removing this resource'});

            res.status(200).send({status: 200, message: 'Resource successfully removed'});
        });
    });

});

module.exports = router;