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
router.get('/slug/:slug', auth.isAuth, BookCtrl.getOneBookBySlug);

//Get an book by USER ID
router.get('/user/:user', auth.isAuth, BookCtrl.getOneBookByUserId);

//Create book
router.post('/', BookCtrl.createBook);

//Delete an book
router.delete('/:id', auth.isAuth, BookCtrl.deleteBook);

//Update book
router.put('/:id', auth.isAuth, BookCtrl.updateBook);

module.exports = router;