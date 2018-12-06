'use strict'

const express = require('express');
const router = express.Router();

const BannerCtrl = require('./bannersController');

const auth = require('../auth/authMiddleware');

//Get all Banners
router.get('/', BannerCtrl.getAllBanners);

//Get Banners by Id
router.get('/:id', BannerCtrl.getBannersById);

//Get Banners by Id
router.get('/resource/:id', BannerCtrl.getBannersByResourceId);

//Create Banner
router.post('/', auth.isAuth, BannerCtrl.createBanner);

//Update Banner
router.put('/:id', auth.isAuth, BannerCtrl.updateBanner);

//Delete an Banner
router.delete('/:id', auth.isAuth, BannerCtrl.deleteBanner);

module.exports = router;