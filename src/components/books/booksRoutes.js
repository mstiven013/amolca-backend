'use strict'

const express = require('express');
const router = express.Router();

const Book = require('./BooksModel');
const BookCtrl = require('./booksController');

const auth = require('../auth/authMiddleware');

//Get all books
router.get('/', BookCtrl.getBooks);

//Create book
router.post('/', BookCtrl.createBook);

//Delete an book
router.delete('/:id', BookCtrl.deleteBook);

//Update book
router.put('/:id', BookCtrl.updateBook);

module.exports = router;