const { Pool, Client } = require('pg')

module.exports = {
	db: {
		get: new Pool({
			user: 'ubuntu',
			host: 'localhost',
			database: 'gaming_db',
			password: '#@avid$oft',
			port: 5432,
		})
	}
}