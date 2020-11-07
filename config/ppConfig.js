const passport = require('passport')
const db = require('../models')
//call it LocalStrategy even when using a different strategy
const LocalStrategy = require('passport-local')

// configure the strategy
//converts user object to id (bytes?)
passport.serializeUser((user, doneCallback)=>{
    console.log('serializing user...')
    doneCallback(null, user.id)
})

//converts id back to user object
passport.deserializeUser((id, doneCallback)=>{
    db.user.findByPk(id)
    .then(foundUser=>{
        console.log('deserializing user...')
        doneCallback(null, foundUser)
    })
    .catch(err=>{
        console.log('error deserializing user')
    })
})


/*
 This is Passport's strategy to provide local authentication. We provide the
 following information to the LocalStrategy:
 Configuration: An object of data to identify our authentication fields, the
 username and password
 Callback function: A function that's called to log the user in. We can pass
 the email and password to a database query, and return the appropriate
 information in the callback. Think of "doneCallback" as a function that'll later look
 like this:
 login(error, user) {
  // do stuff
 }
 We need to provide the error as the first argument, and the user as the
 second argument. We can provide "null" if there's no error, or "false" if
 there's no user.
*/

const findAndLogInUser = (email, password, doneCallback)=>{
    db.user.findOne({where: {email: email}}) // go check for a user in the db with that email
    .then(async foundUser=>{
        let match
        if(foundUser){
            match = await foundUser.validPassword(password)
        }
        if(!foundUser || !match){ // if user was not found or password is invalid
            return doneCallback(null, false) // send back 'false'
        } else { // user was legit
            return doneCallback(null, foundUser) // if found, send the found user object back
        }
    })
    .catch(err=>doneCallback(err)) // doneCallback takes two params: (error, userToBeLoggedIn)
}

const fieldsToCheck = {
    usernameField: 'email', // tells passport to look for an email instead of username
    passwordField: 'password'
}

const strategy = new LocalStrategy(fieldsToCheck, findAndLogInUser)

passport.use(strategy)

// node module we are creating needs the exports
module.exports = passport