const Users = require('../../services/loginLogout')
const Config = require('../../../config')
const enums = require('../../utils/enums')
const messages = require('../../messages/commonMessages')
const { errResponse, successResponse } = require('../../messages/errorResponses')


module.exports = {
    logoutUser: async (req, res, result) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        var userId = req._decode.userId;

        const getUserToken = await Users.getUserToken(userId, token, res);
        if (getUserToken.length == 0) {
            errResponse(res, enums.statusCodes.Bad_Request, Config.errorCode, messages.invalidCredentials, messages.emptyString)
            return;
        }

        const deleteUseToken = await Users.deleteUseToken(userId, res);
        if (deleteUseToken.length != 0) {
            errResponse(res, enums.statusCodes.Bad_Request, Config.errorCode, messages.errorMessages.logoutError, messages.emptyString)
            return;
        }

        successResponse(res, enums.statusCodes.OK, Config.successCode, messages.logoutMessage, messages.emptyString)
        return;
    },
}
