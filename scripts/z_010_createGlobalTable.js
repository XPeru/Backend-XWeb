const sqlPool = require('../utils/standalone.js');
const sqlTools = require('../utils/sql.js');

const table = {
	table_name: 'GLOBAL',
	fields: [
		{
			name: 'ID_GLOBAL'
		},
		{
			name: 'NOMBRE',
			type: 'VARCHAR(200)',
			notNull: true
		},
		{
			name: 'RUC',
			type: 'VARCHAR(45)',
			notNull: true
		},
		{
			name: 'DIRECCION',
			type: 'VARCHAR(200)',
			notNull: true
		},
		{
			name: 'EMAIL',
			type: 'VARCHAR(45)',
			notNull: true
		},
		{
			name: 'TELEFONO',
			type: 'VARCHAR(20)'
		},
		{
			name: 'LOGO',
			type: 'VARCHAR(200)'
		},
		{
			name: 'IMPUESTO',
			type: 'DECIMAL(10,2)'
		},
		{
			name: 'MONEDA',
			type: 'VARCHAR(5)'
		},
		{
			name: 'NOMBRE_IMPUESTO',
			type: 'VARCHAR(45)'
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