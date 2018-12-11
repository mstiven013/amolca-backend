'use strict'

const moment = require('moment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FormSchema = new Schema({
    //Required's
    to: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    items: {
        type: Schema.Types.Mixed,
        default: true
    },
    cc: String,
    registerDate: {
        type: Date,
        default: moment()
    }
});

const Form = mongoose.model('Form', FormSchema)

module.exports = mongoose.model('Form', FormSchema);