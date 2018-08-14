const sqlPool = require('../utils/standalone.js');
const sqlTools = require('../utils/sql.js');

const table = {
	table_name: 'ALMACEN',
	fields: [
		{
			name: 'ID_ALMACEN',
			comment: 'Secuencia de Almacén'
		},
		{
			name: 'CODIGO',
			type: 'VARCHAR(20)',
			notNull: true,
			comment: 'ID de Almacén'
		},
		{
			name: 'UBICACION',
			type: 'VARCHAR(100)',
			notNull: true
		},
		{
			name: 'IS_ACTIVE',
			type: 'BOOLEAN',
			notNull: true,
			default: 1,
			comment: 'Flag de Actividad'
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