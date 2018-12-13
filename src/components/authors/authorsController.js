'use strict'

const mongoose = require('mongoose');
const Author = require('./AuthorsModel');
const Specialty = require('../specialties/SpecialtiesModel');
const Book = require('../books/BooksModel');
const slugMiddleware = require('../services/slugMiddlewares');
const controller = {};

//"Specialty" populate
const populateSpecialty = {
    path: 'specialty',
    select: '-__v -registerDate -metaTitle -metaDescription -metaTags -childs -parent -image -description -top'
}

controller.getAuthors = async function(req, res) {

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

    //Controller function to get ALL authors if not exists a query
    Author.find()
        .populate(populateSpecialty)
        .limit(limit)
        .sort(sort)
        .exec((err, authors) => {
            //If an error has ocurred in server
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

            //Populate for get specialties without optional data
            Specialty.populate(authors, {path: 'specialty', select: '-registerDate -__v -description -top -parent -childs -metaTags -metaTitle -metaDescription'}, (err, authors) => {
                //If an error has ocurred in server
                if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

                //If not exists authors in db
                if(!authors || authors.length < 1) return res.status(404).send({status: 404, message: `Not exists authors in db`})

                return res.status(200).send(authors);
            });
        })
}

controller.getAuthorsById = async function(req, res) {
    let authorId = req.params.id;

    Author.findById(authorId)
        .populate(populateSpecialty)
        .exec((err, author) => {

            //If author not exists
            if(!author) return res.status(404).send({status: 404, message: 'This resource not exists'});

            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            return res.status(200).send(author);

        });
}

//Controller function to get one book by Slug
controller.getAuthorsBySlug = async function(req, res) {
    let authorSlug = req.params.slug;

    Author.findOne({ slug: authorSlug })
        .populate(populateSpecialty)
        .exec((err, author) => {
            //If author not exists
            if(!author) return res.status(404).send({status: 404, message: 'This resource not exists'});

            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            return res.status(200).send(author);
        });
}

//Controller function to get books by author
controller.getBooksByAuthor = async function(req, res) {

    let limit = 100000;
    let sortKey = 'name';
    let sortOrder = 1;

    if(req.query.limit) {
        if(isNaN(req.query.limit)) {
            limit = parseInt(req.query.limit);
        } else {
            limit = req.query.limit;
        }
    }
    if(req.query.orderby) {
        sortKey = req.query.orderby;
    }
    if(req.query.order) {
        sortOrder = req.query.order;
    }

    let sort = {[sortKey]: sortOrder};
    let authorId = req.params.id;

    Book.find({author: authorId})
        .populate({ path: 'relatedProducts', select: '-__v -relatedProducts -specialty -publicationYear -userId -attributes -variations -volume -inventory.individualSale -inventory.allowReservations -inventory.isbn'})
        .populate({ path: 'userId', select: '-__v -signupDate -products -posts -role '})
        .populate({ path: 'author', select: '-__v -registerDate -specialty '})
        .limit(limit)
        .sort(sort)
        .exec((err, books) => {
            //If book not exists
            if(!books || books.length < 1) return res.status(404).send({status: 404, message: 'This author not have books registered'});

            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            return res.status(200).send(books);
        });
}

//Controller function to create an author
controller.createAuthor = async function(req, res) {
    if(!req.body.name) {
        return res.status(400).send({status: 400, message: 'Bad request'})
    }

    slugMiddleware.oneAuthor(req.body)
        .then((data) => {
            let author = new Author(data);

            author.save((err, authorStored) => {
                if(err && err.code == 11000) return res.status(409).send({status: 409, message: `This resource alredy exists: ${err}`});
        
                if(err && err.code != 11000) return res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${err}`});
        
                //Populate for get specialties without optional data
                Specialty.populate(authorStored, {path: 'specialty', select: '-registerDate -__v -description -top -parent -childs -metaTags -metaTitle -metaDescription'}, (err, authorStored) => {
                    //If an error has ocurred in server
                    if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})
        
                    //If not exists authorStored in db
                    if(!authorStored) return res.status(404).send({status: 404, message: `Not exists author in db`})
        
                    return res.status(201).send(authorStored);
                });
            });
        })
        .catch((err) => {
            res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${err}`});
        })
}

//Controller function to create an author
controller.createManyAuthors = async function(req, res) {

    let authors = req.body;

    slugMiddleware.manyAuthors(authors)
        .then((data) => {
            Author.insertMany( data, (err, authorStored) => {
                if(err && err.code == 11000) return res.status(409).send({status: 409, message: `This resource alredy exists: ${err}`});

                if(err && err.code != 11000) return res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${err}`});

                //Populate for get specialties without optional data
                Specialty.populate(authorStored, {path: 'specialty', select: '-registerDate -__v -description -top -parent -childs -metaTags -metaTitle -metaDescription'}, (err, authorStored) => {
                    //If an error has ocurred in server
                    if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

                    //If not exists authorStored in db
                    if(!authorStored) return res.status(404).send({status: 404, message: `Not exists author in db`})

                    return res.status(201).send(authorStored);
                });
            });
        })
        .catch((err) => {
            res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${err}`});
        })
}

//Controller function to delete ONE author
controller.deleteAuthor = async function(req, res) {
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
controller.updateAuthor = async function(req, res) {
    let authorId = req.params.id;
    let update = req.body;

    Author.findByIdAndUpdate(authorId, update, {new: true} , (err, author) => {
        //If author not exists
        if(!author) return res.status(404).send({status: 404, message: 'This resource not exists'})

        //If author exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        //Populate for get specialties without optional data
        Specialty.populate(author, {path: 'specialty', select: '-registerDate -__v -description -top -parent -childs -metaTags -metaTitle -metaDescription'}, (err, author) => {
            //If an error has ocurred in server
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

            //If not exists author in db
            if(!author) return res.status(404).send({status: 404, message: `Not exists author in db`})

            res.status(200).send(author)
        });
    });
}

module.exports = controller;