const database = require('../../database');
const connection = database.db.get;
const Config = require('../../config');
const messages = require('../messages/commonMessages')
const enums = require('../utils/enums')
const { errResponse } = require('../messages/errorResponses')

module.exports = {

	//insert user details 
	insertUserDetails: (first_name, last_name, email, password, mobile_number, address, status, res) => {
		return new Promise((resolve, reject) => {
			var queryStatement = `INSERT INTO public."users" (first_name, last_name, email, password, mobile_number, address, status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`;
			connection.query(queryStatement, [first_name, last_name, email, password, mobile_number, address, status], (error, result) => {
				if (error) {
					console.log("error", error);
					errResponse(res, enums.statusCodes.Internal_Server_Error, Config.errorCode, messages.errorMessages.addUser, messages.emptyString)
					return;
				}
				resolve(result.rows);
			});
		})
	},

	//get user details
	getUserDetails: (email, res) => {
		return new Promise((resolve, reject) => {
			var queryStatement = `SELECT UM.id,UM.first_name, UM.last_name,UM.email 
			FROM public."users" 
			AS UM WHERE UM.email=$1 AND status=1`;

			connection.query(queryStatement, [email], (error, results) => {
				if (error) {
					errResponse(res, enums.statusCodes.Internal_Server_Error, Config.errorCode, messages.errorMessages.userDetails, messages.emptyString)
					return;
				}
				resolve(results.rows);
			});
		})
	},

	// user login details
	getUserLoginDetails: (email, res) => {
		return new Promise((resolve, reject) => {
			var queryStatement = `SELECT UM.id,UM.first_name,UM.mobile_number,UM.password 
		FROM public."users" AS UM
		 WHERE UM.email=$1  AND status=1`;

			connection.query(queryStatement, [email], (error, results) => {
				if (error) {
					errResponse(res, enums.statusCodes.Internal_Server_Error, Config.errorCode, messages.errorMessages.userDetails, messages.emptyString)
					return;
				}
				resolve(results.rows);
			});
		})
	},

	//fetch user details
	fetchUserDetails: (user_id, res) => {
		return new Promise((resolve, reject) => {
			var queryStatement = `SELECT UM.first_name, UM.last_name, UM.email, UM.mobile_number, UM.address
		FROM public."users" AS UM where id = $1 and  status=1`;

			connection.query(queryStatement, [user_id], (error, results) => {
				if (error) {
					console.log("error", error);
					errResponse(res, enums.statusCodes.Internal_Server_Error, Config.errorCode, messages.errorMessages.userDetails, messages.emptyString)
					return;
				}
				resolve(results.rows);
			});
		})
	},

	//update user details
	updateUserDetails: (user_id, first_name, last_name, mobile_number, address, res) => {
		return new Promise((resolve, reject) => {
			var queryStatement = `UPDATE
			public."users"
			SET
			first_name = $2, 
			last_name= $3,
			mobile_number= $4,
			address= $5
			WHERE id=$1 AND status=1`;

			connection.query(queryStatement, [user_id, first_name, last_name, mobile_number, address], (error, results) => {
				if (error) {
					errResponse(res, enums.statusCodes.Internal_Server_Error, Config.errorCode, messages.errorMessages.updateUserDetails, messages.emptyString)
					return;
				}
				resolve(results.rowCount);
			});
		})
	},


	//get user list
	getUserList: (pageNo, pageSize, res) => {
		return new Promise((resolve, reject) => {
			var queryStatement = `SELECT UM.first_name, UM.last_name, UM.email, UM.mobile_number, UM.address
		FROM public."users" AS UM where status=1
		order by id asc
		LIMIT ${pageSize} 
		OFFSET ${(pageNo - 1) * pageSize}`;

			connection.query(queryStatement, (error, results) => {
				if (error) {
					errResponse(res, enums.statusCodes.Internal_Server_Error, Config.errorCode, messages.errorMessages.userDetails, messages.emptyString)
					return;
				}
				resolve(results.rows);
			});
		})
	},

	//search users
	searchUsers: (search_text, res) => {
		return new Promise((resolve, reject) => {
			var queryStatement = `SELECT UM.first_name, UM.last_name, UM.email, UM.mobile_number, UM.address
		FROM public."users" AS UM where status=1 AND  LOWER(UM.first_name) LIKE '%' || LOWER('${search_text}') ||'%' or lower(UM.last_name) LIKE '%' || lower('${search_text}') ||'%' or lower(UM.email) LIKE '%' || lower('${search_text}') ||'%'  or UM.mobile_number ='${search_text}'`;

			connection.query(queryStatement, (error, results) => {
				if (error) {
					errResponse(res, enums.statusCodes.Internal_Server_Error, Config.errorCode, messages.errorMessages.userDetails, messages.emptyString)
					return;
				}
				resolve(results.rows);
			});
		})
	},
	// ......................................... User Authorization token ............................ //

	//get user token
	getusersToken: (userId, res) => {
		return new Promise((resolve, reject) => {
			var queryStatement = `SELECT UT.id,UT.user_id,UT.token 
			FROM public."user_tokens"
			AS UT
		   WHERE UT.user_id = $1`;
			connection.query(queryStatement, [userId], (error, getUserDetails) => {
				if (error) {
					errResponse(res, 500, Config.errCodeError, "Error in fetching user Details", "")
					return;
				}
				resolve(getUserDetails.rows);
			});
		})
	},

	//get user token
	getUserToken: (userId, token, res) => {
		return new Promise((resolve, reject) => {
			var queryStatement = `SELECT UT.id,UT.user_id,UT.token 
			FROM public."user_tokens"
			AS UT
		   WHERE UT.user_id = $1 AND UT.token = $2`;
			connection.query(queryStatement, [userId, token], (error, getUserDetails) => {
				if (error) {
					errResponse(res, enums.statusCodes.Internal_Server_Error, Config.errorCode, messages.errorMessages.getAuthToken, messages.emptyString)
					return;
				}
				resolve(getUserDetails.rows);
			});
		})
	},

	//insert user token
	insertAuthenticationToken: (user_id, apiToken, res) => {
		return new Promise((resolve, reject) => {
			var queryStatement = `INSERT INTO
			 public."user_tokens" 
			(user_id,token) 
			VALUES ($1,$2)
			 RETURNING id`;

			connection.query(queryStatement, [user_id, apiToken], (error, result) => {
				if (error) {
					errResponse(res, enums.statusCodes.Internal_Server_Error, Config.errorCode, messages.errorMessages.authenticationError, messages.emptyString)
					return;
				}
				resolve(result.rows);
			});
		})
	},

	//delete user token 
	deleteUseToken: (id, res) => {
		return new Promise((resolve, reject) => {
			var queryStatement = `DELETE
	   FROM	public."user_tokens" 
		WHERE user_id=$1`
			connection.query(queryStatement, [id], (error, getUserDetails) => {
				if (error) {
					errResponse(res, enums.statusCodes.Internal_Server_Error, Config.errorCode, messages.errorMessages.deleteAuthToken, messages.emptyString)
					return;
				}
				resolve(getUserDetails.rows);
			});
		})
	},


	getUserAuth: async (userId, token, user_type, res) => {
		return new Promise(async (resolve, reject) => {
			var queryStatement = await module.exports.getDatabaseQuery(user_type)
			connection.query(queryStatement, [userId, token], (error, getUserDetails) => {
				if (error) {
					errResponse(res, 500, Config.errCodeError, "Error in fetching user Details", "")
					return;
				}
				resolve(getUserDetails.rows);
			});
		})
	},

	getDatabaseQuery: (user_type) => {

		switch (true) {
			// 0 => User, 1 => Admin
			case (user_type == 0):
				var queryStatement = `SELECT UO.id,UO.user_id,UO.token 
				FROM public."user_tokens"
				AS UO
			   WHERE UO.user_id = $1 AND  UO.token = $2`;
				break;
		}
		return queryStatement
	},
}