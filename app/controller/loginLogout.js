const LoginLogout = require('../models/loginLogout')
module.exports = {
    //user registration
	userRegistration: (req, res) => {
		LoginLogout.userRegistration(req, res, (result) => {
			res.send(result);
		})
	},

    //login with email and password
	 userLogin: (req, res) => {
		LoginLogout.userLogin(req, res, (result) => {
			res.send(result);
		})
	},

	//update user details
	updateUserDetails: (req, res) => {
		LoginLogout.updateUserDetails(req, res, (result) => {
			res.send(result);
		})
	},

	//get user list
	getUserList: (req, res) => {
		LoginLogout.getUserList(req, res, (result) => {
			res.send(result);
		})
	},

	//search users
	searchUsers: (req, res) => {
		LoginLogout.searchUsers(req, res, (result) => {
			res.send(result);
		})
	},
}