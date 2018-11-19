'use strict'

const mongoose = require('mongoose');
const moment = require('moment')
const Schema = mongoose.Schema;

const itemSubSchema = new Schema({
    image: { type: String, required: true },
    bgAttach: { type: String, default: "initial" },
    state: { type: Boolean, default: true },
    text: { type: String },
    linkSlide: { type: String }
}, { _id: false });

const SliderSchema = new Schema({
    title: { 
        type: String, required: true 
    },
    slug: {
        type: String, required: true, unique: true
    },
    state: {
        type: String,
        default: ["PUBLISHED"],
        enum: ["PUBLISHED", "DRAFT", "TRASH"]
    },
    items: [{ type: itemSubSchema }],
    registerDate: { 
        type: Date, default: moment() 
    }
});

const Slider = mongoose.model('Slider', SliderSchema)

module.exports = mongoose.model('Slider', SliderSchema);