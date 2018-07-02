'use strict'

const express = require('express');
const router = express.Router();

const User = require('./UsersModel');
const UserCtrl = require('./usersController');

//Get all users
router.get('/', UserCtrl.getAllUsers);

//Get an user
router.get('/:id', UserCtrl.getOneUser);

//Set user
router.post('/', UserCtrl.signUp);

//Delete an user
router.delete('/:id', UserCtrl.deleteUser);

router.put('/:id', UserCtrl.updateUser);

module.exports = router;