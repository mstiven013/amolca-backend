'use strict'

const express = require('express');
const router = express.Router();

const User = require('../components/users/UsersModel');

//Get all users
router.get('/', async (req, res) => {
    if(req.headers["content-type"] && req.headers["content-type"] !== 'application/json'){
        return res.status(500).send({
            status: 500,
            message: 'Server not supported the Content-Type header sended in this request'
        })
    }

    const users = await User.find();
    res.json(users);
});

//Get an user
router.get('/:id', async (req, res) => {
    if(req.headers["content-type"] && req.headers["content-type"] !== 'application/json'){
        return res.status(500).send({
            status: 500,
            message: 'Server not supported the Content-Type header sended in this request'
        })
    }

    let userId = req.params.id;

    User.findById(userId, (err, user) => {
        //If user not exists
        if(err && err.name === 'CastError') {
            return res.status(404).send({
                status: 404,
                message: 'This resource not exists'
            });
        }

        //If user exists but an error has ocurred
        if(err && err.name !== 'CastError') {
            return res.status(500).send({
                status: 500,
                message: 'An error has ocurred in server'
            });
        }

        //Send OK status and user
        res.status(200).send(user)
    });
});

//Set user
router.post('/', async (req, res) => {
    if(req.headers["content-type"] !== 'application/json'){
        return res.status(500).send({
            status: 500,
            message: 'Server not supported the Content-Type header sended in this request'
        })
    }

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

        //Send status and user stored
        res.status(201).send(userStored);
    });
});

//Delete an user
router.delete('/:id', (req, res) => {
    if(req.headers["content-type"] !== 'application/json'){
        return res.status(500).send({
            status: 500,
            message: 'Server not supported the Content-Type header sended in this request'
        })
    }
    
    let userId = req.params.id;

    User.findById(userId, (err, user) => {

        //If user not exists
        if(!user) return res.status(404).send({status: 404, message: 'This resource not exists'})

        //If user exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        //Remove user
        user.remove((err) => {
            if(err) if(err) return res.status(500).send({status: 500, message: 'An error has ocurred removing this resource'});

            res.status(200).send({status: 200, message: 'Resource successfully removed'});
        });
    });
});

router.put('/:id', (req, res) => {
    if(req.headers["content-type"] !== 'application/json'){
        return res.status(500).send({
            status: 500,
            message: 'Server not supported the Content-Type header sended in this request'
        })
    }

    let userId = req.params.id;
    let update = req.body;

    User.findByIdAndUpdate(userId, update, {new: true} , (err, doc) => {
        //If user not exists
        if(!doc) return res.status(404).send({status: 404, message: 'This resource not exists'})

        //If user exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        res.status(200).send(doc)
    });

});

module.exports = router;