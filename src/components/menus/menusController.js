'use strict'

const mongoose = require('mongoose');
const Menu = require('./MenusModel');

//"User" Populate var
const populateUserId = { 
    path: 'userId', 
    select: '-__v -signupDate -products -posts -role'
};

//Controller function to get all menus
async function getAllMenus(req, res) {

    let limit = 100000;
    let sortKey = 'name';
    let sortOrder = 1;

    if(req.query.limit) {
        limit = parseInt(req.query.limit);
    }
    if(req.query.orderby) {
        sortKey = req.query.orderby;
    }
    if(req.query.order) {
        sortOrder = req.query.order;
    }

    let sort = {[sortKey]: sortOrder};

    Menu.find()
        .populate(populateUserId)
        .limit(limit)
        .sort(sort)
        .exec( (err, menus) => {

            //If an error has ocurred in server
            if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

            //If not exists menus
            if(!menus) return res.status(404).send({ status: 404, message: 'Not exists menus in db' })

            return res.status(200).send(menus);

        })
}