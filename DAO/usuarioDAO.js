const dateGenerator = require("./dateGenerator.js");
const dateGeneratorO = new dateGenerator("usuarioDAO");
const fileOperations = require("../utils/fileOperations.js");
// For hash encryption, used for passwords
const md5 = require('MD5');
const router = require("express").Router();

const createUsuarioAsync = async (req) => {

	const usuario = {
			nombre: req.body.NOMBRE,
			apellidos: req.body.APELLIDOS,
			// password encryptation should be done twice, at front and backend -> TODO
			password: md5(req.body.PASSWORD),
			fk_tipo_usuario: req.body.FK_TIPO_USUARIO,
			imagen: req.body.FOTO
	};
	const query = sqlTools.insertIntoQuery('usuario', [usuario]);
	dateGeneratorO.printInsert(query);
	const connection = await mySqlPool.getConnection();
	await connection.query(query);
	connection.release();
	return "OK";
}

// this should prevent SQL injection
const getArguments = (req) => {
	const queryParams = req.query;
    const filter = queryParams.filter || '';
    const sortOrder = queryParams.sortOrder;
    const pageNumber = parseInt(queryParams.pageNumber) || 0;
    const pageSize = parseInt(queryParams.pageSize);
	const orderBy = queryParams.active || 'ID_USUARIO';
	return { filter, sortOrder, pageNumber, pageSize, orderBy };
};

const getUsuariosAsync = async (req) => {
	const connection = await mySqlPool.getConnection();
	const { filter, sortOrder, pageNumber, pageSize, orderBy } = getArguments(req);

	const query = "SELECT " + "\n" +
				"	us.ID_USUARIO, " + "\n" +
				"	us.NOMBRE, " + "\n" +
				"	us.APELLIDOS, " + "\n" +
				"	us.EMAIL, " + "\n" +
				"	us.IMAGEN, " + "\n" +
				"	us.FK_TIPO_USUARIO, " + "\n" +
				"	us.CREATE_TIME, " + "\n" +
				"	us.UPDATE_TIME, " + "\n" +
				"	us.IS_ACTIVE, " + "\n" +
				"	tipo.TIPO" + "\n" +
				"FROM" + "\n" +
				"	USUARIO us" + "\n" +
				"INNER JOIN" + "\n" +
				"	TIPO_USUARIO tipo ON" + "\n" +
				"		tipo.ID_TIPO_USUARIO = us.FK_TIPO_USUARIO" + "\n" +
				(filter ? " WHERE us.NOMBRE LIKE '%" + filter + "%'" : "") + "\n" +
				" ORDER BY " + orderBy + " " + sortOrder;

	dateGeneratorO.printSelect(query);
	const rows = await connection.query(query);
	connection.release();
	const initialPos = pageNumber * pageSize;
    return rows.slice(initialPos, initialPos + pageSize);
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
	const query = "SELECT COUNT(*) AS countUsuarios FROM usuario " + (req.query.filter ? " WHERE nombre LIKE '%" + req.query.filter + "%'" : "");
	const rows = await connection.query(query);
	connection.release();
	return rows[0].countUsuarios;
};

const updateUsuarioAsync = async (req) => {
	let query = "UPDATE " + "\n" +
				"	USUARIO" + "\n" +
				"SET" + "\n" +
				"	PASSWORD = ?, " + "\n" +
				"	FK_TIPO_USUARIO = ?, " + "\n" +
				"	IMAGEN = ?, " + "\n" +
				"	UPDATE_TIME = CURRENT_TIMESTAMP" + "\n" +
				"WHERE" + "\n" +
				"	ID_USUARIO = ?";
	const table = [md5(req.body.PASSWORD),
				req.body.FK_TIPO_USUARIO,
				req.body.FOTO,
				req.body.ID_USUARIO];
	query = mysql.format(query, table);
	dateGeneratorO.printUpdate(query);
	const connection = await mySqlPool.getConnection();
	await connection.query(query);
	connection.release();
	return "OK";
};

const uploadUsuarioImageAsync = async (req) => {
	const pathFromFrontend = "/usuario-imagen/";
    const pathFromBackend = "./public/medias/usuario/";
    const data = {
        //this path has to exist before running the server
        path: pathFromBackend,
        end_name: '-' + Date.now() + '.jpg',
        //this must be the same in Service Angular
        base_name: "usuario"
      };
    const nameFile = await fileOperations.uploadFileAsync(req, res, data);
    return pathFromFrontend + nameFile;
};

const desactivateUsuarioAsync = async (req) => {
	let query = "UPDATE" + "\n" +
				"	USUARIO" + "\n" +
				"SET" + "\n" +
				"	IS_ACTIVE = ?," + "\n" +
				"	UPDATE_TIME = CURRENT_TIMESTAMP" + "\n" +
				"WHERE" + "\n" +
				"	ID_USUARIO = ?";

	const table = [false, req.body.ID_USUARIO];
	query = mysql.format(query, table);
	dateGeneratorO.printUpdate(query);
	const connection = await mySqlPool.getConnection();
	await connection.query(query);
	connection.release();
	return "OK";
}



router.get("/authentication/:usuario_email/:usuario_password", cf(async(req) => {
	dateGeneratorO.printSelect("/authentication/:usuario_email/:usuario_password");
	var query = "SELECT " + "\n" +
				"	* " + "\n" +
				"FROM " + "\n" +
				"	USUARIO " + "\n" +
				"WHERE " + "\n" +
				"	EMAIL=? " + "\n" +
				"AND " + "\n" +
				"	PASSWORD=?";
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
