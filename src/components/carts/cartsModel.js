'use strict'

const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, { _id: false });

const CartSchema = new Schema({
    coupon: Object,
    expiryDate: {
        type: Date,
        default: moment().add(1, 'M').format("DD-MM-YYYY")
    },
    products: [ productSchema ],
    registerDate: {
        type: Date,
        default: moment().format("DD-MM-YYYY")
    },
    userId: String,
    total: Number
});

const Cart = mongoose.model('Cart', CartSchema)

module.exports = mongoose.model('Cart', CartSchema);