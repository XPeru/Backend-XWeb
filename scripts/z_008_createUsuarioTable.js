const sqlPool = require('../utils/standalone.js');
const sqlTools = require('../utils/sql.js');

const table = {
	table_name: 'USUARIO',
	fields: [
		{
			name: 'ID_USUARIO'
		},
		{
			name: 'NOMBRE',
			type: 'VARCHAR(45)',
			notNull: true
		},
		{
			name: 'APELLIDOS',
			type: 'VARCHAR(100)',
			notNull: true
		},
		{
			name: 'EMAIL',
			type: 'VARCHAR(100)',
			notNull: true
		},
		{
			name: 'PASSWORD',
			type: 'VARCHAR(256)',
			notNull: true
		},
		{
			name: 'FOTO',
			type: 'VARCHAR(100)',
			notNull: true
		},
		{
			name: 'IS_ACTIVE',
			type: 'BOOLEAN',
			notNull: true,
			default: '1'
		},
		{
			name: 'CREATE_TIME',
			type: 'TIMESTAMP',
			notNull: true,
			default: 'CURRENT_TIMESTAMP'
		},
		{
			name: 'UPDATE_TIME',
			type: 'TIMESTAMP'
		},
		{
			name: 'FK_TIPO_USUARIO'
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