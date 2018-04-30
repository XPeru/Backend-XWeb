const dateGenerator = require("./dateGenerator.js");
const dateGeneratorO = new dateGenerator("almacenDAO");
const router = require("express").Router();

const getAlmacenesAsync = async (req) => {
	const query = "CALL SP_SEARCH_ALL('ALMACEN')";
	dateGeneratorO.printSelect(query);
	const connection = await mySqlPool.getConnection();
	const rows = await connection.query(query);
	connection.release();
	return rows[0];
};

const createAlmacenAsync = async (req) => {
	const almacen = {
		codigo_almacen: req.body.CODIGO_ALMACEN,
		ubicacion: req.body.UBICACION
	}
	const query = sqlTools.insertIntoQuery('almacen',[almacen]);
	dateGeneratorO.printInsert(query);
	const connection = await mySqlPool.getConnection();
	await connection.query(query);
	connection.release();
	return "OK";
};

const updateAlmacenAsync = async (req) => {
	let query = "UPDATE" + "\n" +
				"	ALMACEN " + "\n" +
				"SET" + "\n" +
				"	CODIGO_ALMACEN = ?, " + "\n" +
				"	UBICACION = ? " + "\n" +
				"WHERE " + "\n" +
				"	ID_ALMACEN = ?";
	const table = [	req.body.CODIGO_ALMACEN,
									req.body.UBICACION,
									req.body.ID_ALMACEN];
	query = mysql.format(query, table);
	dateGeneratorO.printUpdate(query);
	const connection = await mySqlPool.getConnection();
	await connection.query(query);
	connection.release();
	return "OK";
};

const deleteAlmacenById = async (req) => {
	let query = "DELETE FROM" + "\n" +
				"	ALMACEN" + "\n" +
				"WHERE " + "\n" +
				"	ID_ALMACEN = ?";
	query = mysql.format(query, [req.params.id_almacen]);
	dateGeneratorO.printDelete(query);
	const connection = await mySqlPool.getConnection();
	await connection.query(query);
	connection.release();
	return "OK";
};

router.get('/get', cf(getAlmacenesAsync));
router.post('/create', cf(createAlmacenAsync));
router.put('/update', cf(updateAlmacenAsync));
router.delete('/delete/:id', cf(deleteAlmacenById));

exports.router = router;
