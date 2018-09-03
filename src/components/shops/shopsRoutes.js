'use strict'

const express = require('express');
const router = express.Router();

const Shop = require('./ShopsModel');
const ShopCtrl = require('./shopsController');

const auth = require('../auth/authMiddleware');

//Get all shops
router.get('/', ShopCtrl.getAllShops);

//Get one shop
router.get('/:id', ShopCtrl.getOneShop);

//Create shop
router.post('/', auth.isAuth, ShopCtrl.createShop);

//Delete one shop
router.delete('/:id', auth.isAuth, ShopCtrl.deleteShop);

//Update shop
router.put('/:id', auth.isAuth, ShopCtrl.updateShop);

module.exports = router;