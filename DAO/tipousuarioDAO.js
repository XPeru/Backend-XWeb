const dateGenerator = require('./dateGenerator.js');
const dateGeneratorO = new dateGenerator('tipousuarioDAO');
const router = require('express').Router();

// this should prevent SQL injection
const getArguments = (req) => {
	const queryParams = req.query;
	const filter = queryParams.filter || '';
	const sortOrder = queryParams.sortOrder;
	const pageNumber = parseInt(queryParams.pageNumber, 10) || 0;
	const pageSize = parseInt(queryParams.pageSize, 10);
	const orderBy = queryParams.active || 'ID_TIPO_USUARIO';
	return { filter, sortOrder, pageNumber, pageSize, orderBy };
};

const getTiposUsuarioAsync = async () => {
	const query = "CALL SP_SEARCH_ALL('TIPO_USUARIO')";
	dateGeneratorO.printSelect(query);
	const connection = await mySqlPool.getConnection();
	const rows = await connection.query(query);
	connection.release();
	return rows[0];
};

const createTipoUsuarioAsync = async (req) => {
	const tipoUsuario = {
		tipo: req.body.TIPO
	};
	const query = sqlTools.insertIntoQuery('tipo_usuario', [tipoUsuario]);
	dateGeneratorO.printInsert(query);
	const connection = await mySqlPool.getConnection();
	await connection.query(query);
	connection.release();
	return 'OK';
};

const updateTipoUsuarioAsync = async (req) => {
	let query = 'UPDATE ' + '\n' +
			'   TIPO_USUARIO ' + '\n' +
			'SET ' + '\n' +
			'   TIPO = ? ' + '\n' +
			'WHERE ' + '\n' +
			'   ID_TIPO_USUARIO = ?';
	const table = [req.body.TIPO,
		req.body.ID_TIPO_USUARIO];
	query = mysql.format(query, table);
	dateGeneratorO.printUpdate(query);
	const connection = await mySqlPool.getConnection();
	await connection.query(query);
	connection.release();
	return 'OK';
};

const getTipoUsuarioByIdAsync = async (req) => {
	let query = "CALL SP_SEARCH('TIPO_USUARIO','ID_TIPO_USUARIO',?)";
	query = mysql.format(query, [req.params.id_tipo_usuario]);
	dateGeneratorO.printSelect(query);
	const connection = await mySqlPool.getConnection();
	const rows = await connection.query(query);
	connection.release();
	return rows[0];
};

const deleteTipoUsuarioById = async (req) => {
	let query = 'DELETE FROM ' + '\n' +
				'   TIPO_USUARIO ' + '\n' +
				'WHERE ' + '\n' +
				'   ID_TIPO_USUARIO=?';
	query = mysql.format(query, [req.params.id_tipo_usuario]);
	dateGeneratorO.printDelete(query);
	const connection = await mySqlPool.getConnection();
	await connection.query(query);
	connection.release();
	return 'OK';
};

router.get('/get', cf(getTiposUsuarioAsync));
router.get('/get/:id', cf(getTipoUsuarioByIdAsync));
router.post('/create', cf(createTipoUsuarioAsync));
router.put('/update', cf(updateTipoUsuarioAsync));
router.delete('/delete/:id', cf(deleteTipoUsuarioById));

exports.router = router;
