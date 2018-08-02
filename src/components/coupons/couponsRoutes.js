'use strict'

const express = require('express');
const router = express.Router();

const Coupon = require('./CouponsModel');
const CouponCtrl = require('./couponsController');

//Get all Coupons
router.get('/', CouponCtrl.getAllCoupons);

//Get one Coupon by Id
router.get('/:id', CouponCtrl.getOneCouponById);

//Get one Coupon by code
router.get('/code/:code', CouponCtrl.getOneCouponByCode);

//Get one Coupon by user
router.get('/user/:user', CouponCtrl.getOneCouponByUser);

//Create Coupon
router.post('/', CouponCtrl.createCoupon);

//Delete one Coupon
router.delete('/:id', CouponCtrl.deleteCoupon);

//Update Coupon
router.put('/:id', CouponCtrl.updateCoupon);

module.exports = router;