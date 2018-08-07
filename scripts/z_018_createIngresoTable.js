const sqlPool = require('../utils/standalone.js');
const sqlTools = require('../utils/sql.js');

const table = {
	table_name: 'INGRESO',
	fields: [
		{
			name: 'ID_INGRESO'
		},
		{
			name: 'CODE_INGRESO',
			type: 'VARCHAR(45)'
		},
		{
			name: 'COSTO_TOTAL',
			type: 'DECIMAL(10,2)',
			notNull: true
    },
		{
			name: 'FK_USUARIO',
      complement: '_CREATE',
      notNull: true
    },  
		{
			name: 'CREATE_TIME',
			type: 'TIMESTAMP',
			notNull: true,
			default: 'CURRENT_TIMESTAMP'
    },
		{
			name: 'FK_USUARIO',
      complement: '_UPDATE',
      notNull: false
    },      
		{
			name: 'UPDATE_TIME',
			type: 'TIMESTAMP'
    }, 
		{
			name: 'FK_PROVEEDOR_CLIENTE'
    },
		{
			name: 'FK_TIPO_DOCUMENTO'
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