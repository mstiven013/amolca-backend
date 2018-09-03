'use strict'

const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    //required's
    post: {
        type: Schema.Types.ObjectId,
        href: 'Post',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    }
});

//const Comment = mongoose.model('Comment', CommentSchema);
module.exports = mongoose.model('Comment', CommentSchema);