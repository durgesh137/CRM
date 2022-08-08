# CRM
Backend of customer relationship management involving engineers, admin, and customer.

1. Connecting to mongodb database
Mongodb should be locally installed, we are using the local db here
Dependencies required: mongoose ODM tool, 
express for the managing complete application, like starting server

mongodb path:
C:\Program Files\MongoDB\Server\5.0\bin
to check created database details 

2. create user.model.js in models folder
initially fields are-
userId, name, email, password, userType, userStatus, createdAt, updatedAt
define type, constraints, then export the schema


3. First user needs to sign up
=>create auth.controller.js in controllers folder


=> user.route.js in routes folder
imports  auth.controller to call the signup method

=> in server.js
body-parser for interconversion of JS and JSON
bcryptjs for encrypting password field prior to storage in database

plug the auth.route.js in server.js
require('./routes/auth.route')(app);

Now use POSTMAN as end client
send the request on signup uri

2. User needs to login
user.module already there
In auth.controller, create signin method for POST request
=> After validating userId and password, the access token needs to be generated for that JWT needs to be installed a dependency, JSONWebtoken    
In auth.route, define the method for signin uri
this auth.route is already plugged in server.

3. As ADMIN user, fetch all users from the database
=> user.module there
=> Make middleware to validate the access token and check if the user trying to fetch all users is an ADMIN
=> For validating token, the format is
jwt.verify(accessToken, authConfig.SECRET, (err, decoded) => {
    under this if any error does not occur, then decoded.id gives the userId
=> within controller, user.controller.js, define function findAllUsers, to provide all the users as response
=> in user.route.js, chain the middleware with URI of /crm/api/v1/users as
app.get('/crm/api/v1/users',[jwtValidate.isValidToken, jwtValidate.isAdmin], userController.findAllUsers)
=> Further plug the user.routes.js in server.js

Different versions of 3rd one
================================
A). find all approved users as an ADMIN
=> the userStatus = APPROVED, would accessed as req.query.userStatus, just modify the find criteria to work when the query parameter is given or not given.

B). find all users based on given userType
=> userType = ADMIN

4. Updating a user record
Either the admin or the owner of user should be allowed to do it.
