'use strict'

const moment = require('moment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Shipping sub-Schema
const ShipBillSchema = new Schema({
    name: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: Number, required: true },
    aditional: { type: String }
}, { _id: false });

//Payment information sub-Schema
const paymentSchema = new Schema({
    authorization: String,
    franchise: String,
    reason: String,
    receipt: String,
    reference: String,
    response: String
}, { _id: false });

const OrderSchema = new Schema({
    state: {
        type: String,
        enum: ['OUTSTANDING', 'QUEUED_PAYMENT', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'FAILED', 'REFUNDED'],
        default: "OUTSTANDING",
    },
    shipping: { type: ShipBillSchema, required: true },
    billing: { type: ShipBillSchema, required: true },
    payment: paymentSchema,
    cart: [{
        type: Schema.Types.ObjectId,
        ref: 'Cart',
        unique: true,
        required: true
    }],
    registerDate: {
        type: Date,
        default: moment()
    },
    userId: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    notes: String,
    total: Number
});

const Order = mongoose.model('Order', OrderSchema)

module.exports = mongoose.model('Order', OrderSchema);