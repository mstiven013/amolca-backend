'use strict'

const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerConfig = require('./multerConfig');

router.post('/', multer(multerConfig).single('photo'), (req, res) => {
    console.log('Full path', __dirname + req.file.path)
    console.log(req.file)
    res.send('Complete!')
})

module.exports = router;