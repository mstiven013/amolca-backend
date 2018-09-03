'use strict'

const express = require('express');
const router = express.Router();

const Coupon = require('./CouponsModel');
const CouponCtrl = require('./couponsController');

const auth = require('../auth/authMiddleware');

//Get all Coupons
router.get('/', CouponCtrl.getCoupons);

//Create Coupon
router.post('/', CouponCtrl.createCoupon);

//Delete one Coupon
router.delete('/:id', auth.isAuth, CouponCtrl.deleteCoupon);

//Update Coupon
router.put('/:id', auth.isAuth, CouponCtrl.updateCoupon);

module.exports = router;