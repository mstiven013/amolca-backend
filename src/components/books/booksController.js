'use strict'

const mongoose = require('mongoose');
const Book = require('./BooksModel');
const slugMiddleware = require('../services/slugMiddlewares');
const controller = {};

//"Related Products" Populate var
const populateRelatedProducts = { 
    path: 'relatedProducts', 
    select: '-__v -relatedProducts -specialty -publicationYear -userId -attributes -variations -volume -inventory.individualSale -inventory.allowReservations -isbn -metaTitle -metaDescription -metaTags -kind'
};

//"User" Populate var
const populateUserId = { 
    path: 'userId', 
    select: '-__v -signupDate -products -posts -role'
};

//"Author" Populate var
const populateAuthor = { 
    path: 'author', 
    select: '-__v -registerDate -specialty -metaTitle -metaDescription -metaTags'
};

//"Specialty" populate
const populateSpecialty = {
    path: 'specialty',
    select: '-__v -registerDate -metaTitle -metaDescription -metaTags -childs -parent -image -description -top'
}

//"Interest" populate
const populateInterest = {
    path: 'interest',
    select: '-__v -registerDate -metaTitle -metaDescription -metaTags -childs -parent -image -description -top'
}

//Controller function to get ALL Books
controller.getAllBooks = (req, res) => {
    let skip = 0;
    let limit = 1000;
    let sortKey = 'title';
    let sortOrder = 1;

    if(req.query.skip) {
        skip = parseInt(req.query.skip);
    }
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

    //Controller function to get ALL Books if not exists a query
    Book.find()
        .populate(populateRelatedProducts)
        .populate(populateUserId)
        .populate(populateAuthor)
        .populate(populateSpecialty)
        .populate(populateInterest)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .exec((err, books) => {
            //If an error has ocurred in server
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

            //If not exists books in db
            if(!books) return res.status(404).send({status: 404, message: `Not exists books in db`})

            let array = [];

            for (let i = 0; i < books.length; i++) {
                const element = books[i];

                if(element.state !== 'DRAFT') {
                    array.push(element);
                }
            }

            return res.status(200).send(array);
        })
}

controller.getBooksNavigation = (req, res) => {

    let sortKey = 'title';
    let sortOrder = -1;

    if(req.query.orderby) {
        sortKey = req.query.orderby;
    }
    if(req.query.order) {
        sortOrder = req.query.order;
    }

    let sort = {[sortKey]: sortOrder};

    //Controller function to get ALL Books if not exists a query
    Book.findById(req.params.id)
        .populate(populateRelatedProducts)
        .populate(populateUserId)
        .populate(populateAuthor)
        .populate(populateSpecialty)
        .populate(populateInterest)
        .exec((err, book) => {
            //If an error has ocurred in server
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

            //If not exists book in db
            if(!book) return res.status(404).send({status: 404, message: `Not exists book in db`})

            Book.find()
                .select('_id title')
                .sort(sort)
                .exec((err, list) => {

                    let books = {
                        selected: book,
                        prev: null,
                        next: null
                    }

                    for (let i = 0; i < list.length; i++) {
                        const element = list[i];

                        if(book.title === list[i].title ) {
                            let prev = i - 1;
                            let next = i + 1;
                            books.prev = list[prev];
                            books.next = list[next];
                        }

                    }

                    return res.status(200).send(books);
                })
        })
}

//Controller function to get one book by Id
controller.getBooksById = (req, res) => {
    let bookId = req.params.id;

    Book.findById(bookId)
        .populate(populateRelatedProducts)
        .populate(populateUserId)
        .populate(populateAuthor)
        .populate(populateSpecialty)
        .populate(populateInterest)
        .exec((err, book) => {
            //If book not exists
            if(!book) return res.status(404).send({status: 404, message: 'This resource not exists'});

            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            return res.status(200).send(book);

        });
}

//Controller function to get one book by Slug
controller.getBooksBySlug = (req, res) => {
    let bookSlug = req.params.slug;

    Book.findOne({ slug: bookSlug })
        .populate(populateRelatedProducts)
        .populate(populateUserId)
        .populate(populateAuthor)
        .populate(populateSpecialty)
        .populate(populateInterest)
        .exec((err, book) => {
            //If book not exists
            if(!book) return res.status(404).send({status: 404, message: 'This resource not exists'});

            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            if(book.state == 'DRAFT' || book.state == 'TRASH') {
                return res.status(404).send({status: 404, message: 'This resource not exists'});
            }

            return res.status(200).send(book);
        });
}

