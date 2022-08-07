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