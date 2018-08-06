'use strict'

const express = require('express');
const router = express.Router();

const CartCtrl = require('./cartsController');

const auth = require('../auth/authMiddleware');

//Get carts
router.get('/', CartCtrl.getCart);

//Create cart
router.post('/', CartCtrl.createCart);


//Delete an cart
router.delete('/:id', CartCtrl.deleteCart);

//Update cart
router.put('/:id', CartCtrl.updateCart);

module.exports = router;