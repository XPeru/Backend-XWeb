/* global mySqlPool, mysql, cf */

var router = require('express').Router();

router.get('/list', cf(async () => {
	var query = "CALL SP_SEARCH_ALL('TIPO_PERSONA')";
	var table = [];
	query = mysql.format(query, table);
	var connection = await mySqlPool.getConnection();
	var rows = await connection.query(query);
	var result = {
		TipoPersona: rows[0]
	};
	connection.release();
	return result;
}));

router.get('/:desc', cf(async (req) => {

	var query = "CALL SP_SEARCH_STRING('TIPO_PERSONA','DESCRIPCION',?)";
	var table = [req.params.desc];
	query = mysql.format(query, table);

	var connection = await mySqlPool.getConnection();
	var rows = await connection.query(query);
	var result = {
		TipoPersona: rows[0]
	};
	connection.release();
	return result;
}));

router.post('/', cf(async (req) => {

	var query = 'INSERT INTO ' + '\n' +
				'	TIPO_PERSONA (' + '\n' +
				'		DESCRIPCION' + '\n' +
				'	)' + '\n' +
				'VALUES (' + '\n' +
				'	?' + '\n' +
				')';
	var table = [req.body.DESCRIPCION];
	query = mysql.format(query, table);

	var connection = await mySqlPool.getConnection();
	await connection.query(query);
	var result = {
		Message: 'OK'
	};
	connection.release();
	return result;
}));

router.put('/', cf(async (req) => {

	var query = 'UPDATE' + '\n' +
				'	TIPO_PERSONA ' + '\n' +
				'SET' + '\n' +
				'	DESCRIPCION = ? ' + '\n' +
				'WHERE ' + '\n' +
				'	ID_TIPO_PERSONA = ?';
	var table = [req.body.DESCRIPCION,
		req.body.ID_TIPO_PERSONA];
	query = mysql.format(query, table);

	var connection = await mySqlPool.getConnection();
	await connection.query(query);
	var result = {
		Message: 'OK'
	};
	connection.release();
	return result;
}));

router.delete('/:id_tipopersona', cf(async (req) => {

	var query = 'DELETE FROM' + '\n' +
				'	TIPO_PERSONA' + '\n' +
				'WHERE ' + '\n' +
				'	ID_TIPO_PERSONA = ?';
	var table = [req.params.id_tipopersona];
	query = mysql.format(query, table);

	var connection = await mySqlPool.getConnection();
	await connection.query(query);
	var result = {
		Message: 'OK'
	};
	connection.release();
	return result;
}));

exports.router = router;
