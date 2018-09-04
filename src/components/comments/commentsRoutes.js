'use strict'

const express = require('express');
const router = express.Router();

const Comment = require('./CommentsModel');
const CommentCtrl = require('./commentsController');

const auth = require('../auth/authMiddleware');

//Get all books
router.get('/', CommentCtrl.getAllComments);

//Get books by id
router.get('/:id', CommentCtrl.getCommentsById);

//Create book
router.post('/', CommentCtrl.createComments);

//Delete an book
router.delete('/:id', auth.isAuth, CommentCtrl.deleteComments);

//Update book
router.put('/:id', auth.isAuth, CommentCtrl.updateComments);

module.exports = router;