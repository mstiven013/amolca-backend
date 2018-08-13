'use strict'

const mongoose = require('mongoose');
const moment = require('moment')
const Schema = mongoose.Schema;
//const SpecialtyModel = mongoose.model('Specialty', SpecialtySchema);

const SpecialtySchema = new Schema({
    //Required's
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    //Defaults
    registerDate: { type: Date, default: moment() },
    top: { type: Boolean, default: true },
    //Optionals
    description: String,
    image: String,
    parent: { type: Schema.Types.ObjectId, ref: 'Specialty' },
    childs: [{ type: Schema.Types.ObjectId, ref: 'Specialty' }],
    metaTitle: String,
    metaDescription: String,
    metaTags: [{ type: String }]
});

const Specialties = mongoose.model('Specialty', SpecialtySchema);

module.exports = mongoose.model('Specialty', SpecialtySchema);