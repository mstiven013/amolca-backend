'use strict'

const mongoose = require('mongoose');
const User = require('../users/UsersModel');
const TokenService = require('./tokenService');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
const bcrypt = require('bcrypt-nodejs');

//Controller register an User
async function signUp(req, res) {
    if (!req.body.name || !req.body.email || !req.body.role || !req.body.country) {
        return res.status(400).send({
            status: 400,
            message: 'Bad request'
        })
    }

    let user = new User(req.body);

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

        const smtpTransport = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'mstiven013@gmail.com',
                pass: 'SoloNacional1947'
            }
        });
    
        const mailOptions = {
            from: `Amolca Colombia <info@amolca.com.co>`,
            to: userStored.email,
            subject: `¡Hola, ${userStored.name}! Te damos la bienvenida a Amolca`,
            text: `¡Hola, ${userStored.name}! Bienvenido a Amolca, esperamos nuestra relación sea feliz y duradera.`,
            html: `
                <h2 style="font-family: 'Arial'; font-weight: bold; text-align: center;">¡Hola, ${userStored.name}!</h2>
                <p style="font-family: 'Arial'; text-align: center;">Bienvenido a Amolca, esperamos nuestra relación sea feliz y duradera.</p>
            `
        }
    
        smtpTransport.sendMail(mailOptions, (err, response) => {
    
            if(err) {
                console.log('Error enviando el email') 
                console.log(err)
                return res.status(500).send({ status: 500, message: `An error has ocurred sending the message to your email` });
            } else {
                console.log('Enviado correctamente')
                //Send status and user stored
                return res.status(201).send({'access_token': TokenService.createToken(user), user: user});
            }
    
        });

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