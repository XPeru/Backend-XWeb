const sqlPool = require('../utils/standalone.js');
const sqlTools = require('../utils/sql.js');

const table = {
	table_name: 'PROVEEDOR_CLIENTE',
	fields: [
		{
			name: 'ID_PROVEEDOR_CLIENTE'
		},
		{
			name: 'NOMBRE',
			type: 'VARCHAR(45)',
			notNull: true
		},
		{
			name: 'EMAIL',
			type: 'VARCHAR(100)',
			notNull: true
		},
		{
			name: 'RUC',
			type: 'VARCHAR(45)'
		},
		{
			name: 'NUMERO_CUENTA',
			type: 'VARCHAR(45)'
		},
		{
			name: 'DIRECCION_CALLE',
			type: 'VARCHAR(45)'
		},
		{
			name: 'DIRECCION_DISTRITO',
			type: 'VARCHAR(45)'
		},
		{
			name: 'DIRECCION_DEPARTAMENTO',
			type: 'VARCHAR(45)'
		},
		{
			name: 'DIRECCION_COMPLEMENTO',
			type: 'VARCHAR(45)'
		},
		{
			name: 'TELEFONO',
			type: 'VARCHAR(12)'
		},
		{
			name: 'FK_TIPO_PERSONA'
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