const express = require('express')
const router = express.Router()
const axios = require("axios").default;
const db = require('../models');
router.use(express.urlencoded({extended: false}))
const isLoggedIn = require('../middleware/isLoggedIn')
const session = require('express-session')
const passport = require('../config/ppConfig.js');
const user = require('../models/user');


// GET /categories
// get recipes based on category
router.get('/', (req, res)=>{
    res.render('categories')
})



module.exports = router