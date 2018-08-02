'use strict'

const express = require('express');
const router = express.Router();

const Book = require('./BooksModel');
const BookCtrl = require('./booksController');

const auth = require('../auth/authMiddleware');

//Get all books
router.get('/', auth.isAuth, BookCtrl.getAllbooks);

//Get an user
router.get('/:id', auth.isAuth, BookCtrl.getOneUser);

//Delete an user
router.delete('/:id', auth.isAuth, BookCtrl.deleteUser);

//Update user
router.put('/:id', auth.isAuth, BookCtrl.updateUser);

module.exports = router;