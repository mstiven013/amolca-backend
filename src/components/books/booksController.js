'use strict'

const mongoose = require('mongoose');
const Book = require('./BooksModel');

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

const populateSpecialty = {
    path: 'specialty',
    select: '-__v -registerDate -metaTitle -metaDescription -metaTags -childs -parent -image -description -top'
}

//Controller function to get ALL Books
async function getAllBooks(req, res) {
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

    //Controller function to get ALL Books if not exists a query
    Book.find()
        .populate(populateRelatedProducts)
        .populate(populateUserId)
        .populate(populateAuthor)
        .populate(populateSpecialty)
        .limit(limit)
        .sort(sort)
        .exec((err, books) => {
            console.log(sort)
            //If an error has ocurred in server
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

            //If not exists books in db
            if(!books || books.length < 1) return res.status(404).send({status: 404, message: `Not exists books in db`})

            return res.status(200).send(books);
        })
}

//Controller function to get one book by Id
async function getBooksById(req, res) {
    let bookId = req.params.id;

    Book.findById(bookId)
        .populate(populateRelatedProducts)
        .populate(populateUserId)
        .populate(populateAuthor)
        .populate(populateSpecialty)
        .exec((err, book) => {
            //If book not exists
            if(!book) return res.status(404).send({status: 404, message: 'This resource not exists'});

            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            return res.status(200).send(book);

        });
}

//Controller function to get one book by Slug
async function getBooksBySlug(req, res) {
    let bookSlug = req.params.slug;

    Book.findOne({ slug: bookSlug })
        .populate(populateRelatedProducts)
        .populate(populateUserId)
        .populate(populateAuthor)
        .populate(populateSpecialty)
        .exec((err, book) => {
            //If book not exists
            if(!book) return res.status(404).send({status: 404, message: 'This resource not exists'});

            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            return res.status(200).send(book);
        });
}

//Controller function to get one book by Isbn
async function getBooksByIsbn(req, res) {
    let isbn = req.params.isbn;

    Book.findOne({"isbn" : isbn})
        .populate(populateRelatedProducts)
        .populate(populateUserId)
        .populate(populateAuthor)
        .populate(populateSpecialty)
        .exec((err, books) => {
            //If book not exists
            if(!books) return res.status(404).send({status: 404, message: 'This resource not exists'});

            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            return res.status(200).send(books);
        });
}

//Controller function to get Books by Publication year
async function getBooksByPublication(req, res) {
    let year = req.params.year;

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

    Book.find({"publicationYear" : year})
        .populate(populateRelatedProducts)
        .populate(populateUserId)
        .populate(populateAuthor)
        .populate(populateSpecialty)
        .limit(limit)
        .sort(sort)
        .exec((err, books) => {
            //If book not exists
            if(!books || books.length < 1) return res.status(404).send({status: 404, message: 'Not exists books publicated in this year'});

            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            return res.status(200).send(books);
        });
}

//Controller function to get Books by state
async function getBooksByState(req, res) {
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

    Book.find({"inventory.state" : state})
        .populate(populateRelatedProducts)
        .populate(populateUserId)
        .populate(populateAuthor)
        .populate(populateSpecialty)
        .limit(limit)
        .sort(sort)
        .exec((err, books) => {
            //If book not exists
            if(!books || books.length < 1) return res.status(404).send({status: 404, message: 'Not exists books with this inventory state'});

            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            return res.status(200).send(books);
        });
}

//Controller function to create one Book
async function createBook(req, res) {
    if(!req.body.author || !req.body.title || !req.body.publicationYear || !req.body.slug || !req.body.userId) {
        return res.status(400).send({status: 400, message: 'Bad request'})
    }

    let book = new Book(req.body);

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
}

async function updateBook(req, res) {
    let bookId = req.params.id;
    let update = req.body;

    Book.findByIdAndUpdate(bookId, update, {new: true})
        .populate(populateRelatedProducts)
        .populate(populateUserId)
        .populate(populateAuthor)
        .populate(populateSpecialty)
        .exec((err, book) => {
            //If book not exists
            if(!book) return res.status(404).send({status: 404, message: 'This resource not exists'})

            //If book exists but an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

            res.status(200).send(book)
        });
}

//Controller function to delete one Book
async function deleteBook(req, res) {
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

module.exports = {
    getAllBooks,
    getBooksBySlug,
    getBooksById,
    getBooksByIsbn,
    getBooksByState,
    getBooksByPublication,
    createBook,
    deleteBook,
    updateBook
}