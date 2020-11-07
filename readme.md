 # Express Auth Boilerplate
<!-- 
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
 * update sign up post route  -->

## How to Set Up:
1. Fork & Clone
2. Install dependencies
```
npm i
```
3. Create a `config.json` with the following code:
```json
{
  "development": {
    "database": "<insert db name here>_dev",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "database": "<insert db name here>_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "database": "<insert db name here>_production",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```
**Note:** If your database requires a username and password, you'll need to include these fields as well.

4. Create a database
```
sequelize db:create <insert db name here>
```

5. Migrate the `user` model to your database
```
sequelize db:migrate
```
6. Add a `SESSION_SECRET` and `PORT` environment variables in a `.env` file (can be any string)

7. Run `nodemon`