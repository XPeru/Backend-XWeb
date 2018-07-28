const createConnection = require('../utils/standalone.js');
const sqlTools = require('../utils/sql.js');

sqlTools.sw(async () => {
	const connection = await createConnection.connection();
	const query = sqlTools.createDatabaseQuery(process.env.MYSQL_DATABASE_NAME);
	await connection.query(query);
	await connection.commit();
	await connection.end();
});
