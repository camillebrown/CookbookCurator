const express = require('express')
const router = express.Router()
const axios = require("axios").default;
const db = require('../models');
router.use(express.urlencoded({extended: false}))
const isLoggedIn = require('../middleware/isLoggedIn')
const session = require('express-session')
const passport = require('../config/ppConfig.js');
const user = require('../models/user');
var methodOverride = require('method-override');

router.use(methodOverride('_method'));

// GET Method /recipes - Get all the search recipes
// ----> SEARCH: GET ALL ROUTE <------
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

// GET Method /recipe/my-recipes - Get all the fav recipes
// ----> MY RECIPES: GET ALL ROUTE <------
router.get('/my-recipes', isLoggedIn, (req, res)=>{
    db.user.findOne({
        where: {id: req.session.passport.user},
        include: [db.recipe]
    }).then(user=>{
        res.render('recipes/my-recipes', {recipes: user.recipes})
    }).catch(function (error) {
        console.error('GETTING AN ERROR WHEN TRYING TO GET THE USERS RECIPES!!!! ===>' + error);
    });
})  

// POST /recipe/my-recipes - Add favorited recipe to the database and post to my-recipes page
// ----> MY RECIPES: POST ROUTE <------
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
        res.redirect('/recipes/my-recipes')   
    })
})    

// DELETE /recipe/my-recipes/:id - Delete favorited recipe from the database and update my-recipes page
// ----> MY RECIPES: DELETE ROUTE <------
router.delete('/my-recipes/:id', isLoggedIn, (req, res)=>{
    console.log('YOURE TRYING TO DELETE A FAV RECIPE REALLY BAD');
    db.recipe.destroy({
        where: {recipe_id: req.params.id},
        include: [db.user]
    }).then(numRowsDeleted=>{
        console.log('YOU DELETED A RECIPE!!!! and this is the number of rows gone ====>>>>' + numRowsDeleted)
        res.redirect('/recipes/my-recipes')
    })
})          

// GET /recipe/:id - Get information about the recipe with the corresponding row id.
// ----> COMMENT: GET ROUTE <------
router.get('/:id',function(req, res) {
    db.recipe.findOne({
        where: {recipe_id: req.params.id},
        include: [db.user, db.comment]
    }).then(recipe=>{
        if (!recipe){
            console.log('THE RECIPE DOES NOT EXIST!!!!')
            let recipeId = req.params.id
            let recipeInfo = `https://api.spoonacular.com//recipes/${recipeId}/information?apiKey=${process.env.API_KEY}&addRecipeInformation=true&addRecipeNutrition=true`;
            axios.get(recipeInfo)
            .then(response=> {
                let recipeData = response.data
                res.render('recipes/show', {recipeData: recipeData, recipeComments: [], recipeId: recipeId})
            })
        } else {
            console.log('THE RECIPE DOES EXIST!!!!')
            let recipeInfo = `https://api.spoonacular.com//recipes/${recipe.recipe_id}/information?apiKey=${process.env.API_KEY}&addRecipeInformation=true&addRecipeNutrition=true`;
            axios.get(recipeInfo)
            .then(response=> {
                let recipeData = response.data
                res.render('recipes/show', {recipeData: recipeData, recipeComments: recipe.comments, recipeId: req.params.id})
            })
        }
    }).catch((error) => {
        console.log('THIS IS AN ERROR WITH THE PAGE !!! =>>>' + error)
    })
});

// DELETE /recipe/:id - Delete comment from the database and update recipe/:id page
// ----> COMMENT: DELETE ROUTE <------
router.delete('/:id', isLoggedIn, (req, res)=>{
    console.log('YOURE TRYING TO DELETE A COMMENT NOW');
    db.comment.destroy({
        where: {content: req.body.content},
        include: [db.user, db.recipe]
    }).then(numRowsDeleted=>{
        console.log('YOU DELETED A COMMENT!!!! and this is the number of rows gone ====>>>>' + numRowsDeleted)
        res.redirect(`/recipes/${req.body.recipeId}`)
    })
})    


// POST /recipes/:id - create a new comment and add to recipe/:id page
// ----> COMMENT: POST ROUTE <------
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
            recipe.addComment(comment)
            console.log(comment.content + ' was added to recipe #' + recipe.recipe_id);
        }).catch((error) => {
            console.log('THIS IS AN ERROR WITH CREATING THE COMMENT' + error)
        })
    }).catch((error) => {
        console.log('THIS IS AN ERROR WITH FINDING OR CREATING THE RECIPE  ' + error)
    })
    res.redirect(`/recipes/${req.body.recipeId}`)
})  

// PUT /recipes/:id - update a comment and update the recipe/:id page
// ----> COMMENT: PUT ROUTE <------
router.put('/:id', isLoggedIn, (req, res) => {
    console.log('YOURE TRYING TO EDIT A COMMENT NOW');
    db.comment.update(
        { content: req.body.content },
        { where: { id: req.body.commentId }
    }).then(rowsUpdated => {
            console.log('I JUST UPDATED A COMMENT, DID YOU SEE IT?!??!???!' + rowsUpdated);
    }).catch((error) => {
            console.log('THIS IS AN ERROR WITH UPDATING THE COMMENT' + error)
    })
    res.redirect(`/recipes/${req.body.recipeId}`)
})  

module.exports = router