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
router.post('/', auth.isAuth, AuthorCtrl.createAuthor);

//Create many Authors
router.post('/many', auth.isAuth, AuthorCtrl.createManyAuthors);

//Delete an Author
router.delete('/:id', auth.isAuth, AuthorCtrl.deleteAuthor);

//Update Author
router.put('/:id', auth.isAuth, AuthorCtrl.updateAuthor);

router.post('/change-image', (req, res) => {
    Author.find({ image: 'no-author-image.png' })
        .exec((err, books) => {

            for (let i = 0; i < books.length; i++) {
                books[i].image = books[i].image.replace('no-author-image.png', 'https://amolca.webussines.com/uploads/authors/no-author-image.png')

                books[i].save((err, saved) => {
                    if(err) return res.send(500)
                })
            }

            return res.send(books);
        })
});

module.exports = router;