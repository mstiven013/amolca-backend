'use strict'

const config = require('../../config');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const hbsHelpers = require('handlebars-helpers');
const allHelpers = hbsHelpers.math();
const moment = require('moment');
const sendmail = require('sendmail')();
const fs = require('fs');
const controller = {};

handlebars.registerHelper('getBookTitle', function(arr, id) {
    return arr.this.title
});

const readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

const smtpTransport = nodemailer.createTransport({
    service: config.mailer.service,
    host: config.mailer.host,
    port: config.mailer.port,
    //secure: true,
    /*auth: {
        user: config.mailer.user,
        pass: config.mailer.pass
    }*/
});

controller.createOrder = (info) => {

    const email = new Promise( (res, rej) => {

        try {

            readHTMLFile('src/public/email/new-order-client.html', function(err, html) {
                var template = handlebars.compile(html);
                var replacements = {
                    orderId: info._id,
                    orderDate: moment(info.registerDate).format('LL'),
                    orderTotal: info.cart[0].total,
                    products: info.cart[0].products,
                    shipping: info.shipping,
                    billing: info.billing
                };

                if(info.userId) {
                    replacements.user = info.userId[0];
                }

                var htmlToSend = template(replacements);

                sendmail({
                    from: `Amolca Colombia <ventas@amolca.com.co>`,
                    to: info.billing.email,
                    cc: config.mailer.cc,
                    subject: `Registro de nuevo pedido - Amolca`,
                    html: htmlToSend
                }, (err, reply) => {
                    if(err) {
                        console.log('Error enviando el email')
                        return rej({ status: 500, message: `An error has ocurred sending the message to your email` });
                    } else {
                        console.log('Enviado correctamente')
                        //Send status and user stored
                        return res('Enviado correctamente');
                    }
                })
            
                /*smtpTransport.sendMail(mailOptions, (err, response) => {
            
                    if(err) {
                        console.log('Error enviando el email') 
                        console.log(err)
                        return rej({ status: 500, message: `An error has ocurred sending the message to your email` });
                    } else {
                        console.log('Enviado correctamente')
                        //Send status and user stored
                        return rej('Enviado correctamente');
                    }
                });*/
        
            });

           res(200)

        } catch(e) {
        //Reject if an error has ocurred
            rej({
                status: 500,
                message: `An error has ocurred in server: ${e}`
            })
        }
    })

    return email;

}

module.exports = controller;