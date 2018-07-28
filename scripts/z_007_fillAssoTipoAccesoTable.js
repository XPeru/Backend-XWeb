const sqlPool = require('../utils/standalone.js');
const sqlTools = require('../utils/sql.js');

const buildData = (maxA, maxT) => {
	const res = [];
	for (let i = 0; i < 20; i++) {
		const e = {
			FK_ACCESO_USUARIO: sqlTools.randomId(maxA),
			FK_TIPO_USUARIO: sqlTools.randomId(maxT)
		};
		res.push(e);
	}
	return res;
};

sqlTools.sw(async () => {
	const connection = await sqlPool.connection();
	await connection.query('USE ' + process.env.MYSQL_DATABASE_NAME);

	const queryA = 'SELECT COUNT(*) AS count FROM ACCESO_USUARIO';
	const rowsA = await connection.query(queryA);
	const maxA = rowsA[0].count;

	const queryT = 'SELECT COUNT(*) AS count FROM TIPO_USUARIO';
	const rowsT = await connection.query(queryT);
	const maxT = rowsT[0].count;

	await connection.query(sqlTools.insertIntoQuery('ASOC_TIPO_ACCESO', buildData(maxA, maxT)));
	await connection.commit();
	await connection.end();
});