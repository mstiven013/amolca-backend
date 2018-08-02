'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookModel = new Schema({
    attributes: [{
        id: String,
        value: String
    }],
    author: [{
        type: String,
        required: true
    }],
    description: String,
    index: String,
    inventory: {
        quantity: { 
            type: Number,
            default: 0
        },
        isbn: {
            type: String
        },
        state: {
            type: String,
            default: "STOCK",
            enum: ["RESERVED", "SPENT", "STOCK"]
        },
        individualSale: {
            type: Boolean,
            default: false
        },
        allowReservations: {
            type: Boolean,
            default: false
        },
        reservationNote: {
            type: String
        }
    },
    image: [{
        name: {
            type: String,
            default: 'image-not-found.jpg'
        },
        principal: {
            type: Boolean
        }
    }],
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    publicationYear: {
        type: Number,
        required: true
    },
    relatedProducts: [{
        type: String
    }],
    slug: {
        type: String,
        required: true,
        unique: true
    },
    userId: String,
    variations: [{
        description: String,
        name: String,
        price: Number,
        image: String,
        inventory: {
            quantity: Number,
            isbn: String,
            state: {
                type: String,
                enum: ["RESERVED", "SPENT", "STOCK"]
            },
            individualSale: {
                type: Boolean,
                default: false
            }
        }
    }],
    version: [{
        type: String,
        enum: ["PAPER", "EBOOK", "VIDEO"],
        default: "PAPER"
    }],
    visibility: {
        type: String,
        default: "ALL",
        enum: ["ALL", "HOME", "SHOP", "SPECIALTY"]
    },
    volume: {
        type: Number,
        default: 1
    }
});