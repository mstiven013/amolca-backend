'use strict'

const express = require('express');
const router = express.Router();

const Book = require('./BooksModel');
const BookCtrl = require('./booksController');

const auth = require('../auth/authMiddleware');

//Get all books
router.get('/', BookCtrl.getAllBooks);

//Get books by id
router.get('/:id', BookCtrl.getBooksById);

//Get books by slug
router.get('/slug/:slug', BookCtrl.getBooksBySlug);

//Get books by isbn
router.get('/isbn/:isbn', BookCtrl.getBooksByIsbn);

//Get books by state
router.get('/state/:state', BookCtrl.getBooksByState);

//Get books by publication year
router.get('/publication/:year', BookCtrl.getBooksByPublication);

//Create book
router.post('/', BookCtrl.createBook);

//Delete an book
router.delete('/:id', BookCtrl.deleteBook);

//Update book
router.put('/:id', BookCtrl.updateBook);

module.exports = router;