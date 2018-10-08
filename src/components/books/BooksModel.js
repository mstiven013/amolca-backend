'use strict'

const mongoose = require('mongoose');
const Post = require('../posts/PostsModel');
const Schema = mongoose.Schema;

//Country subschema
const countrySubSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    state: { type: String, default: "STOCK", enum: ["RESERVED", "SPENT", "STOCK"] },
    individualSale: { type: Boolean, default: false },
    allowReservations: { type: Boolean, default: false },
    reservationNote: { type: String }
}, { _id: false });

const attributesSubSchema = new Schema({
    name: String,
    value: String
}, { _id: false });

//Product schema
const bookSchema = new Schema({
    author: [{
        type: Schema.Types.ObjectId, 
        ref: 'Author',
        required: true
    }],
    index: String,
    interest: [{
        type: Schema.Types.ObjectId, 
        ref: 'Specialty'
    }],
    keyPoints: String,
    isbn: {
        type: String,
        required: true
    },
    specialty: [{
        type: Schema.Types.ObjectId, 
        ref: 'Specialty'
    }],
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
        ref: 'Post'
    }],
    version: [{
        type: String,
        default: "PAPER",
        enum: ["PAPER", "EBOOK", "VIDEO"]
    }],
    attributes: [
        attributesSubSchema
    ],
    numberPages: Number,
    image: String,
    volume: {
        type: Number,
        default: 1
    }
});

//module.exports = mongoose.model('Book', BookSchema);
module.exports = Post.discriminator('Book', bookSchema);