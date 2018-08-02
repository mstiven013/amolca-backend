'use strict'

const express = require('express');
const router = express.Router();

const Book = require('./BooksModel');
const BookCtrl = require('./booksController');

const auth = require('../auth/authMiddleware');

//Get all books
router.get('/', auth.isAuth, BookCtrl.getAllbooks);

//Get an book by ID
router.get('/:id', auth.isAuth, BookCtrl.getOneBookById);

//Get an book by SLUG
router.get('/slug/:id', auth.isAuth, BookCtrl.getOneBookBySlug);

//Create book
router.post('/', BookCtrl.createBook);

//Delete an book
router.delete('/:id', auth.isAuth, BookCtrl.deleteBook);

//Update book
router.put('/:id', auth.isAuth, BookCtrl.updateBook);

module.exports = router;