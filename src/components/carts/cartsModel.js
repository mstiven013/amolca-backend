'use strict'

const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    coupon: Object,
    expiryDate: {
        type: Date,
        default: moment().add(1, 'M').format("DD-MM-YYYY")
    },
    products:[{
        id: String,
        name: String,
        price: Number,
        quantity: Number
    }],
    registerDate: {
        type: Date,
        default: moment().format("DD-MM-YYYY")
    },
    userId: String,
    total: Number
});

const Cart = mongoose.model('Cart', CartSchema)

module.exports = mongoose.model('Cart', CartSchema);