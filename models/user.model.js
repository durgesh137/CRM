/**
 * Defining the user schema 
 */


const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    /**
     * fields schema should have:
     * => name, userId, email, password, userType, userStatus, createdAt,
     * updatedAt
     */
    name : {
        type : String,
        required : true,    
    },

    userId : {
        type : String,
        unique : true,
        required : true
    },

    email : {
        type : String,
        unique : true,
        required : true,
        minLength : 10,
        lowercase : true
    },

    password : {
        type : String,
        required : true
    },

    userType : {
        type : String,
        required : true,
        default : "CUSTOMER",
        enum : ['CUSTOMER', "ADMIN", "ENGINEER"]
    },

    userStatus : {
        type : String,
        required : true,
        default : "APPROVED",
        enum : ["PENDING", "APPROVED", "REJECTED"]
    },

    createdAt : {
        type : Date,
        default : () =>{
            return Date.now();
        },
        immutable : true
    },

    updatedAt : {
        type : Date,
        default : () => {
            return Date.now();
        }
    }
})

module.exports = mongoose.model('User', userSchema);
