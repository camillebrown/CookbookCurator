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
router.get('/' , isLoggedIn, (req, res)=>{
    res.render('categories/home')
})

// get breakfast recipes
router.get('/breakfast' , isLoggedIn, (req, res)=>{
    axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY}&query=breakfast&number=16`)
    .then(response=> {
        let homeArray = response.data.results
        console.log(homeArray)
        res.render('categories/breakfast', {homeArray: homeArray})
        // console.log(req.session.passport.user)
    }).catch(function (error) {
        console.error(error);
    });
})

// get lunch recipes
router.get('/lunch', isLoggedIn, (req, res)=>{
    axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY}&query=lunch&number=16`)
    .then(response=> {
        let homeArray = response.data.results
        res.render('categories/lunch', {homeArray: homeArray})
        // console.log(req.session.passport.user)
    }).catch(function (error) {
        console.error(error);
    });
})

// get dinner recipes
router.get('/dinner', isLoggedIn, (req, res)=>{
    axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY}&query=dinner&number=16`)
    .then(response=> {
        let homeArray = response.data.results
        res.render('categories/dinner', {homeArray: homeArray})
        // console.log(req.session.passport.user)
    }).catch(function (error) {
        console.error(error);
    });
})

// get dessert recipes
router.get('/dessert', isLoggedIn, (req, res)=>{
    axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY}&query=dessert&number=16`)
    .then(response=> {
        let homeArray = response.data.results
        res.render('categories/dessert', {homeArray: homeArray})
        // console.log(req.session.passport.user)
    }).catch(function (error) {
        console.error(error);
    });
})

module.exports = router