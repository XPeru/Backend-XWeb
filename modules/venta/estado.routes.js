/* global mySqlPool, mysql */

var router = require('express').Router();

router.get('/list', cf(async () => {

	var query = "CALL SP_SEARCH_ALL('ESTADO')";
	var table = [];
	query = mysql.format(query, table);

	var connection = await mySqlPool.getConnection();
	var rows = await connection.query(query);
	var result = {
		Estado: rows[0],
		Error: false,
		Message: 'Success'
	};
	connection.release();
	return result;
}));

router.post('/', cf(async (req) => {

	var query = 'INSERT INTO ' + '\n' +
				'	ESTADO (' + '\n' +
				'		DESCRIPCION' + '\n' +
				'	)' + '\n' +
				'VALUES (' + '\n' +
				'		?' + '\n' +
				'	)';
	var table = [req.body.DESCRIPCION];
	query = mysql.format(query, table);

	var connection = await mySqlPool.getConnection();
	await connection.query(query);
	var result = {
		Error: false,
		Message: 'Categoria Added !'
	};
	connection.release();
	return result;
}));

router.put('/', cf(async (req) => {

	var query = 'UPDATE' + '\n' +
				'	ESTADO ' + '\n' +
				'SET ' + '\n' +
				'	DESCRIPCION = ? ' + '\n' +
				'WHERE' + '\n' +
				'	ID_ESTADO = ?';
	var table = [req.body.DESCRIPCION,
		req.body.ID_ESTADO];
	query = mysql.format(query, table);

	var connection = await mySqlPool.getConnection();
	await connection.query(query);
	var result = {
		Error: false,
		Message: 'Categoria detalle updated !'
	};
	connection.release();
	return result;
}));

router.delete('/:id_estado', cf(async (req) => {

	var query = 'DELETE FROM ' + '\n' +
				'	ESTADO ' + '\n' +
				'WHERE ' + '\n' +
				'	ID_ESTADO = ?';
	var table = [req.params.id_estado];
	query = mysql.format(query, table);

	var connection = await mySqlPool.getConnection();
	await connection.query(query);
	var result = {
		Error: false,
		Message: 'Categoria deleted: ' + req.params.id_estado
	};
	connection.release();
	return result;
}));

exports.router = router;
