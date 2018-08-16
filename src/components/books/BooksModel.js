'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const countrySubSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    state: { type: String, default: "STOCK", enum: ["RESERVED", "SPENT", "STOCK"] },
    individualSale: { type: Boolean, default: false },
    allowReservations: { type: Boolean, default: false },
    reservationNote: { type: String }
}, { _id: false });

const imageSubSchema = new Schema({
    name: { type: String, default: "image-not-found.jpg" },
    principal: Boolean
}, { _id: false });

const BookSchema = new Schema({
    attributes: [{
        id: String,
        value: String
    }],
    author: [{
        type: Schema.Types.ObjectId, 
        ref: 'Author',
        required: true
    }],
    description: String,
    index: String,
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    image: [{ type: imageSubSchema  }],
    name: {
        type: String,
        required: true
    },
    countries: [{
        type: countrySubSchema,
        required: true
    }],
    publicationYear: {
        type: Number,
        required: true
    },
    relatedProducts: [{
        type: Schema.Types.ObjectId,
        ref: 'Book'
    }],
    slug: {
        type: String,
        required: true,
        unique: true
    },
    specialty: [{
        type: Schema.Types.ObjectId, 
        ref: 'Specialty'
    }],
    userId: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
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
                enum: ["RESERVED", "SPENT", "STOCK"],
                default: "STOCK"
            },
            individualSale: {
                type: Boolean,
                default: false
            }
        }
    }],
    version: [{
        type: String,
        default: "PAPER",
        enum: ["PAPER", "EBOOK", "VIDEO"]
    }],
    visibility: {
        type: String,
        default: "ALL",
        enum: ["ALL", "HOME", "SHOP", "SPECIALTY"]
    },
    volume: {
        type: Number,
        default: 1
    },
    //Meta tags
    metaTitle: String,
    metaDescription: String,
    metaTags: [{ type: String }]
});

const Book = mongoose.model('Book', BookSchema)

module.exports = mongoose.model('Book', BookSchema);