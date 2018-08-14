const sqlPool = require('../utils/standalone.js');
const sqlTools = require('../utils/sql.js');

const table = {
	table_name: 'ARTICULO',
	fields: [
		{
			name: 'ID_ARTICULO',
			comment: 'Secuencia de Artículo'
		},
		{
			name: 'CODIGO',
			type: 'VARCHAR(20)',
			notNull: true,
			comment: 'ID de Artículo'
		},
		{
			name: 'DESCRIPCION',
			type: 'VARCHAR(45)',
			notNull: true,
			comment: 'ID de Descripción'
		},
		{
			name: 'UNIDAD',
			type: 'VARCHAR(10)',
			notNull: true,
			comment: 'Medida de Cantidad'
		},
		{
			name: 'PRECIO UNITARIO',
			type: 'DECIMAL(10,2)',
			notNull: true,
			comment: 'Precio por Unidad de medida'
		},
		{
			name: 'IMAGEN',
			type: 'VARCHAR(100)'
		},
		{
			name: 'VALOR_REPOSICION',
			type: 'INT',
			comment: 'Valor de Reposición'
		},
		{
			name: 'FK_CATEGORIA'
		}
	]
};

sqlTools.sw(async () => {
	const connection = await sqlPool.connection();
	await connection.query('USE ' + process.env.MYSQL_DATABASE_NAME);
	console.log(sqlTools.createTableQuery(table));
	await connection.query(sqlTools.createTableQuery(table));
	await connection.commit();
	await connection.end();
});

