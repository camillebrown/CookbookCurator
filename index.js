require('dotenv').config()
const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')
const session = require('express-session')
const passport = require('./config/ppConfig.js')
const flash = require('connect-flash') // MUST GO AFTER THE SESSION MIDDLEWARE
const isLoggedIn = require('./middleware/isLoggedIn')
app.use(express.static('public'))
const axios = require("axios").default;
const db = require('./models');

// set ejs and ejs layouts
app.set('view engine', 'ejs')
app.use(ejsLayouts)

//body parser middleware (this makes req.body work)
app.use(express.urlencoded({extended: false}))

//set up session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

// set up passport middleware
app.use(passport.initialize())
app.use(passport.session())

//set up flash middleware
app.use(flash())

// CUSTOM MIDDLEWARE
app.use((req, res, next) => {
    // before every route, attach the flash messages and current user to the res.locals
    // this will give us access to these values in all our ejs pages
    res.locals.alerts = req.flash()
    res.locals.currentUser = req.user
    next() // move on to the next piece of middleware
})

// controllers middleware
app.use('/auth', require('./controllers/auth.js'));
app.use('/recipes', require('./controllers/recipes.js'))

app.get('/', (req, res)=>{
    axios.get(`https://api.spoonacular.com/recipes/random?apiKey=${process.env.API_KEY}&number=3&type=main%20course`)
    .then(response=> {
        let homeArray = response.data.recipes
        res.render('home', {homeArray: homeArray})
        homeArray.forEach(item=>{
            console.log(item.dishTypes)
        })
        console.log(req.session.passport.user)
    }).catch(function (error) {
        console.error(error);
    });
    
})

app.get('/about', (req, res)=>{
    res.render('about')
})

app.get('/categories', isLoggedIn, (req, res)=>{
    res.render('categories')
})

app.get('/profile', isLoggedIn, (req, res) =>{
    // adding isLoggedIn ^ is an optional middleware parameter that tells the route that it's only an accessible route if that middleware parameter is met
    res.render('profile')
})

app.listen(process.env.PORT, ()=>{
    console.log(`You're now listening to the smooth sounds of port ${process.env.PORT}`)
})
