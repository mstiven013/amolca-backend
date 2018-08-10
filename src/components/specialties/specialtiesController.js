'use strict'

const mongoose = require('mongoose')
const Specialty = require('./SpecialtiesModel')

async function getSpecialties(req, res) {
    //Controller function to get ALL specialties if not exists a query
    Specialty.find().exec((err, specialties) => {
        //If an error has ocurred in server
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        //Populate for get specialties without optional data
        Specialty.populate(specialties, {path: 'parent childs', select: '-registerDate -__v -description -top -parent -childs -metaTags -metaTitle -metaDescription'}, (err, specialties) => {
            //If an error has ocurred in server
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

            //If not exists specialties in db
            if(!specialties || specialties.length < 1) return res.status(404).send({status: 404, message: `Not exists specialties in db`})
            
            return res.status(200).send({"specialties": specialties, "count": specialties.length});
        });
    })
}

async function createSpecialty(req, res) {
    //If not has required fields
    if(!req.body.name || !req.body.slug) {
        return res.status(400).send({status: 400, message: 'Bad request'})
    }

    //If parent field is empty
    if(req.body.parent == '') return res.status(400).send({status: 400, message: 'Parent field is empty'}) 

    //If not has parent
    if(!req.body.parent || req.body.parent == '') req.body.top = true
    
    let specialty = new Specialty(req.body);

    specialty.save((err, specialtyStored) => {
        if(err && err.code == 11000) return res.status(409).send({status: 409, message: `This resource alredy exists: ${err}`});

        if(err && err.code != 11000) return res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${err}`});

        return res.status(201).send(specialtyStored);
    });
}

async function updateSpecialty(req, res) {
    let specialtyId = req.params.id;
    let update = req.body;

    if(!req.body.parent || req.body.parent == '') {
        req.body.top = true;
    } else if(req.body.parent && req.body.parent != '') {
        req.body.top = false;
    }

    Specialty.findByIdAndUpdate(specialtyId, update, {new: true} , (err, specialty) => {
        //If specialty not exists
        if(!specialty) return res.status(404).send({status: 404, message: 'This resource not exists'})

        //If specialty exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        res.status(200).send(specialty)
    });
}

async function deleteSpecialty(req, res) {
    Specialty.findById(req.params.id, (err, specialty) => {
        //If specialty not exists
        if(!specialty) return res.status(404).send({status: 404, message: 'This resource not exists'})

        //If specialty exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        //Remove specialty
        specialty.remove((err) => {
            if(err) if(err) return res.status(500).send({status: 500, message: 'An error has ocurred removing this resource'});

            res.status(200).send({status: 200, message: 'Resource successfully removed'});
        });
    });  
}

module.exports = {
    getSpecialties,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty
}