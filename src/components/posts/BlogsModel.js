'use strict'

const moment = require('moment');
const mongoose = require('mongoose');
const Post = require('./PostsModel');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    content: String,
    headerImg: String,
    sidebar: [String]
});

module.exports = Post.discriminator('Blog', blogSchema);
