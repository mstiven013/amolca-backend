'use strict'

const express = require('express');
const router = express.Router();

const Specialties = require('./SpecialtiesModel');
const SpecialtiesCtrl = require('./specialtiesController');

const auth = require('../auth/authMiddleware');

//Get all Authors
router.get('/', SpecialtiesCtrl.getSpecialties);

//Get one Specialty by ID
router.get('/:id', SpecialtiesCtrl.getSpecialtiesById)

//Get one Specialty by slug
router.get('/slug/:slug', SpecialtiesCtrl.getSpecialtiesBySlug)

//Get books by Specialty
router.get('/:id/books', SpecialtiesCtrl.getBooksBySpecialty)

//Create Author
router.post('/', SpecialtiesCtrl.createSpecialty);

//Delete an Author
router.delete('/:id', SpecialtiesCtrl.deleteSpecialty);

//Update Author
router.put('/:id', SpecialtiesCtrl.updateSpecialty);

module.exports = router;