'use strict'

const express = require('express');
const router = express.Router();

const User = require('./UsersModel');
const UserCtrl = require('./usersController');

const auth = require('../auth/authMiddleware');

//Get all users
router.get('/', auth.isAuth, UserCtrl.getAllUsers);

//Get an user
router.get('/:id', auth.isAuth, UserCtrl.getOneUser);

//Get posts by user Id
router.get('/:id/posts', auth.isAuth, UserCtrl.getPostsByUser)

//Get books by user Id
router.get('/:id/books', auth.isAuth, UserCtrl.getBooksByUser)

//Get orders by user Id
router.get('/:id/orders', auth.isAuth, UserCtrl.getOrdersByUser)

//Get Cart by user Id
router.get('/:id/carts', auth.isAuth, UserCtrl.getCartsByUser);

//Delete an user
router.delete('/:id', auth.isAuth, UserCtrl.deleteUser);

//Update user
router.put('/:id', auth.isAuth, UserCtrl.updateUser);

module.exports = router;