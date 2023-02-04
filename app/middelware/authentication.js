const Config = require('./../../config')
const database = require('./../../database')
const connection = database.db.get;
const messages = require('../messages/commonMessages')
const enums = require('../utils/enums')

const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
require('dotenv').config();
const { errResponse, successResponse } = require('../messages/errorResponses')


module.exports = {
    authenticateUserToken: async (req, res, next) => {

        const { user, token } = module.exports.checkAuthenticationUtility(req, res);
        var queryStatement = module.exports.getDatabaseQuery(user.user_type);
        connection.query(queryStatement, [token], (error, result) => {
            if (error) {
                errResponse(res, enums.statusCodes.Internal_Server_Error, Config.errorCode, messages.serverErrorMessage, messages.emptyString)
                return;
            }
            
            if (result.length == 0) {
                errResponse(res, enums.statusCodes.Bad_Request, Config.noRecordFound, messages.noRecordFound, []);
                return;
            } else {

                jwt.verify(token, Config.ACCESS_TOKEN_SECRET, (error, result) => {
                    if (error) {
                        errResponse(res, enums.statusCodes.Bad_Request, Config.errorCode, messages.errorMessages.invalidAuth, messages.emptyString)
                        return;
                    } else {
                        next()
                    }
                })
            }
        })

    },

    checkAuthenticationUtility: (req, res) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            errResponse(res, enums.statusCodes.Bad_Request, Config.errorCode, messages.errorMessages.invalidToken, messages.emptyString)
            return;
        }

        req._decode = jwt_decode(token);
        const user = {
            userId: req._decode.userId,
            user_type: req._decode.user_type
        }

        return { user, token };
    },

    getDatabaseQuery: (user_type) => {
        switch (true) {
            // 0 => User
            case (user_type == 0):
                var queryStatement = `SELECT UO.id,UO.user_id,UO.token 
				FROM public."user_tokens"
				AS UO
			   WHERE UO.token = $1`;
                break;
        }
        return queryStatement
    },
}