'use strict'

const express = require('express');
const router = express.Router();

const Specialties = require('./SpecialtiesModel');
const SpecialtiesCtrl = require('./specialtiesController');

const auth = require('../auth/authMiddleware');

//Get all Specialtys
router.get('/', SpecialtiesCtrl.getSpecialties);

//Get one Specialty by ID
router.get('/:id', SpecialtiesCtrl.getSpecialtiesById)

//Get one Specialty by slug
router.get('/slug/:slug', SpecialtiesCtrl.getSpecialtiesBySlug)

//Get books by Specialty
router.get('/:id/books', SpecialtiesCtrl.getBooksBySpecialty)

//Create Specialty
router.post('/', auth.isAuth, SpecialtiesCtrl.createSpecialty);

//Create Many Specialties
router.post('/many', auth.isAuth, SpecialtiesCtrl.createManySpecialties);

//Delete an Specialty
router.delete('/:id', auth.isAuth, SpecialtiesCtrl.deleteSpecialty);

//Update Specialty
router.put('/:id', auth.isAuth, SpecialtiesCtrl.updateSpecialty);

module.exports = router;