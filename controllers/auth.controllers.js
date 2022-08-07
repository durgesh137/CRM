const bcrypt = require('bcryptjs')
const User = require('../models/user.model');

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
            userStatus : req.body.userStatus,
            userType : req.body.userType
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