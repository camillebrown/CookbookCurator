require('dotenv').config()
const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')
const session = require('express-session')
const passport = require('./config/ppConfig.js')
const flash = require ('connect-flash') // MUST GO AFTER THE SESSION MIDDLEWARE
const isLoggedIn = require('./middleware/isLoggedIn')

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
app.use('/auth', require('./controllers/auth.js'))

app.get('/', (req, res)=>{
    res.render('home')
})

app.get('/profile', isLoggedIn, (req, res) =>{
    // adding isLoggedIn ^ is an optional middleware parameter that tells the route that it's only an accessible route if that middleware parameter is met
    res.render('profile')
})

app.listen(process.env.PORT, ()=>{
    console.log("Keep your heart 3 stacks")
})
