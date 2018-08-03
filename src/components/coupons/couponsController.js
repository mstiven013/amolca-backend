'use strict'

const mongoose = require('mongoose');
const Coupon = require('./CouponsModel');

//Controller function to get ALL Coupons
async function getCoupons(req, res) {

    let searchby = req.query.searchby;

    if(searchby) {

        //Controller function to get ONE Coupon by ID
        if(searchby == 'id') {
            Coupon.findById(req.query.id, (err, coupon) => {
                //If coupon not exists
                if(!coupon) return res.status(404).send({status: 404, message: 'This resource not exists'});
        
                //If an error has ocurred
                if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});
        
                return res.status(200).send(coupon);
            });
        }

        //Controller function to get ONE Coupon by CODE
        if(searchby == 'code') {
            Coupon.findOne({ code: req.query.code })
                .exec((err, coupon) => {
                    //If coupon not exists
                    if(!coupon) return res.status(404).send({status: 404, message: 'This resource not exists'});

                    //If an error has ocurred
                    if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

                    return res.status(200).send(coupon);
                });
        }

        //Controller function to get ONE Coupon by USER
        if(searchby == 'user') {
            Coupon.find({ "userId": req.query.id })
                .exec((err, coupons) => {
                    //If coupons not exists
                    if(!coupons || coupons.length < 1) return res.status(404).send({status: 404, message: 'This user not have coupons registered'});

                    //If an error has ocurred
                    if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

                    return res.status(200).send({"coupons": coupons, "count": coupons.length});
                });
        }

    } else {
        Coupon.find()
            .exec((err, coupons) => {
                if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

                return res.status(200).send({"coupons": coupons, "count": coupons.length});
            });
    }
}

//Function to create ONE Coupon
function createCoupon(req, res) {
    if(!req.body.name || !req.body.discount || !req.body.code || !req.body.method || !req.body.restrictions.type || !req.body.restrictions.validResource) {
        return res.status(400).send({status: 400, message: 'Bad request'})
    }

    let coupon = new Coupon(req.body);

    coupon.save((err, couponStored) => {
        if(err && err.code == 11000) return res.status(409).send({status: 409, message: `This resource alredy exists`});

        if(err && err.code != 11000) return res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${err}`});

        return res.status(201).send(couponStored);
    });
}

//Controller function to update ONE Coupon
function updateCoupon(req, res) {
    let couponId = req.params.id;
    let update = req.body;

    Coupon.findByIdAndUpdate(couponId, update, {new: true} , (err, coupon) => {
        //If coupon not exists
        if(!coupon) return res.status(404).send({status: 404, message: 'This resource not exists'})

        //If coupon exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        res.status(200).send(coupon)
    });
}

//Controller function to delete ONE Coupon
function deleteCoupon(req, res) {
    Coupon.findById(req.params.id, (err, coupon) => {
        //If coupon not exists
        if(!coupon) return res.status(404).send({status: 404, message: 'This resource not exists'})

        //If coupon exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        //Remove coupon
        coupon.remove((err) => {
            if(err) if(err) return res.status(500).send({status: 500, message: 'An error has ocurred removing this resource'});

            res.status(200).send({status: 200, message: 'Resource successfully removed'});
        });
    });
}

module.exports = {
    getCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon
}