const sqlPool = require('../utils/standalone.js');
const sqlTools = require('../utils/sql.js');

sqlTools.sw(async () => {
	const connection = await sqlPool.connection();
	const query = sqlTools.dropDatabaseQuery(process.env.MYSQL_DATABASE_NAME);
	await connection.query(query);
	await connection.commit();
	await connection.end();
});