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
        default: 'https://amolca.webussines.com/uploads/authors/no-author-image.png'
    },
    registerDate: {
        type: Date,
        default: moment()
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    website: String,
    specialty: [{
        type: Schema.Types.ObjectId, ref: 'Specialty'
    }],
    metaTitle: String,
    metaDescription: String,
    metaTags: [{ type: String }]
})

AuthorSchema.index( 
    {
        name: 'text',
        description: 'text'
    }
)

const Author = mongoose.model('Author', AuthorSchema)

module.exports = mongoose.model('Author', AuthorSchema);