'use strict'

const mongoose = require('mongoose');
const Shop = require('./ShopsModel');

//Controller to get ALL shops
async function getAllShops(req, res) {
    const shops = await Shop.find();
    res.send(shops);
}

//Controller to get ONE shop
async function getOneShop(req, res) {
Shop.findById(req.params.id, (err, shop) => {
        if(!shop) return res.status(404).send({status: 404, message: 'This resource not exists'})
        if(err) return res.status(500).send({status: 500, message: 'An error has ocurred in server'})

        res.status(200).send(shop)
    });
}

//Controler to create one shop
async function createShop(req, res) {
    if(!req.body.name || !req.body.contactName || !req.body.username || !req.body.email || !req.body.country || !req.body.address) return res.status(400).send({status: 400, message: 'Bad request'})

    let shop = new Shop(req.body);

    shop.save((err, shopStored) => {
        if(err) return console.log(err)

        res.status(201).send(shopStored);
    });
}

//Controller to delete one shop
async function deleteShop(req, res) {
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
}

//Controller to update one shop
async function updateShop(req, res) {
    let shopId = req.params.id;
    let update = req.body;

    Shop.findByIdAndUpdate(shopId, update, {new: true} , (err, shop) => {
        //If user not exists
        if(!shop) return res.status(404).send({status: 404, message: 'This resource not exists'})

        //If user exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        res.status(200).send(shop)
    });
}

module.exports = {
    getAllShops,
    getOneShop,
    createShop,
    deleteShop,
    updateShop
}