const bcrypt = require('bcryptjs')
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const authConfig = require('../configs/auth.config');

exports.signup = async (req, res) => {
    try{
        /**
         * 1. Read the user details from POST request
         * /crm/api/v1/auth/signup
         * 
         * user details will in body of the request
        */
        const userDetailsFromReq = {
            name : req.body.name,
            email : req.body.email,
            userId : req.body.userId,
            //password should be stored in encrypted form
            //use bcrypt js for that
            password : bcrypt.hashSync(req.body.password, 8),
            userType : req.body.userType
        }

        //setting user status
        if(!userDetailsFromReq.userType || userDetailsFromReq.userType === 'CUSTOMER'){
            userDetailsFromReq.userStatus = 'APPROVED'
        }else{
            userDetailsFromReq.userStatus = 'PENDING'
        }
        /**
         * 2. saved user in database
         * => create method returns a Promise, a futurisitic event so use async-await here
         */
        const savedUser = await User.create(userDetailsFromReq);

        /**
         * password should not be sent as part of response
         * Also savedUser right now is in transitent state, if we try to delete the password field from savedUser, it will remove password field from database as well.
         * So create a new response
         */
        const postResponse = {
            name : savedUser.name,
            userId : savedUser.userId,
            email : savedUser.email,
            //password : savedUser.password, SECURITY ISSUE
            userStatus: savedUser.userStatus,
            userType: savedUser.userType,
            createdAt : savedUser.createdAt,
            updatedAt : savedUser.updatedAt
        }
        

        /**
         * 3. Send response
        */
        res.status(201).send(postResponse);
    }catch(err){
          console.log('Error occured while saving user : ',err.message);
          res.status(500).send({
            message : 'Internal Server Error while saving user'
          }); 
    }
}

exports.signin = async (req, res) => {

    try{
        /**
         * POST + /crm/api/v1/auth/signin
         * 
         */
        const userIdFromReq = req.body.userId;
        const passwordFromReq = req.body.password;

        /**
         * Find the user having specified Id
         * findOne returns promise, so use async-await here
         */
        const userObtained  = await User.findOne({userId : userIdFromReq});

        if(!userObtained){
            return res.status(401).send({
                message : "User with specified Id does not exist"
            })
        }

        /**
         * validate the password
        */
        const validPassword = bcrypt.compareSync(passwordFromReq, userObtained.password);

        if(!validPassword){
            return res.status(401).send({
                message : "Incorrect password !"
            })
        }

        /**
         * Only approved user can login
         */
        if(userObtained.userStatus != 'APPROVED'){
            return res.status(403).send({
                message : "User is not approved for the login"
            })
        }

        //both userId and password are valid, so the access token needs to be given as the response using jsonwebtoken, jwt
        const token = jwt.sign({
            id : userObtained.userId
        },authConfig.SECRET,{
            //specify time to live in seconds
            expiresIn : 600
        })

        /**
         * send response now
         * => excluding password and include token
        */
        const postResponse = {
            name : userObtained.name,
            userId : userObtained.userId,
            email : userObtained.email,
            userStatus : userObtained.userStatus,
            accessToken : token
        }

        //send response with access token
        res.status(200).send(postResponse);
    }catch(err){
        console.log('Unable to login ', err.message);
        res.status(500).send({
            message : "Internal server error"
        })
    }

}