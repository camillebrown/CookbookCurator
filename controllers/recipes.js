const express = require('express')
const router = express.Router()
const axios = require("axios").default;
const db = require('../models');
router.use(express.urlencoded({extended: false}))
const isLoggedIn = require('../middleware/isLoggedIn')
const session = require('express-session')
const passport = require('../config/ppConfig.js');
const user = require('../models/user');

// GET Method
// Get all the search recipes
router.get('/', isLoggedIn, (req, res)=>{
    let recipe = req.query.recipe
    axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY}&query=${recipe}&number=16&instructionsRequired=true&addRecipeInformation=true&addRecipeNutrition=true&sort=popularity&sortDirection=desc`)
    .then(response=> {
        let recipeArray = response.data.results
        res.render('recipes', {recipeArray: recipeArray})
    }).catch(function (error) {
        console.error(error);
    });
    // console.log(req.session.passport.user)
})

// GET Method /my-recipes
// Get all the fav recipes
router.get('/my-recipes', isLoggedIn, (req, res)=>{
    db.user.findOne({
        where: {id: req.session.passport.user},
        include: [db.recipe]
    }).then(user=>{
        user.recipes.forEach(function(recipe) {
            console.log(`${user} has recipes ${recipe.name}`)
        })
        res.render('my-recipes', {recipes: user.recipes})
    }).catch(function (error) {
        console.error(error);
    });
})  

// POST /my-recipes
// Add favorited recipe to the database and post to my-recipes page
router.post('/my-recipes', isLoggedIn, (req, res) => {
    //Get form data and add a new record to DB
    console.log('Form Data: ', req.body)
    db.recipe.findOrCreate({
        where: {
            name: req.body.name,
            img_url: req.body.img_url,
            recipe_id: req.body.recipe_id,
        }
    }).then(([recipe, created])=>{
        console.log(`${recipe} was created????????? =  ${created}`)
        db.user.findOne({
            where: {id: req.session.passport.user}
        }).then(user=>{
            user.addRecipe(recipe)
            console.log('User ' + user.name + ' favorited ' + recipe.name);
        })
    })
    res.redirect('/recipes/my-recipes')   
})    

// GET /categories
// get recipes based on category
router.get('/categories', isLoggedIn, (req, res)=>{
    res.render('categories')
})

module.exports = router