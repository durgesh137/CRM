
const userController = require('../controllers/user.controllers');
const jwtValidate = require('../middlewares/jwtValidate');

module.exports = (app) => {
    /**
     * GET + /crm/api/v1/users
     */
    app.get('/crm/api/v1/users',[jwtValidate.isValidToken, jwtValidate.isAdmin], userController.findAllUsers)

    /**
     * Updating the user having the given user id
     * PUT + '/crm/api/v1/users/:id
     * => path parameter
     * => middleware chaining, first token validated, then userType is checked
     */
    app.put('/crm/api/v1/users/:id', [jwtValidate.isValidToken,  jwtValidate.isAdminOrOwner],userController.updateUser)
}