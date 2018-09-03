'use strict'

const mongoose = require('mongoose');
const Post = require('./BlogsModel');
const All = require('./PostsModel');

//"User" Populate var
const populateUserId = { 
    path: 'userId', 
    select: '-__v -signupDate -products -posts -role'
};

//Controller function to get all posts
async function getAllPosts(req, res) {

    let limit = 100000;
    let sortKey = 'name';
    let sortOrder = 1;

    if(req.query.limit) {
        limit = parseInt(req.query.limit);
    }
    if(req.query.orderby) {
        sortKey = req.query.orderby;
    }
    if(req.query.order) {
        sortOrder = req.query.order;
    }

    let sort = {[sortKey]: sortOrder};

    Post.find()
        .populate(populateUserId)
        .limit(limit)
        .sort(sort)
        .exec( (err, posts) => {

            //If an error has ocurred in server
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

            //If not exists posts
            if(!posts) return res.status(404).send({ status: 404, message: 'Not exists posts in db' })

            return res.status(200).send(posts);

        })
}

//Controller function to get One Post by Id
async function getPostsById(req, res) {
    let postId = req.params.id;

    Post.findById(postId)
        .populate(populateUserId)
        .exec((err, post) => {
            //If post not exists
            if(!post) return res.status(404).send({status: 404, message: 'This resource not exists'});

            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            return res.status(200).send(post);

        });
}

//Controller function to get Posts by Category
async function getPostsByCategory(req, res) {

}

//Controller function to get Posts by state
async function getPostsByState(req, res) {
    let state = req.params.state.toUpperCase();
    let limit = 100000;
    let sortKey = 'name';
    let sortOrder = 1;

    if(req.query.limit) {
        limit = parseInt(req.query.limit);
    }
    if(req.query.orderby) {
        sortKey = req.query.orderby;
    }
    if(req.query.order) {
        sortOrder = req.query.order;
    }

    let sort = {[sortKey]: sortOrder};

    Post.find({"state" : state})
        .populate(populateUserId)
        .limit(limit)
        .sort(sort)
        .exec((err, posts) => {
            //If posts not exists
            if(!posts) return res.status(404).send({status: 404, message: 'Not exists posts with this inventory state'});

            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            return res.status(200).send(posts);
        });
}

//Controller function to get one Post by Slug
async function getPostsBySlug(req, res) {
    let postSlug = req.params.slug;

    Post.findOne({ slug: postSlug })
        .populate(populateUserId)
        .exec((err, post) => {
            //If post not exists
            if(!post) return res.status(404).send({status: 404, message: 'This resource not exists'});

            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            return res.status(200).send(post);
        });
}

//Controller function to create one post
async function createPost(req, res) {
    if(!req.body.userId || !req.body.title || !req.body.slug) {
        return res.status(400).send({status: 400, message: 'Bad request'})
    }

    let post = new Post(req.body);

    post.save((err, postStored) => {
        //If post already exists
        if(err && err.code == 11000) return res.status(409).send({status: 409, message: `This resource alredy exists: ${err}`});

        //If an error has ocurred
        if(err && err.code != 11000) return res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${err}`});

        //Populate and return post stored
        Post.populate(postStored, [populateUserId], (err, postStored) => {
            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${err}`});

            return res.status(201).send(postStored);
        })
    });
}

async function deletePost(req, res) {
    Post.findById(req.params.id, (err, post) => {
        //If post not exists
        if(!post) return res.status(404).send({status: 404, message: 'This resource not exists'})

        //If post exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        //Remove post
        post.remove((err) => {
            if(err) if(err) return res.status(500).send({status: 500, message: 'An error has ocurred removing this resource'});

            res.status(200).send({status: 200, message: 'Resource successfully removed'});
        });
    });  
}

async function updatePost(req, res) {
    let postId = req.params.id;
    let update = req.body;

    Post.findByIdAndUpdate(postId, update, {new: true})
        .populate(populateUserId)
        .exec((err, post) => {
            //If post not exists
            if(!post) return res.status(404).send({status: 404, message: 'This resource not exists'})

            //If post exists but an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

            res.status(200).send(post)
        });
}

module.exports = {
    getAllPosts,
    getPostsById,
    getPostsByCategory,
    getPostsByState,
    getPostsBySlug,
    createPost,
    deletePost,
    updatePost
}