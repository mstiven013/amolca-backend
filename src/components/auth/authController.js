'use strict'

const mongoose = require('mongoose');
const User = require('./UsersModel');
const TokenService = require('./tokenService');

function signUp(req, res) {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        country: req.body.country,
        password: req.body.password
    });

    user.save((err) => {
        if(err) return res.status(500).send({'status': 500, 'message': 'An error has ocurred saving this resource'})

        return res.status(200).send({'status': 200, 'message': 'Resource saved successfully', 'token': TokenService.createToken(user) })
    });
}

function signIn(req, res) {

}

module.exports = {
    signUp,
    signIn
}