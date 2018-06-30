'use strict'

const express = require('express');
const router = express.Router();

const Shop = require('./ShopsModel');
const ShopCtrl = require('./shopsController');

//Get all shops
router.get('/', ShopCtrl.getAllShops);

//Get one shop
router.get('/:id', ShopCtrl.getOneShop);

//Create shop
router.post('/', ShopCtrl.createShop);

//Delete one shop
router.delete('/:id', ShopCtrl.deleteShop);

//Update shop
router.put('/:id', ShopCtrl.updateShop);

module.exports = router;