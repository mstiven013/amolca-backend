'use strict'

const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const BannerSchema = new Schema({
    'title': { 
        type: String,
        required: true,
        unique: true
    },
    'image': {
        type: String,
        required: true
    },
    'publicatedOn': [{
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'onSrc'
    }],
    'onSrc': [{
        type: String,
        required: true,
        enum: ['Post', 'Book', 'Specialty', 'Author']
    }],
    'userId': [{
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }],
    'bgSize': {
        type: String,
        default: "cover"
    },
    'bgPosition': {
        type: String,
        default: "center"
    },
    'bgAttachment': {
        type: String,
        default: "initial"
    },
    'content': {
        type: String
    },
    'link': {
        type: String
    },
    'registerDate': {
        type: Date,
        default: moment()
    }
});

const Banner = mongoose.model('Banner', BannerSchema)

module.exports = mongoose.model('Banner', BannerSchema);