'use strict'

const config = require('../../config');
const mongoose = require('mongoose');
const User = require('../users/UsersModel');
const TokenService = require('./tokenService');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
const bcrypt = require('bcrypt-nodejs');
const handlebars = require('handlebars');
const hbsHelpers = require('handlebars-helpers');
const allHelpers = hbsHelpers.math();
const moment = require('moment');
const sendmail = require('sendmail')();
const fs = require('fs');
const emails = require('../emails/emailsAccount');

//Controller register an User
async function signUp(req, res) {
    
    if (!req.body.user || !req.body.user.name || !req.body.user.email || !req.body.user.role || !req.body.user.country) {
        return res.status(400).send({
            status: 400,
            message: 'Bad request'
        })
    }

    let user = new User(req.body.user);

    user.save(function (err, userStored) {
        if(err && err.code === 11000) {
            //If this user already exists
            return res.status(409).send({
                status: 409,
                message: 'This resource already exists'
            });
        } else if(err && err.code !== 11000) {
            //If user are not exists but exists an error
            return res.status(500).send({
                status: 500,
                message: `Error saving the resource: ${err}`
            });
        }

        emails.send(userStored, req.body.mailer)
            .then((resp) => {
                console.log('Enviado correctamente')
                //Send status and user stored
                return res.status(200).send({user: userStored, status: 200, message: 'Logged successfully', access_token: TokenService.createToken(userStored)});
            })
            .catch((e) => {
                console.log('Error enviando el email')
                //return res.status(500).send({ status: 500, message: `An error has ocurred sending the message to your email` });
            })

    });
}

//Controller to login user
function signIn(req, res) {
    
    //console.log(req.body);

    if(!req.body.username || !req.body.password) return res.status(500).send({status: 500, message: 'Bad request'})

    User.findOne({email: req.body.username})
        .select('+password')
        .exec((err, user) => {
            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred getting this resource: ${err}`})

            //If this user not exist's
            if(!user || user.length < 1) return res.status(404).send({status: 404, message: 'This resource not exists'})

            user.comparePassword(req.body.password, function(err, isMatch) {
                if (err) return res.status(403).send({status: 403, message: `An error has ocurred getting this resource: ${err}`});

                if(isMatch) {

                    //Delete password while send user
                    let userSend = user.toObject();
                    delete userSend.password;

                    return res.status(200).send({user: userSend, status: 200, message: 'Logged successfully', access_token: TokenService.createToken(user)});
                } else {
                    return res.status(403).send({status: 403, message: 'Invalid credentials'});
                }
            });
        });
}

module.exports = {
    signUp,
    signIn
}