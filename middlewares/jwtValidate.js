const jwt = require("jsonwebtoken");
const authConfig = require('../configs/auth.config');
const User = require('../models/user.model');

exports.isValidToken = (req, res, next) => {
    /**
     * Read the access token from request headers
     */
    const accessToken = req.headers['x-access-token']

    //acces token not there
    if(!accessToken){
        // response returned
        return res.status(403).send({
            message : "No token provided"
        })
    }


    /**
     * validate token using jwt
     * => token is given
    */
    jwt.verify(accessToken, authConfig.SECRET, (err, decoded) => {
        if(err){
            return res.status(410).send({
                message : "Token is invalid"
            })
        }
        //otherwise valid one
        console.log('Token is valid one ',decoded.id)
        //fetch request id from decode and set in request
        req.userId = decoded.id;
        /**
         * move to next one
         */
        next();
    })

}

exports.isAdmin = async (req, res, next) => {
    /**
     * extra user id from req
     */
    // const userIdFromReq = req.userId;

    //fetch user from database 
    const callingUser = await User.findOne({userId : req.userId});
    console.log(callingUser);
    if(!callingUser){
        return res.status(401).send({
            message :" Specified user id is invalid "
        })
    }
    //user is valid, check if it is admin
    console.log(callingUser);
    if( callingUser.userType == 'ADMIN'){
        next();
    }else{
        return res.status(500).send({
            message : "User is not ADMIN"
        })
    }
}

/**
 * function to check if the requesting user is an ADMIN or the Owner himself
 */
exports.isAdminOrOwner = async(req, res, next) => {
    /**
     * find the associated user having userId present in req
     */
    const requestingUser = await User.findOne({userId : req.userId});

    if(requestingUser.userType == 'ADMIN' || requestingUser.userId == req.params.id){
        next();
    }else{
        res.status(403).send({
            message : "Only ADMIN or OWNER of the resource is allowed to update"
        })
    }
}