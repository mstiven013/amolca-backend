'use strict'

const mongoose = require('mongoose');
const Form = require('./formsModel');
const Email = require('../emails/emailsContact');
const controller = {};

controller.getAllForms = async (req, res) => {
    const forms = await Form.find();
    res.json(forms);
}

controller.getFormsById = (req, res) => {

}

controller.createForm = (req, res) => {

    let form = {};
    form.from = req.body.mailer.from;
    form.to = req.body.mailer.to;
    form.subject = req.body.mailer.subject;
    form.domain = req.body.mailer.domain;

    if(req.body.mailer.cc) {
        form.cc = req.body.mailer.cc;
    }

    //Items
    form.items = req.body.items;
    
    let newForm = new Form(form);

    newForm.save((err, saved) => {
        if(err) return res.status(500).send({'status': 500, 'message': `An error has ocurred saving this resource: ${err}`})

        Email.send(req.body.items, req.body.mailer)
            .then((resp) => {
                return res.status(200).send({ 'status': 200, 'message': 'Email saved and sended successfully' });
            })
            .catch((e) => {
                return res.status(500).send({status: 500, message: `This resource is saved but an error has ocurred sending the order email: ${err}`});
            })
    })

}

controller.deleteForm = (req, res) => {

}

controller.updateForm = (req, res) => {
    
}

module.exports = controller;