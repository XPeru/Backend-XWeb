const sqlPool = require('../utils/standalone.js');
const sqlTools = require('../utils/sql.js');

const buildData = (tipos) => {
	const res = [];
	_.each(tipos, (tipo) => {
		const e = {
			TIPO: tipo
		};
		res.push(e);
	});
	return res;
};

sqlTools.sw(async () => {
	const connection = await sqlPool.connection();
	await connection.query('USE ' + process.env.MYSQL_DATABASE_NAME);
	const tipos = ['SUPERUSUARIO',
		'ADMINISTRADOR',
		'EMPLEADO',
		'SUBEMPLEADO'];
	await connection.query(sqlTools.insertIntoQuery('TIPO_USUARIO', buildData(tipos)));
	await connection.commit();
	await connection.end();
});