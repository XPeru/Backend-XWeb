const sqlPool = require('../utils/standalone.js');
const sqlTools = require('../utils/sql.js');

const table = {
	table_name: 'ASOC_TIPO_ACCESO',
	fields: [
		{
			name: 'FK_TIPO_USUARIO',
			notNull: true
		},
		{
			name: 'FK_ACCESO_USUARIO',
			notNull: true
		},
		{
			name: 'IS_ACTIVE',
			type: 'BOOLEAN',
			notNull: true,
			default: '1'
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