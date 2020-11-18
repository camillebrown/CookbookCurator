const express = require('express')
const router = express.Router()
const db = require('../models')
const passport = require('../config/ppConfig.js')

router.get('/signup', (req, res)=>{
    res.render('auth/signup')
})

router.post('/signup', (req, res)=>{
    console.log("Sign Up Form User Input: ", req.body)
    // check if the user already exists - if it does, throw an error message
    // otherwise create a new user and store them in the db

    db.user.findOrCreate({
        where: {
            email: req.body.email
        },
            defaults: {
              name: req.body.name,
              password: req.body.password  
            }
    }) // create new user if email wasn't found
    .then(([createdUser, wasCreated])=>{
        if(wasCreated){
            // console.log('Just created the following user: ', createdUser)
            // log the new user in
            passport.authenticate('local',{
                successRedirect: '/',
                successFlash: 'Account created and logged in!' // !-> FLASH <-!
            })(req, res) // IIFE = immediate invoked function
        } else {
            req.flash('error', 'email already exists, try logging in')
            res.redirect('/auth/login') // redirect to the login page
            // console.log('An account associated with that email address already exists. Try logging in again.')
        }
    })
    .catch(err=>{
        req.flash('error', err.message) // !-> FLASH <-!
        res.redirect('/auth/signup') // redirect to signup page so they can try again
        // console.log(`Did not post to db! See error>>`, err)
    })

    // redirect to login page
    // res.redirect('/auth/login')
})


router.get('/login', (req, res)=>{
    res.render('auth/login')
})

// router.post('/login', (req, res)=>{
//     console.log("Login Info Form User Input: ", req.body)
//     // // redirect to the home route
//     // res.redirect('/')
// })

router.post('/login', passport.authenticate('local', { // two parameters: what strategy are we using, 2) object for where to redirect
    failureRedirect: '/auth/login',
    successRedirect: '/',
    failureFlash: 'Invalid email or password!', // !-> FLASH <-!
    successFlash: 'Welcome back!' // !-> FLASH <-!
}))

router.get('/logout', (req, res)=>{
    req.logout()
    req.flash('success','Successfully logged out!') // !-> FLASH <-!
    res.redirect('/')
})

module.exports = router