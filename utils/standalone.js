var mysql = require('promise-mysql');
const dotenv = require('dotenv');
const _ = require('underscore');
const sqlTools = require('./sql.js');
dotenv.config({ path: '../.env' });

exports.connection = function () {
	var connection = mysql.createConnection({
		host: process.env.MYSQL_HOST,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD
	});
	global._ = _;
	global.sqlTools = sqlTools;
	return connection;
};
