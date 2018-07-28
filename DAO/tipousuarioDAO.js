const dateGenerator = require('./dateGenerator.js');
const dateGeneratorO = new dateGenerator('tipousuarioDAO');
const router = require('express').Router();

dateGeneratorO.printStart();

const getArguments = (req) => {
	const queryParams = req.query;
	const filter = queryParams.filter || '';
	const sortOrder = queryParams.sortOrder;
	const pageSize = parseInt(queryParams.pageSize, 10) || 0;
	const initialPos = (parseInt(queryParams.pageNumber, 10) || 0) * pageSize;
	const orderBy = queryParams.active || 'TIPO';
	return { filter, sortOrder, initialPos, pageSize, orderBy };
};

const getTiposAsync = async (req) => {
	const connection = await mySqlPool.getConnection();
	const { filter, sortOrder, initialPos, pageSize, orderBy } = getArguments(req);
	const query = 'SELECT * FROM TIPO_USUARIO ' +
		(filter ? ' WHERE TIPO LIKE "%' + filter + '%"' : '') +
		' ORDER BY ' + orderBy +
		' ' + sortOrder +
		'  LIMIT ' + initialPos + ', ' + pageSize;
	const rows = await connection.query(query);
	connection.release();
	return rows;
};

const countTiposAsync = async (req) => {
	const connection = await mySqlPool.getConnection();
	const query = 'SELECT COUNT(*) AS countTipos FROM TIPO_USUARIO ' + (req.query.filter ? ' WHERE TIPO LIKE "%' + req.query.filter + '%"' : '');
	const rows = await connection.query(query);
	connection.release();
	return rows[0].countTipos;
};

const createTipoAsync = async (req) => {
	const tipo = {
		TIPO: req.body.TIPO
	};
	const connection = await mySqlPool.getConnection();
	await connection.query(sqlTools.insertIntoQuery('TIPO_USUARIO', [tipo]));
	connection.release();
	return 'OK';
};

const updateTipoAsync = async (req) => {
	const columns = ['TIPO'];
	const connection = await mySqlPool.getConnection();
	await connection.query(sqlTools.updateQuery('TIPO_USUARIO', req.body, columns));
	connection.release();
	return 'OK';
};

const getTipoByIdAsync = async (req) => {
	const connection = await mySqlPool.getConnection();
	const id_tipo_usuario = req.params.id;
	const query = 'SELECT * FROM TIPO_USUARIO WHERE ID_TIPO_USUARIO = ?';
	const result = await connection.query(mysql.format(query, id_tipo_usuario));
	connection.release();
	return result[0];
};

const deleteTipoAsync = async (req) => {
	var connection = await mySqlPool.getConnection();
	await connection.query(sqlTools.deleteQuery('TIPO_USUARIO', req.params));
	connection.release();
	return 'OK';
};

router.get('/get', cf(getTiposAsync));
router.post('/create', cf(createTipoAsync));
router.put('/update', cf(updateTipoAsync));
router.get('/get/:id', cf(getTipoByIdAsync));
router.delete('/delete/:id', cf(deleteTipoAsync));
router.get('/count', cf(countTiposAsync));

exports.router = router;
