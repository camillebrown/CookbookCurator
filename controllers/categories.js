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
    res.render('categories/home')
})

// get breakfast recipes
router.get('/breakfast', (req, res)=>{
    axios.get(`https://api.spoonacular.com/recipes/random?apiKey=${process.env.API_KEY}&number=10&type=breakfast`)
    .then(response=> {
        let homeArray = response.data.recipes
        res.render('categories/breakfast', {homeArray: homeArray})
        // console.log(req.session.passport.user)
    }).catch(function (error) {
        console.error(error);
    });
})

// GET /categories
// get recipes based on category
router.get('/lunch', (req, res)=>{
    res.render('categories/lunch')
})

// GET /categories
// get recipes based on category
router.get('/dinner', (req, res)=>{
    res.render('categories/dinner')
})

// GET /categories
// get recipes based on category
router.get('/dessert', (req, res)=>{
    res.render('categories/dessert')
})

module.exports = router