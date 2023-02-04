const LoginLogout = require('../controller/loginLogout')
const validationMiddleware = require('../middelware/validators/loginLogout')
const { logoutUser } = require('../middelware/validators/userLogout')
const { authenticateUserToken } = require('../middelware/authentication')
module.exports = function (app) {

    //user registration
    app.post('/apis/user', validationMiddleware.userRegistration, (req, res) => {
        LoginLogout.userRegistration(req, res);
    });

    //login with email and password
    app.post('/apis/user/auth', validationMiddleware.userLogin, (req, res) => {
        LoginLogout.userLogin(req, res);
    });

     //update user details
     app.put('/apis/user', authenticateUserToken, validationMiddleware.updateUserDetails, (req, res) => {
        LoginLogout.updateUserDetails(req, res);
    });

    //Get User List using pagination
    app.get('/apis/users/:pageNo/:pageSize', authenticateUserToken, (req, res) => {
        LoginLogout.getUserList(req, res);
    });

    //Search Users
    app.get('/apis/search/users/:search_text', authenticateUserToken, (req, res) => {
        LoginLogout.searchUsers(req, res);
    });

    //logout  withauthantication token 
    app.put('/apis/user/auth', authenticateUserToken, logoutUser);

}