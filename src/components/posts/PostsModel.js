'use strict'

const moment = require('moment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const options = {discriminatorKey: 'kind'};

const PostSchema = new Schema({
    //Required's
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    //Optionals
    state: {
        type: String,
        default: "PUBLISHED",
        enum: ["PUBLISHED", "DRAFT", "TRASH"]
    },
    registerDate: {
        type: Date,
        default: moment()
    },
    thumbnail: String,
    excerpt: String,
    content: String,
    visibility: {
        type: String,
        default: "ALL",
        enum: ["ALL", "HOME", "SHOP", "SPECIALTY"]
    },

    //Meta tags
    metaTitle: String,
    metaDescription: String,
    metaTags: [{ type: String }]
}, options);

const Post = mongoose.model('Post', PostSchema)

module.exports = mongoose.model('Post', PostSchema);
//module.exports = Post.discriminator('BookPost', bookSchema);