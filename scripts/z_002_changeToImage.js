const createConnection = require('../utils/standalone.js');
const sqlTools = require('../utils/sql.js');

sqlTools.sw(async () => {
	const connection = await createConnection.connection();
	await connection.query('USE ' + 'testdb');

	const data = {
		table_name: 'USUARIO',
		old_column_name: 'FOTO',
		new_column: {
			name: 'IMAGEN',
			type: 'VARCHAR(255)',
			notNull: true
		}
	};

	await connection.query(sqlTools.alterTableQuery(data));
	await connection.commit();
	await connection.end();
});
