'use strict'

const mongoose = require('mongoose');
const Coupon = require('./CouponsModel');

//Controller function to get ALL Coupons
async function getAllCoupons(req, res) {
    const Coupons = await Coupon.find();
    res.status(200).send(Coupons);
}

//Controller function to get ONE Coupon
function getOneCoupon(req, res) {
    Coupon.findById(req.params.id, (err, coupon) => {

        //If coupon not exists
        if(!coupon) return res.status(404).send({status: 404, message: 'This resource not exists'});

        //If an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`});

        return res.status(200).send(coupon);

    });
}

//Function to create ONE Coupon
function createCoupon(req, res) {
    if(!req.body.name || !req.body.discount || !req.body.code || !req.body.method || !req.body.restrictions.type || !req.body.restrictions.validResource) {
        return res.status(400).send({status: 400, message: 'Bad request'})
    }

    let coupon = new Coupon(req.body);

    coupon.save((err, couponStored) => {
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred saving this resource: ${err}`});

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
    getAllCoupons,
    getOneCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon
}