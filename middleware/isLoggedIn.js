module.exports = (req, res, next) => {
    req.session.returnTo = req.originalUrl; 
    if(!req.user){ // if no one is logged in
        req.flash('error', 'You must be logged in to access that page.')
        res.redirect('/auth/login')
    } else { // someone is logged in currently
        next() // Keep doin what you're doin, Express. Everything looks good here!
    }
}
