'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../../config');

function createToken(user) {
    const payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };

    return jwt.encode(payload, config.secret);
}

function decodeToken(token) {

    const decoded = new Promise((resolve, reject) => {
        try {
            const payload = jwt.decode(token, config.secret)

            //Function if token has expired
            if(payload.exp <= moment().unix()) {
                reject({
                    status: 401,
                    message: 'The token has expired'
                })
            }

            resolve(payload.sub)
        } catch (err) {
            reject({
                status: 500,
                message: 'Invalid token'
            })
        }
    })

    return decoded

}

module.exports = {
    createToken,
    decodeToken
}