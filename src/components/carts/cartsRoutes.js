'use strict'

const express = require('express');
const router = express.Router();

const CartCtrl = require('./cartsController');

const auth = require('../auth/authMiddleware');

//Get all carts
router.get('/', CartCtrl.getAllCarts);

//Get carts by Id
router.get('/:id', CartCtrl.getCartsById);

//Create cart
router.post('/', CartCtrl.createCart);

//Delete an cart
router.delete('/:id', CartCtrl.deleteCart);

//Update cart
router.put('/:id', CartCtrl.updateCart);

module.exports = router;