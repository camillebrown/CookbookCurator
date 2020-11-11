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
        res.render('recipes/recipes', {recipeArray: recipeArray})
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
        res.render('recipes/my-recipes', {recipes: user.recipes})
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
        db.user.findOne({
            where: {id: req.session.passport.user}
        }).then(user=>{
            user.addRecipe(recipe)
            console.log('User ' + user.name + ' favorited ' + recipe.name);
        })
    })
    res.redirect('/recipes/my-recipes')   
})    

// GET /recipe/:id - renders a show page with information about the recipe with the corresponding row id.
router.get('/:id',function(req, res) {
    db.recipe.findOne({
        where: {recipe_id: req.params.id},
        include: [db.comment]
    }).then(recipe=>{
        if (!recipe){
            console.log('THE RECIPE DOES NOT EXIST!!!!')
            let recipeId = req.params.id
            let recipeInfo = `https://api.spoonacular.com//recipes/${recipeId}/information?apiKey=${process.env.API_KEY}&addRecipeInformation=true&addRecipeNutrition=true`;
            axios.get(recipeInfo)
            .then(response=> {
                let recipeData = response.data
                res.render('recipes/show', {recipeData: recipeData})
            })
        } else {
            console.log(recipe.comments)
            let recipeInfo = `https://api.spoonacular.com//recipes/${recipe.recipe_id}/information?apiKey=${process.env.API_KEY}&addRecipeInformation=true&addRecipeNutrition=true`;
            axios.get(recipeInfo)
            .then(response=> {
                let recipeData = response.data
                res.render('recipes/show', {recipeData: recipeData})
            })
        }
    }).catch((error) => {
        console.log('THIS IS AN ERROR WITH THE PAGE !!! =>>>' + error)
    })
});


// POST /recipes/:id - create a new comment
router.post('/:id/comments', isLoggedIn, (req, res) => {
    // console.log('NOW IM TRYING TO SEE WHAT TO DO WITH THIS DAMN COMMENTT??!?!??!')
    db.recipe.findOrCreate({
        where:{recipe_id: req.body.recipeId},
        defaults: {
            name: req.body.recipeName,
            img_url: req.body.img_url
        }  
    }).then(([recipe, created])=>{
        // console.log('FOUND THE USER!!!!!!!!!')
        console.log('WAS RECIPE CREATED??? ==>>>>> ' + created)
        db.comment.create({
            name: req.body.name,
            content: req.body.content,
            recipeId: req.body.recipeId,
            userId: req.user.id
        }).then(comment => {
            console.log(comment.content + ' was added to recipe #' + recipe.recipe_id);
        }).catch((error) => {
            console.log('THIS IS AN ERROR WITH CREATING THE COMMENT' + error)
        })
    }).catch((error) => {
        console.log('THIS IS AN ERROR WITH FINDING OR CREATING THE RECIPE  ' + error)
    })
    res.redirect(`/recipes/${req.body.recipeId}`)
})  

module.exports = router