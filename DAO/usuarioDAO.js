const dateGenerator = require('./dateGenerator.js');
const dateGeneratorO = new dateGenerator('usuarioDAO');
const fileOperations = require('../utils/fileOperations.js');
// For hash encryption, used for passwords
const md5 = require('MD5');
const router = require('express').Router();

const createUsuarioAsync = async (req) => {

	const usuario = {
		nombre: req.body.NOMBRE,
		apellidos: req.body.APELLIDOS,
		// password encryptation should be done twice, at front and backend -> TODO
		password: md5(req.body.PASSWORD),
		fk_tipo_usuario: req.body.FK_TIPO_USUARIO,
		imagen: req.body.FOTO
	};
	const query = sqlTools.insertIntoQuery('USUARIO', [usuario]);
	dateGeneratorO.printInsert(query);
	const connection = await mySqlPool.getConnection();
	await connection.query(query);
	connection.release();
	return 'OK';
};

// this should prevent SQL injection
const getArguments = (req) => {
	const queryParams = req.query;
	const filter = queryParams.filter || '';
	const sortOrder = queryParams.sortOrder;
	const pageSize = parseInt(queryParams.pageSize, 10) || 0;
	const initialPos = (parseInt(queryParams.pageNumber, 10) || 0) * pageSize;
	const orderBy = queryParams.active || 'ID_USUARIO';
	return { filter, sortOrder, initialPos, pageSize, orderBy };
};

const getUsuariosAsync = async (req) => {
	const connection = await mySqlPool.getConnection();
	const { filter, sortOrder, initialPos, pageSize, orderBy } = getArguments(req);
	const query = 'SELECT * FROM ' +
					'(SELECT ' +
					'	us.ID_USUARIO, ' +
					'	us.NOMBRE, ' +
					'	us.APELLIDOS, ' +
					'	us.EMAIL, ' +
					'	us.IMAGEN, ' +
					'	us.FK_TIPO_USUARIO, ' +
					'	us.CREATE_TIME, ' +
					'	us.UPDATE_TIME, ' +
					'	us.IS_ACTIVE, ' +
					'	tipo.TIPO' +
					' FROM' +
					'	USUARIO us ' +
					' INNER JOIN ' +
					'	TIPO_USUARIO tipo ON ' +
					'		tipo.ID_TIPO_USUARIO = us.FK_TIPO_USUARIO ' +
					(filter ? " WHERE us.NOMBRE LIKE '%" + filter + "%'" : '') +
					') t ORDER BY t.' + orderBy +
					' ' + sortOrder +
					'  LIMIT ' + initialPos + ', ' + pageSize;

	dateGeneratorO.printSelect(query);
	const rows = await connection.query(query);
	connection.release();
	return rows;
};

const getUsuarioByIdAsync = async (req) => {
	let query = "CALL SP_SEARCH('USUARIO','ID_USUARIO',?)";
	query = mysql.format(query, [req.params.id_usuario]);
	dateGeneratorO.printSelect(query);
	const connection = await mySqlPool.getConnection();
	const rows = await connection.query(query);
	connection.release();
	return rows[0];
};

const countUsuariosAsync = async (req) => {
	const connection = await mySqlPool.getConnection();
	const query = 'SELECT COUNT(*) AS countUsuarios FROM USUARIO ' + (req.query.filter ? " WHERE nombre LIKE '%" + req.query.filter + "%'" : '');
	const rows = await connection.query(query);
	connection.release();
	return rows[0].countUsuarios;
};

const updateUsuarioAsync = async (req) => {
	req.body.UPDATE_TIME = 'CURRENT_TIMESTAMP';
	req.body.PASSWORD = md5(req.body.PASSWORD);
	const columns = ['PASSWORD', 'FK_TIPO_USUARIO', 'IMAGEN', 'UPDATE_TIME'];
	const connection = await mySqlPool.getConnection();
	await connection.query(sqlTools.updateQuery('USUARIO', columns, req.body));
	connection.release();
	return 'OK';
};

const uploadUsuarioImageAsync = async (req, res) => {
	const pathFromFrontend = '/usuario-imagen/';
	const pathFromBackend = './public/medias/usuario/';
	const data = {
		//this path has to exist before running the server
		path: pathFromBackend,
		end_name: '-' + Date.now() + '.jpg',
		//this must be the same in Service Angular
		base_name: 'usuario'
	};
	const nameFile = await fileOperations.uploadFileAsync(req, res, data);
	return pathFromFrontend + nameFile;
};

const desactivateUsuarioAsync = async (req) => {
	let query = 'UPDATE' + '\n' +
				'	USUARIO' + '\n' +
				'SET' + '\n' +
				'	IS_ACTIVE = ?,' + '\n' +
				'	UPDATE_TIME = CURRENT_TIMESTAMP' + '\n' +
				'WHERE' + '\n' +
				'	ID_USUARIO = ?';

	const table = [false, req.body.ID_USUARIO];
	query = mysql.format(query, table);
	dateGeneratorO.printUpdate(query);
	const connection = await mySqlPool.getConnection();
	await connection.query(query);
	connection.release();
	return 'OK';
};


router.get('/authentication/:usuario_email/:usuario_password', cf(async (req) => {
	dateGeneratorO.printSelect('/authentication/:usuario_email/:usuario_password');
	var query = 'SELECT ' + '\n' +
				'	* ' + '\n' +
				'FROM ' + '\n' +
				'	USUARIO ' + '\n' +
				'WHERE ' + '\n' +
				'	EMAIL=? ' + '\n' +
				'AND ' + '\n' +
				'	PASSWORD=?';
	var table = [req.params.usuario_email,
		md5(req.params.usuario_password)];
	query = mysql.format(query, table);
	dateGeneratorO.printSelect(query);
	var connection = await mySqlPool.getConnection();
	var rows = await connection.query(query);
	var result = {
		Users: rows
	};
	connection.release();
	return result;
}));

router.post('/create', cf(createUsuarioAsync));
router.post('/image', cf(uploadUsuarioImageAsync));
router.put('/update', cf(updateUsuarioAsync));
router.put('/desactive', cf(desactivateUsuarioAsync));
router.get('/count', cf(countUsuariosAsync));
router.get('/get', cf(getUsuariosAsync));
router.get('/get/:id', cf(getUsuarioByIdAsync));
//router.get('/getActive', cf(getActiveUsuariosAsync));

exports.router = router;
