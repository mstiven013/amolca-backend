'use strict'

const express = require('express');
const router = express.Router();

const Author = require('./AuthorsModel');
const AuthorCtrl = require('./authorsController');

const auth = require('../auth/authMiddleware');

//Get all Authors
router.get('/', AuthorCtrl.getAuthors);

//Get Authors by ID
router.get('/:id', AuthorCtrl.getAuthorsById);

//Get Authors by SLUG
router.get('/slug/:slug', AuthorCtrl.getAuthorsBySlug);

//Get books by Author
router.get('/:id/books', AuthorCtrl.getBooksByAuthor);

//Create Author
router.post('/', AuthorCtrl.createAuthor);

//Delete an Author
router.delete('/:id', AuthorCtrl.deleteAuthor);

//Update Author
router.put('/:id', AuthorCtrl.updateAuthor);

module.exports = router;