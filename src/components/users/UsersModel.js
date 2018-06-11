'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lastname: String,
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    role: [{
        type: String,
        required: true,
        enum: ['SUPERADMIN', 'SELLER', 'AUTHOR', 'EDITOR', 'CLIENT']
    }],
    avatar: String,
    description: String,
    phone: Number,
    cellphone: Number,
    company: String,
    postal_code: Number,
    billing_address: String,
    shipping_address: String,
    birthday: Date,
    country: {
        type: String,
        required: true
    },
    state: String,
    store: String,
    products: Array,
    posts: Array
});

const User = mongoose.model('User', UserSchema)

module.exports = User;