const authController = require('../controllers/auth.controllers');


/**
 * This file handles different HTTP request related to authorization and authentication
 */

module.exports = (app) => {
    /**
     * 1. for signup
     * POST + /crm/api/v1/auth/signup
     */
    app.post('/crm/api/v1/auth/signup', authController.signup);
}