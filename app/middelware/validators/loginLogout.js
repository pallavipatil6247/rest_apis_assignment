const Joi = require('joi');
const Config = require('../../../config')
const messages = require('../../messages/commonMessages')
const enums = require('../../utils/enums')
const { errResponse, successResponse } = require('../../messages/errorResponses')

module.exports = {
	//user registration
	userRegistration: (req, res, next) => {
		const schema = Joi.object().keys({
			first_name: Joi.string().min(1).required(),
			last_name: Joi.string().min(1).required(),
			email: Joi.string().min(1).required(),
			mobile_number: Joi.string().allow("", null),
			address: Joi.string().allow("", null),
			password: Joi.string().min(1).required(),
		});
		if (schema.validate(req.body).error) {
			let error = schema.validate(req.body).error

			errResponse(res, enums.statusCodes.Bad_Request, Config.errorCode, messages.invalidParameters, messages.emptyString)
			return;
		} else {
			next();
		}

	},

	userLogin: (req, res, next) => {
		const schema = Joi.object().keys({
			email: Joi.string().min(1).required(),
			password: Joi.string().min(1).required(),
		});

		if (schema.validate(req.body).error) {
			let error = schema.validate(req.body).error
			errResponse(res, enums.statusCodes.Bad_Request, Config.errorCode, messages.invalidParameters, messages.emptyString)
			return;

		} else {
			next();
		}
	},

	updateUserDetails: (req, res, next) => {
		const schema = Joi.object().keys({
			user_id: Joi.number().integer().min(1).required(),
			first_name: Joi.string().min(1).required(),
			last_name: Joi.string().min(1).required(),
			mobile_number: Joi.string().allow("", null),
			address: Joi.string().allow("", null),
		});
		if (schema.validate(req.body).error) {
			let error = schema.validate(req.body).error
			errResponse(res, enums.statusCodes.Bad_Request, Config.errorCode, messages.invalidParameters, messages.emptyString)
			return;
		} else {
			next();
		}

	},
}
