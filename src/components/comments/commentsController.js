'use strict'

const mongoose = require('mongoose');
const Comment = require('./CommentsModel');

//Controller function to get all comments
async function getAllComments(req, res) {
    let limit = 100000;
    let sortKey = 'post';
    let sortOrder = 1;

    let sort = {[sortKey]: sortOrder};

    if(req.query.limit) {
        limit = parseInt(req.query.limit);
    }
    if(req.query.orderby) {
        sortKey = req.query.orderby;
    }
    if(req.query.order) {
        sortOrder = req.query.order;
    }

    Comment.find()
        .limit(limit)
        .sort(sort)
        .exec((err, comments) => {
            //If an error has ocurred in server
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

            //If not exists comments in db
            if(!comments) return res.status(404).send({status: 404, message: `Not exists comments in db`})

            return res.status(200).send(comments);
        })
}

//Controller function to get comments by ID
async function getCommentsById(req, res) {
    let commentId = req.params.id;

    Comment.findById(commentId)
        .exec((err, comment) => {
            //If comment not exists
            if(!comment) return res.status(404).send({status: 404, message: 'This resource not exists'});

            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            return res.status(200).send(comment);

        });
}

//Controller function to create one comment
async function createComments(req, res) {
    if(!req.body.post || !req.body.userName || !req.body.content || !req.body.userEmail) {
        return res.status(400).send({status: 400, message: 'Bad request'})
    }

    let comment = new Comment(req.body);

    comment.save((err, commentStored) => {
        //If comment already exists
        if(err && err.code == 11000) return res.status(409).send({status: 409, message: `This resource alredy exists: ${err}`});

        //If an error has ocurred
        if(err && err.code != 11000) return res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${err}`});

        //Populate and return comment stored
        Comment.populate(commentStored, [], (err, commentStored) => {
            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${err}`});

            return res.status(201).send(commentStored);
        })
    });
}

//Controller function to update one comment
async function updateComments(req, res) {
    let commentId = req.params.id;
    let update = req.body;

    Comment.findByIdAndUpdate(commentId, update, {new: true})
        .exec((err, comment) => {
            //If comment not exists
            if(!comment) return res.status(404).send({status: 404, message: 'This resource not exists'})

            //If comment exists but an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

            res.status(200).send(comment)
        });
}

//Controller function to delete one comment
async function deleteComments(req, res) {
    Comment.findById(req.params.id, (err, comment) => {
        //If comment not exists
        if(!comment) return res.status(404).send({status: 404, message: 'This resource not exists'})

        //If comment exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        //Remove comment
        comment.remove((err) => {
            if(err) if(err) return res.status(500).send({status: 500, message: 'An error has ocurred removing this resource'});

            res.status(200).send({status: 200, message: 'Resource successfully removed'});
        });
    });
}

module.exports = {
    getAllComments,
    getCommentsById,
    createComments,
    updateComments,
    deleteComments
}