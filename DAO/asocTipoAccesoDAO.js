const dateGenerator = require('./dateGenerator.js');
const dateGeneratorO = new dateGenerator('asoctipoaccesoDAO');
const router = require('express').Router();

const getAsocTipoAccesoAsync = async (req) => {
	let query = 'SELECT ' + '\n' +
				'	acc.ID_ACCESO_USUARIO, ' + '\n' +
				'	acc.DESCRIPCION' + '\n' +
				'FROM ' + '\n' +
				'	ASOC_TIPO_ACCESO asso ' + '\n' +
				'INNER JOIN ACCESO_USUARIO acc ON ' + '\n' +
				'	acc.ID_ACCESO_USUARIO = asso.FK_ACCESO_USUARIO' + '\n' +
				'WHERE' + '\n' +
				'	asso.FK_TIPO_USUARIO = ?';
	query = mysql.format(query, [req.params.id_tipo_usuario]);
	dateGeneratorO.printSelect(query);
	const connection = await mySqlPool.getConnection();
	const rows = await connection.query(query);
	connection.release();
	return rows;
};

const createAsocTipoAccesoAsync = async (req) => {
	let query = 'INSERT INTO ' + '\n' +
				'	ASOC_TIPO_ACCESO (' + '\n' +
				'		FK_TIPO_USUARIO, ' + '\n' +
				'		FK_ACCESO_USUARIO, ' + '\n' +
				'		IS_ACTIVE' + '\n' +
				'	) VALUES';
	const idTipoUsuario = req.body.ID_TIPO_USUARIO;
	const end_query = '\n' + ' (?, ?, ?)';
	const table = req.body.LIST.reduce(function (tabla, record) {
		query = query + end_query + ',';
		tabla.push(idTipoUsuario, record.ID_ACCESO_USUARIO, 1);
		return tabla;
	}, []);
	query = mysql.format(query.slice(0, -1), table);
	dateGeneratorO.printInsert(query);
	const connection = await mySqlPool.getConnection();
	await connection.query(query);
	connection.release();
	return 'OK';
};

const deleteAsocTipoAccesoAsync = async (req) => {
	let query = 'DELETE FROM' + '\n' +
				'	ASOC_TIPO_ACCESO' + '\n' +
				'WHERE ' + '\n' +
				'	FK_TIPO_USUARIO = ?';
	query = mysql.format(query, [req.params.id_tipo_usuario]);
	dateGeneratorO.printDelete(query);
	const connection = await mySqlPool.getConnection();
	await connection.query(query);
	connection.release();
	return 'OK';
};

router.get('/get', cf(getAsocTipoAccesoAsync));
router.post('/create', cf(createAsocTipoAccesoAsync));
router.delete('/delete/:id', cf(deleteAsocTipoAccesoAsync));

exports.router = router;
