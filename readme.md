 # Express Auth Boilerplate

 * create a node app
 * .gitignore (include node_modules)
 * install and set up express (npm i express)
 * test by setting up a home route and console.log for your port
 * create a controllers folder and add auth.js
 * set up controllers middleware
 * within the controller, set up the router and middleware (```module.exports = router```)
 * set up ejs and ejsLayouts along with their middleware
 * create forms on both the signup + login pages (POST methods to match the post routes)
 * use req.body to collect the inputted data
 * NEED body parser middleware (```app.use(express.urlencoded({extended: false}))```)
 * install sequelize - start with npm i sequelize pg
 * initialize sequelize - sequelize init
 * adjust your config file
 * create a database (sequelize db:create [NAME OF DATABASE])
 * create a model within the database (sequelize model:create --name --attributes)
 * migrate the new model (sequelize db:migrate)
 * require model (```const db = require('...models')```) in auth controllers
 * set up sign up post route in auth controllers
 * add authentication object in user.js
 * update sign up post route 



# adding sequelize validations