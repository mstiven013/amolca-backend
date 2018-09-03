'use strict'

const config = {
    name: 'Amolca',
    version: '1.0',
    api: '/api/',
    port: process.env.PORT || 3000,
    secret: 'mysecretkeyapi',
    dbPass: encodeURIComponent('AmolcaColombia%2018'),    
    //dbAuth: {},
    dbAuth: { auth: { user: 'amolca', password: 'AmolcaColombia%2018' }},
    //db: 'mongodb://localhost:27017/amolca-store',
    db: `mongodb+srv://amolca:${this.dbPass}@amolcaweb2018-pxfid.mongodb.net/test`
}

module.exports = config;