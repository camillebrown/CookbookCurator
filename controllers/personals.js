const express = require('express')
const router = express.Router()
const db = require('../models');
router.use(express.urlencoded({extended: false}))
const isLoggedIn = require('../middleware/isLoggedIn')
var methodOverride = require('method-override');

router.use(methodOverride('_method'));

// GET Method /personals - Get all the personal recipes
// ----> PERSONALS: GET ALL ROUTE <------
router.get('/', isLoggedIn, (req, res)=>{
    db.user.findOne({
        where: {id: req.session.passport.user},
    }).then(user=>{
        console.error('FOUND THE USER')
        user.getPersonals()
        .then(personals=>{
            console.error('FOUND THE USER AND THEIR PERSONALS');
            res.render('personals/personals-home', {personalRecipes: personals, user: req.user})
        })
    }).catch(function (error) {
        console.error('GETTING AN ERROR WHEN TRYING TO GET THE USERS RECIPES!!!! ===>' + error);
    });
})    

// GET /personals - Get information about the personal with the corresponding id.
// ----> PERSONALS: GET ROUTE <------
router.get('/show/:id', isLoggedIn, (req, res) => {
    db.personal.findOne({
        where: {id: req.params.id},
    }).then(personal=>{
        var ingString = personal.ingredients
        var ingArray = ingString.split('+');
        var insString = personal.instructions
        var insArray = insString.split('+');
        res.render('personals/personals-show', {personal: personal, ingArray: ingArray, insArray: insArray})   
    }).catch(function (error) {
        console.error('COULDNT ADD PERSONAL TO USER!!!! ===>' + error);
    });
})    

// POST /personals - Create a new personal recipe & add to the database
// ----> PERSONALS: POST ROUTE <------
router.post('/show/:id', isLoggedIn, (req, res) => {
    console.log(req.body)
    db.personal.create({
        name: req.body.name,
        img_url: req.body.img_url,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        userId: req.user.id
    }).then(personal=>{
        console.error('CREATED A PERSONAL!');
        db.user.findOne({
            where: {id: req.session.passport.user}
        }).then(user=>{
            user.addPersonal(personal)
            console.log('USER ' + user.name + ' CREATED A NEW PERSONAL CALLED ' + personal.name);
        }).catch(function (error) {
            console.error('COULDNT ADD PERSONAL TO USER!!!! ===>' + error);
        });
        console.log('TRYING TO ROUTE TO SHOW PAGE')
        res.redirect(`/personals/show/${personal.id}`)
    }).catch(function (error) {
        console.error('GETTING AN ERROR WHEN TRYING TO CREATE A NEW PERSONAL!!!! ===>' + error);
    });
})    


// DELETE /personals/:id - Delete personal from the database
// ----> PERSONALS: DELETE ROUTE <------
router.delete('/:id', isLoggedIn, (req, res)=>{
    console.log('YOURE TRYING TO DELETE A PERSONAL NOW');
    db.personal.destroy({
        where: {id: req.body.id},
        include: [db.user]
    }).then(numRowsDeleted=>{
        console.log(`YOU DELETED A PERSONAL!!!! and this is the number of rows gone ====>>>>` + numRowsDeleted)
        res.redirect(`/personals`)
    })
})  

// PUT /recipes/:id - update a personal and update the recipe/:id page
// ----> PERSONALS: PUT ROUTE <------
router.put('/show/:id', isLoggedIn, (req, res) => {
    console.log('YOURE TRYING TO EDIT A PERSONAL NOW');
    db.personal.update({ 
        name: req.body.name,
        img_url: req.body.img_url,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
    },
        { where: { id: req.body.id }
    }).then(rowsUpdated => {
            console.log('I JUST UPDATED A PERSONAL, DID YOU SEE IT?!??!???!' + rowsUpdated);
    }).catch((error) => {
            console.log('THIS IS AN ERROR WITH UPDATING THE PERSONAL' + error)
    })
    res.redirect(`/personals/show/${req.body.id}`)
})  


router.get('/edit/:id', isLoggedIn, (req, res) => {
    console.log('YOUVE REQUESTED TO EDIT A PERSONAL !!');
    db.personal.findOne({
        where: {id: req.params.id}
    }).then(foundPersonal=>{
        res.render('personals/personals-edit', {personal: foundPersonal, user: req.user})
    })
})

//GET Method /personals/new - Create a new personal recipe
router.get('/new', isLoggedIn, (req, res)=>{
    res.render('personals/personals-new', {user: req.user})
})

module.exports = router