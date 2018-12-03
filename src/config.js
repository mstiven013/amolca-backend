'use strict'

const config = {
    name: 'Amolca',
    version: '1.0',
    api: '/api/',
    port: process.env.PORT || 3000,
    mailer: { 
        cc: 'gerencia@amolca.com.co, asistentepresidencia@amolca.us',
        user: 'mstiven013@gmail.com',
        service: 'webussines.com',
        host: 'webussines.com',
        port: 25
    },
    secret: 'mysecretkeyapi',
    dbPass: encodeURIComponent('AmolcaColombia%2018'),    
    //dbOptions: {},
    dbOptions: { 
        auth: { 
            user: 'amolca', 
            password: 'AmolcaColombia%2018' 
        },
        connectTimeoutMS: 300000,
        socketTimeoutMS: 300000,
        keepAlive: true,
        keepAliveInitialDelay: 300000,
        reconnectTries: 10
    },
    //db: 'mongodb://localhost:27017/amolca-store',
    db: `mongodb+srv://amolca:${this.dbPass}@amolcaweb2018-pxfid.mongodb.net/test`
}

module.exports = config;