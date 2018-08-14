const sqlPool = require('../utils/standalone.js');
const sqlTools = require('../utils/sql.js');

const table = {
	table_name: 'DETALLE_INGRESO',
	fields: [
		{
			name: 'ID_DETALLE_INGRESO',
			comment: 'Secuencia de Ingreso Detallado'
		},
		{
			name: 'CANTIDAD',
			type: 'DECIMAL(10,2)',
			notNull: true,
			comment: 'Cantidad'
		},
		{
			name: 'PRECIO',
			type: 'DECIMAL(10,2)',
			notNull: true
		},
		{
			name: 'IS_ACTIVE',
			type: 'BOOLEAN',
			notNull: true,
			default: 1,
			comment: 'Flag de Actividad'
		},
		{
			name: 'FK_INGRESO'
		},
		{
			name: 'FK_ARTICULO'
		},
		{
			name: 'FK_ALMACEN'
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