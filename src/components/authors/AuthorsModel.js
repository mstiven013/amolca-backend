'use strict'

const moment = require('moment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const Specialty = mongoose.model();

const AuthorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    birthday: Date,
    image: {
        type: String,
        default: 'no-author-image.png'
    },
    registerDate: {
        type: Date,
        default: moment().format("DD-MM-YYYY")
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    website: String,
    specialty: [{
        type: String
    }]
})

const Author = mongoose.model('Author', AuthorSchema)

module.exports = mongoose.model('Author', AuthorSchema);