'use strict'

const express = require('express');
const router = express.Router();

const Author = require('./AuthorsModel');
const AuthorCtrl = require('./authorsController');

const auth = require('../auth/authMiddleware');

//Get all Authors
router.get('/', AuthorCtrl.getAuthors);

//Get one author
router.get('/:id', AuthorCtrl.getOneAuthor);

//Get books by Author
router.get('/:id/books', AuthorCtrl.getBooksByAuthor);

//Create Author
router.post('/', AuthorCtrl.createAuthor);

//Delete an Author
router.delete('/:id', AuthorCtrl.deleteAuthor);

//Update Author
router.put('/:id', AuthorCtrl.updateAuthor);

module.exports = router;