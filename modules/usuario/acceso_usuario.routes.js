const router = require('express').Router();

const getArguments = (req) => {
	const queryParams = req.query;
	const filter = queryParams.filter || '';
	const sortOrder = queryParams.sortOrder;
	const pageSize = parseInt(queryParams.pageSize, 10) || 0;
	const initialPos = (parseInt(queryParams.pageNumber, 10) || 0) * pageSize;
	const orderBy = queryParams.active || 'DESCRIPCION';
	return { filter, sortOrder, initialPos, pageSize, orderBy };
};

const getAccesosAsync = async (req) => {
	const connection = await mySqlPool.getConnection();
	const { filter, sortOrder, initialPos, pageSize, orderBy } = getArguments(req);
	const query = 'SELECT * FROM ACCESO_USUARIO ' +
		(filter ? ' WHERE DESCRIPCION LIKE "%' + filter + '%"' : '') +
		' ORDER BY ' + orderBy +
		' ' + sortOrder +
		'  LIMIT ' + initialPos + ', ' + pageSize;
	const rows = await connection.query(query);
	connection.release();
	return rows;
};

const countAccesosAsync = async (req) => {
	const connection = await mySqlPool.getConnection();
	const query = 'SELECT COUNT(*) AS countAccesos FROM ACCESO_USUARIO ' + (req.query.filter ? ' WHERE DESCRIPCION LIKE "%' + req.query.filter + '%"' : '');
	const rows = await connection.query(query);
	connection.release();
	return rows[0].countAccesos;
};

const createAccesoAsync = async (req) => {
	const acceso = {
		DESCRIPCION: req.body.DESCRIPCION
	};
	const connection = await mySqlPool.getConnection();
	await connection.query(sqlTools.insertIntoQuery('ACCESO_USUARIO', [acceso]));
	connection.release();
	return 'OK';
};

const updateAccesoAsync = async (req) => {
	const columns = ['DESCRIPCION'];
	const connection = await mySqlPool.getConnection();
	await connection.query(sqlTools.updateQuery('ACCESO_USUARIO', req.body, columns));
	connection.release();
	return 'OK';
};

const getAccesoByIdAsync = async (req) => {
	const connection = await mySqlPool.getConnection();
	const id_acceso_usuario = req.params.id;
	const query = 'SELECT * FROM ACCESO_USUARIO WHERE ID_ACCESO_USUARIO = ?';
	const result = await connection.query(mysql.format(query, id_acceso_usuario));
	connection.release();
	return result[0];
};

const deleteAccesoAsync = async (req) => {
	var connection = await mySqlPool.getConnection();
	await connection.query(sqlTools.deleteQuery('ACCESO_USUARIO', req.params));
	connection.release();
	return 'OK';
};

router.get('/get', cf(getAccesosAsync));
router.post('/create', cf(createAccesoAsync));
router.put('/update', cf(updateAccesoAsync));
router.get('/get/:id', cf(getAccesoByIdAsync));
router.delete('/delete/:id', cf(deleteAccesoAsync));
router.get('/count', cf(countAccesosAsync));

exports.router = router;
