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


controller.send = (frm, mailer) => {
    
    const email = new Promise( (res, rej) => {

        try {

            readHTMLFile('src/public/email/contact.html', function(err, html) {
                var template = handlebars.compile(html);
                var replacements = {
                    name: frm.name,
                    phone: frm.phone,
                    email: frm.email,
                    city: frm.city,
                    address: frm.address,
                    subject: frm.subject,
                    message: frm.message,
                    domain: mailer.domain
                };

                var htmlToSend = template(replacements);

                sendmail({
                    from: mailer.from,
                    to: mailer.to,
                    //cc: mailer.cc,
                    subject: mailer.subject,
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