//Controller function to get one book by Isbn
controller.getBooksByIsbn = (req, res) => {
    let isbn = req.params.isbn;

    Book.findOne({"isbn" : isbn})
        .populate(populateRelatedProducts)
        .populate(populateUserId)
        .populate(populateAuthor)
        .populate(populateSpecialty)
        .populate(populateInterest)
        .exec((err, books) => {
            //If book not exists
            if(!books) return res.status(404).send({status: 404, message: 'This resource not exists'});

            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            let array = [];

            for (let i = 0; i < books.length; i++) {
                const element = books[i];

                if(element.state !== 'DRAFT' && element.state !== 'TRASH') {
                    array.push(element);
                }
            }

            return res.status(200).send(array);
        });
}

//Controller function to get Books by Publication year
controller.getBooksByPublication = (req, res) => {
    let year = req.params.year;

    let limit = 1000;
    let sortKey = 'title';
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

    Book.find({"publicationYear" : year})
        .populate(populateRelatedProducts)
        .populate(populateUserId)
        .populate(populateAuthor)
        .populate(populateSpecialty)
        .populate(populateInterest)
        .limit(limit)
        .sort(sort)
        .exec((err, books) => {
            //If book not exists
            if(!books) return res.status(404).send({status: 404, message: 'Not exists books publicated in this year'});

            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            let array = [];

            for (let i = 0; i < books.length; i++) {
                const element = books[i];

                if(element.state !== 'DRAFT' && element.state !== 'TRASH') {
                    array.push(element);
                }
            }

            return res.status(200).send(array);
        });
}

//Controller function to get Books by state
controller.getBooksByState = (req, res) => {
    let state = req.params.state.toUpperCase();
    let limit = 1000;
    let sortKey = 'title';
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

    Book.find({"inventory.state" : state})
        .populate(populateRelatedProducts)
        .populate(populateUserId)
        .populate(populateAuthor)
        .populate(populateSpecialty)
        .populate(populateInterest)
        .limit(limit)
        .sort(sort)
        .exec((err, books) => {
            //If book not exists
            if(!books) return res.status(404).send({status: 404, message: 'Not exists books with this inventory state'});

            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            let array = [];

            for (let i = 0; i < books.length; i++) {
                const element = books[i];

                if(element.state !== 'DRAFT' && element.state !== 'TRASH') {
                    array.push(element);
                }
            }

            return res.status(200).send(array);
        });
}

//Controller function to create one Book
controller.createBook = (req, res) => {
    if(!req.body.author || !req.body.title || !req.body.publicationYear || !req.body.userId) {
        return res.status(400).send({status: 400, message: 'Bad request'})
    }

    slugMiddleware.oneBook(req.body)
        .then((data) => {
            let book = new Book(data);

            book.save((err, bookStored) => {
                //If book already exists
                if(err && err.code == 11000) return res.status(409).send({status: 409, message: `This resource alredy exists: ${err}`});

                //If an error has ocurred
                if(err && err.code != 11000) return res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${err}`});

                //Populate and return book stored
                Book.populate(bookStored, [populateRelatedProducts, populateUserId, populateAuthor, populateSpecialty], (err, bookStored) => {
                    //If an error has ocurred
                    if(err) return res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${err}`});

                    return res.status(201).send(bookStored);
                })
            });
        })
        .catch((err) => {
            res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${err}`});
        })
}

controller.createManyBooks = (req, res) => {

    let books = req.body;

    slugMiddleware.manyBooks(books)
        .then((data) => {
            Book.insertMany( data, (err, stored) => {
                if(err && err.code == 11000) return res.status(409).send({status: 409, message: `This resource alredy exists: ${err}`});
        
                if(err && err.code != 11000) return res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${err}`});

                return res.status(201).send(stored);
            });
        })
        .catch((err) => {
            res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${err}`});
        })

}

controller.updateBook = (req, res) => {
    let bookId = req.params.id;
    let update = req.body;

    Book.findByIdAndUpdate(bookId, update, {new: true})
        .populate(populateRelatedProducts)
        .populate(populateUserId)
        .populate(populateAuthor)
        .populate(populateSpecialty)
        .populate(populateInterest)
        .exec((err, book) => {
            //If book not exists
            if(!book) return res.status(404).send({status: 404, message: 'This resource not exists'})

            //If book exists but an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

            res.status(200).send(book)
        });
}

//Controller function to delete one Book
controller.deleteBook = (req, res) => {
    Book.findById(req.params.id, (err, book) => {
        //If book not exists
        if(!book) return res.status(404).send({status: 404, message: 'This resource not exists'})

        //If book exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        //Remove book
        book.remove((err) => {
            if(err) if(err) return res.status(500).send({status: 500, message: 'An error has ocurred removing this resource'});

            res.status(200).send({status: 200, message: 'Resource successfully removed'});
        });
    });
}

module.exports = controller;