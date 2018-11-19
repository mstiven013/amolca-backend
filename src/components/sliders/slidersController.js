'use strict'

const mongoose = require('mongoose');
const Slider = require('./slidersModel');

const controller = {};

//Get All sliders
controller.getAllSliders = (req, res) => {
    const sliders = await Slider.find();
    res.send(sliders);
}

//Get Sliders by id
controller.getSlidersById = (req, res) => {
    Slider.findById(req.params.id, (err, slider) => {
        if(!slider) return res.status(404).send({status: 404, message: 'This resource not exists'})
        if(err) return res.status(500).send({status: 500, message: 'An error has ocurred in server'})

        res.status(200).send(slider)
    });
}

//Controller function to get one slider by Slug
controller.getSlidersBySlug = (req, res) => {
    Slider.findOne({ slug: req.params.slug })
        .exec((err, slider) => {
            //If slider not exists
            if(!slider) return res.status(404).send({status: 404, message: 'This resource not exists'});

            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            return res.status(200).send(slider);
        });
}

//Controller function to create one Slider
controller.createSlider = (req, res) => {
    if(!req.body.title || !req.body.items) {
        return res.status(400).send({status: 400, message: 'Bad request'})
    }

    let slider = new Slider(data);

    slider.save((err, stored) => {
        //If slider already exists
        if(err && err.code == 11000) return res.status(409).send({status: 409, message: `This resource alredy exists: ${err}`});

        //If an error has ocurred
        if(err && err.code != 11000) return res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${err}`});

        return res.status(201).send(stored);
    });
}

//Controller function to update one Slider
controller.updateSlider = (req, res) => {

    Slider.findByIdAndUpdate(req.params.id, req.body, {new: true})
        .exec((err, slider) => {
            //If slider not exists
            if(!slider) return res.status(404).send({status: 404, message: 'This resource not exists'})

            //If slider exists but an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

            res.status(200).send(slider)
        });

}

//Controller function to delete one Slider
controller.deleteSlider = (req, res) => {

    Slider.findById(req.params.id, (err, slider) => {
        //If slider not exists
        if(!slider) return res.status(404).send({status: 404, message: 'This resource not exists'})

        //If slider exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        //Remove slider
        slider.remove((err) => {
            if(err) if(err) return res.status(500).send({status: 500, message: 'An error has ocurred removing this resource'});

            res.status(200).send({status: 200, message: 'Resource successfully removed'});
        });
    });

}

module.exports = controller;