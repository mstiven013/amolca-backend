'use strict'

const express = require('express');
const router = express.Router();

const User = require('./UsersModel');
const UserCtrl = require('./usersController');

const auth = require('../auth/authMiddleware');

//Get all users
router.get('/', UserCtrl.getAllUsers);

//Get an user
router.get('/:id', UserCtrl.getOneUser);

//Get books by user Id
router.get('/:id/books',  UserCtrl.getBooksByUser)

//Get orders by user Id
router.get('/:id/orders',  UserCtrl.getOrdersByUser)

//Delete an user
router.delete('/:id', UserCtrl.deleteUser);

//Update user
router.put('/:id', UserCtrl.updateUser);

module.exports = router;