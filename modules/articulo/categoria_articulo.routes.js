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

const getCategoriasAsync = async (req) => {
	const connection = await mySqlPool.getConnection();
	const { filter, sortOrder, initialPos, pageSize, orderBy } = getArguments(req);
	const query = 'SELECT * FROM CATEGORIA ' +
		(filter ? ' WHERE DESCRIPCION LIKE "%' + filter + '%"' : '') +
		' ORDER BY ' + orderBy +
		' ' + sortOrder +
		'  LIMIT ' + initialPos + ', ' + pageSize;
	const rows = await connection.query(query);
	connection.release();
	return rows;
};

const countCategoriasAsync = async (req) => {
	const connection = await mySqlPool.getConnection();
	const query = 'SELECT COUNT(*) AS countCategorias FROM CATEGORIA ' + (req.query.filter ? ' WHERE DESCRIPCION LIKE "%' + req.query.filter + '%"' : '');
	const rows = await connection.query(query);
	connection.release();
	return rows[0].countCategorias;
};

const createCategoriaAsync = async (req) => {
	const categoria = {
		DESCRIPCION: req.body.DESCRIPCION
	};
	const connection = await mySqlPool.getConnection();
	await connection.query(sqlTools.insertIntoQuery('CATEGORIA', [categoria]));
	connection.release();
	return 'OK';
};

const updateCategoriaAsync = async (req) => {
	const columns = ['DESCRIPCION'];
	const connection = await mySqlPool.getConnection();
	await connection.query(sqlTools.updateQuery('CATEGORIA', req.body, columns));
	connection.release();
	return 'OK';
};

const getCategoriaByIdAsync = async (req) => {
	const connection = await mySqlPool.getConnection();
	const id_categoria_articulo = req.params.id;
	const query = 'SELECT * FROM CATEGORIA WHERE ID_CATEGORIA = ?';
	const result = await connection.query(mysql.format(query, id_categoria_articulo));
	connection.release();
	return result[0];
};

const deleteCategoriaAsync = async (req) => {
	var connection = await mySqlPool.getConnection();
	await connection.query(sqlTools.deleteQuery('CATEGORIA', req.params));
	connection.release();
	return 'OK';
};

router.get('/get', cf(getCategoriasAsync));
router.post('/create', cf(createCategoriaAsync));
router.put('/update', cf(updateCategoriaAsync));
router.get('/get/:id', cf(getCategoriaByIdAsync));
router.delete('/delete/:id', cf(deleteCategoriaAsync));
router.get('/count', cf(countCategoriasAsync));

exports.router = router;
