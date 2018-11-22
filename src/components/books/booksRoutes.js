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
    Book.find({ image: { "$regex": /.jpg/i, "$options": "i" } })
        .exec((err, books) => {
            
            for (let i = 0; i < books.length; i++) {
                books[i].image = books[i].image.replace('.jpg', '.png')

                books[i].save((err, saved) => {
                    if(err) return res.send(500)
                })
            }

            return res.send(books);
        })
});

router.post('/add-version', (req, res) => {
    Book.find()
        .exec((err, books) => {
            
            for (let i = 0; i < books.length; i++) {
                books[i].version = ["PAPER"]

                books[i].save((err, saved) => {
                    if(err) return res.send(500)
                })
            }

            return res.send(books);
        })
});

router.post('/change-specialty', (req, res) => {
    Book.find({ interest: ["5bbba1737a4f39001363ebbb"] })
        .exec((err, books) => {

            for (let i = 0; i < books.length; i++) {
                for (let index = 0; index < books[i].interest.length; index++) {
                    if(books[i].interest[index] == "5bbba1197a4f39001363ebaf") {
                        console.log(books[i].title)
                        books[i].interest[index] = "5bbba0ff7a4f39001363ebae";
                    }
                }
            }

            for (let i = 0; i < books.length; i++) {
                books[i].save((err, saved) => {
                    if(err) return res.send(500)
                })
            }

            return res.send(books);
        })
});

router.post('/add-prices', (req, res) => {

    var results = [];

    for (let i = 0; i < req.body.length; i++) {
        const el = req.body[i];
        Book.find({"isbn": el.isbn})
            .exec((err, book) => {
                if(err) return res.status(500).send('error')
                
                for (let index = 0; index < book.length; index++) {
                    const element = book[index];

                    element.countries = req.body[i].countries;

                    element.save((err, saved) => {
                        //if(err) return res.send('error' + err)
                    })
                    
                }
            });
    }

    return res.status(200).send(results)

});

module.exports = router;