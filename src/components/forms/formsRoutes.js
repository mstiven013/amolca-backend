'use strict'

const express = require('express');
const router = express.Router();

const Form = require('./formsModel');
const FormCtrl = require('./formsController');

const auth = require('../auth/authMiddleware');

//Get all Forms
router.get('/', FormCtrl.getAllForms);

//Get Forms by id
router.get('/:id', FormCtrl.getFormsById);

//Create Form
router.post('/', auth.isAuth, FormCtrl.createForm);

//Delete an Form
router.delete('/:id', auth.isAuth, FormCtrl.deleteForm);

//Update Form
router.put('/:id', auth.isAuth, FormCtrl.updateForm);

module.exports = router;