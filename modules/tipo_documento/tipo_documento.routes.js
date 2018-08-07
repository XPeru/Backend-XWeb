/* global mySqlPool, mysql */
var router = require('express').Router();

router.get('/list', cf(async () => {
	var query = "CALL SP_SEARCH_ALL('TIPO_DOCUMENTO')";
	var table = [];
	query = mysql.format(query, table);
	var connection = await mySqlPool.getConnection();
	var rows = await connection.query(query);
	var result = {
		TipoDocumento: rows[0]
	};
	connection.release();
	return result;
}));

router.post('/', cf(async (req) => {
	var query = 'INSERT INTO ' + '\n' +
				'	TIPO_DOCUMENTO (' + '\n' +
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
				'	TIPO_DOCUMENTO ' + '\n' +
				'SET' + '\n' +
				'	DESCRIPCION = ? ' + '\n' +
				'WHERE ' + '\n' +
				'	ID_TIPO_DOCUMENTO = ?';
	var table = [req.body.DESCRIPCION,
		req.body.ID_TIPO_DOCUMENTO];
	query = mysql.format(query, table);
	var connection = await mySqlPool.getConnection();
	await connection.query(query);
	var result = {
		Message: 'OK'
	};
	connection.release();
	return result;
}));

router.delete('/:id_tipodocumento', cf(async (req) => {
	var query = 'DELETE FROM' + '\n' +
				'	TIPO_DOCUMENTO' + '\n' +
				'WHERE ' + '\n' +
				'	ID_TIPO_DOCUMENTO = ?';
	var table = [req.params.id_tipodocumento];
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
