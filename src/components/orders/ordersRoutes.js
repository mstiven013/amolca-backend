'use strict'

const express = require('express');
const router = express.Router();

const Order = require('./OrdersModel');
const OrderCtrl = require('./ordersController');

const auth = require('../auth/authMiddleware');

//Route to get all Orders
router.get('/', OrderCtrl.getAllOrders);

//Route to get one Order by ID
router.get('/:id', OrderCtrl.getOrdersById);

//Route to create one Order
router.post('/', OrderCtrl.createOrders);

//Route to update one Order
router.put('/:id', auth.isAuth, OrderCtrl.updateOrders);

//Route to delete one Order
router.delete('/:id', auth.isAuth, OrderCtrl.deleteOrders);

module.exports = router;