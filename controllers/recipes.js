const express = require('express')
const router = express.Router()
const axios = require("axios").default;
const db = require('../models');
router.use(express.urlencoded({extended: false}))
const isLoggedIn = require('../middleware/isLoggedIn')
const session = require('express-session')
const passport = require('../config/ppConfig.js')

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

// GET Method
// Get all the fav movies
router.get('/my-recipes', (req, res)=>{
    db.user.findOne({
        where: {id: req.session.passport.user}
    }).then(user=>{
        user.getRecipes()
        .then(recipes=>{
            //do something with recipes
            recipes.forEach(recipe=>{
                // console.log(`${user.name}'s recipes:`)
                // console.log(recipe.title)
                res.render('my-recipes', {recipes: recipes})
            })
          })
      })
})

// POST /my-recipes - add favorited recipe to the database
router.post('/my-recipes', function(req, res) {
    //Get form data and add a new record to DB
    console.log('Form Data: ', req.body)
    db.recipe.findOrCreate({
        where:{
            name: req.body.name,
            img_url: req.body.img_url,
            recipe_id: req.body.recipe_id
        }
    }).then(([recipe, created])=>{
        console.log(`${recipe} was created? ${created}`)
        db.user.findOne({
            where: {id: req.session.passport.user}
        }).then(user=>{
            user.addRecipe(recipe)
            console.log('User ' + user.name + ' favorited ' + recipe.title);
        })
    })
    res.redirect('/recipes/my-recipes')
})    

module.exports = router