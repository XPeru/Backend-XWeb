const sqlPool = require('../utils/standalone.js');
const sqlTools = require('../utils/sql.js');

const table = {
	table_name: 'ESTADO',
	fields: [
		{
			name: 'ID_ESTADO'
		},
		{
			name: 'DESCRIPCION',
			type: 'VARCHAR(45)',
			notNull: true
		}
	]
};

sqlTools.sw(async () => {
	const connection = await sqlPool.connection();
	await connection.query('USE ' + process.env.MYSQL_DATABASE_NAME);
	await connection.query(sqlTools.createTableQuery(table));
	await connection.commit();
	await connection.end();
});