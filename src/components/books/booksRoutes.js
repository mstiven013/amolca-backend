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
router.post('/', auth.isAuth, BookCtrl.createBook);

//Create many books
router.post('/many', auth.isAuth, BookCtrl.createManyBooks);

//Delete an book
router.delete('/:id', auth.isAuth, BookCtrl.deleteBook);

//Update book
router.put('/:id', auth.isAuth, BookCtrl.updateBook);


router.post('/change-image', (req, res) => {
    Book.find({ image: { "$regex": /assets\/img\/books/i, "$options": "i" } })
        .exec((err, books) => {
            
            for (let i = 0; i < books.length; i++) {
                books[i].image = books[i].image.replace('assets/img/books', 'uploads/books')

                books[i].save((err, saved) => {
                    if(err) return res.send(500)
                })
            }

            return books;
        })
});

module.exports = router;