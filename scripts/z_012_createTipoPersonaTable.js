const sqlPool = require('../utils/standalone.js');
const sqlTools = require('../utils/sql.js');

const table = {
	table_name: 'TIPO_PERSONA',
	fields: [
		{
			name: 'ID_TIPO_PERSONA'
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