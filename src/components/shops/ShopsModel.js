'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShopSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    contactName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
    },
    avatar: String,
    description: String,
    phone: Number,
    cellphone: Number,
    postalCode: Number,
    country: {
        type: String,
        required: true
    },
    state: String,
    address: {
        type: String,
        required: true
    },
    extraAddress: String,
    website: String,
    products: Array,
});

const Shop = mongoose.model('Shop', ShopSchema)

module.exports = Shop;