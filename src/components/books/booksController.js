'use strict'

const mongoose = require('mongoose');
const Book = require('./BooksModel');

//Controller function to get ALL Books
async function getBooks(req, res) {

    if(req.query.searchby) {
        let searchby = req.query.searchby;

        //Controller function to get ONE Book by ID
        if(searchby == 'id') {
            let bookId = req.query.id;

            Book.findById(bookId, (err, book) => {

                //If book not exists
                if(!book) return res.status(404).send({status: 404, message: 'This resource not exists'});
        
                //If an error has ocurred
                if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});
        
                return res.status(200).send(book);
        
            });
        }

        //Controller function to get ONE Book by SLUG
        if(searchby == 'slug') {
            let bookSlug = req.query.slug;

            Book.findOne({ slug: bookSlug })
                .exec((err, book) => {
                    //If book not exists
                    if(!book) return res.status(404).send({status: 404, message: 'This resource not exists'});

                    //If an error has ocurred
                    if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

                    return res.status(200).send(book);
                });
        }

        //Controller function to get ONE Book by USER ID
        if(searchby == 'user') {
            let userId = req.query.id;

            Book.find({ userId: userId })
                .exec((err, book) => {
                    //If book not exists
                    if(!book || book.length < 1) return res.status(404).send({status: 404, message: 'Not exists books registered by this user'});

                    //If an error has ocurred
                    if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

                    return res.status(200).send({"books": books, "count": books.length});
                });
        }

        //Controller function to get Books by Author
        if(searchby == 'author') {
            let authorId = req.query.id;

            Book.find({author: authorId})
                .exec((err, books) => {
                    //If book not exists
                    if(!books || books.length < 1) return res.status(404).send({status: 404, message: 'This author not have books registered'});

                    //If an error has ocurred
                    if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

                    return res.status(200).send({"books": books, "count": books.length});
                });
        }

        //Controller function to get Books by isbn
        if(searchby == 'isbn') {
            let isbn = req.query.isbn;

            Book.findOne({"inventory.isbn" : isbn})
                .exec((err, books) => {
                    //If book not exists
                    if(!books) return res.status(404).send({status: 404, message: 'This resource not exists'});

                    //If an error has ocurred
                    if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

                    return res.status(200).send(books);
                });
        }

        //Controller function to get Books by state
        if(searchby == 'state') {
            let state = req.query.state.toUpperCase();

            Book.find({"inventory.state" : state})
                .exec((err, books) => {
                    //If book not exists
                    if(!books || books.length < 1) return res.status(404).send({status: 404, message: 'Not exists books with this inventory state'});

                    //If an error has ocurred
                    if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

                    return res.status(200).send({"books": books, "count": books.length});
                });
        }

        //Controller function to get Books by Publication year
        if(searchby == 'publication') {
            let year = req.query.year;

            Book.find({"publicationYear" : year})
                .exec((err, books) => {
                    //If book not exists
                    if(!books || books.length < 1) return res.status(404).send({status: 404, message: 'Not exists books publicated in this year'});

                    //If an error has ocurred
                    if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

                    return res.status(200).send({"books": books, "count": books.length});
                });
        }

        //Controller function to get Books by SPECIALTY
        if(searchby == 'specialty') {
            let spe = req.query.specialty;

            Book.find({specialty: spe})
                .exec((err, books) => {
                    //If book not exists
                    if(!books || books.length < 1) return res.status(404).send({status: 404, message: 'Not exists books in this specialty'});

                    //If an error has ocurred
                    if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

                    return res.status(200).send({"books": books, "count": books.length});
                });
        }

    } else {

        //Controller function to get ALL Books if not exists a query
        Book.find().exec((err, books) => {
            //If an error has ocurred in server
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

            return res.status(200).send(books);
        })
    }
}

//Controller function to create one Book
async function createBook(req, res) {
    if(!req.body.author || !req.body.name || !req.body.publicationYear || !req.body.slug || !req.body.userId) {
        return res.status(400).send({status: 400, message: 'Bad request'})
    }

    let book = new Book(req.body);

    book.save((err, bookStored) => {
        if(err && err.code == 11000) return res.status(409).send({status: 409, message: `This resource alredy exists: ${err}`});

        if(err && err.code != 11000) return res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${err}`});

        return res.status(201).send(bookStored);
    });
}

async function updateBook(req, res) {
    let bookId = req.params.id;
    let update = req.body;

    Book.findByIdAndUpdate(bookId, update, {new: true} , (err, book) => {
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
    getBooks,
    createBook,
    deleteBook,
    updateBook
}