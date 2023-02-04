require('dotenv').config();
module.exports = {
	name: 'apache',
	hostname: 'localhost',
	encryptionKey: '#@CINOXAHCET@#',
	version: '0.0.1',
	env: process.env.NODE_ENV || 'production',
	port: process.env.PORT || 5000,
	errorCode: -1,
	errCodeNoRecordFound: 1,
	successCode: 0,
	ACCESS_TOKEN_SECRET: "784sdsdsdhyohsd-098nwqjhu7324gcx64c847324gcx64cw5evr743c18448484809999999998",
}