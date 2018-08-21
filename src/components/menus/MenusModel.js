'use strict'

const moment = require('moment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Items sub-Schema
const ItemsSchema = new Schema({
    title: { type: String, required: true },
    image: { type: String },
    link: { type: String, required: true },
    state: { type: Boolean, default: true, required: true },
    target: { type: String, required: true },
    submenu: { type: Object }
}, { _id: false });

const MenuSchema = new Schema({
    //Required's
    name: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        type: ItemsSchema,
        required: true
    }],
    //Optionals
    state: {
        type: Boolean,
        default: true
    },
    registerDate: {
        type: Date,
        default: moment()
    }
});