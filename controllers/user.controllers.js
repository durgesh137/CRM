const { update } = require('../models/user.model');
const User = require('../models/user.model');
const objConverter = require('../utils/objConverter');

exports.findAllUsers = async (req,res) => {
    try{
    /**
     * validate the user is admin and the access token is valid, =>  done within the middleware
     * Here if request comes, then user is valid and is admin
     */
    const userId = req.userId;

    const queryParameter = {};
    if(req.query.userStatus != undefined){
        queryParameter.userStatus =  req. query.userStatus ;  
    }

    if(req.query.userType != undefined){
        queryParameter.userType = req.query.userType;
    }

    //fetch all users from database
    const users = await User.find(queryParameter);

    /**
     * These users contain password field as well, that field needs to be removed.
     * REMEBER: users is still in transient state, so deletion a password field from each user is not a correct choice
     */
    const allUsers = objConverter.convert(users);

   return  res.status(200).send(allUsers);
    }catch(err){
        console.log('Error while fetching all users ', err.message);
        return res.status(401).send({
            message : "Internal server error"
        })
    }
}

/**
 * Controller method to update the user record
 * 1. ADMIN and the owner himself
 */
exports.updateUser = async(req, res) => {
    try{
        /**
         * fetching the user if it exists
         */
        const user = await User.findOne({userId : req.params.id});

        if(!user){
            return res.status(404).send({
                message : "User to be updated does not exist"
            })
        }

        /**
         * Update the user object as per the request
         */
        user.name = req.body.name!= undefined ? req.body.name : user.name;
        user.email = req.body.email != undefined ? req.body.email : user.email;
        user.userStatus = req.body.userStatus != undefined ? req.body.userStatus : user.userStatus;
        user.userType = req.body.userType != undefined ? req.body.userType : user.userType; 

        /**
         * save the user object and return the updated object
         */
        const updatedUser = await user.save();
        return res.status(200).send({
            name : updatedUser.name,
            email : updatedUser.email,
            userId : updatedUser.userId,
            userType : updatedUser.userType,
            userStatus : updatedUser.userStatus
        })

    }catch(err){
        console.log('Error while updating the user : ', err.message)
        res.status(500).send({
            message : "Internal server error while updating the record"
        })
    }
}