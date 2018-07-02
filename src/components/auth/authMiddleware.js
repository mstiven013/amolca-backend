'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../../config');

function isAuth(req, res, next) {
    //Return if do not exists authorization header
    if(!req.headers.authorization) return res.status(403).send({status: 403,  message: `You don't have authorization for this resource`})

    const token = req.headers.authorization.split(' ')[1];
    const payload = jwt.decode(token, config.secret);

    //Function if token has expired
    if(payload.exp <= moment().unix()) return res.status(401).send({status: 401, message: 'The access token has expired'})

    req.user = payload.sub
    next()
}

module.exports = {
    isAuth
}