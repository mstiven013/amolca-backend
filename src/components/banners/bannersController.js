'use strict'

const mongoose = require('mongoose')
const Banner = require('./bannersModel');
const controller = {}

//Controller function to Get All Banners
controller.getAllBanners = (req, res) => {

    let skip = 0;
    let limit = 1000;
    let sortKey = 'registerDate';
    let sortOrder = 1;

    if(req.query.skip) {
        skip = parseInt(req.query.skip);
    }
    if(req.query.limit) {
        limit = parseInt(req.query.limit);
    }
    if(req.query.orderby) {
        sortKey = req.query.orderby;
    }
    if(req.query.order) {
        sortOrder = req.query.order;
    }

    let sort = {[sortKey]: sortOrder};

    Banner.find()
        .populate(populateUserId)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .exec((err, banners) => {
            //If an error has ocurred in server
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

            //If not exists banners in db
            if(!banners) return res.status(404).send({status: 404, message: `Not exists banners in db`})

            return res.status(200).send(banners);
        })
}

//Controller function to Get Banners By Id
controller.getBannersById = (req, res) => {
    let id = req.params.id;

    Banner.findById(id)
        .populate(populateUserId)
        .exec((err, banner) => {
            //If banner not exists
            if(!banner) return res.status(404).send({status: 404, message: 'This resource not exists'});

            //If an error has ocurred
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

            return res.status(200).send(banner);
        });
}

//Controller function to get Banners By Resource ID
controller.getBannersByResourceId = (req, res) => {

    let skip = 0;
    let limit = 1000;
    let sortKey = 'registerDate';
    let sortOrder = 1;

    if(req.query.skip) {
        skip = parseInt(req.query.skip);
    }
    if(req.query.limit) {
        limit = parseInt(req.query.limit);
    }
    if(req.query.orderby) {
        sortKey = req.query.orderby;
    }
    if(req.query.order) {
        sortOrder = req.query.order;
    }

    let sort = {[sortKey]: sortOrder};

    let id = req.params.id;

    Banner.find({ on: id })
        .populate(populateUserId)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .exec((err, banners) => {
            //If an error has ocurred in server
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

            //If not exists banners in db
            if(!banners) return res.status(404).send({status: 404, message: `Not exists banners in db`})

            return res.status(200).send(banners);
        })
}

//Controller function to Create Banners
controller.createBanner = (req, res) => {
    //If not has required fields
    if(!req.body.title || !req.body.image || !req.body.on || !req.body.onSrc || !req.body.userId ) {
        return res.status(400).send({status: 400, message: 'Bad request'})
    }
    
    let banner = new Banner(req.body);

    banner.save((err, stored) => {
        if(err && err.code == 11000) return res.status(409).send({status: 409, message: `This resource alredy exists: ${err}`});

        if(err && err.code != 11000) return res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${err}`});

        return res.status(201).send(stored);
    });
}

//Controller function to Update Banners
controller.updateBanner = (req, res) => {
    let id = req.params.id;
    let update = req.body;

    Banner.findByIdAndUpdate(id, update, {new: true} , (err, banner) => {
        //If banner not exists
        if(!banner) return res.status(404).send({status: 404, message: 'This resource not exists'})

        //If banner exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        res.status(200).send(banner)
    });
}

//Controller function to Delete Banners
controller.deleteBanner = (req, res) => {
    Banner.findById(req.params.id, (err, banner) => {
        //If banner not exists
        if(!banner) return res.status(404).send({status: 404, message: 'This resource not exists'})

        //If banner exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        //Remove banner
        banner.remove((err) => {
            if(err) if(err) return res.status(500).send({status: 500, message: 'An error has ocurred removing this resource'});

            res.status(200).send({status: 200, message: 'Resource successfully removed'});
        });
    });  
}

module.exports = controller;