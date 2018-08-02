'use strict'

const mongoose = require('mongoose');
const Book = require('./BooksModel');

//Controller function to get ALL Books
async function getAllbooks(req, res) {
    const books = await Book.find();
    return res.status(200).send(books);
}

//Controller function to get ONE Book by ID
async function getOneBookById(req, res) {
    Book.findById(req.params.id, (err, book) => {

        //If book not exists
        if(!book) return res.status(404).send({status: 404, message: 'This resource not exists'});

        //If an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

        return res.status(200).send(book);

    });
}

//Controller function to get ONE Book by SLUG
async function getOneBookBySlug(req, res) {
    Book.findOne({ slug: req.params.slug })
        .exec((err, book) => {
            //If book not exists
            if(!book) return res.status(404).send({status: 404, message: 'This resource not exists'});

            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            return res.status(200).send(book);
        });
}

//Controller function to get ONE Book by USER ID
async function getOneBookByUserId(req, res) {
    Book.find({ userId: req.params.user })
        .exec((err, book) => {
            //If book not exists
            if(!book) return res.status(404).send({status: 404, message: 'This resource not exists'});

            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            return res.status(200).send(book);
        });
}

//Controller function to create one Book
async function createBook(req, res) {
    if(!req.body.author || !req.body.name || !req.body.publicationYear || !req.body.slug || !req.body.userId) {
        return res.status(400).send({status: 400, message: 'Bad request'})
    }

    let book = new Book(req.body);

    book.save((err, bookStored) => {
        if(err && err.code == 11000) return res.status(409).send({status: 409, message: `This resource alredy exists`});

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
    getAllbooks,
    getOneBookById,
    getOneBookBySlug,
    getOneBookByUserId,
    createBook,
    deleteBook,
    updateBook
}