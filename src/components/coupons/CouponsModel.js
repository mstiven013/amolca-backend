'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const CouponSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    discount: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true,
        min: [3, 'Minlength is 3 characters'],
        max: [15, 'Maxlength is 15 characters'],
        unique: true
    },
    method: {
        enum: ["PERCENTAGE", "FIXED_VALUE"],
        type: String,
        required: true,
    },
    state: {
        type: Boolean,
        default: true
    },
    restrictions: { 
        country: String,
        expiresDate: {
            type: Date,
        },
        initDate: {
            type: Date,
            default: Date.now()
        },
        minPurchase: {
            type: Number,
            default: 0
        },
        type: {
            type: String,
            required: true,
            enum: ["CUMULATIVE", "NON_CUMULATIVE"],
        },
        registerDate: {
            type: Date,
            default: Date.now()
        },
        validResource: {
            type: String,
            required: true,
            enum: ["USER", "ALL_USERS", "ALL_USERS_EXCEPT", "PRODUCT", "ALL_PRODUCTS", "ALL_PRODUCTS_EXCEPT", "SPECIALTY", "SPECIALTY_EXCEPT"]
        },
        validFor: [{
            type: String
        }],
        invalidFor: [{
            type: String
        }]
    },
    limits: {
        articles: Number,
        use: Number,
        user: Number
    },
    userId: {
        type: String,
        required: true
    },
    usage: [{
        userId: String,
        use: {
            type: Number,
            default: 0
        }
    }]
});

const Coupon = mongoose.model('Coupon', CouponSchema)

module.exports = mongoose.model('Coupon', CouponSchema);