'use strict'

const tokenService = require('./tokenService');

function isAuth(req, res, next) {
    //Return if do not exists authorization header
    if(!req.headers.authorization) return res.status(403).send({status: 403,  message: `You don't have authorization for this resource`})

    const token = req.headers.authorization.split(' ')[1];
    
    tokenService.decodeToken(token)
        .then(resp => {
            req.user = resp
            next()
        })
        .catch(resp => {
            res.status(resp.status).send({status: resp.status, message: resp.message})
        })
}

module.exports = {
    isAuth
}