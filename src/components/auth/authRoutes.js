'use strict'

const express = require('express');
const router = express.Router();

const User = require('../users/UsersModel');
const AuthCtrl = require('./authController');

const auth = require('./authMiddleware');

//Register an user
router.post('/register', AuthCtrl.signUp);

//Login
router.post('/login', AuthCtrl.signIn);

module.exports = router;