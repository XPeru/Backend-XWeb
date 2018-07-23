const dateGenerator = require('./dateGenerator.js');
const dateGeneratorO = new dateGenerator('almacenDAO');
const router = require('express').Router();

dateGeneratorO.printStart();

const getArguments = (req) => {
	const queryParams = req.query;
	const filter = queryParams.filter || '';
	const sortOrder = queryParams.sortOrder;
	const pageSize = parseInt(queryParams.pageSize, 10) || 0;
	const initialPos = (parseInt(queryParams.pageNumber, 10) || 0) * pageSize;
	const orderBy = queryParams.active || 'CODIGO_ALMACEN';
	return { filter, sortOrder, initialPos, pageSize, orderBy };
};

const getAlmacenesAsync = async (req) => {
	const connection = await mySqlPool.getConnection();
	const { filter, sortOrder, initialPos, pageSize, orderBy } = getArguments(req);
	const query = 'SELECT * FROM ALMACEN ' +
		(filter ? ' WHERE CODIGO_ALMACEN LIKE "%' + filter + '%"' : '') +
		' ORDER BY ' + orderBy +
		' ' + sortOrder +
		'  LIMIT ' + initialPos + ', ' + pageSize;
	const rows = await connection.query(query);
	connection.release();
	return rows;
};

const countAlmacenesAsync = async (req) => {
	const connection = await mySqlPool.getConnection();
	const query = 'SELECT COUNT(*) AS countAlmacenes FROM ALMACEN ' +
		(req.query.filter ? ' WHERE CODIGO_ALMACEN LIKE "%' + req.query.filter + '%"' : '');
	const rows = await connection.query(query);
	connection.release();
	return rows[0].countAlmacenes;
};

const createAlmacenAsync = async (req) => {
	const almacen = {
		codigo_almacen: req.body.CODIGO_ALMACEN,
		ubicacion: req.body.UBICACION
	};
	const connection = await mySqlPool.getConnection();
	await connection.query(sqlTools.insertIntoQuery('ALMACEN', [almacen]));
	connection.release();
	return 'OK';
};

const updateAlmacenAsync = async (req) => {
	const columns = ['CODIGO_ALMACEN', 'UBICACION'];
	const connection = await mySqlPool.getConnection();
	await connection.query(sqlTools.updateQuery('ALMACEN', req.body, columns));
	connection.release();
	return 'OK';

	// let query = 'UPDATE' + '\n' +
	// 			'	ALMACEN ' + '\n' +
	// 			'SET' + '\n' +
	// 			'	CODIGO_ALMACEN = ?, ' + '\n' +
	// 			'	UBICACION = ? ' + '\n' +
	// 			'WHERE ' + '\n' +
	// 			'	ID_ALMACEN = ?';
	// const table = [req.body.CODIGO_ALMACEN,
	// 	req.body.UBICACION,
	// 	req.body.ID_ALMACEN];
	// query = mysql.format(query, table);
	// dateGeneratorO.printUpdate(query);
};

const getAlmacenByIdAsync = async (req) => {
	const connection = await mySqlPool.getConnection();
	const id_almacen = req.params.id;
	const query = 'SELECT * FROM ALMACEN WHERE ID_ALMACEN = ?';
	const result = await connection.query(mysql.format(query, id_almacen));
	connection.release();
	return result[0];
};

const deleteAlmacenAsync = async (req) => {
	const connection = await mySqlPool.getConnection();
	await connection.query(sqlTools.deleteQuery('ALMACEN', req.params));
	connection.release();
	return 'OK';

	// let query = 'DELETE FROM' + '\n' +
	// 			'	ALMACEN' + '\n' +
	// 			'WHERE ' + '\n' +
	// 			'	ID_ALMACEN = ?';
	// query = mysql.format(query, [req.params.id_almacen]);
	// dateGeneratorO.printDelete(query);
};

router.get('/get', cf(getAlmacenesAsync));
router.post('/create', cf(createAlmacenAsync));
router.put('/update', cf(updateAlmacenAsync));
router.get('/get/:id', cf(getAlmacenByIdAsync));
router.delete('/delete/:id', cf(deleteAlmacenAsync));
router.get('/count', cf(countAlmacenesAsync));

// router.get('/get', cf(getAlmacenesAsync));
// router.post('/create', cf(createAlmacenAsync));
// router.put('/update', cf(updateAlmacenAsync));
// router.delete('/delete/:id', cf(deleteAlmacenById));

exports.router = router;
