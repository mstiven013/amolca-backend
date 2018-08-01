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

//Delete an user
router.delete('/:id', auth.isAuth, UserCtrl.deleteUser);

//Update user
router.put('/:id', auth.isAuth, UserCtrl.updateUser);

module.exports = router;