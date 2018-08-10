'use strict'

const mongoose = require('mongoose');
const Author = require('./AuthorsModel');

async function getAuthors(req, res) {
     //Controller function to get ALL authors if not exists a query
     Author.find().exec((err, authors) => {
        //If an error has ocurred in server
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        //If not exists authors in db
        if(!authors || authors.length < 1) return res.status(404).send({status: 404, message: `Not exists authors in db`})

        return res.status(200).send({"authors": authors, "count": authors.length});
    })
}

//Controller function to create an author
async function createAuthor(req, res) {
    if(!req.body.name || !req.body.slug) {
        return res.status(400).send({status: 400, message: 'Bad request'})
    }

    let author = new Author(req.body);

    author.save((err, authorStored) => {
        if(err && err.code == 11000) return res.status(409).send({status: 409, message: `This resource alredy exists: ${err}`});

        if(err && err.code != 11000) return res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${err}`});

        return res.status(201).send(authorStored);
    });
}

//Controller function to delete ONE author
async function deleteAuthor(req, res) {
    Author.findById(req.params.id, (err, author) => {
        //If author not exists
        if(!author) return res.status(404).send({status: 404, message: 'This resource not exists'})

        //If author exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        //Remove author
        author.remove((err) => {
            if(err) if(err) return res.status(500).send({status: 500, message: 'An error has ocurred removing this resource'});

            res.status(200).send({status: 200, message: 'Resource successfully removed'});
        });
    });  
}

//Controller function to update ONE author
async function updateAuthor(req, res) {
    let authorId = req.params.id;
    let update = req.body;

    Author.findByIdAndUpdate(authorId, update, {new: true} , (err, author) => {
        //If author not exists
        if(!author) return res.status(404).send({status: 404, message: 'This resource not exists'})

        //If author exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        res.status(200).send(author)
    });
}

module.exports = {
    getAuthors,
    createAuthor,
    deleteAuthor,
    updateAuthor    
}