const Config = require('../../config');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { errResponse, successResponse } = require('../messages/errorResponses')
const Users = require('../services/loginLogout')
const randomToken = require('random-token')
const messages = require('../messages/commonMessages')
const enums = require('../utils/enums')
var bcrypt = require('bcrypt');
const { statusCodes } = require('../utils/enums');

function generateOtpToken() {
    randomToken.create('abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
    return randomToken(16);
};

function generateAccessToken(user) {
    return jwt.sign(user, Config.ACCESS_TOKEN_SECRET)
};

module.exports = {

    //user registration
    userRegistration: async (req, res, result) => {
        var first_name = req.body.first_name;
        var last_name = req.body.last_name;
        var email = req.body.email;
        var password = req.body.password;
        var mobile_number = req.body.mobile_number != "" ? req.body.mobile_number : null;
        var address = req.body.address != "" ? req.body.address : null;
        var status = 1;


        //get user details for avoiding duplication of mobile number
        const getUserDetails = await Users.getUserDetails(email, res)
        if (getUserDetails.length != 0) {
            errResponse(res, enums.statusCodes.Bad_Request, Config.errorCode, messages.emailAlreadyPresent, messages.emptyString)
            return;
        }

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async function (err, hash) {
                //insert user details
                const insertUserDetails = await Users.insertUserDetails(first_name, last_name, email, hash, mobile_number, address, status, res)
                if (insertUserDetails.length <= 0) {
                    errResponse(res, enums.statusCodes.Bad_Request, Config.errorCode, messages.unableToRegister, messages.emptyString)
                    return;
                }

                successResponse(res, enums.statusCodes.OK, Config.successCode, messages.registrationSuccess, { id: insertUserDetails[0].id });
                return;

            });
        })
    },

    //login with email and password
    userLogin: async (req, res, result) => {
        var email = req.body.email;
        var password = req.body.password;

        const getUserLoginDetails = await Users.getUserLoginDetails(email, res)
        if (getUserLoginDetails.length == 0) {
            errResponse(res, enums.statusCodes.Bad_Request, Config.errorCode, messages.invalidCredentials, messages.emptyString)
            return;
        }

        bcrypt.compare(password, getUserLoginDetails[0].password, async function (err, result) {
            if (err) {
                errResponse(res, enums.statusCodes.Bad_Request, Config.errorCode, messages.invalidCredentials, messages.emptyString)
                return;
            }

            if (result) {
                var user_id = getUserLoginDetails[0].id;
                const user = {
                    userId: getUserLoginDetails[0].id,
                    user_type: 0,
                }

                const apiToken = generateAccessToken(user);

                const insertAuthenticationToken = await Users.insertAuthenticationToken(user_id, apiToken, res)
                if (insertAuthenticationToken.length == 0) {
                    errResponse(res, enums.statusCodes.Bad_Request, Config.errorCode, messages.invalidCredentials, messages.emptyString)
                    return;
                }

                successResponse(res, enums.statusCodes.OK, Config.successCode, messages.loginMessage, { user_id: user_id, api_token: apiToken })
                return;
            }
        });
    },

    //update user details
    updateUserDetails: async (req, res, result) => {
        var user_id = req.body.user_id
        var first_name = req.body.first_name
        var last_name = req.body.last_name
        var mobile_number = req.body.mobile_number != "" ? req.body.mobile_number : null;
        var address = req.body.address != "" ? req.body.address : null;

        const getUserLoginDetails = await Users.fetchUserDetails(user_id, res)
        if (getUserLoginDetails.length == 0) {
            errResponse(res, enums.statusCodes.Not_Found, Config.errCodeNoRecordFound, messages.noRecordFound, messages.emptyString)
            return;
        }

        const updateUserDetails = await Users.updateUserDetails(user_id, first_name, last_name, mobile_number, address, res)
        if (updateUserDetails.length <= 0) {
            errResponse(res, enums.statusCodes.Bad_Request, Config.errorCode, messages.unableToUpdate, messages.emptyString)
            return;
        }

        successResponse(res, enums.statusCodes.OK, Config.successCode, messages.success, messages.emptyString)
        return;
    },


    //get user list
    getUserList: async (req, res, result) => {
        var pageNo = req.params.pageNo;
        var pageSize = req.params.pageSize;

        const getUserList = await Users.getUserList(pageNo, pageSize, res);
        if (getUserList.length == 0) {
            errResponse(res, enums.statusCodes.Not_Found, Config.errCodeNoRecordFound, messages.noRecordFound, [])
            return;
        }

        successResponse(res, enums.statusCodes.OK, Config.successCode, messages.success, getUserList)
        return;
    },


    //search users
    searchUsers: async (req, res, result) => {
        var search_text = req.params.search_text;
        const searchUsers = await Users.searchUsers(search_text, res);
        if (searchUsers.length == 0) {
            errResponse(res, enums.statusCodes.Not_Found, Config.errCodeNoRecordFound, messages.noRecordFound, [])
            return;
        }

        successResponse(res, enums.statusCodes.OK, Config.successCode, messages.success, searchUsers)
        return;
    },
}