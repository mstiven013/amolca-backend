'use strict'

const mongoose = require('mongoose')
const Specialty = require('./SpecialtiesModel')
const Book = require('../books/BooksModel');
const controller = {};

controller.getSpecialties = async function(req, res) {
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
            
            return res.status(200).send(specialties);
        });
    })
}

//COntroller function to get One Specialty by Id
controller.getSpecialtiesById = async function(req, res) {
    let specialtyId = req.params.id;

    Specialty.findById(specialtyId)
        .populate({path: 'parent childs', select: '-registerDate -__v -description -top -parent -childs -metaTags -metaTitle -metaDescription'})
        .exec((err, specialty) => {
            //If specialty not exists
            if(!specialty) return res.status(404).send({status: 404, message: 'This resource not exists'});

            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            return res.status(200).send(specialty);

        });
}

//Controller function to get one Post by Slug
controller.getSpecialtiesBySlug = async function(req, res) {
    let specialtySlug = req.params.slug;

    Specialty.findOne({ slug: specialtySlug })
        .populate({path: 'parent childs', select: '-registerDate -__v -description -top -parent -childs -metaTags -metaTitle -metaDescription'})
        .exec((err, specialty) => {
            //If specialty not exists
            if(!specialty) return res.status(404).send({status: 404, message: 'This resource not exists'});

            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            return res.status(200).send(specialty);
        });
}

//Controller function to get Books by Specialties
controller.getBooksBySpecialty = async function(req, res) {
    let specialtyId = req.params.id;

    Book.find({specialty: specialtyId})
        .populate({ path: 'relatedProducts', select: '-__v -relatedProducts -specialty -publicationYear -userId -attributes -variations -volume -inventory.individualSale -inventory.allowReservations -inventory.isbn'})
        .populate({ path: 'userId', select: '-__v -signupDate -products -posts -role '})
        .populate({ path: 'author', select: '-__v -registerDate -specialty '})
        .exec((err, books) => {
            //If book not exists
            if(!books || books.length < 1) return res.status(404).send({status: 404, message: 'This specialty not have books registered'});

            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            return res.status(200).send(books);
        });
}

controller.createSpecialty = async function(req, res) {
    //If not has required fields
    if(!req.body.title || !req.body.slug) {
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

controller.createManySpecialties = async function(req, res) {
    
    let specialties = req.body;

    Specialty.insertMany(specialties, (err, specialtiesStored) => {
        if(err && err.code == 11000) return res.status(409).send({status: 409, message: `This resource alredy exists: ${err}`});

        if(err && err.code != 11000) return res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${err}`});

        let flag = true;

        for (let i = 0; i < specialtiesStored.length; i++) {
            if(specialtiesStored[i].parent && specialtiesStored[i].parent != '') {
                let parentId = specialtiesStored[i].parent;
                let childId = specialtiesStored[i]._id;
                controller.addChildToSpecialty(parentId, childId)
                    .then(resp => {
                       //console.log('Saved')
                       flag = true;
                    }).catch( resp => {
                        return res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${resp}`});
                    })
            }
        }

        if(flag) return res.status(201).send(specialtiesStored);
    });
}

//Controller function to add childs specialties
controller.addChildToSpecialty = async function(parent, child) {
    const prom = new Promise((res, rej) => {
        try {
            Specialty.update({ "_id": parent }, { $push: { "childs": child }}, {new: true} , (err, specialty) => {
                //If specialty not exists
                if(!specialty) return rej({status: 404, message: 'This resource not exists'})
        
                //If specialty exists but an error has ocurred
                if(err) return rej({status: 500, message: `An error has ocurred in server: ${err}`})
        
                res(specialty)
            });
        } catch(e) {
            rej({ status: 500, message: `An error has ocurred ${e}` })
        }
    });

    return prom;
}

controller.updateSpecialty = async function(req, res) {
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

controller.deleteSpecialty = async function(req, res) {
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

module.exports = controller;