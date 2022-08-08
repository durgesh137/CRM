
exports.convert = (users) => {
    /**
     * These users contain password field as well, that field needs to be removed.
     */
         const allUsers = [];
         users.forEach((user) => {
             allUsers.push({
                 name : user.name,
                 userId : user.userId,
                 email : user.email,
                 userStatus : user.userStatus,
                 userType : user.userType,
                 createdAt : user.createdAt,
                 updatedAt : user.updatedAt
             })
         })
        return allUsers; 
}