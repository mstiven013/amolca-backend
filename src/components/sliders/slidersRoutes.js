'use strict'

const express = require('express');
const router = express.Router();

const Sliders = require('./slidersModel');
const SlidersCtrl = require('./slidersController');

const auth = require('../auth/authMiddleware');

//Route to get all Sliders
router.get('/', SlidersCtrl.getAllSliders);

//Route to get one Order by ID
router.get('/:id', SlidersCtrl.getSlidersById);

//Route to get one Order by Slug
router.get('/:id', SlidersCtrl.getSlidersBySlug);

//Route to create one Order
router.post('/', auth.isAuth, SlidersCtrl.createSlider);

//Route to update one Order
router.put('/:id', auth.isAuth, SlidersCtrl.updateSlider);

//Route to delete one Order
router.delete('/:id', auth.isAuth, SlidersCtrl.deleteSlider);

module.exports = router;