'use strict'

const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    this: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
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
        default: moment().add(1, 'M')
    },
    products: [ productSchema ],
    registerDate: {
        type: Date,
        default: moment()
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    total: Number
}, {strict: false});

const Cart = mongoose.model('Cart', CartSchema)

module.exports = mongoose.model('Cart', CartSchema);