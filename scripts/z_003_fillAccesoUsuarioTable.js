const sqlPool = require('../utils/standalone.js');
const sqlTools = require('../utils/sql.js');

const buildData = (accesos) => {
	const res = [];
	_.each(accesos, (acceso) => {
		const e = {
			DESCRIPCION: acceso
		};
		res.push(e);
	});
	return res;
};

sqlTools.sw(async () => {
	const connection = await sqlPool.connection();
	await connection.query('USE ' + process.env.MYSQL_DATABASE_NAME);
	const accesos = ['ACCESO_USUARIO',
		'TIPO_USUARIO',
		'GESTION_USUARIO',
		'ALMACEN',
		'INGRESO',
		'SALIDA',
		'TRANSFORMADOR'];
	await connection.query(sqlTools.insertIntoQuery('ACCESO_USUARIO', buildData(accesos)));
	await connection.commit();
	await connection.end();
});