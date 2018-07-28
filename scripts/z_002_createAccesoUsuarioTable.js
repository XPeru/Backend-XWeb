const sqlPool = require('../utils/standalone.js');
const sqlTools = require('../utils/sql.js');

const table = {
	table_name: 'ACCESO_USUARIO',
	fields: [
		{
			name: 'ID_ACCESO_USUARIO'
		},
		{
			name: 'DESCRIPCION',
			type: 'VARCHAR(255)',
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